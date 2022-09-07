const product = require('../../model/product');
const {facetHelper} = require("../../helper/helper");
const {searching} = require("../../helper/helper");
let ObjectId = require("mongodb").ObjectId

exports.productlistService= async (data) => {
    try{
        let pipeline = [];
        let search = data.search ? data.search : "";
        pipeline.push(

            {
                $match: {
                    status: {$ne: 3}
                }
            },

            { $match:
                    { $or:[
                            {productName: { $regex: new RegExp(search,'i') } },
                            {productDescription: { $regex: new RegExp(search,'i') } }
                        ]
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
                    from: "productPriceList",
                    localField: "_id",
                    foreignField: "productId",
                    as: "productPriceListData"
                }
            },

            {
                $project: {
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
                    regularDiscount:1,
                    primeDiscount:1,
                    totalDiscount: {$sum:["$regularDiscount", "$primeDiscount"]},
                    regularDiscountedPrice:["productPriceListData.regularDiscountedPrice"],
                    primeDiscountedPrice:["productPriceListData.primeDiscountedPrice"],
                    productDescription:1,
                    productDescriptionGuj:1,
                    productImage:1,
                    status:1,
                    colorName:["productPriceListData.colorName"],
                    stoke:["productPriceListData.stoke"],
                    price:["productPriceListData.price"],
                }
            },
        );

        if(data.status){
            pipeline.push(
                {
                    $match: {
                        status: data.status
                    }
                }
            )
        };

        let obj = {};
        let sortBy = data.sortBy ? data.sortBy : 1;
        let sortKey = data.sortKey ? data.sortKey : "productName";
        obj[sortKey] = sortBy;

        if(data.search){
            let arr = ["categoryName","categoryDescription","subCategoryName","subCategoryDescription","productName","productDescription"]
            pipeline.push(searching(data.search,arr));
        }

        pipeline.push(
            {$sort: obj},
            facetHelper(Number(data.skip), Number(data.limit))
        );

        const result = await product.aggregate(pipeline);

        return result;
    }catch (e) {
        console.log(e);
        return false;
    }
}