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
    regularDiscount : {
        type: Number,
    },
    primeDiscount:{
      type:Number,
    },
    totalPrimeDiscount:{
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
    viewCount:{
        type:Number,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    }

},{ collection: "product", timestamps: true})

const Product = new mongoose.model('product', productSchema);

module.exports = Product;