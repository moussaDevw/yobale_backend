const Sequelize = require('sequelize');
const connection = require('./../config/database');

const shop = connection.define('shop', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true,
        unique:true,
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    tag:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    tag2:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    bgImage:{
        type: Sequelize.TEXT,
        allowNull: true,
    },
    logo:{
        type: Sequelize.TEXT,
        allowNull: true,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    blocked: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },

});

module.exports = shop;