const Admin = require("../model/admin");
const adminPermission = require("../model/adminPermission")
const helper = require("../helper/helper");

module.exports = {
    run: () =>
        new Promise((resolve) => {
            (async () => {
                let subAdminRoll = [];
                let salesAdminRoll = [];
                let adminData = {};
                subAdminRoll.push(helper.subAdmin);
                salesAdminRoll.push(helper.salesAdmin);
                let admin = helper.getAdminSeeder();
                const user = await Admin.insertMany(admin);
                for (userData of user){
                    if (userData.role === 'subAdmin') {
                    for (const [key, value] of Object.entries(subAdminRoll)) {
                        for (const [key1, value1] of Object.entries(value)) {
                                    adminData.adminId = userData._id
                                    adminData.module = key1
                                    adminData.route = value1
                                    const main = new adminPermission(adminData)
                                    main.save();
                                }
                            }
                        }
                    if (userData.role === 'salesAdmin') {
                        for (const [key, value] of Object.entries(salesAdminRoll)) {
                            for (const [key1, value1] of Object.entries(value)){
                                adminData.adminId = userData._id
                                adminData.module = key1
                                adminData.route = value1
                                const main = new adminPermission(adminData)
                                main.save();
                            }
                        }
                    }
                    }
                resolve(true);
            })();
        }),
};
