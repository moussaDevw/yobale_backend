const User = require('../models/user')
const Type = require('./../models/type')

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const {  validationResult} = require('express-validator');


exports.sginIn = async (req, res) => {
    try {
        console.log(req.body)
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
            token,
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
            token,
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
        res.status(500).json({ error: true, message: "Something went wrong" });
    }
     
};


exports.signUp = async (req, res) => {
    try {
        let {password, email}= req.body;
        var user = await User.findOne({include: [{model: Type}] ,where:{email: email }});

        if(!user){
            return res.status(400).json({ error: true, message: "email n'éxiste pas" });
        }

        if( user.type.name !== "client"){
            return res.status(400).json({ error: true, message: "Vous n'avez pas l'autorisation d'accéder à la partie client" });
        }

        let validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){ 
            return res.status(400).json({ error: true, message: "mot de passe incorrect" });
        }

        if(user.deleted){
            return res.status(400).json({ error: true, message: "Ce compte à était suprimer" });
        }

        if(user.blocked){
            return res.status(400).json({ error: true, message: "Ce compte à était blocker par un admin vous ne pouvez pas accédez à votre compte pour le moment" });
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
        console.log(error)

        return res.status(500).json({ error: true, error, message: "Something went wrong" });
    }
}

exports.signUpAdmin = async (req, res) => {
    try {
        let {password, email}= req.body;
        var user = await User.findOne({ include: [{model: Type}] ,  where:{email: email }});

        if(!user){
            return res.status(400).json({ error: true, message: "email n'éxiste pas" });
        }

        if( user.type.name !== "admin" && user.type.name !== "super admin"){
            return res.status(400).json({ error: true, message: "Vous n'avez pas l'autorisation d'accéder à la partie admin" });
        }

        let validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){ 
            return res.status(400).json({ error: true, message: "mot de passe incorrect" });
        }

        if(user.deleted){
            return res.status(400).json({ error: true, message: "Ce compte à était suprimer" });
        }
        
        if(user.deleted){
            return res.status(400).json({ error: true, message: "Ce compte à était suprimer" });
        }

        if(user.blocked){
            return res.status(400).json({ error: true, message: "Ce compte à était blocker par un admin vous ne pouvez pas accédez à votre compte pour le moment" });
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
        console.log(error)
        return res.status(500).json({ error: true,error, message: "Something went wrong" });
    }
}



exports.signUpRestaurant = async (req, res) => {
    try {
        let {password, email}= req.body;
        var user = await User.findOne({include: [{model: Type}] ,where:{email: email }});

        if(!user){
            return res.status(400).json({ error: true, message: "email n'éxiste pas" });
        }

        if( user.type.name !== "magasin / restaurant"){
            return res.status(400).json({ error: true, message: "Vous n'avez pas l'autorisation d'accéder à la partie des réstaurants et magasins" });
        }

        let validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){ 
            return res.status(400).json({ error: true, message: "mot de passe incorrect" });
        }

        if(user.deleted){
            return res.status(400).json({ error: true, message: "Ce compte à était suprimer" });
        }

        if(user.blocked){
            return res.status(400).json({ error: true, message: "Ce compte à était blocker par un admin vous ne pouvez pas accédez à votre compte pour le moment" });
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
        console.log(error)
        return res.status(500).json({ error: true, error, message: "Something went wrong" });
    }
}



exports.signUpLivreur = async (req, res) => {
    try {
        let {password, email}= req.body;
        var user = await User.findOne({include: [{model: Type}] ,where:{email: email }});

        if(!user){
            return res.status(400).json({ error: true, message: "email n'éxiste pas" });
        }

        if( user.type.name !== "livreur"){
            return res.status(400).json({ error: true, message: "Vous n'avez pas l'autorisation d'accéder à la partie des livreurs" });
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


        if(user.deleted){
            return res.status(400).json({ error: true, message: "Ce compte à était suprimer" });
        }
        
        if(user.blocked){
            return res.status(400).json({ error: true, message: "Ce compte à était blocker par un admin vous ne pouvez pas accédez à votre compte pour le moment" });
        }

        return res.status(200).header('auth-token', token).json({ error: false, token, user }) 
    } catch (error) {
        console.log(error)

        return res.status(500).json({ error: true, error, message: "Something went wrong" });
    }
}


exports.verifAuth = async (req, res) => {
    try {
        
        let user = await User.findByPk(req.user.id)

        return res.status(200).json({ error: false, isAuth: true, user }) 
    } catch (error) {
        return res.status(500).json({ error: true, message: "Something went wrong" });
    }
}
exports.updateToken = async (req, res) => {
    try {
        let {token, email} = req.body;
        
    let user = await User.update({token: token}, {where: {email: email}})

        return res.status(200).json({ error: false, user }) 
    } catch (error) {
        return res.status(500).json({ error: true, message: "Something went wrong" });
    }
}
exports.verifAuthShop = async (req, res) => {
    try {
        
        let user = await User.findByPk(req.user.id)

        return res.status(200).json({ error: false, isAuth: true, user }) 
    } catch (error) {
        return res.status(500).json({ error: true, message: "Something went wrong" });
    }
}

exports.verifAuthLivreur = async (req, res) => {
    try {
        
        let user = await User.findByPk(req.user.id)

        return res.status(200).json({ error: false, isAuth: true, user }) 
    } catch (error) {
        return res.status(500).json({ error: true, message: "Something went wrong" });
    }
}