const express = require('express');
const OrderController = require('./../controllers/OrderController');
const {  body } = require('express-validator');

const router = express.Router();

const haveAuthorisation = require('./../middleware/haveAuthorisation')
const verifAuth = require('./../middleware/auth')


router.get('/', OrderController.getAllElement);
router.get('/shop',verifAuth, haveAuthorisation.isShop ,  OrderController.getAllShopElement);
router.get('/shop/:id',verifAuth, haveAuthorisation.isShop ,  OrderController.getOneShopElement);
router.get('/custmer',verifAuth, OrderController.getAllCustmerElement);
router.get('/preparer',verifAuth, OrderController.getAllReadyElement);

router.post('',verifAuth,haveAuthorisation.isCustmer ,OrderController.store);

router.put('/:id',verifAuth, OrderController.updateElement);

router.get('/:id',verifAuth, OrderController.showOneElement);
router.post('/confirm/:id',verifAuth, OrderController.confirmOrder);
router.post('/livrer/:id',verifAuth, OrderController.ConfirmLivreur);
router.post('/cancel/:id',verifAuth, OrderController.cancelOrder);

module.exports = router;