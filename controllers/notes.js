const Note = require('../models/Notes')
const expresss = require('express')
const app = expresss();


const createtemplate = async (req,res) =>{
    // res.cookie('jwt', '', { maxage: 1})

    const {_id, data} = req.body;
    try {
        const newnote = await Note.create({data, _id,})
        res.status(200).json(newnote)
    } catch (err) {
        console.log(err.message);
        res.status(400).json({err})
    }
}


const getallnote = async (req,res)=>{    
    const {_id} = req.params;
    try {
        const newdata = await Note.findById(_id)
        res.status(200).json(newdata.data)
    } catch (err) {
        console.log(err.message);
        res.status(400).json({err})
    }
} 

const changeinfo = async (req,res)=>{

    const {_id} = req.params;
    
    const {newarr} = req.body;
    try {
        const {data} = await Note.findByIdAndUpdate(_id, {data: newarr})
        res.status(200).json({result: "Note was saved successfully"})
    } catch (err) {
        console.log(err.message);
        res.status(400).json({err})
    }
} 
   module.exports = {
       createtemplate,
       getallnote,
       changeinfo
   }