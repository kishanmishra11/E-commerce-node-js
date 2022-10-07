const mongoose = require("mongoose");

const viewCountSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.ObjectId,
    },
    productId : {
        type: mongoose.Schema.ObjectId,
    },
    countStatus:{
        type:Boolean,
        default:false
    }

},{ collection: "viewCount", timestamps: true})

const viewCount = new mongoose.model('viewCount', viewCountSchema);

module.exports = viewCount;