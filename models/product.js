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
    content: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    prix: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
   
});

module.exports = product;