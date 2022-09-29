const productModel = require('../../model/product');
const ratingModel = require('../../model/rating')
let ObjectId = require("mongodb").ObjectId

exports.productRating = async (data) => {
    try {
        let pipeline = [];
        pipeline.push(
            {
                $match: {
                    _id: ObjectId(data.productId),
                    status: 1
                }
            },
            {
                $lookup: {
                    from: "rating",
                    let: { productId: "$_id"},
                    pipeline: [
                        { $match:
                                { $expr:
                                        { $and:
                                                [
                                                    { $eq: [ "$productId",  "$$productId" ] },
                                                    { $eq: [ "$status", 1 ] }
                                                ]
                                        }
                                }
                        }
                    ],
                    as: "ratingData"
                }
            },
            {
                $project:{
                    productId:1,
                    productName:1,
                    ratingCount:{$size: '$ratingData'},
                    rating:{$avg: "$ratingData.star"}
                }
            }
        );

        const result = await productModel.aggregate(pipeline);
        return result;
    }catch (e) {
        console.log(e);
        return false;
    }
}


exports.ratingAdminService = async (data) => {
    try{
        let pipeline = [];
        pipeline.push(
            {
                $match: {
                    status:1,
                }
            },
            {
                $group:{
                    _id: "$productId",
                    ratingCount:{
                        $sum: 1
                    },
                    rating: {
                        $avg: "$star"
                    }
                }
            },
            {
                $lookup: {
                    from: "product",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productData"
                }
            },

            );

        const result = await ratingModel.aggregate(pipeline);
        return result;
    }catch (e) {
        console.log(e);
        return false;
    }
}
