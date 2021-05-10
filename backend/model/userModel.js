const mongoose = require("mongoose");
const bcrypt= require("bcrypt");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A user must have a name"]
    },
    email: {
        type: String,
        required: [true, "A user must have an email"],
        unique: [true, "This email already exists"]
    },
    password: {
        type: String,
        required: [true, "A user must have a password"],
        minlength: [8, "password must be 8 characters long"]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    passwordChangedAt: {
        type: Date,
        default: null
    },
    secretKey: {
        type: String
    },
    accessKey: {
        type: String
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals:  true}
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))
        return next();
    this.password=await bcrypt.hash(this.password,10);
    this.confirmPassword=undefined;
    next();
})

userSchema.methods.correctPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

const UserModel = mongoose.model("User", userSchema);

module.exports= UserModel;