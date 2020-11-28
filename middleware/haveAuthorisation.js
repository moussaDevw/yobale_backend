const User = require('../models/user')
const Type = require('../models/type')
const Authorisation = require('./../models/authorisation')
module.exports = async (req, res, next) => {
    try{
        let typeUser = await Authorisation.findAll( { 
            include: Type,
            attributes: ['id','name', ['canGet', 'get'], ['canPost', 'post'], [ 'canPut', 'put'], ['canDelete', 'delete']] //id, first AS firstName

        });
        if(!typeUser) return res.status(401).json({error: true, message: "on a pas pus récupérer votre type"});

        var authorisationUser = await typeUser.map(function(sensor){ return sensor.toJSON() });
        
        let thisRoot = authorisationUser.find(a => a.name === req.originalUrl.split('/')[1])
        if(!thisRoot)  return res.status(401).json({error: true, error: "your permission are insufficient"});
        if(thisRoot[req.method.toLowerCase()]){
            next()
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