/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.bigIncrements('id').unsigned().primary();
        table.string('full_name', 255).notNullable();
        table.string('email', 255).notNullable().unique();
        table.string('phone', 32).unique();
        table.string('password_hash', 255).notNullable();
        table.string('avatar_url', 512);
        table.enum('role', ['user', 'admin']).notNullable().defaultTo('user');
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());

        table.index('email', 'ix_users_email');
        table.index('phone', 'ix_users_phone');
        table.index('role', 'ix_users_role');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
