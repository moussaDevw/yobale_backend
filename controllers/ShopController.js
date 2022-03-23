const Shop = require('./../models/shop');
const User = require('./../models/user');
const City = require('./../models/city');
const Type = require('./../models/type');
const Category = require('./../models/category');
const SousCategory = require('./../models/sousCategory');
const Adress = require('./../models/adress');
const { Op } = require("sequelize");

var bcrypt = require('bcryptjs');
const mailBodyHtml =  require('./../mailContent/shopAccountCreate')
const { validationResult } = require('express-validator');
const fs = require('fs');

const moment = require('moment')

const { sendMail, hiddenEmail, generatePassword } = require('./../util/emailSender')

exports.getAllShop = (req, res) => {
    try {
        Shop.findAll( {
            include: [
                { model: City },
                { model: Category },
                { model: SousCategory },
            ],
            where : { deleted: 0 }

        })
        .then((shops) => {
            res.status(200).json({error: false, shops })
        })
        .catch(err => res.status(400).json({ error: true, message: "nous n'avons pas pus récupérer les information  des magasins" }))

    } catch (err) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}

exports.getShopCategorie = async (req, res) => {
    try {

        let adressUser = await Adress.findByPk(req.params.adressId)

        let cityId = adressUser?  adressUser.cityId : 0
        // let parameters = [
        //     {'categoryId': req.params.categoryId},
        //     {'cityId': adressUser.cityId},
        // ]
        // const shops = Shop.findAll(  {
        //     where: {
        //         categoryId: req.params.categoryId,
        //         cityId: cityId
        //     }
        // })
        // if(!shops) return res.status(400).json({ error: true, message: "Aucun magasin trouver dans cette catégorie dans cette ville" });
        // return res.status(200).json({error: false, shops })

        Shop.findAll(  {
            where: {
                categoryId: req.params.categoryId,
                cityId: cityId
            }
        })

        .then((shops) => {
            res.status(200).json({error: false, shops })
        })
        .catch(err => res.status(400).json({ error: true, err, message: "Aucun magasin trouver dans cette catégorie dans cette ville" }))

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}

exports.getShopSousCategorie = async (req, res) => {
    try {

        let adressUser = await Adress.findByPk(req.params.adressId)

        let cityId = adressUser ?  adressUser.cityId : 0

        Shop.findAll(  {
            where: {
                sousCategoryId: req.params.categoryId,
                cityId: cityId
            }
        })

        .then((shops) => {
            res.status(200).json({error: false, shops })
        })
        .catch(err => res.status(400).json({ error: true, err, message: "Aucun magasin trouver dans cette catégorie dans cette ville" }))

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}

exports.getAllActiveShop = (req, res) => {
    try {
        Shop.findAll({where: {active: true, deleted: 0}})
        .then((validateShop) => {
            res.status(200).json({error: false, validateShop })
        })
        .catch(err => res.status(400).json({ error: true, message: "nous n'avons pas pus récupérer les information  des magasins" }))
    } catch (err) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}

exports.getAllInvalidateShop = (req, res) => {
    try {
        Shop.findAll({where: {active: false, deleted: 0}})
        .then((invalidateShop) => {
            res.status(200).json({error: false, invalidateShop })
        })
        .catch(err => res.status(400).json({ error: true, message: "nous n'avons pas pus récupérer les information  des magasins" }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}

exports.storeShop = (req, res) => {
    try {
        let resultError= validationResult(req).array();
        // console.log(resultError)
        if(resultError.length > 0){  
            return res.status(403).json({ error: true, errorType: "validation", message: resultError });
        }   
        let { 
            name,
            tag,
            tag2,
            bgImage,
            description,
            categoryId,
            sousCategoryId,
            email,
            cityId,
            logo,
            phone,
        } = req.body;

        sousCategoryId = sousCategoryId === '' ? null : sousCategoryId
        Shop.create({
            name,
            tag,
            tag2,
            bgImage,
            description,
            categoryId,
            sousCategoryId,
            email,
            logo,
            phone,
            cityId,
        })
        .then((addedShop) => { 
            
            res.status(201).json({ error: false, addedShop });
        })
        .catch((err) => {
            // console.log(err)
            res.status(405).json({ error: true,err, message: "nous n'avons pas pus ajouter les information  du magasin" })});
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' });
    }
}

exports.updateShop = (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }   

        let { 
            name,
            tag,
            tag2,
            bgImage,
            description,
            categoryId,
            sousCategoryId,
            email,
            cityId,
            logo,
            phone,
        } = req.body;

        Shop.update({
            name,
            tag,
            tag2,
            logo,
            bgImage,
            description,
            categoryId,
            sousCategoryId,
            email,
            cityId,
            phone,
        }, {
            where: { id: req.params.id }
        })
        .then( async () => {
            let updatedShop = await Shop.findByPk(req.params.id, {
                include: [
                    { model: City },
                    { model: Category },
                    { model: SousCategory },
    
                ]
            });
            res.status(202).json({ error: false, updatedShop });
        })
        .catch((err) => res.status(400).json({ error: true, message: "une erreur est survenue lors de la mise à jours des information du magasin" }));
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' });
    }
}

exports.showOneShop = async (req, res) => {
    try {
        Shop.findByPk(req.params.id, {
            include: [
                { model: City },
                { model: Category },
                { model: SousCategory },

            ]
        })
        .then(shop => {
            res.status(200).json({error: false, shop});
        })
        .catch(err => {
            res.status(400).json({ error: true, message: 'can not get delevery man' });
        });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Something went wrong' });
    }
}

exports.validateShop = async (req, res) => {
    try {

        let validatedShop = await Shop.findByPk(req.params.id);
            if(!validatedShop){
                return res.status(400).json({error: true, message: "nous avons pas trouver ce shop"})
            }else{
                validatedShop = validatedShop.toJSON();
            }

            /************  creating user account *****************/

            let password= generatePassword();

            const salt = await bcrypt.genSalt(10);

            let hashedPassword = await bcrypt.hash(password, salt);

            if(!hashedPassword) {
                // hashedPassword = try another way
                // return res.status(300).json({error: true, data: "on peut pa hacher le mot de passe" });
            }

            let typesUsers = await Type.findOne({where: { name : "magasin / restaurant"}});
            let shopAccount = {};

            try {

                shopAccount = await User.create({
                    fullName: validatedShop.name,
                    email : validatedShop.email, 
                    phone: validatedShop.phone, 
                    password: hashedPassword, 
                    active: 1,
                    typeId: typesUsers.dataValues.id, // id type user in model type
                });

                
            } catch (handlerr) {
                console.log(handlerr.name)
                if(handlerr.name === "SequelizeUniqueConstraintError") {
                     await User.update({
                        password: hashedPassword, 
                        active: 1,
                    }, {where: {email: validatedShop.email }});
                }
                shopAccount = await  User.findOne({where: { email : validatedShop.email  }});
                // return res.status(400).json({ error: true, handlerr, message: "Compte utilisateur n'est pas créer" })
            }

                /*****   SENDING email with account details + (password) ********/
               
                let transformedEmail = hiddenEmail(shopAccount.email);
    
                let messageBudy= mailBodyHtml(shopAccount, password, transformedEmail);
    
                let message = {
                    from: process.env.GMAIL_USER_NAME,
                    to: shopAccount.email,
                    subject: "Validation du compte YOBAL",  
                    html: messageBudy,
                };
                
                 let responseMail = await sendMail(message);
               
                let isValidatedShop = await Shop.update({active: true, userId: shopAccount.id}, { where: { id: req.params.id } });
    
                if (!isValidatedShop) return res.status(400).json({ error: true, emailSent: responseMail.sent, message: 'Le compte du magasin est créer mais la modification du magasin est corrompu ' });
    
                // .catch((error) => console.error(error));
                /*****   END sending email ********/
    
                return res.status(200).json({ error: false, emailSent: responseMail.sent, validatedShop, shopAccount, activated: true })
           
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}


exports.inactivateShop = async (req, res) => {
    
    try {
        const result = await Shop.update({ blocked:true}, { where: { id: req.params.id } })
        if (!result) return res.status(400).json({ error: true, message: 'On a pas pus désactivé cette utlisateur' });

        const userShop = await Shop.findOne( { where: { id: req.params.id } })

        let blockedUser = await User.update({  blocked: true }, {where: {id: userShop.userId}})
        if (!blockedUser) return res.status(400).json({ error: true, message: 'On a pas pus désactivé cette utlisateur' });
        /*****   sending email ********/
        return res.status(200).json({ error: false, blockedUser, inactivate: true })
      
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}
exports.deblockShop = async (req, res) => {
    
    try {
        const result = await Shop.update({ blocked:false}, { where: { id: req.params.id } })
        if (!result) return res.status(400).json({ error: true, message: 'On a pas pus désactivé cette utlisateur' });

        const userShop = await Shop.findOne( { where: { id: req.params.id } })

        let blockedUser = await User.update({  blocked: false }, {where: {id: userShop.userId}})
        if (!blockedUser) return res.status(400).json({ error: true, message: 'On a pas pus désactivé cette utlisateur' });
        /*****   sending email ********/
        return res.status(200).json({ error: false, blockedUser, inactivate: true })
      
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }
}



exports.uploadBg = async (req, res) => {
    try {
     
        if (req.body.data === null || req.body.data === undefined) {
        return res.status(400).json({ msg: 'No file uploaded' });
        }
        var file = req.body.data;
        
        let base64Image = file.split(';base64,').pop();
        
        const ext = file.substring(file.indexOf("/")+1, file.indexOf(";base64"));

        
        // const ext = base64Image.substring(base64Image.indexOf("/")+1, base64Image.indexOf(";base64"));
        
        let fileName = moment().format('YYYY-MM-DD-HH-mm:ss') + "." + ext
          if(req.body.fileType === "image"){
        
            fs.writeFile(`public/shopimage/${fileName}`, base64Image, {encoding: 'base64'}, async (err) => {
                if (err) {
                    // console.log(err)
                    return res.status(500).json({ error: true, err});
                }

               /* supression de l'image existant sur le dossier */
                try {
                    fs.unlink(`public/${req.body.oldPicture}`, (err) => {
                        // console.log(err)
                    }) 
                } catch (error) {
                    // console.log(error)
                }
                
                return res.status(200).json({ realName: req.body.realName, fileName, fileLink: `shopimage/${fileName}` });
           });
          }
    } catch (error) {
        // console.log(error)
        res.status(500).json({ error: true, message: 'Something went wrong' })
    }      
}


exports.deleteElement = async (req, res) => {
    try {
        const userShop = await Shop.findOne( { where: { id: req.params.id } })
        let blockedUser = await User.update({  deleted: true }, {where: {id: userShop.userId}})

        let deletedElement = await Shop.destroy({where: {id: req.params.id}});
   
        return res.status(200).json({ error: false, deletedElement});

    } catch (error) {
        try{
           if(error.name === "SequelizeForeignKeyConstraintError"){

            let deletedElement = await Shop.update({
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
            return res.status(500).json({ error: true, message: 'Something went wrong' })
        }
       
    }
          
}
