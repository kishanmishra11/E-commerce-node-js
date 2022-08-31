const express = require('express');
const multer  = require('multer');
const { response } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Category = require('../model/category');
const SubCategory = require('../model/subcategory');
const Product = require('../model/product');
const userInfo = require('../model/users');
const Cart = require("../model/cart");
const transformer = require('../transformer/transformer');
const subTransformer = require('../transformer/subcattransformer');
const productTransformer = require('../transformer/protransformer');
const UserTransformer = require('../transformer/userTransformer');
const CartTransformer = require('../transformer/cartTransformer');
const transformAmtData = require("../transformer/amtDataTransformer");
const subCategoryService = require('../service/adminService/subcatservice');
const productService = require('../service/adminService/productservice');
const categoryService = require('../service/adminService/categoryservice');
const cartlistService = require('../service/userService/cartservice');
const amountService = require('../service/userService/amtDataService');
const { validateSignup } = require("../validation/adminValidation/userValidation");
const { validateCategory } = require("../validation/adminValidation/categoryValidation");
const { validateSubCategory } = require("../validation/adminValidation/subCategoryValidation");
const { validateProduct } = require("../validation/adminValidation/productValidation");
const { validateCart } = require("../validation/userValidation/cartValidation");
const checkUserAuth = require("../middleware/auth");
const helper = require('../helper/helper');
const demoService = require("../service/demoService");
const transformDemoData = require("../transformer/demoTransformer");


exports.createCart =  async(req,res)=>{
    try {
        const {error, value} = validateCart(req.body);
        if (error) {
            console.log(error);
            return helper.error(res,500,error.details[0].message);
        }
        if (req.user._id) {req.body.userId = req.user._id};
        let update = await Cart.findOne({userId: req.body.userId, productId: req.body.productId})
        if(update){
            update.quantity = req.body.quantity
            await update.save();
        } else {
            const cart = new Cart(req.body);
            update = await cart.save();
        }
        const response = CartTransformer.transformCartDetails(update);
        return helper.success(res,1,"cart added successfully..!!!",response,200)
    } catch(e){
        return helper.error(res,500,"something went wrong..!!!");
    }
}



//demo all function

exports.listDemo = async (req,res)=>{
    try{
        const listCart = await cartlistService.cartlistService({userId: req.user._id});
        const demoServiceData =  await demoService.demoService({userId: req.user._id});
        const cartData = CartTransformer.listtransformCartDetails(listCart);
        const demoData = transformDemoData.listDemoDataDetails(demoServiceData);
        return helper.success(res,1,"cart listed successfully..!!!",{cartData,demoData},200)
    }catch(e){
        console.log(e)
        return helper.error(res,500,"something went wrong..!!!");
    }
}