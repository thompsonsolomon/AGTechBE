// const PDFDocument = require("pdfkit");
// const QRCode = require("qrcode");
// const axios = require("axios");
// const crypto = require("crypto");

// const cloudinary = require("../config/cloudinary");

// const CATEGORY_CODES = {
//   farmer: "FRM",
//   "cooperative-new": "NCOOP",
//   "cooperative-old": "COOP",
//   partner: "PTR",
//   investor: "INV",
// };

// const CATEGORY_NAMES = {
//   farmer: "Farmer Membership",
//   "cooperative-new": "New Cooperative Membership",
//   "cooperative-old": "Cooperative Membership Revalidation",
//   partner: "Partner Membership",
//   investor: "Investor Membership",
// };

// const FRONTEND_URL = (
//   process.env.FRONTEND_URL ||
//   "https://agrotradehubafrica.com"
// ).replace(/\/+$/, "");

// const PDF_FOLDER =
//   "agro-trade-hub/membership-documents";

// const getCurrentYear = () => {
//   return new Date().getFullYear();
// };

// /**
//  * Generate a unique ATH number.
//  */
// const generateNumber = (prefix) => {
//   const randomNumber = crypto
//     .randomInt(100000, 1000000)
//     .toString();

//   return `ATH-${prefix}-${getCurrentYear()}-${randomNumber}`;
// };

// /**
//  * Generate membership ID.
//  */
// const generateMembershipId = (type) => {
//   const code = CATEGORY_CODES[type];

//   if (!code) {
//     throw new Error(
//       `Cannot generate membership ID for type: ${type}`
//     );
//   }

//   return generateNumber(code);
// };

// /**
//  * Generate certificate number.
//  */
// const generateCertificateNumber = () => {
//   return generateNumber("CERT");
// };

// /**
//  * Safely normalize Firestore Timestamp,
//  * Date, number, string or timestamp-like object.
//  */
// const normalizeDate = (value) => {
//   if (!value) {
//     return new Date();
//   }

//   if (typeof value.toDate === "function") {
//     const date = value.toDate();

//     if (
//       date instanceof Date &&
//       !Number.isNaN(date.getTime())
//     ) {
//       return date;
//     }
//   }

//   if (value instanceof Date) {
//     if (!Number.isNaN(value.getTime())) {
//       return value;
//     }
//   }

//   if (
//     typeof value.seconds === "number"
//   ) {
//     const milliseconds =
//       value.seconds * 1000 +
//       Math.floor(
//         (value.nanoseconds || 0) / 1000000
//       );

//     const date = new Date(milliseconds);

//     if (!Number.isNaN(date.getTime())) {
//       return date;
//     }
//   }

//   const date = new Date(value);

//   if (!Number.isNaN(date.getTime())) {
//     return date;
//   }

//   throw new Error(
//     "Registration contains an invalid date."
//   );
// };

// /**
//  * Format registration date.
//  */
// const formatDate = (value) => {
//   const date = normalizeDate(value);

//   return new Intl.DateTimeFormat("en-GB", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   }).format(date);
// };

// /**
//  * Sanitize filename/public ID.
//  */
// const sanitizeFilename = (value) => {
//   return (
//     String(value || "member")
//       .trim()
//       .replace(/[^a-zA-Z0-9-_]/g, "-")
//       .replace(/-+/g, "-")
//       .replace(/^-+|-+$/g, "")
//       .toLowerCase() || "member"
//   );
// };

// /**
//  * Convert PDFKit stream to Buffer.
//  */
// const streamToBuffer = (doc) => {
//   return new Promise((resolve, reject) => {
//     const chunks = [];

//     let settled = false;

//     const fail = (error) => {
//       if (settled) return;
//       settled = true;
//       reject(error);
//     };

//     doc.on("data", (chunk) => {
//       chunks.push(chunk);
//     });

//     doc.on("end", () => {
//       if (settled) return;

//       settled = true;

//       const buffer = Buffer.concat(chunks);

//       if (!buffer.length) {
//         return reject(
//           new Error("Generated PDF is empty.")
//         );
//       }

//       resolve(buffer);
//     });

//     doc.on("error", fail);

//     doc.end();
//   });
// };

// /**
//  * Upload PDF to Cloudinary.
//  *
//  * Retries automatically because external
//  * services can occasionally timeout.
//  */
// // const uploadPdfToCloudinary = async ({
// //   buffer,
// //   publicId,
// // }) => {
// //   if (
// //     !Buffer.isBuffer(buffer) ||
// //     !buffer.length
// //   ) {
// //     throw new Error(
// //       "Generated PDF is empty."
// //     );
// //   }

// //   const maxAttempts = 3;

// //   let lastError = null;

// //   for (
// //     let attempt = 1;
// //     attempt <= maxAttempts;
// //     attempt++
// //   ) {
// //     try {
// //       const result =
// //         await new Promise(
// //           (resolve, reject) => {
// //             let finished = false;

// //             const uploadStream =
// //               cloudinary.uploader.upload_stream(
// //                 {
// //                   resource_type: "raw",
// //                   public_id: publicId,
// //                   folder: PDF_FOLDER,
// //                   format: "pdf",
// //                   overwrite: true,
// //                   invalidate: true,
// //                 },
// //                 (error, result) => {
// //                   if (finished) return;

// //                   finished = true;

// //                   if (error) {
// //                     return reject(error);
// //                   }

// //                   if (!result?.secure_url) {
// //                     return reject(
// //                       new Error(
// //                         "Cloudinary did not return a PDF URL."
// //                       )
// //                     );
// //                   }

// //                   resolve(result);
// //                 }
// //               );

// //             /*
// //              * Give Cloudinary enough time to
// //              * receive a PDF, but never allow
// //              * an upload to hang forever.
// //              */
// //             const timeout = setTimeout(() => {
// //               if (finished) return;

// //               finished = true;

// //               try {
// //                 uploadStream.destroy(
// //                   new Error(
// //                     "Cloudinary PDF upload timed out."
// //                   )
// //                 );
// //               } catch (_) {}

// //               reject(
// //                 new Error(
// //                   "Cloudinary PDF upload timed out."
// //                 )
// //               );
// //             }, 60000);

// //             uploadStream.once(
// //               "close",
// //               () => {
// //                 clearTimeout(timeout);
// //               }
// //             );

// //             uploadStream.once(
// //               "error",
// //               (error) => {
// //                 clearTimeout(timeout);

// //                 if (finished) return;

// //                 finished = true;
// //                 reject(error);
// //               }
// //             );

// //             uploadStream.end(buffer);
// //           }
// //         );

// //       return result;
// //     } catch (error) {
// //       lastError = error;

// //       console.error(
// //         `Cloudinary PDF upload attempt ${attempt}/${maxAttempts} failed:`,
// //         error.message
// //       );

// //       if (attempt < maxAttempts) {
// //         await new Promise((resolve) =>
// //           setTimeout(
// //             resolve,
// //             attempt * 2000
// //           )
// //         );
// //       }
// //     }
// //   }

// //   throw new Error(
// //     `Could not upload membership PDF to Cloudinary after ${maxAttempts} attempts: ${
// //       lastError?.message || "Unknown upload error"
// //     }`
// //   );
// // };



// const uploadPdfToCloudinary = (buffer, publicId) => {
//   return new Promise((resolve, reject) => {
//     if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
//       return reject(new Error("Invalid PDF buffer"));
//     }

//     const upload = cloudinary.uploader.upload_stream(
//       {
//         resource_type: "raw",
//         public_id: publicId,
//         format: "pdf",
//         folder: PDF_FOLDER,
//         overwrite: true,
//         invalidate: true,
//         timeout: 120000,
//       },
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary PDF upload failed:", error);
//           return reject(error);
//         }

//         if (!result?.secure_url) {
//           return reject(
//             new Error("Cloudinary upload succeeded but returned no secure URL")
//           );
//         }

//         console.log("PDF uploaded to Cloudinary:", result.secure_url);

//         resolve({
//           url: result.secure_url,
//           publicId: result.public_id,
//         });
//       }
//     );

//     upload.on("error", (error) => {
//       console.error("Cloudinary PDF stream error:", error);
//       reject(error);
//     });

//     upload.end(buffer);
//   });
// };



// /**
//  * Download an image from Cloudinary.
//  *
//  * IMPORTANT:
//  * This is deliberately short and best-effort.
//  * A passport photo must NEVER prevent
//  * membership documents from being generated.
//  */
// const downloadImage = async (url) => {
//   if (!url) {
//     return null;
//   }

//   try {
//     const response = await axios.get(
//       url,
//       {
//         responseType: "arraybuffer",

//         /*
//          * Do NOT wait 15 seconds for a passport
//          * photo. If Cloudinary is slow, use the
//          * placeholder instead.
//          */
//         timeout: 5000,

//         maxContentLength:
//           10 * 1024 * 1024,

//         maxBodyLength:
//           10 * 1024 * 1024,

//         validateStatus: (status) =>
//           status >= 200 &&
//           status < 300,
//       }
//     );

//     if (!response.data) {
//       return null;
//     }

//     const buffer =
//       Buffer.from(response.data);

//     if (!buffer.length) {
//       return null;
//     }

//     return buffer;
//   } catch (error) {
//     console.warn(
//       "Passport photo could not be downloaded. Using placeholder instead:",
//       error.message
//     );

//     return null;
//   }
// };

// /**
//  * Generate QR code.
//  *
//  * QR generation is local and should be
//  * extremely reliable, but we still keep
//  * it isolated from the main document flow.
//  */
// const generateQrCode = async (value) => {
//   if (!value) {
//     throw new Error(
//       "QR code value is required."
//     );
//   }

//   return QRCode.toBuffer(value, {
//     type: "png",
//     width: 300,
//     margin: 1,
//     errorCorrectionLevel: "M",
//   });
// };

// /**
//  * Get applicant/member name.
//  */
// const getApplicantName = (registration) => {
//   const name =
//     registration.name ||
//     registration["contact-name"] ||
//     registration.contactName ||
//     registration.fullName ||
//     registration["full-name"] ||
//     registration.org ||
//     registration.organizationName;

//   return String(
//     name || "Member"
//   ).trim();
// };

// /**
//  * Get passport photo URL.
//  */
// const getPassportPhotoUrl = (
//   registration
// ) => {
//   const documents =
//     registration.documents || {};

//   const passportPhoto =
//     documents["passport-photo"];

//   if (
//     Array.isArray(passportPhoto)
//   ) {
//     const first = passportPhoto[0];

//     if (first?.url) {
//       return first.url;
//     }

//     if (
//       typeof first === "string"
//     ) {
//       return first;
//     }
//   }

//   if (
//     passportPhoto &&
//     typeof passportPhoto === "object" &&
//     passportPhoto.url
//   ) {
//     return passportPhoto.url;
//   }

//   if (
//     typeof passportPhoto === "string"
//   ) {
//     return passportPhoto;
//   }

//   if (
//     documents.passportPhoto?.url
//   ) {
//     return documents.passportPhoto.url;
//   }

//   if (
//     typeof documents.passportPhoto ===
//     "string"
//   ) {
//     return documents.passportPhoto;
//   }

//   return null;
// };

// /**
//  * Draw certificate border.
//  */
// const drawPageBorder = (doc) => {
//   doc
//     .lineWidth(2)
//     .strokeColor("#0A3D33")
//     .rect(
//       28,
//       28,
//       539,
//       786
//     )
//     .stroke();

//   doc
//     .lineWidth(1)
//     .strokeColor("#C8EA80")
//     .rect(
//       36,
//       36,
//       523,
//       770
//     )
//     .stroke();
// };

// /**
//  * Certificate header.
//  */
// const addCertificateHeader = (
//   doc
// ) => {
//   doc
//     .font("Helvetica-Bold")
//     .fontSize(13)
//     .fillColor("#0A3D33")
//     .text(
//       "AGRO TRADE HUB AFRICA",
//       72,
//       65,
//       {
//         width: 451,
//         align: "center",
//       }
//     );

//   doc
//     .font("Helvetica")
//     .fontSize(8)
//     .fillColor("#60716C")
//     .text(
//       "AGRICULTURE • TRADE • COMMUNITY • DEVELOPMENT",
//       72,
//       82,
//       {
//         width: 451,
//         align: "center",
//       }
//     );

//   doc
//     .moveTo(150, 105)
//     .lineTo(462, 105)
//     .strokeColor("#C8EA80")
//     .lineWidth(3)
//     .stroke();
// };

// /**
//  * Draw photo placeholder.
//  */
// const drawPhotoPlaceholder = (
//   doc
// ) => {
//   doc
//     .rect(13, 47, 63, 72)
//     .fill("#DDE7E2");

//   doc
//     .font("Helvetica-Bold")
//     .fontSize(6)
//     .fillColor("#60716C")
//     .text(
//       "PHOTO",
//       13,
//       80,
//       {
//         width: 63,
//         align: "center",
//       }
//     );
// };

// /**
//  * Generate membership certificate.
//  */
// const generateMembershipCertificate =
//   async ({
//     registration,
//     membershipId,
//     certificateNumber,
//   }) => {
//     const doc =
//       new PDFDocument({
//         size: "A4",
//         margins: {
//           top: 60,
//           bottom: 60,
//           left: 72,
//           right: 72,
//         },
//       });

//     drawPageBorder(doc);
//     addCertificateHeader(doc);

//     doc
//       .font("Helvetica-Bold")
//       .fontSize(28)
//       .fillColor("#0A3D33")
//       .text(
//         "MEMBERSHIP",
//         72,
//         145,
//         {
//           width: 451,
//           align: "center",
//         }
//       );

//     doc
//       .font("Helvetica-Bold")
//       .fontSize(25)
//       .fillColor("#087443")
//       .text(
//         "CERTIFICATE",
//         72,
//         180,
//         {
//           width: 451,
//           align: "center",
//         }
//       );

//     doc
//       .font("Helvetica")
//       .fontSize(11)
//       .fillColor("#555555")
//       .text(
//         "This certificate is proudly presented to",
//         72,
//         245,
//         {
//           width: 451,
//           align: "center",
//         }
//       );

//     const applicantName =
//       getApplicantName(
//         registration
//       );

//     doc
//       .font("Helvetica-Bold")
//       .fontSize(25)
//       .fillColor("#111827")
//       .text(
//         applicantName.toUpperCase(),
//         80,
//         280,
//         {
//           width: 435,
//           align: "center",
//         }
//       );

//     doc
//       .moveTo(150, 325)
//       .lineTo(462, 325)
//       .strokeColor("#C8EA80")
//       .lineWidth(2)
//       .stroke();

//     const membershipType =
//       CATEGORY_NAMES[
//         registration.type
//       ] ||
//       "Agro Trade Hub Africa Membership";

//     doc
//       .font("Helvetica")
//       .fontSize(12)
//       .fillColor("#374151")
//       .text(
//         `as a registered member under the ${membershipType} category.`,
//         105,
//         360,
//         {
//           width: 385,
//           align: "center",
//           lineGap: 4,
//         }
//       );

//     doc
//       .font("Helvetica")
//       .fontSize(10.5)
//       .fillColor("#4B5563")
//       .text(
//         "This certificate confirms that the above-named individual or organization has successfully completed registration with Agro Trade Hub Africa and is recognized as a registered member of the organization.",
//         105,
//         420,
//         {
//           width: 385,
//           align: "center",
//           lineGap: 6,
//         }
//       );

//     doc
//       .font("Helvetica-Bold")
//       .fontSize(10)
//       .fillColor("#111827")
//       .text(
//         "MEMBERSHIP ID",
//         105,
//         510
//       );

//     doc
//       .font("Helvetica")
//       .fontSize(10)
//       .text(
//         membershipId,
//         230,
//         510
//       );

//     doc
//       .font("Helvetica-Bold")
//       .text(
//         "CERTIFICATE NO.",
//         105,
//         540
//       );

//     doc
//       .font("Helvetica")
//       .text(
//         certificateNumber,
//         230,
//         540
//       );

//     doc
//       .font("Helvetica-Bold")
//       .text(
//         "REGISTRATION DATE",
//         105,
//         570
//       );

//     doc
//       .font("Helvetica")
//       .text(
//         formatDate(
//           registration.createdAt
//         ),
//         230,
//         570
//       );

//     /*
//      * QR code.
//      *
//      * If QR generation somehow fails,
//      * the certificate itself still works.
//      */
//     const verificationUrl =
//       `${FRONTEND_URL}/verify-membership.html?id=${encodeURIComponent(
//         membershipId
//       )}`;

//     try {
//       const qrBuffer =
//         await generateQrCode(
//           verificationUrl
//         );

//       doc.image(
//         qrBuffer,
//         420,
//         495,
//         {
//           width: 95,
//           height: 95,
//         }
//       );

//       doc
//         .font("Helvetica")
//         .fontSize(7)
//         .fillColor("#6B7280")
//         .text(
//           "SCAN TO VERIFY",
//           420,
//           592,
//           {
//             width: 95,
//             align: "center",
//           }
//         );
//     } catch (error) {
//       console.warn(
//         "Certificate QR generation failed:",
//         error.message
//       );
//     }

//     /*
//      * Signature area.
//      */
//     doc
//       .moveTo(105, 665)
//       .lineTo(255, 665)
//       .strokeColor("#374151")
//       .lineWidth(1)
//       .stroke();

//     doc
//       .font("Helvetica")
//       .fontSize(8)
//       .fillColor("#374151")
//       .text(
//         "Authorized Signature",
//         105,
//         672,
//         {
//           width: 150,
//           align: "center",
//         }
//       );

//     doc
//       .moveTo(330, 665)
//       .lineTo(480, 665)
//       .strokeColor("#374151")
//       .lineWidth(1)
//       .stroke();

//     doc
//       .font("Helvetica")
//       .fontSize(8)
//       .text(
//         "Agro Trade Hub Africa",
//         330,
//         672,
//         {
//           width: 150,
//           align: "center",
//         }
//       );

//     doc
//       .font("Helvetica")
//       .fontSize(8)
//       .fillColor("#6B7280")
//       .text(
//         "Official Membership Certificate • Agro Trade Hub Africa",
//         72,
//         740,
//         {
//           width: 451,
//           align: "center",
//         }
//       );

//     const buffer =
//       await streamToBuffer(doc);

//     const filename =
//       sanitizeFilename(
//         applicantName
//       );

//     const upload =
//       await uploadPdfToCloudinary({
//         buffer,
//         publicId:
//           `${filename}-${certificateNumber}`,
//       });

//     return {
//       url: upload.secure_url,
//       publicId: upload.public_id,
//       certificateNumber,
//       membershipId,
//     };
//   };

// /**
//  * Generate farmer ID card.
//  */
// const generateFarmerIdCard =
//   async ({
//     registration,
//     membershipId,
//   }) => {
//     const doc =
//       new PDFDocument({
//         size: [
//           242.65,
//           153.07,
//         ],
//         margins: 0,
//       });

//     const applicantName =
//       getApplicantName(
//         registration
//       );

//     const photoUrl =
//       getPassportPhotoUrl(
//         registration
//       );

//     /*
//      * Background.
//      */
//     doc
//       .rect(
//         0,
//         0,
//         242.65,
//         153.07
//       )
//       .fill("#F6F8F6");

//     /*
//      * Header.
//      */
//     doc
//       .rect(
//         0,
//         0,
//         242.65,
//         35
//       )
//       .fill("#0A3D33");

//     doc
//       .font("Helvetica-Bold")
//       .fontSize(9)
//       .fillColor("#C8EA80")
//       .text(
//         "AGRO TRADE HUB AFRICA",
//         12,
//         8,
//         {
//           width: 218,
//           align: "center",
//         }
//       );

//     doc
//       .font("Helvetica")
//       .fontSize(6.5)
//       .fillColor("#FFFFFF")
//       .text(
//         "OFFICIAL FARMER MEMBERSHIP ID",
//         12,
//         22,
//         {
//           width: 218,
//           align: "center",
//         }
//       );

//     /*
//      * ALWAYS draw placeholder first.
//      *
//      * If the real image works, it replaces
//      * the placeholder.
//      */
//     drawPhotoPlaceholder(doc);

//     if (photoUrl) {
//       const photoBuffer =
//         await downloadImage(
//           photoUrl
//         );

//       if (photoBuffer) {
//         try {
//           doc.image(
//             photoBuffer,
//             13,
//             47,
//             {
//               fit: [63, 72],
//               align: "center",
//               valign: "center",
//             }
//           );
//         } catch (error) {
//           console.warn(
//             "Passport photo could not be embedded. Keeping placeholder:",
//             error.message
//           );
//         }
//       }
//     }

//     /*
//      * Member details.
//      */
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(9)
//       .fillColor("#0A3D33")
//       .text(
//         applicantName.toUpperCase(),
//         88,
//         49,
//         {
//           width: 140,
//         }
//       );

//     doc
//       .font("Helvetica-Bold")
//       .fontSize(6.5)
//       .fillColor("#087443")
//       .text(
//         "FARMER MEMBER",
//         88,
//         68
//       );

//     doc
//       .font("Helvetica-Bold")
//       .fontSize(5.5)
//       .fillColor("#555555")
//       .text(
//         "MEMBERSHIP ID",
//         88,
//         84
//       );

//     doc
//       .font("Helvetica")
//       .fontSize(6)
//       .fillColor("#111827")
//       .text(
//         membershipId,
//         88,
//         94,
//         {
//           width: 140,
//         }
//       );

//     doc
//       .font("Helvetica-Bold")
//       .fontSize(5.5)
//       .fillColor("#555555")
//       .text(
//         "STATE",
//         88,
//         109
//       );

//     doc
//       .font("Helvetica")
//       .fontSize(6)
//       .fillColor("#111827")
//       .text(
//         registration.state ||
//           registration[
//             "state-of-origin"
//           ] ||
//           "Nigeria",
//         115,
//         109,
//         {
//           width: 80,
//         }
//       );

//     /*
//      * QR.
//      */
//     const verificationUrl =
//       `${FRONTEND_URL}/verify-membership.html?id=${encodeURIComponent(
//         membershipId
//       )}`;

//     try {
//       const qrBuffer =
//         await generateQrCode(
//           verificationUrl
//         );

//       doc.image(
//         qrBuffer,
//         188,
//         76,
//         {
//           width: 42,
//           height: 42,
//         }
//       );
//     } catch (error) {
//       console.warn(
//         "Farmer ID QR generation failed:",
//         error.message
//       );
//     }

//     /*
//      * Footer.
//      */
//     doc
//       .rect(
//         0,
//         133,
//         242.65,
//         20.07
//       )
//       .fill("#0A3D33");

//     doc
//       .font("Helvetica")
//       .fontSize(5.2)
//       .fillColor("#FFFFFF")
//       .text(
//         "Registered Farmer Member • Agro Trade Hub Africa",
//         10,
//         139,
//         {
//           width: 222,
//           align: "center",
//         }
//       );

//     const buffer =
//       await streamToBuffer(doc);

//     const filename =
//       sanitizeFilename(
//         applicantName
//       );

//     const upload =
//       await uploadPdfToCloudinary({
//         buffer,
//         publicId:
//           `${filename}-${membershipId}-farmer-id`,
//       });

//     return {
//       url: upload.secure_url,
//       publicId: upload.public_id,
//       membershipId,
//     };
//   };

// /**
//  * Generate all membership documents.
//  */
// const generateMembershipDocuments =
//   async ({
//     registration,
//   }) => {
//     if (!registration) {
//       throw new Error(
//         "Registration data is required."
//       );
//     }

//     if (!registration.type) {
//       throw new Error(
//         "Registration type is required."
//       );
//     }

//     if (
//       !CATEGORY_CODES[
//         registration.type
//       ]
//     ) {
//       throw new Error(
//         `Unsupported registration type: ${registration.type}`
//       );
//     }

//     /*
//      * IMPORTANT:
//      *
//      * Reuse identifiers when they already
//      * exist.
//      *
//      * This prevents duplicate membership IDs
//      * when document generation is retried.
//      */
//     const membershipId =
//       registration.membershipId ||
//       generateMembershipId(
//         registration.type
//       );

//     const certificateNumber =
//       registration.certificateNumber ||
//       generateCertificateNumber();

//     /*
//      * Every successful membership gets
//      * a certificate.
//      */
//     const certificate =
//       await generateMembershipCertificate({
//         registration,
//         membershipId,
//         certificateNumber,
//       });

//     const documents = {
//       certificate,
//     };

//     /*
//      * Farmers additionally receive
//      * a Farmer ID Card.
//      */
//     if (
//       registration.type === "farmer"
//     ) {
//       const farmerIdCard =
//         await generateFarmerIdCard({
//           registration,
//           membershipId,
//         });

//       documents.farmerIdCard =
//         farmerIdCard;
//     }

//     return {
//       membershipId,
//       certificateNumber,
//       documents,
//     };
//   };

// module.exports = {
//   generateMembershipDocuments,
//   generateMembershipId,
//   generateCertificateNumber,
// };





const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const axios = require("axios");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");

const CATEGORY_CODES = {
  farmer: "FRM",
  "cooperative-new": "NCOOP",
  "cooperative-old": "COOP",
  partner: "PTR",
  investor: "INV",
};

const CATEGORY_NAMES = {
  farmer: "Farmer Membership",
  "cooperative-new": "New Cooperative Membership",
  "cooperative-old": "Cooperative Membership Revalidation",
  partner: "Partner Membership",
  investor: "Investor Membership",
};

const FRONTEND_URL = (
  process.env.FRONTEND_URL || "https://agrotradehubafrica.com"
).replace(/\/+$/, "");

const PDF_FOLDER = "agro-trade-hub/membership-documents";

const getCurrentYear = () => {
  return new Date().getFullYear();
};

/**
 * Generate a unique ATH number.
 */
const generateNumber = (prefix) => {
  const randomNumber = crypto
    .randomInt(100000, 1000000)
    .toString();

  return `ATH-${prefix}-${getCurrentYear()}-${randomNumber}`;
};

/**
 * Generate membership ID.
 */
const generateMembershipId = (type) => {
  const code = CATEGORY_CODES[type];

  if (!code) {
    throw new Error(
      `Cannot generate membership ID for type: ${type}`
    );
  }

  return generateNumber(code);
};

/**
 * Generate certificate number.
 */
const generateCertificateNumber = () => {
  return generateNumber("CERT");
};

/**
 * Safely normalize Firestore Timestamp,
 * Date, number, string or timestamp-like object.
 */
const normalizeDate = (value) => {
  if (!value) {
    return new Date();
  }

  if (typeof value.toDate === "function") {
    const date = value.toDate();

    if (
      date instanceof Date &&
      !Number.isNaN(date.getTime())
    ) {
      return date;
    }
  }

  if (value instanceof Date) {
    if (!Number.isNaN(value.getTime())) {
      return value;
    }
  }

  if (typeof value.seconds === "number") {
    const milliseconds =
      value.seconds * 1000 +
      Math.floor((value.nanoseconds || 0) / 1000000);

    const date = new Date(milliseconds);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  const date = new Date(value);

  if (!Number.isNaN(date.getTime())) {
    return date;
  }

  throw new Error("Registration contains an invalid date.");
};

/**
 * Format registration date.
 */
const formatDate = (value) => {
  const date = normalizeDate(value);

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

/**
 * Sanitize filename/public ID.
 */
const sanitizeFilename = (value) => {
  return (
    String(value || "member")
      .trim()
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "member"
  );
};

/**
 * Convert PDFKit stream to Buffer.
 */
const streamToBuffer = (doc) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let settled = false;

    const fail = (error) => {
      if (settled) return;

      settled = true;
      reject(error);
    };

    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    doc.on("end", () => {
      if (settled) return;

      settled = true;

      const buffer = Buffer.concat(chunks);

      if (!buffer.length) {
        return reject(new Error("Generated PDF is empty."));
      }

      resolve(buffer);
    });

    doc.on("error", fail);

    doc.end();
  });
};

/**
 * Upload PDF to Cloudinary.
 *
 * IMPORTANT:
 * This function receives an object:
 *
 * uploadPdfToCloudinary({
 *   buffer,
 *   publicId,
 * })
 */
// const uploadPdfToCloudinary = async ({
//   buffer,
//   publicId,
// }) => {
//   if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
//     throw new Error("Invalid PDF buffer.");
//   }

//   if (!publicId) {
//     throw new Error("Cloudinary public ID is required.");
//   }

//   return new Promise((resolve, reject) => {
//     let settled = false;

//     const finishReject = (error) => {
//       if (settled) return;

//       settled = true;
//       reject(error);
//     };

//     const finishResolve = (result) => {
//       if (settled) return;

//       settled = true;
//       resolve(result);
//     };

//     const upload = cloudinary.uploader.upload_stream(
//       {
//         resource_type: "raw",
//         public_id: publicId,
//         format: "pdf",
//         folder: PDF_FOLDER,
//         overwrite: true,
//         invalidate: true,
//         timeout: 120000,
//       },
//       (error, result) => {
//         if (error) {
//           console.error(
//             "Cloudinary PDF upload failed:",
//             error
//           );

//           return finishReject(error);
//         }

//         if (!result?.secure_url) {
//           return finishReject(
//             new Error(
//               "Cloudinary upload succeeded but returned no secure URL."
//             )
//           );
//         }

//         console.log(
//           "PDF uploaded to Cloudinary:",
//           result.secure_url
//         );

//         finishResolve({
//           url: result.secure_url,
//           publicId: result.public_id,
//         });
//       }
//     );

//     upload.on("error", (error) => {
//       console.error(
//         "Cloudinary PDF stream error:",
//         error
//       );

//       finishReject(error);
//     });

//     upload.end(buffer);
//   });
// };


const uploadPdfToCloudinary = async ({
  buffer,
  publicId,
}) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error("Invalid PDF buffer.");
  }

  if (!publicId) {
    throw new Error("Cloudinary public ID is required.");
  }

  try {
    console.log(
      `Uploading PDF to Cloudinary: ${publicId}`
    );

    console.log(
      `PDF size: ${(buffer.length / 1024).toFixed(2)} KB`
    );

    const base64Pdf = buffer.toString("base64");

    const dataUri =
      `data:application/pdf;base64,${base64Pdf}`;

    const result =
      await cloudinary.uploader.upload(
        dataUri,
        {
          resource_type: "raw",
          public_id: publicId,
          folder: PDF_FOLDER,
          format: "pdf",
          overwrite: true,
          invalidate: true,
        }
      );

    if (!result?.secure_url) {
      throw new Error(
        "Cloudinary upload succeeded but returned no secure URL."
      );
    }

    console.log(
      "PDF uploaded successfully:",
      result.secure_url
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(
      "Cloudinary PDF upload failed:",
      error
    );

    throw new Error(
      `Cloudinary PDF upload failed: ${
        error.message || "Unknown error"
      }`
    );
  }
};


/**
 * Download an image from Cloudinary.
 *
 * A passport photo must NEVER prevent
 * membership documents from being generated.
 */
const downloadImage = async (url) => {
  if (!url) {
    return null;
  }

  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 5000,
      maxContentLength: 10 * 1024 * 1024,
      maxBodyLength: 10 * 1024 * 1024,
      validateStatus: (status) =>
        status >= 200 && status < 300,
    });

    if (!response.data) {
      return null;
    }

    const buffer = Buffer.from(response.data);

    if (!buffer.length) {
      return null;
    }

    return buffer;
  } catch (error) {
    console.warn(
      "Passport photo could not be downloaded. Using placeholder instead:",
      error.message
    );

    return null;
  }
};

/**
 * Generate QR code.
 */
const generateQrCode = async (value) => {
  if (!value) {
    throw new Error("QR code value is required.");
  }

  return QRCode.toBuffer(value, {
    type: "png",
    width: 300,
    margin: 1,
    errorCorrectionLevel: "M",
  });
};

/**
 * Get applicant/member name.
 */
const getApplicantName = (registration) => {
  const name =
    registration.name ||
    registration["contact-name"] ||
    registration.contactName ||
    registration.fullName ||
    registration["full-name"] ||
    registration.org ||
    registration.organizationName;

  return String(name || "Member").trim();
};

/**
 * Get passport photo URL.
 */
const getPassportPhotoUrl = (registration) => {
  const documents = registration.documents || {};
  const passportPhoto = documents["passport-photo"];

  if (Array.isArray(passportPhoto)) {
    const first = passportPhoto[0];

    if (first?.url) {
      return first.url;
    }

    if (typeof first === "string") {
      return first;
    }
  }

  if (
    passportPhoto &&
    typeof passportPhoto === "object" &&
    passportPhoto.url
  ) {
    return passportPhoto.url;
  }

  if (typeof passportPhoto === "string") {
    return passportPhoto;
  }

  if (documents.passportPhoto?.url) {
    return documents.passportPhoto.url;
  }

  if (typeof documents.passportPhoto === "string") {
    return documents.passportPhoto;
  }

  return null;
};

/**
 * Draw certificate border.
 */
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

/**
 * Certificate header.
 */
const addCertificateHeader = (doc) => {
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor("#0A3D33")
    .text(
      "AGRO TRADE HUB AFRICA",
      72,
      65,
      {
        width: 451,
        align: "center",
      }
    );

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#60716C")
    .text(
      "AGRICULTURE • TRADE • COMMUNITY • DEVELOPMENT",
      72,
      82,
      {
        width: 451,
        align: "center",
      }
    );

  doc
    .moveTo(150, 105)
    .lineTo(462, 105)
    .strokeColor("#C8EA80")
    .lineWidth(3)
    .stroke();
};

/**
 * Draw photo placeholder.
 */
const drawPhotoPlaceholder = (doc) => {
  doc
    .rect(13, 47, 63, 72)
    .fill("#DDE7E2");

  doc
    .font("Helvetica-Bold")
    .fontSize(6)
    .fillColor("#60716C")
    .text(
      "PHOTO",
      13,
      80,
      {
        width: 63,
        align: "center",
      }
    );
};

/**
 * Generate membership certificate.
 */
const generateMembershipCertificate = async ({
  registration,
  membershipId,
  certificateNumber,
}) => {
  const doc = new PDFDocument({
    size: "A4",
    margins: {
      top: 60,
      bottom: 60,
      left: 72,
      right: 72,
    },
  });

  drawPageBorder(doc);
  addCertificateHeader(doc);

  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .fillColor("#0A3D33")
    .text(
      "MEMBERSHIP",
      72,
      145,
      {
        width: 451,
        align: "center",
      }
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(25)
    .fillColor("#087443")
    .text(
      "CERTIFICATE",
      72,
      180,
      {
        width: 451,
        align: "center",
      }
    );

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#555555")
    .text(
      "This certificate is proudly presented to",
      72,
      245,
      {
        width: 451,
        align: "center",
      }
    );

  const applicantName = getApplicantName(registration);

  doc
    .font("Helvetica-Bold")
    .fontSize(25)
    .fillColor("#111827")
    .text(
      applicantName.toUpperCase(),
      80,
      280,
      {
        width: 435,
        align: "center",
      }
    );

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
      {
        width: 385,
        align: "center",
        lineGap: 4,
      }
    );

  doc
    .font("Helvetica")
    .fontSize(10.5)
    .fillColor("#4B5563")
    .text(
      "This certificate confirms that the above-named individual or organization has successfully completed registration with Agro Trade Hub Africa and is recognized as a registered member of the organization.",
      105,
      420,
      {
        width: 385,
        align: "center",
        lineGap: 6,
      }
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#111827")
    .text(
      "MEMBERSHIP ID",
      105,
      510
    );

  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      membershipId,
      230,
      510
    );

  doc
    .font("Helvetica-Bold")
    .text(
      "CERTIFICATE NO.",
      105,
      540
    );

  doc
    .font("Helvetica")
    .text(
      certificateNumber,
      230,
      540
    );

  doc
    .font("Helvetica-Bold")
    .text(
      "REGISTRATION DATE",
      105,
      570
    );

  doc
    .font("Helvetica")
    .text(
      formatDate(registration.createdAt),
      230,
      570
    );

  /**
   * QR code.
   */
  const verificationUrl =
    `${FRONTEND_URL}/verify-membership.html?id=${encodeURIComponent(
      membershipId
    )}`;

  try {
    const qrBuffer =
      await generateQrCode(verificationUrl);

    doc.image(
      qrBuffer,
      420,
      495,
      {
        width: 95,
        height: 95,
      }
    );

    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor("#6B7280")
      .text(
        "SCAN TO VERIFY",
        420,
        592,
        {
          width: 95,
          align: "center",
        }
      );
  } catch (error) {
    console.warn(
      "Certificate QR generation failed:",
      error.message
    );
  }

  /**
   * Signature area.
   */
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
    .text(
      "Authorized Signature",
      105,
      672,
      {
        width: 150,
        align: "center",
      }
    );

  doc
    .moveTo(330, 665)
    .lineTo(480, 665)
    .strokeColor("#374151")
    .lineWidth(1)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(8)
    .text(
      "Agro Trade Hub Africa",
      330,
      672,
      {
        width: 150,
        align: "center",
      }
    );

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#6B7280")
    .text(
      "Official Membership Certificate • Agro Trade Hub Africa",
      72,
      740,
      {
        width: 451,
        align: "center",
      }
    );

  const buffer = await streamToBuffer(doc);

  const filename = sanitizeFilename(applicantName);

  const upload = await uploadPdfToCloudinary({
    buffer,
    publicId: `${filename}-${certificateNumber}`,
  });

  return {
    url: upload.url,
    publicId: upload.publicId,
    certificateNumber,
    membershipId,
  };
};

/**
 * Generate farmer ID card.
 */
const generateFarmerIdCard = async ({
  registration,
  membershipId,
}) => {
  const doc = new PDFDocument({
    size: [242.65, 153.07],
    margins: 0,
  });

  const applicantName = getApplicantName(registration);

  const photoUrl =
    getPassportPhotoUrl(registration);

  /**
   * Background.
   */
  doc
    .rect(0, 0, 242.65, 153.07)
    .fill("#F6F8F6");

  /**
   * Header.
   */
  doc
    .rect(0, 0, 242.65, 35)
    .fill("#0A3D33");

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#C8EA80")
    .text(
      "AGRO TRADE HUB AFRICA",
      12,
      8,
      {
        width: 218,
        align: "center",
      }
    );

  doc
    .font("Helvetica")
    .fontSize(6.5)
    .fillColor("#FFFFFF")
    .text(
      "OFFICIAL FARMER MEMBERSHIP ID",
      12,
      22,
      {
        width: 218,
        align: "center",
      }
    );

  /**
   * Always draw placeholder first.
   */
  drawPhotoPlaceholder(doc);

  if (photoUrl) {
    const photoBuffer =
      await downloadImage(photoUrl);

    if (photoBuffer) {
      try {
        doc.image(
          photoBuffer,
          13,
          47,
          {
            fit: [63, 72],
            align: "center",
            valign: "center",
          }
        );
      } catch (error) {
        console.warn(
          "Passport photo could not be embedded. Keeping placeholder:",
          error.message
        );
      }
    }
  }

  /**
   * Member details.
   */
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#0A3D33")
    .text(
      applicantName.toUpperCase(),
      88,
      49,
      {
        width: 140,
      }
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(6.5)
    .fillColor("#087443")
    .text(
      "FARMER MEMBER",
      88,
      68
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(5.5)
    .fillColor("#555555")
    .text(
      "MEMBERSHIP ID",
      88,
      84
    );

  doc
    .font("Helvetica")
    .fontSize(6)
    .fillColor("#111827")
    .text(
      membershipId,
      88,
      94,
      {
        width: 140,
      }
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(5.5)
    .fillColor("#555555")
    .text(
      "STATE",
      88,
      109
    );

  doc
    .font("Helvetica")
    .fontSize(6)
    .fillColor("#111827")
    .text(
      registration.state ||
        registration["state-of-origin"] ||
        "Nigeria",
      115,
      109,
      {
        width: 80,
      }
    );

  /**
   * QR.
   */
  const verificationUrl =
    `${FRONTEND_URL}/verify-membership.html?id=${encodeURIComponent(
      membershipId
    )}`;

  try {
    const qrBuffer =
      await generateQrCode(verificationUrl);

    doc.image(
      qrBuffer,
      188,
      76,
      {
        width: 42,
        height: 42,
      }
    );
  } catch (error) {
    console.warn(
      "Farmer ID QR generation failed:",
      error.message
    );
  }

  /**
   * Footer.
   */
  doc
    .rect(
      0,
      133,
      242.65,
      20.07
    )
    .fill("#0A3D33");

  doc
    .font("Helvetica")
    .fontSize(5.2)
    .fillColor("#FFFFFF")
    .text(
      "Registered Farmer Member • Agro Trade Hub Africa",
      10,
      139,
      {
        width: 222,
        align: "center",
      }
    );

  const buffer = await streamToBuffer(doc);

  const filename =
    sanitizeFilename(applicantName);

  const upload =
    await uploadPdfToCloudinary({
      buffer,
      publicId:
        `${filename}-${membershipId}-farmer-id`,
    });

  return {
    url: upload.url,
    publicId: upload.publicId,
    membershipId,
  };
};

/**
 * Generate all membership documents.
 */
const generateMembershipDocuments = async ({
  registration,
}) => {
  if (!registration) {
    throw new Error(
      "Registration data is required."
    );
  }

  if (!registration.type) {
    throw new Error(
      "Registration type is required."
    );
  }

  if (!CATEGORY_CODES[registration.type]) {
    throw new Error(
      `Unsupported registration type: ${registration.type}`
    );
  }

  /**
   * Reuse identifiers when they already exist.
   *
   * This prevents duplicate membership IDs
   * when document generation is retried.
   */
  const membershipId =
    registration.membershipId ||
    generateMembershipId(registration.type);

  const certificateNumber =
    registration.certificateNumber ||
    generateCertificateNumber();

  /**
   * Every successful membership gets
   * a certificate.
   */
  const certificate =
    await generateMembershipCertificate({
      registration,
      membershipId,
      certificateNumber,
    });

  const documents = {
    certificate,
  };

  /**
   * Farmers additionally receive
   * a Farmer ID Card.
   */
  if (registration.type === "farmer") {
    const farmerIdCard =
      await generateFarmerIdCard({
        registration,
        membershipId,
      });

    documents.farmerIdCard =
      farmerIdCard;
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
