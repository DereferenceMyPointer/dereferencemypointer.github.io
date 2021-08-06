function $(x){ return document.getElementById(x); }

const canvas = $(canvas);
canvas.width = innerWidth;
let width = canvas.width;
let height = canvas.height;
let ctx = canvas.getContext('2d');

function OnWindowResize(){
    let width = canvas.width;
    let height = canvas.height;
}

class Cell {
    
}

class World {
    constructor(cellSize){
        this.cellSize = cellSize;
        this.map = Array(canvas.width / cellSize).fill().map(()=>Array(canvas.height / n));
    }
}