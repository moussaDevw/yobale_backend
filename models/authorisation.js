const Sequelize = require('sequelize');
const connection = require('./../config/database');

const authorisation = connection.define('authorisation', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:false,
    },
    canGet: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:false,
    },
    canPost: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:false,
    },
    canPut: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:false,
    },
    canPatch: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:false,
    },
    canDelete: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:false,
    },
});

module.exports = authorisation;