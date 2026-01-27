import express from 'express';
import {
    addItem,
    getAllItems,
    getItem,
    updateItem,
    deleteItem,
    placeBid
} from '../controllers/HouseController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Публичные маршруты
router.get('/houses', getAllItems);
router.get('/houses/:id', getItem);

// Защищенные маршруты (требуют авторизации)
router.post('/houses', auth, addItem);
router.put('/houses/:id', auth, updateItem);
router.delete('/houses/:id', auth, deleteItem);
router.post('/houses/:id/bid', auth, placeBid);

export default router;
