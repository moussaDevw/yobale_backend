const Sequelize = require('sequelize');
const connection = require('./../config/database');

const order = connection.define('order_product', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    quantity: {
        type: Sequelize.Number,
        allowNull: false,
    },
    
});

module.exports = order;