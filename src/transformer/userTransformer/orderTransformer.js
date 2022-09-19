exports.transformOrderUser = (data) => {
    return {
        orderId: data?._id ? data._id: "",
        userId: data?.userId ? data.userId : "",
        subTotal: data?.subTotal ? data.subTotal : 0,
        productDiscount: data?.productDiscount ? data.productDiscount : 0,
        promoDiscount: data?.promoDiscount ? data.promoDiscount : 0,
        deliveryCharge: data?.deliveryCharge ? data.deliveryCharge : 0,
        finalAmount: data?.finalAmount ? data.finalAmount : 0,
        addressId: data?.addressId ? data.addressId : 0,
        promoCodeId: data?.promoCodeId ? data.promoCodeId : 0,
        status: data?.status ? data.status : 0,
        orderStatus: data?.orderStatus ? data.orderStatus : 0,
        paymentStatus: data?.paymentStatus ? data.paymentStatus : false,
    };
};

exports.orderTransformCreateUser = (data) => {
    return {
        orderId: data?._id ? data._id: "",
        userId: data?.userId ? data.userId : "",
        subTotal: data?.subTotal ? data.subTotal : 0,
        productDiscount: data?.productDiscount ? data.productDiscount : 0,
        promoDiscount: data?.promoDiscount ? data.promoDiscount : 0,
        deliveryCharge: data?.deliveryCharge ? data.deliveryCharge : 0,
        finalAmount: data?.finalAmount ? data.finalAmount : 0,
        addressId: data?.addressId ? data.addressId : 0,
        promoCodeId: data?.promoCodeId ? data.promoCodeId : 0,
        status: data?.status ? data.status : 0,
        paymentStatus: data?.paymentStatus ? data.paymentStatus : false,
    };
};

exports.transformOrderDetailsUser = (arrayData) => {
    let orderData = null;
    if (arrayData) {
        orderData = this.transformOrderUser(arrayData);
    }
    return orderData;
};


exports.listTransformOrderDetailsUser = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transformOrderUser(a));
        });
    }
    arrayData = data;
    return arrayData;
};