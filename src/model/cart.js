const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.ObjectId,
    },
    productId : {
        type: mongoose.Schema.ObjectId,
    },
    productPriceListId : {
        type: mongoose.Schema.ObjectId,
    },
    quantity : {
        type: Number,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    }
},{ collection: "cart", timestamps: true})

const Cart = new mongoose.model('cart', cartSchema);

module.exports = Cart;