import express from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();
const orderController = new OrderController();

router.post('/', authenticate, authorizeRoles('customer'), orderController.createOrder);
router.get('/', authenticate, orderController.getOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.put('/:id/status', authenticate, authorizeRoles('vendor'), orderController.updateOrderStatus);
router.post('/:id/cancel', authenticate, orderController.cancelOrder);

export default router;
