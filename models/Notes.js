const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id:{
        type: 'String'  },
    data: [
    ]
    }, { _id: false })


const Note = mongoose.model('Note', userSchema)

module.exports= Note;




