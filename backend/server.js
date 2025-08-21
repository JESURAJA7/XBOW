import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import route handlers
import connectDB from './src/config/database.js';
import authRoutes from './src/routes/auth.js';
import adminRoutes from './src/routes/admin.js';
import loadRoutes from './src/routes/loads.js';
import vehicleRoutes from './src/routes/vehicles.js';
import paymentRoutes from './src/routes/payments.js';
import podRoutes from './src/routes/pods.js';
import profileRoutes from './src/routes/profile.js';
import subscriptionRoutes from './src/routes/subscription.js';


const router = express.Router();

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security headers
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://xbow.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
}));
app.options('*', cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Body Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/loads', loadRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/pods', podRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/subscription', subscriptionRoutes);


// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'XBOW Logistics API is running',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Something went wrong!',
//   });
// });

// 404 Handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found',
//   });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🩷..Server running on port ${PORT}`);
});
