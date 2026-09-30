const express = require("express");

const {
  startRegistrationPayment,
  handlePaystackCallback,
  handlePaystackWebhook,
  getRegistrationDocuments,
} = require("../controllers/payment.controller");

const router = express.Router();

router.post(
  "/registration",
  startRegistrationPayment
);

router.get(
  "/callback",
  handlePaystackCallback
);

router.post(
  "/webhook",
  handlePaystackWebhook
);

router.get(
  "/registration/:registrationId/documents",
  getRegistrationDocuments
);

module.exports = router;