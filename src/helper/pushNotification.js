const admin = require("firebase-admin");
const serviceAccount = require("../../config/firebaseKey.json");

//push notification
admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
});

// module.exports.sendNotification = async (registrationToken, title, body) => {
//     let message = {
//         notification: {
//             title: title,
//             body: body
//         },
//         data: {
//             id:"fdx"
//             // notificationId: data[0].notificationId.toString(),
//             // userId: data[0].userId.toString(),
//             // orderId: data[0].orderId.toString(),
//             // message: data[0].message,
//             // isRead: data[0].isRead.toString(),
//         }
//     };
//     for (let i = 0; i < registrationToken.length; i++) {
//         admin.messaging()
//             .sendToDevice(registrationToken[i], message)
//             .then((response) => {
//                 //console.log(registrationToken[i]);
//                 //console.log(response.results);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }
// };


module.exports.sendNotification = async (registrationToken, title, body,data) => {
    const notification_options = {
        priority: "high",
        timeToLive: 60 * 60 * 24,
    };
    var dataBody = {
        clickAction: "chatNotification",
        userId: "123",
        userName: "Bhavin",
        notification_type: "chatNotification",
    };
    const message = {
        notification: {
            title: title,
            body: body,
            data:"data",
        },
        // data:{
        //     userId:data[0].userId,
        //     orderId:data[0].orderId,
        //     isRead:false,
        //     title: "Order Confirmation",
        //     body: "Your Order is Confirmed",
        // },
    };
        admin
            .messaging()
            .sendToDevice(registrationToken,message, notification_options)
            .then((response) => {
                console.log(response.results);
            })
            .catch((error) => {
                console.log(error);
            });
};

// /****************FOR TESTING ONLY**************/
// module.exports.sendNotificationTest = function (
//     title,
//     body,
//     extraBodybj
// ) {
//     const registrationToken =
//         "ePBqq9bCm1Ff8uAlAMoWlf:APA91bHrypYO0a4rjD5mEAWYo5x-I3LKq3yBHj_gUAFus6K-9-eXHtu4sYp_KJ72sA3w9AZjLIRWW333SaIJZNJilBgei4xTKmZLaRejojKd2Gkb2DKAGPU1DT3h2lOB2rAW2qldHVZa";
//     const notification_options = {
//         priority: "high",
//         timeToLive: 60 * 60 * 24,
//     };
//     var dataBody = {
//         clickAction: "chatNotification",
//         userId: "123",
//         userName: "DhruvuserNAmeinData",
//         notification_type: "chatNotification",
//     };
//     const message = {
//         notification: {
//             title: "This is test title",
//             body: "This is test body.",
//             data: "", //use dataBody if required.
//         },
//     };
//     admin
//         .messaging()
//         .sendToDevice(registrationToken, message, notification_options)
//         .then((response) => {
//             console.log("**************SUCCESS**************");
//             console.log(response.results);
//             console.log("**************SUCCESS**************");
//         })
//         .catch((error) => {
//             console.log("**************FAILED**************");
//             console.log(error);
//             console.log("**************FAILED**************");
//         });
// };
