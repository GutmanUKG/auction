import express from 'express';
import {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserStats
} from '../controllers/userManagementController.js';
import {
    getParticipatingLots,
    getWonLots,
    getLostLots
} from '../controllers/userLotsController.js';
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

// Маршруты для личного кабинета пользователя (требуют только аутентификации)
router.get('/users/my-lots/participating', auth, getParticipatingLots);
router.get('/users/my-lots/won', auth, getWonLots);
router.get('/users/my-lots/lost', auth, getLostLots);

export default router;
