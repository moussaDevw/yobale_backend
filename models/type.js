const Sequelize = require('sequelize');
const connection = require('./../config/database');

const type = connection.define('type', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },

});

module.exports = type;