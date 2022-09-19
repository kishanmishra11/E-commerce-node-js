const helper = require("../../../helper/helper");
const Publishable_Key = 'pk_test_51LiDWLSJgMWUxuhUEkI6HWj72SFB8pdShGGrfuMQfBWgOavU9KaAmrfhUHVsX5ITaapmBTg8ZkNBh2fdx9DEtae200VcFj2wjo'
const Secret_Key = 'sk_test_51LiDWLSJgMWUxuhUKRvees1Muyoilrq0jJ3ju0EeXzWJYYT4keP87o6wyJJQ9SMe9cdsVhXfJ3hEDfc5E9x3wFaO00ShJ1y5ds'
const order = require("../../../model/order");
const userInfo = require("../../../model/users");
const subOrder = require("../../../model/subOrder");
const productModel = require("../../../model/product");
const Stripe = require('stripe');
const stripe = Stripe(Secret_Key);
const{
    META_STATUS_0 = 0,
    META_STATUS_1 = 1,
    SUCCESSFUL = 200,
    VALIDATION_ERROR = 400,
    INTERNAL_SERVER_ERROR = 500,
    ACTIVE = 1,
    INACTIVE = 2,
    DELETED = 3,
} = require('../../../../config/key');


// exports.payment = async (req,res)=> {
//     try {
//         const existingOrder = await order.findOne({_id: req.body.orderId});
//
//         const tokenObject = await stripe.tokens.create({
//             card: {
//                 number: req.body.number,
//                 exp_month: req.body.month,
//                 exp_year: req.body.year,
//                 cvc: req.body.cvc,
//             },
//         });
//         console.log("tokenObject", tokenObject)
//         const token = tokenObject.id;
//         console.log("token", token);
//         // Moreover you can take more details from user
//         // like Address, Name, etc from form
//
//         const user = await userInfo.findOne({_id: existingOrder.userId});
//         await stripe.customers.create({ //Create customer
//             email: user.email,
//             source: token,
//             name: user.userName,
//             phone:user.phone,
//             address: {
//                 line1: 'TC 9/4 Old MES colony',
//                 postal_code: '452331',
//                 city: 'Indore',
//                 state: 'Madhya Pradesh',
//                 country: 'India',
//             }
//         })
//             .then(async (customer) => {
//                 console.log("customer", customer)
//
//
//                 const payment = await stripe.paymentIntents.create({ //Create charges
//                     amount: existingOrder.finalAmount,
//                     payment_method_types: ['card'],
//                     description: 'demo Payment',
//                     currency: 'inr',
//                     customer: customer.id,
//                 })
//
//                 console.log("payment",payment)
//
//                 const paymentIntent = await stripe.paymentIntents.confirm(
//                     payment.id,
//                 {payment_method: 'pm_card_visa'}
//             )
//                 console.log("paymentIntent",paymentIntent)
//
//                 if(paymentIntent.status === true){
//                     existingOrder.paymentStatus = true
//                 }
//                 const invoice = await stripe.invoices.create({
//                     customer: customer.id,
//                 });
//                 console.log("invoice",invoice)
//             })
//
//             .then((charge) => {
//                 console.log("charge",charge)
//                 return  res.send("Success")  // If no error occurs
//             })
//             .catch((err) => {
//                 console.log(err);
//                 res.send(err)       // If some error occurs
//             });
//     }
//     catch(err){
//         console.log(err);
//         res.send(err)
//     }
// }
exports.payment = async (req,res)=> {
    try{
        //create product
        const existingOrder = await order.findOne({_id: req.body.orderId});
        const user = await userInfo.findOne({_id: existingOrder.userId});
        const subOrderInfo = await subOrder.findOne({orderId: req.body.orderId});
        console.log("subOrder",subOrderInfo)
        const productInfo = await productModel.findOne({_id: subOrderInfo.productId});
        console.log("productInfo",productInfo)

        const product = await stripe.products.create({
            name: productInfo.productName,
        });
        console.log("product",product)

        //create price
        const price = await stripe.prices.create({
            unit_amount: existingOrder.finalAmount,
            currency: 'inr',
            product: product.id,

        });
        console.log("price",price)

        //create session

        const session = await stripe.checkout.sessions.create({
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
            customer_email:user.email,
            line_items: [
                {price: price.id, quantity: 100},
            ],
            mode: 'payment',



        }).then((session) => {
            // res.status().send("session",session.url)
            return helper.success(res,res.__("successful"),META_STATUS_1,200,session.url)
        })
        // console.log("session",session)
    }
    catch(e){
        console.log(e)
        return res.send(e);
    }
}


