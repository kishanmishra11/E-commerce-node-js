exports.transformOffer = (data) => {
    return {
        offerId: data?._id ? data._id: 0,
        categoryId:data?.categoryId ? data.categoryId:0,
        productId: data?.productId ? data.productId : 0,
        title: data?.title ? data.title : 0,
        description: data?.description ? data.description : 0,
        flatDiscountAmount: data?.flatDiscountAmount ? data.flatDiscountAmount :0,
        specialDiscountAmount: data?.specialDiscountAmount ? data.specialDiscountAmount :0,
        offerType: data?.offerType ? data.offerType : 0,
        startDate: data?.startDate ? data.startDate :0,
        endDate: data?.endDate ? data.endDate :0,
        status: data?.status ? data.status : 0
    };
};

exports.transformOfferDetails = (arrayData) => {
    let offerData = null;
    if (arrayData) {
        offerData = this.transformOffer(arrayData);
    }
    return offerData;
};

exports.listTransformOfferDetails = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transformOffer(a));
        });
    }
    arrayData = data;
    return arrayData;
};