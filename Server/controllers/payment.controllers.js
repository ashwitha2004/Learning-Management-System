import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import Razorpay from "razorpay";

import asyncHandler from "../middlewares/asyncHAndler.middleware.js";
import Payment from "../models/payment.model.js";
import User from "../models/usermodel.js";
import AppError from "../utils/error.util.js";



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const getRaZorpayApikey = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Razorpay API key",
    key: process.env.RAZORPAY_KEY_ID,
  });
});

/**
 * BUY SUBSCRIPTION
 */
export const buySubscription = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("Unauthorized, please login", 401));
  }

  if (user.role === "ADMIN") {
    return next(new AppError("Admin cannot purchase subscription", 400));
  }

  const subscription = await razorpay.subscriptions.create({
    plan_id: process.env.RAZORPAY_PLAN_ID,
    customer_notify: 1,
    total_count: 12,
  });

  user.subscription.id = subscription.id;
  user.subscription.status = subscription.status;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Subscribed successfully",
    subscription_id: subscription.id,
  });
});

/**
 * VERIFY SUBSCRIPTION
 */
export const verifySubscription = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const { razorpay_payment_id, razorpay_signature } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("Unauthorized, please login", 401));
  }

  const subscriptionId = user.subscription.id;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(`${razorpay_payment_id}|${subscriptionId}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return next(new AppError("Payment verification failed", 400));
  }

  await Payment.create({
    razorpay_payment_id,
    razorpay_signature,
    razorpay_subscription_id: subscriptionId,
  });

  user.subscription.status = "active";
  await user.save();

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
  });
});

/**
 * CANCEL SUBSCRIPTION
 */
export const cancelSubscription = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("Unauthorized", 401));
  }

  const subscriptionId = user.subscription.id;

  await razorpay.subscriptions.cancel(subscriptionId);

  user.subscription.status = "cancelled";

  await user.save();

  res.status(200).json({
    success: true,
    message: "Subscription cancelled successfully",
  });
});
