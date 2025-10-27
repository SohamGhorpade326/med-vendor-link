import express from 'express';
import { createOrder, payOrder, getMyOrders } from '../controllers/orderController';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, requireRole('customer'), createOrder);
router.post('/:id/pay', authenticate, requireRole('customer'), payOrder);
router.get('/my', authenticate, requireRole('customer'), getMyOrders);

export default router;
