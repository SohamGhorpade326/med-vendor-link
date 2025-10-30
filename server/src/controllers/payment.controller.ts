import { Response } from 'express';
import { Payment } from '../models/Payment.model';
import { Customer } from '../models/Customer.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class PaymentController {
  async getPayments(req: AuthRequest, res: Response) {
    try {
      const { role } = req.user;
      let payments;

      if (role === 'customer') {
        const customer = await Customer.findOne({ userId: req.userId });
        payments = await Payment.find({ customerId: customer?._id })
          .populate('orderId')
          .sort({ createdAt: -1 });
      } else if (role === 'administrator') {
        payments = await Payment.find()
          .populate('customerId')
          .populate('orderId')
          .sort({ createdAt: -1 });
      } else {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPaymentById(req: AuthRequest, res: Response) {
    try {
      const payment = await Payment.findById(req.params.id)
        .populate('orderId')
        .populate('customerId');

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async refundPayment(req: AuthRequest, res: Response) {
    try {
      if (req.user.role !== 'administrator') {
        return res.status(403).json({ error: 'Access denied' });
      }

      const payment = await Payment.findById(req.params.id);

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      const success = await payment.refund();

      if (!success) {
        return res.status(400).json({ error: 'Cannot refund this payment' });
      }

      res.json({
        message: 'Payment refunded successfully',
        payment
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
