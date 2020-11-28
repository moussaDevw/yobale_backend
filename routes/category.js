const express = require('express');
const CategoryController = require('./../controllers/CategoryController');
const {  body } = require('express-validator');

const router = express.Router();

const Category = require('./../models/category')
const haveAuthorisation = require('./../middleware/haveAuthorisation')
const verifAuth = require('./../middleware/auth')


router.get('', CategoryController.getAllCategories);

  router.post('',[
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
    body('sousCategory').isArray(),
    body('icon').isString().isLength({ min: 2}),
    body('active').isBoolean(),
    body('haveSoucategory').isBoolean(),
  ], verifAuth, haveAuthorisation, CategoryController.storeCategory);

router.put('/:id', CategoryController.updateCategory);

router.get('/:id', CategoryController.showOneCategory);

router.patch('/:id', CategoryController.patchCategory);

router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;