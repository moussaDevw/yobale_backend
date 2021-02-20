const express = require('express');
const router = express.Router();
const CityController = require('../controllers/CityController');
const {  body } = require('express-validator');
const City = require('../models/city')
const haveAuthorisation = require('../middleware/haveAuthorisation')
const verifAuth = require('../middleware/auth')


router.get('',  CityController.getAllCitys);

router.get('/:id', CityController.getOneCity);
router.delete('/:id', verifAuth, haveAuthorisation.isAdmin,  CityController.deleteElement);

router.post('', [
    body('name')
    .isString()
    .trim(),
    body('active').isBoolean().optional(),
], verifAuth, haveAuthorisation.isAdmin, CityController.storeCity);

router.put('/:id', [
    body('name')
    .isString()
    .trim(),
    body('active').isBoolean(),

], verifAuth, haveAuthorisation.isAdmin, CityController.updateCity);

module.exports = router;