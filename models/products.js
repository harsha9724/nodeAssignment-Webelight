const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    product_id:{
        type:Number,
        unique:true
    },
    product_category:String,
    product_name:String,
    product_price:Number,
    user: {type: Schema.Types.ObjectId, ref: "User"}
  
}, {timestamps: true});

const Products =new mongoose.model("Product", productSchema);
module.exports = Products;