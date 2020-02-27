//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

var secret = process.env.SECRET;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended:true
}));

app.use(session({
  secret: "SecretCode",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB",
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
mongoose.set("useCreateIndex", true);

// Schema is a Mongoose Schema - note open brackets
// Mongoose schema allows for plugins to be used with it
// Without new.mongoose.Schema and () - it's just a POJO

const userSchema = new mongoose.Schema ({
  email : String,
  password : String
});

// ===========================================
// Plugin taps into Mongoose Schema userSchema
// ===========================================

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);


// passportLocalMongoose used to create local login strategy

passport.use(User.createStrategy());

// Passport used to serialize & deseralize User
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ====================================
// Order of code with passport is vital
// ====================================

// ------------------------------------
// Begin routing

app.get("/", function(req,res) {
  res.render("home");
})

app.route("/login")

.get (function(req,res) {
  res.render("login");
})

.post(function(req,res) {

});
// ===================================================================
// current issue is that usernames aren't set to be unique,
// so findOne is finding first instance / if passwords don't match -
// which causes issue.
// ===================================================================

app.route("/register")

  .get(function(req,res) {
    res.render("register");
  })

  .post(function(req,res) {

  });

app.get("/submit", function(req,res) {
  res.render("submit");
});

app.listen(3000,function() {
  console.log("Server has started Port 3000");
});
