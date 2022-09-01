const helper = require('../../helper/helper');

exports.subTransformUser = (data,language) => {
    if (language == "guj") {
        data.categoryName = data.categoryNameGuj
        data.subCategoryName = data.subCategoryNameGuj
        data.subCategoryDescription = data.subCategoryDescriptionGuj
    }
    return {
        productCount: data?.productCount ? data.productCount: 0,
        categoryId: data?.categoryId ? data.categoryId: "",
        categoryName:data?.categoryName ? data.categoryName: "",
        subCategoryId: data?._id ? data._id: "",
        subCategoryName: data?.subCategoryName ? data.subCategoryName : "",
        subCategoryDescription: data?.subCategoryDescription ? data.subCategoryDescription : "",
        subCategoryImage: data?.subCategoryImage ? helper.urlInfo(data.subCategoryImage,'user'):"",
        status: data?.status ? data.status : 0
    };
};

exports.subCategoryTransformUser = (data) => {
    return {
        categoryId: data?.categoryId ? data.categoryId: "",
        subCategoryId: data?._id ? data._id: "",
        subCategoryName: data?.subCategoryName ? data.subCategoryName : "",
        subCategoryNameGuj: data?.subCategoryNameGuj ? data.subCategoryNameGuj : "",
        subCategoryDescription: data?.subCategoryDescription ? data.subCategoryDescription : "",
        subCategoryDescriptionGuj: data?.subCategoryDescriptionGuj ? data.subCategoryDescriptionGuj : "",
        subCategoryImage: data?.subCategoryImage ? helper.urlInfo(data.subCategoryImage,'user'):"",
        status: data?.status ? data.status : 0
    };
};

exports.subCategoryTransformDetailsUser = (arrayData) => {
    let addressData = null;

    if (arrayData) {
        addressData = this.subCategoryTransformUser(arrayData);
    }
    return addressData;
};

exports.subCategoryListTransformDetailsUser = (arrayData,language) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.subTransformUser(a,language));
        });
    }
    arrayData = data;
    return arrayData;
};