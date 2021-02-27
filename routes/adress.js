const express = require('express');
const AdressController = require('./../controllers/AdressController');
const {  body } = require('express-validator');

const router = express.Router();

const verifAuth = require('./../middleware/auth')


    router.get('', AdressController.getAllAdress);

    router.get('/user',verifAuth, AdressController.getAllUserAdress);

    router.post('',[
        body('streetName')
        .isString()
        .isLength({ min: 2}),
        body('buildingNumber').isInt().isLength({ min: 1}),
        body('sector').optional().isString(),
        body('nameCompany').optional().isString(),
        body('floor').optional().isInt(),
        body('housseNumber').optional().isInt(),
        body('codePostal').optional().isInt(),
        body('latitude').isFloat(),
        body('longitude').isFloat(),
        body('latitudeDelta').optional().isFloat(),
        body('longitudeDelta').optional().isFloat(),
        body('active').isBoolean(),
    ], verifAuth, AdressController.storeAdress);

    router.put('/:id',[
        body('streetName')
        .isString()
        .isLength({ min: 2}),
        body('buildingNumber').isInt().isLength({ min: 1}),
        body('sector').optional().isString(),
        body('nameCompany').optional().isString(),
        body('floor').optional().isInt(),
        body('housseNumber').optional().isInt(),
        body('codePostal').optional().isInt(),
        body('latitude').isFloat(),
        body('longitude').isFloat(),
        body('latitudeDelta').optional().isFloat(),
        body('longitudeDelta').optional().isFloat(),
        body('active').isBoolean(),
    ], verifAuth, AdressController.updateAdress);

    router.get('/:id', AdressController.showOneAdress);

module.exports = router;