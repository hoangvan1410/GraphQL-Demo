const { RESOLVER } = require('awilix')
const { Schema } = require('mongoose')

const userSchema = new Schema({
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    hash_password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash_password);
  };

const userModel = ({ database: mongoose }) => mongoose.model('User', userSchema)
module.exports = userModel

userModel[RESOLVER] = {
    name: 'UserSchema'
}