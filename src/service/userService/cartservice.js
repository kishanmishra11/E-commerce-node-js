const Cart = require('../../model/cart');
let ObjectId = require("mongodb").ObjectId
const{
    META_STATUS_0,
    META_STATUS_1,
    SUCCESSFUL,
    VALIDATION_ERROR,
    INTERNAL_SERVER_ERROR,
    ACTIVE,
    INACTIVE,
    DELETED
} = require('../../../config/key');

exports.cartlistService= async (data) => {
    try{
        let pipeline = [];
        pipeline.push(
            {
                $match: {
                    userId: ObjectId(data.userId)
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
                    from: "category",
                    localField: "productData.categoryId",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "subCategory",
                    localField: "productData.subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryData",
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
                $lookup:{
                    from: "offer",
                    let: {"productId": "$productId","categoryId": "$productData.categoryId","colorPrice":"$colorPrice", "quantity":"$quantity","offerType": "$offerType"},
                    pipeline: [
                        {
                            $match:
                                {
                                    $expr:
                                        {
                                            $or:
                                                [
                                                    {$eq: ["$productId", "$$productId"]},
                                                    {$eq: ["$categoryId","$$categoryId"]},
                                                ]
                                        }
                                }
                        },
                        {
                            $addFields:{
                                offerPrice:{
                                      $cond:[
                                         {
                                            $eq:["$offerType", "flatDiscount"]
                                         },
                                          {$subtract:[{$arrayElemAt:["$$colorPrice.price", 0]},"$amount"]},
                                          {$arrayElemAt:["$$colorPrice.price", 0]}
                                    ],
                                }
                            }
                        },
                        {
                            $addFields:{
                                quantity:{
                                    $cond:[
                                        {
                                            $eq:["$offerType", "buyOneGetOne"],
                                        },
                                        {$multiply:["$$quantity", 2]},
                                        "$$quantity"
                                    ],
                                }
                            }
                        },
                        {
                            $sort: {"offerType": -1}
                        }
                    ],
                    as: "offerData"
                }
            },

            );
        if(data.userType === "prime"){
            pipeline.push(
                {
                    $addFields:{
                        productDiscount:{$divide:[({$multiply:[ {$arrayElemAt:["$productData.totalPrimeDiscount" , 0] },{$arrayElemAt:["$colorPrice.price",0]}]}),100]},
                        discountedPrice:{$multiply:[{$arrayElemAt:["$colorPrice.primeDiscountedPrice", 0] },"$quantity"]},
                        totalDiscount: {$multiply:[{$divide:[({$multiply:[ {$arrayElemAt:["$productData.totalPrimeDiscount" , 0] },{$arrayElemAt:["$colorPrice.price",0]}]}),100]},"$quantity"]},
                        finalPrice:{$subtract:[{$multiply:[{$arrayElemAt:["$colorPrice.primeDiscountedPrice" , 0] },"$quantity"]},{ $multiply:[{$divide:[({$multiply:[{$arrayElemAt:["$productData.totalPrimeDiscount" , 0] },{$arrayElemAt:["$colorPrice.primeDiscountedPrice",0]}]}),100]},"$quantity"]}]},
                    }
                }
            )
        }else{
            pipeline.push(
                {
                    $addFields:{
                        productDiscount:{$divide:[({$multiply:[{$arrayElemAt:["$productData.regularDiscount" , 0] },{$arrayElemAt:["$colorPrice.price",0]}]}),100]},
                        discountedPrice:{$multiply:[{$arrayElemAt:["$colorPrice.regularDiscountedPrice", 0] },"$quantity"]},
                        totalDiscount: {$multiply:[{$divide:[({$multiply:[{$arrayElemAt:["$productData.regularDiscount" , 0] },{$arrayElemAt:["$colorPrice.price",0]}]}),100]},"$quantity"]},
                        finalPrice:{$subtract:[{$multiply:[{$arrayElemAt:["$colorPrice.regularDiscountedPrice" , 0] },"$quantity"]},{ $multiply:[{$divide:[({$multiply:[{$arrayElemAt:["$productData.regularDiscount" , 0] },{$arrayElemAt:["$colorPrice.regularDiscountedPrice",0]}]}),100]},"$quantity"]}]},

                    }
                }
            )

        }

        pipeline.push(
            {
                $project: {
                    productDiscount: 1,
                    userId: 1,
                    quantity: {
                        $switch: {
                            branches: [
                                {
                                    case: {$gt: [{$size: "$offerData"}, 1]},
                                    then: {$arrayElemAt: ["$offerData.quantity", 1]},
                                },
                                {
                                    case: {$gt: [{$size: "$offerData"}, 1]},
                                    then: {$arrayElemAt: ["$offerData.quantity", 0]}
                                },
                            ],
                            default: "$quantity"
                        }
                    },
                    regularDiscount: {$arrayElemAt: ["$productData.regularDiscount", 0]},
                    primeDiscount: {$arrayElemAt: ["$productData.primeDiscount", 0]},
                    totalPrimeDiscount: {$sum: [{$arrayElemAt: ["$productData.regularDiscount", 0]}, {$arrayElemAt: ["$productData.primeDiscount", 0]}]},
                    discountedPrice: 1,
                    totalDiscount: 1,
                    categoryId: {$arrayElemAt: ["$productData.categoryId", 0]},
                    categoryName: {$arrayElemAt: ["$categoryData.categoryName", 0]},
                    subCategoryId: {$arrayElemAt: ["$productData.subCategoryId", 0]},
                    subCategoryName: {$arrayElemAt: ["$subCategoryData.subCategoryName", 0]},
                    productId: 1,
                    finalPrice: 1,
                    offer:"$offerData",
                    productName: {$arrayElemAt: ["$productData.productName", 0]},
                    productDescription: {$arrayElemAt: ["$productData.productDescription", 0]},
                    productImage: {$arrayElemAt: ["$productData.productImage", 0]},
                    productPrice: {
                        $switch: {
                            branches: [
                         {
                        case: {$gt: [{$size: "$offerData"}, 1]},
                        then: {$arrayElemAt: ["$offerData.offerPrice", 0]}
                         },
                    {
                        case: {$gt: [{$size: "$offerData"}, 1]},
                        then: {$arrayElemAt: ["$offerData.offerPrice", 0]}
                    }
                            ],
                    default:  {$arrayElemAt: ["$colorPrice.price", 0]}
               }
        },
                    totalPrice: {$multiply: [{$arrayElemAt: ["$colorPrice.price", 0]}, "$quantity"]},
                    productPriceListId:1,
                    offerPrice: {$arrayElemAt:["$offerData.offerPrice", 1]},
                    offerQuantity: {
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
                    },
                },
        );


        let obj = {};
        let sortBy = data.sortBy ? data.sortBy : -1;
        let sortKey = data.sortKey ? data.sortKey : "createdAt";
        obj[sortKey] = sortBy;

        pipeline.push(
            {$sort: obj},
        );


        const result = await Cart.aggregate(pipeline);
        return result;
    }catch (e) {
        console.log(e);
        return false;
    }
}