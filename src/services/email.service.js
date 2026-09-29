const axios = require("axios");

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("Missing EMAIL_FROM");
  }

  const response = await axios.post(
    "https://api.resend.com/emails",
    {
      from: process.env.EMAIL_FROM,
      to: [to],
      subject,
      html,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    }
  );

  return response.data;
};

const sendRegistrationConfirmation = async ({
  applicantEmail,
  applicantName,
  registrationType,
  reference,
  amount,
}) => {
  return sendEmail({
    to: applicantEmail,
    subject: "Agro Trade Hub Africa — Registration Confirmed",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto;">
        <h2>Registration Confirmed</h2>

        <p>Hello ${applicantName || "Applicant"},</p>

        <p>
          Your Agro Trade Hub Africa registration has been successfully
          submitted and your payment has been confirmed.
        </p>

        <p><strong>Registration Type:</strong> ${registrationType}</p>

        <p>
          <strong>Amount Paid:</strong>
          ₦${Number(amount).toLocaleString()}
        </p>

        <p><strong>Payment Reference:</strong> ${reference}</p>

        <p>
          Our team will review your registration and contact you if
          additional information is required.
        </p>

        <p>
          Thank you,<br>
          <strong>Agro Trade Hub Africa</strong>
        </p>
      </div>
    `,
  });
};

const sendAdminRegistrationNotification = async ({
  applicantEmail,
  applicantName,
  registrationType,
  reference,
  amount,
  registrationId,
}) => {
  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `New ${registrationType} Registration — Payment Confirmed`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto;">
        <h2>New Registration Received</h2>

        <p>
          A new Agro Trade Hub Africa registration has been successfully
          paid for.
        </p>

        <p><strong>Applicant:</strong> ${applicantName || "N/A"}</p>

        <p><strong>Email:</strong> ${applicantEmail}</p>

        <p><strong>Registration Type:</strong> ${registrationType}</p>

        <p>
          <strong>Amount:</strong>
          ₦${Number(amount).toLocaleString()}
        </p>

        <p><strong>Payment Reference:</strong> ${reference}</p>

        <p><strong>Registration ID:</strong> ${registrationId}</p>

        <p>
          The complete registration information is available in Firestore.
        </p>
      </div>
    `,
  });
};

module.exports = {
  sendRegistrationConfirmation,
  sendAdminRegistrationNotification,
};