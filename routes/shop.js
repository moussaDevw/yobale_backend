const express = require('express');
const ShopController = require('./../controllers/ShopController');
const {  body } = require('express-validator');

const router = express.Router();
const Shop = require('./../models/shop');
const verifAuth = require('./../middleware/auth');
const haveAuthorisation = require('./../middleware/haveAuthorisation');


    router.get('', ShopController.getAllShop);

    router.get('/validated', ShopController.getAllActiveShop);

    router.get('/invalidated', ShopController.getAllInvalidateShop);

    router.post('',[
        body('name')
        .isString(),
        body('tag')
        .isString(),
        body('tag2')
        .isString(),
        body('bgImage')
        .isString(),
        body('description')
        .isString()
        .optional(),
        body('categoryId').isInt().isLength({ min: 1}),
        body('email')
        .isEmail()
        .custom( async (value) => {
            const existingPhone = await Shop.findOne({where:{email: value }})
            if(existingPhone){
                throw new Error('existe');
            }
        })
        .trim(),
        body('phone')
        .isLength({ min: 10})
        .custom(async (value) => {
        const existingPhone = await Shop.findOne({where:{phone: value }})
        if(existingPhone){
            throw new Error('existe');
        }
        }),
    ], ShopController.storeShop);

    router.put('/:id',[
        body('name')
        .isString(),
        body('tag')
        .isString(),
        body('tag2')
        .isString(),
        body('bgImage')
        .isString(),
        body('description')
        .isString()
        .optional(),
        body('categoryId').isInt().isLength({ min: 1}),
        body('email')
        .isEmail()
        .trim(),
        body('phone')
        .isLength({ min: 10}),
    ],verifAuth, ShopController.updateShop);

    router.get('/:id', ShopController.showOneShop);

    router.patch('/activate/:id',verifAuth, haveAuthorisation.activateAccount, ShopController.validateShop);

    router.patch('/inactivate/:id',verifAuth, haveAuthorisation.activateAccount, ShopController.inactivateShop);

module.exports = router;