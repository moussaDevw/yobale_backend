
const Adress = require('./../models/adress');
const City = require('./../models/city');
const {  validationResult} = require('express-validator');
const { Op } = require("sequelize");


exports.getAllAdress = (req, res) => {
    try {
        Adress.findAll({where: {deleted: 0}})
        .then((adresses) => {
            res.status(200).json({error: false, adresses })
        })
        .catch(err => res.status(404).json({ error: true, err, message: 'can not get adresses' }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}

exports.getAllUserAdress = (req, res) => {
    try {
        Adress.findAll({where: { userId: req.user.id, deleted: 0}})
        .then((adresses) => {
            res.status(200).json({error: false, adresses: adresses.reverse() })
        })
        .catch(err => res.status(404).json({ error: true, message: 'can not get adresses' }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}

exports.getAllUserAdressCity = (req, res) => {
    try {
        Adress.findAll({where: { userId: req.user.id, deleted: 0}, include: [{model: City, require:false}]})
        .then((adresses) => {
            res.status(200).json({error: false, adresses: adresses.reverse() })
        })
        .catch(err => res.status(404).json({ error: true, message: 'can not get adresses' }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
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
            longitudeDelta,
            active,
            city,
        } = req.body;
        let parameters = [
            { 'name': { [Op.like]: '%' + city + '%' } }
        ]
        let existingCity = await City.findOne({where: {
            [Op.or]: parameters
        },});

        if(!existingCity){
            // return res.status(400).json({error: true, message: "Nous travaillons pas dans cette zone"});
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
                longitudeDelta,
                active,
                userId: req.user.id,
                cityId: null
            })
            .then( (adress) => {
                res.status(201).json({ error: false, adress });
            })
            .catch((err) => res.status(400).json({ error: true, errors: err, message: 'problem while adding adress' }))
               
        }else{
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
                longitudeDelta,
                active,
                userId: req.user.id,
                cityId: existingCity.id
            })
            .then( (adress) => {
                res.status(201).json({ error: false, adress });
            })
            .catch((err) => res.status(400).json({ error: true, errors: err, message: 'problem while adding adress' }))
               
        }

       
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: 'Something went wrong' })
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
        res.status(500).json({ error: true, message: 'Something went wrong' });
    }
}

exports.showOneAdress = async (req, res) => {
    try {
        let category = await Adress.findByPk(req.params.id);
        res.status(200).json({error: false, category});
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Something went wrong' });
    }
}
