const UserModel = require("../model/userModel")
const { redisClient } = require("./ec2InstanceController")

const updateUser = async (params, data) => {
    return UserModel.findByIdAndUpdate(params, data, {new: true})
}

exports.addAwsCredentials = async (req, res, next) => {
    try {
        const {accessKey, secretKey} = req.body

        if(!accessKey || !secretKey)
            throw new AppError("Invalid Body!", 400)
        
        const user = await updateUser({_id: req.currentUser._id}, {accessKey, secretKey});

        res.json({
            status: "success",
            data: user
        })

        redisClient.del(`instanceDetail_${req.currentUser._id.toString()}`)
        redisClient.hdel("instances", req.currentUser._id.toString())


    } catch (err) {
        next(err)
    }


}