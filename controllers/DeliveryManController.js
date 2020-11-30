const DeliveryMan = require('./../models/DeliveryMan');


const {  validationResult} = require('express-validator');

exports.getAllDeliveryMan = (req, res) => {
    try {
        DeliveryMan.findAll()
        .then((deliveryMen) => {
            res.status(200).json({error: false, deliveryMen })
        })
        .catch(err => res.status(402).json({ error: true, message: 'can not get delevery men' }))

    } catch (err) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.getAllActiveDeliveryMan = (req, res) => {
    try {
        DeliveryMan.findAll({where: {active: true}})
        .then((validateDeliveryMen) => {
            res.status(200).json({error: false, validateDeliveryMen })
        })
        .catch(err => res.status(402).json({ error: true, message: 'can not get delevery men' }))
    } catch (err) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.getAllInvalidateDeliveryMan = (req, res) => {
    try {
        DeliveryMan.findAll({where: {active: false}})
        .then((invalidateDeliveryMen) => {
            res.status(200).json({error: false, invalidateDeliveryMen })
        })
        .catch(err => res.status(402).json({ error: true, message: 'can not get delevery men' }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.storeDeliveryMan = (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }   
        let { allWeek, 
            allDay, 
            fullName,
            vehicule,
            email,
            phone,
        } = req.body;

        DeliveryMan.create({ 
            allWeek, 
            allDay, 
            fullName,
            vehicule,
            email,
            phone,
        })
        .then((addedDeliveryMan) => {
            res.status(201).json({ error: false, addedDeliveryMan });
        })
        .catch((err) => res.status(400).json({ error: true, err, message: 'can not added delevery' }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })  
    }
}

exports.updateDeliveryMan = (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }   

        let { allWeek, 
            allDay, 
            fullName,
            vehicule,
            email,
            phone,
        } = req.body;

        DeliveryMan.update({
            allWeek, 
            allDay, 
            vehicule,
            email,
            phone,
            fullName,
        }, {
            where: { id: req.params.id }
        })
        .then( async () => {
            let updatedDeliveryMan = await DeliveryMan.findByPk(req.params.id)
            res.status(202).json({ error: false, updatedDeliveryMan });
        })
        .catch((err) => res.status(400).json({ error: true, message: "can not update delevery man" }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' });
    }
}

exports.showOneDeliveryMan = async (req, res) => {
    try {
        DeliveryMan.findByPk(req.params.id)
        .then(DeliveryMan => {
            res.status(200).json({error: false, DeliveryMan});
        })
        .catch(err => {
            res.status(400).json({ error: true, message: 'can not get delevery man' });
        });
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' });
    }
}


exports.validateDeliveryMan = (req, res) => {
    try {
        DeliveryMan.update({active: true}, { where: { id: req.params.id } })
        .then( async (result) => {
            let validatedDeliveryMan = await DeliveryMan.findByPk(req.params.id);
            /*****   sending email ********/
            res.status(200).json({ error: false, validatedDeliveryMan, activated: true })
        })
        .catch(err => {
            res.status(400).json({ error: true, message: 'can not activate' });
        })
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}
exports.inactivateDeliveryMan = (req, res) => {
    try {
        DeliveryMan.update({active: false}, { where: { id: req.params.id } })
        .then( async (result) => {
            let validatedDeliveryMan = await DeliveryMan.findByPk(req.params.id);
            /*****   sending email ********/
            res.status(200).json({ error: false, validatedDeliveryMan, inactivate: true })
        })
        .catch(err => {
            res.status(400).json({ error: true, message: 'can not activate' });
        })
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

