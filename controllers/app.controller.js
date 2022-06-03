const Product = require("../models/products.models");
const body = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require('passport');
const req = require("express/lib/request");
const {checkAuth} = require("./auth.controller");
const Razorpay = require("razorpay");
const {RAZOR_PAY_ID,RAZORPAY_KEY} = require("../config");
const razorApiId = RAZOR_PAY_ID;
const razorApiKey = RAZORPAY_KEY;

  
let total_items = 0 //total items in cart
let products = [] // local cart items list
//////////////////////////////////// get products //////////////////////////////////////

exports.getProducts = (req,res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl; // get current URL for rendering back this page after form submition 
    res.cookie("url",fullUrl) // add current URL to cookies
    Product.find(function(err,items){ // get products from database
        if(!err){
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
                        const checkUser = checkAuth(req) // check if user is logged in for changing the login button to logout on frontend
                        res.render("index",{auth:checkUser,title:"Home",items:items,cart:cart,total_items:total_items,total_price:total_price})
                    }
            
        }
    })
        return total_items
    
}

////////////////////////////////////// Add product to cart ///////////////////////////////

exports.addToCart = (req,res) => {
    
    let item = req.body.product
    let price = req.body.price
    let photo = req.body.photo
    let qty = req.body.quantity
    let product = { // create products object for adding product in cookies
        item:item,
        price:parseInt(price),
        photo:photo,
        qty:parseInt(qty)
    }
    // check if local products list is empty. Then ->
    if(products.length == 0){ 
        products.push(product) // add product object to local products list. 
            res.cookie("Products", products, {path: '/', maxAge: 100000, secure :false ,httpOnly:false}) // add local products list to cookies Products list 
            if(req.cookies.url){  // if there is any current URL string in cookies then redirect to that URL
                res.redirect(req.cookies.url)
              }
              else{
                res.redirect("/")
              }
            total_items++ // local total item's value increase by 1
    }
    // if local products list is not empty. Then ->
    else{ 
        let item_exist = false // this variable checks if the item aready exist
        if(total_items != 0){   // if local total items is = 0
            products.forEach(element => { // loop through local products list 
                if(element.item == item){ 
                    element.qty = qty // if item is already exist and user try to add again with diffrent quantity then just change the quantity of that item in local products list.
                    res.clearCookie("Products") 
                    res.cookie("Products", products, {path: '/', maxAge: 100000, secure :false ,httpOnly:false}) // now clear the Products list in cookies and create new Products list in cookies and add the updated local products list.
                    item_exist = true 
                }       
            });
            }
            else{  
                    products = []
            }
        
        if(item_exist == false){ // if the requested item is not already exist 
            products.push(product) // add product object to local products list 
            res.cookie("Products", products, {path: '/', maxAge: 100000, secure :false ,httpOnly:false}) // override the Products list in cookies with updated local products list.
            total_items++
        }
        if(req.cookies.url){
            res.redirect(req.cookies.url) // if there is any current URL string in cookies then redirect to that URL
          }
          else{
            res.redirect("/")
          }
    }
    return total_items
}

//////////////////////////////////// Update Cart ///////////////////////////////
exports.updateCart = (req,res) => {
    
    // if user clicked on delete icon
    if(req.body.remove == "remove"){  
        const item = req.body.item  
        for(let i = 0; i < products.length; i++){ // loop through the local products list to reach to that item 
            if(products[i].item == item){ // when reached to that item.
                products[i].qty = 0 // change item quantity to 0. and item will be dissapeared form the cart becouse cart doesn't show items with 0 quantity.
                total_items-- 
            }
        }
        res.clearCookie("Products") // clear the products list of cookies to update cart
        let updated_products = []
        for(let i = 0; i < products.length; i++){ // loop through local products list to check if any item has 0 quantity value. if any then ignore that item.
            if(products[i].qty != 0){
                updated_products.push(products[i]) // if item has quantity more than 0. then add item to new local products list 
            }
        }
        res.cookie("Products", updated_products, {path: '/', maxAge: 100000, secure :false ,httpOnly:false}) // add new local products list to products list of cookies.
        if(req.cookies.url){
            res.redirect(req.cookies.url) // if there is any current URL string in cookies then redirect to that URL
          }
          else{
            res.redirect("/")
          }
    }
    
    // if user click on minus button in cart
    if(req.body.change == "minus"){
        let item = req.body.item

        products.forEach(product => {
            if(item == product.item){
                if(product.qty >1){
                    product.qty = product.qty -1
                }
                else{
                    product.qty = 0
                    total_items--
                    if(total_items === 0){
                        res.clearCookie("Products")
                        products = []
                    }

                }
                
            }
    
        });
        
        res.clearCookie("Products")
        res.cookie("Products", products, {path: '/', maxAge: 100000, secure :false ,httpOnly:false})
        if(req.cookies.url){
            res.redirect(req.cookies.url)
          }
          else{
            res.redirect("/")
          }
        
    }
    else if(req.body.change == "plus"){
        let item = req.body.item

        products.forEach(element => {
            if(item == element.item){
                if(element.qty < 20){
                    element.qty = parseInt(element.qty) + 1    
                }
                else{
                    element.qty = 20
                    console.log("reached to limit")
                }
            }
        });
        
        res.clearCookie("Products")
        res.cookie("Products", products, {path: '/', maxAge: 100000, secure :false ,httpOnly:false})
        if(req.cookies.url){
            res.redirect(req.cookies.url)
          }
          else{
            res.redirect("/")
          }
    }
    return total_items
}

////////////////////////////// Menu items ////////////////////////////
exports.Menu = (req,res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.cookie("url",fullUrl)
    Product.find(function(err,items){
        if(!err){
            let total_price = 0
            let cart = []
                    try{
                        if(products.length != 0){
                            let cookees = JSON.stringify(req.cookies)
                            let jsoon = JSON.parse(cookees)
                            cart = jsoon.Products
                            jsoon.Products.forEach(element => {
                                let price = element.price
                                let quantity = element.qty
                                total_price = price * quantity + total_price
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
                        const checkUser = checkAuth(req)
                        res.render("menu",{auth:checkUser,title:"Food Menu",items:items,cart:cart,total_items:total_items,total_price:total_price})
                    }
            
        }
    })
    
}

exports.total_items = total_items
exports.products = products

// /////////////////// check out ///////////////////////////
exports.orderConfirm = (req,res)=>{
    if(req.isAuthenticated()){
        const itemsInBill = []
        let totalAmount = 0
        products.forEach(item=>{
            if(item.qty != 0){
                itemsInBill.push({
                    item:item.item,
                    Quantity:item.qty,
                    price: item.price * item.qty
                })
                totalAmount = totalAmount + item.qty * item.price
            }
        })
        const user = req.user
        const customer = {
            customer: user.firstName + " " + user.lastName,
            phone:user.contact,
            address:user.address,
            zip:user.pinCode
        }
        const bill = [customer,["Ordered items",itemsInBill],"Total amount:"+totalAmount]
        var razor = new Razorpay({
            key_id: razorApiId,
            key_secret: razorApiKey,
          });

        var options = {
            amount: totalAmount*100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
            };
        razor.orders.create(options, function(err, order) {
        console.log(order);
        });
    }
    
}

