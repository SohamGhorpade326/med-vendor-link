import express from 'express';
import { SalesReportController } from '../controllers/salesReport.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();
const salesReportController = new SalesReportController();

router.post('/generate', authenticate, authorizeRoles('vendor'), salesReportController.generateReport);
router.get('/', authenticate, authorizeRoles('vendor'), salesReportController.getReports);
router.get('/:id', authenticate, authorizeRoles('vendor'), salesReportController.getReportById);

export default router;
