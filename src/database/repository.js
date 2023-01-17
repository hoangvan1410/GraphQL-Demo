const User = require("./schemas/User");

async function getUser(email){
    console.log(email)
    let user = await User.findOne({email:email});
    console.log(user);
    return user;
}

async function createUser(user){
    console.log("create",user)
    try {
        await user.save();
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getUser,
    createUser
}