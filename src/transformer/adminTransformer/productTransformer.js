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
        regularDiscount: data?.regularDiscount ? data.regularDiscount: 0,
        primeDiscount: data?.primeDiscount ? data.primeDiscount: 0,
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
        regularDiscount: data?.regularDiscount ? data.regularDiscount: 0,
        primeDiscount: data?.primeDiscount ? data.primeDiscount: 0,
        productDescription: data?.productDescription ? data.productDescription : "",
        productImage: data?.productImage ? helper.urlInfo(data.productImage,'user'):"",
        status: data?.status ? data.status : 0

    };
};


exports.producttransformAddressDetails = (arrayData,arrayData2) => {
    let addressData = null;
    if (arrayData) {
        addressData = this.producttransformCreate(arrayData,arrayData2);
    }
    return addressData;
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



exports.productPriceListTransform = (data) => {
    return {
        productPriceListId: data?._id ? data._id: "",
        productId: data?.productId ? data.productId: "",
        price: data?.price ? data.price: 0,
        colorName: data?.colorName ? data.colorName : "",
        regularDiscountedPrice: data?.regularDiscountedPrice ? data.regularDiscountedPrice: 0,
        primeDiscountedPrice: data?.primeDiscountedPrice ? data.primeDiscountedPrice: 0,
        status: data?.status ? data.status : 0
    };
};

exports.productPriceListTransformDetails = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.productPriceListTransform(a));
        });
    }
    arrayData = data;
    return arrayData;
};


exports.productPriceListTransformDataDetails = (arrayData) => {
    let addressData = null;
    if (arrayData) {
        addressData = this.productPriceListTransform(arrayData);
    }
    return addressData;
};


