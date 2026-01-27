/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('houses', function(table) {
        table.integer('year').comment('Год постройки');
        table.string('street', 255).comment('Улица');
        table.string('address', 255).comment('Адрес');
        table.datetime('auction_start_date').comment('Дата и время начала аукциона');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('houses', function(table) {
        table.dropColumn('year');
        table.dropColumn('street');
        table.dropColumn('address');
        table.dropColumn('auction_start_date');
    });
};
