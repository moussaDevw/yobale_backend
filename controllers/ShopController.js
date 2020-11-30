const Shop = require('./../models/shop');


const {  validationResult} = require('express-validator');

exports.getAllShop = (req, res) => {
    try {
        Shop.findAll()
        .then((deliveryMen) => {
            res.status(200).json({error: false, deliveryMen })
        })
        .catch(err => res.status(402).json({ error: true, message: 'can not get delevery men' }))

    } catch (err) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.getAllActiveShop = (req, res) => {
    try {
        Shop.findAll({where: {active: true}})
        .then((validateDeliveryMen) => {
            res.status(200).json({error: false, validateDeliveryMen })
        })
        .catch(err => res.status(402).json({ error: true, message: 'can not get delevery men' }))
    } catch (err) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.getAllInvalidateShop = (req, res) => {
    try {
        Shop.findAll({where: {active: false}})
        .then((invalidateDeliveryMen) => {
            res.status(200).json({error: false, invalidateDeliveryMen })
        })
        .catch(err => res.status(402).json({ error: true, message: 'can not get delevery men' }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.storeShop = (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }   
        let { 
            name,
            tag,
            tag2,
            bgImage,
            description,
            categoryId,
            email,
            phone,
        } = req.body;
        Shop.create({
            name,
            tag,
            tag2,
            bgImage,
            description,
            categoryId,
            email,
            phone,
        })
        .then((addedShop) => {
            res.status(201).json({ error: false, addedShop });
        })
        .catch((err) => res.status(400).json({ error: true, err, message: 'can not added delevery' }));
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' });
    }
}

exports.updateShop = (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }   

        let { 
            name,
            tag,
            tag2,
            bgImage,
            description,
            categoryId,
            email,
            phone,
        } = req.body;

        Shop.update({
            name,
            tag,
            tag2,
            bgImage,
            description,
            categoryId,
            email,
            phone,
        }, {
            where: { id: req.params.id }
        })
        .then( async () => {
            let updatedShop = await Shop.findByPk(req.params.id);
            res.status(202).json({ error: false, updatedShop });
        })
        .catch((err) => res.status(400).json({ error: true, message: "can not update delevery man" }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' });
    }
}

exports.showOneShop = async (req, res) => {
    try {
        Shop.findByPk(req.params.id)
        .then(shop => {
            res.status(200).json({error: false, shop});
        })
        .catch(err => {
            res.status(400).json({ error: true, message: 'can not get delevery man' });
        });
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' });
    }
}

exports.validateShop = (req, res) => {
    try {
        Shop.update({active: true}, { where: { id: req.params.id } })
        .then( async () => {
            let validatedShop = await Shop.findByPk(req.params.id);
            /*****   sending email ********/
            res.status(200).json({ error: false, validatedShop, activated: true })
        })
        .catch(err => {
            res.status(400).json({ error: true, message: 'can not activate' });
        })
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}
exports.inactivateShop = (req, res) => {
    try {
        Shop.update({active: false}, { where: { id: req.params.id } })
        .then( async () => {
            let validatedShop = await Shop.findByPk(req.params.id);
            /*****   sending email ********/
            res.status(200).json({ error: false, validatedShop, inactivate: true })
        })
        .catch(err => {
            res.status(400).json({ error: true, message: 'can not activate' });
        })
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}
