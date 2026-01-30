import { db } from '../db.js';
import * as houseModel from '../models/houseModel.js';

/**
 * Сервис для управления аукционами
 */
class AuctionService {
    constructor(io) {
        this.io = io;
    }

    /**
     * Проверить и завершить истекшие аукционы
     */
    async checkExpiredAuctions() {
        try {
            // Найти все активные аукционы с истекшим временем
            const expiredAuctions = await db('houses')
                .where('is_active', true)
                .where('auction_end_date', '<', db.fn.now())
                .whereNotNull('auction_end_date')
                .select('id');

            console.log(`Найдено ${expiredAuctions.length} истекших аукционов`);

            for (const auction of expiredAuctions) {
                await this.finishAuction(auction.id);
            }
        } catch (error) {
            console.error('Ошибка при проверке истекших аукционов:', error);
        }
    }

    /**
     * Завершить аукцион
     * @param {number} houseId - ID лота
     */
    async finishAuction(houseId) {
        try {
            console.log(`Завершение аукциона для лота ${houseId}`);

            const house = await houseModel.getById(houseId);

            if (!house) {
                console.error(`Лот ${houseId} не найден`);
                return;
            }

            // Установить is_active = false
            // Установить finish_price = current_price
            // winner_user уже должен быть установлен через placeBid
            await houseModel.updateStatus(houseId, false, house.currentPrice || house.startPrice);

            console.log(`Аукцион для лота ${houseId} завершен. Финальная цена: ${house.currentPrice || house.startPrice}`);

            // Эмитить событие через Socket.IO
            if (this.io) {
                this.io.emit('auctionFinished', {
                    id: houseId,
                    finishPrice: house.currentPrice || house.startPrice,
                    winnerUser: house.winnerUser
                });

                console.log(`Socket.IO событие 'auctionFinished' отправлено для лота ${houseId}`);
            }
        } catch (error) {
            console.error(`Ошибка при завершении аукциона для лота ${houseId}:`, error);
        }
    }
}

export default AuctionService;
