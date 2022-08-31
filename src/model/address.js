const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.ObjectId,
    },
    userName :{
        type: String,
    },
    phone:{
        type:String,
    },
    email:{
        type:String,
    },
    cityId:{
        type: mongoose.Schema.ObjectId,
    },
    houseNo:{
        type:String,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    }

},{ collection: "address", timestamps: true})

const Address = new mongoose.model('address', addressSchema);

module.exports = Address;