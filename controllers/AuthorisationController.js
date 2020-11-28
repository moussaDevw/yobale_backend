const Authorisation = require('./../models/authorisation');


const {  validationResult} = require('express-validator');

exports.getAllAuthorisation = (req, res) => {
   
    Authorisation.findAll()
        .then((types) => {
            res.status(200).json({error: false, data: types })
        })
        .catch(err => res.status(404).json({ error: true, message: 'Authorisation not found !' }))

}

exports.storeAuthorisation = (req, res) => {

    let resultError= validationResult(req).array();
    console.log(resultError)
    if(resultError.length > 0){  
        return res.status(400).json({ error: true, message: resultError });
    }

    let { name, canGet, canPost, canPut, canPatch, canDelete, typeId } = req.body;

    Authorisation.create({
        name,
        canGet,
        canPost, 
        canPut, 
        canPatch,
        canDelete,
        typeId,
    })
    .then((authorisation) => res.status(201).json({ error: false, authorisation }))
    .catch((err) => res.status(400).json({ error: true, message: 'Please check the data for type' }))
   
}

exports.updateAuthorisation = (req, res) => {
    let { name, active } = req.body;

    Authorisation.update({
        name: name,
        active: (active == 'on') ? 1 : 0
    }, {
        where: { id: req.params.id }
    })
    .then((result) => res.status(202).json({ error: false, data: result }))
    .catch((err) => res.status(400).json({ error: true, message: "bad request !" }))
}

exports.getOneAuthorisation = async (req, res) => {
       Authorisation.findByPk(req.params.id)
       .then(type => res.status(200).json({error: false, data: type}))
       .catch(err => res.status(404).json({ error: true, message: 'type not found' }))    
}

exports.deleteAuthorisation =  (req, res) => {
    res.status(200).json({error: false, data: "you can not delete this types "})   
}

exports.patchAuthorisation = (req, res) => {
    
    Authorisation.update(req.body, { where: { id: req.params.id } })
            .then(result => res.status(200).json({ error: false, data: result }))
            .catch(err => res.status(400).json({ error: true, message: 'bad request!' }))
}

