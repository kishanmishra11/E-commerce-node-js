const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({

    promoCodeName :{
        type: String,
    },
    promoCodeNameGuj:{
        type:String,
    },
    promoDiscount:{
        type:Number,
    },
    startDate:{
        type: Date,
    },
    endDate:{
        type:Date,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    }

},{ collection: "promoCode", timestamps: true})

const promoCode = new mongoose.model('promoCode', promoCodeSchema);

module.exports = promoCode;