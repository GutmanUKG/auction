import { db } from './db.js';

async function checkTable() {
    try {
        const result = await db.raw('DESCRIBE users');
        console.log('Users table structure:');
        console.table(result[0]);

        await db.destroy();
    } catch (error) {
        console.error('Error:', error);
        await db.destroy();
    }
}

checkTable();
