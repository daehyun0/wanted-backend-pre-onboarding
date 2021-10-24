const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');

const Article = sequelize.define('Article', {
    pk: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    userPK: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    body: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: false
});

const ArticlePromise = new Promise(async resolve => {
    await Article.sync({ force: true })
    resolve(Article);
})

module.exports = ArticlePromise;