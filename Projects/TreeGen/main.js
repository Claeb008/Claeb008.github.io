var can = document.getElementById("can");
can.width = 2560;
can.height = 1440;
var ctx = can.getContext("2d");

ctx.fillStyle = "brown";

function treeType(locx=0,locy=0,size=10){
    this.seg = {g:true,l:[locx,locy],p:[[0,size]]};
    this.grow = function(){
        const growBranch = (branch=>{
            branch.p.forEach(pp=>{
                if(pp[2]) if(pp[2].g) growBranch(pp[2]);
            });

            if(!branch.g) return;

            let scale = branch.p[branch.p.length-1][1]*0.9;
            if(scale < 3){
                branch.g = false;
                return;
            }
            let dat = [(Math.random()-0.5)/2,scale];
            if(scale>40?(Math.random() < 0.1):(Math.random()<0.2)){ //generate new branch
                let rot = Math.random()<0.5?0.5:-0.5;
                rot += (rot<0?-1:1)*Math.random()/2;
                let newScale = scale*0.9;
                if(Math.random() < 0.3) newScale /= 2; //sudden drop in size
                dat[2] = {g:true,l:[rot>0?newScale:-newScale,newScale/2],p:[[rot,newScale]]};
            }
            branch.p.push(dat);
        });
        growBranch(this.seg);
    };
    this.render = function(){
        ctx.resetTransform();
        ctx.translate(can.width/2,can.height);
        const renSeg = (segment,trans)=>{
            let partI = 0;
            ctx.translate(segment.l[0],segment.l[1]);
            segment.p.forEach(part=>{
                ctx.rotate(part[0]);
                ctx.translate(0,-part[1]*2);
                ctx.fillRect(0,0,part[1]*2,part[1]*3);
                partI++;

                if(part[2]) renSeg(part[2],ctx.getTransform());
            });
            if(trans) ctx.setTransform(trans);
        };
        renSeg(this.seg);
    };
}

var trees = [new treeType(0,0,50),new treeType(-800,0,20),new treeType(800,0,80)];
setInterval(function(){
    ctx.resetTransform();
    ctx.clearRect(0,0,can.width,can.height);
    trees.forEach(tree=>{
        tree.grow();
        tree.render();
    });
},1);
