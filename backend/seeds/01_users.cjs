const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Удаляем существующие записи
  await knex('houses').del();
  await knex('users').del();

  // Создаём хеш пароля
  const passwordHash = await bcrypt.hash('password123', 10);

  // Добавляем пользователей
  await knex('users').insert([
    {
      id: 1,
      full_name: 'Администратор',
      email: 'admin@mail.ru',
      phone: '+77771234567',
      password_hash: passwordHash,
      avatar_url: null,
      role: 'admin'
    },
    {
      id: 2,
      full_name: 'Иван Иванов',
      email: 'ivan@mail.ru',
      phone: '+77772234567',
      password_hash: passwordHash,
      avatar_url: null,
      role: 'user'
    },
    {
      id: 3,
      full_name: 'Мария Петрова',
      email: 'maria@mail.ru',
      phone: '+77773234567',
      password_hash: passwordHash,
      avatar_url: null,
      role: 'user'
    }
  ]);
};
