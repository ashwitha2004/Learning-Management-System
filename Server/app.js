import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import contactRoutes from "./routes/contact.routes.js";
import errorMiddlware from './middlewares/error.middleware.js';
import courseRoutes from './routes/course.Routes.js'
import miscRoutes from './routes/miscellanous.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import userRoutes from './routes/user.Routes.js'




config();

const app = express();


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(morgan('dev'));

app.use('/ping',function(_req,res){
    res.send('Pong');
})
app.use("/api/v1", contactRoutes);
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/course', courseRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1', miscRoutes);
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
app.use(errorMiddlware);

export default app;