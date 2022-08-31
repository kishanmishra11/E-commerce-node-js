const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    adminName :{
        type: String,
    },
    phone:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    role:{
        type:String,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    }
})


const Admin = new mongoose.model('Admin', adminSchema);

module.exports = Admin;