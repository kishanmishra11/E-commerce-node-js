const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({

    cityName:{
        type:String,
    },

},{ collection: "city", timestamps: true})

const City = new mongoose.model('city', citySchema);

module.exports = City;