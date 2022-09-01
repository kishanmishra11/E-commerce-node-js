const helper = require('../../helper/helper');

exports.transforCategoryUser = (data, language) => {
    if (language == "guj") {
        data.categoryName = data.categoryNameGuj
        data.categoryDescription = data.categoryDescriptionGuj
    }
    return {
        subCategoryCount: data?.subCategoryCount ? data.subCategoryCount: 0,
        productCount: data?.productCount ? data.productCount: 0,
        categoryId: data?._id ? data._id: "", 
        categoryName: data?.categoryName ? data.categoryName : "",
        categoryDescription: data?.categoryDescription ? data.categoryDescription : "",
        categoryImage: data?.categoryImage ? helper.urlInfo(data.categoryImage,'user'):"",
        status: data?.status ? data.status : 0
    };
};

exports.transformCategoryDetailsUser = (arrayData) => {
    let addressData = null;
    if (arrayData) {
        addressData = this.transforCategoryUser(arrayData);
    }
    return addressData;
};

exports.listTransformCategoryDetailsUser = (arrayData, language) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transforCategoryUser(a, language));
        });
    }
    arrayData = data;
    return arrayData;
};