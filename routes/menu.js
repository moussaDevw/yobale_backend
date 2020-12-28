const express = require('express');
const MenuShopController = require('./../controllers/MenuShopController');
const {  body } = require('express-validator');

const router = express.Router();

const haveAuthorisation = require('./../middleware/haveAuthorisation')
const verifAuth = require('./../middleware/auth')


router.get('/shop/:id', MenuShopController.getAllForShop);

  router.post('', [
    body('name')
    .isString()
    .isLength({ min: 2}),
    body('content').isString().optional(),
    body('active').isBoolean().optional(),
    body('shopId').isInt(),
  ], MenuShopController.store);

router.put('/:id', [
    body('name')
    .isString()
    .isLength({ min: 2}),
    body('content').isString().optional(),
    body('active').isBoolean().optional(),
    body('shopId').isInt(),
], MenuShopController.update);

router.get('/:id', MenuShopController.showOne);

router.patch('/activate/:id', verifAuth, haveAuthorisation.general, MenuShopController.activate);

router.patch('/inactivate/:id', verifAuth, haveAuthorisation.general, MenuShopController.inactivate);

module.exports = router;