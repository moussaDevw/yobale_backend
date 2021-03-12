const express = require('express');
const AuthController = require('./../controllers/AuthController');
const {  body } = require('express-validator');
const User = require('./../models/user')
const router = express.Router();

router.post('/signup',[
    body('email')
    .isEmail()
    .custom( async (value) => {
        const existingPhone = await User.findOne({where:{email: value }})
        if(existingPhone){
            throw new Error('existe');
        }
    })
    .trim(),
    body('password').isLength({ min: 4}),
    body('fullName').isString().optional(),
    body('image').isString().optional(),
    body('phone')
    .optional()
    .isLength({ min: 10})
    .custom(async (value) => {
        const existingPhone = await User.findOne({where:{phone: value }})
        if(existingPhone){
            throw new Error('existe');
        }
    }),
    // body('typeId').isInt(),
], AuthController.sginIn);

  router.post('/signin',[
    body('email')
    .isEmail()
    .trim(),
    body('password').isLength({ min: 8}),
], AuthController.signUp);

  router.post('/admin/signin',[
    body('email')
    .isEmail()
    .trim(),
    body('password').isLength({ min: 8}),
], AuthController.signUpAdmin);

router.get('/', (req, res) => {res.json({source: "api yobal"})});

module.exports = router;