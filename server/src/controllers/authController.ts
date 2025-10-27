import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email })
  .select('+password')
  .populate('vendorProfile')
  .populate('customerProfile');

if (!user) return res.status(401).json({ error: 'Invalid credentials' });

// ✅ Cast for TS only
const userDoc = user as unknown as { password: string } & typeof user;

const isMatch = await bcrypt.compare(password, userDoc.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: String(user._id),
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile:
          user.role === 'vendor' ? (user as any).vendorProfile : (user as any).customerProfile,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id)
      .populate('vendorProfile')
      .populate('customerProfile');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      profile:
        user.role === 'vendor' ? (user as any).vendorProfile : (user as any).customerProfile,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error' });
  }
};
