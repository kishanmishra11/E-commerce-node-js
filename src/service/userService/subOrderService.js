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
                $project: {
                    subOrderId:1,
                    orderId: 1,
                    quantity: 1,
                    productId:1,
                    productName:{ $arrayElemAt: [ "$productData.productName", 0] },
                    productImage:{ $arrayElemAt: [ "$productData.productImage", 0] },
                    productPrice:{ $arrayElemAt: [ "$productData.productPrice", 0] },
                    discountedPrice:{$subtract:[{$arrayElemAt:["$productData.productPrice" , 0] },{$divide:[({$multiply:[{$arrayElemAt:["$productData.productPrice" , 0] },{$arrayElemAt:["$productData.productDiscount",0]}]}),100]}]},
                    totalPrice:{$multiply:[{$arrayElemAt:["$productData.productPrice" , 0] },"$quantity"]},
                    totalDiscountedPrice:{$multiply:[{$subtract:[{$arrayElemAt:["$productData.productPrice" , 0] },{$divide:[({$multiply:[{$arrayElemAt:["$productData.productPrice" , 0] },{$arrayElemAt:["$productData.productDiscount",0]}]}),100]}]},"$quantity"]},
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