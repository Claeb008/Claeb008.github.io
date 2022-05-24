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

/**@type {Particle[]} */
let objs = [];
var objsId = 0;
class Particle{
    constructor(x,y,vx,vy){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
    x;
    y;
    vx;
    vy;
    m = 0;
    i = 0;
    move(lx,ly){
        let oo = Math.round(this.x+this.y*nob.width);
        /*if(dep[oo]){
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y)-1;
            this.move(0,0);
            return;
        }*/
        let tx = this.x;//+lx;
        let ty = this.y+ly;
        let to = Math.floor(tx+ty*nob.width);
        let col = false;
        if(dep[to]) col = true;
        else if(ty > nob.bottom){
            col = true;
            this.y = nob.bottom;
        }
        if(col){
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            this.vx = 0;//*= -0.5;
            this.vy = 0;//*= -0.5;
            oo = Math.round(this.x+this.y*nob.width);
            if(dep[oo+nob.width]){
                this.vy = 0;
                this.vx = 0;
            }
            return;
        }
        this.x += lx;
        this.y += ly;
        to = Math.round(this.x+this.y*nob.width);
        //dep[oo] = 0;
        //dep[to] = 1;
        //if(this.y > nob.bottom)
    }
    move_old(lx,ly){
        let t = this;
        let cols = [false,false];
        let ind = objs.indexOf(t);
        let lar = Math.abs(Math.abs(lx) > Math.abs(ly) ? lx : ly);
            let ax = lx/lar;
            let ay = ly/lar;
            let olx = lx;
            let oly = ly;
        //while(Math.abs(lx) > 0 || Math.abs(ly) > 0){  
        while(true){
            if(olx >= 0 && lx <= 0) break;
            if(olx <= 0 && lx >= 0) break;
            if(oly >= 0 && ly <= 0) break;
            if(oly <= 0 && ly >= 0) break;
            lx -= ax;
            ly -= ay;
            for(let j = ind; j < objs.length; j++){
                let c = objs[j];
                let dx = Math.abs(c.x-t.x);
                let dy = Math.abs(c.y-t.y);
                if(c.y < t.y+1 && dx < 1){
                    
                }
                /*if(dx > 1) continue;
                else if(){
                    cols[0] = true;
                }
                if(dy > 1) continue;
                else cols[1] = true;*/
            }
            if(!cols[0]) t.x += ax;
            if(!cols[1]) t.y += ay;
        }
    }
}
function createObj(x,y,vx,vy){
    objs.push(new Particle(x,y,vx,vy));
    return;
    objs.push([
        x,y,
        vx,vy,
        {
            a:0,
            id:objsId
        }
    ]);
    objsId++;
}

for(let i = 0; i < 100; i++){ //1000
    createObj(Math.random()*nob.width,Math.random()*nob.height,Math.random()-0.5,Math.random()-0.5);
}

var cx = nob.centerX;
var cy = nob.centerY;

var drag = 0.01;
var ratio = 1;
var strength = 1;

var red = [255,0,0,255];
var blue = [0,0,255,255];
var green = [0,255,0,255];

var keys = {};
document.addEventListener("mousemove",e=>{
    if(gravityCenter == GravityCenter.mouse){
        cx = e.x/window.innerWidth*nob.width;
        cy = e.y/window.innerHeight*nob.height;
    }
});
var tempMaxVel = 0;
var tempUseMaxVel = false;
var _keys = {};
function pressOnce(key){
    if(!_keys[key]){
        _keys[key] = true;
        return true;
    }
    return false;
}
document.addEventListener("keydown",e=>{
    let key = e.key.toLowerCase();
    keys[key] = true;
    if(key == "escape") togglePause();
    if(document.activeElement.tagName != "INPUT"){
        if(key == "r") window.location.reload(true);
        if(key == "1") shape = 0;
        else if(key == "2") shape = 1;
        else if(key == "3") shape = 2;
        else if(key == "4") shape = 3;
        else if(key == "5") shape = 4;
        else if(key == "6") shape = 5;
    }
});
document.addEventListener("keyup",e=>{
    let key = e.key.toLowerCase();
    keys[key] = false;
    if(document.activeElement.tagName == "INPUT") return;
    /*let ok = Object.keys(_keys);
    for(let i = 0; i < ok.length; i++){
        let cc = ok[i];
        _keys[cc] = false;
    }*/
});

//TEMP TESTING

var gradRad = 80; //4
var gradient = ctx.createRadialGradient(0, 0, gradRad/12, 0, 0, gradRad);
gradient.addColorStop(0, 'rgba(0,0,255,0.05)'); //0.2
gradient.addColorStop(1, 'rgba(48,48,48,0)');

//ctx.arc(x, y, radius, 0, 2 * Math.PI);

ctx.fillStyle = gradient;

//
var frames = 0;
var dep = new Uint8ClampedArray(nob.ssize);
function update(){
    if(paused) return;
    window.requestAnimationFrame(update);
    nob.pixelCount = 0;
    nob.buf = new Uint8ClampedArray(nob.size);
    nob.dep = new Uint8ClampedArray(nob.ssize);
    //setup
    if(useCollision){
        dep = new Uint8ClampedArray(nob.ssize);
        for(let i = 0; i < objs.length; i++){
            let o = objs[i];
            o.i = Math.floor(o[0]+o[1]*nob.width);
            dep[o.i] = 1;
            //dep[o.i-nob.width] = 1;
            //dep[o.i+nob.width] = 1;
            //dep[o.i+1] = 1;
            //dep[o.i-1] = 1;
        }
    }
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
        
        if(!o.m){
            if(pModes.includes(PMode.space)){
                let dx = o.x-cx;
                let dy = o.y-cy;
                let dist = 1;
                if(distCalc == DistCalc.circle) dist = Math.sqrt(dx**2+dy**2);
                else if(distCalc == DistCalc.diamond) dist = Math.abs(dx)+Math.abs(dy);
                let scale = 1;
                if(pModes.includes(PMode.gravity)) scale *= 0.05;
                if(false) if(dist < 80) scale = -scale*3; //CENTER RING
                o.vx -= dx/dist/10*ratio*strength*scale;
                o.vy -= dy/dist/10*ratio*strength*scale;
            }
            if(pModes.includes(PMode.gravity)){
                o.vy += 0.01;
            }
            if(bounce){
                if(o.y > nob.bottom){
                    o.vy = -o.vy/2;
                    if(Math.abs(o.vx) < 0.05) o.vx += (Math.random()-0.5)/2;
                    o.y = nob.bottom-1;
                }
                else if(o.y < 0){
                    o.vy = -o.vy/2;
                    if(Math.abs(o.vx) < 0.05) o.vx += (Math.random()-0.5)/2;
                    o.y = 0;
                }
                if(o.x > nob.right){
                    o.vx = -o.vx/2;
                    if(Math.abs(o.vy) < 0.05) o.vy += (Math.random()-0.5)/2;
                    o.x = nob.right-1;
                }
                else if(o.x < 0){
                    o.vx = -o.vx/2;
                    if(Math.abs(o.vy) < 0.05) o.vy += (Math.random()-0.5)/2;
                    o.x = 0;
                }
            }
            let maxV = useMaxVel;
            let _maxVel = maxVel;

            if(keys.a){
                maxV = true;
                _maxVel = 1;
            }
    
            if(maxV){
                if(o.vx > _maxVel) o.vx = _maxVel;
                else if(o.vx < -_maxVel) o.vx = -_maxVel;
                if(o.vy > _maxVel) o.vy = _maxVel;
                else if(o.vy < -_maxVel) o.vy = -_maxVel;
            }

            if(o.vx >= drag) o.vx -= drag;
            else if(o.vx <= -drag) o.vx += drag;
            else o.vx = 0;
            if(o.vy >= drag) o.vy -= drag;
            else if(o.vy <= -drag) o.vy += drag;
            else o.vy = 0;
    
            let vx = o.vx;
            let vy = o.vy;
            if(useMinVel){
                if(vx > 0 && vx < minVel) vx = minVel;
                else if(vx < 0 && vx > -minVel) vx = -minVel;
                if(vy > 0 && vy < minVel) vy = minVel;
                else if(vy < 0 && vy > -minVel) vy = -minVel;
            }

            o.move(vx,vy);
            //o.x += vx;
            //o.y += vy;

            let x = o.x;
            let y = o.y;
            //if(trail)
            //if(!data.trailI) data.trailI = 0;
            //if(data.trailI <= frames-30) 
            if(false){
                //data.trailI = frames;
                let x1 = x;
                let y1 = y;
                subAnim(60,function(){
                    nob.drawPixel(x1,y1,[255,0,255,50]);
                });
            }
            switch(shape){
                case 0:{
                    if(useGlow){
                        ctx.beginPath();
                        ctx.resetTransform();
                        ctx.translate(x,y);
                        ctx.arc(0, 0, gradRad, 0, 2 * Math.PI);
                        ctx.fill();
                        break;
                    }
                    nob.drawPixel(o.x,o.y,black);
                } break;
                case 1:{
                    nob.drawCircle(o.x,o.y,2,black);
                } break;
                case 2:{
                    let d = Math.sqrt(o.vx**2+o.vy**2);
                    let len = 4; //4
                    if(d == 0) d = 0.001;
                    let tx = o.vx/d*len;//-dx/dist*3;
                    let ty = o.vy/d*len//-dy/dist*3;
                    nob.drawLine_smart(x,y,x+tx,y+ty,black,1);
                } break;
                case 3:{
                    let d = Math.sqrt(o.vx**2+o.vy**2);
                    let len = 8; //4
                    if(d == 0) d = 0.001;
                    let tx = o.vx/d*len;//-dx/dist*3;
                    let ty = o.vy/d*len//-dy/dist*3;
                    let ang = Math.atan2(o.vy,o.vx);
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
                    let speed = Math.abs(o.vx)+Math.abs(o.vy);
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
        else if(o.m == 1){
            //data.sx*data.sy
            let z = Math.sin((o.x*o.y)/10000+performance.now()/600)*20;
            o.y = data.sy+z; //20
            drawRainbowCube(data.sx,o.y,z); //o.x/nob.width*(o.y/nob.height)*6
        }

        //let x = o.x;
        //let y = o.y;
        //nob.drawPixel(o.x,o.y,black);
        //nob.drawCircle(o.x,o.y,2,black);
        if(false){ //SHURIKENS
            let speed = Math.abs(o.vx)+Math.abs(o.vy);
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
            let d = Math.sqrt(o.vx**2+o.vy**2);
            let len = 8; //4
            if(d == 0) d = 0.001;
            let tx = o.vx/d*len;//-dx/dist*3;
            let ty = o.vy/d*len//-dy/dist*3;
            let ang = Math.atan2(o.vy,o.vx);
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
        //nob.drawCircle_grad(o.x,o.y,60,trans,false);
        //ctx.fillRect(x,y,10,10);

        /*ctx.beginPath();
        ctx.resetTransform();
        ctx.translate(x,y);
        ctx.arc(0, 0, gradRad, 0, 2 * Math.PI);
        ctx.fill();*/
    }

    //objs
    for(let i = 0; i < colls.length; i++){
        let c = colls[i];
        nob.drawLine_smart(c.x,c.y,c.x+c.w,c.y,black,1);
        nob.drawLine_smart(c.x,c.y+c.h,c.x+c.w,c.y+c.h,black,1);
        nob.drawLine_smart(c.x,c.y,c.x,c.y+c.h,black,1);
        nob.drawLine_smart(c.x+c.w,c.y,c.x+c.w,c.y+c.h,black,1);
    }
    //

    updateEvts();

    if(false) if(showCenter){
        let len = 4;
        nob.drawLine_smart(cx-len,cy,cx+len,cy,red,1);
        nob.drawLine_smart(cx,cy-len,cx,cy+len,red,1);
    }

    if(!useGlow){
        ctx.resetTransform();
        ctx.putImageData(new ImageData(nob.buf,nob.width,nob.height),0,0);
    }

    frames++;
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
    nob.ssize = w*h;
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
        createObj(x,y,0,0);
    }
};
b_spawnRandom.onclick = function(){
    for(let i = 0; i < amt; i++){
        createObj(Math.random()*nob.width,Math.random()*nob.height,0,0);
    }
};
b_spawnGrid.onclick = function(){
    let rat = nob.height/nob.width;
    let row = rat*amt;
    let col = amt/row;
    for(let x = 0; x < nob.width/2; x++){
        for(let y = 0; y < nob.height/2; y++){
            createObj(x*2,y*2,0,0);
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
i_color.value = "#ffffff";
i_bgCol.value = "#000000";
i_color.oninput = function(){
    black = parseColor(this.value);
};
i_bgCol.oninput = function(){
    document.body.style.backgroundColor = this.value;
};
i_color.oninput();
i_bgCol.oninput();