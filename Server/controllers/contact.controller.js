import asyncHandler from "../middlewares/asyncHAndler.middleware.js";
import sendEmail from "../utils/sendEmail.js";

export const contactUs = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  await sendEmail(
    process.env.SMTP_FROM_EMAIL,
    "Contact Form Message",
    `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  );

  res.status(200).json({
    success: true,
    message: "Message sent successfully",
  });
});
