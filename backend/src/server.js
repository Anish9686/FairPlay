import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import Charity from './models/Charity.js';

dotenv.config();

const app = express();

// ✅ Trust proxy (important for Render/Vercel)
app.set('trust proxy', 1);

// ✅ Middleware
app.use(express.json());

// ✅ CORS (Production + Local + Safe)
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:5173'
    ];

    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Security
app.use(helmet());

// ✅ Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');

    // Seed mock charities (only once)
    const count = await Charity.countDocuments();
    if (count === 0) {
      const mockCharities = [
        { name: 'Golf For Good', description: 'Promoting youth golf programs' },
        { name: 'Fairway Friends', description: 'Supporting disabled golfers' },
        { name: 'Green Earth Golf', description: 'Environmental sustainability in golf courses' }
      ];

      await Charity.insertMany(mockCharities);
      console.log('Mock charities initialized');
    }
  })
  .catch(err => console.error('MongoDB Error:', err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});