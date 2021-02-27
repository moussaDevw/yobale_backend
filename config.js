const dotenv = require('dotenv');
dotenv.config()
console.log(process.env.NODE_ENV === "production", process.env.NODE_ENV , "production")

if (process.env.NODE_ENV === "production") {
    module.exports = require("./prod");
  } else {
    module.exports = require("./dev");
  }