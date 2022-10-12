const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({

        categoryId : {
            type: mongoose.Schema.ObjectId,
        },
        productId : {
            type: mongoose.Schema.ObjectId,
        },
        title:{
            type:String,
        },
        description : {
            type: String,
        },
        amountType:{
            type:String,
            enum: ["percentage", "amount"]
        },
        amount:{
            type:Number,
        },
        limit:{
            type:Number,
        },
        offerType: {
            type: String,
            enum: ["buyOneGetOne", "flatDiscount", "specialDiscount" ]
        },
        startDate:{
            type: Date
        },
        endDate:{
            type: Date
        },
        status: {
            type: Number,
            default: 1,
            enum: [1, 2, 3]
        },
    },
    { collection: "offer", timestamps: true})

const offer = new mongoose.model('offer', offerSchema);

module.exports = offer;