const helper = require('../../helper/helper');

exports.transformApplyPromoCode = (data) => {
    return {
        applyPromoCodeId: data?._id ? data._id : "",
        userId: data?.userId ? data.userId : "",
        promoCodeId: data?.promoCodeId ? data.promoCodeId: "",
        status: data?.status ? data.status : 0
    };
};

exports.transformApplyPromoDetails = (arrayData) => {
    let promoData = null;
    if (arrayData) {
        promoData = this.transformApplyPromoCode(arrayData);
    }
    return promoData;
};

exports.listTransformApplyPromoDetails = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transformApplyPromoCode(a));
        });
    }
    arrayData = data;
    return arrayData;
};