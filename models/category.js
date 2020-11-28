const Sequelize = require('sequelize');
const connection = require('./../config/database');

const category = connection.define('category', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    haveSoucategory:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    icon:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
});

module.exports = category;