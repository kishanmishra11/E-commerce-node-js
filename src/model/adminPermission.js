const mongoose = require("mongoose");
const validator = require("validator");

const adminPermissionSchema = new mongoose.Schema({
    adminId :{
        type: String,
    },
    module:{
        type:String,
    },
    route:{
        type:Array,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    },
},{ collection: "adminPermission", timestamps: true})

const adminPermission = new mongoose.model('adminPermission', adminPermissionSchema);

module.exports = adminPermission;