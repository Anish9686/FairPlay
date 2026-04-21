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

// Middleware
app.use(express.json());
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
  credentials: true
}));
app.use(helmet());

// Database Connection
mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB Connected');
  
  // Create mock charities if they don't exist
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
}).catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
