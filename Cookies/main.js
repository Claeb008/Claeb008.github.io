var over = false;
var buto = document.getElementById("b");
//button.style.height = "100%";
var i = 0;
var i2 = 0;

function Reset()
{
	over = false;
  buto.style.backgroundColor = 'darkred';
  document.getElementById('s').innerHTML = '( ͡°╭͜ʖ╮͡° )';
}

var colors = [
	"red",
  "orange",
  "yellow",
  "green",
  "lightblue",
  "purple"
];
var texts = [
	"Press",
  "for",
  "free",
  "COOKIES"

];
function Update()
{
	if(over)
  {
  	buto.style.backgroundColor = colors[i];
    i++;
    if(i >= colors.length) i = 0;
  }
}
setInterval(Update,50);

function Update2()
{
	if(over)
  {
  	document.getElementById("s").innerHTML = texts[i2];
    i2++;
    if(i2 >= texts.length) i2 = 0;
  }
}
setInterval(Update2,900);
