const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    userId : {
        type: mongoose.Schema.ObjectId,
    },
    subTotal:{
        type:Number,
    },
    productDiscount : {
        type: Number,
    },
    promoDiscount:{
        type:Number,
    },
    finalAmount:{
        type:Number,
    },
    offerDiscount:{
        type:Number,
    },
    addressId : {
        type: mongoose.Schema.ObjectId,
    },
    promoCodeId : {
        type: mongoose.Schema.ObjectId,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    },
    orderStatus: {
        type: String,
        default: "confirmed",
        enum: ["confirmed", "dispatched", "out for delivery", "delivered" , "cancelled"]
    },
    paymentStatus:{
        type: Boolean,
        default: false,
    }


},
    { collection: "order", timestamps: true})

const order = new mongoose.model('order', orderSchema);

module.exports = order;