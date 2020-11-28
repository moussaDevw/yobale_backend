const Sequelize = require('sequelize');
const connection = require('./../config/database');

const type = connection.define('menu_shop', {
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
    },
    content: {
        type: Sequelize.STRING,
        allowNull: true,
    },

});

module.exports = type;