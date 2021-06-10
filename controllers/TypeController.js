const Type = require('./../models/type');


const {  validationResult} = require('express-validator');

exports.getAllTypes = (req, res) => {
    try {
        Type.findAll( { where : { deleted: 0 }})
        .then((types) => {
            res.status(200).json({error: false, types })
        })
        .catch(err => res.status(401).json({ error: true, message: 'can not find type' }));
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' });
    }
}

exports.storeType = (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }
    
        let { name, active } = req.body;
    
        Type.create({
            name,
            active,
        })
        .then((type) => {
            res.status(201).json({ error: false, type });
        })
        .catch((err) => res.status(400).json({ error: true, message: 'Please check the data for type' }))    
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' });
    }
   
}

exports.updateType = (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }

        let { name, active } = req.body;

        Type.update({
            name,
            active
        }, {
            where: { id: req.params.id }
        })
        .then( async () => {
            let updatedType = await Type.findByPk(req.params.id);

            res.status(202).json({ error: false, updatedType })
        })
        .catch((err) => res.status(400).json({ error: true, message: "bad request !" }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' });
    }
  
}

exports.getOneType = async (req, res) => {
    try {
        Type.findByPk(req.params.id)
       .then(type => res.status(200).json({error: false, type}))
       .catch(err => res.status(404).json({ error: true, message: 'type not found' })) 
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' });
    }
          
}
