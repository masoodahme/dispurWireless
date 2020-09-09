const mongoose=require("mongoose");
const counterSchema=new mongoose.Schema({
    name:{
        type:String
    },
    previous_register_id:{
        type:Number,
        unique:true
    }
});
module.exports=counterSchema;

// const Counter=mongoose.model('counter',counterSchema);
// //counterschema -->pending
// function getNextSequenceValue(customerId){
//   const filter = { name:customerId };
//   const update = {$inc:{previous_register_id:1}};
//   var currentRegisterId = Counter.findOneAndUpdate(
//      filter,update
//   );
//   console.log(customerId);
//   console.log(currentRegisterId.previous_register_id);
//   return currentRegisterId.previous_register_id;
// }



 //authentication using passport as middleware
  // const username=req.body.name;
  // const email=req.body.email;
  // //const registrationId=getNextSequenceValue("customer_id");
  // const registrationId=1001;
  // const address=req.body.address;
  // const contact=req.body.cnumber;
  // const alternatePhno=req.body.anumber;