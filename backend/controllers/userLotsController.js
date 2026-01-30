import { db } from '../db.js';

/**
 * Получить лоты, в которых пользователь участвует (активные)
 */
export async function getParticipatingLots(req, res) {
    try {
        const userId = req.userId;

        // Получаем все активные лоты, в которых пользователь делал ставки
        const lots = await db('lot_participants')
            .join('houses', 'lot_participants.house_id', 'houses.id')
            .where('lot_participants.user_id', userId)
            .where('houses.is_active', true)
            .whereNotNull('houses.auction_end_date')
            .where('houses.auction_end_date', '>', db.fn.now())
            .select(
                'houses.id',
                'houses.name',
                'houses.main_image',
                'houses.current_price',
                'houses.auction_start_date',
                'houses.auction_end_date',
                'houses.city',
                'houses.winner_user',
                db.raw('MAX(lot_participants.bid_amount) as my_last_bid'),
                db.raw('MAX(lot_participants.participated_at) as last_bid_time')
            )
            .groupBy('houses.id')
            .orderBy('last_bid_time', 'desc');

        // Добавляем флаг isWinning (лидирую ли я)
        const lotsWithStatus = lots.map(lot => {
            const winnerUser = lot.winner_user ? JSON.parse(lot.winner_user) : null;
            const isWinning = winnerUser && winnerUser.id === userId;

            return {
                id: lot.id,
                name: lot.name,
                mainImage: lot.main_image,
                currentPrice: parseFloat(lot.current_price),
                myLastBid: parseFloat(lot.my_last_bid),
                auctionStartDate: lot.auction_start_date,
                auctionEndDate: lot.auction_end_date,
                city: lot.city,
                isWinning,
                lastBidTime: lot.last_bid_time
            };
        });

        res.json(lotsWithStatus);
    } catch (error) {
        console.error('Error in getParticipatingLots:', error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * Получить выигранные лоты
 */
export async function getWonLots(req, res) {
    try {
        const userId = req.userId;

        // Получаем все лоты, где пользователь является победителем
        const lots = await db('houses')
            .join('lot_participants', 'houses.id', 'lot_participants.house_id')
            .where('lot_participants.user_id', userId)
            .where('houses.is_active', false)
            .whereRaw("JSON_EXTRACT(houses.winner_user, '$.id') = ?", [userId])
            .select(
                'houses.id',
                'houses.name',
                'houses.main_image',
                'houses.finish_price',
                'houses.current_price',
                'houses.auction_start_date',
                'houses.auction_end_date',
                'houses.city',
                'houses.updated_at',
                db.raw('MAX(lot_participants.bid_amount) as my_last_bid')
            )
            .groupBy('houses.id')
            .orderBy('houses.updated_at', 'desc');

        const lotsFormatted = lots.map(lot => ({
            id: lot.id,
            name: lot.name,
            mainImage: lot.main_image,
            finalPrice: parseFloat(lot.finish_price || lot.current_price),
            myLastBid: parseFloat(lot.my_last_bid),
            auctionStartDate: lot.auction_start_date,
            auctionEndDate: lot.auction_end_date,
            city: lot.city,
            wonDate: lot.updated_at
        }));

        res.json(lotsFormatted);
    } catch (error) {
        console.error('Error in getWonLots:', error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * Получить проигранные лоты
 */
export async function getLostLots(req, res) {
    try {
        const userId = req.userId;

        // Получаем все завершенные лоты, в которых участвовал, но не выиграл
        const lots = await db('lot_participants')
            .join('houses', 'lot_participants.house_id', 'houses.id')
            .where('lot_participants.user_id', userId)
            .where('houses.is_active', false)
            .where(function() {
                this.whereRaw("JSON_EXTRACT(houses.winner_user, '$.id') != ?", [userId])
                    .orWhereNull('houses.winner_user');
            })
            .select(
                'houses.id',
                'houses.name',
                'houses.main_image',
                'houses.finish_price',
                'houses.current_price',
                'houses.auction_start_date',
                'houses.auction_end_date',
                'houses.city',
                'houses.winner_user',
                'houses.updated_at',
                db.raw('MAX(lot_participants.bid_amount) as my_last_bid')
            )
            .groupBy('houses.id')
            .orderBy('houses.updated_at', 'desc');

        const lotsFormatted = lots.map(lot => {
            const winnerUser = lot.winner_user ? JSON.parse(lot.winner_user) : null;

            return {
                id: lot.id,
                name: lot.name,
                mainImage: lot.main_image,
                finalPrice: parseFloat(lot.finish_price || lot.current_price),
                myLastBid: parseFloat(lot.my_last_bid),
                auctionStartDate: lot.auction_start_date,
                auctionEndDate: lot.auction_end_date,
                city: lot.city,
                winnerUsername: winnerUser ? winnerUser.username : null,
                lostDate: lot.updated_at
            };
        });

        res.json(lotsFormatted);
    } catch (error) {
        console.error('Error in getLostLots:', error);
        res.status(500).json({ message: error.message });
    }
}
