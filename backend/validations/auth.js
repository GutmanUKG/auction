import { body } from 'express-validator';

export const loginValidation = [
    body('email' ,'Не верный формат почты').isEmail(),
    body('password', 'Пароль минимум 5 символов').isLength({min: 5}),
];
export const registerValidation = [
    body('email' ,'Не верный формат почты').isEmail(),
    body('password', 'Пароль минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Имя минимум 3 символа').isLength({min: 3}),
    body('avatarUrl', 'Не корректный URL').optional().isURL(),
];