import express from 'express';
import { upload, uploadSingleImage, uploadMultipleImages } from '../controllers/uploadController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Защищенные роуты для загрузки изображений (требуют авторизации)
router.post('/upload/image', auth, upload.single('image'), uploadSingleImage);
router.post('/upload/images', auth, upload.array('images', 10), uploadMultipleImages);

export default router;
