exports.wishListTransformCreate = (data) => {
    return {
        wishListId: data?._id ? data._id: "",
        productId: data?.productId ? data.productId: "",
        productPriceListId: data?.productPriceListId ? data.productPriceListId: "",
    };
};
exports.transformWishListDetails = (arrayData) => {
    let wishListData = null;
    if (arrayData) {
        wishListData = this.wishListTransformCreate(arrayData);
    }
    return wishListData;
};


exports.listTransformWishListDetails = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.wishListTransformCreate(a));
        });
    }
    arrayData = data;
    return arrayData;
};