"use strict";
const nodemailer = require("nodemailer");

exports.sendMail = (email,emailBody,subject) => {
    let testAccount = nodemailer.createTestAccount();
    let transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "freedemomail123@gmail.com",
            pass: "xstzjazholwiitfv"
        }
    });
    let info = transport.sendMail({
        from: 'freedemomail123@gmail.com', // sender address
        to:email, // list of receivers
        subject: subject, // Subject line
        text: "How are you", // plain text body
        html: emailBody, // html body
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
