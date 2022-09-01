const helper = require('../helper/helper');

exports.transformDeliveryCharge = (data) => {
    return {
        deliveryChargeId: data?._id ? data._id: "",
        deliveryCharge: data?.deliveryCharge ? data.deliveryCharge : 0,
        status: data?.status ? data.status : 0
    };
};

exports.transformDeliveryChargeDetails = (arrayData) => {
    let addressData = null;
    if (arrayData) {
        addressData = this.transformDeliveryCharge(arrayData);
    }
    return addressData;
};
