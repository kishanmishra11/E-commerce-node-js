const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.ObjectId,
            required: true
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        star: {
            type: Number,
            required: true,
            Enum: [1,2,3,4,5]
        },
        status: {
            type: Number,
            default: 1,
            Enum: [1, 2, 3],
        }
    },
    { collection: "rating", timestamps: true }
);
module.exports = mongoose.model("rating", RatingSchema);