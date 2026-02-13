import express from 'express';
import { register, barbershopRegister, login, getProfile } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/barbershop-register', barbershopRegister);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

export default router;
