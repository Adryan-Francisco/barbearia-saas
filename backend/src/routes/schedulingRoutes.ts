import express from 'express';
import {
  createAppointment,
  cancelAppointment,
  listAppointments,
  getAvailableSlotsByBarbershop
} from '../controllers/schedulingController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/appointments', authMiddleware, createAppointment);
router.delete('/appointments/:appointmentId', authMiddleware, cancelAppointment);
router.get('/appointments', authMiddleware, listAppointments);
router.get('/available-slots', getAvailableSlotsByBarbershop);

export default router;
