
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const CONFIG = require('./config.js');
const mysql = require('mysql2/promise');

const dotenv = require('dotenv');

const db = require('./config/database')


const fileUpload = require('express-fileupload');

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


const http = require('http');
const socketio = require('socket.io');


/****************     MODELS      *****************/

const Adress = require(('./models/adress'));
// const Authorisation = require('./models/authorisation');
const Category = require('./models/category');

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
const order = require('./routes/order');
// const authorisations = require('./routes/authorisation');
const sign = require('./routes/auth')
const deliveryMan = require('./routes/deliveryMan')
const shop = require('./routes/shop')
const menu = require('./routes/menu')
const user = require('./routes/users')
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
        try {
            const { host, port, user, password, database } = CONFIG.database;
            const connection = await mysql.createConnection({ host, port, user, password });
            // await connection.query(`DROP DATABASE IF EXISTS \`${database}\`;`);
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        } catch (error) {
           console.log(error) 
        }
    }

/****************     USE ROUTES      *****************/


    app.use('/adress', adress)
    app.use('/category', categories)
    app.use('/type', types)
    app.use('/city', cities)
    app.use('/menu-shop', menu)
    app.use('/product', product)
    app.use('/order', order)
    // app.use('/authorisation', authorisations)
    app.use('/delivery-man', deliveryMan)
    app.use('/shop', shop)
    app.use('/user', user)
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
    User.hasMany(Adress, {
        foreignKey: {
            allowNull: true,
        },
    });

    Adress.belongsTo(City, {
        foreignKey: {
            allowNull: true,
        },
    });
    City.hasOne(Adress, {
        foreignKey: {
            allowNull: true,
        },
    });

    User.hasOne(Shop, {
        foreignKey: {
            allowNull: true,
        },
    });
    Shop.belongsTo(User, {
        foreignKey: {
            allowNull: true,
        },
    });

    Deliveryman.belongsTo(User, {
        foreignKey: {
            allowNull: true,
        },
    });
    User.hasOne(Deliveryman, {
        foreignKey: {
            allowNull: true,
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

    User.hasMany(Order, {
        foreignKey: {
            allowNull: false,
        },
    });
    Order.belongsTo(Shop, {
        foreignKey: {
            allowNull: false,
        },
    });
    Shop.hasMany(Order, {
        foreignKey: {
            allowNull: false,
        },
    });

    OrderProduct.belongsTo(Order, {
        foreignKey: {
            allowNull: false,
        },
    });
    Order.hasMany(OrderProduct, {
        foreignKey: {
            allowNull: false,
        },
    });
    Order.belongsTo(Adress, {
        foreignKey: {
            allowNull: false,
        },
    });

    Order.belongsTo(Status, {
        foreignKey: {
            allowNull: false,
        },
    });

    Order.belongsTo(Deliveryman, {
        foreignKey: {
            allowNull: true,
        },
    });

    OrderProduct.belongsTo(Product, {
        foreignKey: {
            allowNull: false,
        },
    });



/****************     LISTENNG TO PORT       *****************/


const io = socketio(server);

io.on('connect', socket => {
//    console.log('connected', socket.id)

});

  server.listen(process.env.PORT, () => console.log('Server ON ' + process.env.PORT))
//     db.sync().then(() => {
//         console.log("database connected");
//     })
// .catch((err) => {
//     console.log(err)
// })
/* 
ALTER TABLE orders
ADD CONSTRAINT `orders_ibfk_2`
FOREIGN KEY (`shopId`) REFERENCES `shops` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
*/
  if(false){

    db.sync({force: true})
          .then(result => {
            Type.bulkCreate([
                {
                    name: "super admin",
                    active: true,
                },
                {
                    name: "admin",
                    active: true,
                },
                {
                    name: "client",
                    active: true,
                },
                {
                    name: "magasin / restaurant",
                    active: true,
                },
                {
                    name: "livreur",
                    active: true,
                },
            ])
            .then( async (Type) => {
                const salt = await bcrypt.genSalt(10);
                let hashedPassword = await bcrypt.hash("yobalapp.com", salt);
                User.create({ 
                    fullName : "admin admin", 
                    email : "admin@admin.com", 
                    phone: "+2213112111", 
                    password: hashedPassword, 
                    active: 1, 
                    typeId: 1
                });
                Status.bulkCreate([
                    {
                        name: "En attente de confirmation",
                        active: true,
                    },
                    {
                        name: "En cours de preparation",
                        active: true,
                    },
                    {
                        name: "En livraison",
                        active: true,
                    },
                    {
                        name: "Bien livrer",
                        active: true,
                    },
                    {
                        name: "Annuler",
                        active: true,
                    },

        
                ])
            })
            .catch((err) => {})

          })
          .catch((err) => {
            //   console.log('error: ', err)
          })
  }
