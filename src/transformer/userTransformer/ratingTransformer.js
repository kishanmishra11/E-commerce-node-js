exports.transformRating = (data) => {
    return {
        ratingId: data?._id ? data._id : "",
        userId: data?.userId ? data.userId : "",
        productId: data?.productId ? data.productId : "",
        title: data?.title ? data.title : "",
        comment: data?.comment ? data.comment : "",
        star: data?.star ? data.star : ""
    };
};

exports.transformRatingData = (arrayData) => {
    let data = [];
    if(arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transformRating(a));
        });
    }
    arrayData = data;
    return arrayData;
};