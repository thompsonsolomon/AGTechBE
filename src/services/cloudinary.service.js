const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");

const createUploadSignature = ({ folder, timestamp }) => {
  const paramsToSign = {
    folder,
    timestamp,
  };

  const signature = crypto
    .createHash("sha1")
    .update(
      Object.entries(paramsToSign)
        .sort()
        .map(([key, value]) => `${key}=${value}`)
        .join("&") + process.env.CLOUDINARY_API_SECRET
    )
    .digest("hex");

  return {
    signature,
    timestamp,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  };
};

module.exports = {
  createUploadSignature,
};