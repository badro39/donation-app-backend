// libs
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// middleware
import errorMiddleware from './middleware/error.js';
import sanitizeMiddleware from './middleware/sanitize.js';

// db connection
import connectDB from './config/db.js';

// routes
import donationRoute from './api/donation.js';
import extraRoute from './api/extra.js';
import webhookRoute from './api/webhook.js';

config();
connectDB();

// constants
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: true,
};

// middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);

// routes
app.use('/webhook', webhookRoute);
app.use(express.json());
app.use(sanitizeMiddleware);
app.use('/', donationRoute);
app.use('/extra', extraRoute);

app.use(errorMiddleware);

export default app;
