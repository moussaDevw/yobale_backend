const Sequelize = require('sequelize');
const connection = require('./../config/database');

const delevery = connection.define('delevery', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    time: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:false,
    }

});

module.exports = delevery;