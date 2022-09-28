const jwt = require('jsonwebtoken');
const Address = require('../../../model/address');
const AddressTransformer = require('../../../transformer/userTransformer/addressTransformer');
const addressService = require('../../../service/adminService/addressService');
const { editAddressValidation, addressValidation } = require("../../../validation/userValidation/addressValidation");
const helper = require("../../../helper/helper");
const {deleteValidation, deleteAddressValidation} = require("../../../validation/userValidation/deleteAdressValidation");
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

//List Address
exports.listAddress = async (req,res)=>{
    try{
        //set language
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}

        //pagination
        let reqParam = req.body;
        const{limitCount,skipCount} = helper.getPageAndLimit(reqParam.page,reqParam.limit);
        const [addressService2] = await addressService.addressService({userId: req.user._id,status: reqParam.status,skip: skipCount, limit: limitCount,sortBy:reqParam.sortBy,sortKey:reqParam.sortKey,search:reqParam.search})
        const responseData = addressService2 &&  addressService2.data ? addressService2.data : [];
        const totalCount =(addressService2, addressService2.totalRecords &&  addressService2.totalRecords[0] &&  addressService2.totalRecords[0].count);
        const response = AddressTransformer.listTransformAddressDetails(responseData, lang)
        return helper.success(res,res.__("addressListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response,{"totalCount":totalCount});
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//add-edit Address
exports.addEditAddress = async (req,res) => {
    try{
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}
        //joi validation
        let addressExist;
        let reqParam = req.body;
        if (req.user._id) {req.body.userId = req.user._id};
        if(reqParam.addressId){
            const validationMessage  = await editAddressValidation(reqParam);
            if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));

            addressExist = await Address.findOne({_id: reqParam.addressId,status: {$ne: 3}});
            if(!addressExist) return helper.success(res, res.__("addressNotFound"), META_STATUS_0, SUCCESSFUL);

        } else  {
            const validationMessage  = await addressValidation(reqParam);
            if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));


            addressExist = new Address();
        }

        addressExist.userId = reqParam.userId ? reqParam.userId : addressExist.userId;
        addressExist.userName = reqParam.userName ? reqParam.userName : addressExist.userName;
        addressExist.phone = reqParam.phone ? reqParam.phone : addressExist.phone;
        addressExist.email = reqParam.email ? reqParam.email : addressExist.email;
        addressExist.cityId = reqParam.cityId ? reqParam.cityId : addressExist.cityId;
        addressExist.houseNo = reqParam.houseNo ? reqParam.houseNo : addressExist.houseNo;
        addressExist.status = req.body.status ? reqParam.status : addressExist.status;

        const newAddress = await addressExist.save();

        const response = AddressTransformer.transformAddressDetails(newAddress);
        return helper.success(res,res.__("addressUpdatedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//view Address
exports.viewAddress = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingAddress = await Address.findOne({_id: reqParam.addressId, status: {$ne: 3}});
        if(!existingAddress) return helper.success(res, res.__("addressNotFound"), META_STATUS_0, SUCCESSFUL);
        const response = AddressTransformer.transformAddressDetails(existingAddress);
        return helper.success(res,res.__("addressFoundSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

// delete single/multiple/delete all Address
exports.deleteAddress = async (req,res) => {
    try{
        let reqParam = req.body
        const validationMessage  = await deleteValidation(req.body);
        if(validationMessage) {
            return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
        }
        let all = reqParam.all
        if(all===true){
            let deleteAddress =  await Address.updateMany({status: {$ne: 3}},{$set:{status:3}});
        }else{
            const validationMessage  = await deleteAddressValidation(req.body);
            if(validationMessage) {
                return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
            }
            reqParam.addressId = reqParam.addressId.split(",");
            let deleteAddress =  await Address.updateMany({_id:{$in:reqParam.addressId}},{$set:{status:3}});
        }
        return helper.success(res,res.__("addressDeletedSuccessFully"), META_STATUS_1,SUCCESSFUL)
    }catch (e) {
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}
