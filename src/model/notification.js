const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

        userId : {
            type: mongoose.Schema.ObjectId,
        },
        orderId : {
            type: mongoose.Schema.ObjectId,
        },
        isRead:{
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
        },
        body: {
            type: String,
        },
        status: {
            type: Number,
            default: 1,
            enum: [1, 2, 3]
        }
    },
    { collection: "notification", timestamps: true})

const notification = new mongoose.model('notification', notificationSchema);

module.exports = notification;