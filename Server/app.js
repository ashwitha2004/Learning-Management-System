import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

import errorMiddlware from './middlewares/error.middleware.js';
import courseRoutes from './routes/course.Routes.js'
import miscRoutes from './routes/miscellanous.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import userRoutes from './routes/user.Routes.js'

config();

const app = express();

app.use(helmet({
    // this is a pure JSON/cookie API — no HTML is rendered here, so a
    // restrictive default CSP only gets in the way without protecting anything
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: [process.env.FRONTEND_URL, 'https://learning-management-system-roan.vercel.app'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    })
  );

app.use(cookieParser());

app.use(morgan('dev'));

/**
 * @generalLimiter - Baseline rate limit for the whole API to blunt abusive/scripted traffic.
 */
const isDev = process.env.NODE_ENV !== 'production';

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isDev,
});
/**
 * @authLimiter - Stricter limit on credential-related endpoints to slow brute-force
 * and credential-stuffing attempts against login/register/password-reset.
 * Skipped outside production so local development/testing isn't throttled.
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many attempts, please try again later' },
    skip: () => isDev,
});

app.use('/api', generalLimiter);
app.use('/api/v1/user/login', authLimiter);
app.use('/api/v1/user/register', authLimiter);
app.use('/api/v1/user/reset', authLimiter);

app.use('/ping',function(_req,res){
    res.send('Pong');
})

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/course', courseRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1', miscRoutes);
app.all('*',(_req,res)=>{
    res.status(404).send('OOPS!!  404 page not found ')
})
app.use(errorMiddlware);

export default app;