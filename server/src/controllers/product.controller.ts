import { Request, Response } from 'express';
import { Product } from '../models/Product.model';
import { Inventory } from '../models/Inventory.model';
import { Vendor } from '../models/Vendor.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class ProductController {
  async getAllProducts(req: Request, res: Response) {
    try {
      const { search, category, requiresPrescription } = req.query;
      const filter: any = { isActive: true };

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } }
        ];
      }

      if (category) {
        filter.category = category;
      }

      if (requiresPrescription !== undefined) {
        filter.requiresPrescription = requiresPrescription === 'true';
      }

      const products = await Product.find(filter)
        .populate('vendorId', 'storeName')
        .sort({ createdAt: -1 });

      // Get inventory for each product
      const productsWithInventory = await Promise.all(
        products.map(async (product) => {
          const inventory = await Inventory.findOne({ productId: product._id });
          return {
            ...product.toObject(),
            quantity: inventory?.quantity || 0,
            lowStockThreshold: inventory?.lowStockThreshold || 10
          };
        })
      );

      res.json(productsWithInventory);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const product = await Product.findById(req.params.id)
        .populate('vendorId', 'storeName licenseNumber');

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const inventory = await Inventory.findOne({ productId: product._id });

      res.json({
        ...product.toObject(),
        quantity: inventory?.quantity || 0,
        lowStockThreshold: inventory?.lowStockThreshold || 10
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProduct(req: AuthRequest, res: Response) {
    try {
      const vendor = await Vendor.findOne({ userId: req.userId });
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor profile not found' });
      }

      const { quantity, lowStockThreshold, ...productData } = req.body;

      const product = new Product({
        ...productData,
        vendorId: vendor._id
      });

      await product.save();

      // Create inventory entry
      const inventory = new Inventory({
        productId: product._id,
        vendorId: vendor._id,
        quantity: quantity || 0,
        lowStockThreshold: lowStockThreshold || 10
      });

      await inventory.save();

      // Add product to vendor's products list
      vendor.products.push(product._id);
      await vendor.save();

      res.status(201).json({
        message: 'Product created successfully',
        product: {
          ...product.toObject(),
          quantity: inventory.quantity,
          lowStockThreshold: inventory.lowStockThreshold
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProduct(req: AuthRequest, res: Response) {
    try {
      const vendor = await Vendor.findOne({ userId: req.userId });
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor profile not found' });
      }

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (product.vendorId.toString() !== vendor._id.toString()) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const { quantity, lowStockThreshold, ...productUpdates } = req.body;

      Object.assign(product, productUpdates);
      await product.save();

      if (quantity !== undefined || lowStockThreshold !== undefined) {
        const inventory = await Inventory.findOne({ productId: product._id });
        if (inventory) {
          if (quantity !== undefined) inventory.quantity = quantity;
          if (lowStockThreshold !== undefined) inventory.lowStockThreshold = lowStockThreshold;
          await inventory.save();
        }
      }

      res.json({ message: 'Product updated successfully', product });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProduct(req: AuthRequest, res: Response) {
    try {
      const vendor = await Vendor.findOne({ userId: req.userId });
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor profile not found' });
      }

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (product.vendorId.toString() !== vendor._id.toString()) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      product.isActive = false;
      await product.save();

      res.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getVendorProducts(req: Request, res: Response) {
    try {
      const products = await Product.find({ vendorId: req.params.vendorId, isActive: true });

      const productsWithInventory = await Promise.all(
        products.map(async (product) => {
          const inventory = await Inventory.findOne({ productId: product._id });
          return {
            ...product.toObject(),
            quantity: inventory?.quantity || 0,
            lowStockThreshold: inventory?.lowStockThreshold || 10
          };
        })
      );

      res.json(productsWithInventory);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
