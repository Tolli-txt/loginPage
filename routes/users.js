const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require('bcrypt');
const passport = require('passport');

// Login handle
router.get('/login',(req,res)=>{
    res.render('Login');
})
router.get('/register',(req,res)=>{
    res.render('Register')
    })

// Register handle
router.post('/register',(req,res)=>{
  const {name,email, password, password2} = req.body;
  let errors = [];
  console.log(' Name ' + name+ ' email ' + email+ ' pass: ' + password);
  if(!name || !email || !password || !password2) {
      errors.push({msg : "Please fill in all fields"})
  }
  // Check if match
  if(password !== password2) {
      errors.push({msg : "Passwords dont match"});
  }
  // Check if password is more than 6 characters
  if(password.length < 6) {
      errors.push({msg : 'Password needs to be atleast 6 characters'})
  }
  if(errors.length > 0) {
  res.render('register', {
      errors : errors,
      name : name,
      email : email,
      password : password,
      password2 : password2})
  } else {
    // Validation Passed
    User.findOne({email : email}).exec((err,user)=>{
      console.log(user);
      if(user) {
          errors.push({msg: 'Email already registered'});
          res.render(res,errors,name,email,password,password2);
        } else {
          const newUser = new User({
              name : name,
              email : email,
              password : password
          });
          //hash password
                   bcrypt.genSalt(10,(err,salt)=>
                   bcrypt.hash(newUser.password,salt,
                       (err,hash)=> {
                           if(err) throw err;
                               //save pass to hash
                               newUser.password = hash;
                           //save user
                           newUser.save()
                           .then((value)=>{
                               console.log(value)
                               req.flash('success_msg','You have now registered!')
                           res.redirect('/users/login');
                           })
                           .catch(value=> console.log(value));

                       }));
                    }
    })
  }
})
router.post('/users/login',(req,res,next)=>{
    passport.authenticate('local',{
    successRedirect : '/dashboard',
    failureRedirect : '/users/login',
    failureFlash : true,
    })(req,res,next);
  })

// Logout
router.get('/users/logout',(req,res)=>{
  req.logout();
  req.flash('success_msg','Now logged out');
  res.redirect('/users/logout');
  })

module.exports = router;
