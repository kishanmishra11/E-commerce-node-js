const product = require('../../model/product');
let ObjectId = require("mongodb").ObjectId

exports.productlistService= async (data) => {
    try{
        let pipeline = [];
        pipeline.push(

            {
                $lookup: {
                    from: "category",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData"
                }
            },
            {
                $lookup: {
                    from: "subCategory",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryData"
                }
            },
            {
                $lookup: {
                    from: "productPriceList",
                    localField: "_id",
                    foreignField: "productId",
                    as: "colorPrice"
                }
            },
            {
                $lookup: {
                    from: "cart",
                    let: {"productId": "$_id"},
                    pipeline: [
                        {
                            $match:
                                {
                                    $expr:
                                        {
                                            $and:
                                                [
                                                    {$eq: ["$productId", "$$productId"]},
                                                    {$eq: ["$userId", ObjectId(data.userId)]},
                                                    {$eq: ["$status", 1]}
                                                ]
                                        }
                                }
                        }
                    ],
                    as: "cartData"
                }
            },
        );


        pipeline.push({
            $addFields:{
                productDiscount:{
                    $cond:{
                        if:{
                            $eq:[data.userType, "prime"]
                        },
                        then: {$sum:["$regularDiscount", "$primeDiscount"]},
                        else:"$regularDiscount",
                    }
                }
            }
        });


        pipeline.push(
            {
                $addFields: {
                    stock: {
                        $map: {
                            input: "$colorPrice",
                            as: "color",
                            in: {
                                $cond: [
                                    {
                                        $gt: [
                                            "$$color.stock",
                                            0
                                        ]
                                    },
                                    {
                                        $mergeObjects: [
                                            "$$color",
                                            {
                                                "inStock": true
                                            }
                                        ]
                                    },

                                    {
                                        $mergeObjects: [
                                            "$$color",
                                            {
                                                "inStock": false
                                            }
                                        ]
                                    },
                                ]
                            }
                        }
                    }
                },
            },
            {
                $addFields: {
                    discountedPrice : {
                        $map: {
                            input: "$colorPrice",
                            as: "color",
                            in: {
                                $cond: [
                                    {
                                        $eq: [
                                            data.userType, "prime",
                                        ]
                                    },
                                    {
                                        $mergeObjects: [
                                            "$$color",
                                            {
                                                "discountedPrice": "$$color.primeDiscountedPrice"
                                            }
                                        ]
                                    },
                                    {
                                        $mergeObjects: [
                                            "$$color",
                                            {
                                                "discountedPrice": "$$color.regularDiscountedPrice"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    colorPrice:{
                        $map: {
                            input: "$stock",
                            as: "one",
                            in: {
                                $mergeObjects: [
                                    "$$one",
                                    {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$discountedPrice",
                                                    as: "two",
                                                    cond: {
                                                        $eq: [
                                                            "$$two._id",
                                                            "$$one._id"
                                                        ]
                                                    }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                }
            }
        );


        pipeline.push(
            {
                $project: {
                    cartQuantity: {$arrayElemAt: ["$cartData.quantity", 0]},
                    categoryName: {$arrayElemAt: ["$categoryData.categoryName", 0]},
                    categoryNameGuj: {$arrayElemAt: ["$categoryData.categoryNameGuj", 0]},
                    categoryDescription: {$arrayElemAt: ["$categoryData.categoryDescription", 0]},
                    categoryDescriptionGuj: {$arrayElemAt: ["$categoryData.categoryDescriptionGuj", 0]},
                    categoryId: 1,
                    subCategoryId: 1,
                    subCategoryName: {$arrayElemAt: ["$subCategoryData.subCategoryName", 0]},
                    subCategoryNameGuj: {$arrayElemAt: ["$subCategoryData.subCategoryNameGuj", 0]},
                    subCategoryDescription: {$arrayElemAt: ["$subCategoryData.subCategoryDescription", 0]},
                    subCategoryDescriptionGuj: {$arrayElemAt: ["$subCategoryData.subCategoryDescriptionGuj", 0]},
                    productId: 1,
                    productName: 1,
                    productNameGuj: 1,
                    regularDiscount: 1,
                    primeDiscount: 1,
                    productDiscount: 1,
                    productDescription: 1,
                    productDescriptionGuj: 1,
                    productImage: 1,
                    status: 1,
                    inStock:1,
                    discountedPrice:1,
                    colorPrice: 1,

                }
            },
        );




        const result = await product.aggregate(pipeline);
        return result;
    }catch (e) {
        console.log(e);
        return false;
    }
}