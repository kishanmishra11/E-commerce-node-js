const helper = require('../../helper/helper');

exports.transformAdmin = (data) => {

    return {
        adminId: data?._id ? data._id: "",
        adminName: data?.adminName ? data.adminName : "",
        phone: data?.phone ? data.phone : "",
        email: data?.email ? data.email : "",
        role: data.role ? data.role: 0,
        status: data?.status ? data.status : 0
    };
};

exports.transformAdminDetails = (arrayData) => {
    let AdminData = null;
    if (arrayData) {
        AdminData = this.transformAdmin(arrayData);
    }
    return AdminData;
};

exports.listtransformAdminDetails = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transformAdmin(a));
        });
    }
    arrayData = data;
    return arrayData;
};