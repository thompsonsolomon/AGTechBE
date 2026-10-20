import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;

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

// Initialize Paystack checkout
app.get("/api/payment/:registrationId", async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { email, category } = req.query;

    if (!SECRET_KEY || !FRONTEND_URL || !BACKEND_URL) {
      return res.status(500).send("Payment server configuration is incomplete.");
    }

console.log("Payment request received:", {
  registrationId,
  email,
  category,
  validCategories: Object.keys(FEES),
});

if (!registrationId || !email || !category || !FEES[category]) {
  return res.status(400).json({
    error: "Invalid registration or membership category.",
    received: { registrationId, email, category },
    validCategories: Object.keys(FEES),
  });
}

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
          amount: FEES[category],
          currency: "NGN",
          callback_url:
            `${BACKEND_URL}/api/callback?registrationId=` +
            encodeURIComponent(registrationId),
          metadata: {
            registrationId,
            category,
          },
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.status || !result.data?.authorization_url) {
      console.error("Paystack initialization error:", result);
      return res.status(502).send("Could not initialize payment.");
    }

    return res.redirect(result.data.authorization_url);
  } catch (error) {
    console.error("Initialize payment error:", error);
    return res.status(500).send("Could not start payment.");
  }
});

// Verify payment and redirect to frontend
app.get("/api/callback", async (req, res) => {
  const registrationId = String(req.query.registrationId || "");
  const reference = String(req.query.reference || req.query.trxref || "");

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
      return res.status(500).send("Payment server configuration is incomplete.");
    }

    if (!registrationId || !reference) {
      return redirectToSuccess("failed");
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
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
      Number.isSafeInteger(payment?.amount) &&
      FEES[payment?.metadata?.category] === payment?.amount &&
      payment?.metadata?.registrationId === registrationId;

    if (!valid) {
      console.error("Payment verification failed:", result);
      return redirectToSuccess("failed");
    }

    console.log("Paystack payment verified:", reference);

    return redirectToSuccess("success");
  } catch (error) {
    console.error("Payment verification error:", error);
    return redirectToSuccess("failed");
  }
});

app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
});
