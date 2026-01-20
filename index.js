// selection
let prompt = document.querySelector("#prompt");//select a prompt for chat
let submit = document.querySelector("#submit");//select a submit button for chat 
let chatcontainer = document.querySelector(".chat-container"); //select a chat container for chat

const API_KEY = "AIzaSyAuXvwAxrPuXEoIfxdLhELr6mruNRAoUHk";
const api_url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

 

// create chat box for user
function createChatbox(html,classes){ // to create a div for chat in which pass a html and classes
    let div = document.createElement("div");// create a div 
    div.innerHTML = html; // entered words are showing in a prompt 
    div.classList.add(classes)// add a class to a div
    return div
}

let user={
    message: null,
    file: {
        mime_type: null,
        data: null
    }
}
async function generateResponse(aiChatbox){
    let textArea = aiChatbox.querySelector(".ai-chat-area");
    let RequestOption = {
        method:"POST",
        headers:{"Content-Type":"application/json"},

        body:JSON.stringify({
            contents: [{parts: [{text: user.message},(user.file.data?[{"inline_data":user.file}]:[])]}]
        })
    }
    try{
        let response = await fetch(api_url,RequestOption)
        let data =await response.json();
        let aiText = data.candidates[0].content.parts[0].text;//this is for ai response
        textArea.innerHTML = aiText;//show ai response in text area
        console.log(aiText)
    }catch(error){
             textArea.innerHTML = "Error genrating response"
        console.log(error);
    }finally{
         chatcontainer.scrollTo({top:chatcontainer.scrollHeight, behavior:"smooth"}) // scroll to bottom
         Image.src='img.svg';
         Image.classList.remove("choose")
         user.file={}
        }
    
}

function HnadlechatResponse(message){//chat response
    user.message = message
    let html = `<img src="me.jpg" alt="" id="userImage" width="13">
            <div class="user-chat-area">
                ${user.message} 
                ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}"
                class="chosen-image"/>`
                :""
            }

            </div>`//a user chat box

            prompt.value="" //clear prompt area
            let userChatbox = createChatbox(html,"user-chat-box") //create a box for chat this is for user 
            chatcontainer.appendChild(userChatbox) //this is for sending a  message 
            chatcontainer.scrollTo({top:chatcontainer.scrollHeight, behavior:"smooth"}) // scroll to bottom
            console.log(user.data)

 //create chat box for ai
setTimeout(()=>{  // time out and start an ai answer
    let html = ` <img src="ai.jpg" alt = " " id="aiImage" width="13">
            <div class="ai-chat-area">  
            Typing...
            </div>`;            
            let aiChatbox = createChatbox(html,"ai-chat-box")//create an ai chat box
            chatcontainer.appendChild(aiChatbox) //send response to user 
            generateResponse(aiChatbox)    
},500)}


let Imagebtn = document.querySelector("#image");
let Image = document.querySelector("#image img");
let imageinput = document.querySelector("#fileInput");
imageinput.addEventListener("change",()=>{
    const file = imageinput.files[0];
    if(!file) return;
    let reader = new FileReader()
    reader.onload=(e)=>{
        let base64String = e.target.result.split(",")[1];
        user.file = {
        mime_type: file.type,
        data: base64String
    }
        console.log(e)
        Image.src = `data:${user.file.mime_type};base64,${user.file.data}`
        Image.classList.add("choose")
    }
               
            
    reader.readAsDataURL(file)
})
Imagebtn.addEventListener("click",()=>{
    Imagebtn.querySelector("input").click();
})


// to show msges
prompt.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        HnadlechatResponse(prompt.value)
    }    
})
submit.addEventListener("click",()=>{
    HnadlechatResponse(prompt.value)
})





