const express = require('express');
const ProductController = require('./../controllers/ProductController');
const {  body } = require('express-validator');

const router = express.Router();

const haveAuthorisation = require('./../middleware/haveAuthorisation')
const verifAuth = require('./../middleware/auth')


router.get('', ProductController.getAll);

  router.post('', [
    body('name')
    .isString()
    .isLength({ min: 2}),
    body('content').isString().optional(),
    body('price').isFloat(),
    body('active').isBoolean().optional(),
    body('menuShopId').isInt(),
  ], ProductController.store);

router.put('/:id', [
    body('name')
    .isString()
    .isLength({ min: 2}),
    body('content').isString().optional(),
    body('price').isFloat(),
    body('active').isBoolean().optional(),
    body('menuShopId').isInt(),
], ProductController.update);

router.get('/:id', ProductController.showOne);

router.patch('/activate/:id', verifAuth, haveAuthorisation.general, ProductController.activate);

router.patch('/inactivate/:id', verifAuth, haveAuthorisation.general, ProductController.inactivate);

module.exports = router;