const express = require('express');
const router = express.Router();
const CityController = require('../controllers/CityController');
const {  body } = require('express-validator');
const City = require('../models/city')
const haveAuthorisation = require('../middleware/haveAuthorisation')
const verifAuth = require('../middleware/auth')


router.get('', verifAuth, CityController.getAllCitys);

router.get('/:id', verifAuth, CityController.getOneCity);

router.post('', [
    body('name')
    .isString()
    .custom( async (value) => {
        return City.findOne({where:{name: value }}).then(isExiste =>{
            if(isExiste){
                return Promise.reject('name is already existe');
            }
        });
    })
    .trim(),
    body('active').isBoolean().optional(),
], verifAuth, haveAuthorisation.general, CityController.storeCity);

router.put('/:id', [
    body('name')
    .isString()
    .trim(),
    body('active').isBoolean(),

], verifAuth, haveAuthorisation.general, CityController.updateCity);

module.exports = router;