import { Response } from 'express';
import { Order } from '../models/Order.model';
import { Customer } from '../models/Customer.model';
import { Vendor } from '../models/Vendor.model';
import { Inventory } from '../models/Inventory.model';
import { Payment } from '../models/Payment.model';
import { Notification } from '../models/Notification.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class OrderController {
  async createOrder(req: AuthRequest, res: Response) {
    try {
      const customer = await Customer.findOne({ userId: req.userId });
      if (!customer) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      const { vendorId, items, shippingAddress, paymentMethod } = req.body;

      // Validate inventory
      for (const item of items) {
        const inventory = await Inventory.findOne({ productId: item.productId });
        if (!inventory || inventory.quantity < item.quantity) {
          return res.status(400).json({
            error: `Insufficient stock for ${item.name}`
          });
        }
      }

      // Create order
      const order = new Order({
        customerId: customer._id,
        vendorId,
        items,
        shippingAddress
      });

      order.calculateTotal();
      await order.save();

      // Update inventory
      for (const item of items) {
        const inventory = await Inventory.findOne({ productId: item.productId });
        if (inventory) {
          await inventory.updateStock(-item.quantity);
        }
      }

      // Create payment
      const payment = new Payment({
        orderId: order._id,
        customerId: customer._id,
        amount: order.total,
        paymentMethod
      });

      const paymentSuccess = await payment.processPayment();
      
      if (paymentSuccess) {
        order.paymentStatus = 'paid';
        await order.save();
      }

      // Add order to customer
      customer.orders.push(order._id);
      await customer.save();

      // Add order to vendor
      const vendor = await Vendor.findById(vendorId);
      if (vendor) {
        vendor.orders.push(order._id);
        await vendor.save();

        // Send notification to vendor
        await Notification.create({
          userId: vendor.userId,
          type: 'order',
          title: 'New Order Received',
          message: `You have received a new order #${order._id}`,
          relatedId: order._id,
          relatedModel: 'Order',
          priority: 'high'
        });
      }

      res.status(201).json({
        message: 'Order placed successfully',
        order,
        payment
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOrders(req: AuthRequest, res: Response) {
    try {
      const { role } = req.user;
      let orders;

      if (role === 'customer') {
        const customer = await Customer.findOne({ userId: req.userId });
        orders = await Order.find({ customerId: customer?._id })
          .populate('vendorId', 'storeName')
          .sort({ createdAt: -1 });
      } else if (role === 'vendor') {
        const vendor = await Vendor.findOne({ userId: req.userId });
        orders = await Order.find({ vendorId: vendor?._id })
          .populate('customerId')
          .sort({ createdAt: -1 });
      } else {
        orders = await Order.find()
          .populate('customerId')
          .populate('vendorId', 'storeName')
          .sort({ createdAt: -1 });
      }

      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOrderById(req: AuthRequest, res: Response) {
    try {
      const order = await Order.findById(req.params.id)
        .populate('customerId')
        .populate('vendorId', 'storeName licenseNumber');

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateOrderStatus(req: AuthRequest, res: Response) {
    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const vendor = await Vendor.findOne({ userId: req.userId });
      if (!vendor || order.vendorId.toString() !== vendor._id.toString()) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await order.updateStatus(status);

      // Send notification to customer
      const customer = await Customer.findById(order.customerId);
      if (customer) {
        await Notification.create({
          userId: customer.userId,
          type: 'order',
          title: 'Order Status Updated',
          message: `Your order #${order._id} is now ${status}`,
          relatedId: order._id,
          relatedModel: 'Order',
          priority: 'medium'
        });
      }

      res.json({ message: 'Order status updated', order });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async cancelOrder(req: AuthRequest, res: Response) {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.orderStatus !== 'placed') {
        return res.status(400).json({ error: 'Cannot cancel order in current status' });
      }

      await order.updateStatus('cancelled');

      // Restore inventory
      for (const item of order.items) {
        const inventory = await Inventory.findOne({ productId: item.productId });
        if (inventory) {
          await inventory.updateStock(item.quantity);
        }
      }

      // Refund payment
      const payment = await Payment.findOne({ orderId: order._id });
      if (payment && payment.status === 'completed') {
        await payment.refund();
      }

      res.json({ message: 'Order cancelled successfully', order });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
