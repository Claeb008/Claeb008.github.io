//var can = document.getElementById('can');
//var ctx = can.getContext('2d');

//Variables
var players = [];
var playerID = -1;
var updated = false;
var c = document.getElementById("c");
var username = "";

var mainPieces = []
var mainDOMs = [];
var mode = -1;
var gameStarted = false;


if (typeof(Storage) !== "undefined")
{
  //localStorage.setItem('username',"Bob");
  username = localStorage.username;
  document.getElementById('name_i').value = localStorage.username;
  if(localStorage.color != null) document.getElementById('c').value = localStorage.color;
  //alert(username);
}


var config = {
  apiKey: "AIzaSyDfIFP4ZgQct3tg3jtvKqCaRR8V8kbVmTw",
  authDomain: "lgcp-9bb89.firebaseapp.com",
  databaseURL: "https://lgcp-9bb89.firebaseio.com",
  projectId: "lgcp-9bb89",
  storageBucket: "lgcp-9bb89.appspot.com",
  messagingSenderId: "192476211570"
};
firebase.initializeApp(config);
var database = firebase.database();

var newGameRef = firebase.database().ref('LGCP/Games');
var gSnap;
/*newGameRef.update({
  playerAmt: 0
});*/
newGameRef.on('value',function(snap){
  if(snap != gSnap) document.getElementById('loading_l').style = "visibility: hidden;";
  gSnap = snap;
  updated = true;


});

/*newGameRef.child('players').once('value',function(snap){
  var i = snap.key.substr(1,snap.key.length - 1));

  if(players[i])
  {
    //alert("Wait");
    return;
  };
  var player_d = document.createElement('p');
  player_d.innerHTML = "P";
  player_d.style = "color: blue;";
  document.getElementById('pBox').insertBefore(player_d,players[i - 1]);
  //var i = players.push(player_d);

  players[i] = player_d;
  //i--;
  console.log(i);

  if(user)
  {
    if(snap.user == user.uid) playerID = i;
  }

  newGameRef.child('players/p' + (i)).on('value',function(snap){
    //alert(i);
    //alert(snap.key);
    if(snap.child('x').exists() && players[i])
    {
      players[i].style.marginLeft = snap.val().x;
      players[i].style.marginTop = snap.val().y;
      players[i].style.color = snap.val().color;
    }
  });
});*/







var lGameRef;
function LStart(){
gameStarted = true;
lGameRef.child('players').on('child_added',function(snap){
  if(!lSnap) return;
  /*if(!lSnap.child('players/' + o).exists())
  {
    return;
  }*/
  //var snap = lSnap.child('players/' + o);

  var i;

    i = parseInt(snap.key);//snap.key.substr(1,snap.key.length - 1);

      console.log("i: " + i);


  //}
  //else
  //{

  //}
  //else if(!snap.child('x').exists()) return;
  //alert(snap.key);

  //i = gSnap.val().playerAmt;
  if(players[i])
  {
    //alert("Wait");
    return;
  };
  var player_d = document.createElement('p');
  player_d.innerHTML = "P";
  player_d.style = "color: blue; position: absolute;";
  players[i] = player_d;
  //if(snap.child('loc').exists())
  if(mainPieces.length > 0 || snap.child('loc').exists())
  {
    //document.getElementById('pBox').insertBefore(player_d,players[i - 1]);
    document.getElementById('area').appendChild(player_d);
    player_d.style.zIndex = 200;
    if(mainDOMs[snap.val().loc])
    {
      players[i].style.marginLeft = mainDOMs[snap.val().loc].style.marginLeft;
      players[i].style.marginTop = mainDOMs[snap.val().loc].style.marginTop;
      players[i].innerHTML = snap.key;//.substr(1,snap.key.length - 1);
    }
  }
  else
  {
    //document.getElementById('pBox').insertBefore(player_d,players[i - 1]);
  }

  //players[i] = player_d;

  console.log(i);

  if(user)
  {
    if(snap.user == user.uid) playerID = i;
  }
  else if(username != "")
  {
    if(username == snap.val().name) playerID = i;
  }
  if(localStorage.username == snap.val().name)
  {
    playerID = i;
    lGameRef.child('players/' + (i)).update({
      online: true
    });
  }
  //alert(snap.val().name + " : " + localStorage.username);

  lGameRef.child('players/' + (i)).on('value',function(osnap){
    if(osnap.child('loc').exists() && players[i])
    {

      players[i].style.color = osnap.val().color;

      //if(snap.child('loc').exists())
      if(mainPieces.length > 0 && osnap.child('loc').exists())
      {
        if(mainDOMs[osnap.val().loc])
        {
          mode = 1;
          players[i].style.marginLeft = mainDOMs[osnap.val().loc].style.marginLeft;
          players[i].style.marginTop = mainDOMs[osnap.val().loc].style.marginTop;
          players[i].innerHTML = osnap.key;//.substr(1,snap.key.length - 1);
        }
      }
      else
      {
        //players[i].style.marginLeft = snap.val().x;
        //players[i].style.marginTop = snap.val().y;
        //players[i].innerHTML = snap.val().name + (snap.val().online ? "" : " (Offline)");
      }

      /*for(i = 0; i < 4; i++)
      {

        var v = mainPieces[v_loc][i + parseInt(mainPieces[v_loc][4] == "'" ? 6 : 8)];
        console.log(v + " i " + i);
        if(lSnap.child('props/' + v + '/Subitem').exists())
        {
          alert("FIGHTING! - " + playerID);
          enemy = ('props/' + v + '/Subitem');
          //alert("parent = " + enemy.parent.key);
          lGameRef.child('players/' + playerID).update({fighting: {state: true, where: v}});
        }
      }*/

      //if(!osnap.child('fighting').exists())
      //{
        CheckAround();
      //}

    }
  });
});

lGameRef.child('players').on('child_removed',function(snap){
  //if(!snap.key.startsWith("p")) return;
  //if(snap.parent.key != "players") return;
  if(!snap.child('loc').exists()) return;
  lGameRef.child('players/' + (parseInt(snap.key))).off('value',function(snap){
    console.log('hopefully off now');
  });
  var i2 = parseInt(snap.key);
  //alert(i2);
  //document.getElementById(snap.child('loc').exists() ? 'area' : 'pBox').removeChild(players[i]);
  document.getElementById('area').removeChild(players[i2]);
  //players.splice(i,1);
  lGameRef.update({pAmt: lSnap.val().pAmt - 1});
  players[i2] = null;
});


}





function AddPlayer()
{
  if(!user)
  {
    alert("Please Log In First!");
    return;
  }

  if(!updated)
  {
    alert("Wait first");
    return;
  }
  updated = false;

  playerID = gSnap.val().playerAmt;
  newGameRef.child('players/p' + gSnap.val().playerAmt).update({
    color: "blue",
    x: 50,
    y: 50,
    user: user.uid,
    name: username
  });
  newGameRef.update({
    playerAmt: gSnap.val().playerAmt + 1
  });


}
function ClearGame()
{
  newGameRef.set({
    playerAmt: 0
    //players: "p0"
  });
  /*for(i = 0; i < players.length; i++)
  {
    newGameRef.child('players/p' + (i)).off('value',function(snap){
    });
  }*/

  //players = [];
  //document.getElementById('pBox').innerHTML = "";
}
function JoinGame()
{
  if(playerID != -1)
  {
    alert("You are already in a game!");
    return;
  }

  if(!gSnap)
  {
    alert("The Game Is Still Loading!");
    return;
  }

  if(!lSnap)
  {
    alert("You havent joined a game yet!");
    return;
  }



  playerID = lSnap.val().pAmt;
  lGameRef.child('players/' + lSnap.val().pAmt).update({
    color: "blue",
    name: localStorage.username,
    online: true,
    health: 4
  });
  if(mainPieces.length > 0)
  {
    lGameRef.child('players/' + lSnap.val().pAmt).update({
      loc: 0
    });
  }
  lGameRef.update({
    pAmt: lSnap.val().pAmt + 1
  });

}
function LeaveGame()
{
  if(playerID == -1)
  {
    alert("You arent even in a game!");
    return;
  }
  if(!lSnap)
  {
    alert("You havent joined a game yet!");
  }
  lGameRef.child("players/" + playerID).set({});
  playerID = -1;
  lGameRef.update({
    //playerAmt: gSnap.val().playerAmt - 1
  });
}
var mScale = 20;
var ax = 0;
var ay = 0;
var area = document.getElementById('area');
var enemy;
var v_loc;

function CheckAround()
{
  for(i = 0; i < 4; i++)
  {
    if(!mainPieces[v_loc] || lSnap.child('players/' + playerID + "/fighting").exists()) return;
    var v = mainPieces[v_loc][i + parseInt(mainPieces[v_loc][4] == "'" ? 6 : 8)];
    console.log(v + " i " + i);
    //lGameRef.once('value',function(snap){
      if(lSnap.child('props/' + v + '/Subitem').exists())
      {
        if(lSnap.child('props/' + v + '/Subitem/health').val() > 0)
        {
          alert("FIGHTING! - " + playerID);
          enemy = ('props/' + v + '/Subitem');
          //alert("parent = " + enemy.parent.key);
          lGameRef.child('players/' + playerID).update({fighting: {state: true, where: v}});
        }
      }
    //});

  }
}

document.addEventListener('keydown',function(e){
  var key = e.key;
  if(mode == 1)
  {
    if((key == "ArrowUp" || key == "ArrowDown" || key == "ArrowRight" || key == "ArrowLeft"))
    {
      e.preventDefault();
      var curP = lSnap.child('players/' + playerID);
      var dir = (key == "ArrowUp" ? 1 : key == "ArrowDown" ? 0 : key == "ArrowRight" ? 3 : key == "ArrowLeft" ? 2 : -1);
      if(dir != -1 && mainPieces[curP.val().loc][dir + parseInt(mainPieces[curP.val().loc][4] == "'" ? 6 : 8)] != -1)
      {
        v_loc = parseInt(mainPieces[curP.val().loc][dir + parseInt(mainPieces[curP.val().loc][4] == "'" ? 6 : 8)]);
        //var loc = parseInt(mainPieces[curP.val().loc][dir + parseInt(mainPieces[curP.val().loc][4] == "'" ? 6 : 8)]);
        lGameRef.child('players/' + playerID).update({
          loc: v_loc
        });
//CheckAround();
        /*for(i = 0; i < 4; i++)
        {

          var v = mainPieces[v_loc][i + parseInt(mainPieces[v_loc][4] == "'" ? 6 : 8)];
          console.log(v + " i " + i);
          if(lSnap.child('props/' + v + '/Subitem').exists())
          {
            alert("FIGHTING! - " + playerID);
            enemy = ('props/' + v + '/Subitem');
            //alert("parent = " + enemy.parent.key);
            lGameRef.child('players/' + playerID).update({fighting: {state: true, where: v}});
          }
        }*/
      }
    }

    //Tests
    if(key == "u")
    {
      var g =
      {
        som: 2,
        one: 1,
        fo: 4
      };
      console.log(g);
      console.log(g.fo);
      console.log(g[1]);
    }

    //Rolling
    if(key == "r")
    {
      var roll = Math.floor(Math.random() * 6);
      var curMoves = (roll > 3 ? roll - 2 : roll); // 0 = move 1 space : 1 = shield : 2 = move 2 spaces : 3 = move 3 spaces
      if(lSnap.child('players/' + playerID).val().fighting.state) //if you are fighting
      {
        var me = lSnap.child('players/' + playerID).val();
        if(roll == 1 || roll == 3 || roll == 0) //DESTROY
        {

          alert("Start HIS HEALTH IS " + lSnap.child(enemy).val().health);

          alert("HIS HEALTH IS " + (parseInt(lSnap.child(enemy).val().health) - 1));
          if(parseInt(lSnap.child(enemy).val().health) - 1 <= 0)
          {

            lGameRef.child('props/' + me.fighting.where).set({});
            lGameRef.child('players/' + playerID + "/fighting").set({});
            CheckAround();
            //alert("DESTROYED");
            console.log("DESTREOYED");

            return;
          }
          else
          {

          }
          lGameRef.child('props/' + me.fighting.where + "/Subitem").update({health: lSnap.child(enemy).val().health - 1});
        }
        else // SKULL / FAILED
        {
          lGameRef.child('players/' + playerID).update({health: me.health - parseInt(lSnap.child(enemy).val().health)});
          alert("SKULL / FAILED - YOU LOST " + lSnap.child(enemy).val().health + " HEALTH");
        }
      }
    }
  }
  else
  {
    if(key == "ArrowLeft" || key == "ArrowRight") lGameRef.child('players/' + playerID).update({x: lSnap.child('players/' + playerID).val().x + (key == "ArrowRight" ? 10 : -10)});
    if(key == "ArrowUp" || key == "ArrowDown") lGameRef.child('players/' + playerID).update({y: lSnap.child('players/' + playerID).val().y + (key == "ArrowDown" ? 10 : -10)});
  }


  if(key == "d" || key == "a")
  {
    ax += (key == "d" ? -mScale : mScale);
    area.style.marginLeft = ax;
  }
  if(key == "w" || key == "s")
  {
    ay += (key == "w" ? mScale : -mScale);
    area.style.marginTop = ay;
  }
  //if(key == "a") console.log(players);//players[0].style.marginLeft += 10;
});

function Update()
{
  /*if(gSnap)
  {
    for(i = 0; i < gSnap.val().playerAmt; i++)
    {
      //alert(i);
      if(gSnap.child('players/p' + i).exists() && i != playerID)
      {
        if(gSnap.child('players/p' + i).val().name == document.getElementById('name_i').value)
        {
          //document.getElementById('name_i').value = localStorage.username;
          //alert("That Username Is Already Taken!");
          return;
        }
      }

    }
  }*/




  if(playerID != -1 && lSnap && lSnap.child('players/' + playerID).val().color != c.value)
  {
    lGameRef.child('players/' + playerID).update({
      color: c.value,
    });
  }




}
setInterval(Update,20);

function SaveUsername()
{
  if(lSnap)
  {
    for(i = 0; i < lSnap.val().pAmt; i++)
    {
      //alert(i);
      if(lSnap.child('players/' + i).exists() && i != playerID)
      {
        if(lSnap.child('players/' + i).val().name == document.getElementById('name_i').value)
        {
          document.getElementById('name_i').value = localStorage.username;
          alert("That Username Is Already Taken!");
          return;
        }
      }

    }
  }

  //if(localStorage.username != document.getElementById('name_i').value)
  {
    localStorage.username = document.getElementById('name_i').value;
    if(playerID != -1) lGameRef.child('players/' + playerID).update({
      name: localStorage.username
    });
    localStorage.color = document.getElementById('c').value;
  }
}

//LEAVING A GAME
window.onunload = LeaveGameOnline;

function LeaveGameOnline()
{
  if(playerID != -1)
  {
	if(!lGameRef) return;
    lGameRef.child('players/' + playerID).update({
      online: false
    });
  }
}

//LOAD BASIC DATA
var usableObjsLocs,usableColors = [], uo, res = [];
firebase.database().ref('objLocs2D/').once('value',function(snap){
  uo = snap;
  /*for(i2 = 0; i2 < snap.val().length; i2++){
    uo.push();
  for(i = 0; i < snap.child(i2).val().length; i++)
  {
    var o = snap.child(i2).child(i);
    var o1 =
    {
      p:
      {
        left: o.val().p.left,
        top: o.val().p.top
      },
      gom:
      {
        width: o.val().gom.width,
        height: o.val().gom.height
      }
    };
    //usableObjsLocs.push(snap.child(i).val());
  }}*/
 // usableObjsLocs.push();
 //alert(uo);

});
firebase.database().ref('colors/').once('value',function(snap){
  for(i = 0; i < snap.val().length; i++)
  {
    usableColors.push({color: snap.child(i).val().color, op: snap.child(i).val().op + 0.25, reflect: (snap.child(i).val().reflect)});//new colors(snap.child(i).val().color,snap.child(i).val().op));

  }
  //alert(usableColors[1].color);
  console.log("LOAD COLORS COMPLETE");
  //alert(usableColors[16].reflect);
  //alert(usableColors[0].reflect);
});


function colors(color,op)
{
  this.color = color;
  this.op = op;
}
var map,res,prop,pieceIds;
//LOAD MAP
function LoadMap(mode)
{
  if(mainPieces.length > 0)
  {
    alert("Your already in a LGCP game!");
    return;
  }
  map = document.getElementById("map_loc").value;


  var gr = document.getElementById("game_i").value;

  if(mode == 1)
  {
    for(i = 0; i < gSnap.child(gr).val().amt; i++)
    {
      res.push(gSnap.child(gr + "/pieces/" + i).val());
    }
  }
  else
  {
    res = map.split("&");
  }

  for(i = 0; i < res.length; i++)
  {
    var prop = res[i].split(",");
      //if(!pieceIds.includes(prop[0])) pieceIds.push(prop[0]);
  }
  console.log("FINISHED ADDING TO PIECESIDS ARRAY");
  console.log(pieceIds);

var ar = [];
  for(i = 0; i < res.length; i++)
  {
    console.log(i);
    var prop = res[i].split(",");

      var mid = prop[0].split(".");

      //if(usableObjs[mid[0]][mid[1]])
      //if(mid[0] == "0")
      if(uo.child(mid[0]).child(mid[1]).exists())
      {
        var o = uo.child(mid[0]).child(mid[1]).val();
      //ImportPiece("https://Claeb008.github.io/objs/" + prop[0] + "/" + usableObjsLocs[prop[0]][prop[1]], prop[2], prop[3], prop[4], 2);
      var colObj = usableColors[parseInt(prop[(prop[4] == "'" ? 5 : 7)])];
      if(!colObj) colObj = new colors("gray",100);
      var head = document.createElement('div');
      var gom = document.createElement('div');
      //var go = document.createElement('p');
      //go.innerHTML = "o";
      ////////if(mid[1] == "1") go.style = "margin-left: 3.3px; margin-top: 6px;";
      //go.style = "margin-left: " + o.p.left + "px; margin-top: " + o.p.top + "px;";
      //gom.appendChild(go);
      head.appendChild(gom);
      head.style = "position: absolute;"; //transform: rotate(" + (prop[4] != "'" ? parseFloat(prop[6]) : 0) + "deg);";
      gom.style = "transform: rotate(" + (prop[4] != "'" ? parseFloat(prop[6]) : 0) + "deg);" + "position: absolute;";//width: " + o.gom.width + "px; height: " + o.gom.height + "px;"; //background-color: " + (colObj.color.startsWith("0") ? "#" + colObj.color.substr(2,6) : colObj.color) + ";";
      gom.innerHTML = o.src;//'<svg id="s" width="15px" height="30px"><rect id="r" width="15px" height="30px" style="fill:#ff0000;" /><circle cx="7.5" cy="15" r="4" stroke="rgb(0,0,0)" stroke-width="1" fill-opacity="0" stroke-opacity="0.3" /></svg>';
      //Tests
      ar.push(i);
      gom.id = i;
      gom.onclick = function(e)
      {
        console.log("PIECE at " + this.id);
      }
      //if(prop[4] != "'" && prop[6] != "0") head.style += " transform: rotate(" + prop[6] + "deg);";
      //gom.style += " transform: rotate(45deg);";
      if(mid[0] == "5") console.log("begin");
      if(mid[0] == "5")
      {
        for(h = 0; h < 4; h++) //o.cir.h
        {
          console.log("h: " + h);
          for(v = 0; v < 4; v++)
          {
            console.log("v: " + v);
            var num_h = (h * 15 + 7.5);//((o.cir.h * 15) / 2);
            var num_v = (v * 15 + 7.5);
            gom.innerHTML += '<circle cx="' + num_h + '" cy="' + num_v + '" r="4" stroke="rgb(0,0,0)" stroke-width="1" fill-opacity="0" stroke-opacity="0.3" />';
          }
        }
        gom.innerHTML += "</svg>";
      }
      else
      {
        if(mid[0] == "5") console.log("false and end");
      }
      //"color: black; position: absolute; width: 10px; height: 10px; background-color: red"; //(colObj.color.startsWith("0") ? parseInt(colObj.color) : colObj.color);
      document.getElementById('area').appendChild(head);
      document.getElementById('r').style.fill = (colObj.color.startsWith("0") ? "#" + colObj.color.substr(2,6) : colObj.color);
      document.getElementById('r').id = "l";

      /*if(mid[1] == "1")
      {
        go.style.marginLeft = gom.style.width / 9;
        gom.style.width = 15;

      }
      go.style.marginLeft = (gom.style.width / 3);*/

      //var go = //new THREE.Mesh(usableObjs[mid[0]][mid[1]].geometry, new THREE.MeshPhongMaterial({envMap: cubeMap,color: (colObj.color.startsWith("0") ? parseInt(colObj.color) : colObj.color),transparent: (colObj.op < 1),opacity: colObj.op,reflectivity: (colObj.reflect ? 1 : 0.55),specular: 0xaaaaaa,shininess: 10}));//,roughness: (colObj.reflect ? 0 : 0.1)})); // 5 //specular: 0x222222,shininess: 50 //5
      //go.position.set(parseInt(prop[1]) * 4, parseInt(prop[3]) * 4, parseInt(prop[2]) * 4); // 2, 3, 4
      head.style.marginLeft = parseFloat(prop[1]) * 1.5 + 1000 + (o.off ? o.off.left : 0);
      head.style.marginTop = parseFloat(prop[2]) * 1.5 + 500 + (o.off ? o.off.top : 0);
      head.style.zIndex = parseFloat(prop[3]);


      if(prop[4] != "'")
      {
           //go.rotateAroundWorldAxis(new THREE.Vector3(1,0,0), parseFloat(prop[4]) * Math.PI/180);
           //go.rotateAroundWorldAxis(new THREE.Vector3(0,1,0), -parseFloat(prop[6]) * Math.PI/180);
           //go.rotateAroundWorldAxis(new THREE.Vector3(0,0,1), parseFloat(prop[5]) * Math.PI/180);
          //if(go.rotation.y != 0 && go.rotation.z != 0)
          {
            //var x = go.rotation.x;
            //var z = go.rotation.z;
            //var y = go.rotation.y;
            //go.rotation.y = z;
            //go.rotation.x = -z;
            //go.rotation.z = x;
              //console.log(go.rotation.z);
               //go.rotation.z *= -1;
               //console.log(go.rotation.z);

          }
          //go.rotation.set(-45 * Math.PI / 180,0 * Math.PI / 180,0 * Math.PI / 180);
          //go.rotateZ(parseFloat(prop[]));
          //go.rotation.z *= (parseFloat(prop[5]) >= 0 ? -1 : 1)// 4, 5, 6 //45 * Math.PI / 180
      }



      //mainPieces.push([parseInt(prop[0]),parseInt(prop[1]),parseInt(prop[2]),parseInt(prop[3]),parseInt(prop[4]),parseInt(prop[5]), /*Tiles*/ parseInt(prop[6]),parseInt(prop[7])]);
      mainPieces.push(prop);
      mainDOMs.push(head);
      head.props = prop;



      //var str = pieces.push(go);

      }

  }
  /*if(playerID != -1)
  {
    mode = 1;
    //alert(playerID);
    newGameRef.child('players/p' + playerID).update({
      mode: (gSnap.child('players/p' + playerID).val().mode ? gSnap.child('players/p' + playerID).val().mode : 0) + 1
    });
  }

  for(p = 0; p < lSnap.val().pAmt; p++)
  {
    if(lSnap.child('players/' + p).exists())
    {
      lGameRef.child('players/' + p).update({
        x: lSnap.child('players/' + p).val().x + 1
      });
    }
  }*/
}
//var lGameRef;
var lSnap;
function LoadGame()
{
  if(!gSnap.child(document.getElementById("game_i").value).exists())
  {
    alert("That game does not exist!");
    return;
  }
  LoadMap(1);
  lGameRef = newGameRef.child(document.getElementById("game_i").value);
  lGameRef.on('value',function(snap){

    /*if(lSnap && snap.child('players/' + playerID).exists())
    {
      if(lSnap.child('players/' + playerID).val().loc != snap.child('players/' + playerID).val().loc)
      {
        for(i = 0; i < 4; i++)
        {

          var v = mainPieces[v_loc][i + parseInt(mainPieces[v_loc][4] == "'" ? 6 : 8)];
          console.log(v + " i " + i);
          if(snap.child('props/' + v + '/Subitem').exists())
          {
            alert("FIGHTING! - " + playerID);
            enemy = ('props/' + v + '/Subitem');
            //alert("parent = " + enemy.parent.key);
            lGameRef.child('players/' + playerID).update({fighting: {state: true, where: v}});
          }
        }
      }
    }*/



    lSnap = snap;
    //LLoadPlayers();
    if(!gameStarted) LStart();
    else
    {
      //Subitem stuff

    }

    if(playerID == 0)
    {
      if(lSnap.child('requests').exists())
      {

      }
    }
  });

}
function AdminUploadGame(level)
{
  if(document.getElementById("game_i").value.length <= 0) return false;

  map = level;
  res = map.split("&");
  var updates = {};


  for(i = 0; i < res.length; i++)
  {
    updates[i] = res[i];
  }
  //updates['amt'] = res.length;
  //updates['pAmt'] = 0;
  newGameRef.child(document.getElementById("game_i").value).set({amt: res.length, pAmt: 0});
  newGameRef.child(document.getElementById("game_i").value + '/pieces').set(updates);
}

function LLoadPlayers()
{
  for(o = 0; o < lSnap.val().pAmt; o++)
  {
    if(!lSnap.child('players/' + o).exists())
    {
      return;
    }
    var snap = lSnap.child('players/' + o);
    console.log("i: " + o);
    var i;

      i = parseInt(snap.key);//snap.key.substr(1,snap.key.length - 1);


    //}
    //else
    //{

    //}
    //else if(!snap.child('x').exists()) return;
    //alert(snap.key);

    //i = gSnap.val().playerAmt;
    if(players[i])
    {
      //alert("Wait");
      return;
    };
    var player_d = document.createElement('p');
    player_d.innerHTML = "P";
    player_d.style = "color: blue; position: absolute;";
    players[i] = player_d;
    //if(snap.child('loc').exists())
    if(mainPieces.length > 0 || snap.child('loc').exists())
    {
      //document.getElementById('pBox').insertBefore(player_d,players[i - 1]);
      document.getElementById('area').appendChild(player_d);
      player_d.style.zIndex = 200;
      if(mainDOMs[snap.val().loc])
      {
        players[i].style.marginLeft = mainDOMs[snap.val().loc].style.marginLeft;
        players[i].style.marginTop = mainDOMs[snap.val().loc].style.marginTop;
        players[i].innerHTML = snap.key;//.substr(1,snap.key.length - 1);
      }
    }
    else
    {
      //document.getElementById('pBox').insertBefore(player_d,players[i - 1]);
    }

    //players[i] = player_d;

    console.log(i);

    if(user)
    {
      if(snap.user == user.uid) playerID = i;
    }
    else if(username != "")
    {
      if(username == snap.val().name) playerID = i;
    }
    if(localStorage.username == snap.val().name)
    {
      playerID = i;
      lGameRef.child('players/' + (i)).update({
        online: true
      });
    }
    //alert(snap.val().name + " : " + localStorage.username);

    lGameRef.child('players/' + (i)).on('value',function(osnap){
      if(osnap.child('loc').exists() && players[i])
      {

        players[i].style.color = osnap.val().color;

        //if(snap.child('loc').exists())
        if(mainPieces.length > 0 && osnap.child('loc').exists())
        {
          if(mainDOMs[osnap.val().loc])
          {
            mode = 1;
            players[i].style.marginLeft = mainDOMs[osnap.val().loc].style.marginLeft;
            players[i].style.marginTop = mainDOMs[osnap.val().loc].style.marginTop;
            players[i].innerHTML = osnap.key;//.substr(1,snap.key.length - 1);
          }
        }
        else
        {
          //players[i].style.marginLeft = snap.val().x;
          //players[i].style.marginTop = snap.val().y;
          //players[i].innerHTML = snap.val().name + (snap.val().online ? "" : " (Offline)");
        }
      }
    });
  //});
  }
}





























//NETWORKING

var user;

var provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
'login_hint': 'user@example.com'
});
function LogIn()
{
  console.log("loggingIN");
firebase.auth().signInWithPopup(provider).then(function(result) {

// This gives you a Google Access Token. You can use it to access the Google API.
var token = result.credential.accessToken;
// The signed-in user info.
var user = result.user;
console.log(user);
// ...
}).catch(function(error) {
// Handle Errors here.
var errorCode = error.code;
var errorMessage = error.message;
// The email of the user's account used.
var email = error.email;
// The firebase.auth.AuthCredential type that was used.
var credential = error.credential;
// ...
});
}

function LogOut()
{
if(!user)
  {
    return;
  }

firebase.auth().signOut().then(function() {
// Sign-out successful.
console.log("sign out successful");
}).catch(function(error) {
// An error happened.
console.log("error signing out");
});
}


firebase.auth().onAuthStateChanged(function(user1) {
if (user1) {
  // User is signed in.
  console.log("this user is signed in");
  document.getElementById("p_Username").innerHTML = user1.displayName;
  document.getElementById("p_photo").src = user1.photoURL;
  console.log(user1);
  user = user1;

       var userRef = firebase.database().ref('users/' + user1.uid);
       userRef.once('value').then(function(snap){
           userRef.update({
        loginTimes: snap.child('loginTimes').val() + 1//parseInt(snap.val()) + 1

      });

       });

} else {
  // No user is signed in.
  console.log("no user in");
  document.getElementById("p_Username").innerHTML = "no user";
}

});
user = firebase.auth().currentUser;
if(user)console.log(user);
