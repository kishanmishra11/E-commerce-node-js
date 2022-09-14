const product = require('../../model/product');
let ObjectId = require("mongodb").ObjectId

exports.productListService= async (data) => {
    try{
        let pipeline = [];
        pipeline.push(

            {
                $match: {
                    status: {$ne: 3},
                    _id: ObjectId(data.productId),
                }
            },
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
                    from: "cart",
                    localField: "cartId",
                    foreignField: "_id",
                    as: "cartData"
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

        );

        if(data.userType === "prime"){
                pipeline.push(
                    {
                        $addFields:{
                            productDiscount:{ $sum:["$regularDiscount", "$primeDiscount"] },
                        }
                    }
                )
            }else{
            pipeline.push(
                {
                    $addFields:{
                        productDiscount:"$regularDiscount"
                    }
                }
            )
        }

        pipeline.push({
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
                    priceList: {
                        $map: {
                            input: "$colorPrice",
                            as: "colour",
                            in: {
                                $cond: [
                                    {
                                        $eq: ["$$colour.price", {$min: "$colorPrice.price"}]
                                    },
                                    {
                                        $mergeObjects: [
                                            "$$colour",
                                            {
                                                "isSmallest": true
                                            }
                                        ]
                                    },
                                    {
                                        $mergeObjects: [
                                            "$$colour",
                                            {
                                                "isSmallest": false
                                            }
                                        ]
                                    },
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
            },

        );

        pipeline.push(
            {
                $project: {
                    cartQuantity:{ $arrayElemAt: [ "$cartData.cartQuantity", 0] },
                    categoryName:{ $arrayElemAt: [ "$categoryData.categoryName", 0] },
                    categoryNameGuj:{ $arrayElemAt: [ "$categoryData.categoryNameGuj", 0] },
                    categoryDescription:{ $arrayElemAt: [ "$categoryData.categoryDescription", 0] },
                    categoryDescriptionGuj:{ $arrayElemAt: [ "$categoryData.categoryDescriptionGuj", 0] },
                    categoryId: 1,
                    subCategoryId:1,
                    subCategoryName:{ $arrayElemAt: [ "$subCategoryData.subCategoryName", 0] },
                    subCategoryNameGuj:{ $arrayElemAt: [ "$subCategoryData.subCategoryNameGuj", 0] },
                    subCategoryDescription:{ $arrayElemAt: [ "$subCategoryData.subCategoryDescription", 0] },
                    subCategoryDescriptionGuj:{ $arrayElemAt: [ "$subCategoryData.subCategoryDescriptionGuj", 0] },
                    productId:1,
                    productName:1,
                    productNameGuj:1,
                    productDiscount:1,
                    productDescription:1,
                    productDescriptionGuj:1,
                    productImage:1,
                    status:1,
                    inStock:1,
                    discountedPrice:1,
                    priceList:1,
                    isSmallest:1,
                    colorPrice: {
                        $map: {
                            input: "$colorPrice",
                            as: "one",
                            in: {
                                $mergeObjects: [
                                    "$$one",
                                    {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$priceList",
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
                    }
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