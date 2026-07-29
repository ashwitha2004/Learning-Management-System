import nodemailer from "nodemailer";

/**
 * @sendEmail - Sends transactional email via SMTP.
 * Short timeouts are set deliberately: on hosts that block/hang outbound
 * SMTP (Render's free tier included), this fails fast instead of hanging
 * the request for a minute, so callers can treat it as best-effort.
 */
const sendEmail = async function (email, subject, message) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: email,
    subject: subject,
    html: message,
  });
};

export default sendEmail;
