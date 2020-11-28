const express = require('express');
const router = express.Router();
const AuthorisationController = require('./../controllers/AuthorisationController');
const {  body } = require('express-validator');
const Athorisation = require('./../models/authorisation')

const verifAuth = require('./../middleware/auth')


router.get('', verifAuth, AuthorisationController.getAllAuthorisation)
router.get('/:id', verifAuth, AuthorisationController.getOneAuthorisation)
router.post('', [
    body('name')
    .isString()
    .trim(),
    body('canGet').isBoolean(),
    body('canPost').isBoolean(),
    body('canPut').isBoolean(),
    body('canPatch').isBoolean(),
    body('canDelete').isBoolean(),
], AuthorisationController.storeAuthorisation)
router.put('/:id', verifAuth, AuthorisationController.updateAuthorisation)
router.delete('/:id', verifAuth, AuthorisationController.deleteAuthorisation)
router.patch('/:id', verifAuth, AuthorisationController.patchAuthorisation)

module.exports = router;