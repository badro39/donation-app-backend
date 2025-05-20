import { config } from 'dotenv';
import { connection } from 'mongoose';
import connectDB from './config/db.js'; // adjust path if needed
config();
beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await connection.close();
});
