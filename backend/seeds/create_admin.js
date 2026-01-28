import 'dotenv/config';
import { db } from '../db.js';
import { hashPassword } from '../utils/hash.js';

async function createAdmin() {
    try {
        const email = 'admin@example.com';
        const password = 'admin123';
        const fullName = 'Администратор';

        console.log('Проверка существующего администратора...');

        // Проверяем, есть ли уже пользователь с таким email
        const existingUser = await db('users').where({ email }).first();

        if (existingUser) {
            console.log('Пользователь с email', email, 'уже существует.');
            console.log('Обновляю роль на admin...');

            await db('users')
                .where({ email })
                .update({ role: 'admin' });

            console.log('✓ Роль успешно обновлена на admin');
        } else {
            console.log('Создаю нового администратора...');

            const passwordHash = await hashPassword(password);

            await db('users').insert({
                full_name: fullName,
                email: email,
                password_hash: passwordHash,
                role: 'admin',
                phone: null,
                avatar_url: null
            });

            console.log('✓ Администратор успешно создан');
        }

        console.log('\n========================================');
        console.log('Данные для входа:');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Ошибка при создании администратора:', error);
        process.exit(1);
    }
}

createAdmin();
