const subCategory = require('../../model/subcategory');
const {facetHelper} = require("../../helper/helper");
const {searching} = require("../../helper/helper");
let ObjectId = require("mongodb").ObjectId

exports.sublistService= async (data) => {
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
                    from: "product",
                    localField: "_id",
                    foreignField: "subCategoryId",
                    as: "productDataList"
                }
            },
            {
                $project: {
                    productCount: { $size: "$productDataList" },
                    categoryId: "$categoryId",
                    categoryName:{ $arrayElemAt: [ "$categoryData.categoryName", 0] },
                    categoryNameGuj:{ $arrayElemAt: [ "$categoryData.categoryNameGuj", 0] },
                    subCategoryId:"$subCategoryId",
                    subCategoryName:"$subCategoryName",
                    subCategoryNameGuj:"$subCategoryNameGuj",
                    subCategoryDescription:"$subCategoryDescription",
                    subCategoryDescriptionGuj:"$subCategoryDescriptionGuj",
                    subCategoryImage:1,
                    status:1
                }
            },
    );
        let obj = {};
        let sortBy = data.sortBy ? data.sortBy : 1;
        let sortKey = data.sortKey ? data.sortKey : "subCategoryName";
        obj[sortKey] = sortBy;

        if(data.search){
            let arr = ["categoryName","categoryDescription","subCategoryName","subCategoryDescription"]
            pipeline.push(searching(data.search,arr));
        }
        pipeline.push(
            {$sort: obj},
            facetHelper(Number(data.skip), Number(data.limit))
        );



        const result = await subCategory.aggregate(pipeline);
        return result;
    }catch (e) {
        console.log(e);
        return false;
    }
}