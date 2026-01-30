import asyncHandler from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import * as userModel from '../models/userModel.js';
import { hashPassword } from '../utils/hash.js';
import { db } from '../db.js';

// Получить всех пользователей
export const getAllUsers = asyncHandler(async (req, res) => {
    const { role, search } = req.query;

    const filters = {};
    if (role) filters.role = role;
    if (search) filters.search = search;

    const users = await userModel.getAll(filters);
    const total = await userModel.count(filters);

    // Для каждого пользователя получаем информацию о лотах
    const usersWithLots = await Promise.all(users.map(async (user) => {
        // Получаем список лотов, в которых участвует пользователь
        const participatedLots = await db('lot_participants')
            .leftJoin('houses', 'lot_participants.house_id', 'houses.id')
            .where('lot_participants.user_id', user.id)
            .select(
                'houses.id',
                'houses.name',
                'lot_participants.bid_amount',
                'lot_participants.participated_at'
            )
            .orderBy('lot_participants.participated_at', 'desc');

        // Подсчитываем количество уникальных лотов
        const lotsCount = participatedLots.length;

        return {
            ...user,
            participatedLots: participatedLots,
            lotsCount: lotsCount
        };
    }));

    return res.json({
        users: usersWithLots,
        total
    });
});

// Получить одного пользователя
export const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userModel.getById(id);

    if (!user) {
        throw new HttpError(404, 'Пользователь не найден');
    }

    return res.json(user);
});

// Создать пользователя
export const createUser = asyncHandler(async (req, res) => {
    const { email, fullName, phone, password, avatarUrl, role } = req.body;

    const exists = await userModel.getByEmail(email);
    if (exists) {
        throw new HttpError(409, 'Пользователь с таким email уже существует');
    }

    const passwordHash = await hashPassword(password);
    const user = await userModel.create({
        email,
        fullName,
        phone,
        passwordHash,
        avatarUrl,
        role: role || 'user'
    });

    return res.json(user);
});

// Обновить пользователя
export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email, fullName, phone, avatarUrl, role, password } = req.body;

    const user = await userModel.getById(id);
    if (!user) {
        throw new HttpError(404, 'Пользователь не найден');
    }

    // Проверка на дублирование email
    if (email && email !== user.email) {
        const exists = await userModel.getByEmail(email);
        if (exists) {
            throw new HttpError(409, 'Email уже используется');
        }
    }

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (role !== undefined) updateData.role = role;

    // Если передан новый пароль, хешируем его
    if (password) {
        updateData.passwordHash = await hashPassword(password);
    }

    const updatedUser = await userModel.update(id, updateData);
    return res.json(updatedUser);
});

// Удалить пользователя
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Проверка, что админ не удаляет сам себя
    if (parseInt(id) === req.userId) {
        throw new HttpError(400, 'Нельзя удалить свой собственный аккаунт');
    }

    const user = await userModel.getById(id);
    if (!user) {
        throw new HttpError(404, 'Пользователь не найден');
    }

    await userModel.remove(id);
    return res.json({ success: true, message: 'Пользователь успешно удален' });
});

// Получить статистику пользователей
export const getUserStats = asyncHandler(async (req, res) => {
    const total = await userModel.count();
    const admins = await userModel.count({ role: 'admin' });
    const users = await userModel.count({ role: 'user' });

    return res.json({
        total: total,
        admins: admins,
        users: users
    });
});
