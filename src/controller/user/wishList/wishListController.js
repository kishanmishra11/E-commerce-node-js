const wishListModel = require('../../../model/wishList');
const productPriceList = require('../../../model/productPriceList');
const WishListTransformer = require('../../../transformer/userTransformer/wishListTransformer');
const {sendNotification} = require('../../../helper/pushNotification');
const helper = require("../../../helper/helper");
const{
    META_STATUS_0,
    META_STATUS_1,
    SUCCESSFUL,
    VALIDATION_ERROR,
    INTERNAL_SERVER_ERROR,
    ACTIVE,
    INACTIVE,
    DELETED
} = require('../../../../config/key');




exports.wishList =  async(req,res)=>{
    try {
        //set language
        let reqParam = req.body;

        for(let data of reqParam){
         let wishListExist = await wishListModel.findOne({productId: data.productId, productPriceListId:data.productPriceListId, status: {$ne: 3}});
         if(wishListExist) return helper.success(res, res.__("productAlreadyExistsInWishList"), META_STATUS_0, SUCCESSFUL);

        let checkStock = await productPriceList.findOne({productId:data.productId, _id:data.productPriceListId})
        if(checkStock.stock <= 0 || checkStock.stock === null )
        return helper.success(res, res.__("productOutOfStock"), META_STATUS_0, SUCCESSFUL);

        const wishList = new wishListModel(data);
        await wishList.save()

        const deviceToken = 'ePBqq9bCm1Ff8uAlAMoWlf:APA91bHrypYO0a4rjD5mEAWYo5x-I3LKq3yBHj_gUAFus6K-9-eXHtu4sYp_KJ72sA3w9AZjLIRWW333SaIJZNJilBgei4xTKmZLaRejojKd2Gkb2DKAGPU1DT3h2lOB2rAW2qldHVZa';
        let stock = await productPriceList.findOne({productId:data.productId, _id:data.productPriceListId})
            console.log("stock",stock)
        if(stock.price  < data.setPriceLimit){
            await sendNotification(deviceToken,"Price Alert","Product price Dropped");
        }
        }
        const listWishList = await wishListModel.find();


        const response = WishListTransformer.listTransformWishListDetails(listWishList);
        return helper.success(res,res.__("productAddedSuccessfullyInYourWishList"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


