const express = require("express")
const body = require("body-parser")
const ejs = require("ejs")
const _ = require("lodash");
const { append } = require("express/lib/response")
const urlencoded = require("body-parser/lib/types/urlencoded")
const mongoose = require("mongoose")
const { param } = require("express/lib/request")
const upload = require('./uploadMiddleware');
const path = require('path');
const Resize = require('./Resize');
const { array } = require("./uploadMiddleware");
const cookieParser = require("cookie-parser");
require("dotenv").config()
const {SESSION_SECRET,MONGODB_URI} = require("./config")
const Product = require("./models/products.models")
const {getProducts, addToCart, updateCart, Menu} = require("./controllers/app.controller")
let {total_items, products} = require("./controllers/app.controller")
const authRoutes = require("./routes/auth.route");
require('events').EventEmitter.defaultMaxListeners = 15;
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');
require('./passport');
const checkoutRoutes = require("./routes/checkout.route");

const MONGO_URI = MONGODB_URI
PORT = 3000;

const app = express()
app.use(body.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session())

app.use("/", authRoutes);
app.use("/",checkoutRoutes)

////////////////////////////////// Home Route /////////////////////////////////
app.route("/")
.get(getProducts)

.post(addToCart)

app.get('/getcookie', (req, res) => {
    //show the saved cookies
    res.clearCookie('Products')
    products = []
    res.send(req.cookies);
});

////////////////////////////////// Update Cart ////////////////////////////////// 
app.post("/delete",updateCart)



////////////////////////////////// Menu Route /////////////////////////////////

app.route("/menu")
.get(Menu)

////////////////////////////////// Outlets Route /////////////////////////////////

app.route("/outlets")
.get(function(req,res){
    const route = req.params.id
    console.log(route)
    res.render("outlets",{title:"Outlets"})
}
)

////////////////////////////////// Admin //////////////////////////////////////

app.route("/admin")
.get(function(req,res){
        res.render("admin/admin",{title:"Admin"})
    }
)
.post(function(req,res){

    res.render("admin")
})

////////////////////////////////// Products //////////////////////////////////////

app.route("/products")
.get(function(req,res){
        res.render("admin/products",{title:"Products"})
    }
)

.post(upload.single('img'), async function(req,res){
    const imagePath = path.join(__dirname, '/public/images/products');
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
      res.status(401).json({error: 'Please provide an image'});
    }
    const filename = await fileUpload.save(req.file.buffer);
    
  
      let name = req.body.name
      let price = req.body.price
      let quantity = req.body.quantity
      const addProduct = new Product({
        name: _.upperFirst(name) ,
        price: price,
        quantity:quantity,
        photo:filename
      })

      addProduct.save(function(err){
        if(!err){
          res.redirect('/products')
        }
        else{
            res.send("product already exist")
        }
    })
  })

////////////////////////////////// Orders //////////////////////////////////////

app.route("/orders")
.get(function(req,res){
        res.render("admin/orders",{title:"Orders"})
    }
)
.post(function(req,res){
    let order = req.body.order
    let qty = req.body.qty
    console.log(qty)
    res.send(order)
})

////////////////////////////////// Customers //////////////////////////////////////

app.route("/customers")
.get(function(req,res){
        res.render("admin/customers",{title:"Customers"})
    }
)





// global error handling middleware
app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message || SERVER_ERR;
    const data = err.data || null;
    res.status(status).json({
      type: "error",
      message,
      data,
    });
  });

  

async function main() {
    try {
      await mongoose.connect(MONGO_URI);
  
      console.log("database connected");
  
      app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
  
  main();