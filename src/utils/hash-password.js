
const bcrypt = require('bcrypt')
const saltRounds = 10;

module.exports = function hashPassword(plainText){
    return bcrypt.hashSync(plainText, 10);
}


