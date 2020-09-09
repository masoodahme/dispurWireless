const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    registrationId:{
        type:Number,
        unique:true,
    },
    address:{
        type:String
    },
    contact:{
        type:String,
        //default:null
    },
    alternatePhno:{
        type:String,
       // default:null
    },
    subscription:{
        type:ObjectId,
        ref:"tariff"
    },
   password:{
        type:String   
    },
    salt:String,
    transactionType:{
        type:String
    },
    monthlyBill:{
        type:Number
    },
    role:{
        type:Number,
       // default:0//0-->customer 1-->admin portal 2-->relationship manager
    }
},{timestamps:true })
module.exports=userSchema;