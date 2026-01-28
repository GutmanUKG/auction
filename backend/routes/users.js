import express from 'express';
import {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserStats
} from '../controllers/userManagementController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import { validate, createUserSchema, updateUserSchema } from '../validations/userValidation.js';

const router = express.Router();

// Все маршруты требуют аутентификации и прав администратора
router.get('/admin/users', auth, adminAuth, getAllUsers);
router.get('/admin/users/stats', auth, adminAuth, getUserStats);
router.get('/admin/users/:id', auth, adminAuth, getUser);
router.post('/admin/users', auth, adminAuth, validate(createUserSchema), createUser);
router.put('/admin/users/:id', auth, adminAuth, validate(updateUserSchema), updateUser);
router.delete('/admin/users/:id', auth, adminAuth, deleteUser);

export default router;
