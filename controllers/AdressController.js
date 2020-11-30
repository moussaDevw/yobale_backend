
const Adress = require('./../models/adress');
const {  validationResult} = require('express-validator');


exports.getAllAdress = (req, res) => {
    try {
        Adress.findAll()
        .then((adresses) => {
            res.status(200).json({error: false, adresses })
        })
        .catch(err => res.status(404).json({ error: true, message: 'can not get adresses' }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.getAllUserAdress = (req, res) => {
    try {
        Adress.findAll({where: { userId: req.params.id}})
        .then((adresses) => {
            res.status(200).json({error: false, adresses })
        })
        .catch(err => res.status(404).json({ error: true, message: 'can not get adresses' }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.storeAdress = async (req, res) => {
    try {
        let resultError= validationResult(req).array();
        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }

        let { 
            streetName, 
            buildingNumber, 
            sector, 
            nameCompany, 
            floor, 
            housseNumber, 
            codePostal, 
            latitude, 
            longitude, 
            latitudeDelta, 
            longitudeDeltaactive,
        } = req.body;

        Adress.create({
            streetName, 
            buildingNumber, 
            sector, 
            nameCompany, 
            floor, 
            housseNumber, 
            codePostal, 
            latitude, 
            longitude, 
            latitudeDelta, 
            longitudeDeltaactive,
            userId: req.user.id,
        })
        .then( (adress) => {
            res.status(201).json({ error: false, adress });
        })
        .catch((err) => res.status(400).json({ error: true, errors: err, message: 'problem while adding adress' }))
           
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    } 
}

exports.updateAdress = (req, res) => {
    try {
        let resultError= validationResult(req).array();
        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        } 
        let { 
            streetName, 
            buildingNumber, 
            sector, 
            nameCompany, 
            floor, 
            housseNumber, 
            codePostal, 
            latitude, 
            longitude, 
            latitudeDelta, 
            longitudeDeltaactive,
        } = req.body;
        Adress.update({
            streetName, 
            buildingNumber, 
            sector, 
            nameCompany, 
            floor, 
            housseNumber, 
            codePostal, 
            latitude, 
            longitude, 
            latitudeDelta, 
            longitudeDeltaactive,
            userId: req.user.id,
        }, {
            where: { id: req.params.id }
        })
        .then( async ( ) => {
            let updatedAdress = await Adress.findByPk(req.params.id);
            res.status(202).json({ error: false, updatedAdress });
        })
        .catch((err) => res.status(400).json({ error: true, message: "bad request !" }));
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' });
    }
}

exports.showOneAdress = async (req, res) => {
    try {
        let category = await Adress.findByPk(req.params.id);
        res.status(200).json({error: false, category});
    } catch (error) {
        return res.status(500).json({ error: true, message: 'server problem' });
    }
}
