/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('houses', function(table) {
        table.bigIncrements('id').unsigned().primary();
        table.string('name', 255).notNullable();
        table.text('prev_text');
        table.text('text');
        table.decimal('start_price', 15, 2).notNullable();
        table.decimal('current_price', 15, 2);
        table.decimal('finish_price', 15, 2);
        table.json('winner_user');
        table.json('images');
        table.string('main_image', 512);
        table.string('country', 100).notNullable();
        table.string('city', 100).notNullable();
        table.integer('area').notNullable();
        table.integer('count_room').notNullable();
        table.integer('views_count').defaultTo(0);
        table.integer('user_count').defaultTo(0);
        table.bigInteger('user_id').unsigned().notNullable();
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());

        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.index('user_id', 'ix_houses_user_id');
        table.index('city', 'ix_houses_city');
        table.index('country', 'ix_houses_country');
        table.index('created_at', 'ix_houses_created_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('houses');
};
