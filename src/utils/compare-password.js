const bcrypt = require('bcrypt')

module.exports = function comparePassword(plainText, hash){
    return bcrypt.compare(plainText, hash);
}
