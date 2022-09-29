const productModel = require('../../model/product');
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
                    productImage:1,
                    ratingCount:{$size: '$ratingData'},
                    rating:{$avg: "$ratingData.star"},
                    ratingData:"$ratingData",
                    // title:["$ratingData.title"],
                    // comment:["$ratingData.comment"],
                    // star:["$ratingData.star"],
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