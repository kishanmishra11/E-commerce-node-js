const jwt = require('jsonwebtoken');
const order = require("../../../model/order");
const trackOrder = require("../../../model/trackOrder");
const subOrderModel = require("../../../model/subOrder");
const applyPromoCode = require('../../../model/applyPromoCode');
const promoCode = require('../../../model/promoCode');
const Cart = require('../../../model/cart');
const product = require('../../../model/product');
const userInfo = require('../../../model/users');
const subOrderTransformer = require('../../../transformer/userTransformer/subOrderTransformer');
const subOrderCreateTransformer = require('../../../transformer/userTransformer/subOrderCreateTransformer');
const orderTransformerUser = require("../../../transformer/userTransformer/orderTransformer");
const trackOrderTransformerUser = require("../../../transformer/userTransformer/trackOrderTransformer");
const amountService = require('../../../service/userService/amtDataService');
const subOrderService = require('../../../service/userService/subOrderService');
const cartlistService = require('../../../service/userService/cartservice');
const helper = require("../../../helper/helper");
const{
    META_STATUS_0 = 0,
    META_STATUS_1 = 1,
    SUCCESSFUL = 200,
    VALIDATION_ERROR = 400,
    INTERNAL_SERVER_ERROR = 500,
    ACTIVE = 1,
    INACTIVE = 2,
    DELETED = 3,
} = require('../../../../config/key');



//create order
exports.createOrder = async (req,res)=>{
    try{
        let reqParam = req.body;

        if (req.user._id) {reqParam.userId = req.user._id};
        const checkCart = await Cart.findOne({userId: reqParam.userId});
        if(!checkCart){
            return helper.success(res, res.__("cartIsEmpty"), META_STATUS_0, SUCCESSFUL);
        }

        const verifyUser = await applyPromoCode.findOne({userId: req.user._id, status: 1 });

        let verifyPromo, promoDiscount;
        if(verifyUser) {
            verifyPromo = await promoCode.findOne({_id: verifyUser.promoCodeId});
            promoDiscount = verifyPromo.promoDiscount;

            const usedPromoCheck =  await applyPromoCode.updateOne({userId: req.user._id, status: {$ne: 3}},{$set:{status:DELETED}});

        } else promoDiscount = 0
        const amtDataServiceData =  await amountService.amtDataService({userId: req.user._id,promoDiscount: promoDiscount});

        let data={
            userId: req.user._id,
            subTotal : amtDataServiceData[0].subTotal,
            productDiscount:amtDataServiceData[0].discount,
            promoDiscount:amtDataServiceData[0].promoDiscount,
            finalAmount:amtDataServiceData[0].finalAmount,
            promoCodeId: verifyUser?.promoCodeId ? verifyUser.promoCodeId : null,
            addressId:reqParam.addressId
        }
        const ordering  = new order(data);
        const createOrder = await ordering.save();
        const orderData = orderTransformerUser.orderTransformCreateUser(createOrder);


        const subOrder = await cartlistService.cartlistService({userId: req.user._id});
        let arr=[];
        for(let element of subOrder){
            let subOrdering = new subOrderModel();
            subOrdering.orderId = createOrder._id;
            subOrdering.productId = element.productId;
            subOrdering.quantity = element.quantity;
            subOrdering.discountedPrice = element.discountedPrice;
            const abc = await subOrdering.save();
            arr.push(abc);
        }
        if (req.user._id) {reqParam.userId = req.user._id};
        if(reqParam.userId) {
            await Cart.deleteMany({userId: reqParam.userId, status: {$ne: 3}});
        }

        let orderTrack = new trackOrder()
        orderTrack.orderId = createOrder._id;
        orderTrack.status = createOrder.status;
        orderTrack.orderStatus = createOrder.orderStatus;
        orderTrack.confirmedDate = createOrder.createdAt;

        await orderTrack.save();

        const subOrderData = subOrderCreateTransformer.listTransformSubOrderDetails(arr);
        return helper.success(res,res.__("orderCreatedSuccessfully"),META_STATUS_1,SUCCESSFUL, {orderData,subOrderData});
    }
    catch(e) {
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


//List Order
exports.listOrder = async (req,res)=>{
    try{
        let reqParam = req.body;
        const orderList = await order.find({userId:reqParam.userId});
        const response = orderTransformerUser.listTransformOrderDetailsUser(orderList)
        return helper.success(res,res.__("orderListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response);
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}



//view order
exports.viewOrder = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingOrder = await order.findOne({_id: reqParam.orderId, status: {$ne: 3}});
        // let subData = await subOrderModel.find({orderId: reqParam.orderId});
        if(!existingOrder) return helper.success(res, res.__("orderNotFound"), META_STATUS_0, SUCCESSFUL);
        const subData = await subOrderService.subOrderService({orderId:reqParam.orderId})
        // console.log(subData)
        const response = orderTransformerUser.transformOrderDetailsUser(existingOrder);
        const subOrderData = subOrderTransformer.listTransformSubOrderDetails(subData);
        return helper.success(res,res.__("orderFoundSuccessfully"),META_STATUS_1,SUCCESSFUL,{response,subOrderData})
    } catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


//track order
exports.trackOrder = async (req,res) => {
    try{
        let reqParam = req.body;
        let orderTrack = await trackOrder.findOne({trackOrderId: reqParam._id, status: {$ne: 3}});
        if(!orderTrack) return helper.success(res, res.__("orderNotFound"), META_STATUS_0, SUCCESSFUL);

        const response = trackOrderTransformerUser.transformTrackOrderDetailsUser(orderTrack);
        return helper.success(res,res.__("orderTrackedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}