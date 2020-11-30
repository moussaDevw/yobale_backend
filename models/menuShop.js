const Sequelize = require('sequelize');
const connection = require('./../config/database');

const menu_shop = connection.define('menu_shop', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
});

module.exports = menu_shop;