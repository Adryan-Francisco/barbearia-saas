import express from 'express';
import { register, barbershopRegister, login, getProfile, updateProfile, changePassword, requestPasswordReset, resetPassword } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/barbershop-register', barbershopRegister);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/change-password', authMiddleware, changePassword);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
