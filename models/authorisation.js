const Sequelize = require('sequelize');
const connection = require('./../config/database');

const type = connection.define('authorisation', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    canGet: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    canPost: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    canPut: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    canPatch: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    canDelete: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
});

module.exports = type;