import express from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();
const inventoryController = new InventoryController();

router.get('/', authenticate, authorizeRoles('vendor'), inventoryController.getInventory);
router.get('/low-stock', authenticate, authorizeRoles('vendor'), inventoryController.getLowStock);
router.put('/:productId', authenticate, authorizeRoles('vendor'), inventoryController.updateStock);

export default router;
