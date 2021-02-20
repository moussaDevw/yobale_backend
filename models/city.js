const Sequelize = require('sequelize');
const connection = require('../config/database');

const city = connection.define('city', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },

});

module.exports = city;