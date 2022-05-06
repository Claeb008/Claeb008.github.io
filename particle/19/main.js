/**@type {HTMLCanvasElement} */
const can = document.getElementById("can");
const ctx = can.getContext("2d");
const nob = new NobsinCtx(ctx);

const black = [0,0,0,255];

let objs = [];
for(let i = 0; i < 100000; i++){
    objs.push([
        Math.random()*nob.width,
        Math.random()*nob.height,
        Math.random()-0.5,
        Math.random()-0.5
    ]);
}

var cx = nob.centerX;
var cy = nob.centerY;

var drag = 0.01;
var ratio = 1;
var strength = 1;

var keys = {};
document.addEventListener("mousemove",e=>{
    cx = e.x/window.innerWidth*nob.width;
    cy = e.y/window.innerHeight*nob.height;
});
document.addEventListener("keydown",e=>{
    keys[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup",e=>{
    keys[e.key.toLowerCase()] = false;
});

function update(){
    window.requestAnimationFrame(update);
    nob.pixelCount = 0;
    nob.buf = new Uint8ClampedArray(nob.size);

    if(keys.q) drag = 0.05;
    else drag = 0;
    if(keys.w) ratio = -1;
    else ratio = 1;
    if(keys.e) strength += 0.1;
    else{
        strength -= 0.5;
        if(strength < 1) strength = 1;
    }

    for(let i = 0; i < objs.length; i++){
        let o = objs[i];

        let dx = o[0]-cx;
        let dy = o[1]-cy;
        let dist = Math.sqrt(dx**2+dy**2);
        o[2] -= dx/dist/10*ratio*strength;
        o[3] -= dy/dist/10*ratio*strength;

        if(o[2] >= drag) o[2] -= drag;
        else if(o[2] <= -drag) o[2] += drag;
        else o[2] = 0;
        if(o[3] >= drag) o[3] -= drag;
        else if(o[3] <= -drag) o[3] += drag;
        else o[3] = 0;

        o[0] += o[2];
        o[1] += o[3];

        nob.drawPixel(o[0],o[1],black);
    }

    ctx.putImageData(new ImageData(nob.buf,nob.width,nob.height),0,0);
}
update();
