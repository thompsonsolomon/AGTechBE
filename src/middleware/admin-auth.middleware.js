const crypto = require("crypto");

function adminAuth(req, res, next) {
  const configuredKey = process.env.ADMIN_API_KEY;
  const providedKey = req.headers["x-admin-key"];

  if (!configuredKey) {
    console.error(
      "ADMIN_API_KEY is not configured in the environment."
    );

    return res.status(500).json({
      success: false,
      message: "Admin authentication is not configured.",
    });
  }

  if (!providedKey) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required.",
    });
  }

  const providedBuffer = Buffer.from(String(providedKey));
  const configuredBuffer = Buffer.from(String(configuredKey));

  if (
    providedBuffer.length !== configuredBuffer.length ||
    !crypto.timingSafeEqual(
      providedBuffer,
      configuredBuffer
    )
  ) {
    return res.status(403).json({
      success: false,
      message: "Invalid admin credentials.",
    });
  }

  next();
}

module.exports = adminAuth;