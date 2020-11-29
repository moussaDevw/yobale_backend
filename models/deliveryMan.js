const Sequelize = require('sequelize');
const connection = require('./../config/database');

const delevery_man = connection.define('delevery_man', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    weeklyColaboration: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    dailyColaboration: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    }

});

module.exports = delevery_man;