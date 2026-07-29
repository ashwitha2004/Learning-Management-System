import asyncHandler from '../middlewares/asyncHAndler.middleware.js';
import User from '../models/usermodel.js';
import AppError from '../utils/error.util.js';
import sendEmail from '../utils/sendEmail.js';

/**
 * @CONTACT_US
 * Handles the submission of the "Contact Us" form by the user.
 * Sends an email to the admin with the user's details.
 */
export const contactUs = asyncHandler(async (req, res, next) => {
    const { name, email, message } = req.body;
  
    if (!name || !email || !message) {
      return next(new AppError('Name, Email, Message are required'));
    }
  
    const subject = 'Contact Us Form';
    const textMessage = `${name} - ${email} <br /> ${message}`;

    // Best-effort: don't fail the user-facing request if the mail provider
    // is slow/unreachable (e.g. blocked outbound SMTP on some hosts) — log
    // it and move on rather than surfacing an error for something the user
    // has no way to act on.
    sendEmail(process.env.CONTACT_US_EMAIL, subject, textMessage).catch((error) => {
      console.error('Contact form email failed to send:', error.message || error);
    });

    res.status(200).json({
      success: true,
      message: 'Your request has been submitted successfully',
    });
});
/**
 * @USER_STATS
 * Fetches the statistics of the users (total users and active subscribers).
 */
export const userStats = asyncHandler(async (req, res, next) => {
    const allUsersCount = await User.countDocuments();
  
    const subscribedUsersCount = await User.countDocuments({
      'subscription.status': 'active', // subscription.status means we are going inside an object and we have to put this in quotes
    });
  
    res.status(200).json({
      success: true,
      message: 'All registered users count',
      allUsersCount,
      subscribedUsersCount,
    });
  });