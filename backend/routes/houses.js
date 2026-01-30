import express from 'express';
import {
    addItem,
    getAllItems,
    getItem,
    updateItem,
    deleteItem,
    placeBid,
    getAllItemsAdmin,
    getHouseStats,
    getAdminStats
} from '../controllers/HouseController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import optionalAuth from '../middleware/optionalAuth.js';

const router = express.Router();

// Публичные маршруты (с опциональной аутентификацией для показа статуса участия)
router.get('/houses', optionalAuth, getAllItems);
router.get('/houses/:id', optionalAuth, getItem);

// Защищенные маршруты (требуют авторизации)
router.post('/houses', auth, addItem);
router.put('/houses/:id', auth, updateItem);
router.delete('/houses/:id', auth, deleteItem);
router.post('/houses/:id/bid', auth, placeBid);

// Админские маршруты (требуют авторизации и прав администратора)
router.get('/admin/houses', auth, adminAuth, getAllItemsAdmin);
router.get('/admin/houses/stats', auth, adminAuth, getHouseStats);
router.get('/admin/stats', auth, adminAuth, getAdminStats);

export default router;
