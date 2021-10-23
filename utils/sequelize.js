const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite

module.exports = sequelize;