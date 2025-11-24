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
        const user = await UserModel.create({
            email: req.body.email,
            fullName: req.body.fullName,
            phone: req.body.phone,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl
        });
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
    try {
        const user = await UserModel.findOne({
            where: { email: req.body.email },
        });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Пользователь не найден',
            });
        }


        // Здесь уже должен быть Sequelize-объект, а не Mongoose _doc
        const isValidPass = await bcrypt.compare(
            req.body.password,
            user.passwordHash
        );

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль (неверный пароль)',
            });
        }

        const token = jwt.sign({ id: user.id }, 'secret', {
            expiresIn: '30d',
        });

        const { passwordHash, ...userData } = user.toJSON();

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.error('🔥 Ошибка в login:', err);
        res.status(500).json({
            message: 'Ошибка авторизации',
        });
    }
};



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