import { body } from 'express-validator';

export const  itemCreateValidation = [
    body('name', 'Введите название').isString(),
    body('prevText', 'Описание минимум из 10 символов').optional().isLength({ min: 10 }),
    body('text', 'Описание минимум из 10 символов').optional().isLength({ min: 10 }),
    body('startPrice', 'Заполните начальную цену лота').isNumeric(),
    body('images', 'Изображения должны быть массивом').optional().isArray(),
    body('country', 'Укажите название страны').isLength({ min: 3 }),
    body('city', 'Укажите название населеного пункта').isLength({ min: 3 }),
    body('area', 'Укажите квадратуру в м/кв').isNumeric(),
    body('countRoom', 'Укажите количество комнат').isNumeric(),

]