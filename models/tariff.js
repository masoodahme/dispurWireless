const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;
const userSchema=new Schema({
    name:{
        type:String,
        unique:true,
        trim:true
    },
    typeOfData:{
        type:String
    },
    trafficInteger:{
        type:Number
    },
    validity:{
        type:Number
    },
    rental:{
        type:Number
    }
},{timestamps:true })
module.exports=mongoose.model("tariff",UserSchema);