const {model, Schema} = require("mongoose")

const cartSchema = new Schema(
    {
        name:{
            type:String,
            unique:true,
        },
        quantity:Number,
        total:Number
    }
)