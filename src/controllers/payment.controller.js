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
  generateMembershipDocuments,
  generateMembershipId,
  generateCertificateNumber,
} = require("../services/document.service");

const {
  getRegistrationFee,
} = require("../config/registrationFees");

const { db } = require("../config/firebase");

const FRONTEND_URL = (
  process.env.FRONTEND_URL ||
  "http://localhost:5500"
).replace(/\/+$/, "");

/*
 * Only registration types that are
 * currently enabled for online payment.
 */
const ALLOWED_TYPES = [
  "farmer",
  "cooperative-new",
  "cooperative-old",
  "partner",
  "investor",
];

/*
 * How long a document-generation lock
 * is considered active.
 *
 * This prevents the Paystack callback and
 * webhook from generating the same documents
 * simultaneously.
 */
const DOCUMENT_LOCK_TIMEOUT_MS =
  10 * 60 * 1000;

/**
 * Start registration payment.
 */
const startRegistrationPayment = async (
  req,
  res
) => {
  try {
    const {
      type,
      ...formData
    } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message:
          "Registration type is required",
      });
    }

    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid registration type",
      });
    }

    if (!formData.email) {
      return res.status(400).json({
        success: false,
        message:
          "Email address is required",
      });
    }

    const fee =
      getRegistrationFee(type);

    if (!fee) {
      return res.status(400).json({
        success: false,
        message:
          "Registration fee is not configured",
      });
    }

    const registrationReference =
      `ATH-${type}-${crypto
        .randomBytes(8)
        .toString("hex")
        .toUpperCase()}`;

    const registration =
      await createPendingRegistration({
        type,
        ...formData,

        registrationReference,

        status: "pending",
        paymentStatus: "unpaid",

        documentStatus:
          "not_generated",

        payment: {
          amount: fee,
          currency: "NGN",
          status: "unpaid",
          reference: null,
          transactionId: null,
        },
      });

    const amountInKobo =
      Math.round(fee * 100);

    let payment;

    try {
      payment =
        await initializeTransaction({
          email: formData.email,
          amount: amountInKobo,
          reference:
            registrationReference,

          metadata: {
            registrationId:
              registration.id,

            registrationType:
              type,
          },

          callbackUrl:
            process.env
              .PAYSTACK_CALLBACK_URL,
        });
    } catch (error) {
      console.error(
        "Paystack initialization error:",
        error.response?.data ||
          error.message
      );

      await updateRegistration(
        registration.id,
        {
          status:
            "payment_initialization_failed",

          paymentStatus:
            "failed",

          documentStatus:
            "not_generated",
        }
      );

      return res.status(500).json({
        success: false,
        message:
          "Could not initialize payment",
      });
    }

    if (
      !payment?.status ||
      !payment?.data
    ) {
      await updateRegistration(
        registration.id,
        {
          status:
            "payment_initialization_failed",

          paymentStatus:
            "failed",
        }
      );

      return res.status(400).json({
        success: false,
        message:
          payment?.message ||
          "Could not initialize payment",
      });
    }

    await updateRegistration(
      registration.id,
      {
        status:
          "payment_pending",

        paymentStatus:
          "pending",

        payment: {
          amount: fee,
          currency: "NGN",
          status: "pending",

          reference:
            payment.data.reference,

          transactionId: null,
        },
      }
    );

    return res.status(201).json({
      success: true,

      message:
        "Registration created. Proceed to payment.",

      registrationId:
        registration.id,

      authorizationUrl:
        payment.data.authorization_url,
    });
  } catch (error) {
    console.error(
      "Registration payment error:",
      error.response?.data ||
        error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Could not start registration payment",
    });
  }
};

/**
 * Find registration by Paystack reference.
 */
const findRegistrationByReference =
  async (reference) => {
    const snapshot =
      await db
        .collection("registrations")
        .where(
          "registrationReference",
          "==",
          reference
        )
        .limit(1)
        .get();

    if (snapshot.empty) {
      return null;
    }

    const doc =
      snapshot.docs[0];

    return {
      id: doc.id,
      data: doc.data(),
    };
  };

/**
 * Find registration by Firestore ID.
 */
const findRegistrationById =
  async (registrationId) => {
    if (!registrationId) {
      return null;
    }

    const doc =
      await db
        .collection("registrations")
        .doc(registrationId)
        .get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      data: doc.data(),
    };
  };

/**
 * Check whether document generation
 * is currently locked by another process.
 */
const isDocumentGenerationLocked =
  (registration) => {
    if (
      registration.documentStatus !==
      "generating"
    ) {
      return false;
    }

    const startedAt =
      registration.documentGenerationStartedAt;

    if (!startedAt) {
      return false;
    }

    let startedDate;

    try {
      if (
        typeof startedAt.toDate ===
        "function"
      ) {
        startedDate =
          startedAt.toDate();
      } else if (
        startedAt instanceof Date
      ) {
        startedDate = startedAt;
      } else if (
        typeof startedAt.seconds ===
        "number"
      ) {
        startedDate = new Date(
          startedAt.seconds * 1000
        );
      } else {
        startedDate =
          new Date(startedAt);
      }
    } catch (_) {
      return false;
    }

    if (
      !startedDate ||
      Number.isNaN(
        startedDate.getTime()
      )
    ) {
      return false;
    }

    return (
      Date.now() -
        startedDate.getTime() <
      DOCUMENT_LOCK_TIMEOUT_MS
    );
  };

/**
 * Reserve permanent membership
 * identifiers before document generation.
 *
 * This is extremely important.
 *
 * If PDF generation fails halfway through,
 * the retry uses the SAME membership ID and
 * SAME certificate number.
 */
const reserveDocumentIdentifiers =
  async (
    registrationId,
    registration
  ) => {
    let membershipId =
      registration.membershipId ||
      null;

    let certificateNumber =
      registration.certificateNumber ||
      null;

    if (!membershipId) {
      membershipId =
        generateMembershipId(
          registration.type
        );
    }

    if (!certificateNumber) {
      certificateNumber =
        generateCertificateNumber();
    }

    await updateRegistration(
      registrationId,
      {
        membershipId,
        certificateNumber,
      }
    );

    return {
      membershipId,
      certificateNumber,
    };
  };

/**
 * Finalize a successful Paystack payment.
 *
 * Shared by:
 * - Paystack webhook
 * - Paystack callback
 *
 * Responsibilities:
 * 1. Validate Paystack result.
 * 2. Validate payment amount.
 * 3. Mark payment as paid.
 * 4. Permanently reserve member identifiers.
 * 5. Generate documents.
 * 6. Save document URLs.
 *
 * Payment and document generation are
 * deliberately treated as separate states.
 */
const finalizeSuccessfulPayment =
  async (transaction) => {
    const reference =
      transaction?.reference;

    if (!reference) {
      throw new Error(
        "Payment reference is missing"
      );
    }

    const registrationRecord =
      await findRegistrationByReference(
        reference
      );

    if (!registrationRecord) {
      throw new Error(
        `Registration not found for payment reference: ${reference}`
      );
    }

    const registrationId =
      registrationRecord.id;

    let registration =
      registrationRecord.data;

    /*
     * Check whether all required documents
     * already exist.
     */
    const hasCertificate =
      Boolean(
        registration.documents
          ?.certificate?.url
      );

    const isFarmer =
      registration.type ===
      "farmer";

    const hasFarmerId =
      Boolean(
        registration.documents
          ?.farmerIdCard?.url
      );

    const documentsAreComplete =
      hasCertificate &&
      (!isFarmer ||
        hasFarmerId);

    /*
     * Fully completed registration.
     */
    if (
      registration.paymentStatus ===
        "paid" &&
      documentsAreComplete
    ) {
      return {
        alreadyProcessed: true,
        successful: true,
        registrationId,

        membershipId:
          registration.membershipId,

        certificateNumber:
          registration.certificateNumber,

        documents:
          registration.documents,
      };
    }

    /*
     * If another callback/webhook is
     * currently generating documents,
     * don't start another generation job.
     */
    if (
      registration.paymentStatus ===
        "paid" &&
      isDocumentGenerationLocked(
        registration
      )
    ) {
      console.log(
        `Document generation already running for registration ${registrationId}`
      );

      return {
        alreadyProcessed: true,
        successful: true,
        documentsPending: true,
        registrationId,

        membershipId:
          registration.membershipId,

        certificateNumber:
          registration.certificateNumber,

        documents:
          registration.documents || {},
      };
    }

    /*
     * The payment itself must be successful.
     */
    if (
      transaction.status !==
      "success"
    ) {
      await updateRegistration(
        registrationId,
        {
          status:
            "payment_failed",

          paymentStatus:
            "failed",

          payment: {
            ...registration.payment,

            amount:
              Number(
                transaction.amount || 0
              ) / 100,

            currency:
              transaction.currency ||
              "NGN",

            status: "failed",

            reference,

            transactionId:
              transaction.id || null,
          },
        }
      );

      return {
        alreadyProcessed: false,
        successful: false,
        registrationId,
      };
    }

    /*
     * Validate exact expected amount.
     */
    const expectedAmount =
      Number(
        registration.payment
          ?.amount || 0
      ) * 100;

    const paidAmount =
      Number(
        transaction.amount
      );

    if (
      !Number.isFinite(
        paidAmount
      ) ||
      paidAmount !==
        expectedAmount
    ) {
      console.error(
        "Payment amount mismatch:",
        {
          reference,
          expectedAmount,
          paidAmount,
        }
      );

      await updateRegistration(
        registrationId,
        {
          status:
            "payment_amount_mismatch",

          paymentStatus:
            "failed",

          payment: {
            ...registration.payment,

            amount:
              paidAmount / 100,

            currency:
              transaction.currency ||
              "NGN",

            status: "failed",

            reference,

            transactionId:
              transaction.id ||
              null,

            paidAmount:
              paidAmount / 100,
          },
        }
      );

      return {
        alreadyProcessed: false,
        successful: false,
        amountMismatch: true,
        registrationId,
      };
    }

    /*
     * Mark payment as paid FIRST.
     *
     * This is permanent business state:
     * the customer has actually paid.
     */
    await updateRegistration(
      registrationId,
      {
        status: "submitted",
        paymentStatus: "paid",

        payment: {
          amount:
            paidAmount / 100,

          currency:
            transaction.currency ||
            "NGN",

          status: "paid",

          reference,

          transactionId:
            transaction.id ||
            null,

          paidAt: new Date(),
        },
      }
    );

    /*
     * Refresh registration after
     * marking payment as paid.
     */
    const refreshed =
      await findRegistrationById(
        registrationId
      );

    if (!refreshed) {
      throw new Error(
        `Registration disappeared after payment: ${registrationId}`
      );
    }

    registration =
      refreshed.data;

    /*
     * Reserve the permanent identifiers.
     *
     * This happens BEFORE generating PDFs.
     */
    const identifiers =
      await reserveDocumentIdentifiers(
        registrationId,
        registration
      );

    /*
     * Mark document generation as active.
     *
     * This protects against callback +
     * webhook running simultaneously.
     */
    await updateRegistration(
      registrationId,
      {
        documentStatus:
          "generating",

        documentGenerationStartedAt:
          new Date(),

        documentError: null,
      }
    );

    /*
     * Generate the documents.
     */
    let documentResult;

    try {
      documentResult =
        await generateMembershipDocuments({
          registration: {
            ...registration,

            id: registrationId,

            membershipId:
              identifiers.membershipId,

            certificateNumber:
              identifiers.certificateNumber,
          },
        });
    } catch (error) {
      console.error(
        "Membership document generation failed:",
        error.message
      );

      /*
       * IMPORTANT:
       *
       * The payment remains PAID.
       *
       * We only record the document
       * generation failure.
       */
      await updateRegistration(
        registrationId,
        {
          paymentStatus: "paid",

          status:
            "document_generation_failed",

          documentStatus:
            "generation_failed",

          documentError:
            error.message,

          documentGenerationFailedAt:
            new Date(),
        }
      );

      /*
       * Return a successful payment state
       * instead of pretending the payment failed.
       */
      return {
        alreadyProcessed: false,
        successful: true,
        documentsPending: true,

        registrationId,

        membershipId:
          identifiers.membershipId,

        certificateNumber:
          identifiers.certificateNumber,

        documents:
          registration.documents ||
          {},
      };
    }

    /*
     * Save generated documents.
     */
    await updateRegistration(
      registrationId,
      {
        paymentStatus: "paid",

        status: "completed",

        membershipId:
          identifiers.membershipId,

        certificateNumber:
          identifiers.certificateNumber,

        documents:
          documentResult.documents,

        documentStatus:
          "generated",

        documentError: null,

        documentGenerationStartedAt:
          null,

        documentsGeneratedAt:
          new Date(),
      }
    );

    return {
      alreadyProcessed: false,
      successful: true,
      documentsPending: false,

      registrationId,

      membershipId:
        identifiers.membershipId,

      certificateNumber:
        identifiers.certificateNumber,

      documents:
        documentResult.documents,
    };
  };

/**
 * Get registration documents.
 *
 * Used by membership-success.html.
 */
const getRegistrationDocuments =
  async (req, res) => {
    try {
      const {
        registrationId,
      } = req.params;

      if (!registrationId) {
        return res.status(400).json({
          success: false,
          message:
            "Registration ID is required",
        });
      }

      const registrationRecord =
        await findRegistrationById(
          registrationId
        );

      if (!registrationRecord) {
        return res.status(404).json({
          success: false,
          message:
            "Registration not found",
        });
      }

      const registration =
        registrationRecord.data;

      /*
       * Never expose documents before
       * payment.
       */
      if (
        registration.paymentStatus !==
        "paid"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Registration payment has not been completed",
        });
      }

      const documents =
        registration.documents || {};

      /*
       * Payment succeeded but documents
       * are still being generated.
       */
      if (
        registration.documentStatus !==
          "generated" ||
        !documents.certificate?.url
      ) {
        return res.status(202).json({
          success: true,

          documentsReady: false,

          message:
            "Payment was successful. Your membership documents are still being prepared.",

          registration: {
            id:
              registrationRecord.id,

            name:
              registration.name ||
              registration[
                "contact-name"
              ] ||
              registration.contactName ||
              registration.fullName ||
              registration[
                "full-name"
              ] ||
              registration.org ||
              registration.organizationName ||
              "Member",

            type:
              registration.type,

            membershipId:
              registration.membershipId ||
              null,

            certificateNumber:
              registration.certificateNumber ||
              null,

            documents: {
              certificate: null,
              farmerIdCard: null,
            },
          },
        });
      }

      return res.status(200).json({
        success: true,

        documentsReady: true,

        registration: {
          id:
            registrationRecord.id,

          name:
            registration.name ||
            registration[
              "contact-name"
            ] ||
            registration.contactName ||
            registration.fullName ||
            registration[
              "full-name"
            ] ||
            registration.org ||
            registration.organizationName ||
            "Member",

          type:
            registration.type,

          membershipId:
            registration.membershipId ||
            null,

          certificateNumber:
            registration.certificateNumber ||
            null,

          documents: {
            certificate:
              registration.documents
                ?.certificate ||
              null,

            farmerIdCard:
              registration.documents
                ?.farmerIdCard ||
              null,
          },
        },
      });
    } catch (error) {
      console.error(
        "Get registration documents error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Could not load registration documents",
      });
    }
  };

/**
 * Paystack callback.
 *
 * This is the user's browser returning
 * from Paystack.
 */
const handlePaystackCallback =
  async (req, res) => {
    try {
      const {
        reference,
        trxref,
      } = req.query;

      const paymentReference =
        reference || trxref;

      console.log(
        "Paystack callback received:",
        paymentReference
      );

      if (!paymentReference) {
        return res.redirect(
          `${FRONTEND_URL}/membership-success.html?payment=failed`
        );
      }

      /*
       * Verify directly with Paystack.
       */
      const result =
        await verifyTransaction(
          paymentReference
        );

      if (
        !result?.status ||
        !result?.data
      ) {
        console.error(
          "Paystack verification failed:",
          result?.message
        );

        return res.redirect(
          `${FRONTEND_URL}/membership-success.html?payment=failed`
        );
      }

      /*
       * Finalize.
       */
      const resultData =
        await finalizeSuccessfulPayment(
          result.data
        );

      if (
        resultData?.successful ||
        resultData?.alreadyProcessed
      ) {
        const registrationId =
          resultData.registrationId;

        if (!registrationId) {
          console.error(
            "Payment succeeded but registration ID is missing."
          );

          return res.redirect(
            `${FRONTEND_URL}/membership-success.html?payment=failed`
          );
        }

        /*
         * IMPORTANT:
         *
         * Payment is successful even if
         * document generation is pending.
         */
        const documentsPending =
          resultData.documentsPending
            ? "&documents=pending"
            : "";

        return res.redirect(
          `${FRONTEND_URL}/membership-success.html?payment=success&registration=${encodeURIComponent(
            registrationId
          )}${documentsPending}`
        );
      }

      /*
       * Payment was verified but failed.
       */
      return res.redirect(
        `${FRONTEND_URL}/membership-success.html?payment=failed`
      );
    } catch (error) {
      console.error(
        "Paystack callback error:",
        error.response?.data ||
          error.message ||
          error
      );

      /*
       * If this is a document-generation
       * error AFTER payment, do not tell the
       * customer their payment failed.
       *
       * Try to recover the registration from
       * the Paystack reference.
       */
      try {
        const {
          reference,
          trxref,
        } = req.query;

        const paymentReference =
          reference || trxref;

        if (paymentReference) {
          const registrationRecord =
            await findRegistrationByReference(
              paymentReference
            );

          if (
            registrationRecord &&
            registrationRecord.data
              .paymentStatus === "paid"
          ) {
            return res.redirect(
              `${FRONTEND_URL}/membership-success.html?payment=success&registration=${encodeURIComponent(
                registrationRecord.id
              )}&documents=pending`
            );
          }
        }
      } catch (recoveryError) {
        console.error(
          "Callback recovery error:",
          recoveryError.message
        );
      }

      return res.redirect(
        `${FRONTEND_URL}/membership-success.html?payment=failed`
      );
    }
  };

/**
 * Paystack webhook.
 */
const handlePaystackWebhook =
  async (req, res) => {
    try {
      const signature =
        req.headers[
          "x-paystack-signature"
        ];

      if (!signature) {
        console.error(
          "Missing Paystack webhook signature"
        );

        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const secret =
        process.env
          .PAYSTACK_WEBHOOK_SECRET ||
        process.env
          .PAYSTACK_SECRET_KEY;

      if (!secret) {
        console.error(
          "Paystack webhook secret is not configured"
        );

        return res.status(500).json({
          success: false,
          message:
            "Webhook configuration error",
        });
      }

      const hash =
        crypto
          .createHmac(
            "sha512",
            secret
          )
          .update(
            JSON.stringify(req.body)
          )
          .digest("hex");

      const hashBuffer =
        Buffer.from(
          hash,
          "utf8"
        );

      const signatureBuffer =
        Buffer.from(
          signature,
          "utf8"
        );

      if (
        hashBuffer.length !==
          signatureBuffer.length ||
        !crypto.timingSafeEqual(
          hashBuffer,
          signatureBuffer
        )
      ) {
        console.error(
          "Invalid Paystack webhook signature"
        );

        return res.status(401).json({
          success: false,
          message:
            "Invalid signature",
        });
      }

      const event = req.body;

      console.log(
        "Paystack webhook received:",
        event.event
      );

      /*
       * Only successful charge events
       * need processing.
       */
      if (
        event.event !==
        "charge.success"
      ) {
        return res.status(200).json({
          success: true,
          message:
            "Event received",
        });
      }

      const transaction =
        event.data;

      if (!transaction) {
        return res.status(400).json({
          success: false,
          message:
            "Transaction data missing",
        });
      }

      /*
       * Finalize payment.
       *
       * This is idempotent.
       */
      await finalizeSuccessfulPayment(
        transaction
      );

      /*
       * Always acknowledge a valid
       * Paystack event.
       */
      return res.status(200).json({
        success: true,
        message:
          "Webhook processed",
      });
    } catch (error) {
      console.error(
        "Paystack webhook error:",
        error.response?.data ||
          error.message ||
          error
      );

      /*
       * We return 200 for a verified Paystack
       * event even when document generation
       * encounters a temporary external issue.
       *
       * The payment is already stored as paid.
       */
      return res.status(200).json({
        success: true,
        message:
          "Payment received. Document generation may require retry.",
      });
    }
  };

module.exports = {
  startRegistrationPayment,
  handlePaystackCallback,
  handlePaystackWebhook,
  getRegistrationDocuments,
};