const Authorisation = require('./../models/authorisation');


const {  validationResult} = require('express-validator');

exports.getAllAuthorisation = (req, res) => {
    try {
        Authorisation.findAll()
        .then((authorisatons) => {
            res.status(200).json({error: false, authorisatons })
        })
        .catch(err => res.status(400).json({ error: true, message: 'can not get authorisation' }))
    } catch (error) {
        res.status(500).json({ error: true, message: "server problem" });
    }
}

exports.storeAuthorisation = (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }

        let { name, 
            canGet, 
            canPost, 
            canPut, 
            canPatch, 
            canDelete, 
            typeId 
        } = req.body;

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
    
    } catch (error) {
        res.status(500).json({ error: true, message: "server problem" });
    }
    
}

exports.updateAuthorisation = (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }
        let { name, canGet, canPost, canPut, canPatch, canDelete, typeId } = req.body;
    
        Authorisation.update({
            name,
            canGet,
            canPost, 
            canPut, 
            canPatch,
            canDelete,
            typeId,
        }, {
            where: { id: req.params.id }
        })
        .then( async () => {
            let updatedAuthorisation = await Authorisation.findByPk(req.params.id);
            res.status(202).json({ error: false, updatedAuthorisation});
    
        })
        .catch(() => res.status(400).json({ error: true, message: "something went wrong" }))
    } catch (error) {
        res.status(500).json({ error: true, message: "server problem" })
    }
}

exports.getOneAuthorisation = async (req, res) => {
    try {
        Authorisation.findByPk(req.params.id)
        .then(authorisation => res.status(200).json({error: false, authorisation}))
        .catch(err => res.status(404).json({ error: true, message: 'something went wrong' }))    
    } catch (error) {
        res.status(500).json({ error: true, message: "server problem" })
    }
}

