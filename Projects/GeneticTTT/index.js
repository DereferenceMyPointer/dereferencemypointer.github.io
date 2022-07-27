"use strict";

// Ended up being far too annoying to debug due to JS var passing -- too much work
// considering I was in the middle of midterms. May revisit, may forget about it

(function() {

    // Generic player class - meant to be controlled by user
    class Player {
        constructor(){
            this.victories = 0;
        }

        // placeholder
        async getMove(board, moveNum){
            console.log(board);
            return new Promise((resolve, reject) => {
                $("player-move").addEventListener("click", (e) => {
                    resolve([parseInt($("xpos").value), parseInt($("ypos").value)]);
                });
            });
        }

        win(){
            this.victories++;
        }

        lose(){}

    }

    // Player class controlled by AI
    class AIPlayer extends Player {
        constructor(network){
            super();
            this.network = network;
            this.victories = 0;
        }

        async getMove(board, moveNum){
            let inputs = [];
            for(let i = 0;  i < board.length; i++){
                for(let a = 0; a < board[i].length; a++){
                    inputs.push(board[a][i] * moveNum);
                }
            }
            let results = this.network.getResults(inputs);
            let max = -1;
            let index = 0;
            for(let i = 0; i < results.length; i++){
                if(results[i] > max){
                    index = i;
                }
            }
            return [Math.floor(index / 3), index % 3];
        }

        breedWith(other){
            this.network.breedWith(other.network);
        }

    }

    class Node {
        constructor(weights, biases){
            this.weights = weights;
            this.biases = biases;
            this.activation = 0;
        }

        randomNode(inputLayerLength){
            let weights = new Array(inputLayerLength);
            let biases = new Array(inputLayerLength);
            for(let i = 0; i < weights.length; i++){
                weights[i] = Math.random() * 10 - 5;
                biases[i] = Math.random() * 10 - 5;
            }
            return new Node(weights, biases);
        }

        activate(prevLayer){
            if(prevLayer.length != this.weights.length){
                throw new Error("Layer error");
            }
            let outp = 0;
            for(let i = 0; i < this.weights.length; i++){
                outp += this.weights[i] * prevLayer[i].activation + this.biases[i];
            }
            this.activation = 1 / (1 + Math.exp(-outp));
        }

        breed(other, mutationChance){
            let newWeights = [];
            let newBiases = [];
            if(other.weights.length != this.weights.length){
                throw new Error("Mismatched neurons");
            }
            for(let i = 0; i < other.weights.length; i++){
                let weight = 0;
                let bias = 0;
                if(Math.random() < mutationChance){
                    weight = Math.random() * 10 - 5;
                    bias = Math.random() * 10 - 5;
                }
                newWeights[i] = (other.weights[i] + this.weights[i]) / 2 + weight;
                newBiases[i] = (other.biases[i] + this.biases[i]) / 2 + bias;
            }
            return new Node(newWeights, newBiases);
        }

    }

    class Network {
        constructor(architecture){
            this.architecture = architecture.slice();
        }

        initArchitecture(){
            let arc = this.architecture.slice();
            let staticNode = new Node([[], []]);
            for(let i = 0; i < arc.length; i++){
                for(let a = 0; a < arc[i].length; a++){
                    if(arc[i-1]){
                        arc[i][a] = staticNode.randomNode(arc[i-1].length);
                    } else 
                        arc[i][a] = staticNode.randomNode(2);
                        
                    }
                }
            return new Network(arc);
        }

        getResults(inputValues){
            if(inputValues.length != this.architecture[0].length){
                throw new Error("Unmatched inputs");
            }
            for(let i = 0; i < inputValues.length; i++){
                this.architecture[0][i].activation = inputValues[i];
            }
            for(let i = 1; i < this.architecture.length; i++){
                for(let a = 0; a < this.architecture[i].length; a++){
                    this.architecture[i][a].activate(this.architecture[i-1]);
                }
            }
            return this.architecture[this.architecture.length - 1];
        }

        breedWith(other, mutationChance){
            let newArc = this.architecture.slice();
            for(let i = 1; i < newArc.length; i++){
                for(let a = 0; a < newArc[i].length; a++){
                    newArc[i][a].breed(other.architecture[i][a], mutationChance);
                }
            }
            return new Network(newArc);
        }
    }

    class Board {
        // construct new board given dimensions
        constructor(dimension){
            this.board = new Array(dimension);
            for(let i = 0; i < this.board.length; i++){
                this.board[i] = new Array(dimension).fill(0);
            }
        }

        async beginGame(players, callback){
            let currentMove = 1;
            this.clear();
            let currentPlayer = 0;
            while(this.evaluateBoard() == 0 && !this.blackout()){
                currentPlayer++;
                if(currentPlayer >= players.length){
                    currentPlayer = 0;
                }
                let move = await players[currentPlayer].getMove(this.board, currentMove);
                if(!this.validSquare(move)){
                    // message telling move does not work. they lose lmao
                    players[currentPlayer].lose();
                    players.forEach(element => {
                        if(element != players[currentPlayer]){
                            element.win();
                        }
                    });
                    if(callback){
                        callback();
                    }
                    return this.evaluateBoard();
                }
                this.board[move[0]][move[1]] = currentMove;
                if(this.evaluateBoard() != 0){
                    players[currentPlayer].win();
                    players.forEach(element => {
                        if(element != players[currentPlayer]){
                            element.lose();
                        }
                    });
                    if(callback){
                        callback();
                    }
                    return this.evaluateBoard();
                }
                currentMove *= -1;
            }
            if(callback){
                callback();
            }
            return this.evaluateBoard();
        }

        clear(){
            for(let i = 0; i < this.board.length; i++){
                this.board[i].fill(0);
            }
        }

        push(square, value){
            if(this.validSquare(square)){
                this.board[square[0]][square[1]] = value;
            }
        }

        validSquare(square){
            return this.board[square[0]][square[1]] == 0;
        }

        blackout(){
            return this.getValidSquares().length == 0;
        }

        getValidSquares(){
            let outp = []
            for(let i = 0; i < this.board.length; i++){
                for(let a = 0; a < this.board.length; a++){
                    if(this.validSquare([i, a])){
                        outp.push([i, a]);
                    }
                }
            }
            return outp;
        }

        evaluateBoard(){
            let dValue1 = this.board[0][0];
            let dValue2 = this.board[this.board.length - 1, this.board.length - 1];
            let d1Match = true;
            let d2Match = true;
            for(let i = 0; i < this.board.length; i++){
                let cMatch = true;
                let rMatch = true;
                let value1 = this.board[0][i];
                let value2 = this.board[i][0];
                for(let a = 0; a < this.board.length; a++){
                    if(cMatch){
                        cMatch = value1 == this.board[a][i];
                    }
                    if(rMatch){
                        rMatch = value2 == this.board[i][a];
                    }
                    if(d1Match && a == i){
                        d1Match = dValue1 == this.board[i][a];
                    }
                    if(d2Match && a == i){
                        d2Match = dValue2 == this.board[this.board.length - 1 - i][a];
                    }
                }
                if(cMatch) {
                    return value1;
                }
                if(rMatch){
                    return value2;
                }
            }
            if(d1Match){
                return dValue1;
            }
            if(d2Match){
                return dValue2;
            }
            return 0;
        }

    }

    // Module pattern
    window.addEventListener("load", init);
    const lineWidth = 2;
    const inset = 5;
    let canvas;
    let ctx;

    function init() {
        canvas = $("board");
        canvas.width = canvas.height;
        ctx = canvas.getContext("2d");
        clearBoard();
        $("start").addEventListener("click", event => {
            startIteration();
        });
    }

    function startIteration(){
        clearBoard();
        let boardSize = parseInt($("size").value);
        let bots = [];
        let boards = [];
        let arc1 = new Array(parseInt($("layers").value) + 2);
        arc1[0] = new Array(Math.pow(parseInt($("size").value), 2));
        for(let i = 1; i < parseInt($("layers").value) + 1; i++){
            arc1[i] = new Array(parseInt($("nodes").value));
        }
        arc1[arc1.length - 1] = new Array(Math.pow(parseInt($("size").value), 2));
        for(let i = 0; i < parseInt($("bots").value); i++){
            bots.push(new AIPlayer(new Network(arc1).initArchitecture()));
        }
        for(let i = 0; i < Math.pow(parseInt($("bots").value), 2) - parseInt($("bots").value); i++){
            boards.push(new Board(boardSize));
        }
        startGeneration(bots, boardSize, boards, 0);
    }

    async function startGeneration(bots, boardSize, boards, iteration){
        iteration++;
        let boardNum = 0;
        let games = [];
        for(let i = 0; i < bots.length; i++){
            for(let a = 0; a < bots.length; a++){
                if(a != i &&  boardNum < boards.length){
                    boardNum++;
                    games.push(new Promise((resolve, reject) => {
                        boards[boardNum].beginGame([bots[i], bots[a]]);
                        resolve();
                    }));
                }
            }
        }
        Promise.allSettled(games).then(() => {
            executeGeneration(bots, boardSize, boards, iteration);
        });
    }

    function executeGeneration(bots, boardSize, boards, iteration){
        let winningBots = [];
        bots.forEach(element => {
            if(element.victories > 0){
                winningBots.push(element);
            }
        });
        let mutatedBots = [1];
        let mostWins = 0;
        for(let i = 0; i < winningBots.length; i++){
            if(winningBots[i].victories > mostWins){
                mutatedBots[0] = winningBots[i];
            }
        }
        for(let i = 0; i < winningBots.length; i++){
            for(let a = 0; a < winningBots.length; a++){
                if(i != a && mutatedBots.length <= bots.length){
                    mutatedBots.push(winningBots[i].breedWith(winningBots[a]));
                }
                if(i == a){
                    mutatedBots.push(winningBots[i]);
                }
            }
        }
        console.log("survived 1");
        if(iteration < parseInt($("gens").value)){
            startGeneration(bots, boardSize, boards, iteration)
            console.log("survived 2");
        } else {
            $("p-input").classList.remove("hidden");
            console.log("survived 3");
            
            boards[0].beginGame([new Player(), mutatedBots[0]], () => {
                displayBoard(boards[0]);
            });
        }
    }

    function clearBoard(){
        let size = parseInt($("size").value);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0,0,canvas.width, canvas.height)
        ctx.fillStyle = "#ffffff";
        for(let i = 1; i < size; i++){
            ctx.fillRect(canvas.width * i / size, 0, lineWidth, canvas.height);
            ctx.fillRect(0, canvas.height * i / size, canvas.width, lineWidth);
        }
    }

    function displayBoard(board){
        clearBoard();
        for(let i = 0; i < board.length; i++){
            for(let a = 0; a < board.length; a++){
                if(board[i][a] == 1){
                    drawX([i, a]);
                }
                if(board[i][a] == -1){
                    drawO([i, a]);
                }
            }
        }
        console.log("survived 4");
    }

    function drawX(location, boardSize){
        ctx.fillStyle = '#ffffff';
        let ratio = canvas.width / boardSize;
        let offset = ratio / 2;
        ctx.fillText("X", location[0] * ratio + offset, location[1] * ratio + offset, 200);
    }

    function drawO(location, boardSize){
        ctx.strokeStyle = '#ffffff';
        let ratio = canvas.width / boardSize;
        let offset = ratio / 2;
        ctx.beginPath();
        ctx.arc(location[0] * ratio + offset, location[1] * ratio + offset, ratio / 2 - lineWidth * 2, 0, 2 * Math.PI);
        ctx.stroke();
    }

    /--------------------------- Helper Methods -----------------------------/

    function $(name){
        return document.getElementById(name);
    }

    function  getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect(),
            scaleX = canvas.width / rect.width,
            scaleY = canvas.height / rect.height;
      
        return {
          x: (evt.clientX - rect.left) * scaleX,
          y: (evt.clientY - rect.top) * scaleY
        }
      }

})();