const express = require('express');
const router = express.Router();
const TypeController = require('./../controllers/TypeController');
const {  body } = require('express-validator');
const Type = require('./../models/type')
const haveAuthorisation = require('./../middleware/haveAuthorisation')
const verifAuth = require('./../middleware/auth')


router.get('', verifAuth, TypeController.getAllTypes);

router.get('/:id', verifAuth, TypeController.getOneType);

router.post('', [
    body('name')
    .isString()
    .custom( async (value) => {
        return Type.findOne({where:{name: value }}).then(isExiste =>{
            if(isExiste){
                return Promise.reject('name is already existe');
            }
        });
    })
    .trim(),
    body('active').isBoolean(),

], verifAuth, haveAuthorisation.general, TypeController.storeType);

router.put('/:id', [
    body('name')
    .isString()
    .custom( async (value) => {
        return Type.findOne({where:{name: value }}).then(isExiste =>{
            if(isExiste){
                return Promise.reject('name is already existe');
            }
        });
    })
    .trim(),
    body('active').isBoolean(),

], verifAuth, haveAuthorisation.general, TypeController.updateType);

module.exports = router;