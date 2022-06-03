const User = require("../models/user.model");
const { add } = require("lodash");
const bcrypt = require("bcrypt")
const saltRounds = 14
const cookieParser = require("cookie-parser");
const {check,validationResult} = require("express-validator")
const jwt = require('jsonwebtoken');
const passport = require("passport")
const{getErrors,userExistErrors} = require("../errors")
const {
  USER_NOT_FOUND_ERR,
  INCORRECT_PASSWORD,
  ACCESS_DENIED_ERR,
} = require("../errors");
const req = require("express/lib/request");

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// ---------------------------- create new user ---------------------------------

exports.registerUser = async (req,res,next) => {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.cookie("url",fullUrl)
  const {email,password,firstName,lastName,address,contact,confirmPassword,pinCode} = req.body

 User.findOne({username:email},(err,user)=>{
   if(user){
    registrationValues = {
      email:req.body.email,
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      address:req.body.address,
      pinCode:req.body.pinCode,
      contact:req.body.contact,
      
    }

    registrationErrors = {
      email:"User exist",
      firstName:null,
      lastName:null,
      password:null,
      contact:null,
      address:null,
      pinCode:null,
      confirmPassword:null
    }
    res.cookie("registrationValues", registrationValues, {path: '/register', maxAge: 1000, secure :false ,httpOnly:false})
    res.cookie("registrationErrors", registrationErrors, {path: '/register', maxAge: 1000, secure :false ,httpOnly:false})
    res.redirect("/register")
   }
   else{
   
    if(password === confirmPassword){
      bcrypt.hash(password,saltRounds,(err,hash) => {
        User.register({username:email,firstName:firstName, lastName:lastName ,contact:contact,address:address,pinCode:pinCode,password:hash},hash,function(err,user){
        if(err){
          console.log(err)
                const {password,contact,firstName, lastName ,pinCode,address} = err.errors
                registrationErrors = {
                  firstName:getErrors(firstName),
                  lastName:getErrors(lastName),
                  password:getErrors(password),
                  contact:getErrors(contact),
                  address:getErrors(address),
                  pinCode:getErrors(pinCode),
                  confirPassword:null
                }
                registrationValues = {
                  email:req.body.email,
                  firstName:req.body.firstName,
                  lastName:req.body.lastName,
                  address:req.body.address,
                  pinCode:req.body.pinCode,
                  contact:req.body.contact,
                  
                }
                res.cookie("registrationValues", registrationValues, {path: '/register', maxAge: 1000, secure :false ,httpOnly:false})
                res.cookie("registrationErrors", registrationErrors, {path: '/register', maxAge: 1000, secure :false ,httpOnly:false})
              
                            
              res.redirect("/register")
        }
        else{
          if(req.cookies.url != undefined){
            res.redirect(req.cookies.url)
          }
          else{
            res.redirect("/")
          }
        }
      })})
      
    }
  
    else{
      registrationErrors = {
        email:null,
        firstName:null,
        lastName:null,
        password:null,
        contact:null,
        address:null,
        pinCode:null,
        confirmPassword:"Passwords did not match"
      }
  
      registrationValues = {
        email:req.body.email,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        address:req.body.address,
        pinCode:req.body.pinCode,
        contact:req.body.contact,
      }
      res.cookie("registrationValues", registrationValues, {path: '/register', maxAge: 1000, secure :false ,httpOnly:false})
      res.cookie("registrationErrors", registrationErrors, {path: '/register', maxAge: 1000, secure :false ,httpOnly:false})
      res.redirect("/register")
    }
    
   }
 }
 )
  
};

// // ------------ login with email ----------------------------------

exports.loginUser = async (req, res, next)=> {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.cookie("url",fullUrl)
  User.findOne({username:req.body.email},function(err,customer){
    if(!err){
      if(!customer){
        res.redirect("/login")
      }
      else{
        const password = bcrypt.compareSync(req.body.password, customer.password);
        if(password){
          const user = new User({
            username:req.body.email,
            password:customer.password
          })
          req.login(user,function(err){
            if(err){
              console.log(err)
              res.send("wrong username or password")
            }
            else{
              passport.authenticate("local",{ failureRedirect: '/login', failureMessage: true })(req,res,function(){
                if(req.cookies.url != undefined){
                  res.redirect(req.cookies.url)
                }
                else{
                  res.redirect("/")
                }
              })
            }
          })
        }
        else{
          res.send("incorrect password")
        }
      }
      
      }
      else{
        res.send("something went wrong")
      }
    }
  )
 
  
};
 
exports.logOutUser = (req,res)=>{
  req.logout()
  res.redirect("/")
}

exports.checkAuth = (req)=>{
  if(req.isAuthenticated()){
    let name = req.user.firstName
    return name
  }
  else{
    return false
  }
}

