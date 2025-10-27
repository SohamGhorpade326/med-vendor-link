// server/src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';

dotenv.config();

export const app = express();

// In Vercel (same origin), CORS is usually not needed.
// Keep it permissive to be safe if you open API separately.
app.use(cors({ origin: '*'}));
app.use(express.json());

// ❌ Remove disk uploads on Vercel (ephemeral FS)
// app.use('/uploads', express.static('uploads'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'MediHub API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// --- Singleton Mongo connection for serverless ---
let conn: Promise<typeof mongoose> | null = null;

export function connectDB() {
  if (!conn) {
    const uri = process.env.MONGODB_URI!;
    conn = mongoose.connect(uri);
  }
  return conn;
}
