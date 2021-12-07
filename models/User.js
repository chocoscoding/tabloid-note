const mongoose = require('mongoose');
const { isEmail} = require('validator')
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    email: {
        type: 'String',
        required: [true, 'Please provide your email'],
        unique: true,
        lowecase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: 'String',
        required: [true, 'Please enter a password'],
        minlength: [6, 'the minimum value length is 6']
    },
    fullname: {
        type: 'String',
        required: [true, 'Please enter a fullname'],
        minlength: [1, 'this can\'t be empty']
    }
});

userSchema.post('save', function (doc, next){
    console.log('new user was created and saved', doc);
    next();
})

userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//static method to login

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email});

    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect password');
        console.log(auth);
    }
    throw Error('incorrect email')
}

const User =mongoose.model('user', userSchema)

module.exports = User;