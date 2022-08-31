exports.transformDemoData = (data) => {
    return {
        subTotal: data?.subTotal ? data.subTotal:0,
        discount: data?.discount ? data.discount:0,
        finalAmount: data?.finalAmount ? data.finalAmount:0,
    };
};
exports.listDemoDataDetails = (arrayData) => {
    let amountData = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            amountData.push(this.transformDemoData(a));
        });
    }
    arrayData = amountData;
    return arrayData;
};