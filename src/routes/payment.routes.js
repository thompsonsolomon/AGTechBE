const express = require("express");

const {
  startRegistrationPayment,
  handlePaystackCallback,
  handlePaystackWebhook,
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

module.exports = router;