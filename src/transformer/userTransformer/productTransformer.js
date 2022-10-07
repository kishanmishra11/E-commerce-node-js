const helper = require('../../helper/helper');
const ratingTransformer = require("../userTransformer/ratingTransformer")
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

let listTransformOffer = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.offerListTransform(a));
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
        viewCount:data?.viewCount ? data.viewCount : 0,
        cartQuantity:  data?.cartQuantity ? data.cartQuantity : 0,
        colorPriceData: data?.colorPrice && data.colorPrice.length > 0 ? listTransformProductDataUser(data.colorPrice): [],
        offerData: data?.offerData && data.offerData.length > 0 ? listTransformOffer(data.offerData): [],
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
        isSmallest: data?.isSmallest ? data.isSmallest :false,
    };
};

exports.productTransformCreateUser = (data) => {
    return {
        productId: data?._id ? data._id: "",
        categoryId: data?.categoryId ? data.categoryId: "",
        subCategoryId: data?.subCategoryId ? data.subCategoryId: "",
        productName: data?.productName ? data.productName: "",
        productDiscount:data?.productDiscount ? data.productDiscount: 0,
        productDescription: data?.productDescription ? data.productDescription : "",
        productImage: data?.productImage ? helper.urlInfo(data.productImage,'user'):"",
        viewCount:data?.viewCount ? data.viewCount : 0,
        status: data?.status ? data.status : 0,
        colorPriceData: data?.colorPrice && data.colorPrice.length > 0 ? listTransformProductDataUser(data.colorPrice): [],
    };
};


exports.productTransformDataUser = (arrayData) => {
    let addressData = null;
    if (arrayData) {
        addressData = this.productTransformCreateUser(arrayData);
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


exports.reviewTransformer = (data) => {
    return {
        productId: data?._id ? data._id: "",
        productName: data?.productName ? data.productName: "",
        productImage: data?.productImage ? helper.urlInfo(data.productImage,'user'):"",
        ratingCount: data?.ratingCount ? data.ratingCount : 0,
        rating:  data?.rating ? data.rating : 0,
        ratingData: data?.ratingData && data.ratingData.length > 0 ? ratingTransformer.transformRatingData(data.ratingData): [],
    };
};

exports.reviewproductTransformDataUser = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.reviewTransformer(a));
        });
    }
    arrayData = data[0];
    return arrayData;
};

exports.offerListTransform =  (data) => {
    return {
        offerId: data?._id ? data._id: 0,
        categoryId:data?.categoryId ? data.categoryId:0,
        productId: data?.productId ? data.productId : 0,
        title: data?.title ? data.title : 0,
        description: data?.description ? data.description : 0,
        amountType: data?.amountType ? data.amountType :0,
        amount: data?.amount ? data.amount :0,
        offerType: data?.offerType ? data.offerType : 0,
        startDate: data?.startDate ? data.startDate :0,
        endDate: data?.endDate ? data.endDate :0,
        status: data?.status ? data.status : 0
    };
};