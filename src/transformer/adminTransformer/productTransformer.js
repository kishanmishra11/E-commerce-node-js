const helper = require('../../helper/helper');
exports.producttransformaddress = (data,language) => {
    if (language == "guj") {
        data.categoryName = data.categoryNameGuj
        data.categoryDescription = data.categoryDescriptionGuj
        data.subCategoryName = data.subCategoryNameGuj
        data.subCategoryDescription = data.subCategoryDescriptionGuj
        data.productName = data.productNameGuj
        data.productDescription = data.productDescriptionGuj
    }
    return {
        productId: data?._id ? data._id: "",
        categoryId: data?.categoryId ? data.categoryId: "",
        categoryName: data?.categoryName ? data.categoryName: "",
        categoryDescription: data?.categoryDescription ? data.categoryDescription : "",
        subCategoryId: data?.subCategoryId ? data.subCategoryId: "",
        subCategoryName: data?.subCategoryName ? data.subCategoryName: "",
        subCategoryDescription: data?.subCategoryDescription ? data.subCategoryDescription : "",
        productName: data?.productName ? data.productName: "",
        productDescription: data?.productDescription ? data.productDescription : "",
        productPrice: data?.productPrice ? data.productPrice: "",
        productDiscount: data?.productDiscount ? data.productDiscount: "",
        discountedPrice: data?.discountedPrice ? data.discountedPrice: 0,
        productImage: data?.productImage ? helper.urlInfo(data.productImage,'user'):"",
        status: data?.status ? data.status : 0,
        cartQuantity:  data?.cartQuantity ? data.cartQuantity : 0,
    };
};

exports.producttransformCreate = (data) => {
    return {
        productId: data?._id ? data._id: "",
        categoryId: data?.categoryId ? data.categoryId: "",
        subCategoryId: data?.subCategoryId ? data.subCategoryId: "",
        productName: data?.productName ? data.productName: "",
        productPrice: data?.productPrice ? data.productPrice: "",
        productDiscount: data?.productDiscount ? data.productDiscount: "",
        discountedPrice: data?.discountedPrice ? data.discountedPrice: 0,
        productDescription: data?.productDescription ? data.productDescription : "",
        productImage: data?.productImage ? helper.urlInfo(data.productImage,'user'):"",
        status: data?.status ? data.status : 0

    };
};


exports.producttransformAddressDetails = (arrayData,arrayData2) => {
    let addressData = null;
    if (arrayData,arrayData2) {
        addressData = this.producttransformCreate(arrayData,arrayData2);
    }
    return arrayData,arrayData2;
};

exports.productlisttransformAddressDetails = (arrayData,language) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.producttransformaddress(a,language));
        });
    }
    arrayData = data;
    return arrayData;
};