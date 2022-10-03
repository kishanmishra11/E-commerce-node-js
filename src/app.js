const express = require("express");
const app = express()
const http = require('http').createServer(app)
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const cors = require('cors')
const connection = require("./db/conn");
const {PORT} = require("../config/key")
const port = PORT;
const path = require('path');
const publicDirectory = path.join(__dirname,"../");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const i18n = require('./i18n/i18n');
const nodemailer = require("nodemailer");
const mailer = require('./service/adminService/mailer');
const demorouter = require("./routes/demoroute");

http.listen(port, ()=>{
    console.log(`connection is established on port number ${PORT}`);
})

const io = require('socket.io')(http)

io.on('connection', (socket) => {
    // console.log('Connected...')
    socket.on('message', (msg) => {
        console.log(msg)
        socket.broadcast.emit('message', msg)
    })

})

const qr = require('qrcode');
const fs = require('fs')
let data = `www.youtube.com`

let strData = JSON.stringify(data)

qr.toString(strData, {type:'terminal'},
    function (err, code) {
        if(err) return console.log("error occurred")
    });

qr.toDataURL(strData, function (err, code) {
    if(err) return console.log("error occurred")
    var base64Data = code.replace(/^data:image\/png;base64,/, "");
    fs.writeFile("web.png", base64Data, 'base64', function(err) {
        if(err){console.log(err);}
    });
})






app.set('views', path.join(__dirname, 'views'));


app.set("view engine", "ejs");

app.use(express.json());
app.use(cors({ origin: '*' }));
app.options('*', cors()) // include before other routes
app.use(i18n)
app.use(demorouter);
app.use(express.static(publicDirectory));
app.use(bodyParser.json())

app.get('/views/success', (req, res) => {
    res.render('success')
})

app.get('/', (req ,res) => {
    res.sendFile(__dirname+ '/index.html')
})

const adminRouter = require('../../api2/src/routes/admin/adminRoute');
app.use("/admin/admin",adminRouter);

const categoryRouter = require('../../api2/src/routes/admin/categoryRoute');
app.use("/admin/category",categoryRouter);

const subCategoryRouter = require('../../api2/src/routes/admin/subCategoryRoute');
app.use("/admin/subcategory",subCategoryRouter);

const productRouter = require('../../api2/src/routes/admin/productRoute');
app.use("/admin/product",productRouter);

const userRouter = require('../../api2/src/routes/admin/userRoute');
app.use("/admin/user",userRouter);

const promoCodeRouter = require('../../api2/src/routes/admin/promoCodeRoute');
app.use("/admin/promoCode",promoCodeRouter);

const orderAdminRouter = require('../../api2/src/routes/admin/orderRoute');
app.use("/admin/order",orderAdminRouter);


const deliveryChargeRouter = require('../../api2/src/routes/admin/deliveryChargeRoute');
app.use("/admin/deliveryCharge",deliveryChargeRouter);


const ratingRouterAdmin = require('../../api2/src/routes/admin/ratingRoute');
app.use("/admin/rating",ratingRouterAdmin);

const cartRouter = require('../../api2/src/routes/api/v1/cartRoute');
app.use("/api/v1/cart",cartRouter);

const userAuthRouter = require('../../api2/src/routes/api/v1/userAuthRoute');
app.use("/api/v1/user",userAuthRouter);

const addressRouter = require('./routes/api/v1/addressRoute');
app.use("/api/v1/address",addressRouter);

const applyPromoCodeRouter = require('./routes/api/v1/applyPromoCodeRoute');
app.use("/api/v1/applyPromoCode",applyPromoCodeRouter);

const orderRouter = require('./routes/api/v1/orderRoute');
app.use("/api/v1/order",orderRouter);

const categoryUserRouter = require('./routes/api/v1/categoryRoute');
app.use("/api/v1/category",categoryUserRouter);

const subCategoryUserRouter = require('./routes/api/v1/subcategoryRoute');
app.use("/api/v1/subcategory",subCategoryUserRouter);

const productUserRouter = require('./routes/api/v1/productRoute');
app.use("/api/v1/product",productUserRouter);

const ratingRouter = require('./routes/api/v1/ratingRoute');
app.use("/api/v1/rating",ratingRouter);