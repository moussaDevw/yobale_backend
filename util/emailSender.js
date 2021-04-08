

const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD, MAIN_URL, SERVICE, GMAIL_SERVICE_PORT } = require("../config");
 // dfIdjF19gwtZ
let transporter = nodemailer.createTransport({
    service:'Zoho',
    host: "smtp.zoho.com",
    port: "465",
    secure: false,
    auth: {
        user: "contact@yobalapp.com",
        pass: "dfIdjF19gwtZ",
    },
});


exports.sendMail = async ( message ) => {
    await transporter.sendMail(message, (error, data) => {
        console.log(error, data)
        return { error, data}
    });
}

exports.hiddenEmail  = (item) => {
    var parts = item.split("@"), len = parts[0].length, len1 = parts[1].length
    return item.replace(parts[0].slice(3,-1), "*".repeat(len - 2)).replace(parts[1].slice(1,-3), "*".repeat(len1 - 2));          
}