import User from '../models/User.js';

export const requireActiveSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Subscription lifecycle hook intercept: Check expiry natively
    if (user.subscription.status === 'active' && user.subscription.renewalDate) {
      if (new Date() > new Date(user.subscription.renewalDate)) {
        user.subscription.status = 'expired';
        await user.save();
      }
    }

    // Validate access
    if (user.subscription.status !== 'active' || user.subscription.paymentStatus !== 'paid') {
      return res.status(403).json({ 
        message: 'Active subscription required.', 
        subscription: user.subscription 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error checking subscription' });
  }
};
