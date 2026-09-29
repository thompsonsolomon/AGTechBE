const nodemailer = require("nodemailer");

const requiredEnv = [
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASSWORD",
  "EMAIL_FROM",
  "ADMIN_EMAIL",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing email environment variable: ${key}`);
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = transporter;