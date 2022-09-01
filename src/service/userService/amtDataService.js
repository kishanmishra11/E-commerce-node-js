const Cart = require('../../model/cart');
let ObjectId = require("mongodb").ObjectId

exports.amtDataService = async (data) => {
    try{
        let pipeline = [];

        pipeline.push(
            {
                $match: {
                    userId: ObjectId(data.userId)
                }
            },
            {
                $lookup:{
                    from: "config",
                    localField: "configId",
                    foreignField: "configId",
                    as: "deliveryChargeData"
                }
            },
            {
                $lookup: {
                    from: "product",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productData",
                },
            },
            {
                $addFields:{
                    "totalPrice": {$multiply:[{$arrayElemAt:["$productData.productPrice" , 0] },"$quantity"]},
                }
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
                $addFields:{
                    deliveryCharge: { $arrayElemAt: [ "$deliveryChargeData.deliveryCharge", 0] },
                }
            },
            {
                $group:{
                        _id: "$userId",
                        subTotal:{ $sum : "$totalPrice" },
                        discount:{ $sum :"$discount" },
                        promoDiscount:{ $sum :"$promoDiscount" },
                        deliveryCharge:{$sum :"$deliveryCharge"},
                       },
            },
            {
                $addFields: {
                    "promoDiscount": {$divide: [{$multiply: ["$subTotal", data.promoDiscount]}, 100]}
                }
            },
            {
                $addFields: {
                    // finalAmount: {$round:[{$subtract:[{$subtract: ["$subTotal", "$discount"]},"$promoDiscount"]},"$deliveryCharge",2]}
                    finalAmount: {$round:[{$sum:[{$subtract:[{$subtract: ["$subTotal", "$discount"]},"$promoDiscount"]},"$deliveryCharge"]},2]}
                }
            },

            // {
            //     $addFields: {
            //         finalAmount: {
            //                 "$cond": {
            //                     if: {
            //                         "$eq": ["$userType", "prime"]
            //                     },
            //                     then: "$finalAmount",
            //                     else: {$sum: ["$finalAmount", "$deliveryCharge"]},
            //                 },
            //             },
            //         },
            //     },
            )

        const result = await Cart.aggregate(pipeline);
        // console.log(result)
        return result;

    } catch (e) {
        console.log(e);
        return false;
    }
}