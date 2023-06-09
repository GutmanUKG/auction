//Библиотке шифрования паролей
import bcrypt from "bcrypt";
import UserModel from '../models/User.js';
//Библиотка авторизации через токены
import jwt from "jsonwebtoken";
//Регистрация
export const register = async (req, res) =>{
    try{
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt);
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            phone: req.body.phone,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl
        });
        const user = await doc.save()
        const token = jwt.sign({
            _id: user._id
        },
            'secret',
            {expiresIn: '30d'});
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token
        })
    }catch (err) {
        console.log(err);
        res.status(500).json({
            status: false,
            message: 'Ошибка регистрации'
        })
    }
}

export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({
            email: req.body.email
        })
        if(!user){
            return status(404).json({
                status: false,
                message: 'Не верный логин или пароль (нет такого пользователя)'
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if(!isValidPass){
            return res.status(400).json({
                message: 'Не верный логин или пароль (Не верный пароль)'
            });
        }
        const token = jwt.sign({
            _id: user._id
        },'secret',
            {expiresIn: '30d'}
        )
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token
        })
    }catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка авторизации'
        })
    }
}

export const getMe = async (req, res) => {
    try{
        const user = await UserModel.findById(req.userId)
        if(!user){
            return  res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData
        })
    }catch (err) {
        console.log(err)
        res.status(500).json({
            status: false,
            message: 'Нет доступа'
        })
    }
}