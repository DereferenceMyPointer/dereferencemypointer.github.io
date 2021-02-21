const p = 8989
const WebSocket = require("ws");
const wss = new WebSocket.Server({port: p});
let online = 0;
let clients = [];

wss.on("connection", (socket, request) => {
    online++;
    console.log("New Connection! Online users: " + online);
    clients.push(socket);
    socket.on("message", (data)=>{
        console.log("Received message saying: " + data);
        clients.forEach(c=>{
            c.send(data);
        });
    });
    socket.on("close", ()=>{
        clients.filter(s=>s!==socket);
    });
});