import express from 'express';
import { PrescriptionController } from '../controllers/prescription.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();
const prescriptionController = new PrescriptionController();

router.post('/', authenticate, authorizeRoles('customer'), prescriptionController.uploadPrescription);
router.get('/', authenticate, prescriptionController.getPrescriptions);
router.get('/:id', authenticate, prescriptionController.getPrescriptionById);
router.post('/:id/verify', authenticate, authorizeRoles('administrator'), prescriptionController.verifyPrescription);

export default router;
