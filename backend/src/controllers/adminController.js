import User from '../models/User.js';
import Draw from '../models/Draw.js';

export const getSystemStats = async (req, res) => {
  try {
    const users = await User.find({}).select('name email subscription.status');
    const activeSubscribers = users.filter(u => u.subscription?.status === 'active').length;
    res.json({ totalUsers: users.length, activeSubscribers, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const executeDraw = async (req, res) => {
  const { monthName, year } = req.body;
  if (!monthName || !year) return res.status(400).json({ message: 'Provide monthName and year' });

  try {
    // 1. Lock execution if already run
    const existingDraw = await Draw.findOne({ monthName, year });
    if (existingDraw) {
      return res.status(400).json({ message: 'Draw already executed for this month.' });
    }

    // 2. Fetch eligible users
    const eligibleUsers = await User.find({ 'subscription.status': 'active', 'subscription.paymentStatus': 'paid' });
    if (eligibleUsers.length === 0) return res.status(400).json({ message: "No eligible subscribers found." });

    // 3. Shuffle array natively and assign tiers
    const shuffled = eligibleUsers.sort(() => 0.5 - Math.random());
    const winners = [];
    
    // Assign 1 user to tier 5, 2 to tier 4, 3 to tier 3 (bounded by array size)
    if (shuffled.length > 0) winners.push({ user: shuffled[0]._id, tier: 5 });
    if (shuffled.length > 1) winners.push({ user: shuffled[1]._id, tier: 4 });
    if (shuffled.length > 2) winners.push({ user: shuffled[2]._id, tier: 4 });
    if (shuffled.length > 3) winners.push({ user: shuffled[3]._id, tier: 3 });
    if (shuffled.length > 4) winners.push({ user: shuffled[4]._id, tier: 3 });
    if (shuffled.length > 5) winners.push({ user: shuffled[5]._id, tier: 3 });

    // 4. Save Draw
    const newDraw = await Draw.create({ monthName, year, winners });
    await newDraw.populate('winners.user', 'name email');
    res.status(200).json({ message: "Draw complete!", drawData: newDraw });
  } catch (error) {
    res.status(500).json({ message: 'Server error during draw execution' });
  }
};

export const getDrawHistory = async (req, res) => {
  try {
    const draws = await Draw.find({}).sort({ createdAt: -1 }).populate('winners.user', 'name email');
    res.json(draws);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching draws' });
  }
};

export const verifyWinner = async (req, res) => {
  const { drawId, winnerId, verificationStatus } = req.body;
  try {
    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });
    
    const winnerObj = draw.winners.id(winnerId);
    if (!winnerObj) return res.status(404).json({ message: 'Winner not found in draw' });
    
    winnerObj.verificationStatus = verificationStatus;
    await draw.save();
    
    await draw.populate('winners.user', 'name email');
    res.json({ message: 'Winner updated', drawData: draw });
  } catch (error) {
    res.status(500).json({ message: 'Server error modifying verification' });
  }
};
