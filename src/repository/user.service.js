const User = require("../models/user");
//const jwt = require("../../Config/security/jwt");
async function createUser(user) {
    try {
        await user.save();
    } catch (err) {
        console.log(err);
    }
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
    getUser
};
