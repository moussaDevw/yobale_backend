const Category = require('./../models/category');
const {  validationResult} = require('express-validator');
const moment = require('moment')
const fs = require('fs');

const SousCategory = require('./../models/sousCategory');

exports.getAllCategories = async (req, res) => {
    try {
        let categories = await Category.findAll({ 
            include: SousCategory ,
            where : { deleted: 0 }
        })
        if(!categories) return res.status(400).json({ error: true,err, message: "nous n'avons pas pus récupérer les informations des catégories !" })
        res.status(200).json({error: false, categories })
    } catch (error) {
        // console.log(error)
        res.status(500).json({ error: true, message: 'Something went wrong' })
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
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}

exports.updateCategory = (req, res) => {
    try {
        let { name, active, icon } = req.body;

        Category.update({
            name,
            active,
            icon
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
        res.status(500).json({ error: true, message: 'Something went wrong' })
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
        res.status(500).json({ error: true, message: 'Something went wrong' })
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
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }      
}

exports.showOneSousCategory = async (req, res) => {
    try {
        let sousCategory = await SousCategory.findByPk(req.params.id);

        res.status(200).json({error: false, sousCategory})
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
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
        res.status(500).json({ error: true, message: 'Something went wrong' })
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
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}


exports.uploadIcon = async (req, res) => {
    try {
        const fileTypes = [
            'jpeg',
            'jpg',
            'pdf',
            'png'
        ];
        if (req.body.data === null || req.body.data === undefined) {
            return res.status(400).json({error: true, msg: 'No file uploaded' });
        }
        var file = req.body.data;
        
        let base64Image = file.split(';base64,').pop();
        
        const ext = file.substring(file.indexOf("/")+1, file.indexOf(";base64"));
        const fileType = file.substring("data:".length,file.indexOf("/"));
        
        // const ext = base64Image.substring(base64Image.indexOf("/")+1, base64Image.indexOf(";base64"));
        
        let fileName = moment().format('YYYY-MM-DD-HH-mm:ss') + "." + ext
          if(req.body.fileType === "image"){
        
            fs.writeFile(`public/categoryimage/${fileName}`, base64Image, {encoding: 'base64'}, (err) => {
              if (err) {
                  console.log(err)
                return res.status(500).json({ error: true, err});
              }
              return res.status(200).json({ error: false, data: { realName: req.body.realName, fileName, fileLink: `/categoryimage/${fileName}` }});
           });
          }else {
              return res.status(400).json({ error: true, msg: "Type de fichier n'est pas acceptable " });
          }
    } catch (error) {
        // console.log(error)
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }      
}


exports.deleteElement = async (req, res) => {
    try {
        let deletedElement = await Category.destroy({where: {id: req.params.id}});
   
        return res.status(200).json({ error: false, deletedElement});

    } catch (error) {
        try{
           if(error.name === "SequelizeForeignKeyConstraintError"){

            let deletedElement = await Category.update({
                deleted: 1,
            }, {
                where: { id: req.params.id }
            });
            return res.status(200).json({ error: false, deletedElement});
           }else {
            return res.status(400).json({ error: false, message: "une erreur inconue est survenue"});
           }
        }catch(err) {
            // console.log(err)
            res.status(500).json({ error: true, message: 'Something went wrong' })
        }
       
    }
}