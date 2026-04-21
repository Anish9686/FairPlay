import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['public', 'auth', 'admin'], default: 'auth' },
  
  subscription: {
    status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'inactive' },
    plan: { type: String, enum: ['monthly', 'yearly', null], default: null },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    startDate: { type: Date },
    renewalDate: { type: Date }
  },
  
  charityChosen: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity', default: null },
  charityPercentage: { type: Number, default: 10 },
  
  scores: [{
    date: { type: Date, required: true },
    score: { type: Number, min: 1, max: 45, required: true },
    stableford: { type: Boolean, default: true }
  }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);
