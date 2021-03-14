//vars

const width = innerWidth;
const height = innerHeight;
var canvas = document.querySelector('canvas');
canvas.height = height;
canvas.width = width;
const draw = canvas.getContext('2d');

//init
draw.translate(canvas.width/2,canvas.height/2);
draw.fillStyle = 'black';
draw.fillRect(-width / 2, -height/2, width, height);
addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
})

/*

BODY

*/

drawRect(100, 100, 100, 30, 30);
let a = [[1, 0, 1], [1, 1, 2], [3, 1, 1]];
let b = [[2], [2], [2]];


function drawRect(l, w, d, degX, degY, fov){
    let c1 = [[l], [w], [d]];
    let c2 = [[l], [-w], [d]];
    let c3 = [[l], [w], [-d]];
    let c4 = [[-l], [w], [d]];
    let c5 = [[-l], [-w], [d]]
    let c6 = [[-l], [w], [-d]];
    let c7 = [[-l], [-w], [-d]]
    let c8 = [[l], [-w], [-d]];
    let box = [c1, c2, c3, c4, c5, c6, c7, c8];
    draw.fillStyle = 'black';
    draw.fillRect(-width / 2, -height/2, width, height);
    let box2 = new Array(8);
    for(let i = 0; i < box.length; i++){
        box2[i] = rotMat3dY(box[i], degY);
        box2[i] = rotMat3dX(box2[i], degX);
        box2[i] = adjFov(box2[i], fov);
        drawPoint(box2[i]);
    }
    for(let i = 0; i < box.length; i++){
        for(let a = 0; a < box2.length; a++){
            if( (box[i][0][0] == box[a][0][0] && box[i][1][0] == box[a][1][0])||
                (box[i][0][0] == box[a][0][0] && box[i][2][0] == box[a][2][0])||
                (box[i][1][0] == box[a][1][0] && box[i][2][0] == box[a][2][0])) drawLine(box2[i], box2[a]);
        }
    }
}

function drawPoint(a){
    draw.fillStyle = 'white';
    draw.fillRect(a[0][0], a[1][0], 5, 5);
}

function adjFov(p, fov){
    for(let i = 0; i < 2; i++){
        p[i][0] *= fov * Math.sign(p[0][0]) * 1 / (p[2][0]);
    }
    return p;
}

function drawLine(a, b){
    draw.strokeStyle = 'white';
    draw.beginPath();
    draw.lineWidth = '2';
    draw.moveTo(a[0][0], a[1][0]);
    draw.lineTo(b[0][0], b[1][0]);
    draw.stroke();
}

function operate(a, b){
    if(a[0].length != b.length) throw new Error("Indices don't match");
    let outp = new Array(a.length);
    for(let i = 0; i < a.length; i++){
        outp[i] = new Array(b[0].length);
        for(let u = 0; u < b[0].length; u++){
            let val = 0;
            for(let v = 0; v < b.length; v++){  
                val += b[v][u] * a[i][v];
            }
            outp[i][u] = val;
        }
    }
    return outp;
}

function vAdd(v1, v2){
    if(v1.length != v2.length) throw new Error("Inidices don't match");
    let outp = new Array(v1.length);
    for(let i = 0; i < v1.length; i++){
        outp[i] = v1[i] + v2[i];
    }
    return outp;
}

function dot(v1, v2){
    if(v1.length != v2.length) throw new Error("Inidices don't match");
    let outp = 0;
    for(let i = 0; i < v1.length; i++){
        outp += v1[i] * v2[i];
    }
    return outp;
}

function magnitude(v){
    return Math.sqrt(Math.abs(dot(v, v)));
}

function rotMat3dY(a, degr){
    let m = [[Math.cos(degr), 0, Math.sin(degr)], [0, 1, 0], [-Math.sin(degr), 0, Math.cos(degr)]];
    return operate(m, a);
}

function rotMat3dX(a, degr){
    let m = [[1, 0, 0], [0, Math.cos(degr), Math.sin(degr)], [0, -Math.sin(degr), Math.cos(degr)]];
    return operate(m, a);
}