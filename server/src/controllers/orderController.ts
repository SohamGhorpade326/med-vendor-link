import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import CustomerProfile from '../models/CustomerProfile';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const customerProfile = await CustomerProfile.findOne({ user: req.user!.id });
    if (!customerProfile) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    const { items, shippingAddress, subtotal, taxes, total, vendor } = req.body;

    const order = await Order.create({
      customer: customerProfile._id,
      vendor,
      items,
      subtotal,
      taxes,
      total,
      shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'placed'
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const payOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Simulate 80% success rate
    const success = Math.random() > 0.2;

    if (success) {
      order.paymentStatus = 'paid';
      order.orderStatus = 'processing';
      await order.save();

      // Decrease stock for each item
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: -item.quantity }
        });
      }

      res.json({ success: true, order });
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      res.json({ success: false, order });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const customerProfile = await CustomerProfile.findOne({ user: req.user!.id });
    if (!customerProfile) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    const orders = await Order.find({ customer: customerProfile._id })
      .populate('vendor', 'storeName')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
