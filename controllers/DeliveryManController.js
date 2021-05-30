const DeliveryMan = require('../models/deliveryman');
const User = require('./../models/user');
const City = require('./../models/city');
const Delivery = require('./../models/delivery');
const Type = require('./../models/type');

var bcrypt = require('bcryptjs');

const {  validationResult} = require('express-validator');

exports.getAllDeliveryMan = (req, res) => {
    try {
        DeliveryMan.findAll( { where : { deleted: 0 }})
        .then((deliveryMen) => {
            res.status(200).json({error: false, deliveryMen })
        })
        .catch(err => res.status(400).json({ error: true, message: 'can not get delevery men' }))

    } catch (err) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.getAllActiveDeliveryMan = (req, res) => {
    try {
        DeliveryMan.findAll({where: {active: true, deleted: 0}})
        .then((validateDeliveryMen) => {
            res.status(200).json({error: false, validateDeliveryMen })
        })
        .catch(err => res.status(400).json({ error: true, message: 'can not get delevery men' }))
    } catch (err) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.getAllInvalidateDeliveryMan = (req, res) => {
    try {
        DeliveryMan.findAll({where: {active: false, deleted: 0}})
        .then((invalidateDeliveryMen) => {
            res.status(200).json({error: false, invalidateDeliveryMen })
        })
        .catch(err => res.status(400).json({ error: true, message: 'can not get delevery men' }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.storeDeliveryMan = (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, validator:true, errorType: "validation" , message: resultError });
        }   
        let { allWeek, 
            allDay, 
            fullName,
            vehicule,
            email,
            phone,
            cityId,
        } = req.body;

        DeliveryMan.create({ 
            allWeek, 
            allDay, 
            fullName,
            vehicule,
            email,
            phone,
            cityId,
        })
        .then((addedDeliveryMan) => {

            
            res.status(201).json({ error: false, addedDeliveryMan });
        })
        .catch((err) => res.status(400).json({ error: true, err, validator:false,  message: 'can not added delevery' }))
    } catch (error) {
        res.status(500).json({ error: true, validator:false, message: 'server problem' })  
    }
}

exports.updateDeliveryMan = (req, res) => {
    try {
        let resultError= validationResult(req).array();

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, errorType: "validation" , message: resultError });
        }   

        let { 
            allWeek, 
            allDay, 
            fullName,
            vehicule,
            email,
            phone,
            cityId,
        } = req.body;

        DeliveryMan.update({
            allWeek, 
            allDay, 
            vehicule,
            email,
            phone,
            fullName,
            cityId,
        }, {
            where: { id: req.params.id }
        })
        .then( async () => {
            let updatedDeliveryMan = await DeliveryMan.findByPk(req.params.id, {
                include: [
                    { model: City },
                ]
            })
            res.status(202).json({ error: false, updatedDeliveryMan });
        })
        .catch((err) => res.status(400).json({ error: true, message: "can not update delevery man" }))
    } catch (error) {
        res.status(500).json({ error: true, message: 'server problem' });
    }
}

exports.showOneDeliveryMan = async (req, res) => {
    try {
        let deliveryMan = await DeliveryMan.findByPk(req.params.id, {
            include: [
                { model: City },
            ]
        })

        if(!deliveryMan) return res.status(400).json({ error: true, message: 'livreur non trouvé' }); 
        
        let deliveries = await Delivery.findAll({where: { deliveryManId: req.params.id, deleted:0 }});
        deliveryMan.setDataValue('deliveries', deliveries );
        res.status(200).json({error: false, deliveryMan});    
    } catch (error) {
        // console.log(error)
        res.status(500).json({ error: true, err: error, message: 'server problem' });
    }
}

exports.validateDeliveryMan = async (req, res) => {
    try {
        
            let validatedDeliveryMan = await DeliveryMan.findByPk(req.params.id);

            validatedDeliveryMan = validatedDeliveryMan.toJSON();

            let checkExistingUser = await User.findOne({where: {email : validatedDeliveryMan.email}});

            if(!checkExistingUser){
                /************ START creating user account *****************/
                
                let fullName = validatedDeliveryMan.name;
                let password= "generate_random_password";

                const salt = await bcrypt.genSalt(10);

                let hashedPassword = await bcrypt.hash(password, salt);

                let typesUsers = await Type.findOne({where: { name : "livreur"}});
                
                let deliveryManAccount = await User.create({
                    fullName,
                    email: validatedDeliveryMan.email,
                    phone: validatedDeliveryMan.phone,
                    password: hashedPassword,
                    active: 1,
                    typeId: typesUsers.dataValues.id, // id type user in model type
                });
                await DeliveryMan.update({active: true, userId: deliveryManAccount.id}, { where: { id: req.params.id } })
                /************  END creating user account *****************/

                  /*****   sending email with account details + (password) ********/


                res.status(200).json({ error: false, deliveryManAccount, validatedDeliveryMan, activated: true })

            }
            else {
                res.status(200).json({ error: false, haveAlreadyAccont: false, deliveryManAccount: checkExistingUser, validatedDeliveryMan, activated: true })

            }
           

          
        
        // .catch(err => {
        //     res.status(400).json({ error: true,err:err, message: 'can not activate' });
        // })
    } catch (error) {
        // console.log(error)
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

exports.inactivateDeliveryMan = async (req, res) => {

    try {
        const result = await DeliveryMan.update({ blocked:true}, { where: { id: req.params.id } })
        if (!result) return res.status(400).json({ error: true, message: 'On a pas pus désactivé cette utlisateur' });

        const userDelivery = await DeliveryMan.findOne( { where: { id: req.params.id } })

        let blockedUser = await User.update({  blocked: true }, {where: {id: userDelivery.userId}})
        if (!blockedUser) return res.status(400).json({ error: true, message: 'On a pas pus désactivé cette utlisateur' });
        /*****   sending email ********/
        return res.status(200).json({ error: false, blockedUser, inactivate: true })
      
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: 'server problem' })
    }
}



exports.deleteElement = async (req, res) => {
    try {
        let deletedElement = await DeliveryMan.destroy({where: {id: req.params.id}});
   
        return res.status(200).json({ error: false, deletedElement});

    } catch (error) {
        try{
           if(error.name === "SequelizeForeignKeyConstraintError"){

            let deletedElement = await DeliveryMan.update({
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

exports.deblockDeliveryMan = async (req, res) => {
    try {
        const result = await DeliveryMan.update({ blocked:false}, { where: { id: req.params.id } })
        if (!result) return res.status(400).json({ error: true, message: 'On a pas pus désactivé cette utlisateur' });

        const userShop = await DeliveryMan.findOne( { where: { id: req.params.id } })

        let blockedUser = await User.update({  blocked: false }, {where: {id: userShop.userId}})
        if (!blockedUser) return res.status(400).json({ error: true, message: 'On a pas pus désactivé cette utlisateur' });
        /*****   sending email ********/
        return res.status(200).json({ error: false, blockedUser, inactivate: true })
      
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: 'server problem' })
    }
}

