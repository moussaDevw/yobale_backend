const User = require('../models/user')
const Type = require('./../models/type')

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const {  validationResult} = require('express-validator');


exports.sginIn = async (req, res) => {
    try {
        let resultError= validationResult(req).array()

        if(resultError.length > 0){  
            return res.status(400).json({ error: true, message: resultError });
        }

        let {
            fullName, 
            email, 
            password, 
            phone, 
            image,
        } = req.body;

        const salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);
        if(!hashedPassword) {
            return res.status(300).json({error: true, data: "on peut pa hacher le mot de passe" });
        }
        let typesUsers = await Type.findOne({where: { name : "client"}});

        User.create({ 
            fullName, 
            email, 
            phone, 
            image,
            password: hashedPassword, 
            active: 1, 
            typeId: typesUsers.dataValues.id, // id type user in model type
        })
        .then(user => {
            var token = jwt.sign(
                { 
                id: user.id, 
                typeId: user.typeId 
                },
                process.env.TOKEN_SECRET,
            );

            res.status(200).json({error: false, user, token });
        })
        .catch(err => {
            res.status(400).json({error: true, data: err });
        }) 
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: "server problem" });
    }
     
};


exports.signUp = async (req, res) => {
    try {
        let {password, email}= req.body;
        var user = await User.findOne({where:{email: email }});

        if(!user){
            return res.status(400).json({ error: true, message: "email n'éxiste pas" });
        }
        let validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){ 
            return res.status(400).json({ error: true, message: "mot de passe incorrect" });
        }

        var token = jwt.sign(
            { 
            id: user.id, 
            typeId: user.typeId 
            },
            process.env.TOKEN_SECRET,
        );
        delete user.dataValues.password;
        delete user._previousDataValues.password;

        return res.status(200).header('auth-token', token).json({ error: false, token, user }) 
    } catch (error) {
        return res.status(500).json({ error: true, message: "server problem" });
    }
}

exports.signUpAdmin = async (req, res) => {
    try {
        let {password, email}= req.body;
        var user = await User.findOne({where:{email: email }});

        if(!user){
            return res.status(400).json({ error: true, message: "email n'éxiste pas" });
        }

        if( user.dataValues.typeId !== 1){
            return res.status(400).json({ error: true, message: "Vous n'avez pas l'autorisation d'accéder à la partie admin" });
        }

        let validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){ 
            return res.status(400).json({ error: true, message: "mot de passe incorrect" });
        }
        
        var token = jwt.sign(
            { 
            id: user.id, 
            typeId: user.typeId 
            },
            process.env.TOKEN_SECRET,
        );
        delete user.dataValues.password;
        delete user._previousDataValues.password;

        return res.status(200).header('auth-token', token).json({ error: false, token, user }) 
    } catch (error) {
        // console.log(error)
        return res.status(500).json({ error: true, message: "server problem" });
    }
}



exports.verifAuth = async (req, res) => {
    try {
        
        let user = await await User.findByPk(req.user.id)

        return res.status(200).json({ error: false, isAuth: true, user }) 
    } catch (error) {
        return res.status(500).json({ error: true, message: "server problem" });
    }
}