const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth.js")

// Login Page
router.get('/', (req,res)=>{
    res.render('Welcome');
})

// Register Page
router.get('/register', (req,res)=>{
    res.render('Register');
})

// Dashboard Page
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
    user: req.user
  });
})

module.exports = router;
