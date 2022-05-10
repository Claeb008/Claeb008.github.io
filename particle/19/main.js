/**@type {HTMLCanvasElement} */
const can = document.getElementById("can");
const ctx = can.getContext("2d");
const nob = new NobsinCtx(ctx);
nob.background = [0,0,0,0];
//nob.transparentBg = true;

ctx.globalCompositeOperation = "lighter";
var images = [];
images.push(tl.load("cube.png","cube"));

var black = [0,0,0,255];
var trans = [255,0,0,100];
var paused = false;
function togglePause(){
    if(!paused){
        paused = true;
        return;
    }
    paused = false;
    update();
}

let objs = [];
for(let i = 0; i < 10000; i++){ //1000
    objs.push([
        Math.random()*nob.width,
        Math.random()*nob.height,
        Math.random()-0.5,
        Math.random()-0.5,
        {
            a:0
        }
    ]);
}

var cx = nob.centerX;
var cy = nob.centerY;

var drag = 0.01;
var ratio = 1;
var strength = 1;

var keys = {};
document.addEventListener("mousemove",e=>{
    if(gravityCenter == GravityCenter.mouse){
        cx = e.x/window.innerWidth*nob.width;
        cy = e.y/window.innerHeight*nob.height;
    }
});
document.addEventListener("keydown",e=>{
    let key = e.key.toLowerCase();
    keys[key] = true;
    if(key == "escape") togglePause();
    if(document.activeElement.tagName != "INPUT"){
        if(key == "1") shape = 0;
        else if(key == "2") shape = 1;
        else if(key == "3") shape = 2;
        else if(key == "4") shape = 3;
        else if(key == "5") shape = 4;
        else if(key == "6") shape = 5;
    }
});
document.addEventListener("keyup",e=>{
    keys[e.key.toLowerCase()] = false;
});

//TEMP TESTING

var gradRad = 80; //4
var gradient = ctx.createRadialGradient(0, 0, gradRad/12, 0, 0, gradRad);
gradient.addColorStop(0, 'rgba(0,0,255,0.05)'); //0.2
gradient.addColorStop(1, 'rgba(48,48,48,0)');

//ctx.arc(x, y, radius, 0, 2 * Math.PI);

ctx.fillStyle = gradient;

//

function update(){
    if(paused) return;
    window.requestAnimationFrame(update);
    nob.pixelCount = 0;
    nob.buf = new Uint8ClampedArray(nob.size);
    nob.dep = new Uint8ClampedArray(nob.ssize);
    //
    if(useGlow){
        ctx.resetTransform();
        ctx.clearRect(0,0,can.width,can.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,can.width,can.height);
        ctx.fillStyle = gradient;
    }
    //
    if(false) for(let i = 0; i < nob.size; i += 4){
        nob.buf[i] = 255;
        nob.buf[i+1] = 255;
        nob.buf[i+2] = 255;
        nob.buf[i+3] = 0;
    }

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
        let data = o[4];

        if(!data.m){
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

            let x = o[0];
            let y = o[1];
            switch(shape){
                case 0:{
                    nob.drawPixel(o[0],o[1],black);
                } break;
                case 1:{
                    nob.drawCircle(o[0],o[1],2,black);
                } break;
                case 2:{
                    let d = Math.sqrt(o[2]**2+o[3]**2);
                    let len = 4; //4
                    if(d == 0) d = 0.001;
                    let tx = o[2]/d*len;//-dx/dist*3;
                    let ty = o[3]/d*len//-dy/dist*3;
                    nob.drawLine_smart(x,y,x+tx,y+ty,black,1);
                } break;
                case 3:{
                    let d = Math.sqrt(o[2]**2+o[3]**2);
                    let len = 8; //4
                    if(d == 0) d = 0.001;
                    let tx = o[2]/d*len;//-dx/dist*3;
                    let ty = o[3]/d*len//-dy/dist*3;
                    let ang = Math.atan2(o[3],o[2]);
                    nob.drawLine_smart(x,y,x+tx,y+ty,black,1);
                    nob.drawLine_smart(x+tx,y+ty,x+tx+Math.cos(ang-Math.PI*0.75)*len/2,y+ty+Math.sin(ang-Math.PI*0.75)*len/2,black,1);
                    nob.drawLine_smart(x+tx,y+ty,x+tx+Math.cos(ang+Math.PI*0.75)*len/2,y+ty+Math.sin(ang+Math.PI*0.75)*len/2,black,1);
                } break;
                case 4:{
                    let img = images[0];
                    //nob.drawImage_basic(img,x-img.w/2,y-img.h/2);
                    nob.drawImage_basic_replace_dep(img,x-img.w/2,y-img.h/2,[255,255,255,255],[Math.floor(Math.sin(performance.now()/600)*127)+127,Math.floor(Math.sin(performance.now()/600+200)*127)+127,Math.floor(Math.sin(performance.now()/600+400)*127)+127,255],Math.floor(can.height*2-y/2),0);
                } break;
                case 5:{
                    let speed = Math.abs(o[2])+Math.abs(o[3]);
                    //let ang = performance.now()/300*(speed/40);
                    o[4].a += speed/40;
                    let ang = o[4].a;
                    let len = 3;
                    let tx = Math.cos(ang)*len;
                    let ty = Math.sin(ang)*len;
                    nob.drawLine_smart(x-tx,y-ty,x+tx,y+ty,black,1);
                    nob.drawLine_smart(x+ty,y-tx,x-ty,y+tx,black,1);
                }
            }
        }
        else if(data.m == 1){
            //data.sx*data.sy
            let z = Math.sin((o[0]*o[1])/10000+performance.now()/600)*20;
            o[1] = data.sy+z; //20
            drawRainbowCube(data.sx,o[1],z); //o[0]/nob.width*(o[1]/nob.height)*6
        }

        //let x = o[0];
        //let y = o[1];
        //nob.drawPixel(o[0],o[1],black);
        //nob.drawCircle(o[0],o[1],2,black);
        if(false){ //SHURIKENS
            let speed = Math.abs(o[2])+Math.abs(o[3]);
            //let ang = performance.now()/300*(speed/40);
            o[4].a += speed/40;
            let ang = o[4].a;
            let len = 3;
            let tx = Math.cos(ang)*len;
            let ty = Math.sin(ang)*len;
            nob.drawLine_smart(x-tx,y-ty,x+tx,y+ty,black,1);
            nob.drawLine_smart(x+ty,y-tx,x-ty,y+tx,black,1);
        }
        if(false){ //ARROWS
            let d = Math.sqrt(o[2]**2+o[3]**2);
            let len = 8; //4
            if(d == 0) d = 0.001;
            let tx = o[2]/d*len;//-dx/dist*3;
            let ty = o[3]/d*len//-dy/dist*3;
            let ang = Math.atan2(o[3],o[2]);
            nob.drawLine_smart(x,y,x+tx,y+ty,black,1);
            nob.drawLine_smart(x+tx,y+ty,x+tx+Math.cos(ang-Math.PI*0.75)*len/2,y+ty+Math.sin(ang-Math.PI*0.75)*len/2,black,1);
            nob.drawLine_smart(x+tx,y+ty,x+tx+Math.cos(ang+Math.PI*0.75)*len/2,y+ty+Math.sin(ang+Math.PI*0.75)*len/2,black,1);
        }
        if(false){ //IMAGES
            let img = images[0];
            //nob.drawImage_basic(img,x-img.w/2,y-img.h/2);
            nob.drawImage_basic_replace_dep(img,x-img.w/2,y-img.h/2,[255,255,255,255],[Math.floor(Math.sin(performance.now()/600)*127)+127,Math.floor(Math.sin(performance.now()/600+200)*127)+127,Math.floor(Math.sin(performance.now()/600+400)*127)+127,255],Math.floor(can.height*2-y/2),0);
        }
        if(false) subAnim(3,function(i,t){
            nob.drawPixel(x,y,[0,0,0,(i)/t*255]);
        });
        //nob.drawCircle_grad(o[0],o[1],60,trans,false);
        //ctx.fillRect(x,y,10,10);

        /*ctx.beginPath();
        ctx.resetTransform();
        ctx.translate(x,y);
        ctx.arc(0, 0, gradRad, 0, 2 * Math.PI);
        ctx.fill();*/
    }

    updateEvts();

    if(!useGlow) ctx.putImageData(new ImageData(nob.buf,nob.width,nob.height),0,0);
}

///

const toggle = document.getElementById("toggle");
const cont = document.getElementById("cont");
toggle.open = true;
toggle.onclick = function(){
    if(this.open){
        this.open = false;
        cont.style.maxHeight = "0px";
        return;
    }
    this.open = true;
    cont.style.maxHeight = "500px";
};

///

const i_res = document.getElementById("i_res");
i_res.oninput = function(){
    let v = parseInt(this.value);
    if(Number.isNaN(v)) return;
    let w = 300*v;
    let h = 150*v;
    can.width = w;
    can.height = h;
    nob.width = w;
    nob.height = h;
    nob.centerX = nob.width/2;
    nob.centerY = nob.height/2;
    nob.size = w*h*4;
    nob.right = w-1;
    nob.bottom = h-1;
    nob.buf = new Uint8ClampedArray(nob.size);
    if(useGlow) ctx.globalCompositeOperation = "lighter";
};
function getId(id){
    return document.getElementById(id);
}
const b_clear = getId("b_clear");
b_clear.onclick = function(){
    objs = [];
};

var amt = 1000;
const i_amt = getId("i_amt");
i_amt.oninput = function(){
    amt = parseInt(this.value);
};

const b_spawnCircle = getId("b_spawnCircle");
const b_spawnRandom = getId("b_spawnRandom");
const b_spawnGrid = getId("b_spawnGrid");
b_spawnCircle.onclick = function(){
    let inc = Math.PI*2/amt;
    for(let i = 0; i < Math.PI*2; i += inc){
        let x = Math.cos(i)*nob.centerY+nob.centerX;
        let y = Math.sin(i)*nob.centerY+nob.centerY;
        objs.push([
            x,y,
            0,0,
            {
                a:0
            }
        ]);
    }
};
b_spawnRandom.onclick = function(){
    for(let i = 0; i < amt; i++){
        objs.push([
            Math.random()*nob.width,
            Math.random()*nob.height,
            0,0,
            {
                a:0
            }
        ]);
    }
};
b_spawnGrid.onclick = function(){
    let rat = nob.height/nob.width;
    let row = rat*amt;
    let col = amt/row;
    for(let x = 0; x < nob.width/2; x++){
        for(let y = 0; y < nob.height/2; y++){
            objs.push([
                x*2,
                y*2,
                0,0,
                {
                    a:0
                }
            ]);
        }
    }
};

function parseColor(s){
    s = s.replace("#","");
    let r = parseInt(s.substring(0,2),16);
    let g = parseInt(s.substring(2,4),16);
    let b = parseInt(s.substring(4,6),16);
    return [r,g,b,255];
}

const i_color = getId("i_color");
const i_bgCol = getId("i_bgCol");
i_color.value = "#000000";
i_bgCol.value = "#ffffff";
i_color.oninput = function(){
    black = parseColor(this.value);
};
i_bgCol.oninput = function(){
    document.body.style.backgroundColor = this.value;
};