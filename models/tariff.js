const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;
const tariffSchema=new mongoose.Schema({
    planname:{
        type:String,
        unique:true,
        trim:true
    },
    typeofplan:{
        type:String
    },
    tarriffRate:{
        type:Number
    },
    validity:{
        type:Number
    },
    rental:{
        type:Number
    }
},{timestamps:true })
module.exports=tariffSchema;