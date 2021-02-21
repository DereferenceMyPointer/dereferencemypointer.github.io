const ws = new WebSocket("ws://localhost:8989");
var socket;
var submit = document.getElementById("button"); 
var toSend = document.getElementById("text");
var chatbox = document.getElementById("chatbox");

ws.onopen = ()=>{
    console.log("Connected");
    //send message upon click
    submit.addEventListener('click', ()=>{
        ws.send(toSend.value);
        toSend.value = "";
    });
};

ws.onmessage = (msg)=>{
    //add new message on screen
    chatbox.innerHTML += '<p>' + msg.data + '</p>';
};