import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { Customer } from '../models/Customer.model';
import { Vendor } from '../models/Vendor.model';
import { Administrator } from '../models/Administrator.model';
import { AuthRequest } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name, role, storeName, licenseNumber, address } = req.body;

      // Validate required fields
      if (!email || !password || !name || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Create user
      const user = new User({ email, password, name, role });
      await user.save();

      // Create role-specific profile
      if (role === 'customer') {
        const customer = new Customer({ userId: user._id });
        await customer.save();
      } else if (role === 'vendor') {
        if (!storeName || !licenseNumber || !address) {
          return res.status(400).json({ error: 'Vendor details required' });
        }
        const vendor = new Vendor({
          userId: user._id,
          storeName,
          licenseNumber,
          address
        });
        await vendor.save();
      } else if (role === 'administrator') {
        const admin = new Administrator({
          userId: user._id,
          permissions: ['view_reports']
        });
        await admin.save();
      }

      // Generate token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const user = await User.findOne({ email });
      if (!user || !user.isActive) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = req.user;
      let profile = null;

      if (user.role === 'customer') {
        profile = await Customer.findOne({ userId: user._id });
      } else if (user.role === 'vendor') {
        profile = await Vendor.findOne({ userId: user._id });
      } else if (user.role === 'administrator') {
        profile = await Administrator.findOne({ userId: user._id });
      }

      res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone
        },
        profile
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { name, phone } = req.body;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (name) user.name = name;
      if (phone) user.phone = phone;

      await user.save();

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async logout(req: AuthRequest, res: Response) {
    res.json({ message: 'Logout successful' });
  }
}
