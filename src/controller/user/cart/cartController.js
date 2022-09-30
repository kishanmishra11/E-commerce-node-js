const jwt = require('jsonwebtoken');
const Cart = require("../../../model/cart");
const applyPromoCode = require('../../../model/applyPromoCode');
const promoCode = require('../../../model/promoCode');
const deliveryCharge = require('../../../model/config');
const productModel = require('../../../model/product');
const productPriceList = require('../../../model/productPriceList');
const subOrderModel = require('../../../model/subOrder');
const orderModel = require('../../../model/order');
const CartTransformer = require('../../../transformer/userTransformer/cartTransformer');
const cartlistService = require('../../../service/userService/cartservice');
const { cartValidation } = require("../../../validation/userValidation/cartValidation");
const transformAmtData = require("../../../transformer/userTransformer/amtDataTransformer");
const amountService = require('../../../service/userService/amtDataService');
const helper = require("../../../helper/helper");
const{
    META_STATUS_0 = 0,
    META_STATUS_1 = 1,
    SUCCESSFUL = 200,
    VALIDATION_ERROR = 400,
    INTERNAL_SERVER_ERROR = 500,
    ACTIVE,
    INACTIVE,
    DELETED
} = require('../../../../config/key');



//add to cart
exports.createCart =  async(req,res)=>{
    try {
        //set language
        let reqParam = req.body;
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}
        //joi validation
        const validationMessage  = await cartValidation(req.body);
        if(validationMessage) {
            return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
        }
        let checkStock = await productPriceList.findOne({productId:reqParam.productId, _id:reqParam.productPriceListId})
        if(checkStock.stock <= 0 || checkStock.stock === null )
            return helper.success(res, res.__("productOutOfStock"), META_STATUS_0, SUCCESSFUL);

        let charge = await deliveryCharge.findOne({userId: req.user._id });
        if (req.user.userType === "prime"){
            charge.deliveryCharge = 0
        }

        const verifyUser = await applyPromoCode.findOne({userId: req.user._id ,status:ACTIVE });
        let verifyPromo, promoDiscount;
        if(verifyUser) {
            verifyPromo = await promoCode.findOne({_id: verifyUser.promoCodeId});
            promoDiscount = verifyPromo.promoDiscount;
        } else promoDiscount = 0
        if (req.user._id) {req.body.userId = req.user._id};
        let update = await Cart.findOne({userId: req.body.userId, productId: req.body.productId})

        if(update){
            update.quantity = req.body.quantity
            await update.save();
        } else {
            const cart = new Cart(req.body);
            update = await cart.save();
        }
        let product = await productModel.findOne({_id:req.body.productId})
        const amtDataServiceData =  await amountService.amtDataService({userId: req.user._id, promoDiscount: promoDiscount,productId: req.body.productId , deliveryCharge:charge.deliveryCharge,userType: req.user.userType, regularDiscount:product.regularDiscount,totalPrimeDiscount:product.totalPrimeDiscount});
        const response = CartTransformer.transformCartDetails(update);
        const amountData = transformAmtData.listAmtDataDetails(amtDataServiceData);
        return helper.success(res,res.__("cartAddedSuccessfully"),META_STATUS_1,SUCCESSFUL,{response,amountData})
    } catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}
//list cart
exports.listCart = async (req,res)=>{
    try{
        //set language
        let reqParam = req.body;
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}
        let product = await productModel.find({productId:req.body.productId})
        const listCart = await cartlistService.cartlistService({userId: req.user._id,sortBy:reqParam.sortBy,sortKey:reqParam.sortKey,userType: req.user.userType});
        const verifyUser = await applyPromoCode.findOne({userId: req.user._id });
        let verifyPromo, promoDiscount;
        if(verifyUser) {
            verifyPromo = await promoCode.findOne({_id: verifyUser.promoCodeId});
            promoDiscount = verifyPromo.promoDiscount;
        } else promoDiscount = 0
        let charge = await deliveryCharge.findOne({userId: req.user._id });
        if (req.user.userType === "prime"){
            charge.deliveryCharge = 0
        }
        const amtDataServiceData =  await amountService.amtDataService({userId: req.user._id, promoDiscount: promoDiscount, deliveryCharge:charge.deliveryCharge,userType: req.user.userType});
        const cartData = CartTransformer.listtransformCartDetails(listCart);
        const amountData = transformAmtData.listAmtDataDetails(amtDataServiceData);
        return helper.success(res,res.__("cartListedSuccessfully"),META_STATUS_1,SUCCESSFUL,{cartData,amountData})
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//re order
exports.reorder = async (req,res) => {
    try {
        let reqParam = req.body
        let orderData = await subOrderModel.find({orderId:reqParam.orderId});
        if(orderData.length === 0) return helper.success(res, res.__("orderNotFound"), META_STATUS_0, SUCCESSFUL);

        let charge = await deliveryCharge.findOne({userId: req.user._id });
        if (req.user.userType === "prime"){
            charge.deliveryCharge = 0
        }
        let arr = [];

        for (let a of orderData) {
            let cartList = new Cart();
                cartList.userId = req.user._id,
                cartList.productId =  a.productId,
                cartList.productPriceListId = a.productPriceListId,
                cartList.quantity = a.quantity

            const abc = await cartList.save();
            arr.push(abc);

            let checkStock = await productPriceList.findOne({_id:abc.productPriceListId, productId:abc.productId});
            if(!checkStock) return helper.success(res, res.__("productOutOfStock"), META_STATUS_0, SUCCESSFUL);
            let stockInfo = checkStock.stock - abc.quantity
            let updateStock = await productPriceList.findOneAndUpdate({_id:abc.productPriceListId, productId:abc.productId},{$set: {stock: stockInfo}}, {new: true})
        }
            const response = CartTransformer.listtransformCartDetailsArray(arr);
            return helper.success(res,res.__("orderCreatedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    }
    catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}