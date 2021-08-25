const City = require('./../models/city');


const {  validationResult} = require('express-validator');

exports.getAllCitys = (req, res) => {
    try {
        City.findAll( { where : { deleted: 0 }})
        .then((cities) => {
            res.status(200).json({error: false, cities })
        })
        .catch(err => res.status(401).json({ error: true, message: 'can not find City' }));
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' });
    }
}

exports.storeCity = (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }
    
        let { name, active, deleivery_price } = req.body;
    
        City.create({
            name,
            active,
            deleivery_price,
        })
        .then((city) => {
            res.status(201).json({ error: false, city });
        })
        .catch((err) => res.status(400).json({ error: true, message: 'Please check the data for City' }))    
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' });
    }
   
}

exports.updateCity = (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }
        if(!req.params.id) return res.status(400).json({ error: true, updatedCity:{}, message:"identifiant de la ville n'est pas était envoyé" })
        let { name, active, deleted,deleivery_price } = req.body;

        City.update({
            name,
            active,
            deleted,
            deleivery_price,
        }, {
            where: { id: req.params.id }
        })
        .then( async () => {
            let updatedCity = await City.findByPk(req.params.id);

            if(!updatedCity) return res.status(400).json({ error: true, updatedCity:{}, message:"la ville modifier est introuvabe" })
            res.status(202).json({ error: false, updatedCity })
        })
        .catch((err) => res.status(400).json({ error: true, message: "bad request !" }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' });
    }
  
}

exports.getOneCity = async (req, res) => {
    try {
        City.findByPk(req.params.id)
       .then(city => res.status(200).json({error: false, city}))
       .catch(err => res.status(404).json({ error: true, message: 'City not found' })) 
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' });
    }
          
}

exports.deleteElement = async (req, res) => {
    try {
        let deletedElement = await City.destroy({where: {id: req.params.id}});
   
        return res.status(200).json({ error: false, deletedElement});

    } catch (error) {
        try{
           if(error.name === "SequelizeForeignKeyConstraintError"){

            let deletedElement = await City.update({
                deleted: 1,
            }, {
                where: { id: req.params.id }
            });
            return res.status(200).json({ error: false, deletedElement});
           }else {
            return res.status(400).json({ error: false, message: "une erreur inconue est survenue"});
           }
        }catch(err) {
            console.log(err)
            res.status(500).json({ error: true, message: 'Something went wrong' })
        }
       
    }
          
}
