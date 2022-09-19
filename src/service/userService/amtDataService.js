const Cart = require('../../model/cart');
let ObjectId = require("mongodb").ObjectId

exports.amtDataService = async (data) => {
    try{
        let pipeline = [];

        pipeline.push(
            {
                $match: {
                    userId: ObjectId(data.userId),
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
                $lookup: {
                    from: "productPriceList",
                    localField: "productId",
                    foreignField: "productId",
                    as: "colorPrice"
                }
            },
            {
                $project:{
                    price:{$arrayElemAt: ["$colorPrice.price", 0]},
                    regularDiscountedPrice:{$arrayElemAt: ["$colorPrice.regularDiscountedPrice", 0]},
                    primeDiscountedPrice:{$arrayElemAt: ["$colorPrice.primeDiscountedPrice", 0]},
                    quantity:1,
                }
            },

            {
                $addFields:{
                    deliveryCharge: data.deliveryCharge,
                }
            },
            {
                $addFields: {
                    totalPrice: {
                        $cond: {
                            if: {
                                $eq: [data.userType, "prime"]
                            },
                            then: {$multiply:["$primeDiscountedPrice","$quantity"]},
                            else:  {$multiply:["$regularDiscountedPrice","$quantity"]},
                        },
                    },
                },
            },

            // {
            //     $unwind: '$productData'
            // },

            {
                $addFields: {
                    discount: {
                        $cond: {
                            if: {
                                $eq: [data.userType, "prime"]
                            },
                            then: {$multiply:[{$subtract: ["$price", "$primeDiscountedPrice"]},"$quantity"]},
                            else: {$multiply:[{$subtract: ["$price", "$regularDiscountedPrice"]},"$quantity"]},
                            // then: {$divide: [{$multiply: [{$multiply: ["$colorPrice.price", "$productData.totalPrimeDiscount"]}, "$quantity"]}, 100]},
                            // else: {$divide: [{$multiply: [{$multiply: ["$colorPrice.price", "$productData.regularDiscount"]}, "$quantity"]}, 100]},
                        },
                    },
                },
            },

            {
                $group:{
                    _id: "$userId",
                    subTotal:{ $sum : "$totalPrice" },
                    discount: {$sum: "$discount"},
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
        );


        const result = await Cart.aggregate(pipeline);
        return result;

    } catch (e) {
        console.log(e);
        return false;
    }
}