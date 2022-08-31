const Cart = require('../../model/cart');
let ObjectId = require("mongodb").ObjectId


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
                $project: {
                    userId: 1,
                    quantity: 1,
                    categoryId:{ $arrayElemAt: [ "$productData.categoryId", 0] },
                    categoryName:{ $arrayElemAt: [ "$categoryData.categoryName", 0] },
                    subCategoryId:{ $arrayElemAt: [ "$productData.subCategoryId", 0] },
                    subCategoryName:{ $arrayElemAt: [ "$subCategoryData.subCategoryName", 0] },
                    productId:1,
                    productName:{ $arrayElemAt: [ "$productData.productName", 0] },
                    productDescription:{ $arrayElemAt: [ "$productData.productDescription", 0] },
                    productImage:{ $arrayElemAt: [ "$productData.productImage", 0] },
                    productPrice:{ $arrayElemAt: [ "$productData.productPrice", 0] },
                    productDiscount:{$divide:[({$multiply:[{$arrayElemAt:["$productData.productDiscount" , 0] },{$arrayElemAt:["$productData.productPrice",0]}]}),100]},
                    discountedPrice:{$subtract:[{$arrayElemAt:["$productData.productPrice" , 0] },{$divide:[({$multiply:[{$arrayElemAt:["$productData.productPrice" , 0] },{$arrayElemAt:["$productData.productDiscount",0]}]}),100]}]},
                    totalPrice:{$multiply:[{$arrayElemAt:["$productData.productPrice" , 0] },"$quantity"]},
                    totalDiscount:{ $multiply:[{$divide:[({$multiply:[{$arrayElemAt:["$productData.productDiscount" , 0] },{$arrayElemAt:["$productData.productPrice",0]}]}),100]},"$quantity"]},
                    finalPrice:{$subtract:[{$multiply:[{$arrayElemAt:["$productData.productPrice" , 0] },"$quantity"]},{ $multiply:[{$divide:[({$multiply:[{$arrayElemAt:["$productData.productDiscount" , 0] },{$arrayElemAt:["$productData.productPrice",0]}]}),100]},"$quantity"]}]},
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