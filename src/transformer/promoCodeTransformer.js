const helper = require('../helper/helper');

exports.transformPromoCode = (data, language) => {
    if (language == "guj") {
        data.promoCodeName = data.promoCodeNameGuj
    }
    return {
        promoCodeId: data?._id ? data._id: "",
        promoCodeName: data?.promoCodeName ? data.promoCodeName : "",
        promoCodeNameGuj: data?.promoCodeNameGuj ? data.promoCodeNameGuj : "",
        promoDiscount: data?.promoDiscount ? data.promoDiscount : "",
        startDate: data?.startDate ? data.startDate : "",
        endDate: data?.endDate ? data.endDate : "",
        status: data?.status ? data.status : 0
    };
};

exports.transformPromoDetails = (arrayData) => {
    let promoData = null;
    if (arrayData) {
        promoData = this.transformPromoCode(arrayData);
    }
    return promoData;
};

exports.listTransformPromoDetails = (arrayData, language) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transformPromoCode(a, language));
        });
    }
    arrayData = data;
    return arrayData;
};