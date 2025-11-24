// import mongoose from 'mongoose';
import { DataTypes } from 'sequelize';
import sequelize from '../db.js'
const User = sequelize.define('User', {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        unique: true,
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatarUrl: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
});

export default User;