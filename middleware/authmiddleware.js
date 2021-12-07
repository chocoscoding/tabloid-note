const jwt = require('jsonwebtoken');
const User = require('../models/User')
const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());

const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt;
    console.log(token)

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken)=>{
            if(err){
                console.log(err)
                next();
            }
            else{
                console.log(decodedToken);
                next();
            }
        })

    }
    else{
        console.log(false);
    }
}

const checkuser = (req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken)=>{
            if(err){
                const finalMessage = {email:null, fullname: null, "offline":true};
                res.JSON({finalMessage})
            }
            else{
                const user_ = await User.findById(decodedToken.id)
                const {email, fullname} = user_
                const finalMessage = {email, fullname, "offline":false};
                res.JSON({finalMessage})
            } 
        })
        
    }
    else{
        // app.redirect('/')
        const finalMessage = {email:null, fullname: null, "offline":true};
        res.JSON({finalMessage})

    }
}

module.exports={
    checkuser, requireAuth
}