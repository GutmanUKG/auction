//Переезд на MySql
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('dom_tvoy', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
});

export default sequelize;