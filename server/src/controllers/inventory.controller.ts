import { Response } from 'express';
import { Inventory } from '../models/Inventory.model';
import { Vendor } from '../models/Vendor.model';
import { Product } from '../models/Product.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class InventoryController {
  async getInventory(req: AuthRequest, res: Response) {
    try {
      const vendor = await Vendor.findOne({ userId: req.userId });
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor profile not found' });
      }

      const inventory = await Inventory.find({ vendorId: vendor._id })
        .populate('productId');

      res.json(inventory);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getLowStock(req: AuthRequest, res: Response) {
    try {
      const vendor = await Vendor.findOne({ userId: req.userId });
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor profile not found' });
      }

      const inventory = await Inventory.find({ vendorId: vendor._id })
        .populate('productId');

      const lowStockItems = inventory.filter(item => item.checkLowStock());

      res.json(lowStockItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateStock(req: AuthRequest, res: Response) {
    try {
      const { quantity } = req.body;
      const vendor = await Vendor.findOne({ userId: req.userId });

      if (!vendor) {
        return res.status(404).json({ error: 'Vendor profile not found' });
      }

      const inventory = await Inventory.findOne({
        productId: req.params.productId,
        vendorId: vendor._id
      });

      if (!inventory) {
        return res.status(404).json({ error: 'Inventory not found' });
      }

      await inventory.updateStock(quantity);

      res.json({
        message: 'Stock updated successfully',
        inventory
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
