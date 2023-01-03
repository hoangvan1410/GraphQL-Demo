const User = require("../../models/user");
//const jwt = require("../../Config/security/jwt");
async function createUser(user) {
    try {
        await user.save();
    } catch (err) {
        console.log(err);
    }
}

async function getAllUser(){
    //return await HealthInfo.find();
    let user = User.find();
    console.log("aaaaaaaaaaaaaaaaaa", user)
    return await User.find();
}

async function getUser(id){
    //return await HealthInfo.find();
    return await User.findOne({uuid : id});
}

// async function updateHealthInfo(newInfo){
//     await HealthInfo.deleteOne({userId : newInfo.userId})
//     return await createHealthInfo(newInfo)
// }

module.exports = {
    createUser,
    getAllUser,
    getUser
};
