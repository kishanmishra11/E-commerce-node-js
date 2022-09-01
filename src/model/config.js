const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({

    deliveryCharge:{
        type:Number,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    }

},{ collection: "config", timestamps: true})

const Config = new mongoose.model('config', configSchema);

module.exports = Config;