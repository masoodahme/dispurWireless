require("dotenv").config()
const path=require("path");
const express=require("express");
const mongoose=require("mongoose");
const ejs = require("ejs");
const bodyParser=require("body-parser");
//const userSchema=require("./models/user");
const counterSchema=require("./models/counters");
const passport = require("passport");
const session=require("express-session");
const uniqid = require('uniqid');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
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
     // default:0//0-->customer 1-->admin portal 2-->relationship manager
  }
},{timestamps:true })
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
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
    res.render("tariffplanspage");
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
  //level 5 authentication
  const user=new User({
      username: req.body.username,
      password :req.body.password
  });
  console.log(user);
  req.login(user,function(err){
     if(err) 
         {
           console.log(err);
          res.render("loginpage");
         }
      else{
        console.log("hheee");
           passport.authenticate("local")(req,res,function(){
            console.log(user);
             console.log("hh");
           res.redirect("/tariffplanspage");
          });     
      }
  });
});
app.get("/logout",function(req,res){
  req.logout();
  res.render("loginpage");
});
app.listen(3000,function(){
  console.log("server has started");
});
