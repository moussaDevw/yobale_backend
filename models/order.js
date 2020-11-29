const Sequelize = require('sequelize');
const connection = require('./../config/database');

const order = connection.define('order', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    totalAmount: {
        type: Sequelize.Number,
        allowNull: false,
    },
    payed:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
});

module.exports = order;