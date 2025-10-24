import asyncHandler from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signJwt } from '../utils/jwt.js';
import { getByEmail, getById, getAuthRowByEmail, create as createUser } from '../models/userModel.js';

export const register = asyncHandler(async (req, res) => {
    const { email, fullName, phone, password, avatarUrl } = req.body;

    const exists = await getByEmail(email);
    if (exists) throw new HttpError(409, 'Пользователь с таким email уже существует');

    const passwordHash = await hashPassword(password);
    const user = await createUser({ email, fullName, phone, passwordHash, avatarUrl, role: 'user' });

    const token = signJwt({ id: user.id, role: user.role }, { expiresIn: '30d' });
    return res.json({ ...user, token });
});

export const login = asyncHandler(async (req, res) => {
    console.log(`Запрос авторизации ${req.body.email}`)
    const { email, password } = req.body;

    const authRow = await getAuthRowByEmail(email);
    if (!authRow) throw new HttpError(404, 'Неверный логин или пароль');

    const ok = await comparePassword(password, authRow.password_hash);
    if (!ok) throw new HttpError(400, 'Неверный логин или пароль');

    const user = await getById(authRow.id);
    const token = signJwt({ id: user.id, role: user.role }, { expiresIn: '30d' });

    return res.json({ ...user, token });
});

export const getMe = asyncHandler(async (req, res) => {
    const user = await getById(req.userId);
    if (!user) throw new HttpError(404, 'Пользователь не найден');
    return res.json(user);
});
