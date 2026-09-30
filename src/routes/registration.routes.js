// const express = require("express");

// const {
//   createRegistration,
//   getRegistrationById,
// } = require("../controllers/registration.controller");

// const router = express.Router();

// router.post("/", createRegistration);

// router.get("/:id", getRegistrationById);

// module.exports = router;





const express = require("express");

const {
  createRegistration,
  getRegistrationById,
  getAllRegistrations,
} = require("../controllers/registration.controller");

const adminAuth = require("../middleware/admin-auth.middleware");

const router = express.Router();

/*
 * Public registration endpoint
 */
router.post("/", createRegistration);

/*
 * Admin-only registration endpoints
 */
router.get("/", adminAuth, getAllRegistrations);

router.get("/:id", getRegistrationById);

module.exports = router;