const helper = require('../helper/helper');

exports.transformUser = (data) => {
    return {
        userId: data?._id ? data._id: "", 
        userName: data?.userName ? data.userName : "",
        phone: data?.phone ? data.phone : "",
        email: data?.email ? data.email : "",
        profilePicture: data?.profilePicture ? helper.urlInfo(data.profilePicture,'user'):"",
        superCoin: data?.superCoin ? data.superCoin : 0,
        userType: data?.userType ? data.userType : "",
        primeExpiryDate: data?.primeExpiryDate ? data.primeExpiryDate : 0,
        status: data?.status ? data.status : 0
    };
};

exports.transformUserDetails = (arrayData) => {
    let userData = null;
    if (arrayData) {
        userData = this.transformUser(arrayData);
    }
    return userData;
};

exports.listtransformUserDetails = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transformUser(a));
        });
    }
    arrayData = data;
    return arrayData;
};