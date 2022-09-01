exports.transformAmtData = (data) => {
    return {
        subTotal: data?.subTotal ? data.subTotal:0,
        discount: data?.discount ? data.discount:0,
        promoDiscount:data?.promoDiscount ? data.promoDiscount:0,
        finalAmount: data?.finalAmount ? data.finalAmount:0,
    };
};
exports.listAmtDataDetails = (arrayData) => {
    let amountData = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            amountData.push(this.transformAmtData(a));
        });
    }
    arrayData = amountData[0];
    return arrayData;
};