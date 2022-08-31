const product = require('../../model/product');
let ObjectId = require("mongodb").ObjectId

exports.productListService= async (data) => {
    try{
        let pipeline = [];
        pipeline.push(

            {
                $match: {
                    status: {$ne: 3},
                    _id: ObjectId(data.productId)
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
                    from: "category",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData"
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
                    productPrice:1,
                    productDiscount:1,
                    discountedPrice: { $subtract: ["$productPrice",{$divide:[({$multiply:["$productPrice", "$productDiscount"]}), 100]}] },
                    productDescription:1,
                    productDescriptionGuj:1,
                    productImage:1,
                    status:1
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