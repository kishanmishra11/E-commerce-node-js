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
                $lookup: {
                    from: "offer",
                    localField: "productId",
                    foreignField: "productId",
                    as: "offerData"
                }
            },
            {
                $lookup: {
                    from: "offer",
                    let: {"productId": "$productId", "categoryId": "$productData.categoryId", "colorPrice": "$colorPrice", "quantity": "$quantity", "offerType": "$offerType"},
                    pipeline: [
                        {
                            $match:
                                {
                                    $expr:
                                        {
                                            $or:
                                                [
                                                    {$eq: ["$productId", "$$productId"]},
                                                    {$eq: ["$categoryId", "$$categoryId"]},
                                                ]
                                        }
                                }
                        },
                        {
                            $addFields: {
                                offerPrice: {
                                    $cond: [
                                        {
                                            $eq: ["$offerType", "flatDiscount"]
                                        },
                                        {
                                            $subtract: [{$arrayElemAt: ["$$colorPrice.price", 0]}, "$amount"]
                                        },

                                        {
                                            $arrayElemAt: ["$$colorPrice.price", 0]
                                        },
                                    ]
                                },
                                quantity: {
                                    $cond: [
                                        {
                                            $eq: ["$offerType", "buyOneGetOne"]
                                        },
                                        {
                                            $multiply: ["$$quantity", 2]
                                        },
                                        "$$quantity"
                                    ]
                                }

                            },
                        },
                        {
                            $sort: {"offerType": -1}
                        }
                    ],
                    as: "offerData"
                }
            },
        )
        pipeline.push({
            $addFields:{
                offerPrice:{
                    $switch: {
                        branches: [
                            {
                                case: {$gt: [{$size: "$offerData"}, 1]},
                                then: {$arrayElemAt: ["$offerData.offerPrice", 0]}
                            },
                            {
                                case: {$gt: [{$size: "$offerData"}, 1]},
                                then: {$arrayElemAt: ["$offerData.offerPrice", 0]}
                            },
                        ],
                        default: {$arrayElemAt: ["$productPriceData.price", 0]}
                    }}
            }
        }
        )

        pipeline.push(
            {
                $project:{
                    price:{$arrayElemAt: ["$colorPrice.price", 0]},
                    regularDiscountedPrice:{$arrayElemAt: ["$colorPrice.regularDiscountedPrice", 0]},
                    primeDiscountedPrice:{$arrayElemAt: ["$colorPrice.primeDiscountedPrice", 0]},
                    quantity: {
                        $switch: {
                            branches: [
                                {
                                    case: {$gt: [{$size: "$offerData"}, 1]},
                                    then: {$divide:[{$arrayElemAt: ["$offerData.quantity", 1]},2]},
                                },
                                {
                                    case: {$gt: [{$size: "$offerData"}, 1]},
                                    then: {$arrayElemAt: ["$offerData.quantity", 0]}
                                },
                            ],
                            default: "$quantity"
                        }
                    },
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
                        // $cond:{
                        //     if:{
                        //         $eq:[data.offerType, "buyOneGetOne"],
                        //         $eq:[data.quantity, 2]
                        //     },
                        //     then:{$divide: ["$primeDiscountedPrice", 2]},
                        //     else:
                        // }
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
                    promoDiscount: {$divide: [{$multiply: ["$subTotal", data.promoDiscount]}, 100]},

                }
            },
            {
                $addFields: {
                    // finalAmount: {$round:[{$subtract:[{$sum:[{$subtract:[{$subtract: ["$subTotal", "$discount"]},"$promoDiscount"]},"$deliveryCharge"]},"$offerDiscount"]},2]}
                    finalAmount: {$round:[{$sum:[{$subtract:[{$subtract: ["$subTotal", "$discount"]},"$promoDiscount"]},"$deliveryCharge"]},2]}
                }
            },
        );

        const result = await Cart.aggregate(pipeline);
        console.log("amountDataService",result)
        return result;

    } catch (e) {
        console.log(e);
        return false;
    }
}