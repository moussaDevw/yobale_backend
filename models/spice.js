const Sequelize = require('sequelize');
const connection = require('./../config/database');

const spice = connection.define('spice', {
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
        type: Sequelize.TEXT,
        allowNull: true,
    },
    haveAdditionalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: false,
    },
    additionalPrice: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
});

module.exports = spice;