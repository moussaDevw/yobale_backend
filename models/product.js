const Sequelize = require('sequelize');
const connection = require('./../config/database');

const product = connection.define('product', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    imageUri:{
        type: Sequelize.TEXT,
        allowNull: false,
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
   
});

module.exports = product;