const Category = require('./../models/category');
const {  validationResult} = require('express-validator');

const SousCategory = require('./../models/sousCategory');

exports.getAllCategories = async (req, res) => {
    try {
        let categories = await Category.findAll({ include: SousCategory })
        if(!categories) return res.status(400).json({ error: true,err, message: "nous n'avons pas pus récupérer les informations des catégories !" })
        res.status(200).json({error: false, categories })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.storeCategory = async (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }
    
        let { name, active, icon, sousCategory, } = req.body;
    
        Category.create({
            name: name,
            active,
            icon,
        })
        .then( async (category) => {
           
            if(sousCategory.length > 0){
                sousCategory.map( async sc => {
                    sc.categoryId = category.dataValues.id;
                });
                let addedSousCategories = await SousCategory.bulkCreate(sousCategory);
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
            let updatedCategory = await Category.findByPk(req.params.id, { include: SousCategory })
            // let Json = updatedCategory.toJSON();
            // let sousCategory = await SousCategory.findAll({
            //     where :{
            //         categoryId: Json.id,
            //     }
            // });
            // category.setDataValue('sousCategory', sousCategory)
            res.status(202).json({ error: false, updatedCategory });
        })
        .catch((err) => res.status(400).json({ error: true, message: "bad request !" }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.updateSousCategory = (req, res) => {
    try {
        let { name, active } = req.body;

        SousCategory.update({
            name: name,
            active
        }, {
            where: { id: req.params.id }
        })
        .then( async () => {
            let updatedSousCategory = await SousCategory.findByPk(req.params.id);

            res.status(202).json({ error: false, updatedSousCategory });
        })
        .catch((err) => res.status(400).json({ error: true, message: "bad request !" }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.showOneCategory = async (req, res) => {
    try {
        let category = await Category.findByPk(req.params.id, { include: SousCategory });
        // let Json = category.toJSON();
        // let sousCategory = await SousCategory.findAll({
        //     where :{
        //         categoryId: Json.id,
        //     }
        // });
        // category.setDataValue('sousCategory', sousCategory)

        res.status(200).json({error: false, category})
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }      
}

exports.showOneSousCategory = async (req, res) => {
    try {
        let sousCategory = await SousCategory.findByPk(req.params.id);

        res.status(200).json({error: false, sousCategory})
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
