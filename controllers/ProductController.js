
const Product = require('./../models/product');
const {  validationResult} = require('express-validator');


exports.getAll = (req, res) => {
    try {
        Product.findAll( { where : { deleted: 0 }})
        .then((product) => {
            res.status(200).json({error: false, product })
        })
        .catch(err => res.status(404).json({ error: true, message: 'product not found !' }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.store = async (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }
        console.log(req.body)
        let { 
            name, 
            active, 
            description,
            imageUri,
            price,
            menuShopId,
        } = req.body;
    
        Product.create({
            name,
            active,
            imageUri,
            description,
            price,
            menuShopId,
        })
        .then( (addedProduct) => {
            res.status(201).json({ error: false, addedProduct });
        })
        .catch((err) =>{console.log(err); res.status(400).json({ error: true, err, message: 'Please check the data for Product' })})
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.update = (req, res) => {
    try {
        let { 
            name, 
            active, 
            content,
            price,
            imageUri,
            menuShopId,
         } = req.body;

        Product.update({
            name, 
            active, 
            content,
            price,
            imageUri,
            menuShopId,
        }, {
            where: { id: req.params.id }
        })
        .then( async () => {
            let updatedProduct = await Product.findByPk(req.params.id)
            res.status(202).json({ error: false, updatedProduct });
        })
        .catch((err) => res.status(400).json({ error: true, message: "bad request !" }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
   
}

exports.showOne = async (req, res) => {
    try {
        let product = await Product.findByPk(req.params.id);
        res.status(200).json({error: false, product})
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }      
}

exports.activate = (req, res) => {
    try {
        Product.update({active: true}, { where: { id: req.params.id } })
        .then( async () => {
            let updatedProduct = await Product.findByPk(req.params.id);
            res.status(200).json({ error: false, updatedProduct });
        })
        .catch(err => res.status(400).json({ error: true, message: 'can not activate this Product' }))
        
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.inactivate = (req, res) => {
    try {
        Product.update({active: false}, { where: { id: req.params.id } })
        .then( async () => {
            let updatedProduct = await Product.findByPk(req.params.id);
            res.status(200).json({ error: false, updatedProduct });
        })
        .catch(err => res.status(400).json({ error: true, message: 'can not desactivate this Product' }))
        
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}


exports.deleteElement = async (req, res) => {
    try {
        let deletedElement = await Product.destroy({where: {id: req.params.id}});
   
        return res.status(200).json({ error: false, deletedElement});

    } catch (error) {
        try{
           if(error.name === "SequelizeForeignKeyConstraintError"){

            let deletedElement = await Product.update({
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
            return res.status(500).json({ error: true, message: 'server problem' })
        }
       
    }
          
}