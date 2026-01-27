import { db } from './db.js';

async function dropTables() {
    try {
        console.log('Dropping tables...');

        // Отключаем проверку внешних ключей
        await db.raw('SET FOREIGN_KEY_CHECKS = 0');

        // Удаляем таблицы если они существуют
        await db.raw('DROP TABLE IF EXISTS houses');
        await db.raw('DROP TABLE IF EXISTS users');
        await db.raw('DROP TABLE IF EXISTS knex_migrations');
        await db.raw('DROP TABLE IF EXISTS knex_migrations_lock');

        // Включаем проверку внешних ключей обратно
        await db.raw('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Tables dropped successfully!');
        await db.destroy();
    } catch (error) {
        console.error('Error:', error);
        await db.destroy();
    }
}

dropTables();
