// const {
//   createPendingRegistration,
//   getRegistration,
// } = require("../services/firestore.service");

// const ALLOWED_TYPES = [
//   "farmer",
//   "cooperative-new",
//   "cooperative-old",
//   "partner",
//   "investor",
//   "sponsor",
// ];

// const createRegistration = async (req, res) => {
//   try {
//     const { type, ...formData } = req.body;

//     if (!type) {
//       return res.status(400).json({
//         success: false,
//         message: "Registration type is required",
//       });
//     }

//     if (!ALLOWED_TYPES.includes(type)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid registration type",
//       });
//     }

//     if (!formData.email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email address is required",
//       });
//     }

//     const registration = await createPendingRegistration({
//       type,
//       ...formData,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Registration saved successfully",
//       registration: {
//         id: registration.id,
//         type: registration.type,
//         status: registration.status,
//         paymentStatus: registration.paymentStatus,
//       },
//     });
//   } catch (error) {
//     console.error("Create registration error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Could not create registration",
//     });
//   }
// };

// const getRegistrationById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const registration = await getRegistration(id);

//     if (!registration) {
//       return res.status(404).json({
//         success: false,
//         message: "Registration not found",
//       });
//     }

//     return res.json({
//       success: true,
//       registration: {
//         id: registration.id,
//         type: registration.type,
//         status: registration.status,
//         paymentStatus: registration.paymentStatus,
//         createdAt: registration.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Get registration error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Could not retrieve registration",
//     });
//   }
// };

// module.exports = {
//   createRegistration,
//   getRegistrationById,
// };



const {
  createPendingRegistration,
  getRegistration,
  getRegistrations,
} = require("../services/firestore.service");

const ALLOWED_TYPES = [
  "farmer",
  "cooperative-new",
  "cooperative-old",
  "partner",
  "investor",
  "sponsor",
];

const createRegistration = async (req, res) => {
  try {
    const {
      type,
      ...formData
    } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Registration type is required",
      });
    }

    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration type",
      });
    }

    if (!formData.email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const registration =
      await createPendingRegistration({
        type,
        ...formData,
      });

    return res.status(201).json({
      success: true,
      message: "Registration saved successfully",

      registration: {
        id: registration.id,
        type: registration.type,
        status: registration.status,
        paymentStatus:
          registration.paymentStatus,
      },
    });
  } catch (error) {
    console.error(
      "Create registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Could not create registration",
    });
  }
};

/*
 * GET ALL REGISTRATIONS
 *
 * Admin only.
 *
 * Optional:
 * GET /api/registrations?type=farmer
 */
const getAllRegistrations = async (
  req,
  res
) => {
  try {
    const { type } = req.query;

    if (
      type &&
      !ALLOWED_TYPES.includes(type)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration type",
      });
    }

    const registrations =
      await getRegistrations(type || null);

    return res.json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error(
      "Get all registrations error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Could not retrieve registrations",
    });
  }
};

/*
 * GET ONE REGISTRATION
 *
 * Admin only.
 *
 * Returns the complete Firestore registration
 * so the dashboard can display all submitted data.
 */
const getRegistrationById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const registration =
      await getRegistration(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    return res.json({
      success: true,
      registration,
    });
  } catch (error) {
    console.error(
      "Get registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Could not retrieve registration",
    });
  }
};

module.exports = {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
};