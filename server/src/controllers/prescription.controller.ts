import { Response } from 'express';
import { Prescription } from '../models/Prescription.model';
import { Customer } from '../models/Customer.model';
import { Notification } from '../models/Notification.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class PrescriptionController {
  async uploadPrescription(req: AuthRequest, res: Response) {
    try {
      const customer = await Customer.findOne({ userId: req.userId });
      if (!customer) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      const prescription = new Prescription({
        ...req.body,
        customerId: customer._id
      });

      await prescription.save();

      customer.prescriptions.push(prescription._id);
      await customer.save();

      res.status(201).json({
        message: 'Prescription uploaded successfully',
        prescription
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPrescriptions(req: AuthRequest, res: Response) {
    try {
      const { role } = req.user;
      let prescriptions;

      if (role === 'customer') {
        const customer = await Customer.findOne({ userId: req.userId });
        prescriptions = await Prescription.find({ customerId: customer?._id })
          .sort({ createdAt: -1 });
      } else if (role === 'administrator') {
        prescriptions = await Prescription.find()
          .populate('customerId')
          .sort({ createdAt: -1 });
      } else {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(prescriptions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPrescriptionById(req: AuthRequest, res: Response) {
    try {
      const prescription = await Prescription.findById(req.params.id)
        .populate('customerId')
        .populate('medications.productId');

      if (!prescription) {
        return res.status(404).json({ error: 'Prescription not found' });
      }

      res.json(prescription);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async verifyPrescription(req: AuthRequest, res: Response) {
    try {
      const prescription = await Prescription.findById(req.params.id);

      if (!prescription) {
        return res.status(404).json({ error: 'Prescription not found' });
      }

      await prescription.verify(req.user._id);

      // Notify customer
      const customer = await Customer.findById(prescription.customerId);
      if (customer) {
        await Notification.create({
          userId: customer.userId,
          type: 'prescription',
          title: 'Prescription Verified',
          message: 'Your prescription has been verified and approved',
          relatedId: prescription._id,
          relatedModel: 'Prescription',
          priority: 'high'
        });
      }

      res.json({
        message: 'Prescription verified successfully',
        prescription
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
