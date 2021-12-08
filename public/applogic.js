const searchbutton = document.querySelector('.search');
const searchboxcontainer = document.querySelector('.sbi');
const settings = document.querySelector('.settings');
const settingspopup = document.querySelector('.addnewcont');
const closesettingspop = document.querySelector('.popopt2');
const addnewnote = document.querySelector('.add')


const {offline} = JSON.parse(localStorage.getItem('tabloiduserdata'))
const alldata = JSON.parse(localStorage.getItem('tabloid'))
let uploadtodatabase;
//offline token generator
const offlinetoken = () => {
    const date = new Date;
    const a = date.getTime();
    const b = date.getHours();
    const c = date.getDate();
    const d = date.getMinutes();
    const r = (Math.random() + 1).toString(36).substring(4);
    const ndata = a + b + r + c + d;
    localStorage.setItem('tabloid_newtoken', ndata)
    return ndata;

}

//event for creating new note
addnewnote.addEventListener('click', async () => {
        window.location.href = 'app.fullinfo.html?id=' + offlinetoken();
        JSON.stringify(localStorage.setItem('newnote', false))
})

settings.addEventListener('click', () => {
    settingspopup.style.display = 'block';
})

closesettingspop.addEventListener('click', () => {
    settingspopup.style.display = 'none';
})

const adddatatodom = () => {
    document.querySelector('#unlistcont').innerHTML = ``;
    if (offline) {
        alldata.forEach(element => {
            let domToBeAdded = `<li id="${element._id}">
            <div id="data1" class="listelementcont">
                <div id="data2" class="topline ${element.deccolor} "></div>
                <h3 id="data3" class="${element.deccolor} date">${element.lastModified}</h3>
                <p id="data4" class="show_min_text">${element.notedata}</p>
            </div>
        </li>`

            document.querySelector('#unlistcont').insertAdjacentHTML("afterbegin", domToBeAdded)
        });
    }
    else if (!offline){

        const idMain= JSON.parse(localStorage.getItem('tabloiduserdata'))._id;
        async function getallnote (){
            const _id = idMain;
            const res = await fetch (`/api/v1/${_id}`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            });
            const data = await res.json();
            uploadtodatabase = data;
            if(data.err){
                async function createtemplate (){
                    const data =  [];
                    const _id = idMain;
                    const res = await fetch (`/api/v1/:id`, {
                        method: "POST",
                        body: JSON.stringify({_id, data }),
                        headers: {'Content-Type': 'application/json'}
                    });
                }
                createtemplate();

            }

            else if(!data.err){
                if(data.length<1){
                    document.querySelector('#unlistcont').innerHTML = `<h3 class="intro">There are no notes yet... Add one now or  Reload Page</h3>`
                }
                else{
                // document.querySelector('#unlistcont').innerHTML = ``;
                data.forEach(element => {
                    if(element !== ""){
                        
                        let domToBeAdded = `<li id="${element._id}">
                        <div id="data1" class="listelementcont">
                        <div id="data2" class="topline ${element.deccolor} "></div>
                        <h3 id="data3" class="${element.deccolor} date">${element.lastModified}</h3>
                        <p id="data4" class="show_min_text">${element.notedata}</p>
                        </div>
                            </li>`
                            
                            document.querySelector('#unlistcont').insertAdjacentHTML("afterbegin", domToBeAdded)
                        }
                        else{
                            document.querySelector('#unlistcont').innerHTML = `<h3 class="intro">There are no notes yet... Add one now or  Reload Page</h3>`
                            
                        }
                        });
            }
        }
            
        }
        getallnote()







    }
}
adddatatodom();

document.querySelector('#unlistcont').addEventListener('click', (e) => {
    // console.log(e.target);
    const t = e.target;
    switch (t.id) {
        case 'data1':
            const id1 = t.parentElement.id;
            window.location.href = 'app.fullinfo.html?id='+id1;            break;
        case 'data2':
        case 'data3':
        case 'data4':
           const id2 = t.parentElement.parentElement.id;
            window.location.href = 'app.fullinfo.html?id='+id2;
            break;
    }


})


document.querySelector('.loginbutton').addEventListener('click', ()=>{
    window.location.href= 'index.html'
    
})

//check userinfo to determin if user is logged in with the aid of cookies
async function checkuser(){

    const offlineactive = JSON.parse(localStorage.getItem('offlineactive'))

    if(!offlineactive){

        const res = await fetch("/api/v1", { 
            method: "GET",
            headers: {'Content-Type': 'application/json'}});
            const data = await res.json();    
            localStorage.setItem('tabloiduserdata', JSON.stringify(data))
        }
}
checkuser()

//check if user is logged in onload

function checkifuser(){
    const {offline, fullname} = JSON.parse(localStorage.getItem('tabloiduserdata'))
    if(!offline){
        document.querySelector('.text1').innerHTML = `You are logged in as ${fullname}`;
        document.querySelector('.text2').innerHTML = '';
        document.querySelector('.loginbutton').style.display = 'none'
        document.querySelector('.logoutbutton').style.display = 'block'
    }
} checkifuser()


document.querySelector('.logoutbutton').addEventListener('click', async()=>{
    const res = await fetch("/api/v1", { 
        method: "POST"});
    const data = await res;

    localStorage.setItem('tabloiduserdata', JSON.stringify({email:null, fullname: null, "offline":true}))
    
    window.location.href ='/';
})


