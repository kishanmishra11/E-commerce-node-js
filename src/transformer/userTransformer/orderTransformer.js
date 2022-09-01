exports.transformOrderUser = (data) => {
    return {
        orderId: data?._id ? data._id: "",
        userId: data?.userId ? data.userId : "",
        subTotal: data?.subTotal ? data.subTotal : "",
        productDiscount: data?.productDiscount ? data.productDiscount : 0,
        promoDiscount: data?.promoDiscount ? data.promoDiscount : 0,
        deliveryCharge: data?.deliveryCharge ? data.deliveryCharge : 0,
        finalAmount: data?.finalAmount ? data.finalAmount : 0,
        addressId: data?.addressId ? data.addressId : "",
        promoCodeId: data?.promoCodeId ? data.promoCodeId : "",
        status: data?.status ? data.status : 0,
        orderStatus: data?.orderStatus ? data.orderStatus : "",
    };
};

exports.orderTransformCreateUser = (data) => {
    return {
        orderId: data?._id ? data._id: "",
        userId: data?.userId ? data.userId : "",
        subTotal: data?.subTotal ? data.subTotal : "",
        productDiscount: data?.productDiscount ? data.productDiscount : 0,
        promoDiscount: data?.promoDiscount ? data.promoDiscount : 0,
        deliveryCharge: data?.deliveryCharge ? data.deliveryCharge : 0,
        finalAmount: data?.finalAmount ? data.finalAmount : 0,
        addressId: data?.addressId ? data.addressId : "",
        promoCodeId: data?.promoCodeId ? data.promoCodeId : "",
        status: data?.status ? data.status : 0,
        orderStatus: data?.orderStatus ? data.orderStatus : "",
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