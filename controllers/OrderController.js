
const Order = require('./../models/order');

const OrderProduct = require('./../models/orderProduct');
const Product = require('./../models/product');
const Shop = require('./../models/shop');
const Custmer = require('./../models/user');
const Status = require('./../models/status');
const DeliveryMan = require('./../models/deliveryman');

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
        Order.findAll({
            include: [
                {model: OrderProduct, include: [{model: Product}]},
                {model: Status},
            ],
            where:{
                shopId: thisShop.id,
                deleted:0
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
                {
                    model: OrderProduct,
                }
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

        if(!addedOrderProduct) return res.status(400).json({ error: true, err, message: 'On a pas pus enregistrer roduit de cette commande' });
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
        let order = await Order.findByPk(req.params.id);
        res.status(200).json({error: false, order})
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }      
}
