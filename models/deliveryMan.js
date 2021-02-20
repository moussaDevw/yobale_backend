const Sequelize = require('sequelize');
const connection = require('../config/database');

const deliveryman = connection.define('delivery_man', {
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
    fullName: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    image:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    description:{
        type: Sequelize.TEXT,
        allowNull: true,
    },
    allWeek: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    allDay: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    vehicule:{
        type: Sequelize.STRING,
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

module.exports = deliveryman;