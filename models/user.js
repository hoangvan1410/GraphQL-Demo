const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
        uuid: String,
        mail: String,
        userName: String
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
