const Address = require('../../model/address');
const {facetHelper} = require("../../helper/helper");
const {searching} = require("../../helper/helper");
let ObjectId = require("mongodb").ObjectId

exports.addressService= async (data) => {
    try{
        let pipeline = [];
        pipeline.push(
            {
                $match: {
                    userId: ObjectId(data.userId)
                }
            },
            {
                $match: {
                    status: {$ne: 3}
                }
            },

            {
                $lookup: {
                    from: "city",
                    localField: "cityId",
                    foreignField: "_id",
                    as: "cityData",
                },
            },

            {
                $project: {
                    addressId:"$addressId",
                    userId:1,
                    userName:1,
                    phone:1,
                    email:1,
                    cityId:"$cityId",
                    cityName:{ $arrayElemAt: [ "$cityData.cityName", 0] },
                    houseNo:1,
                    status:1
                }
            },
        );
        if(data.search){
            let arr = ["userName","phone","cityName","email","houseNo"]
            pipeline.push(searching(data.search,arr));
        }

        if(data.status){
            pipeline.push(
                {
                    $match: {
                        status: data.status
                    }
                }
            )
        };

        let obj = {};
        let sortBy = data.sortBy ? data.sortBy : 1;
        let sortKey = data.sortKey ? data.sortKey : "cityName";
        obj[sortKey] = sortBy;


        pipeline.push(
            {$sort: obj},
            facetHelper(Number(data.skip), Number(data.limit))
        );



        const result = await Address.aggregate(pipeline);
        return result;
    }catch (e) {
        console.log(e);
        return false;
    }
}