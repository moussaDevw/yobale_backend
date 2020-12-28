const User = require('../models/user')
const Type = require('../models/type')
const Authorisation = require('./../models/authorisation')

exports.general = async (req, res, next) => {
    try{
        if(req.user.typeId === 1){
            return next()
        }
        let typeUser = await Authorisation.findAll( { 
            include: {
                model: Type,
                where: {
                    id: req.user.typeId
                }
            },
            attributes: ['id','name', ['canGet', 'get'], ['canPost', 'post'], [ 'canPut', 'put'], ['canDelete', 'delete']] //id, first AS firstName

        });
        if(!typeUser) return res.status(401).json({error: true, message: "on a pas pus récupérer votre type"});

        var authorisationUser = await typeUser.map(function(sensor){ return sensor.toJSON() });

        let thisRoot = authorisationUser.find(a => a.name === req.originalUrl.split('/')[1])
        if(!thisRoot)  return res.status(401).json({error: true, error: "your permission are insufficient"});
        if(thisRoot[req.method.toLowerCase()]){
            return next()
        }
        else {
            return res.status(401).json({error: true, error: "your permission are insufficient"});
        }
         
    }
    catch (err){
        console.log(err)
        return res.status(400).json({error: true, error: err})
    }
    
};

exports.activateAccount = async (req, res, next) => {
    try{

        if(req.user.typeId === 1){
            return next()
        }

        const typeUser = await Type.findOne( {
          where: {
              id: req.user.typeId
          }
        });
       
        if(!typeUser) return res.status(401).json({error: true, message: "on a pas pus récupérer votre type"});
        if(typeUser.dataValues.name === "admin"){
            return next();
        }else {
            return res.status(401).json({error: true, error: "your permission are insufficient"});
        }
    }
    catch (err){
        console.log(err)
        return res.status(400).json({error: true, error: err})
    }
    
};