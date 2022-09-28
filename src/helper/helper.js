const bcrypt = require('bcrypt');
const {loginAdmin} = require('../controller/admin/adminController');
const {sendNotification} = require("../helper/pushNotification");
const{
    META_STATUS_0 = 0,
    META_STATUS_1 = 1,
    SUCCESSFUL = 200,
    VALIDATION_ERROR = 400,
    INTERNAL_SERVER_ERROR = 500,
    ACTIVE = 1,
    INACTIVE = 2,
    DELETED = 3,
} = require('../../config/key');

//url link
exports.urlInfo = (name, folderName) => {
    let urlInfo="";
    urlInfo = `localhost:3000/public/${folderName}/${name}`;
    return urlInfo;
};

//success response function
exports.success = (res,message,status,statusCode,data = null,extra) => {
    let success="";
    success = {
       meta:{
            status: status,
            message:message,
           ...extra,
        },
        data: data,
        statusCode:statusCode
    };
    return res.send(success);
};

//error response function
exports.error = (res,statusCode,message) => {
    let error="";
    error = {
        statusCode:statusCode,
        message: message
    };
    return res.status(statusCode).send(error);
};

//facet pagination function
exports.facetHelper = function (skip, limit) {
    return {
        $facet: {
            data: [
                {
                    $skip: Number(skip) < 0 ? 0 : Number(skip) || 0,
                },
                {
                    $limit: Number(limit) < 0 ? 10 : Number(limit) || 10,
                },
            ],
            totalRecords: [
                {
                    $count: "count",
                },
            ],
        },
    };
};

//total count function
exports.countHelper = function () {
    return {
        $project: {
            data: 1,
            totalCount: { $arrayElemAt: ["$totalRecords.count", 0] },
        },
    };
};

//add page and limit pass function
exports.getPageAndLimit= (page, limit) => {
    if (!page) page = 1;
    if (!limit) limit = 10;
    let limitCount = limit * 1;
    let skipCount = (page - 1) * limitCount;
    return {limitCount, skipCount};
};

//convert capital first alphabet
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// validation MessageKey function
exports.validationMessageKey = (apikey,error) =>{
    let type  = error.details[0].type
    let key  = error.details[0].context.key
    type = type.split(".")
    type = capitalizeFirstLetter(type[1])
    type = (type == 'Empty') ? 'Required' : type
    const result =  apikey+type + key
    return result
};

//searching function
exports.searching = function (searchField, fields) {
   let obj = [];
   let search =[];
   search[0] = searchField.trim();
    fields.forEach((object)=>{
        search.forEach((object1)=>{
            obj.push({[object]: { $regex: new RegExp(object1,'i') } })
        })
    });
    return {$match: {$or:obj}};
};



//sub admin function
exports.subAdmin = {
    category:['category','add-category','edit-category'],
    subcategory:['subcategory','add-subcategory','edit-subcategory'],
    product:['product','add-edit-product'],
    user:['user','view-user','add-edit-user'],
    promoCode:['promocode','add-edit-promocode','view-promocode'],
}


//sales admin function
exports.salesAdmin = {
    product:['product','add-edit-product'],
}

//admin seeder
exports.getAdminSeeder = () => {
        let adminArr = [
            {
                adminName:'kishan',
                phone: '9428586684',
                email:'kishan@gmail.com',
                password:bcrypt.hashSync('Kishan@123',10),
                role:'superAdmin',
                status:'1',
            },
            {
                adminName:'saurabh',
                phone: '9998627681',
                email:'saurabh@gmail.com',
                password:bcrypt.hashSync('Saurabh@123',10),
                role:'subAdmin',
                status:'1',
            },
            {
                adminName:'bhavin',
                phone: '9685741235',
                email:'bhavin@gmail.com',
                password:bcrypt.hashSync('Bhavin@123',10),
                role:'salesAdmin',
                status:'1',
            },
        ]
        return adminArr;
};

exports.notification = async (data) => {
    try {
            data2 = data;

            // if (element.deviceToken) await sendNotification([element.deviceToken], data2.title, data2.body);
    } catch (e) {
        return e
    }
}



