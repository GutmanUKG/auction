import { db } from './db.js';

async function testDB() {
    try {
        console.log('Testing database connection...\n');

        // Проверяем пользователей
        const users = await db('users').select('id', 'full_name', 'email', 'role');
        console.log('Users in database:');
        console.table(users);

        // Проверяем дома
        const houses = await db('houses').select('id', 'name', 'city', 'start_price', 'user_id').limit(5);
        console.log('\nHouses in database (first 5):');
        console.table(houses);

        console.log('\n✓ Database connection and data look good!');
        await db.destroy();
    } catch (error) {
        console.error('Error:', error);
        await db.destroy();
    }
}

testDB();
