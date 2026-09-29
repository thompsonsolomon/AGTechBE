const express = require("express");

const {
  getUploadSignature,
} = require("../controllers/upload.controller");

const router = express.Router();

router.get("/signature", getUploadSignature);

module.exports = router;