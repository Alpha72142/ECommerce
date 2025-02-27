import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:mongoose.ObjectId,
        ref:"Category",
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    discount:{
      type:Number,
      default:0
    },
    discountPrice:{
        type:Number
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    shipping:{
        type:Boolean,
    }
},{timestamps:true});

export default mongoose.model('products', productSchema)