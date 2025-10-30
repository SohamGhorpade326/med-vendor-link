import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import inventoryRoutes from './routes/inventory.routes';
import prescriptionRoutes from './routes/prescription.routes';
import paymentRoutes from './routes/payment.routes';
import notificationRoutes from './routes/notification.routes';
import salesReportRoutes from './routes/salesReport.routes';
import adminRoutes from './routes/admin.routes';

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medihub';
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/sales-reports', salesReportRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MediHub API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
});

export default app;
