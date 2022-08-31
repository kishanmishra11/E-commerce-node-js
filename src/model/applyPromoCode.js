const mongoose = require("mongoose");

const applyPromoCodeSchema = new mongoose.Schema({

    userId : {
        type: mongoose.Schema.ObjectId,
    },
    promoCodeId : {
        type: mongoose.Schema.ObjectId,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    }

},{ collection: "applyPromoCode", timestamps: true})

const applyPromoCode = new mongoose.model('applyPromoCode', applyPromoCodeSchema);

module.exports = applyPromoCode;