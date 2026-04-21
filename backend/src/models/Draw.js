import mongoose from 'mongoose';

const winnerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tier: { type: Number, enum: [3, 4, 5] },
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending' },
  proofText: { type: String, default: null }
});

const drawSchema = new mongoose.Schema({
  monthName: { type: String, required: true },
  year: { type: Number, required: true },
  winners: [winnerSchema]
}, { timestamps: true });

export default mongoose.model('Draw', drawSchema);
