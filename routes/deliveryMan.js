const express = require('express');
const DeliveryManController = require('./../controllers/DeliveryManController');
const {  body } = require('express-validator');

const router = express.Router();
const DeliveryMan = require('./../models/deliveryMan')
const verifAuth = require('./../middleware/auth')
const haveAuthorisation = require('./../middleware/haveAuthorisation')


    router.get('', DeliveryManController.getAllDeliveryMan);
    router.get('/validated', DeliveryManController.getAllActiveDeliveryMan);
    router.get('/invalidated', DeliveryManController.getAllInvalidateDeliveryMan);

    router.post('',[
        body('fullName').isString().optional(),
        body('allWeek').isBoolean(),
        body('allDay').isBoolean(),
        body('vehicule').isString().isLength({ min: 1}),
        body('email')
        .isEmail()
        .custom( async (value) => {
            const existingPhone = await DeliveryMan.findOne({where:{email: value }})
            if(existingPhone){
                throw new Error('existe');
            }
        })
        .trim(),
        body('phone')
        .isLength({ min: 10})
        .custom(async (value) => {
        const existingPhone = await DeliveryMan.findOne({where:{phone: value }})
        if(existingPhone){
            throw new Error('existe');
        }
    }),
    ], DeliveryManController.storeDeliveryMan);

    router.put('/:id',[
        body('fullName').isString().optional(),
        body('allWeek').isBoolean(),
        body('allDay').isBoolean(),
        body('vehicule').isString().isLength({ min: 1}),
        body('email')
        .isEmail()
        .trim(),
        body('phone')
        .optional()
        .isLength({ min: 10})
      
    ],verifAuth, DeliveryManController.updateDeliveryMan);

    router.get('/:id', DeliveryManController.showOneDeliveryMan);

    router.patch('/activate/:id',verifAuth, haveAuthorisation.activateAccount, DeliveryManController.validateDeliveryMan);
    router.patch('/inactivate/:id',verifAuth, haveAuthorisation.activateAccount, DeliveryManController.inactivateDeliveryMan);


module.exports = router;