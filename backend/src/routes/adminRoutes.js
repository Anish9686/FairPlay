import express from 'express';
import { getSystemStats, executeDraw, getDrawHistory, verifyWinner } from '../controllers/adminController.js';
import { protect, adminCheck } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, adminCheck, getSystemStats);
router.post('/execute-draw', protect, adminCheck, executeDraw);
router.get('/draw-history', protect, adminCheck, getDrawHistory);
router.post('/verify-winner', protect, adminCheck, verifyWinner);

export default router;
