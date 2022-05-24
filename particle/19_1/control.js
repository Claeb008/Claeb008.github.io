let cb_showCenter = getId("cb_showCenter");
let r_screen = getId("r_screen");
let r_mouse = getId("r_mouse");
let r_point = getId("r_point");
let i_xpos = getId("i_xpos");
let i_ypos = getId("i_ypos");
let cb_maxVel = getId("cb_maxVel");
let cb_minVel = getId("cb_minVel");
let i_maxVel = getId("i_maxVel");
let i_minVel = getId("i_minVel");
let r_circle = getId("r_circle");
let r_diamond = getId("r_diamond");
let cb_const = getId("cb_const");
let i_rotRate = getId("i_rotRate");
let i_springRate = getId("i_springRate");
let cb_glow = getId("cb_glow");
let i_glowCol = getId("i_glowCol");
let i_glowRad = getId("i_glowRad");
let i_glowOp = getId("i_glowOp");

//////////////

//Center of gravity
var showCenter = false;
const GravityCenter = {
    screen:0,
    mouse:1,
    point:2
};
var gravityCenter = GravityCenter.mouse;
var gravityPX = 0.5;
var gravityPY = 0.5;

//Max/Min velocity
var useMaxVel = false;
var useMinVel = false;
var maxVel = 2;
var minVel = 2;

//Dist calc
const DistCalc = {
    circle:0,
    diamond:1
};
var distCalc = DistCalc.circle;

//Constelation
var useConst = false;

//Rotation
var rotRate = 0;
var springRate = 0;

//Glow
var useGlow = false;

//Shape
const Shapes = {
    pixel:0,
    circle:1,
    line:2,
    arrow:3,
    cube:4,
    stars:5
};
var shape = Shapes.pixel;

//////////////

cb_showCenter.onclick = function(){
    showCenter = this.checked;
};
r_screen.onclick = function(){
    gravityCenter = GravityCenter.screen;
    cx = nob.centerX;
    cy = nob.centerY;
};
r_mouse.onclick = function(){
    gravityCenter = GravityCenter.mouse;
};
r_point.onclick = function(){
    gravityCenter = GravityCenter.point;
    cx = nob.width*gravityPX;
    cy = nob.height*gravityPY;
};
i_xpos.onkeydown = function(e){
    if(e.key.toLowerCase() != "enter") return;
    this.value = parseFloat(this.value);
    if(this.value > 1) this.value = 1;
    else if(this.value < 0) this.value = 0;
    gravityPX = this.value;
    if(gravityCenter == GravityCenter.point) cx = nob.width*gravityPX;
};
i_ypos.onkeydown = function(e){
    if(e.key.toLowerCase() != "enter") return;
    this.value = parseFloat(this.value);
    if(this.value > 1) this.value = 1;
    else if(this.value < 0) this.value = 0;
    gravityPY = this.value;
    if(gravityCenter == GravityCenter.point) cy = nob.height*gravityPY;
};

function toggleGlow(){
    if(useGlow){
        useGlow = false;
        return;
    }
    i_bgCol.value = "#000000";
    i_bgCol.oninput();
}
//toggleGlow();

update();