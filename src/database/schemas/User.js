// const { RESOLVER } = require('awilix')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})


//const userModel = ({ database: mongoose }) => mongoose.model('User', userSchema)
module.exports = mongoose.model('user', userSchema)

// userModel[RESOLVER] = {
//     name: 'UserSchema'
// }