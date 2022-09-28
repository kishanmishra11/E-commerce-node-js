const helper = require('../../helper/helper');
exports.transformCart = (data) => {

    return {
        cartId: data?._id ? data._id: "",
        userId:data?.userId ? data.userId:"",
        productId: data?.productId ? data.productId: "",
        quantity: data?.quantity ? data.quantity : 0,
        categoryId: data?.categoryId ? data.categoryId: "",
        categoryName: data?.categoryName ? data.categoryName: "",
        subCategoryId: data?.subCategoryId ? data.subCategoryId: "",
        subCategoryName: data?.subCategoryName ? data.subCategoryName: "",
        productName: data?.productName ? data.productName: "",
        productDescription: data?.productDescription ? data.productDescription : "",
        productImage: data?.productImage ? helper.urlInfo(data.productImage,'user'):"",
        productPrice: data?.productPrice ? data.productPrice: "",
        productDiscount: data?.productDiscount ? data.productDiscount: 0,
        discountedPrice: data?.discountedPrice ? data.discountedPrice: 0,
        totalPrice: data?.totalPrice ? data.totalPrice: 0,
        totalDiscount: data?.totalDiscount ? data.totalDiscount:0,
        finalPrice: data?.finalPrice ? data.finalPrice:0,

    };
};
exports.cartTransformCreate = (data) => {
    return {
        cartId: data?._id ? data._id: "",
        userId:data?.userId ? data.userId:"",
        productId: data?.productId ? data.productId: "",
        productPriceListId: data?.productPriceListId ? data.productPriceListId: "",
        quantity: data?.quantity ? data.quantity : "",
    };
};
exports.transformCartDetails = (arrayData) => {
    let cartData = null;
    if (arrayData) {
        cartData = this.cartTransformCreate(arrayData);
    }
    return cartData;
};

exports.listtransformCartDetails = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transformCart(a));
        });
    }
    arrayData = data;
    return arrayData;
};


exports.listtransformCartDetailsArray = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.cartTransformCreate(a));
        });
    }
    arrayData = data;
    return arrayData;
};