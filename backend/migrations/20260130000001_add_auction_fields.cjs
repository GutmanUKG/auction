/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('houses', function(table) {
        table.datetime('auction_end_date').nullable().comment('Дата и время окончания аукциона');
        table.boolean('is_active').notNullable().defaultTo(true).comment('Флаг активности лота');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('houses', function(table) {
        table.dropColumn('auction_end_date');
        table.dropColumn('is_active');
    });
};
