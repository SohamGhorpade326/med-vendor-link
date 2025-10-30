import express from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();
const adminController = new AdminController();

router.get('/users', authenticate, authorizeRoles('administrator'), adminController.getAllUsers);
router.put('/users/:id/status', authenticate, authorizeRoles('administrator'), adminController.updateUserStatus);
router.get('/vendors/pending', authenticate, authorizeRoles('administrator'), adminController.getPendingVendors);
router.put('/vendors/:id/verify', authenticate, authorizeRoles('administrator'), adminController.verifyVendor);
router.get('/dashboard', authenticate, authorizeRoles('administrator'), adminController.getDashboardStats);

export default router;
