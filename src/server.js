
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;

// Firebase Admin
// Firebase Admin configuration
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}


const db = admin.firestore();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const FEES = {
  farmer: 300000,
  "cooperative-new": 5000000,
  "cooperative-old": 2500000,
  partner: 20000000,
  investor: 50000000,
};

app.get("/", (req, res) => {
  res.send("Agro Trade Hub payment server is running.");
});

// Initialize Paystack payment
app.get("/api/payment/:registrationId", async (req, res) => {
  try {
    const { registrationId } = req.params;

    if (!SECRET_KEY || !FRONTEND_URL || !BACKEND_URL) {
      return res.status(500).send("Payment configuration is incomplete.");
    }

    if (!registrationId) {
      return res.status(400).send("Registration ID is required.");
    }

    // Get the registration from Firestore
    const registrationRef = db
      .collection("registrations")
      .doc(registrationId);

    const registrationSnapshot = await registrationRef.get();

    if (!registrationSnapshot.exists) {
      return res.status(404).send("Registration not found.");
    }

    const registration = registrationSnapshot.data();
    const category = registration.categoryId;
    const amount = FEES[category];

    if (
      !amount ||
      Number(registration.amount) !== amount ||
      String(registration.currency).toUpperCase() !== "NGN"
    ) {
      return res.status(400).send("Invalid registration fee.");
    }

    if (
      !registration.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registration.email)
    ) {
      return res.status(400).send("Invalid registration email.");
    }

    if (
      ["paid", "success", "successful"].includes(
        String(registration.paymentStatus || "").toLowerCase()
      )
    ) {
      return res.status(400).send("This registration has already been paid.");
    }

    // Pass the registration ID to the callback
    const callbackUrl = new URL("/api/callback", BACKEND_URL);
    callbackUrl.searchParams.set("registrationId", registrationId);

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: registration.email,
          amount,
          currency: "NGN",
          callback_url: callbackUrl.toString(),
          metadata: {
            registrationId,
            category,
          },
        }),
      }
    );

    const result = await response.json();

    if (
      !response.ok ||
      !result.status ||
      !result.data?.authorization_url
    ) {
      console.error("Paystack initialization error:", result);
      return res.status(502).send("Could not initialize payment.");
    }

    // Save the Paystack reference
    await registrationRef.update({
      paymentStatus: "pending",
      paymentReference: result.data.reference,
    });

    return res.redirect(result.data.authorization_url);
  } catch (error) {
    console.error("Payment initialization error:", error);
    return res.status(500).send("Could not start payment.");
  }
});

// Verify payment, update Firestore, and redirect
app.get("/api/callback", async (req, res) => {
  const registrationId = String(req.query.registrationId || "");
  const reference = String(
    req.query.reference || req.query.trxref || ""
  );

  const redirectToSuccess = (status) => {
    const url = new URL("/membership-success", FRONTEND_URL);

    url.searchParams.set("payment", status);

    if (registrationId) {
      url.searchParams.set("registrationId", registrationId);
    }

    if (reference) {
      url.searchParams.set("reference", reference);
    }

    return res.redirect(303, url.toString());
  };

  try {
    if (!SECRET_KEY || !FRONTEND_URL) {
      return res.status(500).send("Payment configuration is incomplete.");
    }

    if (!registrationId || !reference) {
      return redirectToSuccess("failed");
    }

    // Get the registration
    const registrationRef = db
      .collection("registrations")
      .doc(registrationId);

    const registrationSnapshot = await registrationRef.get();

    if (!registrationSnapshot.exists) {
      return redirectToSuccess("failed");
    }

    const registration = registrationSnapshot.data();
    const expectedAmount = FEES[registration.categoryId];

    if (
      !expectedAmount ||
      Number(registration.amount) !== expectedAmount
    ) {
      return redirectToSuccess("failed");
    }

    // Ask Paystack to verify the actual transaction
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();
    const payment = result.data;

    const valid =
      response.ok &&
      result.status === true &&
      payment?.status === "success" &&
      payment?.reference === reference &&
      payment?.currency === "NGN" &&
      payment?.amount === expectedAmount &&
      payment?.customer?.email?.toLowerCase() ===
        registration.email?.toLowerCase() &&
      payment?.metadata?.registrationId === registrationId &&
      payment?.metadata?.category === registration.categoryId;

    if (!valid) {
      console.error("Payment verification failed:", result);
      return redirectToSuccess("failed");
    }

    // IMPORTANT: Update Firestore only after verification succeeds
    await registrationRef.update({
      paymentStatus: "paid",
      paymentReference: reference,
      paymentVerifiedAt:
        admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(
      "Payment verified and Firestore updated:",
      registrationId
    );

    return redirectToSuccess("success");
  } catch (error) {
    console.error("Payment callback error:", error);
    return redirectToSuccess("failed");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
});
