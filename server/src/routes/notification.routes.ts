import express from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();
const notificationController = new NotificationController();

router.get('/', authenticate, notificationController.getNotifications);
router.put('/:id/read', authenticate, notificationController.markAsRead);
router.delete('/:id', authenticate, notificationController.deleteNotification);

export default router;
