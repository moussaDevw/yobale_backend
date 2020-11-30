
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config.json');
const mysql = require('mysql2/promise');

const dotenv = require('dotenv');

const db = require('./config/database')


/****************     MODELS      *****************/

const Adress = require(('./models/adress'));
const Authorisation = require('./models/authorisation');
const Category = require('./models/category');
const Delivery = require('./models/delivery');
const DeliveryMan = require('./models/deliveryMan');
const MenuShope = require('./models/menuShop');
const Order = require('./models/order');
const OrderProduct = require('./models/orderProduct');
const Product = require('./models/product');

const Shop = require('./models/shop');
const SousCategory = require('./models/sousCategory');
const Spice = require('./models/spice');
const Status = require('./models/status');
const Type = require('./models/type');
const User = require('./models/user');

/****************     ROUTES      *****************/


const adress = require('./routes/adress');
const categories = require('./routes/category');
const types = require('./routes/types');
const authorisations = require('./routes/authorisation');
const sign = require('./routes/auth')
const deliveryMan = require('./routes/deliveryMan')
const shop = require('./routes/shop')
const menu = require('./routes/menu')
const product = require('./routes/product')



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


    app.use('/adress', adress)
    app.use('/category', categories)
    app.use('/type', types)
    app.use('/menu-shop', menu)
    app.use('/product', product)
    app.use('/authorisation', authorisations)
    app.use('/delevery-man', deliveryMan)
    app.use('/shop', shop)
    app.use(sign)


/****************     ASSOCIATIONS      *****************/


    User.belongsTo(Type, {
        foreignKey: {
            allowNull: false,
        },
    });


    // User.belongsTo(Shop, {
    //     foreignKey: {
    //         allowNull: false,
    //     },
    // });

        // User.belongsTo(DeliveryMan, {
    //     foreignKey: {
    //         allowNull: false,
    //     },
    // });

    Authorisation.belongsTo(Type, {
        foreignKey: {
            allowNull: false,
        },
    });


    SousCategory.belongsTo(Category, {
        foreignKey: {
            allowNull: false,
        }, 
    });

    Shop.belongsTo(Category, {
        foreignKey: {
            allowNull: false,
        }, 
    });

    Shop.belongsTo(Category, {
        foreignKey: {
            allowNull: false,
        }, 
    });

    Shop.belongsTo(SousCategory, {
        foreignKey: {
            allowNull: true,
        },
    });

    Adress.belongsTo(User, {
        foreignKey: {
            allowNull: false,
        },
    });


    MenuShope.belongsTo(Shop, {
        foreignKey: {
            allowNull: false,
        },
    });

    Product.belongsTo(MenuShope, {
        foreignKey: {
            allowNull: false,
        },
    });
    Spice.belongsTo(Product, {
        foreignKey: {
            allowNull: false,
        },
    });

    Order.belongsTo(User, {
        foreignKey: {
            allowNull: false,
        },
    });

    OrderProduct.belongsTo(Order, {
        foreignKey: {
            allowNull: false,
        },
    });

    OrderProduct.belongsTo(Product, {
        foreignKey: {
            allowNull: false,
        },
    });

    Delivery.belongsTo(Order, {
        foreignKey: {
            allowNull: false,
        },
    });

    Delivery.belongsTo(DeliveryMan, {
        foreignKey: {
            allowNull: false,
        },
    });

    Delivery.belongsTo(Status, {
        foreignKey: {
            allowNull: false,
        },
    });
    Delivery.belongsTo(Adress, {
        foreignKey: {
            allowNull: false,
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
//     console.log("admin type created")
// Authorisation.bulkCreate([{
// name: "authorisation",
// canGet: true,
// canPost: true,
// canPut: true,
// canPatch: true,
// canDelete: true,
// typeId: Type.id
// },
// {
//     name: "category",
//     canGet: true,
//     canPost: true,
//     canPut: true,
//     canPatch: true,
//     canDelete: true,
//     typeId: Type.id
//     },
//     {
//     name: "type",
//     canGet: true,
//     canPost: true,
//     canPut: true,
//     canPatch: true,
//     canDelete: true,
//     typeId: Type.id
//     },
// ]);
// })
//             .catch((err) => {console.log("admin type created")})

//           })
//           .catch((err) => {
//               console.log('error: ', err)
//           })