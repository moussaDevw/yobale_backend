
const MenuShop = require('./../models/menuShop');
const Product = require('./../models/product');
const {  validationResult} = require('express-validator');


exports.getAllForShop = (req, res) => {
    try {
        MenuShop.findAll({
            where:{
                shopId: req.params.id
            },
            include:[
            {
                model: Product,
            },
        ]
        })
        .then((menuShop) => {
            res.status(200).json({error: false, menuShop })
        })
        .catch(err => {
            console.log(err)
            res.status(404).json({ 
            error: true, err, message: 'menu not found !' 
        })})
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
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
            active, 
            content,
            shopId,
        } = req.body;
    
        MenuShop.create({
            name,
            active,
            content,
            shopId,
        })
        .then( (addedMenu) => {
            res.status(201).json({ error: false, addedMenu });
        })
        .catch((err) => res.status(400).json({ error: true, err, message: 'Please check the data for Menu' }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.update = (req, res) => {
    try {
        let { 
            name, 
            active, 
            content,
            shopId,
         } = req.body;

        MenuShop.update({
            name, 
            active, 
            content,
            shopId,
        }, {
            where: { id: req.params.id }
        })
        .then( async () => {
            let updatedMenu = await MenuShop.findByPk(req.params.id)
            res.status(202).json({ error: false, updatedMenu });
        })
        .catch((err) => res.status(400).json({ error: true, message: "bad request !" }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
   
}

exports.showOne = async (req, res) => {
    try {
        let menuShop = await MenuShop.findByPk(req.params.id);
        res.status(200).json({error: false, menuShop})
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }      
}

exports.activate = (req, res) => {
    try {
        MenuShop.update({active: true}, { where: { id: req.params.id } })
        .then( async () => {
            let updatedMenu = await MenuShop.findByPk(req.params.id);
            res.status(200).json({ error: false, updatedMenu });
        })
        .catch(err => res.status(400).json({ error: true, message: 'can not activate this Menu' }))
        
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.inactivate = (req, res) => {
    try {
        MenuShop.update({active: false}, { where: { id: req.params.id } })
        .then( async () => {
            let updatedMenu = await MenuShop.findByPk(req.params.id);
            res.status(200).json({ error: false, updatedMenu });
        })
        .catch(err => res.status(400).json({ error: true, message: 'can not desactivate this Menu' }))
        
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}
