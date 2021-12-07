function handleErrors(err){
    console.log(err);
    let errors = {email: '', password:''};

    //incorrect email
    if(err.message === 'incorrect email'){
        errors.email = 'that email is not registered'
    }

    //incorrect password
    if(err.message === 'incorrect password'){
        errors.password = 'incorrect password'
    }

    //duplicate error 
    if(err.code === 11000){
        errors.email = 'this email is already registered'
    }

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        })
    }


    return errors;
}

module.exports = handleErrors