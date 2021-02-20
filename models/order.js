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
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    amountWay:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    deliveryAmount:{
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    payed:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
});

module.exports = order;