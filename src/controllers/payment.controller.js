const crypto = require("crypto");

const {
  createPendingRegistration,
  updateRegistration,
} = require("../services/firestore.service");

const {
  initializeTransaction,
  verifyTransaction,
} = require("../services/paystack.service");

const {
  sendRegistrationConfirmation,
  sendAdminRegistrationNotification,
} = require("../services/email.service");

const { getRegistrationFee } = require("../config/registrationFees");

const { db } = require("../config/firebase");

const ALLOWED_TYPES = [
  "farmer",
  "cooperative-new",
  "cooperative-old",
  "partner",
  "investor",
  "sponsor",
];

/**
 * Start registration payment
 */
const startRegistrationPayment = async (req, res) => {
  try {
    const { type, ...formData } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Registration type is required",
      });
    }

    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration type",
      });
    }

    if (!formData.email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const fee = getRegistrationFee(type);

    if (!fee) {
      return res.status(400).json({
        success: false,
        message: "Registration fee is not configured",
      });
    }

    const registrationReference = `ATH-${type}-${crypto
      .randomBytes(8)
      .toString("hex")
      .toUpperCase()}`;

    const registration = await createPendingRegistration({
      type,
      ...formData,

      registrationReference,

      payment: {
        amount: fee,
        currency: "NGN",
        status: "unpaid",
        reference: null,
        transactionId: null,
      },
    });

    const amountInKobo = Math.round(fee * 100);

    let payment;

    try {
      payment = await initializeTransaction({
        email: formData.email,
        amount: amountInKobo,
        reference: registrationReference,

        metadata: {
          registrationId: registration.id,
          registrationType: type,
        },

        callbackUrl: process.env.PAYSTACK_CALLBACK_URL,
      });
    } catch (error) {
      console.error(
        "Paystack initialization error:",
        error.response?.data || error.message
      );

      await updateRegistration(registration.id, {
        status: "payment_initialization_failed",
        paymentStatus: "failed",
      });

      return res.status(500).json({
        success: false,
        message: "Could not initialize payment",
      });
    }

    if (!payment.status || !payment.data) {
      await updateRegistration(registration.id, {
        status: "payment_initialization_failed",
        paymentStatus: "failed",
      });

      return res.status(400).json({
        success: false,
        message: payment.message || "Could not initialize payment",
      });
    }

    await updateRegistration(registration.id, {
      payment: {
        amount: fee,
        currency: "NGN",
        status: "pending",
        reference: payment.data.reference,
        transactionId: null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Registration created. Proceed to payment.",
      registrationId: registration.id,
      authorizationUrl: payment.data.authorization_url,
    });
  } catch (error) {
    console.error(
      "Registration payment error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Could not start registration payment",
    });
  }
};

/**
 * Find registration by Paystack reference
 */
const findRegistrationByReference = async (reference) => {
  const snapshot = await db
    .collection("registrations")
    .where("registrationReference", "==", reference)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    data: doc.data(),
  };
};

/**
 * Finalize a successful Paystack payment
 *
 * This is shared by:
 * - Paystack webhook
 * - Paystack callback
 */
const finalizeSuccessfulPayment = async (transaction) => {
  const reference = transaction.reference;

  if (!reference) {
    throw new Error("Payment reference is missing");
  }

  const registrationRecord =
    await findRegistrationByReference(reference);

  if (!registrationRecord) {
    throw new Error(
      `Registration not found for payment reference: ${reference}`
    );
  }

  const registrationId = registrationRecord.id;
  const registration = registrationRecord.data;

  /**
   * Prevent duplicate processing.
   *
   * Paystack can send the same webhook more than once,
   * and the user can also return through the callback.
   */
  if (
    registration.paymentStatus === "paid" ||
    registration.status === "submitted"
  ) {
    return {
      alreadyProcessed: true,
      registrationId,
      registration,
    };
  }

  if (transaction.status !== "success") {
    await updateRegistration(registrationId, {
      status: "payment_failed",
      paymentStatus: "failed",

      payment: {
        ...registration.payment,

        amount: Number(transaction.amount || 0) / 100,
        currency: transaction.currency || "NGN",
        status: "failed",
        reference,
        transactionId: transaction.id || null,
      },
    });

    return {
      alreadyProcessed: false,
      successful: false,
      registrationId,
    };
  }

  const expectedAmount =
    Number(registration.payment?.amount || 0) * 100;

  const paidAmount = Number(transaction.amount);

  /**
   * Never mark a registration as paid if
   * the amount does not match our expected fee.
   */
  if (paidAmount !== expectedAmount) {
    console.error("Payment amount mismatch:", {
      reference,
      expectedAmount,
      paidAmount,
    });

    await updateRegistration(registrationId, {
      status: "payment_amount_mismatch",
      paymentStatus: "failed",

      payment: {
        ...registration.payment,

        amount: paidAmount / 100,
        currency: transaction.currency || "NGN",
        status: "failed",
        reference,
        transactionId: transaction.id || null,
        paidAmount: paidAmount / 100,
      },
    });

    return {
      alreadyProcessed: false,
      successful: false,
      amountMismatch: true,
      registrationId,
    };
  }

  /**
   * Mark registration as successfully submitted.
   */
  await updateRegistration(registrationId, {
    status: "submitted",
    paymentStatus: "paid",

    payment: {
      amount: paidAmount / 100,
      currency: transaction.currency || "NGN",
      status: "paid",
      reference,
      transactionId: transaction.id || null,
      paidAt: new Date(),
    },
  });

  const applicantName =
    registration.name ||
    registration["contact-name"] ||
    registration.contactName ||
    registration.fullName ||
    "Applicant";

 const emailResults = await Promise.allSettled([
  sendRegistrationConfirmation({
    applicantEmail: registration.email,
    applicantName,
    registrationType: registration.type,
    reference,
    amount: paidAmount / 100,
  }),

  sendAdminRegistrationNotification({
    applicantEmail: registration.email,
    applicantName,
    registrationType: registration.type,
    reference,
    amount: paidAmount / 100,
    registrationId,
  }),
]);

emailResults.forEach((result, index) => {
  if (result.status === "rejected") {
    console.error(
      index === 0
        ? "Applicant confirmation email failed:"
        : "Admin notification email failed:",
      result.reason?.message || result.reason
    );
  }
});
  return {
    alreadyProcessed: false,
    successful: true,
    registrationId,
  };
};

/**
 * Paystack callback
 *
 * This handles the user's browser returning from Paystack.
 */
const handlePaystackCallback = async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/membership.html?payment=failed`
      );
    }

    const result = await verifyTransaction(reference);

    if (!result.status || !result.data) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/membership.html?payment=failed`
      );
    }

    const resultData = await finalizeSuccessfulPayment(
      result.data
    );

    if (
      resultData.successful ||
      resultData.alreadyProcessed
    ) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/membership.html?payment=success&registration=${resultData.registrationId}`
      );
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/membership.html?payment=failed`
    );
  } catch (error) {
    console.error(
      "Paystack callback error:",
      error.response?.data || error.message
    );

    return res.redirect(
      `${process.env.FRONTEND_URL}/membership.html?payment=failed`
    );
  }
};

/**
 * Paystack webhook
 *
 * Paystack sends successful payment events here.
 */
const handlePaystackWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];

    if (!signature) {
      console.error("Missing Paystack webhook signature");

      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const secret =
      process.env.PAYSTACK_WEBHOOK_SECRET ||
      process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      console.error(
        "Paystack webhook secret is not configured"
      );

      return res.status(500).json({
        success: false,
        message: "Webhook configuration error",
      });
    }

    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(hash),
        Buffer.from(signature)
      )
    ) {
      console.error(
        "Invalid Paystack webhook signature"
      );

      return res.status(401).json({
        success: false,
        message: "Invalid signature",
      });
    }

    const event = req.body;

    console.log(
      "Paystack webhook received:",
      event.event
    );

    /**
     * We only need successful transaction events.
     */
    if (event.event !== "charge.success") {
      return res.status(200).json({
        success: true,
        message: "Event received",
      });
    }

    const transaction = event.data;

    if (!transaction) {
      return res.status(400).json({
        success: false,
        message: "Transaction data missing",
      });
    }

    /**
     * Finalize the payment.
     *
     * This function is idempotent, so duplicate
     * Paystack events will not send duplicate emails.
     */
    await finalizeSuccessfulPayment(transaction);

    /**
     * Paystack expects a successful 2xx response.
     */
    return res.status(200).json({
      success: true,
      message: "Webhook processed",
    });
  } catch (error) {
    console.error(
      "Paystack webhook error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};

module.exports = {
  startRegistrationPayment,
  handlePaystackCallback,
  handlePaystackWebhook,
};