const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;
const tariffSchema=new mongoose.Schema({
    registrationId:{
        type:String,
        trim:true
    },
    amount:{
        type:Number
    },
    date:{
        type:String,
        unique:true
    }
},{timestamps:true })
module.exports=tariffSchema;