const express = require('express');
const OrderController = require('./../controllers/OrderController');
const {  body } = require('express-validator');

const router = express.Router();

const haveAuthorisation = require('./../middleware/haveAuthorisation')
const verifAuth = require('./../middleware/auth')


router.get('/', OrderController.getAllElement);
router.get('/shop',verifAuth, OrderController.getAllShopElement);
router.get('/custmer',verifAuth, OrderController.getAllCustmerElement);

  router.post('',verifAuth,haveAuthorisation.isCustmer ,OrderController.store);

router.put('/:id',verifAuth, OrderController.updateElement);

router.get('/:id',verifAuth, OrderController.showOneElement);

module.exports = router;