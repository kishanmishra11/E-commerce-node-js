const mongoose = require("mongoose");

//Category Model
const categorySchema = new mongoose.Schema({ 
    categoryName : {
        type: String,
    },
    categoryNameGuj :{
        type: String,
    },
    categoryDescription : {
        type: String,
    },
    categoryDescriptionGuj : {
        type: String,
    },
    categoryImage : {
        type: String,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    }
} ,{ collection: "category", timestamps: true})
const Category = new mongoose.model('category', categorySchema);

module.exports = Category;


