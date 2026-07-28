// Must be the very first import: every other module in this graph (including
// config/razorpay.js, evaluated transitively through app.js's route imports)
// reads process.env.* at its own import time, so .env has to be loaded before
// any of them are reached — not just before this file's own body runs.
import 'dotenv/config';

import cloudinary from 'cloudinary';

import connectionToDB from './config/dbConnection.js';
import app from './app.js';

const PORT= process.env.PORT || 5000;

/**
 * @Cloudinary configuration for file storage service
 */
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure:process.env.CLOUDINARY_SECURE,
})
app.listen(PORT,async ()=>{
    await connectionToDB();
    console.log(`App is running at  http:localhost:${PORT} `);
})

/**
 * Last-resort safety nets: a rejected promise or thrown error that no
 * try/catch or asyncHandler ever reaches would otherwise crash the process
 * silently (or hang it). Log it loudly instead of losing the signal.
 */
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});