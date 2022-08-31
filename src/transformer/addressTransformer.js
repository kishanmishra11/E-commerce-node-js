const helper = require('../helper/helper');

exports.transformAddress = (data) => {
    return {
        addressId: data?._id ? data._id: "",
        userId:data?.userId ? data.userId:"",
        userName: data?.userName ? data.userName : "",
        phone: data?.phone ? data.phone : "",
        email: data?.email ? data.email : "",
        cityId: data?.cityId ? data.cityId : "",
        houseNo: data?.houseNo ? data.houseNo : "",
        status: data?.status ? data.status : 0
    };
};

exports.transformAddressDetails = (arrayData) => {
    let addressData = null;
    if (arrayData) {
        addressData = this.transformAddress(arrayData);
    }
    return addressData;
};

exports.addressTransformCreate = (data) => {
    return {
        addressId: data?._id ? data._id: "",
        userId:data?.userId ? data.userId:"",
        userName: data?.userName ? data.userName : "",
        phone: data?.phone ? data.phone : "",
        email: data?.email ? data.email : "",
        cityId: data?.cityId ? data.cityId : "",
        houseNo: data?.houseNo ? data.houseNo : "",
        cityName: data?.cityName ? data.cityName : "",
        status: data?.status ? data.status : 0
    };
};
exports.listTransformAddressDetails = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.addressTransformCreate(a));
        });
    }
    arrayData = data;
    return arrayData;
};