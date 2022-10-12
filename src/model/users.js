const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    userName :{
        type: String,
        unique: true,
    },
    phone:{
        type:String,
    },
    email:{
        type:String,
        },
    password:{
        type:String,
        unique: true,
    },
    profilePicture:{
        type:String,
        //required:true,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    },
    superCoin:{
        type:Number,
        default: 0,
    },
    userType: {
        type: String,
        default: "regular",
        enum: ["regular", "prime"]
    },
    primeExpiryDate:{
        type: Date,
    },
    referralCode:{
        type:String,
    },
    applyReferralCode:{
        type:String,
    },
    wallet:{
        type:Number,
        default: 0,
    },
})

const User = new mongoose.model('User', userSchema);

module.exports = User;