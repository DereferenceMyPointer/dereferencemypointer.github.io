const width = innerWidth;
const height = innerHeight;
var canvas = document.querySelector('canvas');
canvas.height = height;
canvas.width = width;
const draw = canvas.getContext('2d');
console.log(canvas);
addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
})

let player;

let running = false;
const deltaTime = 60/1000;
const gravity = 9.8;
const gridSize = 50;
let game;
let groundOffset = 4;

class Game {
    constructor(speed) {
        this.allObjects = new Array();
        this.score = 0;
        this.currentOffset = 0;
        this.speed = speed;
    }

    gameUpdate() {
        this.drawAll();
        for (let i = 0; i < this.allObjects.length; i++) {
            this.allObjects[i].move();
            
        }
    }

    drawAll() {
        for (let i = 0; i < this.allObjects.length; i++) {
            let object = this.allObjects[i];
            draw.fillStyle = object.color;
            if (object.shape == 'rect') {
                draw.fillRect(object.posX * gridSize, object.posY * gridSize, gridSize, gridSize);
                draw.fillStyle = 'black';
                draw.strokeRect(object.posX * gridSize, object.posY * gridSize, gridSize, gridSize);
            } else if (object.shape == 'triangle') {
                let path = new Path2D();
                path.moveTo((sWidth / 2) + 50, sHeight / 2);
                path.lineTo((sWidth / 2), (sHeight / 2) - 50);
                path.lineTo((sWidth / 2) - 50, sHeight / 2);
                draw.fill(path);
            }
        }
    }

    addObject(object) {
        this.allObjects.push(object);
    }

}

//velocity is 2-vector, shape is a string {rect, triangle}
class GameObject {
    constructor(posX, posY, shape, color, initVelocity, gravityEnabled) {
        this.posX = posX;
        this.posY = posY;
        this.shape = shape;
        this.color = color;
        this.velocity = initVelocity;
        this.gravityEnabled = gravityEnabled;
    }

    move() {
        if (this.gravityEnabled) {
            this.fall();
        }
        this.collide();
        console.log(this.velocity);
        this.posX += this.velocity[0] * deltaTime;
        this.posY += this.velocity[1] * deltaTime;
        //stop if colliding on the appropriate side
    }

    fall() {
        this.velocity[1] += gravity * deltaTime;
    }

    collide() {
        for (let i = 0; i < game.allObjects.length; i++) {
            let cVector = this.detectCollision(game.allObjects[i]);
            
            if (this.velocity[0] > 0 && cVector[0] > 0) {
                this.velocity[0] = 0;
                this.posX -= 1 - cVector[0];
            }
            if (this.velocity[0] < 0 && cVector[0] < 0) {
                this.velocity[0] = 0;
                this.posX -= -1 - cVector[0];
            }
            if (this.velocity[1] > 0 && cVector[1] > 0) {
                this.velocity[1] = 0;
                this.posY -= 1 - cVector[1];
            }
            if (this.velocity[1] < 0 && cVector[1] < 0) {
                this.velocity[1] = 0;
                this.posY -= -1 - cVector[1];
            }
            /*
            if (cVector[0] != 0) {
                this.velocity[0] = 0;
            }
            if (cVector[1] != 0) {
                this.velocity[1] = 0;
            }
            */
        }
    }

    detectCollision(g) {
        let distX = Math.sqrt(Math.pow(g.posX - this.posX, 2));
        let distY = Math.sqrt(Math.pow(g.posY - this.posY, 2));
        if (distY < 1 || distX < 1) {
            if (distX >= 1) {
                return [0, g.posY - this.posY];
            }
            if (distY >= 1) {
                return [g.posX - this.posX, 0];
            }
            return [g.posX - this.posX, g.posY - this.posY];
        } else {
            return [0, 0];
        }
    }

}

class Player {
    constructor() {

    }

    jump() {

    }

}

function startGame() {
    player = new Player();
    addEventListener("onclick", player.jump());
    running = true;
    setInterval(update, 1000 / 60);
    canvas.width = width;
    canvas.height = height;
    game = new Game(0);
    let go = new GameObject(3, 0, 'rect', 'blue', [1, 0], true);
    for (let i = 0; i < width / gridSize; i++) {
        game.addObject(new GameObject(i, groundOffset, 'rect', 'grey', [0, 0], false));
    }
    game.addObject(go);
}

function update() {
    draw.fillStyle = 'black';
    draw.fillRect(0, 0, width, height);
    game.gameUpdate();
}

startGame();