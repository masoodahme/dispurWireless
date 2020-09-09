const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;
const tariffSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        trim:true
    },
    price:{
        type:Number
    }
},{timestamps:true })
module.exports=tariffSchema;