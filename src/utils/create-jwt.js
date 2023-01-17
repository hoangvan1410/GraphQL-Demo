const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const saltRounds = 10;

module.exports = function createJWT(data= { sub: string }){
    return jwt.sign(data, process.env.TOKEN_KEY);
}

