var useCollision = false;
/**@type {Obj[]} */
var colls = [];
var _col = {};
class Obj{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    x;
    y;
    w;
    h;
}

//colls.push(new Obj(60,40,30,30));

function changeMode(m){
    for(let i = 0; i < objs.length; i++){
        objs[i].m = m;
    }
}