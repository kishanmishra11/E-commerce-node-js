exports.transformSubOrder = (data) => {
    return {
        orderId: data?.orderId ? data.orderId: "",
        productId: data?.productId ? data.productId : "",
        productPriceListId: data?.productPriceListId ? data.productPriceListId : "",
        quantity: data?.quantity ? data.quantity : 0,
        discountedPrice: data?.discountedPrice ? data.discountedPrice : 0,
        status: data?.status ? data.status : 0,
    };
};

exports.transformSubOrderDetails = (arrayData) => {
    let subOrderData = null;
    if (arrayData) {
        subOrderData = this.transformSubOrder(arrayData);
    }
    return subOrderData;
};

exports.listTransformSubOrderDetails = (arrayData) => {
    let subData = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            subData.push(this.transformSubOrder(a));
        });
    }
    return subData;
};