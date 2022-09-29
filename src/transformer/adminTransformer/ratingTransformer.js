const helper = require('../../helper/helper');

exports.transformRatingAdmin = (arrayData) => {
    let data = [];
    if(arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transformRating(a));
        });
    }
    arrayData = data;
    return arrayData;
};

exports.transformRating = (data) => {
    return {
        productId: data?._id ? data._id : "",
        productImage: data?.productData[0]?.productImage ? helper.urlInfo(data.productData[0].productImage,'user'):"",
        productName: data?.productData[0]?.productName ? data.productData[0].productName : "",
        rating: data?.rating ? data.rating: 0,
        ratingCount: data?.ratingCount ? data.ratingCount : "",
    };
};


exports.transformRatingview = (data) => {
    return {
        ratingId: data?._id ? data._id : "",
        productId: data?.productId ? data.productId : "",
        userId: data?.userId ? data.userId : "",
        title: data?.title ? data.title : "",
        comment: data?.comment ? data.comment : "",
        star: data?.star ? data.star : "",
    };
};

exports.transformRatingAdminView = (arrayData) => {
    let data = [];
    if(arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transformRatingview(a));
        });
    }
    arrayData = data;
    return arrayData;
};