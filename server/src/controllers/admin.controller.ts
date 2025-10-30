import { Response } from 'express';
import { User } from '../models/User.model';
import { Vendor } from '../models/Vendor.model';
import { Customer } from '../models/Customer.model';
import { Order } from '../models/Order.model';
import { Product } from '../models/Product.model';
import { Notification } from '../models/Notification.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class AdminController {
  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const { role, search } = req.query;
      const filter: any = {};

      if (role) {
        filter.role = role;
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const users = await User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 });

      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUserStatus(req: AuthRequest, res: Response) {
    try {
      const { isActive } = req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.isActive = isActive;
      await user.save();

      res.json({
        message: 'User status updated successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isActive: user.isActive
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPendingVendors(req: AuthRequest, res: Response) {
    try {
      const vendors = await Vendor.find({ isVerified: false })
        .populate('userId', 'name email');

      res.json(vendors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async verifyVendor(req: AuthRequest, res: Response) {
    try {
      const vendor = await Vendor.findById(req.params.id);

      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found' });
      }

      vendor.isVerified = true;
      await vendor.save();

      // Send notification to vendor
      await Notification.create({
        userId: vendor.userId,
        type: 'system',
        title: 'Vendor Account Verified',
        message: 'Your vendor account has been verified. You can now start selling products.',
        priority: 'high'
      });

      res.json({
        message: 'Vendor verified successfully',
        vendor
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDashboardStats(req: AuthRequest, res: Response) {
    try {
      const totalUsers = await User.countDocuments();
      const totalCustomers = await Customer.countDocuments();
      const totalVendors = await Vendor.countDocuments();
      const totalProducts = await Product.countDocuments({ isActive: true });
      const totalOrders = await Order.countDocuments();
      const pendingVendors = await Vendor.countDocuments({ isVerified: false });

      const recentOrders = await Order.find()
        .populate('customerId', 'userId')
        .populate('vendorId', 'storeName')
        .sort({ createdAt: -1 })
        .limit(10);

      const ordersByStatus = await Order.aggregate([
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 }
          }
        }
      ]);

      const revenue = await Order.aggregate([
        {
          $match: { paymentStatus: 'paid' }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' }
          }
        }
      ]);

      res.json({
        stats: {
          totalUsers,
          totalCustomers,
          totalVendors,
          totalProducts,
          totalOrders,
          pendingVendors,
          totalRevenue: revenue[0]?.total || 0
        },
        ordersByStatus,
        recentOrders
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
