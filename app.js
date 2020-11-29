
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config.json');
const mysql = require('mysql2/promise');

const dotenv = require('dotenv');

const db = require('./config/database')

/****************     ROUTES      *****************/


const categories = require('./routes/category');
const types = require('./routes/types');
const authorisations = require('./routes/authorisation');
const sign = require('./routes/auth')


/****************     MODELS      *****************/

const Adress = require(('./models/adress'));
const Authorisation = require('./models/authorisation');
const Category = require('./models/category');
const Delivery = require('./models/delivery');
const DeliveryMan = require('./models/deliveryMan');
const MenuShope = require('./models/menuShop');
const Order = require('./models/order');
const OrderProduct = require('./models/orderProduct');
const product = require('./models/product');

const Shop = require('./models/shop');
const SousCategory = require('./models/sousCategory');
const Status = require('./models/status');
const Type = require('./models/type');
const User = require('./models/user');

/****************     INIT APP      *****************/

const app = express();

app.use(cors())
// app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
dotenv.config()


    initialize();
    async function initialize() {
        // create db if it doesn't already exist
        const { host, port, user, password, database } = config.database;
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    }


/****************     USE ROUTES      *****************/


app.use('/category',categories)
app.use('/type', types)
app.use('/authorisation', authorisations)
app.use(sign)


/****************     ASSOCIATIONS      *****************/


User.belongsTo(Type, {
    foreignKey: {
        allowNull: false,
    },
    onDelete: 'CASCADE'
});

Authorisation.belongsTo(Type, {
    foreignKey: {
        allowNull: false,
    },
    onDelete: 'CASCADE'
});

Shop.belongsTo(User, {
    foreignKey: {
        allowNull: false,
    },
    onDelete: 'CASCADE',
});

SousCategory.belongsTo(Category, {
    foreignKey: {
        allowNull: false,
    }, 
    onDelete: 'CASCADE',
});

Shop.belongsTo(Category, {
    foreignKey: {
        allowNull: false,
    }, 
    onDelete: 'CASCADE',
});

Shop.belongsTo(Category, {
    foreignKey: {
        allowNull: false,
    }, 
    onDelete: 'CASCADE',
});

Shop.belongsTo(SousCategory, {
    foreignKey: {
        allowNull: true,
    },
});



/****************     LISTENNG TO PORT       *****************/


app.listen(5000, () => console.log('Server ON'))
// db.sync()
// db.sync({force: true})
//           .then(result => {
//             Type.create({
//                 name: "admin",
//                 active: true,
//             })
//             .then((Type) => {
    // console.log("admin type created")
// Authorisation.create({
// name: "shop",
// canGet: true,
// canPost: true,
// canPut: true,
// canPatch: true,
// canDelete: true,
// typeId: Type.id
// })
//})
//             .catch((err) => {console.log("admin type created")})

//           })
//           .catch((err) => {
//               console.log('error: ', err)
//           })