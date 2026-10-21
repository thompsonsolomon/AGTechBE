
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import {
  getFirestore,
  FieldValue,
} from "firebase-admin/firestore";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;

// Firebase Admin configuration
const requiredFirebaseVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

const missingFirebaseVars = requiredFirebaseVars.filter(
  (key) => !process.env[key]
);

if (missingFirebaseVars.length) {
  throw new Error(
    `Missing Firebase environment variables: ${missingFirebaseVars.join(", ")}`
  );
}

const firebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });

const db = getFirestore(firebaseApp);

// Middleware
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

function getSuccessUrl(status, registrationId, reference = "") {
  const url = new URL("/membership-success", FRONTEND_URL);

  url.searchParams.set("payment", status);

  if (registrationId) {
    url.searchParams.set("registrationId", registrationId);
  }

  if (reference) {
    url.searchParams.set("reference", reference);
  }

  return url.toString();
}

app.get("/", (req, res) => {
  res.send("Agro Trade Hub payment server is running.");
});

// Initialize Paystack payment
app.get("/api/payment/:registrationId", async (req, res) => {
  try {
    if (!SECRET_KEY || !FRONTEND_URL || !BACKEND_URL) {
      return res.status(500).send("Payment configuration is incomplete.");
    }

    const { registrationId } = req.params;

    if (!registrationId) {
      return res.status(400).send("Registration ID is required.");
    }

    const registrationRef = db
      .collection("registrations")
      .doc(registrationId);

    const snapshot = await registrationRef.get();

    if (!snapshot.exists) {
      return res.status(404).send("Registration not found.");
    }

    const registration = snapshot.data();
    const category = registration.categoryId;
    const amount = FEES[category];

    if (
      !amount ||
      Number(registration.amount) !== amount ||
      String(registration.currency || "").toUpperCase() !== "NGN"
    ) {
      return res.status(400).send("Invalid registration fee.");
    }

    const email = String(registration.email || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).send("Invalid registration email.");
    }

    const status = String(
      registration.paymentStatus || ""
    ).toLowerCase();

    if (["paid", "success", "successful"].includes(status)) {
      if (!registration.paymentReference) {
        return res.status(409).send(
          "This registration is marked as paid but has no payment reference. Please contact support."
        );
      }

      return res.redirect(
        303,
        getSuccessUrl(
          "success",
          registrationId,
          registration.paymentReference
        )
      );
    }

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
          email,
          amount,
          currency: "NGN",
          callback_url: callbackUrl.toString(),
          metadata: {
            registrationId,
            category,
          },
        }),
        signal: AbortSignal.timeout(15000),
      }
    );

    const result = await response.json();

    if (
      !response.ok ||
      result.status !== true ||
      !result.data?.authorization_url ||
      !result.data?.reference
    ) {
      console.error("Paystack initialization error:", result);
      return res.status(502).send("Could not initialize payment.");
    }

    await registrationRef.update({
      paymentStatus: "pending",
      paymentReference: result.data.reference,
    });

    return res.redirect(303, result.data.authorization_url);
  } catch (error) {
    console.error("Payment initialization error:", error);
    return res.status(500).send("Could not start payment.");
  }
});

// Verify Paystack payment and update Firestore
app.get("/api/callback", async (req, res) => {
  const registrationId = String(req.query.registrationId || "");
  const reference = String(
    req.query.reference || req.query.trxref || ""
  );

  try {
    if (!SECRET_KEY || !FRONTEND_URL) {
      return res.status(500).send("Payment configuration is incomplete.");
    }

    if (!registrationId || !reference) {
      return res.redirect(
        303,
        getSuccessUrl("failed", registrationId, reference)
      );
    }

    const registrationRef = db
      .collection("registrations")
      .doc(registrationId);

    const snapshot = await registrationRef.get();

    if (!snapshot.exists) {
      return res.redirect(
        303,
        getSuccessUrl("failed", registrationId, reference)
      );
    }

    const registration = snapshot.data();
    const expectedAmount = FEES[registration.categoryId];

    if (
      !expectedAmount ||
      Number(registration.amount) !== expectedAmount ||
      String(registration.currency || "").toUpperCase() !== "NGN"
    ) {
      return res.redirect(
        303,
        getSuccessUrl("failed", registrationId, reference)
      );
    }

    // Verify directly with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(15000),
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
      String(payment?.customer?.email || "").toLowerCase() ===
        String(registration.email || "").toLowerCase() &&
      payment?.metadata?.registrationId === registrationId &&
      payment?.metadata?.category === registration.categoryId;

    if (!valid) {
      console.error("Paystack verification failed:", result);

      return res.redirect(
        303,
        getSuccessUrl("failed", registrationId, reference)
      );
    }

    // Save payment status only after successful verification
    await registrationRef.update({
      paymentStatus: "paid",
      paymentReference: reference,
      paymentVerifiedAt: FieldValue.serverTimestamp(),
    });

    console.log(
      "Payment verified and Firestore updated:",
      registrationId
    );

    return res.redirect(
      303,
      getSuccessUrl("success", registrationId, reference)
    );
  } catch (error) {
    console.error("Payment callback error:", error);

    return res.redirect(
      303,
      getSuccessUrl("failed", registrationId, reference)
    );
  }
});

app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
});
