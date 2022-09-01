const express = require("express");
const cors = require('cors')
require("./db/conn");
const {PORT} = require("../config/key")
const app = express();
const port = PORT;
const path = require('path');
const publicDirectory = path.join(__dirname,"../");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const i18n = require('./i18n/i18n');
const nodemailer = require("nodemailer");
const mailer = require('./service/adminService/mailer');
const demorouter = require("./routes/demoroute");



app.listen(port, ()=>{
    console.log(`connection is established on port number ${PORT}`);
})

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");


app.use(express.json());
app.use(cors({ origin: '*' }));
app.options('*', cors()) // include before other routes
app.use(i18n)
app.use(demorouter);
app.use(express.static(publicDirectory));


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