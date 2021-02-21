/*

SERVER SIDE FOR TIC-TAC-TOE CLIENT
Holds clients and allow them to connect to each other
Implemented with space for multiple client to-connections
Clients with multiple opponents currently not handled

*/


//port number
const p = 8989;
const WebSocket = require("ws");
const wss = new WebSocket.Server({port: p});

//contains all logged in clients
let clients = [];

//defines a client and some information about them; contains their socket
class Client {
    constructor(socket){
        this.username = "";
        this.loggedIn = false;
        this.inGame = false;
        this.peers = [];
        this.socket = socket;
        this.turn = false;
        this.board = [];
    }

    //log the client in; returns true if successful
    //returns false and fails if username is taken
    logIn(username){
        //cancel operation id
        clients.forEach(c => {
            if(c.username == username) return false;
        });
        this.username = username;
        this.loggedIn = true;
        return true;
    }

    //add a client to-connection for this and the other client
    connectTo(client2){
        //don't add if already added
        let i = 0;
        this.peers.forEach(c => {
            if(c.username == client2.username) i++;
        })
        if(i > 0){
            //add clients to each others peer lists
            this.peers.push(client2);
            client2.connectTo(this);
            this.inGame = true;
        }
    }

    //disconnect clients from each other
    dcFrom(client2){
        this.peers.forEach(c => {
            if(c.username == client2.username) {this.peers.splice(peers.indexOf(client2), 1); client2.dcFrom(this);}
        });
        if(this.peers.length < 1){
            this.inGame = false;
        }
    }

    //clear board
    clearBoard(){
        this.board.splice(0, this.board.length);
    }

    //send board to peers
    copyBoard(){
        this.peers.forEach(element => {
            element.board = this.board;
        });
    }

}

//handle new connections
wss.on("connection", (socket)=>{
    let client = new Client(socket);
    console.log("New client connection with id " + socket.userID);
    socket.on("message", (msg)=>{
        if(!client.loggedIn){
            if(!client.logIn(msg)){
                //tell client username is taken
            }
        }
        if(!client.inGame){
            client.connectTo(getClientFromName(msg));
            client.turn = true;
            getClientFromName(msg).turn = false;
        } else {
            manageGame(msg, client);
        }
    });
    ws.on("close", () =>{
        console.log("Client " + socket.userID + " has disconnected");
    });
});

//returns client from username
function getClientFromName(username){
    return clients.forEach(c => {
        if(c.username == username) return c;
    })
}

//handles game actions
//returns true if turn taken successfully
function manageGame(msg, client){
    if(client.turn){
        let move = msg.split(" ");
        if(client.board[move[0]] == undefined){
            client.board[move[0]] = move[1];
            client.copyBoard();
        }
        client.turn = false;
        return true;
    }
    return false;
}