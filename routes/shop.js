const express = require('express');
const ShopController = require('./../controllers/ShopController');
const {  body } = require('express-validator');

const router = express.Router();
const Shop = require('./../models/shop');
const User = require('./../models/user');
const verifAuth = require('./../middleware/auth');
const haveAuthorisation = require('./../middleware/haveAuthorisation');


    router.get('', ShopController.getAllShop);
    router.get('/sous-categorie/:categoryId/:adressId', ShopController.getShopSousCategorie);
    router.get('/categorie/:categoryId/:adressId', ShopController.getShopCategorie);

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
        .isString().optional(),
        body('description')
        .isString()
        .optional(),
        body('categoryId').isInt().isLength({ min: 1}),
        body('email')
        .isEmail()
        .custom( async (value) => {
            const existingPhone = await Shop.findOne({where:{email: value }})
            if(existingPhone){
                throw new Error('email existe');
            }
        })
        .trim(),
        body('phone')
        .isLength({ min: 3})
        .custom(async (value) => {
        const existingPhone = await Shop.findOne({where:{phone: value }})
        if(existingPhone){
            throw new Error('existe');
        }
        }),
    ], ShopController.storeShop);

    router.post('/upload-bg', ShopController.uploadBg);

    router.put('/:id',[
        body('name')
        .isString(),
        body('tag').optional()
        .isString(),
        body('tag2').optional()
        .isString(),
        body('bgImage').optional(),
        body('logo').optional(),
        body('description').optional()
        .isString()
        .optional(),
        body('categoryId').isInt().isLength({ min: 1}),
        body('sousCategoryId').optional(),
        body('cityId').isInt().isLength({ min: 1}),
        body('email')
        .isEmail()
        .trim(),
        body('phone')
        .isLength({ min: 10}),
    ],verifAuth, haveAuthorisation.isShop, ShopController.updateShop);

    router.get('/:id', ShopController.showOneShop);

    router.delete('/:id',verifAuth, haveAuthorisation.isAdmin, ShopController.deleteElement);
    router.patch('/activate/:id',verifAuth, haveAuthorisation.isAdmin, ShopController.validateShop);
    router.patch('/inactivate/:id',verifAuth, haveAuthorisation.isAdmin, ShopController.inactivateShop);
    router.patch('/deblock/:id',verifAuth, haveAuthorisation.isAdmin, ShopController.deblockShop);

module.exports = router;