import asyncHandler from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import * as houseModel from '../models/houseModel.js';

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
        auctionStartDate
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
        userId: req.userId
    });

    return res.json(house);
});

export const getAllItems = asyncHandler(async (req, res) => {
    const items = await houseModel.getAll();
    return res.json(items);
});

export const getItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const item = await houseModel.getById(id);

    if (!item) {
        throw new HttpError(404, 'Объект недвижимости не найден');
    }

    // Увеличиваем счетчик просмотров
    await houseModel.incrementViewsCount(id);

    return res.json(item);
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

    const currentPrice = item.currentPrice || item.startPrice;

    if (bidAmount <= currentPrice) {
        throw new HttpError(400, 'Ставка должна быть выше текущей цены');
    }

    await houseModel.update(id, {
        currentPrice: bidAmount,
        userCount: item.userCount + 1
    });

    const updatedItem = await houseModel.getById(id);
    return res.json(updatedItem);
});

