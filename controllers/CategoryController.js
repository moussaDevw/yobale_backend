const Category = require('./../models/category');
const {  validationResult} = require('express-validator');

const SousCategory = require('./../models/sousCategory');
exports.getAllCategories = (req, res) => {
    Category.findAll()
        .then((categories) => {

            res.status(200).json({error: false, data: categories })
        })
        .catch(err => res.status(404).json({ error: true, message: 'categories not found !' }))
}

exports.storeCategory = async (req, res) => {

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
            await  SousCategory.bulkCreate(sousCategory)
        }
        res.status(201).json({ error: false, category });
    })
    .catch((err) => res.status(400).json({ error: true, err, message: 'Please check the data for category' }))
       
    
    
}

exports.updateCategory = (req, res) => {
    console.log(req.body)
    let { name, active } = req.body;

    Category.update({
        name: name,
        active
    }, {
        where: { id: req.params.id }
    })
    .then((result) => res.status(202).json({ error: false, data: result }))
    .catch((err) => res.status(400).json({ error: true, message: "bad request !" }))
}

exports.showOneCategory = async (req, res) => {
   
    try {
        let category = await Category.findByPk(req.params.id);
        return res.status(200).json({error: false, data: category})
    } catch (error) {
        return res.status(404).json({ error: true, message: 'category not found' })
    }
    
        
}

exports.deleteCategory =  (req, res) => {
    return res.send('suppression')
}

// exports.editCategory =  (req, res) => {
//     Category.findByPk(req.params.id)
//            .then(category => {
//                res.render('category/edit', {
//                    category: category
//                })
//            })
// }

exports.patchCategory = (req, res) => {
    
    Category.update(req.body, { where: { id: req.params.id } })
            .then(result => res.status(200).json({ error: false, data: result }))
            .catch(err => res.status(400).json({ error: true, message: 'bad request!' }))
}


// exports.createCategory = (req, res) => {
//     res.render('category/create')
// }