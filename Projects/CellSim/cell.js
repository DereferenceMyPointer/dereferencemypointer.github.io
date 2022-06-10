"use strict";

class Grid {
    constructor(dimensions){
        this.grid = new Array(dimensions[0]);
        for(let i = 0; i < this.grid.length; i++){
            this.grid[i] = new Array(dimensions[1]);
        }
    }

    shortestPath(p1, p2){
        let sign = Math.sign((p1.y - p2.y) / (p1.x - p2.x));
        let slope = Math.abs((p1.y - p2.y) / (p1.x - p2.x));
        let iterations = math.abs(p1.y - p2.y);
        let outp = [grid[p1.y][p1,x]];
        for(let i = 0; i <= iterations; i++){
            outp.push(this._sPath(outp[i]), p1.y + slope * (outp[i].x + 1 - p1.x), sign);
        }
        return outp;
    }

    _sPath(point, yVal, direction){
        return this.grid[Math.floor(yVal)][point.x + direction];
    }

}

class Cell {
    constructor(){
        this.isSimulated = false;
    }

    update(){
    }

}

class Particle extends Cell {
    constructor(){
        super();
        this.isSimulated = true;
    }
}

class FallCell extends Cell {
    constructor(){

    }
}

class LiquidCell extends Cell {
    constructor(){

    }
}

class StaticCell extends Cell {
    constructor(){

    }
}