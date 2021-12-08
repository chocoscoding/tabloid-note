const question = document.querySelector('.question');
const closequestion = document.querySelector('.closeatt');
const option1 = document.querySelector('#option1');
const option2 = document.querySelector('#option2');
const returnhome = document.querySelector('#back');
const colorpickcont = document.querySelector('.colorcont')
const changecolorfunc = document.querySelector('#changecolor');
const changecolorbody = document.querySelector('.colorchange');
const commands = document.querySelectorAll('#command');
const spellcheckaction = document.querySelector('#spell')
const textbox = document.getElementById('notetext');
const savebutton = document.querySelector('#save')
const deletenote = document.querySelector('#delete')
const instruction = document.querySelector('#instruction')
const process = document.querySelector('.processresult')

// localStorage.setItem('tabloid_newtoken', offlinetoken());
var savestatus = true;
var newnote;
let colord = 'c3';
const {offline, _id} = JSON.parse(localStorage.getItem('tabloiduserdata'));
const offlinetabdata = localStorage.getItem('tabloid')
const offlineuniqueid = localStorage.getItem('tabloid_newtoken');
const dataid = new URLSearchParams(document.location.search).get('id')

//handler for process
function loading(eventn){
    if(eventn === 'start'){
        process.style.display = 'block';
        process.innerHTML = 'loading...Please hold on';
        process.style.color = `#8a910b`;
        process.style.background = `#f2ff0028`;
    }else{
        process.style.display = 'none';
    }
}
loading('start')

const processresult = (type, value)=>{
    process.style.display = 'block';
    if(type === 'err'){
        process.innerHTML = value;
        process.style.color = `f13939`;
        process.style.background = `dd373741`;
        
    }
    else{
        process.innerHTML = value;
    }
    
    setTimeout(() => {
        process.style.display = 'none';
    }, 3500);

}
//function that checks and reads;
const readdata = ()=>{
    const tempstore = JSON.parse(localStorage.getItem('tabloid'))
    const finddata = tempstore.find(data => data._id === dataid);
    if(offline){
        if(dataid){
            if(finddata){
                newnote = true;
                    instruction.style.display = 'none';
    ;
                textbox.innerHTML = finddata['notedata']
                colord = finddata['deccolor']
            }
            else{
                newnote = false;
            }
            checkinitialsave();
        }
    }
    else if(!offline){
    
        async function getdata(){
            const res = await fetch (`/api/v1/${_id}/:noteid`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            });
            const dataArray = await res.json();
            const finddata = dataArray.find(data => data._id === dataid);
            if(finddata){
                newnote = true;
                instruction.remove();
                textbox.innerHTML = finddata['notedata']
                colord = finddata['deccolor']
            }
            else{
                newnote = false;
            }
            checkinitialsave();
            showcolorUI()
        }
        getdata()
        
    }

    loading('stop')
    }
    readdata()
     
    


 //function to get current date
const getDate = ()=>{
    const date = new Date();
    let monthfinal;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    switch(month){
        case 1:
            monthfinal = 'Jan'
            break;
        case 2:
            monthfinal = 'Feb'
            break;
        case 3:
            monthfinal = 'Mar'
            break;
        case 4:
            monthfinal = 'Apr'
            break;
        case 5:
            monthfinal = 'May'
            break;
        case 6:
            monthfinal = 'Jun'
            break;
        case 7:
            monthfinal = 'Jul'
            break;
        case 8:
            monthfinal = 'Aug'
            break;
        case 9:
            monthfinal = 'Sep'
            break;
        case 10:
            monthfinal = 'Oct'
            break;
        case 11:
            monthfinal = 'Nov'
            break;
        case 12:
            monthfinal = 'Dec'
            break;
    }
    return `${monthfinal} ${day}`
    }
       
//return home button which will pop up a confirmation box if you haven't saved your data
returnhome.addEventListener('click', ()=>{

if(!savestatus){   
    if(!question.classList[1]){
        question.classList.toggle('displaytruef')

    }
}
else{

    window.location.href = 'app.html'
}
})
//close the pop up
closequestion.addEventListener('click', ()=>{
if(question.classList[1]){
    question.classList.toggle('displaytruef')
}
})

//open pick color div
changecolorfunc.addEventListener('click',()=>{
changecolorbody.classList.toggle('displaytruef')
} )

//pick color event function
colorpickcont.addEventListener('click', (e)=>{
const x = e.target;
if(x.id === 'color'){
    let newcolordata = x.classList[0];
    changecolordata(newcolordata)
    const y = colorpickcont.children;
    [...y].map(element => element.innerHTML = ``);
    x.innerHTML = `<i class="fas fa-check"></i>`;
    colord = x.classList[0];
}
})

//rich text editor fuction(depriciated)
commands.forEach(element =>{
element.addEventListener('click', ()=>{
    const celement = element.dataset['element'];

    document.execCommand(celement, false, null)

});
});
//return the save state to false
textbox.addEventListener('input', ()=>{
savestatus = false;
    instruction.remove();

})
instruction.addEventListener('click', ()=>{
        instruction.remove();

})
instruction.addEventListener('input', ()=>{
        instruction.remove();

})
//delete note
deletenote.addEventListener('click', ()=>{
    deletedata();
})

//show if spell check is active/not
spellcheckaction.addEventListener('click', ()=>{
if(!textbox.spellcheck){
    spellcheckaction.classList.toggle('active');
    textbox.spellcheck = true;
    
}
else{
    textbox.spellcheck = false;
    spellcheckaction.classList.toggle('active');
}

})

//savedata onclick event
savebutton.addEventListener('click', ()=>{
savedata();
savestatus= true;
})
let z;
//save data function logic
const savedata = async ()=>{
if(offline){
    if(offlinetabdata){
        const tempstore = JSON.parse(offlinetabdata);
        const newdata = {
            '_id': dataid,
            'deccolor': colord,
            'notedata': textbox.innerHTML,
            'lastModified': getDate()
        }

        async function newdatafiltered(){
            const newdatafiltered = await tempstore.filter(data => data._id !== dataid);
            // const indexnum = tempstore.indexOf(tempstore.filter(data => data._id === offlineuniqueid));
            const indexnu = tempstore.filter(data => data._id === dataid)[0];
            const indexnum = tempstore.indexOf(indexnu)
            if(indexnum < 0){
                const x = newdatafiltered;
                x.push(newdata);
                localStorage.setItem('tabloid', JSON.stringify(x))
            }
            else{
                const x = tempstore;
                x.splice(indexnum, 1, newdata)
                    localStorage.setItem('tabloid', JSON.stringify(x))
            }
        }
        newdatafiltered()
    }
    else{
        localStorage.setItem('tabloid', JSON.stringify([{
            '_id': dataid,
            'deccolor': colord,
            'notedata': textbox.innerHTML,
            'lastModified': getDate()
        }]))
    }

    window.location.reload();


    
}
else if(!offline){
    const idMain= JSON.parse(localStorage.getItem('tabloiduserdata'))._id;
    processresult('loading', 'Loading');

    let tempstore = [];

    async function savenote(){
        const res = await fetch (`/api/v1/${idMain}/:noteid`, {
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        });
        const data = await res.json();
        tempstore = data;

    const newdata = {
        '_id': dataid,
        'deccolor': colord,
        'notedata': textbox.innerHTML,
        'lastModified': getDate()
    }


     function newdatafiltered(){
        let newdatafiltered = tempstore.filter(data => data._id !== dataid);
        // const indexnum = tempstore.indexOf(tempstore.filter(data => data._id === offlineuniqueid));
        const indexnu = tempstore.filter(data => data._id === dataid)[0];
        const indexnum = tempstore.indexOf(indexnu)
        if(indexnum < 0){
            const x = newdatafiltered;
            x.push(newdata);
            newdatafiltered = x 
        }
        else{
            const x = tempstore;
            x.splice(indexnum, 1, newdata)
            
            newdatafiltered = x
        }

        async function savenotetodb(){

            const newarr = newdatafiltered
            const res = await fetch(`/api/v1/${_id}/:noteid`, {
                method: 'PATCH',
                body: JSON.stringify({newarr}),
                headers: {'Content-Type': "application/json"}
            })
            const data = await res.json();

           if(data.err){
            processresult('err', data.err)
           }
        }
        savenotetodb()
    }
    newdatafiltered()


}
savenote()
checkinitialsave();
processresult('done', 'Done')
}

newnote = true;
return "done"

}
option1.addEventListener('click',async ()=>{

    if(offline){

        savedata();
        savestatus= true;
        window.location.href = 'app.html'
    }
    else if(!offline){
        const status = await savedata();
        if(status=== "done"){
            savestatus= true;
                    question.classList.toggle('displaytruef')
        }
    }
})
option2.addEventListener('click', ()=>{
window.location.href = 'app.html'
})

//delete data and return home
const deletedata =  ()=>{
const offlinedata = JSON.parse(offlinetabdata);
if(offline){
    const newdata =  offlinedata.filter(data => data._id !== dataid);
    localStorage.setItem('tabloid', JSON.stringify(newdata))
    window.location.href = 'app.html'
}
if(!offline){
    async function getdata(){
        const res = await fetch (`/api/v1/${_id}/:noteid`, {
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        });
        const dataArray = await res.json();
        instruction.remove();
        
        const finddata = dataArray.filter(data => data._id !== dataid);
        async function todeletedata(){
            const newarr = finddata;
            const res = await fetch(`/api/v1/${_id}/:noteid`, {
                method: 'PATCH',
                body: JSON.stringify({newarr}),
                headers: {'Content-Type': "application/json"}
            })
            const data = await res.json();
            window.location.href = 'app.html'
        }
        todeletedata()
    }
    getdata()
}
}


//disable change color and delete if the note has not been initially saved
function checkinitialsave (){
    const check = newnote;
    if(!check){ 
        [changecolorfunc,deletenote].map(data => data.classList.toggle('disabled'));
        [changecolorfunc,deletenote].map(data => data.disabled = true )
    } else{

        [changecolorfunc,deletenote].map(data => (data)=>{
            if(data.classList[1]){
                data.classList.toggle('disabled')
            }
            data.disabled = false
        });
    }

}


//function to change the color data
const changecolordata =   (newcolordata)=>{
    const offlinedata = JSON.parse(offlinetabdata);
    if(offline){
        const finddata = offlinedata.find(data => data._id === dataid);
        const indexno = offlinedata.indexOf(finddata);
        finddata['deccolor'] = newcolordata;
        const newfinddata = finddata;
        offlinedata.splice(indexno, 1, newfinddata)
        localStorage.setItem('tabloid', JSON.stringify(offlinedata))
    } else {
        async function changecolor (){
            const res = await fetch (`/api/v1/${_id}/:noteid`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            });
            const dataArray = await res.json();
            let tempArray = dataArray;
            const finddata = tempArray.find(data => data._id === dataid);
            const indexno = tempArray.indexOf(finddata);
            finddata['deccolor'] = newcolordata;
            const newfinddata = finddata;
            tempArray.splice(indexno, 1, newfinddata);
            async function todeletedata(){
                const newarr = tempArray;
                const res = await fetch(`/api/v1/${_id}/:noteid`, {
                    method: 'PATCH',
                    body: JSON.stringify({newarr}),
                    headers: {'Content-Type': "application/json"}
                })
                const data = await res.json();
            }
            todeletedata()
        }
        changecolor();
    }
    colord= newcolordata;
    showcolorUI();
    }
    
    
    //show current /default color onload
    const showcolorUI =  ()=>{
    const offlinedata = JSON.parse(offlinetabdata);
    let finddata;
    if(offline){
        if(offlinedata.find(data => data.offlineid === dataid)){        
            finddata = offlinedata.find(data => data.offlineid === dataid)['deccolor'] || colord;
        }
        else{
            finddata = colord
        }
    }
    else if(!offline){
        finddata = colord;


    }
    const y = colorpickcont.children;
    [...y].map(element => {
        element.innerHTML = '';
        const x = element;
        if(x.classList[0] === finddata){
            colord = x.classList[0];
            x.innerHTML = `<i class="fas fa-check"></i>`
        }
    })
        
    }
    showcolorUI();

