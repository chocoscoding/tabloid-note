const express = require('express');
const mongoose = require('mongoose');
const auth = require('./routes/auth');
const cookieParser = require('cookie-parser')
require('dotenv').config()
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'))
app.use('/', auth)

const port = process.env.PORT || 3000

const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(port))
  .catch((err) => {
    
    console.log(err)});   
   

// app.listen(3000)  
   