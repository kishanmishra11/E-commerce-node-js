const helper = require('../../helper/helper');

let listTransformProductDataUser = (arrayData, language) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.productPriceListTransformUser(a, language));
        });
    }
    arrayData = data;
    return arrayData;
};



exports.productTransformUser = (data,language) => {
    if (language === "guj") {
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
        productDiscount: data?.productDiscount ? data.productDiscount: 0,
        productImage: data?.productImage ? helper.urlInfo(data.productImage,'user'):"",
        status: data?.status ? data.status : 0,
        cartQuantity:  data?.cartQuantity ? data.cartQuantity : 0,
        colorPriceData: data?.colorPrice && data.colorPrice.length > 0 ? listTransformProductDataUser(data.colorPrice): [],
    };
};

exports.productPriceListTransformUser =  (data) => {
    return {
        productPriceListId: data?._id ? data._id: "",
        productId: data?.productId ? data.productId: "",
        price: data?.price ? data.price: 0,
        colorName: data?.colorName ? data.colorName : "",
        discountedPrice: data?.discountedPrice ? data.discountedPrice: 0,
        status: data?.status ? data.status : 0,
        inStock: data?.inStock ? data.inStock :false,
    };
};

exports.productTransformCreateUser = (data,data2) => {
    return {
        productId: data?._id ? data._id: "",
        categoryId: data?.categoryId ? data.categoryId: "",
        subCategoryId: data?.subCategoryId ? data.subCategoryId: "",
        productName: data?.productName ? data.productName: "",
        productDiscount:data2?.productDiscount ? data2.productDiscount: 0,
        productDescription: data?.productDescription ? data.productDescription : "",
        productImage: data?.productImage ? helper.urlInfo(data.productImage,'user'):"",
        status: data?.status ? data.status : 0,
        colorPriceData: data2?.colorPrice && data2.colorPrice.length > 0 ? listTransformProductDataUser(data2.colorPrice): [],
    };
};


exports.productTransformDataUser = (arrayData,arrayData2) => {
    let addressData = null;
    if (arrayData) {
        addressData = this.productTransformCreateUser(arrayData,arrayData2);
    }
    return addressData;
};

exports.listTransformProductDetailsUser = (arrayData, language) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.productTransformUser(a, language));
        });
    }
    arrayData = data;
    return arrayData;
};


