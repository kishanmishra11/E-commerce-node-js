
exports.transformSubOrderData = (data) => {
    return {
        subOrderId: data?._id ? data._id: "",
        orderId: data?.orderId ? data.orderId: "",
        productId: data?.productId ? data.productId : "",
        productName: data?.productName ? data.productName : "",
        productImage: data?.productImage ? data.productImage : "",
        productPrice: data?.productPrice ? data.productPrice : "",
        quantity: data?.quantity ? data.quantity : 0,
        discountedPrice: data?.discountedPrice ? data.discountedPrice : 0,
        totalPrice: data?.totalPrice ? data.totalPrice : 0,
        totalDiscountedPrice: data?.totalDiscountedPrice ? data.totalDiscountedPrice : 0,
        status: data?.status ? data.status : 0,
    };
};

exports.listTransformSubOrderDetails = (arrayData,productData) => {
    let subOrder = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            subOrder.push(this.transformSubOrderData(a,productData));
        });
    }
    return subOrder;
};

