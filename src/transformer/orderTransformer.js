exports.transformOrder = (data) => {
    return {
        orderId: data?._id ? data._id: "",
        userId: data?.userId ? data.userId : "",
        subTotal: data?.subTotal ? data.subTotal : "",
        productDiscount: data?.productDiscount ? data.productDiscount : 0,
        promoDiscount: data?.promoDiscount ? data.promoDiscount : 0,
        finalAmount: data?.finalAmount ? data.finalAmount : 0,
        addressId: data?.addressId ? data.addressId : "",
        promoCodeId: data?.promoCodeId ? data.promoCodeId : "",
        status: data?.status ? data.status : 0,
        orderStatus: data?.orderStatus ? data.orderStatus : "",
    };
};

exports.orderTransformCreate = (data) => {
    return {
        orderId: data?._id ? data._id: "",
        userId: data?.userId ? data.userId : "",
        subTotal: data?.subTotal ? data.subTotal : "",
        productDiscount: data?.productDiscount ? data.productDiscount : 0,
        promoDiscount: data?.promoDiscount ? data.promoDiscount : 0,
        finalAmount: data?.finalAmount ? data.finalAmount : 0,
        addressId: data?.addressId ? data.addressId : "",
        promoCodeId: data?.promoCodeId ? data.promoCodeId : "",
        status: data?.status ? data.status : 0,
        orderStatus: data?.orderStatus ? data.orderStatus : "",
    };
};

exports.transformOrderDetails = (arrayData) => {
    let orderData = null;
    if (arrayData) {
        orderData = this.transformOrder(arrayData);
    }
    return orderData;
};


exports.listTransformOrderDetails = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transformOrder(a));
        });
    }
    arrayData = data;
    return arrayData;
};