exports.trackOrderTransformCreate = (data) => {
    return {
        trackOrderId: data?._id ? data._id: "",
    };
};

exports.transformTrackOrder = (data) => {
    return {
        trackOrderId: data?._id ? data._id: "",
        orderId: data?.orderId ? data.orderId: "",
        orderStatus: data?.orderStatus ? data.orderStatus : "",
        confirmedDate: data?.confirmedDate ? data.confirmedDate.getTime(): 0,
        dispatchedDate: data?.dispatchedDate ? data.dispatchedDate.getTime(): 0,
        outForDeliveryDate: data?.outForDeliveryDate ? data.outForDeliveryDate.getTime(): 0,
        deliveredDate: data?.deliveredDate ? data.deliveredDate.getTime(): 0,
        cancelledDate: data?.cancelledDate ? data.cancelledDate.getTime(): 0,
        status: data?.status ? data.status : 0,

    };
};

exports.transformTrackOrderDetails = (arrayData) => {
    let trackOrderData = null;
    if (arrayData) {
        trackOrderData = this.transformTrackOrder(arrayData);
    }
    return trackOrderData;
};


exports.listTransformTrackOrderDetails = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transformTrackOrder(a));
        });
    }
    arrayData = data;
    return arrayData;
};