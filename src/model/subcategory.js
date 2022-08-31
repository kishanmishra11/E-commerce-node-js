const mongoose = require("mongoose");


const subCategorySchema = new mongoose.Schema({ 
    categoryId : {
        type: mongoose.Schema.ObjectId,
    },
    
    subCategoryName : {
        type: String,
    },
    subCategoryNameGuj:{
        type: String,
    },

    subCategoryDescription : {
        type: String,
    },
    subCategoryDescriptionGuj : {
        type: String,
    },
    subCategoryImage : {
        type: String,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    }
},{ collection: "subCategory", timestamps: true})

const subCategory = new mongoose.model('subCategory', subCategorySchema);

module.exports = subCategory;
