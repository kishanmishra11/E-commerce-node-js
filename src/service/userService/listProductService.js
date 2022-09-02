const product = require('../../model/product');
let ObjectId = require("mongodb").ObjectId

exports.productlistService= async (data) => {
    try{
        let pipeline = [];
        pipeline.push(

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
                    from: "category",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData"
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
                $project: {
                    cartQuantity: { $arrayElemAt: [ "$cartData.quantity", 0] },
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
                    productPrice:1,
                    regularDiscount:1,
                    primeDiscount:1,
                    regularDiscountedPrice:{ $subtract: ["$productPrice",{$divide:[({$multiply:["$productPrice", "$regularDiscount"]}), 100]}] },
                    primeDiscountedPrice:{ $subtract: ["$productPrice",{$divide:[({$multiply:["$productPrice", "$primeDiscount"]}), 100]}] },
                    productDescription:1,
                    productDescriptionGuj:1,
                    productImage:1,
                    status:1
                }
            },

        );

        if(data.userType === "prime"){
            pipeline.push(
                {
                    $addFields:{
                        productDiscount:{ $sum:["$regularDiscount", "$primeDiscount"] },
                        discountedPrice:{ $subtract: ["$productPrice",{$divide:[({$multiply:["$productPrice", { $sum:["$regularDiscount", "$primeDiscount"] }]}), 100]}] },
                    }
                }
            )
        }else{
            pipeline.push(
                {
                    $addFields:{
                        productDiscount: "$regularDiscount",
                        discountedPrice:{ $subtract: ["$productPrice",{$divide:[({$multiply:["$productPrice", "$regularDiscount"]}), 100]}] },
                    }
                }
            )

        }

        const result = await product.aggregate(pipeline);
        // console.log(result);
        return result;
    }catch (e) {
        console.log(e);
        return false;
    }
}