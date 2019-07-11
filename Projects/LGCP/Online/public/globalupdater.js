var finished = false;
var ver;
function GlobalUpdateLoop()
{
  if(database)
  {
    database.ref("LGCP/Info/stable").once('value',function(snap){
      ver = snap.val();
      //if(ver)
      {
        var over = document.getElementById("version").innerHTML.split(" ")[1].split("<")[0];
        if(over != ver)
        {
          window.location = "../" + ver;
        }
        finished = true;
      }
    });
  }
  if(!finished)
  {
    setTimeout(GlobalUpdateLoop,500);
  }
  else
  {
    if(document.getElementById("gu"))
    {
      document.removeChild(document.getElementById("gu"));
      document.body.removeChild(document.getElementById("gu"));
    }
    return;
  }
}
GlobalUpdateLoop();
