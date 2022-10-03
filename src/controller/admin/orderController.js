const jwt = require('jsonwebtoken');
const order = require("../../model/order");
const trackOrder = require("../../model/trackOrder");
const userInfo = require('../../model/users');
const subOrder = require('../../model/subOrder');
const ejs = require('ejs');
const path = require('path');
const orderTransformerAdmin = require("../../transformer/adminTransformer/orderTransformer");
const trackOrderTransformerAdmin = require("../../transformer/adminTransformer/trackOrderTransformer");
const helper = require("../../helper/helper");
const mailer = require("../../service/adminService/mailer");

const{
    META_STATUS_0 = 0,
    META_STATUS_1 = 1,
    SUCCESSFUL = 200,
    VALIDATION_ERROR = 400,
    INTERNAL_SERVER_ERROR = 500,
    ACTIVE = 1,
    INACTIVE = 2,
    DELETED = 3,
} = require('../../../config/key');



//List Order
exports.listOrderAdmin = async (req,res)=>{
    try{
        let reqParam = req.body
        let startDate = reqParam.startDate
        let endDate = reqParam.endDate
        let orderList
        if (startDate) {
            startDate = new Date(reqParam.startDate)

            endDate = new Date(reqParam.endDate)
            orderList = await order.find({createdAt: {$gte: startDate, $lt: endDate}})
        } else {
            orderList = await order.find()
        }
        const response = await orderTransformerAdmin.listTransformOrderDetails(orderList)
        return helper.success(res,res.__("orderListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response);
    } catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}



//view order
exports.viewOrderAdmin = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingOrder = await order.findOne({_id: reqParam.orderId, status: {$ne: 3}});
        if(!existingOrder) return helper.success(res, res.__("orderNotFound"), META_STATUS_0, SUCCESSFUL);
        const response = orderTransformerAdmin.transformOrderDetails(existingOrder);
        return helper.success(res,res.__("orderFoundSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


//edit Order
exports.editOrderAdmin = async (req,res) => {
    try {
        let reqParam = req.body;
        const date = Date.now();
        const currentDate = new Date(date);
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth();
        let day = d.getDate();
        let expireDate = new Date(year + 1, month, day);

        let existingOrder = await order.findOne({_id: reqParam.orderId, status: {$ne: 3}});
        if (!existingOrder) return helper.success(res, res.__("orderNotFound"), 0, 200);

        const orderTrackData = await trackOrder.findOne({orderId: reqParam.orderId});

             if(reqParam.orderStatus === "dispatched"){
                if(existingOrder.orderStatus === "out for delivery" || existingOrder.orderStatus ==="delivered" || existingOrder.orderStatus === "cancelled"){
                    return  helper.success(res, res.__("orderAlreadyDispatched"), 0, 200);
                }
                 await trackOrder.updateOne({orderId: reqParam.orderId}, {$set: {dispatchedDate: currentDate, orderStatus: reqParam.orderStatus}}, {new: true})
                 await order.updateOne({_id: reqParam.orderId}, {$set: {orderStatus: reqParam.orderStatus}}, {new: true})
            }

             else if (reqParam.orderStatus === "out for delivery") {
                if(existingOrder.orderStatus === "delivered" || existingOrder.orderStatus === "cancelled"){
                    return  helper.success(res, res.__("orderAlreadyOutForDelivery"), 0, 200);
                }
                 if(!orderTrackData.dispatchedDate){
                     await trackOrder.updateOne({orderId: reqParam.orderId}, {$set: {dispatchedDate: currentDate}}, {new: true})
                 }else{
                    await trackOrder.findOne({orderId: reqParam.orderId},{dispatchedDate:orderTrackData.dispatchedDate});
                 }
                 await trackOrder.updateOne({orderId: reqParam.orderId}, {$set: {outForDeliveryDate: currentDate, orderStatus: reqParam.orderStatus}}, {new: true})
                 await order.updateOne({_id: reqParam.orderId}, {$set: {orderStatus: reqParam.orderStatus}}, {new: true})
             }

             else if (reqParam.orderStatus === "delivered") {
                if(existingOrder.orderStatus ===  "cancelled"){
                    return  helper.success(res, res.__("orderAlreadyDelivered"), 0, 200);
                }
                 if(!orderTrackData.dispatchedDate && !orderTrackData.outForDeliveryDate){
                     await trackOrder.updateOne({orderId: reqParam.orderId}, {$set: {dispatchedDate: currentDate}}, {new: true})
                     await trackOrder.updateOne({orderId: reqParam.orderId}, {$set: {outForDeliveryDate: currentDate}}, {new: true})
                 }else{
                     await trackOrder.findOne({orderId: reqParam.orderId},{dispatchedDate:orderTrackData.dispatchedDate});
                     await trackOrder.findOne({orderId: reqParam.orderId},{outForDeliveryDate:orderTrackData.outForDeliveryDate});
                 }
                 await trackOrder.updateOne({orderId: reqParam.orderId}, {$set: {deliveredDate: currentDate, orderStatus: reqParam.orderStatus}}, {new: true})
                 await order.updateOne({_id: reqParam.orderId}, {$set: {orderStatus: reqParam.orderStatus}}, {new: true})

             }

             else if (reqParam.orderStatus === "cancelled") {
                if(existingOrder.orderStatus ===  "confirmed"){
                    await trackOrder.updateOne({orderId: reqParam.orderId}, {$set: {cancelledDate: currentDate, orderStatus: reqParam.orderStatus}}, {new: true})
                    await order.updateOne({_id: reqParam.orderId}, {$set: {orderStatus: reqParam.orderStatus}}, {new: true})
                }else{
                    return  helper.success(res, res.__("youCanNotCancelOrder"), 0, 200);
                }

            }

        if(existingOrder.orderStatus === "delivered") return  helper.success(res, res.__("orderAlreadyDelivered"), 0, 200);

        await orderTrackData.save();

        const orderTrack = await trackOrder.findOne({orderId: reqParam.orderId});

        let orderDetails = await order.findOne({_id: reqParam.orderId, status: {$ne: 3}});
        let existingUser = await userInfo.findOne({_id: orderDetails.userId,status: {$ne: 3}});
        let subOrderData = await subOrder.findOne({orderId:orderDetails._id,status: {$ne: 3}})
        console.log("subOrderData",subOrderData.size)

        let coinCount = existingUser.superCoin - 200;

        if (orderDetails.orderStatus === "delivered") {
            let locals = {
                userName:existingUser.userName,
                email:existingUser.email,
                phone:existingUser.phone,
                orderId:reqParam.orderId,
                purchasedItem : subOrderData.length,
                finalAmount:orderDetails.finalAmount
            }

            let emailBody = await ejs.renderFile(path.join(__dirname,'../../views',"orderDelivery.ejs"),{locals:locals})
            mailer.sendMail(existingUser.email,emailBody ,"Thank you for choosing us... ","Order")

            let coinLimit = 50;
            let coinData =  (orderDetails.finalAmount * 2) / 100;

            if (coinData > coinLimit) {
                let a = existingUser.superCoin
                let b = coinLimit
                let c = coinData
                let sum = a + coinLimit
                if (orderDetails.userId) {
                    await userInfo.updateOne({_id: orderDetails.userId},{$set: {superCoin: sum}},{new : true})
                }
            } else{
                let a = existingUser.superCoin
                let b = coinLimit
                let c = coinData
                let sum = a + coinData
                if(orderDetails.userId){
                    await userInfo.updateOne({_id: orderDetails.userId}, {$set:{superCoin: sum}},{new: true})
                }
            }
        }

        if(existingUser.superCoin < 200) {
            await userInfo.updateOne({_id: orderDetails.userId}, {$set: {userType: "regular"}}, {new: true})
        }
        if(existingUser.superCoin > 200) {
            await userInfo.updateOne({_id: orderDetails.userId}, {$set: {superCoin: coinCount,userType: "prime", primeExpiryDate: expireDate}}, {new: true})
        }
        const response = trackOrderTransformerAdmin.transformTrackOrderDetails(orderTrack);
        return helper.success(res, res.__("orderTrackedSuccessfully"), 1, 200,response)
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}
