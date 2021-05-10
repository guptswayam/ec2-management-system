const User = require("./../model/userModel");
const AppError = require("./../utils/appError");
const { redisClient } = require("./ec2InstanceController");
exports.signupController = async (req,res,next)=>{
    try{
        const newUser = {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
        }

        const user = await User.create(newUser);
        user.password = undefined;

        res.status(201).json({
            status: "success",
            data: user
        })

    } catch(error){
        return next(error);
    }
    
}

exports.loginController = async (req, res, next)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password)
            return next(new AppError("Please provide email and password",400));
        const user=await User.findOne({email:req.body.email});
        if(!user||!await user.correctPassword(req.body.password))
            return next(new AppError("invalid email or password",401));
        
        req.session.userId = user._id;
        user.password= undefined;
        res.status(200).json({
            status: "success",
            data: user
        })
    } catch (error) {
        return next(error);
    }
}

exports.protect = async (req, res, next)=>{
    // console.log(req.session.userId);
    if(!req.session.userId){
        return next(new AppError(new Error("You are not Authenticated", 401)));
    }
    else{
        const user = await User.findById(req.session.userId);
        if(!user)
            return next(new AppError("Invalid Credentials", 401));
        else
            req.currentUser = user;
    }
    next();
}

exports.getMe= async(req, res, next)=>{
    try {
        const user = await User.findById(req.currentUser._id, { password: 0});
        res.status(200).json({
            status: "success",
            data: user
        })
    } catch (error) {
        return next(error);
    }
}

exports.logoutController = (req,res,next)=>{
    req.session.destroy(err=>{
        if(err) next(new AppError("somthing went wrong"));
        else
            res.status(200).json({
                status: "success"
            })
            redisClient.del(`instanceDetail_${req.currentUser._id.toString()}`)
            redisClient.hdel("instances", req.currentUser._id.toString())
    });
}