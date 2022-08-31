const mongoose = require("mongoose");

const trackOrderSchema = new mongoose.Schema({

        orderId : {
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
            enum: ["confirmed", "dispatched", "out for delivery", "delivered", "cancelled"]
        },
        confirmedDate:{
            type: Date,
        },
        dispatchedDate:{
            type: Date,
        },
        outForDeliveryDate:{
            type: Date,
        },
        deliveredDate:{
            type: Date,
        },
        cancelledDate:{
            type: Date,
        },
        status: {
            type: Number,
            default: 1,
            enum: [1, 2, 3]
        }

    },
    { collection: "trackOrder", timestamps: true})

const trackOrder = new mongoose.model('trackOrder', trackOrderSchema);

module.exports = trackOrder;