//https://claeb008.github.io/Projects/SoulSaver/EditorV1

var p1 = document.getElementById('program1');
var p1H = document.getElementById('program1Head');
var p1M = document.getElementById('p1MenuBar');
var overlay = document.getElementById('overlay');

var over = false;
var offset = {
  x: 0,
  y: 0
};

overlay.addEventListener('mousemove',function(e)
{
  console.log("YOU MOVED THE MOUSE!");
  if(e.which != 0 && over)
  {
    console.log(p1.width);
    p1H.style.marginLeft = (e.x - (p1.width / 2) < 0 ? 0 : e.x - (p1.width / 2)) + offset.x;
    p1H.style.marginTop = e.y;
  }

});
p1M.addEventListener('mouseenter',function(e)
{
  console.log("ENTER!!!!" + e);
  over = true;
});
overlay.addEventListener('mouseup',function(e)
{
  console.log("Upp!!!!" + e);
  over = false;
});
overlay.addEventListener('mousedown',function(e)
{
  //offset.x = p1H.style.marginLeft - e.x;
  //console.log(offset.x);
  console.log((p1H.style.marginLeft - "px"));
});

overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.zIndex = 11;
p1.style.zIndex = -5;
p1M.style.zIndex = 10;
//overlay.style.backgroundColor = "red";
