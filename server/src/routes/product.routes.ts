import express from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();
const productController = new ProductController();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authenticate, authorizeRoles('vendor'), productController.createProduct);
router.put('/:id', authenticate, authorizeRoles('vendor'), productController.updateProduct);
router.delete('/:id', authenticate, authorizeRoles('vendor'), productController.deleteProduct);
router.get('/vendor/:vendorId', productController.getVendorProducts);

export default router;
