const users = require('../../model/users');
const {facetHelper} = require("../../helper/helper");
const {searching} = require("../../helper/helper");

let ObjectId = require("mongodb").ObjectId

exports.userService= async (data) => {
    try{
        let pipeline = [];
        pipeline.push(

            {
              $match: {
                  status: {$ne: 3}
              }
            },

            {
                $project: {
                    userId: 1,
                    userName:1,
                    phone:1,
                    email:1,
                    profilePicture:1,
                    status:1
                },
            },
        );
        if(data.status){
            pipeline.push(
                {
                    $match: {
                        status: data.status
                    }
                }
            )
        }

        let obj = {};
        let sortBy = data.sortBy ? data.sortBy : 1;
        let sortKey = data.sortKey ? data.sortKey : "userName";
        obj[sortKey] = sortBy;

        if(data.search){
            let arr = ["userName","phone","email","status"]
            pipeline.push(searching(data.search,arr));
        }

        pipeline.push(
            {$sort: obj},
            facetHelper(Number(data.skip), Number(data.limit))
        );



        const result = await users.aggregate(pipeline);
        return result;
    }catch (e) {
        console.log(e);
        return false;
    }
}