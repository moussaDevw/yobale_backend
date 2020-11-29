const Sequelize = require('sequelize');
const connection = require('./../config/database');

const status = connection.define('status', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sector: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    streetName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    buildingNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    nameCompany: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    floor: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    housseNumber: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    codePostal: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    latitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    longitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    latitudeDelta: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    longitudeDelta: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
});

module.exports = status;