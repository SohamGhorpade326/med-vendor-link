import express from 'express';
import {
  getProducts,
  getVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.get('/', getProducts);
router.get('/vendor', authenticate, requireRole('vendor'), getVendorProducts);
router.post('/', authenticate, requireRole('vendor'), createProduct);
router.put('/:id', authenticate, requireRole('vendor'), updateProduct);
router.delete('/:id', authenticate, requireRole('vendor'), deleteProduct);

export default router;
