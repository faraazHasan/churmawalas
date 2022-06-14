const passportLocalMongoose = require('passport-local-mongoose');
const { model, Schema } = require("mongoose");

const userSchema = new Schema({
    username:{
      type:String,
      required:[true,"Email is required"],
      unique:true,
      index: true,
      trim:true
    },
    password:{
      type:String,
      minlength:[6,"password should contain atleast 6 characters"],
      required:[true,"password is required"],
    },

    firstName:{
      type:String,
      required:[true, "first name is required"],
      trim:true
    },

    lastName:{
      type:String,
      required:[true, "last name is required"],
      trim:true
    },

    contact:{
      type:Number,
      required:[true,"phone number is required"]
    },
    address:{
      type:String,
      required:[true,"address is required"],
      trim:true
    },
    pinCode:{
      type:Number
    }

  },
  { timestamps: true }
);


userSchema.plugin(passportLocalMongoose);
module.exports = model("User", userSchema);

