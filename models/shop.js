const Sequelize = require('sequelize');
const connection = require('./../config/database');

const shop = connection.define('shop', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }

});

module.exports = shop;