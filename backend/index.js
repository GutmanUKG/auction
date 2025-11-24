import express from 'express';

//Загрузка изображений
import multer from 'multer'
//Библиотека для разрешения запросов по портам
import cors from 'cors';

import { userController, lotController } from './controllers/index.js'

import { handleValidationErrors, checkAuth } from './utils/index.js'

import { registerValidation , loginValidation } from './validations/auth.js';

import { itemCreateValidation } from './validations/addItem.js'
import sequelize from './db.js';



sequelize.sync({ alter: true })  // или { force: true } если хочешь пересоздавать таблицы
    .then(() => console.log('MySQL подключён'))
    .catch(err => console.error('Ошибка подключения к MySQL:', err));



const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Ready')
});
//Регистрация / авторизация пользователя
app.post('/auth/register', registerValidation, handleValidationErrors, userController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, userController.login)
app.get('/auth/me', checkAuth, userController.getMe);

// Лоты
app.post('/lots', checkAuth, itemCreateValidation, handleValidationErrors, lotController.addItem)
app.get('/lots', lotController.getAllItems)
app.listen('8888', (err) => {
    if(err){
        return console.log(err)
    }
    console.log('Server Ready')
})