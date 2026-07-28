import Razorpay from 'razorpay';

/**
 * @razorpay - Single shared Razorpay client instance.
 * Lives in its own module (rather than server.js) so it can be imported by
 * controllers without creating a circular dependency back through app.js.
 */
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});
