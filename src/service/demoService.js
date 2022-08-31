const Cart = require('../model/cart');
let ObjectId = require("mongodb").ObjectId

exports.demoService = async (data) => {
    try{
        let pipeline = [];

        pipeline.push(
            {
                $match: {
                    userId: ObjectId(data.userId)
                },
            },
            // {
            //     $limit:4
            // },
            // {
            //     $skip: 3
            // },
            // {
            //     $sort : {
            //         productId : 1
            //     }
            // },
            // {
            //     $set:
            //         {
            //             quantity: 3
            //         }
            // },
        // {
        //     $count: "userId"
        // },

            {
                $lookup: {
                    from: "product",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productData",
               },
            },
            {
                $unwind: '$productData'
            },
            {
                $addFields: {
                    "discount": {$divide: [{$multiply: ["$productData.productPrice", "$productData.productDiscount", "$quantity"]}, 100]}
                }
            },
            {
                $group:{
                    _id: "$userId",
                    subTotal:{ $sum :  "$productData.productPrice" },
                    discount:{ $sum :"$discount" },
                },
            },
            {
                $addFields: {
                    finalAmount: {$subtract: ["$subTotal", "$discount"]}
                }
            },
        )

        const result = await Cart.aggregate(pipeline);
        return result;
    } catch (e) {
        console.log(e);
        return false;
    }
}