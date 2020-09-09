require("dotenv").config()
const path=require("path");
const express=require("express");
const mongoose=require("mongoose");
const ejs = require("ejs");
const bodyParser=require("body-parser");
//const userSchema=require("./models/user");;
const tariffSchema=require("./models/tariff");
const passport = require("passport");
const session=require("express-session");
const uniqid = require('uniqid');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const { post } = require("./models/tariff");
//const bcrypt = require('bcrypt');
const saltRounds = 10;
const app=express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
// pp.set('views', path.join(__dirname, 'app', 'views'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: "hello",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(process.env.DATABASE,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);
const userSchema=new mongoose.Schema({
  username:{
      type:String,
      trim:true
  },
  email:{
      type:String,
      required:true
  },
  registrationId:{
      type:String,
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
      type:String
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
     default:0//0-->customer 1-->admin portal 2-->relationship manager
  }
},{timestamps:true })
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const Tariff=mongoose.model("tariff",tariffSchema);
//local strategies
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
    res.render("loginpage");
});

app.get("/tariffplanspage",function(req,res){
  if(req.isAuthenticated())
  {
    Tariff.find({},function(err,tariff){
      if(err)
      {
        console.log(err);
      }
      else{
        console.log("db accessed");
        res.render("tariffplanspage",{tariffData:tariff});
      }
    }) 
   
  }
  else{
    res.redirect("/");
  }
  
})
app.get("/manageraccesspage",function(req,res){
    if(req.isAuthenticated())
    {
      res.render("manageraccesspage",{userData:{}});
    }
    else{
      res.redirect("/");
    }
})
app.get("/adminaccesspage",function(req,res){
    if(req.isAuthenticated()){
      res.render("adminaccesspage",{userData:{}});
    }
    else{
      res.redirect("/");
    }
})
app.post("/signup", function (req, res) {
 
  const password=req.body.password;
  //adding the user details to the database with hashing
  const registrationId=uniqid();
 // console.log(registrationId);
  User.register({
     username:req.body.username,
     email:req.body.email,
    registrationId:registrationId,
     address:req.body.address,
     contact:req.body.cnumber,
     alternatePhno:req.body.anumber,
     role:0,
     monthlyBill:0
  }, password, function (err, user) {
      if (err) {
          console.log(err);
          res.redirect("/");
      }
      else{
      
          passport.authenticate("local")(req,res,function(){
              res.redirect("/tariffplanspage");
          });
          
      }
  });
  
});

app.post("/login", function (req, res) {

  const user=new User({
      username: req.body.username,
      password :req.body.password,
      role:1
  });
  console.log(user);
  req.login(user,function(err){
     if(err) 
         {
           console.log(err);
          res.render("loginpage");
         }
      else{
    
           passport.authenticate("local")(req,res,function(){
           if(user.username==="manager")
           {
              res.redirect("/manageraccesspage");
           }
           else if(user.username==="admin")
           {
             res.redirect("/adminaccesspage");
           }
           else{
            res.redirect("/tariffplanspage");
            }
           }
          );     
      }
  });
});

app.get("/logout",function(req,res){
  req.logout();
  res.render("loginpage");
});

//admin portal add plans
app.post("/addPlans",function(req,res){
    const tariff=new Tariff({
      planname:req.body.planname,
      typeofplan:req.body.typeofplan,
      tarriffRate:req.body.tarrifRate,
      validity:req.body.validity,
      rental:req.body.rental
    });
    console.log(tariff);
    tariff.save((err,user)=>{
      if(err)
      {
        console.log(err);
      }
      else{
        res.redirect("/adminaccesspage");
      }
      
    });
});
//admin view customer details
app.post("/getCustomerDetails",function(req,res){
  User.find({registrationId:req.body.id},function(err,user){
    if(err)
    {
      console.log(err);
    }
    else{
      res.render("manageraccesspage",{userData:user});
    }
  })
})

//go to userprofilepage
app.get("/userprofilepage",function(req,res){
      if(req.isAuthenticated())
      {
        User.find({username:req.user.username},function(err,user){
          if(err)
          {
            console.log(err);
          }
          else{
            console.log("updated");
            console.log(user);
            res.render("userprofilepage",{userData:user[0]});
          }
        })
      }
      else{
        res.redirect("/");
      }
})
//update user profile data
app.post("/updateUserDetails",function(req,res){
  const email=req.body.email;
  const location=req.body.address;
  const contact=req.body.contact;
  const update={};
  if(email)
  {
    update.email=email;
  }
  if(location)
  {
    update.location=location;
  }
  if(contact)
  {
    update.contact=contact;
  }
  if(req.isAuthenticated())
  {
    User.findOneAndUpdate({username:req.user.username},update,function(err,user){
      if(err)
      {
        console.log(err);
      }
      else{
       
        res.render("userprofilepage",{userData:user});
      }
    })
   
   // res.render("userprofilepage",{userData:{}});
  }
  else{
    res.redirect("/");
  }
})

//listen server
app.listen(3000,function(){
  console.log("server has started");
});
