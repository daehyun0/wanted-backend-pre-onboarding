const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');

const User = sequelize.define('User', {
    pk: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: false
});

const UserPromise = new Promise(async resolve => {
    await User.sync({ alter: true })
    resolve(User);
})

module.exports = UserPromise;