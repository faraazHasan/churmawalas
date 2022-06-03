const {model, Schema} = require("mongoose")

const orderSchema = new Schema(
    {
        items:[{
            name:{
                type:String,
            },
            price:Number,
            quantity:Number,
            photo:String
        }]
    }
)