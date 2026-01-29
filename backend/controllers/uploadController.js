import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Настройка хранилища для multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../public/uploads');

        // Создаем директорию, если она не существует
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Генерируем уникальное имя файла
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'house-' + uniqueSuffix + ext);
    }
});

// Фильтр для проверки типа файла
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Допускаются только изображения (JPEG, PNG, GIF, WebP)'));
    }
};

// Настройка multer
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB максимум
    },
    fileFilter: fileFilter
});

// Контроллер для загрузки одного изображения
export const uploadSingleImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Файл не загружен' });
        }

        // Возвращаем имя файла (без пути, т.к. frontend будет использовать getImgUrl)
        res.json({
            success: true,
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Контроллер для загрузки нескольких изображений
export const uploadMultipleImages = (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Файлы не загружены' });
        }

        const files = req.files.map(file => ({
            filename: file.filename,
            path: `/uploads/${file.filename}`
        }));

        res.json({
            success: true,
            files: files
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
