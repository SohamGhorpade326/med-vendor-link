import express from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();
const paymentController = new PaymentController();

router.get('/', authenticate, paymentController.getPayments);
router.get('/:id', authenticate, paymentController.getPaymentById);
router.post('/:id/refund', authenticate, paymentController.refundPayment);

export default router;
