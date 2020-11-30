const Category = require('./../models/category');
const {  validationResult} = require('express-validator');

const SousCategory = require('./../models/sousCategory');
exports.getAllCategories = (req, res) => {
    try {
        Category.findAll()
        .then((categories) => {
            res.status(200).json({error: false, data: categories })
        })
        .catch(err => res.status(404).json({ error: true, message: 'categories not found !' }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.storeCategory = async (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }
    
        let { name, active, icon, sousCategory, haveSoucategory } = req.body;
    
        Category.create({
            name: name,
            active,
            icon,
            haveSoucategory,
        })
        .then( async (category) => {
           
            if(haveSoucategory){
                sousCategory.map( async sc => {
                    sc.categoryId = category.dataValues.id;               
                });
                await SousCategory.bulkCreate(sousCategory);
                let addedSousCategories = await SousCategory.findAll({where: {categoryId: category.dataValues.id}});
                category.setDataValue('sousCategories', addedSousCategories);
            }
            
            res.status(201).json({ error: false, category });
        })
        .catch((err) => res.status(400).json({ error: true, err, message: 'Please check the data for category' }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.updateCategory = (req, res) => {
    try {
        let { name, active } = req.body;

        Category.update({
            name: name,
            active
        }, {
            where: { id: req.params.id }
        })
        .then( async () => {
            let updatedCategory = await Category.findByPk(req.params.id)
            res.status(202).json({ error: false, updatedCategory });
        })
        .catch((err) => res.status(400).json({ error: true, message: "bad request !" }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
   
}

exports.showOneCategory = async (req, res) => {
    try {
        let category = await Category.findByPk(req.params.id);
        res.status(200).json({error: false, data: category})
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }      
}

exports.activateCategory = (req, res) => {
    try {
        Category.update({active: true}, { where: { id: req.params.id } })
        .then( async () => {
            let updatedCategory = await Category.findByPk(req.params.id);
            res.status(200).json({ error: false, updatedCategory });
        })
        .catch(err => res.status(400).json({ error: true, message: 'can not activate this category' }))
        
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}
exports.inactivateCategory = (req, res) => {
    try {
        Category.update({active: false}, { where: { id: req.params.id } })
        .then( async () => {
            let updatedCategory = await Category.findByPk(req.params.id);
            res.status(200).json({ error: false, updatedCategory });
        })
        .catch(err => res.status(400).json({ error: true, message: 'can not desactivate this category' }))
        
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}
