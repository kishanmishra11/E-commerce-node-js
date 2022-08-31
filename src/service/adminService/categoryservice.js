const category = require('../../model/category');
const {facetHelper} = require("../../helper/helper");
const {searching} = require("../../helper/helper");
let ObjectId = require("mongodb").ObjectId

exports.categoryService= async (data) => {

    try {
        let pipeline = [];
        pipeline.push(

            {
                $lookup: {
                    from: "subCategory",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "categoryDataList"
                }
            },
            {
                $lookup: {
                    from: "product",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "productList"
                }
            },
            {
                $project: {
                    subCategoryCount: {$size: "$categoryDataList"},
                    productCount: {$size: "$productList"},
                    categoryId: "$categoryId",
                    categoryName: "$categoryName",
                    categoryNameGuj: "$categoryNameGuj",
                    categoryDescription: "$categoryDescription",
                    categoryDescriptionGuj: "$categoryDescriptionGuj",
                    categoryImage:1,
                    status:1
                }
            },
        );
        let obj = {};
        let sortBy = data.sortBy ? data.sortBy : 1;
        let sortKey = data.sortKey ? data.sortKey : "categoryName";
        obj[sortKey] = sortBy;

        if(data.search){
            let arr = ["categoryId","categoryName","categoryDescription"]
            pipeline.push(searching(data.search,arr));
        }

        pipeline.push(
            {$sort: obj},
            facetHelper(Number(data.skip), Number(data.limit))
            );


        const result = await category.aggregate(pipeline);
        return result;
    } catch (e) {
        console.log(e);
        return false;
    }
}