const jwt = require('jsonwebtoken');
const Cart = require("../../../model/cart");
const applyPromoCode = require('../../../model/applyPromoCode');
const promoCode = require('../../../model/promoCode');
const deliveryCharge = require('../../../model/config');
const productModel = require('../../../model/product');
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
} = require('../../../../config/key');



//add to cart
exports.createCart =  async(req,res)=>{
    try {
        //set language
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}
        //joi validation
        const validationMessage  = await cartValidation(req.body);
        if(validationMessage) {
            return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
        }

        let charge = await deliveryCharge.findOne({userId: req.user._id });
        if (req.user.userType === "prime"){
            charge.deliveryCharge = 0
        }

        const verifyUser = await applyPromoCode.findOne({userId: req.user._id });
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
        const amtDataServiceData =  await amountService.amtDataService({userId: req.user._id, promoDiscount: promoDiscount,productId: req.body.productId , deliveryCharge:charge.deliveryCharge,userType: req.user.userType, regularDiscount:product.regularDiscount,primeDiscount:product.primeDiscount});
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
        const amtDataServiceData =  await amountService.amtDataService({userId: req.user._id, promoDiscount: promoDiscount});
        const cartData = CartTransformer.listtransformCartDetails(listCart);
        const amountData = transformAmtData.listAmtDataDetails(amtDataServiceData);
        return helper.success(res,res.__("cartListedSuccessfully"),META_STATUS_1,SUCCESSFUL,{cartData,amountData})
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}