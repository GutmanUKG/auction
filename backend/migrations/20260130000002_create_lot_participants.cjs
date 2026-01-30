/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('lot_participants', function(table) {
        table.bigIncrements('id').unsigned().primary();
        table.bigInteger('house_id').unsigned().notNullable().comment('ID лота');
        table.bigInteger('user_id').unsigned().notNullable().comment('ID пользователя');
        table.decimal('bid_amount', 15, 2).notNullable().comment('Сумма ставки');
        table.datetime('participated_at').notNullable().defaultTo(knex.fn.now()).comment('Время участия');

        // Внешние ключи
        table.foreign('house_id').references('id').inTable('houses').onDelete('CASCADE');
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

        // Индексы
        table.index(['house_id', 'user_id'], 'ix_lot_participants_house_user');
        table.index('user_id', 'ix_lot_participants_user_id');
        table.index('house_id', 'ix_lot_participants_house_id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('lot_participants');
};
