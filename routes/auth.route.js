
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const passport = require('passport');


const {

  registerUser, loginUser , logOutUser

} = require("../controllers/auth.controller");
const { cookie } = require("express/lib/response");
const { reduce } = require("lodash");


router.get("/register",(req,res) => {
  const registrationErrors = req.cookies.registrationErrors
  let errors = true
console.log(registrationErrors)
  if(registrationErrors){
    let registrationValues = req.cookies.registrationValues
    res.render("register",{title:"Register", errors:errors,registrationValues:registrationValues, registrationErrors:registrationErrors})
  }
  else{
    errors = false
    userExist = false
    res.render("register",{title:"Register",errors:errors})
  }
  
  
})

router.post("/register", registerUser);


router.get("/login",(req,res) => {
  res.render("login",{title:"Login"})
})


router.post("/login", loginUser);

router.get("/userSecrets",(req,res)=>{
  if(req.isAuthenticated()){
    res.send("i still love ankita")
  }
  else{
    res.redirect("/login")
  }
})

router.post("/logout",logOutUser)


module.exports = router;