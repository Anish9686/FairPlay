import express from 'express';
import { getUserProfile, subscribeUser, cancelSubscription, simulatePaymentFailure, selectCharity, addScore, getAllCharities, submitProof } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { requireActiveSubscription } from '../middlewares/subMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.post('/subscription/subscribe', protect, subscribeUser);
router.post('/subscription/cancel', protect, cancelSubscription);
router.post('/subscription/fail', protect, simulatePaymentFailure);
router.get('/charities', protect, getAllCharities);
router.put('/charity', protect, selectCharity);
router.post('/submit-proof', protect, submitProof);

// Protected by PRD access control logic
router.post('/scores', protect, requireActiveSubscription, addScore);

export default router;
