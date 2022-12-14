const product = require('../../model/product');
let ObjectId = require("mongodb").ObjectId
const {searching} = require("../../helper/helper");
const{
    META_STATUS_0,
    META_STATUS_1,
    SUCCESSFUL,
    VALIDATION_ERROR,
    INTERNAL_SERVER_ERROR,
    ACTIVE,
    INACTIVE,
    DELETED,
} = require('../../../config/key');

exports.productlistService= async (data) => {
    try{
        let pipeline = [];
        let search = data.search ? data.search : "";

        if (data.categoryId) {
            pipeline.push({
                $match: {
                    categoryId: ObjectId(data.categoryId),
                },
            },
                { $match:
                        { $or:[
                                {categoryName: { $regex: new RegExp(search,'i') } },
                                {subCategoryName: { $regex: new RegExp(search,'i') } },
                                {productName: { $regex: new RegExp(search,'i') } },
                            ]
                        }
                })
        };

        if(data.subCategoryId) {
            if (data.subCategoryId.length > 0) {
                let values = data.subCategoryId
                let ids = []
                for (let i = 0; i < values.length; i++) {
                    let newValue = ObjectId(values[i])
                    ids.push(newValue)
                }
                pipeline.push({
                    $match: {
                        subCategoryId: {$in: ids},
                    }
                })
            }
        }

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
            {
                $lookup:{
                    from: "offer",
                    let: {"productId": "$_id","categoryId":"$categoryId"},
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
                                                    {$and:[{$eq:["$status", ACTIVE]},{$eq:["$offerType", "flatDiscount"]}]}
                                                ]
                                        }
                                }
                        },
                    ],
                    as: "offerData"
                }
            }
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
                },
            },
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
                    isSmallest:1,
                    discountedPrice:1,
                    viewCount:1,
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
                    },
                    offerData:"$offerData"
                }
            },
        );

        if(data.search){
            let arr = ["categoryName","subCategoryName","productName"]
            pipeline.push(searching(data.search,arr));
        }

        const result = await product.aggregate(pipeline);
        return result;
    }catch (e) {
        console.log(e);
        return false;
    }
}