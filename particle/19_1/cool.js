function cubeDance(){
    let even = 2;
    let w = 18; //22
    for(let x = 0; x < nob.width; x += w) for(let y = 0; y < nob.height; y += w){
        //let even = y%18==0;
        even--;
        if(!even){
            y -= w;
        }
        let xx = x+w/2+(!even?w/2:0);
        let yy = y+w/2+(!even?w/2:0);
        objs.push([
            xx,yy,
            0,0,
            {
                a:0,
                m:1,
                sx:xx, //x
                sy:yy //y
            }
        ]);
        if(even <= 0) even = 2;
    }
}
//cubeDance();

function drawRainbowCube(x,y,z){
    let img = images[0];
    nob.drawImage_basic_replace_dep(img,x-img.w/2,y-img.h/2,[255,255,255,255],[Math.floor(Math.sin(performance.now()/600)*127)+127,Math.floor(Math.sin(performance.now()/600+200)*127)+127,Math.floor(Math.sin(performance.now()/600+400)*127)+127,255],Math.floor(z),1); //Math.floor(can.height-z)
}