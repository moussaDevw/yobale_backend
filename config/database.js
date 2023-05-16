
const config = require('./../config.json');
const mysql = require('mysql2/promise');
const Sequelize  = require('sequelize');
const CONFIG = require('./../config.js');

const dotenv = require('dotenv');
dotenv.config()

// const { user, password, database } = CONFIG.database;
const { host, port, user, password, database } = CONFIG.database;
console.log(host, port, user, password, database)
// module.exports = db = {};

const connexion = new Sequelize(database, user, password, { 
    dialect: 'mysql' ,
    host: host,
    port: port,
    // logging: false,
});


module.exports = connexion;