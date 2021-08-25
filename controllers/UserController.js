const User = require('./../models/user')

const Type = require('./../models/type')
const Adress = require('./../models/adress')
const {  validationResult} = require('express-validator');

exports.addUser = (req, res) => {
    let {name, email, password, active, type} = req.body
    User.create({ name: name, email: email, password: password, active: active, typeId:type })
    .then(user => res.status(200).json({error: false, data: user }))
}

exports.updateUser = (req, res) => {

    let {name, email, password, active, type} = req.body

    User.update({ name: name, email: email, password: password, active: active, typeId:type })
    .then(user => res.status(200).json({error: false, data: user }) )
    .catch(err => res.status(200).json({error: true, data: "this user is not found" }))
}

exports.getAllCustmers = (req, res) => {

    User.findAll({ include: [{ model: Type}], where : { deleted: 0, typeId: 3 } })
    .then((custmers   ) => res.status(200).json({error: false, custmers }) )
    .catch(err => res.status(200).json({error: true, data: users }))

}
exports.getAllUsers = (req, res) => {

    User.findAll({ include: [{ model: Type}], where : { deleted: 0 } })
    .then((users) => res.status(200).json({error: false, data: users }) )
    .catch(err => res.status(200).json({error: true, data: users }))

}
exports.getOneUser = async (req, res) => {
    
    try {
        const user = await User.findByPk(req.params.id, { include: [{ model: Adress, require: false}] })
        
        return res.status(200).json({error: false, user }) 
    } catch (error) {
        console.log(error)
    }
    // .then((user) => res.status(200).json({error: false, user }) )
    // .catch(err => res.status(200).json({error: true,err, data: "this user is not found" }))

}
exports.deleteUser = () =>{
    res.status(200).json({error: true, data: "you can not delete this user" })
}
exports.editUser =(req, res) =>{
   
}