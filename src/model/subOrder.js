const mongoose = require("mongoose");

const subOrderSchema = new mongoose.Schema({

    orderId : {
        type: mongoose.Schema.ObjectId,
    },
    productId : {
        type: mongoose.Schema.ObjectId,
    },
    quantity : {
        type: Number,
    },
    discountedPrice:{
        type:Number,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    }

},{ collection: "subOrder", timestamps: true})

const subOrder = new mongoose.model('subOrder', subOrderSchema);

module.exports = subOrder;