"use strict";

const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const axios = require("axios");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");

const CATEGORY_CODES = Object.freeze({
  farmer: "FRM",
  "cooperative-new": "NCOOP",
  "cooperative-old": "COOP",
  partner: "PTR",
  investor: "INV",
});

const CATEGORY_NAMES = Object.freeze({
  farmer: "Farmer Membership",
  "cooperative-new": "New Cooperative Membership",
  "cooperative-old": "Cooperative Membership Revalidation",
  partner: "Partner Membership",
  investor: "Investor Membership",
});

const FRONTEND_URL = (
  process.env.FRONTEND_URL || "https://agrotradehubafrica.com"
).replace(/\/+$/, "");

const PDF_FOLDER = "agro-trade-hub/membership-documents";
const UPLOAD_TIMEOUT_MS = 60000;
const MAX_UPLOAD_ATTEMPTS = 3;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/* -------------------- IDENTIFIERS -------------------- */

const getCurrentYear = () => new Date().getFullYear();

const generateNumber = (prefix) =>
  `ATH-${prefix}-${getCurrentYear()}-${crypto
    .randomInt(100000, 1000000)
    .toString()}`;

const generateMembershipId = (type) => {
  const code = CATEGORY_CODES[type];

  if (!code) {
    throw new Error(`Unsupported membership type: ${type}`);
  }

  return generateNumber(code);
};

const generateCertificateNumber = () => generateNumber("CERT");

/* -------------------- DATE HELPERS -------------------- */

const normalizeDate = (value) => {
  if (!value) return new Date();

  if (typeof value.toDate === "function") {
    const date = value.toDate();

    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return date;
    }
  }

  if (value instanceof Date) {
    if (!Number.isNaN(value.getTime())) return value;
  }

  if (typeof value.seconds === "number") {
    const date = new Date(
      value.seconds * 1000 +
        Math.floor((value.nanoseconds || 0) / 1000000)
    );

    if (!Number.isNaN(date.getTime())) return date;
  }

  const date = new Date(value);

  if (!Number.isNaN(date.getTime())) return date;

  throw new Error("Registration contains an invalid date.");
};

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(normalizeDate(value));

/* -------------------- REGISTRATION HELPERS -------------------- */

const sanitizeFilename = (value) =>
  String(value || "member")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "member";

const getApplicantName = (registration) => {
  const name =
    registration.name ||
    registration["contact-name"] ||
    registration.contactName ||
    registration.fullName ||
    registration["full-name"] ||
    registration.org ||
    registration.organizationName;

  return String(name || "Member").trim().slice(0, 180);
};

const getPassportPhotoUrl = (registration) => {
  const documents = registration.documents || {};
  const photo =
    documents["passport-photo"] || documents.passportPhoto;

  if (Array.isArray(photo)) {
    const first = photo[0];
    return typeof first === "string" ? first : first?.url || null;
  }

  if (typeof photo === "string") return photo;
  if (photo && typeof photo.url === "string") return photo.url;

  return null;
};

/* -------------------- PDF BUFFER -------------------- */

const streamToBuffer = (doc) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let settled = false;

    const cleanup = () => {
      doc.removeListener("data", onData);
      doc.removeListener("end", onEnd);
      doc.removeListener("error", onError);
    };

    const fail = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };

    const onData = (chunk) => chunks.push(chunk);

    const onEnd = () => {
      if (settled) return;
      settled = true;
      cleanup();

      const buffer = Buffer.concat(chunks);

      if (!buffer.length) {
        return reject(new Error("Generated PDF is empty."));
      }

      resolve(buffer);
    };

    const onError = (error) => fail(error);

    doc.on("data", onData);
    doc.once("end", onEnd);
    doc.once("error", onError);

    try {
      doc.end();
    } catch (error) {
      fail(error);
    }
  });

/* -------------------- CLOUDINARY UPLOAD -------------------- */

const uploadPdfToCloudinary = async ({ buffer, publicId }) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error("Cannot upload an empty PDF.");
  }

  if (!publicId || typeof publicId !== "string") {
    throw new Error("A valid Cloudinary public ID is required.");
  }

  let lastError;

  for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt++) {
    try {
      console.log(
        `Uploading PDF to Cloudinary (attempt ${attempt}/${MAX_UPLOAD_ATTEMPTS}): ${publicId}`
      );
      console.log(`PDF size: ${(buffer.length / 1024).toFixed(2)} KB`);

      const result = await new Promise((resolve, reject) => {
        let settled = false;
        let timeout;

        const finish = (error, value) => {
          if (settled) return;
          settled = true;

          if (timeout) clearTimeout(timeout);

          if (error) reject(error);
          else resolve(value);
        };

        let upload;

        try {
          upload = cloudinary.uploader.upload_stream(
            {
              resource_type: "raw",
              type: "upload",
              public_id: publicId,
              folder: PDF_FOLDER,
              format: "pdf",
              overwrite: true,
              invalidate: true,
              timeout: UPLOAD_TIMEOUT_MS,
            },
            (error, response) => {
              if (error) return finish(error);

              if (!response?.secure_url || !response?.public_id) {
                return finish(
                  new Error("Cloudinary returned incomplete PDF details.")
                );
              }

              finish(null, response);
            }
          );

          upload.once("error", (error) => finish(error));

          timeout = setTimeout(() => {
            const error = new Error(
              `Cloudinary PDF upload timed out after ${
                UPLOAD_TIMEOUT_MS / 1000
              } seconds.`
            );

            finish(error);

            if (upload && !upload.destroyed) {
              upload.destroy(error);
            }
          }, UPLOAD_TIMEOUT_MS);

          upload.end(buffer);
        } catch (error) {
          finish(error);
        }
      });

      console.log("PDF uploaded successfully:", result.secure_url);

      // Keep these property names consistent with the generators below.
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      lastError = error;

      console.error(
        `Cloudinary upload attempt ${attempt} failed:`,
        error.message
      );

      if (attempt < MAX_UPLOAD_ATTEMPTS) {
        await sleep(attempt * 1500);
      }
    }
  }

  throw new Error(
    `Cloudinary PDF upload failed after ${MAX_UPLOAD_ATTEMPTS} attempts: ${
      lastError?.message || "Unknown error"
    }`
  );
};

/* -------------------- IMAGE DOWNLOAD -------------------- */

const downloadImage = async (url) => {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    // Prevent arbitrary URLs from being used to make server-side requests.
    if (
      parsedUrl.protocol !== "https:" ||
      parsedUrl.hostname !== "res.cloudinary.com"
    ) {
      console.warn("Rejected unsupported passport photo URL.");
      return null;
    }

    const response = await axios.get(parsedUrl.href, {
      responseType: "arraybuffer",
      timeout: 5000,
      maxContentLength: MAX_IMAGE_SIZE,
      maxBodyLength: MAX_IMAGE_SIZE,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    const contentType = String(
      response.headers["content-type"] || ""
    ).toLowerCase();

    if (!contentType.startsWith("image/")) {
      console.warn("Passport photo URL did not return an image.");
      return null;
    }

    const buffer = Buffer.from(response.data);

    return buffer.length ? buffer : null;
  } catch (error) {
    console.warn(
      "Passport photo unavailable; using placeholder:",
      error.message
    );

    return null;
  }
};

/* -------------------- QR CODE -------------------- */

const generateQrCode = (value) => {
  if (!value) throw new Error("QR code value is required.");

  return QRCode.toBuffer(value, {
    type: "png",
    width: 300,
    margin: 1,
    errorCorrectionLevel: "M",
  });
};

const getVerificationUrl = (membershipId) =>
  `${FRONTEND_URL}/verify-membership.html?id=${encodeURIComponent(
    membershipId
  )}`;

/* -------------------- CERTIFICATE DESIGN -------------------- */

const drawPageBorder = (doc) => {
  doc
    .lineWidth(2)
    .strokeColor("#0A3D33")
    .rect(28, 28, 539, 786)
    .stroke();

  doc
    .lineWidth(1)
    .strokeColor("#C8EA80")
    .rect(36, 36, 523, 770)
    .stroke();
};

const addCertificateHeader = (doc) => {
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor("#0A3D33")
    .text("AGRO TRADE HUB AFRICA", 72, 65, {
      width: 451,
      align: "center",
    });

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#60716C")
    .text("AGRICULTURE • TRADE • COMMUNITY • DEVELOPMENT", 72, 82, {
      width: 451,
      align: "center",
    });

  doc
    .moveTo(150, 105)
    .lineTo(462, 105)
    .strokeColor("#C8EA80")
    .lineWidth(3)
    .stroke();
};

const generateMembershipCertificate = async ({
  registration,
  membershipId,
  certificateNumber,
}) => {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 60, bottom: 60, left: 72, right: 72 },
    info: {
      Title: "Agro Trade Hub Africa Membership Certificate",
      Author: "Agro Trade Hub Africa",
      Subject: `Membership certificate ${certificateNumber}`,
    },
  });

  drawPageBorder(doc);
  addCertificateHeader(doc);

  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .fillColor("#0A3D33")
    .text("MEMBERSHIP", 72, 145, {
      width: 451,
      align: "center",
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(25)
    .fillColor("#087443")
    .text("CERTIFICATE", 72, 180, {
      width: 451,
      align: "center",
    });

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#555555")
    .text("This certificate is proudly presented to", 72, 245, {
      width: 451,
      align: "center",
    });

  const applicantName = getApplicantName(registration);

  doc
    .font("Helvetica-Bold")
    .fontSize(25)
    .fillColor("#111827")
    .text(applicantName.toUpperCase(), 80, 280, {
      width: 435,
      align: "center",
      lineBreak: false,
      ellipsis: true,
    });

  doc
    .moveTo(150, 325)
    .lineTo(462, 325)
    .strokeColor("#C8EA80")
    .lineWidth(2)
    .stroke();

  const membershipType =
    CATEGORY_NAMES[registration.type] ||
    "Agro Trade Hub Africa Membership";

  doc
    .font("Helvetica")
    .fontSize(12)
    .fillColor("#374151")
    .text(
      `as a registered member under the ${membershipType} category.`,
      105,
      360,
      { width: 385, align: "center", lineGap: 4 }
    );

  doc
    .font("Helvetica")
    .fontSize(10.5)
    .fillColor("#4B5563")
    .text(
      "This certificate confirms that the above-named individual or organization has successfully completed registration with Agro Trade Hub Africa and is recognized as a registered member of the organization.",
      105,
      420,
      { width: 385, align: "center", lineGap: 6 }
    );

  const details = [
    ["MEMBERSHIP ID", membershipId, 510],
    ["CERTIFICATE NO.", certificateNumber, 540],
    ["REGISTRATION DATE", formatDate(registration.createdAt), 570],
  ];

  for (const [label, value, y] of details) {
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#111827")
      .text(label, 105, y);

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#111827")
      .text(String(value), 230, y, { width: 175 });
  }

  try {
    const qrBuffer = await generateQrCode(
      getVerificationUrl(membershipId)
    );

    doc.image(qrBuffer, 420, 495, {
      width: 95,
      height: 95,
    });

    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor("#6B7280")
      .text("SCAN TO VERIFY", 420, 592, {
        width: 95,
        align: "center",
      });
  } catch (error) {
    console.warn("Certificate QR generation failed:", error.message);
  }

  doc
    .moveTo(105, 665)
    .lineTo(255, 665)
    .strokeColor("#374151")
    .lineWidth(1)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#374151")
    .text("Authorized Signature", 105, 672, {
      width: 150,
      align: "center",
    });

  doc
    .moveTo(330, 665)
    .lineTo(480, 665)
    .strokeColor("#374151")
    .lineWidth(1)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(8)
    .text("Agro Trade Hub Africa", 330, 672, {
      width: 150,
      align: "center",
    });

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#6B7280")
    .text(
      "Official Membership Certificate • Agro Trade Hub Africa",
      72,
      740,
      { width: 451, align: "center" }
    );

  const buffer = await streamToBuffer(doc);
  const filename = sanitizeFilename(applicantName);

  const upload = await uploadPdfToCloudinary({
    buffer,
    publicId: `${filename}-${certificateNumber}`,
  });

  if (!upload.url || !upload.publicId) {
    throw new Error("Certificate upload returned incomplete document data.");
  }

  return {
    url: upload.url,
    publicId: upload.publicId,
    certificateNumber,
    membershipId,
  };
};

/* -------------------- FARMER ID CARD -------------------- */

const drawPhotoPlaceholder = (doc) => {
  doc.rect(13, 47, 63, 72).fill("#DDE7E2");

  doc
    .font("Helvetica-Bold")
    .fontSize(6)
    .fillColor("#60716C")
    .text("PHOTO", 13, 80, {
      width: 63,
      align: "center",
    });
};

const generateFarmerIdCard = async ({
  registration,
  membershipId,
}) => {
  const doc = new PDFDocument({
    size: [242.65, 153.07],
    margins: 0,
    info: {
      Title: "Agro Trade Hub Africa Farmer Membership ID",
      Author: "Agro Trade Hub Africa",
    },
  });

  const applicantName = getApplicantName(registration);
  const photoUrl = getPassportPhotoUrl(registration);

  doc.rect(0, 0, 242.65, 153.07).fill("#F6F8F6");
  doc.rect(0, 0, 242.65, 35).fill("#0A3D33");

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#C8EA80")
    .text("AGRO TRADE HUB AFRICA", 12, 8, {
      width: 218,
      align: "center",
    });

  doc
    .font("Helvetica")
    .fontSize(6.5)
    .fillColor("#FFFFFF")
    .text("OFFICIAL FARMER MEMBERSHIP ID", 12, 22, {
      width: 218,
      align: "center",
    });

  drawPhotoPlaceholder(doc);

  if (photoUrl) {
    const photoBuffer = await downloadImage(photoUrl);

    if (photoBuffer) {
      try {
        doc.image(photoBuffer, 13, 47, {
          fit: [63, 72],
          align: "center",
          valign: "center",
        });
      } catch (error) {
        console.warn("Could not embed passport photo:", error.message);
      }
    }
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#0A3D33")
    .text(applicantName.toUpperCase(), 88, 49, {
      width: 140,
      lineBreak: false,
      ellipsis: true,
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(6.5)
    .fillColor("#087443")
    .text("FARMER MEMBER", 88, 68);

  doc
    .font("Helvetica-Bold")
    .fontSize(5.5)
    .fillColor("#555555")
    .text("MEMBERSHIP ID", 88, 84);

  doc
    .font("Helvetica")
    .fontSize(6)
    .fillColor("#111827")
    .text(membershipId, 88, 94, { width: 95 });

  doc
    .font("Helvetica-Bold")
    .fontSize(5.5)
    .fillColor("#555555")
    .text("STATE", 88, 109);

  doc
    .font("Helvetica")
    .fontSize(6)
    .fillColor("#111827")
    .text(
      String(
        registration.state ||
          registration["state-of-origin"] ||
          "Nigeria"
      ).slice(0, 50),
      115,
      109,
      { width: 70, lineBreak: false, ellipsis: true }
    );

  try {
    const qrBuffer = await generateQrCode(
      getVerificationUrl(membershipId)
    );

    doc.image(qrBuffer, 188, 76, {
      width: 42,
      height: 42,
    });
  } catch (error) {
    console.warn("Farmer ID QR generation failed:", error.message);
  }

  doc.rect(0, 133, 242.65, 20.07).fill("#0A3D33");

  doc
    .font("Helvetica")
    .fontSize(5.2)
    .fillColor("#FFFFFF")
    .text(
      "Registered Farmer Member • Agro Trade Hub Africa",
      10,
      139,
      { width: 222, align: "center" }
    );

  const buffer = await streamToBuffer(doc);
  const filename = sanitizeFilename(applicantName);

  const upload = await uploadPdfToCloudinary({
    buffer,
    publicId: `${filename}-${membershipId}-farmer-id`,
  });

  if (!upload.url || !upload.publicId) {
    throw new Error("Farmer ID upload returned incomplete document data.");
  }

  return {
    url: upload.url,
    publicId: upload.publicId,
    membershipId,
  };
};

/* -------------------- GENERATE ALL DOCUMENTS -------------------- */

const generateMembershipDocuments = async ({ registration }) => {
  if (!registration || typeof registration !== "object") {
    throw new Error("Registration data is required.");
  }

  if (!CATEGORY_CODES[registration.type]) {
    throw new Error(
      `Unsupported registration type: ${registration.type}`
    );
  }

  // Reuse existing identifiers when retrying document generation.
  const membershipId =
    registration.membershipId ||
    generateMembershipId(registration.type);

  const certificateNumber =
    registration.certificateNumber ||
    generateCertificateNumber();

  const certificate = await generateMembershipCertificate({
    registration,
    membershipId,
    certificateNumber,
  });

  const documents = { certificate };

  if (registration.type === "farmer") {
    documents.farmerIdCard = await generateFarmerIdCard({
      registration,
      membershipId,
    });
  }

  // Validate before returning data to the Firestore update operation.
  for (const [key, document] of Object.entries(documents)) {
    if (
      !document ||
      typeof document.url !== "string" ||
      !document.url.startsWith("https://") ||
      typeof document.publicId !== "string"
    ) {
      throw new Error(
        `Generated document "${key}" is missing its URL or public ID.`
      );
    }
  }

  return {
    membershipId,
    certificateNumber,
    documents,
  };
};

module.exports = {
  generateMembershipDocuments,
  generateMembershipId,
  generateCertificateNumber,
};