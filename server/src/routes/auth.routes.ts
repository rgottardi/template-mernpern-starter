import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validation.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validation/auth.validation.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh-token', validateRequest(refreshTokenSchema), refreshToken);
router.post('/logout', logout);

export default router; 