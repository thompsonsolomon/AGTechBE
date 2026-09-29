const {
  createUploadSignature,
} = require("../services/cloudinary.service");

const getUploadSignature = (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);

    const folder = "agro-trade-hub/memberships";

    const result = createUploadSignature({
      folder,
      timestamp,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Cloudinary signature error:", error);

    res.status(500).json({
      success: false,
      message: "Could not create upload signature",
    });
  }
};

module.exports = {
  getUploadSignature,
};