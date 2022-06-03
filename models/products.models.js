const {model, Schema} = require("mongoose")

const productSchema = new Schema(
    {
        name:{
            type:String,
            unique:true,
        },
        price:Number,
        quantity:String,
        photo:String
    }
)

module.exports = model("Product", productSchema);