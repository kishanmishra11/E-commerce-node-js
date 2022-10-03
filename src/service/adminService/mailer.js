"use strict";
const nodemailer = require("nodemailer");

exports.sendMail = (email,emailBody,text,subject) => {
    let testAccount = nodemailer.createTestAccount();
    // let transport = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         user: "freedemomail123@gmail.com",
    //         pass: "xstzjazholwiitfv"
    //     }
    // });

    let transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "fc3b4ffb152617",
            pass: "2cc61408fee91c"
        }
    });
    let info = transport.sendMail({
        from: 'freedemomail123@gmail.com', // sender address
        to:email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: emailBody, // html body
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
