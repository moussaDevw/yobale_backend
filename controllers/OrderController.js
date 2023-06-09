
const Order = require('./../models/order');
const User = require('./../models/user');

const OrderProduct = require('./../models/orderProduct');
const Product = require('./../models/product');
const Shop = require('./../models/shop');
const Custmer = require('./../models/user');
const Status = require('./../models/status');
const DeliveryMan = require('./../models/deliveryman');
const Adress = require('./../models/adress');
const Users = require('./../models/user');
const  { admin } = require( './../util/firebase-config')

const {  validationResult} = require('express-validator');

exports.getAllElement = (req, res) => {
    try {
        Order.findAll({
            include:[
                {model: Shop},
                {model: Custmer},
                {model: Status},
                {model: DeliveryMan},
            ]
        })
        .then((orders) => {
            res.status(200).json({error: false, orders })
        })
        .catch(err => {
            // console.log(err)
            res.status(404).json({ 
            error: true, err, message: 'orders not found !' 
        })})
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}

exports.getAllShopElement = async (req, res) => {
    try {

        let thisShop = await Shop.findOne({where: { userId: req.user.id }})
        Order.findAll({
            where:{
                shopId: thisShop.id,
                deleted:0
            },
            include: [
                {model: Adress},
                {model: Status},
            ]
        })
        .then((orders) => {
            res.status(200).json({error: false, orders })
        })
        .catch(err => {
            // console.log(err)
            res.status(404).json({ 
            error: true, err, message: 'orders not found !' 
        })})
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}

exports.getOneShopElement = async (req, res) => {
    try {

        let thisShop = await Shop.findOne({where: { userId: req.user.id }})
        Order.findOne({
            include: [
                {model: OrderProduct, include: [{model: Product}]},
                {model: Status},
            ],
            where:{
                shopId: thisShop.id,
                deleted:0,
                id: req.params.id
            },
           
        })
        .then((orders) => {
            res.status(200).json({error: false, orders })
        })
        .catch(err => {
            // console.log(err)
            res.status(404).json({ 
            error: true, err, message: 'orders not found !' 
        })})
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}


exports.getAllCustmerElement =async (req, res) => {
    try {
        let orders= await Order.findAll({
            where:{
                userId: req.user.id,
                deleted:0
            },
            include : [
                {model: OrderProduct, include: [{model: Product}]},
                {model: Status},
                // {
                //     model: OrderProduct,
                // }
            ]
        })
        if(!orders) return  res.status(404).json({ 
            error: true, err, message: 'order not found !' 
        })
        return res.status(200).json({error: false, orders })

        // .then((orders) => {
        //     res.status(200).json({error: false, orders })
        // })
        // .catch(err => {
        //     // console.log(err)
        //    })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}

exports.store = async (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }
    
        let { 
            name, 
            totalAmount, 
            amountWay,
            deliveryAmount,
            shopId,
            adressId,
            orderProducts,
        } = req.body;
        let ServerAmmount = 0;
        orderProducts.map((op)=> {
            ServerAmmount= ServerAmmount + op.price * op.quantity;
        })
        let thisShop = await Shop.findByPk(shopId);
        let thisShopUser = await User.findByPk(thisShop.userId);
        if(!thisShop) return res.status(400).json({ error: true, message: 'Please check the data for order' });
        let addedOrder = await Order.create({
            name,
            totalAmount, 
            amountWay,
            deliveryAmount,
            adressId,
            payed:false,
            statusId:1,
            shopId,
            userId: req.user.id,
        })
        if(!addedOrder) return res.status(400).json({ error: true, err, message: 'Please check the data for order' });
        


        let filtredProduct =[]
        orderProducts.map((op, index)=> {
            // if(!op.quantity) op.quantity = 1;
            op.orderId = addedOrder.id
            op.productId = op.id
            filtredProduct[index] = {orderId: addedOrder.id, productId: op.id, quantity: op.quantity, name: op.name }
            return op
        })

        let addedOrderProduct = await OrderProduct.bulkCreate(filtredProduct)

        if(!addedOrderProduct) return res.status(400).json({ error: true, message: 'On a pas pus enregistrer les produits de cette commande' });
        const registrationToken = thisShopUser.token;
        const options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
          };
        
        const message = "Vous avez une nouvelle commande pour " + orderProducts.length + " produits."
        const message_notification = {
            notification: {
               title: "Nouvelle commande",
               body: message
            }
            };        
            try {
                admin.messaging().sendToDevice(registrationToken, message_notification, options)
                .then( response => {
          
                  //    res.status(200).send("Notification sent successfully")
                 
                })
                .catch( error => {
                    console.log(error);
                });
            } catch (error) {
                
            }
        
            
        return res.status(201).json({ error: false, addedOrder });
 
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}

exports.updateElement = async (req, res) => {
    try {
        let { 
            name, 
            totalAmount, 
            amountWay,
            deliveryAmount,
            shopId,
        } = req.body;

        let updatedElement = Order.update({
            name, 
            totalAmount, 
            amountWay,
            deliveryAmount,
            shopId,
        }, {
            where: { id: req.params.id }
        })
        if(!updatedElement) return res.status(400).json({ error: true, message: "bad request !" })

        let updatedMenu = await Order.findByPk(req.params.id);

        
        return res.status(202).json({ error: false, updatedMenu });
      
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
   
}

exports.showOneElement = async (req, res) => {
    try {
        let order = await Order.findByPk(req.params.id, {include: [{model: Adress},
            {model: Status}, {model: User}, {model: Shop}]});
        res.status(200).json({error: false, order})
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }      
}


exports.confirmOrder = async (req, res) => {
    try {

        let thisShop = await Shop.findOne({where: { userId: req.user.id }})
        Order.update(
            {
                statusId: 2,
            },
            {
            where:{
                shopId: thisShop.id,
                deleted:0,
                id: req.params.id
            },
           
        })
        .then( async (order) => {
            let thisOrder = await Order.findByPk(req.params.id);
            let thisClient = await User.findByPk(thisOrder.userId)

            const registrationToken = thisClient.token;
            const options = {
                priority: "high",
                timeToLive: 60 * 60 * 24
              };
            
            const message = "Votre commande numéro " + thisOrder.id + " à étail valider par le magasin."
            const message_notification = {
                notification: {
                   title: "Commande validée",
                   body: message
                }
                };        
              admin.messaging().sendToDevice(registrationToken, message_notification, options)
              .then( response => {
                console.log(response)
                //    res.status(200).send("Notification sent successfully")
               
              })
              .catch( error => {
                  console.log(error);
              });
    
    
            return res.status(200).json({error: false, order })
            // res.status(200).json({error: false, order })
        })
        .catch(err => {
            console.log(err)
            res.status(404).json({ 
            error: true, err, message: 'orders not found !' 
        })})
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}


exports.cancelOrder = async (req, res) => {
    try {

        let thisShop = await Shop.findOne({where: { userId: req.user.id }})
        Order.update(
            {
                statusId: 5,
            },
            {
            where:{
                shopId: thisShop.id,
                deleted:0,
                id: req.params.id
            },
           
        })
        .then( async (order) => {

            let thisOrder = await Order.findByPk(req.params.id);
            let thisClient = await User.findByPk(thisOrder.userId )

            const registrationToken = thisClient.token;
            const options = {
                priority: "high",
                timeToLive: 60 * 60 * 24
              };
            
            const message = "Votre commande numéro " + thisOrder.id + " à étail annuler par le magasin."
            const message_notification = {
                notification: {
                   title: "Commande validée",
                   body: message
                }
                };        
              admin.messaging().sendToDevice(registrationToken, message_notification, options)
              .then( response => {
                console.log(response)
                //    res.status(200).send("Notification sent successfully")
               
              })
              .catch( error => {
                  console.log(error);
              });
    
            return res.status(200).json({error: false, order })
            // res.status(200).json({error: false, order })
        })
        .catch(err => {
            // console.log(err)
            res.status(404).json({ 
            error: true, err, message: 'orders not found !' 
        })})
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}



exports.getAllReadyElement =async (req, res) => {
    try {
        let orders= await Order.findAll({
            where:{
                deleted:0,
                statusId: 2
            },
            include : [
                {model: Status},
                {model: Shop},
                {model: Adress}
            ]
        })
        if(!orders) return  res.status(400).json({ 
            error: true, err, message: 'order not found !' 
        })
        return res.status(200).json({error: false, orders })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}


exports.ConfirmLivreur = async (req, res) => {
    try {

        let thisLivreur = await DeliveryMan.findOne({where: { userId: req.user.id }});
        let thisOrder = await Order.findOne({where: { id: req.params.id }});
        if(thisOrder.status === 3) return res.status(400).json({taken: true})

        Order.update(
            {
                statusId: 3,
                deliveryManId: thisLivreur.id
            },
            {
            where:{
                id: req.params.id,
            },
           
        })
        .then( async () => {
            let confirmedOrder = await Order.findOne({where: { id: req.params.id }});

            // let thisOrder = await Order.findByPk(req.params.id);
            let thisClient = await User.findByPk(confirmedOrder.userId)

            const registrationToken = thisClient.token;
            const options = {
                priority: "high",
                timeToLive: 60 * 60 * 24
              };
            
            const message = "Un livreur est affécté à la commande " + confirmedOrder.id
            const message_notification = {
                notification: {
                   title: "Commande validée",
                   body: message
                }
                };        
              admin.messaging().sendToDevice(registrationToken, message_notification, options)
              .then( response => {
        
                //    res.status(200).send("Notification sent successfully")
               
              })
              .catch( error => {
                  console.log(error);
              });
            return res.status(200).json({error: false, confirmedOrder })
            // res.status(200).json({error: false, order })
        })
        .catch(err => {
            // console.log(err)
            res.status(404).json({ 
            error: true, err, message: 'orders not found !' 
        })})
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}


exports.getOneLivreurElement = async (req, res) => {
    try {
        Order.findOne({
            include: [
                {model: OrderProduct, include: [{model: Product}]},
                {model: Status},
                {model: Adress},
                {model: Shop},
                {model: Users},
            ],
            where:{
                deleted:0,
                id: req.params.id
            },
           
        })
        .then((orders) => {
            res.status(200).json({error: false, orders })
        })
        .catch(err => {
            // console.log(err)
            res.status(404).json({ 
            error: true, err, message: 'orders not found !' 
        })})
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}