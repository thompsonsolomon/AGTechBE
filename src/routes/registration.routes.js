const express = require("express");

const {
  createRegistration,
  getRegistrationById,
} = require("../controllers/registration.controller");

const router = express.Router();

router.post("/", createRegistration);

router.get("/:id", getRegistrationById);

module.exports = router;