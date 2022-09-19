const subOrder = require('../../model/subOrder');
let ObjectId = require("mongodb").ObjectId

exports.subOrderService = async (data) => {
    try{
        let pipeline = [];

        pipeline.push(
            {
                $match: {
                    orderId: ObjectId(data.orderId)
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
                    from: "productPriceList",
                    localField: "productId",
                    foreignField: "productId",
                    as: "colorPrice"
                }
            }
        );

        if(data.userType === "prime"){
            pipeline.push(
                {
                    $addFields:{
                        discountedPrice: {$multiply:[{$arrayElemAt:["$colorPrice.primeDiscountedPrice", 0] },"$quantity"]},
                        totalPrice:{$multiply:[{$arrayElemAt:["$colorPrice.price", 0] },"$quantity"]},
                    }
                }
            )
        }else{
            pipeline.push(
                {
                    $addFields:{
                        discountedPrice: {$multiply:[{$arrayElemAt:["$colorPrice.regularDiscountedPrice", 0] },"$quantity"]},
                        totalPrice:{$multiply:[{$arrayElemAt:["$colorPrice.price", 0] },"$quantity"]},
                    }
                }
            )

        }


        pipeline.push(

            {
                $project: {
                    subOrderId:1,
                    orderId: 1,
                    quantity: 1,
                    productId:1,
                    productName:{ $arrayElemAt: [ "$productData.productName", 0] },
                    productImage:{ $arrayElemAt: [ "$productData.productImage", 0] },
                    productPrice:{ $arrayElemAt: [ "$colorPrice.price", 0] },
                    discountedPrice:1,
                    totalPrice:1,
                    status:1,
                },
            },
        )

        const result = await subOrder.aggregate(pipeline);
        return result;

    } catch (e) {
        console.log(e);
        return false;
    }
}