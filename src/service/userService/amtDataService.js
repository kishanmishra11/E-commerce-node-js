const Cart = require('../../model/cart');
let ObjectId = require("mongodb").ObjectId

exports.amtDataService = async (data) => {
    try{
        let pipeline = [];

        pipeline.push(
            {
                $match: {
                    userId: ObjectId(data.userId),
                    productId: ObjectId(data.productId)
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
                    deliveryCharge: data.deliveryCharge,
                    regularDiscount:data.regularDiscount,
                    primeDiscount:{$sum:[data.primeDiscount,data.regularDiscount ]},
                }
            },

            {
                $addFields: {
                    discount: {
                        "$cond": {
                            if: {
                                $eq: [data.userType, "prime"]
                            },
                            then: {$divide: [{$multiply:[ {$multiply: [{ $arrayElemAt: [ "$productData.productPrice", 0] }, "$primeDiscount"]}, "$quantity"]}, 100]},
                            else: {$divide: [{$multiply:[ {$multiply: [{ $arrayElemAt: [ "$productData.productPrice", 0] }, "$regularDiscount"]}, "$quantity"]}, 100]},
                        },
                    },
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
                    finalAmount: {$round:[{$sum:[{$subtract:[{$subtract: ["$subTotal", "$discount"]},"$promoDiscount"]},"$deliveryCharge"]},2]}

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