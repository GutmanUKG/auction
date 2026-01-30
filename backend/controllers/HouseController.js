import asyncHandler from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import * as houseModel from '../models/houseModel.js';
import * as lotParticipantModel from '../models/lotParticipantModel.js';
import { db } from '../db.js';

export const addItem = asyncHandler(async (req, res) => {
    const {
        name,
        mainImage,
        prevText,
        text,
        startPrice,
        images,
        country,
        city,
        street,
        address,
        area,
        countRoom,
        year,
        auctionStartDate,
        auctionEndDate
    } = req.body;

    const house = await houseModel.create({
        name,
        mainImage: mainImage || '',
        prevText: prevText || '',
        text: text || '',
        startPrice,
        images: images || [],
        country,
        city,
        street: street || null,
        address: address || null,
        area,
        countRoom,
        year: year || null,
        auctionStartDate: auctionStartDate || null,
        auctionEndDate: auctionEndDate || null,
        isActive: true,
        userId: req.userId
    });

    return res.json(house);
});

export const getAllItems = asyncHandler(async (req, res) => {
    const items = await houseModel.getAll();

    // Фильтровать только активные лоты
    const activeItems = items.filter(item => {
        // Проверка активности
        if (!item.isActive) return false;

        // Дополнительная проверка времени окончания
        if (item.auctionEndDate && new Date(item.auctionEndDate) < new Date()) {
            return false;
        }

        return true;
    });

    // Добавляем информацию об участии для авторизованного пользователя
    if (req.userId) {
        const itemsWithParticipation = await Promise.all(activeItems.map(async (item) => {
            const participant = await db('lot_participants')
                .where({ house_id: item.id, user_id: req.userId })
                .first();

            if (participant) {
                const isWinning = item.winnerUser && item.winnerUser.id === req.userId;
                return {
                    ...item,
                    userParticipation: {
                        isParticipating: true,
                        isWinning: isWinning,
                        lastBidAmount: parseFloat(participant.bid_amount),
                        participatedAt: participant.participated_at
                    }
                };
            }

            return item;
        }));

        return res.json(itemsWithParticipation);
    }

    return res.json(activeItems);
});

export const getItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const item = await houseModel.getById(id);

    if (!item) {
        throw new HttpError(404, 'Объект недвижимости не найден');
    }

    // Увеличиваем счетчик просмотров
    await houseModel.incrementViewsCount(id);

    // Проверяем участие текущего пользователя (если авторизован)
    console.log('getItem: userId =', req.userId, 'for house', id);
    let userParticipation = null;
    if (req.userId) {
        const participant = await db('lot_participants')
            .where({ house_id: id, user_id: req.userId })
            .first();

        if (participant) {
            const isWinning = item.winnerUser && item.winnerUser.id === req.userId;
            userParticipation = {
                isParticipating: true,
                isWinning: isWinning,
                lastBidAmount: parseFloat(participant.bid_amount),
                participatedAt: participant.participated_at
            };
        }
    }

    return res.json({
        ...item,
        userParticipation
    });
});

export const updateItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const item = await houseModel.getById(id);

    if (!item) {
        throw new HttpError(404, 'Объект недвижимости не найден');
    }

    // Проверка прав доступа
    if (item.userId !== req.userId && req.userRole !== 'admin') {
        throw new HttpError(403, 'Нет прав для редактирования');
    }

    const updatedItem = await houseModel.update(id, req.body);
    return res.json(updatedItem);
});

export const deleteItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const item = await houseModel.getById(id);

    if (!item) {
        throw new HttpError(404, 'Объект недвижимости не найден');
    }

    // Проверка прав доступа
    if (item.userId !== req.userId && req.userRole !== 'admin') {
        throw new HttpError(403, 'Нет прав для удаления');
    }

    await houseModel.remove(id);
    return res.json({ success: true, message: 'Объект успешно удален' });
});

export const placeBid = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { bidAmount } = req.body;

    const item = await houseModel.getById(id);

    if (!item) {
        throw new HttpError(404, 'Объект недвижимости не найден');
    }

    // Проверка активности аукциона
    if (!item.isActive) {
        throw new HttpError(400, 'Аукцион завершен');
    }

    // Проверка времени окончания
    if (item.auctionEndDate && new Date(item.auctionEndDate) < new Date()) {
        throw new HttpError(400, 'Время аукциона истекло');
    }

    const currentPrice = item.currentPrice || item.startPrice;

    if (bidAmount <= currentPrice) {
        throw new HttpError(400, 'Ставка должна быть выше текущей цены');
    }

    await houseModel.update(id, {
        currentPrice: bidAmount,
        userCount: item.userCount + 1,
        winnerUser: {
            id: req.userId,
            username: req.userFullName || 'Пользователь'
        }
    });

    // Добавить участника в таблицу lot_participants
    await lotParticipantModel.addParticipant(id, req.userId, bidAmount);

    const updatedItem = await houseModel.getById(id);
    return res.json(updatedItem);
});

// Получить все лоты для админ панели с информацией о пользователях
export const getAllItemsAdmin = asyncHandler(async (req, res) => {
    const { search, country, city } = req.query;

    let query = db('houses')
        .leftJoin('users', 'houses.user_id', 'users.id')
        .select(
            'houses.*',
            'users.full_name as user_full_name',
            'users.email as user_email',
            'users.avatar_url as user_avatar_url'
        );

    // Применяем фильтры
    if (search) {
        query = query.where(function() {
            this.where('houses.name', 'like', `%${search}%`)
                .orWhere('houses.address', 'like', `%${search}%`);
        });
    }

    if (country) {
        query = query.where('houses.country', country);
    }

    if (city) {
        query = query.where('houses.city', city);
    }

    // Сортируем по дате создания (новые первые)
    query = query.orderBy('houses.created_at', 'desc');

    const rows = await query;

    // Форматируем ответ используя логику mapRow из модели
    const houses = rows.map(row => {
        if (!row) return null;
        return {
            id: row.id,
            name: row.name,
            prevText: row.prev_text,
            text: row.text,
            startPrice: parseFloat(row.start_price),
            currentPrice: row.current_price ? parseFloat(row.current_price) : null,
            finishPrice: row.finish_price ? parseFloat(row.finish_price) : null,
            winnerUser: row.winner_user ? JSON.parse(row.winner_user) : [],
            images: row.images ? JSON.parse(row.images) : [],
            mainImage: row.main_image || '',
            country: row.country,
            city: row.city,
            street: row.street,
            address: row.address,
            area: row.area,
            countRoom: row.count_room,
            year: row.year,
            auctionStartDate: row.auction_start_date,
            auctionEndDate: row.auction_end_date,
            isActive: Boolean(row.is_active),
            viewsCount: row.views_count,
            userCount: row.user_count,
            userId: row.user_id,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            user: {
                fullName: row.user_full_name,
                email: row.user_email,
                avatarUrl: row.user_avatar_url
            }
        };
    }).filter(Boolean);

    return res.json({
        houses
    });
});

// Получить статистику по лотам
export const getHouseStats = asyncHandler(async (req, res) => {
    const total = await db('houses').count('id as total').first();
    const withBids = await db('houses').whereNotNull('current_price').count('id as total').first();
    const totalViewsResult = await db('houses').sum('views_count as total').first();

    return res.json({
        total: total.total || 0,
        withBids: withBids.total || 0,
        totalViews: totalViewsResult.total || 0
    });
});

// Получить расширенную статистику для админ-панели
export const getAdminStats = asyncHandler(async (req, res) => {
    // Общее количество лотов
    const totalLotsResult = await db('houses').count('id as count').first();
    const totalLots = totalLotsResult.count || 0;

    // Активные лоты (лоты с текущей ценой или недавно созданные)
    const activeLotsResult = await db('houses')
        .where(function() {
            this.whereNotNull('current_price')
                .orWhere('created_at', '>=', db.raw('DATE_SUB(NOW(), INTERVAL 30 DAY)'));
        })
        .count('id as count')
        .first();
    const activeLots = activeLotsResult.count || 0;

    // Новые лоты за последние 7 дней
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newLotsResult = await db('houses')
        .where('created_at', '>=', oneWeekAgo)
        .count('id as count')
        .first();
    const newLotsThisWeek = newLotsResult.count || 0;

    // Общее количество участников (сумма user_count из всех лотов)
    const totalParticipantsResult = await db('houses').sum('user_count as total').first();
    const totalParticipants = totalParticipantsResult.total || 0;

    return res.json({
        totalLots,
        activeLots,
        newLotsThisWeek,
        totalParticipants
    });
});

