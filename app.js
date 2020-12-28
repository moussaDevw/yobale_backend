
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config.json');
const mysql = require('mysql2/promise');

const dotenv = require('dotenv');

const db = require('./config/database')


const fileUpload = require('express-fileupload');


const http = require('http');
const socketio = require('socket.io');


/****************     MODELS      *****************/

const Adress = require(('./models/adress'));
const Authorisation = require('./models/authorisation');
const Category = require('./models/category');
const Delivery = require('./models/delivery');

const MenuShope = require('./models/menuShop');
const Order = require('./models/order');
const OrderProduct = require('./models/orderProduct');
const Product = require('./models/product');

const Shop = require('./models/shop');
const Deliveryman = require('./models/deliveryman');
const SousCategory = require('./models/sousCategory');
const Spice = require('./models/spice');
const Status = require('./models/status');
const Type = require('./models/type');
const User = require('./models/user');
const City = require('./models/city');

/****************     ROUTES      *****************/


const adress = require('./routes/adress');
const categories = require('./routes/category');
const types = require('./routes/types');
const cities = require('./routes/city');
const authorisations = require('./routes/authorisation');
const sign = require('./routes/auth')
const deliveryMan = require('./routes/deliveryMan')
const shop = require('./routes/shop')
const menu = require('./routes/menu')
const product = require('./routes/product')



/****************     INIT APP      *****************/

    const app = express();

    const server = http.createServer(app);

    app.use(cors())
    app.use(express.static(path.join(__dirname, 'public')))

    // express.static(root, [options])

    app.use(bodyParser.raw({
        type: 'application/vnd.custom-type',
        limit: '10mb',
        extended: true
    }))
    app.use(bodyParser.text({
        type: 'text/html',
        limit: '10mb',
        extended: true
    }))

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

    app.use(bodyParser.urlencoded({ extended: true }))
    dotenv.config()
    app.use(fileUpload());


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
    app.use('/city', cities)
    app.use('/menu-shop', menu)
    app.use('/product', product)
    app.use('/authorisation', authorisations)
    app.use('/delivery-man', deliveryMan)
    app.use('/shop', shop)
    app.use(sign)


/****************     ASSOCIATIONS      *****************/


    User.belongsTo(Type, {
        foreignKey: {
            allowNull: false,
        },
    });

    Adress.belongsTo(User, {
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
            allowNull: true,
        },
    });

    Category.hasMany(SousCategory, {
        foreignKey: {
            allowNull: true,
        }, 
    });

    Shop.belongsTo(Category, {
        foreignKey: {
            allowNull: false,
        }, 
    });

    Deliveryman.belongsTo(City, {
        foreignKey: {
            allowNull: false,
        }, 
    });

    Shop.belongsTo(City, {
        foreignKey: {
            allowNull: false,
        }, 
    });


    Shop.belongsTo(SousCategory, {
        foreignKey: {
            allowNull: true,
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

    MenuShope.hasMany(Product, {
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

    Delivery.belongsTo(Deliveryman, {
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


const io = socketio(server);

io.on('connect', socket => {
   console.log('connected', socket.id)

});

  server.listen(5000, () => console.log('Server ON ' + 5000))
// db.sync()
db.sync({force: true})
          .then(result => {
            Type.create({
                name: "superAdmin",
                active: true,
            })
            .then((Type) => {
    console.log("admin type created")
Authorisation.bulkCreate([{
name: "authorisation",
canGet: true,
canPost: true,
canPut: true,
canPatch: true,
canDelete: true,
typeId: Type.id
},
{
    name: "category",
    canGet: true,
    canPost: true,
    canPut: true,
    canPatch: true,
    canDelete: true,
    typeId: Type.id
    },
    {
    name: "type",
    canGet: true,
    canPost: true,
    canPut: true,
    canPatch: true,
    canDelete: true,
    typeId: Type.id
    },
]);
})
            .catch((err) => {console.log("admin type created")})

          })
          .catch((err) => {
              console.log('error: ', err)
          })