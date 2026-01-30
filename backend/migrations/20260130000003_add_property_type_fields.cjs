/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('houses', function(table) {
        table.string('property_type', 50).nullable().comment('Тип недвижимости');
        table.boolean('is_new_building').notNullable().defaultTo(false).comment('Новостройка');
        table.boolean('is_under_construction').notNullable().defaultTo(false).comment('В строящихся домах');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('houses', function(table) {
        table.dropColumn('property_type');
        table.dropColumn('is_new_building');
        table.dropColumn('is_under_construction');
    });
};
