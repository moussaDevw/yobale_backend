const Sequelize = require('sequelize');
const connection = require('./../config/database');

const delevery_man = connection.define('delevery_man', {
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
        allowNull: false,
        defaultValue:false,
    }

});

module.exports = delevery_man;