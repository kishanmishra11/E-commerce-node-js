const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema({
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
},{ collection: "wishlist", timestamps: true})

const Wishlist = new mongoose.model('wishlist', wishListSchema);

module.exports = Wishlist;