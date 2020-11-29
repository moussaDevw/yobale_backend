const Sequelize = require('sequelize');
const connection = require('./../config/database');

const delevery = connection.define('delevery', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    time: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    }

});

module.exports = deleverys;