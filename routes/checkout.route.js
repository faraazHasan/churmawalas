const express = require("express");
const router = express.Router();
let {products,orderConfirm,varify} = require("../controllers/app.controller");
const cookieParser = require("cookie-parser");
let totalAmount = 0;
router.get("/cart",(req,res)=>{
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.cookie("url",fullUrl)
        let total_price = 0 //cart items total price
        let cart = [] // cart items list in cookies
        try{
            if(products.length != 0){ // check if local cart item list is not empty
                let product_cookies = JSON.stringify(req.cookies) // products list from cookies
                let product_cookies_json = JSON.parse(product_cookies) 
                cart = product_cookies_json.Products // cart items list in cookies
                cart.forEach(element => {
                    let price = element.price
                    let quantity = element.qty
                    total_price = price * quantity + total_price // calculate total price of cart items
                });
                
            }
            else{
                
                total_items = 0
                total_price = 0
                cart = []
            }
        }
        catch(TypeError){
            total_items = 0
            total_price = 0
            cart = []
        }
        finally{
            totalAmount = total_price
            res.render("cart",{title:"Checkout",cart:cart,total_price:total_price})
        }
        // res.redirect("/login")
   
})


router.get("/create/orderId",(req,res)=>{
    const amount = totalAmount
    console.log(req.user)
    if(req.user != undefined){ 
            if(amount != 0){
                res.render("create-order",{title:"creat order",amount:amount})
            }
            else{
                res.redirect("/")
            }     
    }
    else{
        res.redirect("/login")
    }
   
})

router.post("/create/orderId",orderConfirm)

router.post("/api/payment/verify",(req,res)=>{

    let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
   
     var crypto = require("crypto");
     var expectedSignature = crypto.createHmac('sha256', 'VfcXOdbkWGwCNOY8ZpsTT6M6')
                                     .update(body.toString())
                                     .digest('hex');
                                     console.log("sig received " ,req.body.response.razorpay_signature);
                                     console.log("sig generated " ,expectedSignature);
     var response = {"signatureIsValid":"false"}
     if(expectedSignature === req.body.response.razorpay_signature)
      response={"signatureIsValid":"true"}
         res.send(response);
     });

module.exports = router