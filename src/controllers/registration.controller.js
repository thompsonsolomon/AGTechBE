// const {
//   createRegistration,
//   getRegistration,
//   getRegistrations,
// } = require("../services/firestore.service");

// const submitRegistration = async (req, res) => {
//   try {
//     const { type, ...formData } = req.body;

//     if (!type) {
//       return res.status(400).json({
//         success: false,
//         message: "Registration type is required",
//       });
//     }

//     const allowedTypes = [
//       "farmer",
//       "cooperative-new",
//       "cooperative-old",
//       "partner",
//       "investor",
//       "sponsor",
//     ];

//     if (!allowedTypes.includes(type)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid registration type",
//       });
//     }

//     const registration = await createRegistration({
//       type,
//       ...formData,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Registration submitted successfully",
//       registration,
//     });
//   } catch (error) {
//     console.error("Registration error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Could not submit registration",
//     });
//   }
// };

// const getOneRegistration = async (req, res) => {
//   try {
//     const registration = await getRegistration(req.params.id);

//     if (!registration) {
//       return res.status(404).json({
//         success: false,
//         message: "Registration not found",
//       });
//     }

//     res.json({
//       success: true,
//       registration,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Could not retrieve registration",
//     });
//   }
// };

// const getAllRegistrations = async (req, res) => {
//   try {
//     const registrations = await getRegistrations(req.query.type);

//     res.json({
//       success: true,
//       count: registrations.length,
//       registrations,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Could not retrieve registrations",
//     });
//   }
// };

// module.exports = {
//   submitRegistration,
//   getOneRegistration,
//   getAllRegistrations,
// };




const {
  createPendingRegistration,
  getRegistration,
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
    const { type, ...formData } = req.body;

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

    const registration = await createPendingRegistration({
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
        paymentStatus: registration.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Create registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not create registration",
    });
  }
};

const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await getRegistration(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    return res.json({
      success: true,
      registration: {
        id: registration.id,
        type: registration.type,
        status: registration.status,
        paymentStatus: registration.paymentStatus,
        createdAt: registration.createdAt,
      },
    });
  } catch (error) {
    console.error("Get registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not retrieve registration",
    });
  }
};

module.exports = {
  createRegistration,
  getRegistrationById,
};