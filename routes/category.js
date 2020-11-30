const express = require('express');
const CategoryController = require('./../controllers/CategoryController');
const {  body } = require('express-validator');

const router = express.Router();

const Category = require('./../models/category')
const haveAuthorisation = require('./../middleware/haveAuthorisation')
const verifAuth = require('./../middleware/auth')


router.get('', CategoryController.getAllCategories);

  router.post('', [
    body('name')
    .isString()
    .isLength({ min: 2})
    .custom( async (value) => {
      return Category.findOne({where:{name: value }}).then(isExiste =>{
          if(isExiste){
              return Promise.reject('name is already existe');
          }
      });
  }),
    body('sousCategory').isArray().optional(),
    body('icon').isString().isLength({ min: 2}),
    body('active').isBoolean().optional(),
  ], verifAuth, haveAuthorisation.general, CategoryController.storeCategory);

router.put('/:id', [
  body('name')
  .isString()
  .isLength({ min: 2}),
  body('sousCategory').isArray().optional(),
  body('icon').isString().isLength({ min: 2}),
  body('active').isBoolean().optional(),
], CategoryController.updateCategory);

router.get('/:id', CategoryController.showOneCategory);


router.patch('/activate/:id', CategoryController.activateCategory);

router.patch('/inactivate/:id', CategoryController.inactivateCategory);

module.exports = router;