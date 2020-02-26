//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

var secret = process.env.SECRET;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB",
    {   useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false});

const userSchema = new mongoose.Schema ({
  email : String,
  password : String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res) {
  res.render("home");
})


app.route("/login")

.get (function(req,res) {
  res.render("login");
})


.post(function(req,res) {
  const username = req.body.username;
  const password = md5(req.body.password);

  console.log(username + ' ' + password)

  User.findOne({email:username},function(err,foundUser) {
    if (username === foundUser.email && password === foundUser.password) {
      console.log("found");
      res.render("secrets");
    } else {
      console.log("issue" + err )
      console.log(foundUser);
    }
  })
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
    const newUser = new User ({
      email: req.body.username,
      password: md5(req.body.password)
    })
  console.log(newUser);
  newUser.save(function(err) {
    if (!err) {
      res.render("secrets") } else{
       console.log(err);
      }
    })
  });

app.get("/submit", function(req,res) {
  res.render("submit");
});

app.listen(3000,function() {
  console.log("Server has started Port 3000");
});
