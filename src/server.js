require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./config/firebase");
require("./config/cloudinary");

const uploadRoutes = require("./routes/upload.routes");
const registrationRoutes = require("./routes/registration.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/uploads", uploadRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Agro Trade Hub Africa API is running",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚜 Agro Trade Hub API running on port ${PORT}`);
});