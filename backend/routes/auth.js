import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import { validate, registerSchema, loginSchema } from '../validations/authValidation.js';

const router = express.Router();

router.post('/auth/register', validate(registerSchema), register);
router.post('/auth/login',    validate(loginSchema),    login);
router.get('/auth/me', auth, getMe);

export default router;
