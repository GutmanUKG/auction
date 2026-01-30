import { db } from '../db.js';

function mapRow(row) {
    if (!row) return null;
    return {
        id: row.id,
        houseId: row.house_id,
        userId: row.user_id,
        bidAmount: parseFloat(row.bid_amount),
        participatedAt: row.participated_at
    };
}

/**
 * Добавить или обновить участника аукциона
 * @param {number} houseId - ID лота
 * @param {number} userId - ID пользователя
 * @param {number} bidAmount - Сумма ставки
 * @returns {Promise<object>} - Созданная или обновленная запись
 */
export async function addParticipant(houseId, userId, bidAmount) {
    // Проверяем, есть ли уже запись для этого пользователя и лота
    const existing = await db('lot_participants')
        .where({ house_id: houseId, user_id: userId })
        .first();

    if (existing) {
        // Обновляем существующую запись
        await db('lot_participants')
            .where({ id: existing.id })
            .update({
                bid_amount: bidAmount,
                participated_at: db.fn.now()
            });

        return mapRow(await db('lot_participants').where({ id: existing.id }).first());
    } else {
        // Создаем новую запись
        const [id] = await db('lot_participants').insert({
            house_id: houseId,
            user_id: userId,
            bid_amount: bidAmount
        });

        return mapRow(await db('lot_participants').where({ id }).first());
    }
}

/**
 * Получить всех участников аукциона
 * @param {number} houseId - ID лота
 * @returns {Promise<Array>} - Список участников
 */
export async function getParticipantsByHouseId(houseId) {
    const rows = await db('lot_participants')
        .where({ house_id: houseId })
        .orderBy('participated_at', 'desc');

    return rows.map(mapRow);
}

/**
 * Получить все лоты, в которых участвовал пользователь
 * @param {number} userId - ID пользователя
 * @returns {Promise<Array>} - Список участий
 */
export async function getParticipantsByUserId(userId) {
    const rows = await db('lot_participants')
        .where({ user_id: userId })
        .orderBy('participated_at', 'desc');

    return rows.map(mapRow);
}

/**
 * Получить количество уникальных участников лота
 * @param {number} houseId - ID лота
 * @returns {Promise<number>} - Количество участников
 */
export async function getParticipantCount(houseId) {
    const result = await db('lot_participants')
        .where({ house_id: houseId })
        .count('* as count')
        .first();

    return parseInt(result.count);
}
