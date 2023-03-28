//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

console.log(process.env.API_KEY);

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema); 

app.use(express.static("public"));
app.set('view-engine', 'ejs');
app.use(bodyparser.urlencoded({
    extended:true
}));



app.get('/', function(req, res) {
    res.render('home.ejs', { /* any data you want to pass to the view */ });
  });
  
  app.get('/login', function(req, res) {
    res.render('login.ejs', { /* any data you want to pass to the view */ });
  });
  
  app.get('/register', function(req, res) {
    res.render('register.ejs', { /* any data you want to pass to the view */ });
  });



app.post("/register",function(req,res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });

    newUser.save()
        .then(() => {
            res.render('secrets.ejs', {});
        })
        .catch(error => {
            console.error(error);
            // Handle the error here
    });
})

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
    .then(foundUser => {
        if (foundUser && foundUser.password === password) {
            res.render('secrets.ejs');
        } else {
            console.log("User Not Found or Password Incorrect");
        }
    })
    .catch(err => {
        console.log(err);
    });
})

app.listen(3000, ()=>{
    console.log("Server connected to port 3000");
});
