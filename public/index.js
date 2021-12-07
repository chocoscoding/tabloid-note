const continueoffline = document.querySelector('.option2');
const signup = document.querySelector('#signup_submit');
const login = document.querySelector('#login_submit');
const loginh = document.querySelector('#lh');
const signuph = document.querySelector('#sh');
const resetpass = document.querySelector('#reset');
const loginemail = document.querySelector('#loginemail');
const loginpass = document.querySelector('#loginpassword');
const signupname = document.querySelector('#name');
const signuppass = document.querySelector('#password');
const signupmail = document.querySelector('#email');
const signupbody = document.querySelector('#signup');
const verifybody = document.querySelector('.verify');
const loginbody = document.querySelector('#login');
const openlogin = document.querySelector('.option1b');
const opensignup = document.querySelector('.option1a');
const goback = document.querySelector('.option1c');
const nextslide = document.querySelector('.continue');
const box1 = document.querySelector('.box1')
const box2 = document.querySelector('.box2')
const signup_submit = document.querySelector('#signup_submit')
const login_submit = document.querySelector('#login_submit');
const signup_fullnameerr = document.querySelector('#signup_fullnameerr')
const signup_emailerr = document.querySelector('#signup_emailerr')
const signup_paswderr = document.querySelector('#signup_paswderr')
// const message;   

openlogin.addEventListener('click',()=>{
    [signupbody, signuph].map(items => items.style.display = 'none')
    loginbody.style.display = 'flex'
    loginh.style.display = 'block';

})
opensignup.addEventListener('click', ()=>{
    [loginbody, loginh].map(items => items.style.display = 'none');
    signupbody.style.display = 'flex'
    signuph.style.display = 'block';
})

nextslide.addEventListener('click', () => {
    box1.classList.toggle('addexit')
    box2.classList.toggle('addopen')

})
continueoffline.addEventListener('click', ()=>{
    window.location.href = 'app.html'
})
//logic for signing up users
signup_submit.addEventListener('click', async (e)=>{
    e.preventDefault();
     const email = signupbody.email.value;
     const password = signupbody.password.value;
     const functname = 'signup';
     const fullname = signupbody.usersname.value;

     try {
           const res = await fetch ('/', {
               method: 'POST',
               body: JSON.stringify({ email, password, fullname, functname}),
               headers: {'Content-Type': 'application/json'}
           });
           const data = await res.json();
           if(!data.errors){
               //show ui for logged in users in idex.html page
    [signupbody, signuph, loginbody, loginh].map(items => items.remove())
    verifybody.style.display = 'flex';

    document.querySelector('#loggedin').textContent += ` as ${data.name}`

    document.querySelector('.continueOnline').addEventListener('click', ()=>{
        location.assign('/app.html')
    })
           }
           if(data.errors){
               const d = data.errors;
               signup_emailerr.innerHTML = d.email;
               signup_fullnameerr.innerHTML = d.fullname || '';
               signup_paswderr.innerHTML = d.password;
               
               
               setTimeout(() => {
                   signup_emailerr.innerHTML = '';
                   signup_fullnameerr.innerHTML = '';
                   signup_paswderr.innerHTML = '';
                   
               }, 4500);

           }     
     } catch (err) {
         document.querySelector('#signup_maineerr').innerHTML = err.message;
         
         setTimeout(()=>{
             document.querySelector('#signup_maineerr').innerHTML = '';
         }, 4000)
         
         
     }


})

// logic for loging  in users
login_submit.addEventListener('click',async (e)=>{
    e.preventDefault();

    const email = loginbody.loginemail.value;
    const password = loginbody.loginpassword.value;
    const functname =  'login';

    try {
        const res = await fetch('/', {
            method: 'POST',
            body: JSON.stringify({ email, password,functname}),
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json();
        if(!data.errors){
            [signupbody, signuph, loginbody, loginh].map(items => items.remove())
            verifybody.style.display = 'flex';
        
            document.querySelector('#loggedin').textContent += ` as ${data.name}`
        
            document.querySelector('.continueOnline').addEventListener('click', ()=>{
                location.assign('/app.html')
            })
        }
        if(data.errors){
            const d = data.errors;
            login_emailerr.innerHTML = d.email;
            login_paswderr.innerHTML = d.password;
            
            
            setTimeout(() => {
                login_emailerr.innerHTML = '';
                login_paswderr.innerHTML = '';
                
            }, 4500);

        }
    } catch (err) {
        document.querySelector('#signup_maineerr').innerHTML = err.message;
         
        setTimeout(()=>{
            document.querySelector('#signup_maineerr').innerHTML = '';
        }, 4000)
    }


})


//check userinfo to determin if user is logged in with the aid of cookies
async function checkuser(){
    const res = await fetch("/api/v1", { 
        method: "GET",
        headers: {'Content-Type': 'application/json'}});
    const data = await res.json();    
    localStorage.setItem('tabloiduserdata', JSON.stringify(data))
}
checkuser()

//check if user is logged in onload

function checkifuser(){
    const {offline, fullname} = JSON.parse(localStorage.getItem('tabloiduserdata'))
    if(!offline){
        //show ui for logged in users in idex.html page
    [signupbody, signuph, loginbody, loginh].map(items => items.remove())
    verifybody.style.display = 'flex';

    document.querySelector('#loggedin').textContent += ` as ${fullname}`

    document.querySelector('.continueOnline').addEventListener('click', ()=>{
        location.assign('/app.html')
    })
    }
} checkifuser()



