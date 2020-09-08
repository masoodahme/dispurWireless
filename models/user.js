const mongoose=require("mongoose");
const crypto=require("crypto");
const uuidv1=require("uuid/v1");
const {ObjectId}=mongoose.Schema;
const userSchema=new Schema({
    name:{
        type:String,
        trim:true
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
        maxlength:10,
        default:null
    },
    subscription:{
        type:ObjectId,
        ref:"tariff"
    },
   encrypt_password:{
        type:String,
        required:true
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
        default:0//0-->customer 1-->admin portal 2-->relationship manager
    }
},{timestamps:true })
//virtual fields
UserSchema.virtual("password")
  .set(function(password){
      //_password is private variable to store the password
      this._password=password;
      this.salt=uuidv1();
      this.encrypt_password=this.securePassword(password);
  })
  .get(function(){
      console.log(this._password);
      return this._password;
  })
UserSchema.methods={
    authenticate:function(plainPassword){
        return this.securePassword(plainPassword)===this.encrypt_password
    },
    securePassword:function(plainPassword){
            if(!plainPassword)return " ";
            try{
                return crypto.createHmac('sha256', this.salt)
                .update(plainPassword)
                .digest('hex');
            }
            catch(err)
            {
                console.log("error in password");
            }
    }
}
module.exports=mongoose.model("user",UserSchema);