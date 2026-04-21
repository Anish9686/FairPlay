import mongoose from 'mongoose';

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  totalAllocations: { type: Number, default: 0 } // Tracks platform donations
});

export default mongoose.model('Charity', charitySchema);
