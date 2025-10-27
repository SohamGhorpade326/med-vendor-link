import { Request, Response } from 'express';
import Product from '../models/Product';
import VendorProfile from '../models/VendorProfile';
import { AuthRequest } from '../middleware/auth';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { q, brand, minPrice, maxPrice, prescription, inStock, sort } = req.query;

    const filter: any = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { composition: { $regex: q, $options: 'i' } }
      ];
    }

    if (brand) {
      filter.brand = { $regex: brand, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (prescription) {
      filter.requiresPrescription = prescription === 'true';
    }

    if (inStock === 'true') {
      filter.quantity = { $gt: 0 };
    }

    let query = Product.find(filter).populate('vendor', 'storeName');

    if (sort === 'price-asc') {
      query = query.sort({ price: 1 });
    } else if (sort === 'price-desc') {
      query = query.sort({ price: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const products = await query;
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getVendorProducts = async (req: AuthRequest, res: Response) => {
  try {
    const vendorProfile = await VendorProfile.findOne({ user: req.user!.id });
    if (!vendorProfile) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const products = await Product.find({ vendor: vendorProfile._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const vendorProfile = await VendorProfile.findOne({ user: req.user!.id });
    if (!vendorProfile) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const expiryDate = new Date(req.body.expiryDate);
    if (expiryDate < new Date()) {
      return res.status(400).json({ error: 'Cannot add expired medicine' });
    }

    const product = await Product.create({
      ...req.body,
      vendor: vendorProfile._id,
      expiryDate
    });

    const populatedProduct = await Product.findById(product._id).populate('vendor', 'storeName');
    res.status(201).json(populatedProduct);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const vendorProfile = await VendorProfile.findOne({ user: req.user!.id });
    if (!vendorProfile) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const product = await Product.findOne({ _id: req.params.id, vendor: vendorProfile._id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (req.body.expiryDate) {
      const expiryDate = new Date(req.body.expiryDate);
      if (expiryDate < new Date()) {
        return res.status(400).json({ error: 'Cannot set expired date' });
      }
      req.body.expiryDate = expiryDate;
    }

    Object.assign(product, req.body);
    await product.save();

    const populatedProduct = await Product.findById(product._id).populate('vendor', 'storeName');
    res.json(populatedProduct);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const vendorProfile = await VendorProfile.findOne({ user: req.user!.id });
    if (!vendorProfile) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const product = await Product.findOneAndDelete({ _id: req.params.id, vendor: vendorProfile._id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
