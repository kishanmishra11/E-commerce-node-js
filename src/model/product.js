const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({ 
    categoryId : {
        type: mongoose.Schema.ObjectId,
    },
    subCategoryId : {
        type: mongoose.Schema.ObjectId,
    },
    productName : {
        type: String,
    },
    productNameGuj : {
        type: String,
    },
    productPrice : {
        type: Number,
    },
    productDiscount : {
        type: Number,
    },
    discountedPrice : {
        type: Number,
    },
    productDescription : {
        type: String,
    },
    productDescriptionGuj : {
        type: String,
    },
    productImage : {
        type: String,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    }

},{ collection: "product", timestamps: true})

const Product = new mongoose.model('product', productSchema);

module.exports = Product;