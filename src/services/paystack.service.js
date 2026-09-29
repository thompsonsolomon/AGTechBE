const axios = require("axios");

const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

const initializeTransaction = async ({
  email,
  amount,
  reference,
  metadata,
  callbackUrl,
}) => {
  const response = await paystack.post("/transaction/initialize", {
    email,
    amount: String(amount),
    reference,
    metadata,
    callback_url: callbackUrl,
  });

  return response.data;
};

const verifyTransaction = async (reference) => {
  const response = await paystack.get(
    `/transaction/verify/${encodeURIComponent(reference)}`
  );

  return response.data;
};

module.exports = {
  initializeTransaction,
  verifyTransaction,
};