import User from '../models/User.js';
import Charity from '../models/Charity.js';
import Draw from '../models/Draw.js';

// Get user profile including scores and selected charity
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('charityChosen', 'name description');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Refresh expiry logic locally on fetch for UI
    if (user.subscription.status === 'active' && user.subscription.renewalDate) {
      if (new Date() > new Date(user.subscription.renewalDate)) {
        user.subscription.status = 'expired';
        await user.save();
      }
    }

    // Check if user is a winner in the latest draw
    const latestDraw = await Draw.findOne().sort({ createdAt: -1 });
    let winData = null;
    if (latestDraw) {
      const winnerTicket = latestDraw.winners.find(w => w.user.toString() === user._id.toString());
      if (winnerTicket) {
        winData = {
          drawId: latestDraw._id,
          monthName: latestDraw.monthName,
          year: latestDraw.year,
          ticketId: winnerTicket._id,
          tier: winnerTicket.tier,
          verificationStatus: winnerTicket.verificationStatus,
          proofText: winnerTicket.proofText
        };
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscription: user.subscription,
      charityChosen: user.charityChosen,
      charityPercentage: user.charityPercentage,
      scores: user.scores,
      winData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Handle Subscription
export const subscribeUser = async (req, res) => {
  const { plan } = req.body; // 'monthly' or 'yearly'
  try {
    const user = await User.findById(req.user.id);
    user.subscription.status = 'active';
    user.subscription.paymentStatus = 'paid';
    user.subscription.plan = plan || 'monthly';
    user.subscription.startDate = new Date();
    
    // Simulate +30 or +365 days
    const renewalDays = plan === 'yearly' ? 365 : 30;
    user.subscription.renewalDate = new Date(new Date().getTime() + renewalDays * 24 * 60 * 60 * 1000);
    
    await user.save();
    res.json({ message: 'Subscription Activated', subscription: user.subscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.subscription.status = 'inactive';
    await user.save();
    res.json({ message: 'Subscription Cancelled', subscription: user.subscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const simulatePaymentFailure = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.subscription.paymentStatus = 'failed';
    user.subscription.status = 'inactive';
    await user.save();
    res.json({ message: 'Payment Sim Failed', subscription: user.subscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Charity and Preferences
export const selectCharity = async (req, res) => {
  const { charityId, charityPercentage } = req.body;
  try {
    const user = await User.findById(req.user.id);
    
    if (charityId) {
       const charity = await Charity.findById(charityId);
       if (!charity) return res.status(404).json({ message: 'Charity not found' });
       user.charityChosen = charityId;
    }
    
    if (charityPercentage) {
       user.charityPercentage = charityPercentage;
    }

    await user.save();
    res.json({ message: 'Preferences updated successfully', charityChosen: user.charityChosen, charityPercentage: user.charityPercentage });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllCharities = async (req, res) => {
  try {
    const charities = await Charity.find({});
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add Score with validation and FIFO logic
export const addScore = async (req, res) => {
  const { date, score, stableford } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // 1. Edge Case: Validate range
    if (score < 1 || score > 45) {
      return res.status(400).json({ message: "Score must be between 1 and 45 (Stableford format)" });
    }

    const inputDate = new Date(date);
    const inputDateStr = inputDate.toISOString().split('T')[0];

    // 2. Edge Case: Duplicate Date validation
    const isDuplicate = user.scores.some(
      s => new Date(s.date).toISOString().split('T')[0] === inputDateStr
    );
    if (isDuplicate) {
      return res.status(400).json({ message: "Score for this date already exists." });
    }

    // 3. Push and Sort Chronologically (oldest to newest)
    user.scores.push({ date: inputDate, score, stableford: stableford !== undefined ? stableford : true });
    user.scores.sort((a, b) => new Date(a.date) - new Date(b.date)); 

    // 4. FIFO logic: Keep ONLY the latest 5
    if (user.scores.length > 5) {
      // The first element is the oldest because of sorting ascending
      user.scores.shift();
    }

    await user.save();
    res.status(200).json({ message: "Score saved successfully", scores: user.scores });
  } catch (error) {
    console.error("Add score error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const submitProof = async (req, res) => {
  const { drawId, ticketId, proofText } = req.body;
  try {
    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });
    
    const winnerObj = draw.winners.id(ticketId);
    if (!winnerObj || winnerObj.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Invalid ticket or permissions' });
    }
    
    winnerObj.proofText = proofText;
    await draw.save();
    
    res.json({ message: 'Proof submitted', verificationStatus: winnerObj.verificationStatus });
  } catch (error) {
    res.status(500).json({ message: 'Server error submitting proof' });
  }
};
