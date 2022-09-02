// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const Category = require('../model/category');
// const SubCategory = require('../model/subcategory');
// const Product = require('../model/product');
// const userInfo = require('../model/users');
// const Cart = require("../model/cart");
// const adminInfo = require("../model/admin");
// const transformer = require('../transformer/transformer');
// const subTransformer = require('../transformer/subcattransformer');
// const productTransformer = require('../transformer/protransformer');
// const UserTransformer = require('../transformer/userTransformer');
// const AdminTransformer = require('../transformer/adminTransformer');
// const CartTransformer = require('../transformer/cartTransformer');
// const transformAmtData = require("../transformer/amtDataTransformer");
// const subCategoryService = require('../service/subcatservice');
// const productService = require('../service/productservice');
// const categoryService = require('../service/categoryservice');
// const cartlistService = require('../service/cartservice');
// const amountService = require('../service/amtDataService');
// const userService = require('../service/userService');
// const { userValidation } = require("../validation/userValidation");
// const {categoryValidation}   = require("../validation/categoryValidation");
// const { subCategoryValidation } = require("../validation/subCategoryValidation");
// const { productValidation } = require("../validation/productValidation");
// const { cartValidation } = require("../validation/cartValidation");
// const { adminValidation } = require("../validation/adminValidation");
// const helper = require("../helper/helper");
//
//
//
// //check server
// exports.getData=async function(req,res){
//     res.send("Hello... Welcome to E-Commerce API");
// }
//
// //Add category
// exports.createCategory =  async(req,res)=>{
//     try{
//         //set language
//         const lang = req.header('language');
//         if(lang) {req.setLocale(lang)}
//         //joi validation
//         const validationMessage  = await categoryValidation(req.body);
//         if(validationMessage) {
//             return helper.error(res, 400, res.__(validationMessage));
//         }
//         //categoryImage
//         if (req.file && req.file.filename) {req.body.categoryImage = req.file.filename; }
//         //create new category
//         const category = new Category(req.body);
//         const categoryExists = await Category.findOne({categoryName : req.body.categoryName});
//         if(categoryExists){ return helper.success(res,res.__("categoryAlreadyExists"),0,200,);}
//         const createCategory = await category.save();
//         const response = transformer.transformAddressDetails(createCategory)
//         return helper.success(res,res.__("categoryAddedSuccessfully"),1,200,response);
//     } catch(e){
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }
//
// //List Category
// exports.listCategory = async (req,res)=>{
//     try{
//         //set language
//         const lang = req.header('language')
//         if(lang) {req.setLocale(lang)}
//
//         //pagination
//         let reqParam = req.body;
//         const{limitCount,skipCount} = helper.getPageAndLimit(reqParam.page,reqParam.limit);
//         const [categoryService2] = await categoryService.categoryService({skip: skipCount, limit: limitCount,sortBy:reqParam.sortBy,sortKey:reqParam.sortKey, search:reqParam.search})
//         const responseData = categoryService2 &&  categoryService2.data ? categoryService2.data : [];
//         const totalCount =(categoryService2, categoryService2.totalRecords &&  categoryService2.totalRecords[0] &&  categoryService2.totalRecords[0].count);
//         const response = transformer.listtransformAddressDetails(responseData, lang)
//         return helper.success(res,res.__("categoryListedSuccessfully"),1,200,response,{"totalCount":totalCount});
//     }catch(e){
//         console.log(e)
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }
//
// //Add subCategory
// exports.createSubCategory =  async(req,res)=>{
//     try{
//         //set language
//         const lang = req.header('language')
//         if(lang) {req.setLocale(lang)}
//         //joi validation
//         const validationMessage  = await subCategoryValidation(req.body);
//         if(validationMessage) {
//             return helper.error(res, 400, res.__(validationMessage));
//         }
//         //add subCategory Image
//         if (req.file && req.file.filename) {req.body.subCategoryImage = req.file.filename; }
//         const subCategory = new SubCategory(req.body);
//         const subCategoryExists = await SubCategory.findOne({subCategoryName : req.body.subCategoryName});
//         if(subCategoryExists){ return helper.success(res,res.__("subCategoryAlreadyExists"),0,200,);}
//
//         const createSubCategory = await subCategory.save();
//         const response = await subTransformer.subtransformAddressDetails(createSubCategory);
//         return helper.success(res,res.__("subCategoryAddedSuccessfully"),1,200,response)
//     } catch(e){
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }
//
// //List subCategory
// exports.listSubCategory = async (req,res)=>{
//     try{
//         //set language
//         const lang = req.header('language')
//         if(lang) {req.setLocale(lang)}
//         //pagination
//         let reqParam = req.body;
//         const{limitCount,skipCount} = helper.getPageAndLimit(reqParam.page,reqParam.limit);
//         const [subCategoryService2] = await subCategoryService.sublistService({skip: skipCount, limit: limitCount,sortBy:reqParam.sortBy,sortKey:reqParam.sortKey,search:reqParam.search})
//         const responseData = subCategoryService2 &&  subCategoryService2.data ? subCategoryService2.data : [];
//         const totalCount =(subCategoryService2, subCategoryService2.totalRecords &&  subCategoryService2.totalRecords[0] &&  subCategoryService2.totalRecords[0].count);
//         const response = subTransformer.sublisttransformAddressDetails(responseData, lang)
//         return helper.success(res,res.__("subCategoryListedSuccessfully"),1,200,response,{"totalCount":totalCount})
//     }catch(e){
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }
//
// //Add Product
// exports.createProduct =  async(req,res)=>{
//     try{
//         //set language
//         const lang = req.header('language')
//         if(lang) {req.setLocale(lang)}
//         //joi validation
//         const validationMessage  = await productValidation(req.body);
//         if(validationMessage) {
//             return helper.error(res, 400, res.__(validationMessage));
//         }
//         if (req.file && req.file.filename) {req.body.productImage = req.file.filename; }
//         const product = new Product(req.body);
//         const productExists = await Product.findOne({productName : req.body.productName});
//         if(productExists){ return helper.success(res,res.__("productAlreadyExists"),0,200,);}
//         let createProduct = await product.save();
//         let discount = {discountedPrice : req.body.productPrice - (req.body.productPrice * req.body.productDiscount/100)};
//         let createProduct2 = Object.assign(createProduct,discount);
//         const response = await  productTransformer.producttransformAddressDetails(createProduct2);
//         return helper.success(res,res.__("productAddedSuccessfully"),1,200,response);
//     } catch(e){
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }
//
// //List Product
// exports.listProduct = async (req,res)=>{
//     try{
//         //set language
//         const lang = req.header('language')
//         if(lang) {req.setLocale(lang)}
//         //pagination
//         let reqParam = req.body;
//         const{limitCount,skipCount} = helper.getPageAndLimit(reqParam.page,reqParam.limit);
//         const [productService2] = await productService.productlistService({skip: skipCount, limit: limitCount,sortBy:reqParam.sortBy,sortKey:reqParam.sortKey,search:reqParam.search})
//         const responseData = productService2 &&  productService2.data ? productService2.data : [];
//         const totalCount =(productService2, productService2.totalRecords &&  productService2.totalRecords[0] &&  productService2.totalRecords[0].count);
//         const response = productTransformer.productlisttransformAddressDetails(responseData,lang)
//         return helper.success(res,res.__("productListedSuccessfully"),1,200,response,{"totalCount":totalCount});
//     }catch(e){
//         console.log(e)
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }
//
// //Add User
// exports.signUp =  async(req,res)=>{
//     try{
//         //set language
//         const lang = req.header('language')
//         if(lang) {req.setLocale(lang)}
//         //joi validation
//         const validationMessage  = await userValidation(req.body);
//         if(validationMessage) {
//         return helper.error(res, 400, res.__(validationMessage));
//         }const userName = await userInfo.findOne({userName: req.body.userName});
//         if(userName) return helper.success(res,res.__("userNameAlreadyExists"),0,200,);
//         const userData = await userInfo.findOne({email: req.body.email});
//         if(userData) return helper.success(res,res.__("emailAlreadyExists"),0,200,);
//         const userPhone = await userInfo.findOne({phone: req.body.phone});
//         if(userPhone) return helper.success(res,res.__("phoneAlreadyExists"),0,200,);
//         //add profile picture
//         if (req.file && req.file.filename) {req.body.profilePicture = req.file.filename; }
//         //bcrypt
//         req.body.password = await bcrypt.hashSync(req.body.password,10);
//         const user = new userInfo(req.body)
//         const createUser = await user.save();
//         const response = await UserTransformer.transformUserDetails(createUser)
//         return helper.success(res,res.__("userAddedSuccessfully"),1,200,response);
//     } catch(e){
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }
//
// //list User
// exports.listUser = async (req,res)=>{
//     try{
//         //set language
//         const lang = req.header('language')
//         if(lang) {req.setLocale(lang)}
//         //pagination
//         let reqParam = req.body;
//         const{limitCount,skipCount} = helper.getPageAndLimit(reqParam.page,reqParam.limit);
//         const [userService2] = await userService.userService({skip: skipCount, limit: limitCount,sortBy:reqParam.sortBy,sortKey:reqParam.sortKey,search:reqParam.search})
//         const responseData = userService2 &&  userService2.data ? userService2.data : [];
//         const totalCount =(userService2, userService2.totalRecords &&  userService2.totalRecords[0] &&  userService2.totalRecords[0].count);
//         const response = UserTransformer.listtransformUserDetails(responseData,lang)
//         return helper.success(res,res.__("userListedSuccessfully"),1,200,response,{"totalCount":totalCount});
//     }catch(e){
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }
//
// //login User
// exports.login = async (req, res) => {
//     try {
//         //set language
//         const lang = req.header('language')
//         if(lang) {req.setLocale(lang)}
//         const existingUser = await userInfo.findOne({email: req.body.email});
//         if (!existingUser) {
//             return helper.error(res,400,res.__("pleaseEnterCorrectEmailAndPassword"))
//         }
//         const validPassword = await bcrypt.compare(req.body.password, existingUser.password);
//         if (!validPassword) {
//             return helper.error(res,400, res.__("pleaseEnterCorrectEmailAndPassword"))
//         }
//         const tokenData = {
//             _id: existingUser._id,
//             userName: existingUser.userName,
//             email: existingUser.email,
//             phone: existingUser.phone,
//         }
//         const token = jwt.sign(tokenData, "mynameiskishan", {expiresIn: '24h'});
//         const response = UserTransformer.transformUserDetails(existingUser)
//         return helper.success(res,res.__("signInSuccessfully"),1, 200,response,{"token": token})
//     } catch (e) {
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }
//
// //add to cart
// exports.createCart =  async(req,res)=>{
//     try {
//         //set language
//         const lang = req.header('language')
//         if(lang) {req.setLocale(lang)}
//         //joi validation
//         const validationMessage  = await cartValidation(req.body);
//         if(validationMessage) {
//             return helper.error(res, 400, res.__(validationMessage));
//         }
//         if (req.user._id) {req.body.userId = req.user._id};
//         let update = await Cart.findOne({userId: req.body.userId, productId: req.body.productId})
//         if(update){
//             update.quantity = req.body.quantity
//             await update.save();
//         } else {
//                 const cart = new Cart(req.body);
//              update = await cart.save();
//         }
//         const response = CartTransformer.transformCartDetails(update);
//         return helper.success(res,res.__("cartAddedSuccessfully"),1,200,response)
//     } catch(e){
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }
//
// //list cart
// exports.listCart = async (req,res)=>{
//     try{
//         //set language
//         let reqParam = req.body;
//         const lang = req.header('language')
//         if(lang) {req.setLocale(lang)}
//         const listCart = await cartlistService.cartlistService({userId: req.user._id,sortBy:reqParam.sortBy,sortKey:reqParam.sortKey});
//         const amtDataServiceData =  await amountService.amtDataService({userId: req.user._id});
//         const cartData = CartTransformer.listtransformCartDetails(listCart);
//         const amountData = transformAmtData.listAmtDataDetails(amtDataServiceData);
//         return helper.success(res,res.__("cartListedSuccessfully"),1,200,{cartData,amountData})
//     }catch(e){
//         console.log(e)
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }
//
// //login Admin
// exports.loginAdmin = async (req, res) => {
//     try {
//         const existingAdmin = await adminInfo.findOne({email: req.body.email});
//         if (!existingAdmin) {
//             return helper.error(res,400,res.__("pleaseEnterCorrectEmailAndPassword"))
//         }
//         const validPassword = await bcrypt.compare(req.body.password, existingAdmin.password);
//         if (!validPassword) {
//             return helper.error(res,400, res.__("pleaseEnterCorrectEmailAndPassword"))
//         }
//         const tokenData = {
//             _id: existingAdmin._id,
//             adminName: existingAdmin.adminName,
//             email: existingAdmin.email,
//             phone: existingAdmin.phone,
//         }
//         const token = jwt.sign(tokenData, "mynameiskishan", {expiresIn: '24h'});
//         const response = AdminTransformer.transformAdminDetails(existingAdmin)
//         return helper.success(res,res.__("signInSuccessfully"),1, 200,response,{"token": token})
//     } catch (e) {
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }
//
// //edit User
// exports.editUser = async (req,res) => {
//     try{
//         let reqParam = req.body;
//         let existingUser = await userInfo.findOne({_id: reqParam.userId, status: {$ne: 3}});
//         if(!existingUser) return helper.success(res, res.__("userNotFound"), 0, 200);
//         existingUser.status = req.body.status
//         await existingUser.save();
//         const response = UserTransformer.transformUserDetails(existingUser);
//         return helper.success(res,res.__("userUpdatedSuccessfully"),1,200,response)
//     } catch(e){
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }

// //Add Product
exports.addEditProduct =  async(req,res)=>{
    try{
        //set language
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}
        //joi validation
        const validationMessage  = await productValidation(req.body);
        if(validationMessage) {
            return helper.error(res, 400, res.__(validationMessage));
        }
        if (req.file && req.file.filename) {req.body.productImage = req.file.filename }
        const product = new Product(req.body);
        const productExists = await Product.findOne({productName : req.body.productName});
        if(productExists){ return helper.success(res,res.__("productAlreadyExists"),0,200,);}
        let createProduct = await product.save();
        let discount = {discountedPrice : req.body.productPrice - (req.body.productPrice * req.body.productDiscount/100)};
        let createProduct2 = Object.assign(createProduct,discount);
        const response = await  productTransformerAdmin.producttransformAddressDetails(createProduct2);
        return helper.success(res,res.__("productAddedSuccessfully"),1,200,response);
    } catch(e){
        return helper.error(res,500,res.__("somethingWentWrong"));
    }
}