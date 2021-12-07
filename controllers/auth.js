const Note = require('../models/Notes');
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const handleErrors = require('../models/handleErrors');
require('dotenv').config();
const maxage = 3 * 24 * 60 * 60;
const createtoken = (id)=>{
    const jwtsecret = process.env.JWT_SECRET;
    return jwt.sign({id}, jwtsecret, {expiresIn: maxage})
}

const signup = async (req, res)=>{
    const {email, password,fullname} = req.body;
    try {
        const user = await User.create({ email, password, fullname});
        const token = createtoken(user._id)
        res.cookie('jwt', token, {httpOnly:true, maxage: maxage * 1000});
        res.status(201).json({id: user._id, name: user.fullname});
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }
}
const login = async (req, res)=>{

    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);
        const token = createtoken(user._id);
        res.cookie('jwt', token, {httpOnly:true, maxage: maxage * 1000});
        res.status(200).json({user: user._id, name: user.fullname})
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }

}
const login_signup = (req, res)=>{
    const {functname} = req.body; 
    if(functname === 'signup'){
        signup(req,res)
    }
    else if(functname === 'login'){
        login(req,res)
    }
}



const checkuser = (req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken)=>{
            if(err){
                const finalMessage = {email:null, fullname: null, "offline":true};
                res.json(finalMessage)
            }
            else{
                
                try {
                    const user_ = await User.findById(decodedToken.id)
                    const {email, fullname, _id} = user_
                    const finalMessage = {_id, email,  fullname, "offline":false};
                    res.json(finalMessage)
                } catch (err) {
                    
                    const finalMessage = {email:null, fullname: null, "offline":true};
                    res.json(finalMessage)
                }
            } 
        })
        
    }
    else{
        const finalMessage = {email:null, fullname: null, "offline":true};
        res.json(finalMessage)

    }
}


const logout = (req,res)=>{
        res.cookie('jwt', '', { maxage: 1});
        res.redirect('/')
}

module.exports = {
login_signup,checkuser,logout
}