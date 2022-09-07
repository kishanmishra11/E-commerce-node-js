const mongoose = require("mongoose");

const productPriceListSchema = new mongoose.Schema({

        productId : {
            type: mongoose.Schema.ObjectId,
        },
        colorName: {
            type: String,
        },
        price: {
            type: Number,
        },
        regularDiscountedPrice: {
            type: Number,
        },
        primeDiscountedPrice: {
            type: Number,
        },
        stoke: {
            type: Number,
        },
        status: {
            type: Number,
            default: 1,
            enum: [1, 2, 3]
        }
    },
    { collection: "productPriceList", timestamps: true})

const productPriceList = new mongoose.model('productPriceList', productPriceListSchema);

module.exports = productPriceList;