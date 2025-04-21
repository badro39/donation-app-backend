// libs
import express from 'express';
import cors from 'cors';
import {config} from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// middleware
import errorMiddleware from './middleware/error.js';

// db connection
import connectDB from './config/db.js';

// routes
import donationRoute from "./api/donation.js";
import webhookRoute from "./api/webhook.js";

config();
connectDB()

// constants
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

// middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);

app.use("/webhook", webhookRoute)
app.use(express.json());
app.use("/", donationRoute);

app.use(errorMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log("Server is running on port " + PORT);
})