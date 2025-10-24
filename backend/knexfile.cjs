require('dotenv').config();

module.exports = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        charset: 'utf8mb4'
    },
    migrations: { tableName: 'knex_migrations', directory: __dirname + '/migrations' },
    seeds: { directory: __dirname + '/seeds' }
};
