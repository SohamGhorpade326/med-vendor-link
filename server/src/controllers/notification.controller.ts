import { Response } from 'express';
import { Notification } from '../models/Notification.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class NotificationController {
  async getNotifications(req: AuthRequest, res: Response) {
    try {
      const { unreadOnly } = req.query;
      const filter: any = { userId: req.userId };

      if (unreadOnly === 'true') {
        filter.isRead = false;
      }

      const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .limit(50);

      const unreadCount = await Notification.countDocuments({
        userId: req.userId,
        isRead: false
      });

      res.json({ notifications, unreadCount });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async markAsRead(req: AuthRequest, res: Response) {
    try {
      const notification = await Notification.findOne({
        _id: req.params.id,
        userId: req.userId
      });

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      await notification.markAsRead();

      res.json({
        message: 'Notification marked as read',
        notification
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteNotification(req: AuthRequest, res: Response) {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId
      });

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      res.json({ message: 'Notification deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
