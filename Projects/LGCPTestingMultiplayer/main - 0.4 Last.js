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

var newGameRef = firebase.database().ref('Tests/Games');
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








newGameRef.child('players').on('child_added',function(snap){
  //newGameRef.once('value',function(snap2){
  //alert(snap2.val().playerAmt);
  var i;
  //if(!updated)
  //{
    //return;
    i = snap.key.substr(1,snap.key.length - 1);


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
      players[i].innerHTML = snap.key.substr(1,snap.key.length - 1);
    }
  }
  else
  {
    document.getElementById('pBox').insertBefore(player_d,players[i - 1]);
  }

  //var i = players.push(player_d);

  players[i] = player_d;
  //i--;
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
    newGameRef.child('players/p' + (i)).update({
      online: true
    });
  }
  //alert(snap.val().name + " : " + localStorage.username);

  newGameRef.child('players/p' + (i)).on('value',function(snap){
    //alert(i);
    //alert(snap.key);
    if(snap.child('x').exists() && players[i])
    {

      players[i].style.color = snap.val().color;

      //if(snap.child('loc').exists())
      if(mainPieces.length > 0 && snap.child('loc').exists())
      {
        if(mainDOMs[snap.val().loc])
        {
          mode = 1;
          players[i].style.marginLeft = mainDOMs[snap.val().loc].style.marginLeft;
          players[i].style.marginTop = mainDOMs[snap.val().loc].style.marginTop;
          players[i].innerHTML = snap.key.substr(1,snap.key.length - 1);
        }
      }
      else
      {
        players[i].style.marginLeft = snap.val().x;
        players[i].style.marginTop = snap.val().y;
        players[i].innerHTML = snap.val().name + (snap.val().online ? "" : " (Offline)");
      }
    }
  });
//});
});

newGameRef.child('players').on('child_removed',function(snap){
  if(!snap.key.startsWith("p")) return;
  newGameRef.child('players/p' + (snap.key.substr(1,snap.key.length - 1))).off('value',function(snap){
    console.log('hopefully off now');
  });
  var i = snap.key.substr(1,snap.key.length - 1);
  document.getElementById(snap.child('loc').exists() ? 'area' : 'pBox').removeChild(players[i]);
  //players.splice(i,1);
  players[i] = null;
});



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



  playerID = gSnap.val().playerAmt;
  newGameRef.child('players/p' + gSnap.val().playerAmt).update({
    color: "blue",
    x: 50,
    y: 50,
    name: localStorage.username,
    online: true
  });
  if(mainPieces.length > 0)
  {
    newGameRef.child('players/p' + gSnap.val().playerAmt).update({
      loc: 0
    });
  }
  newGameRef.update({
    playerAmt: gSnap.val().playerAmt + 1
  });

}
function LeaveGame()
{
  if(playerID == -1)
  {
    alert("You arent even in a game!");
    return;
  }
  newGameRef.child("players/p" + playerID).set({});
  playerID = -1;
  newGameRef.update({
    //playerAmt: gSnap.val().playerAmt - 1
  });
}
var mScale = 20;
var ax = 0;
var ay = 0;
var area = document.getElementById('area');
document.addEventListener('keydown',function(e){
  var key = e.key;
  if(mode == 1)
  {
    if((key == "ArrowUp" || key == "ArrowDown" || key == "ArrowRight" || key == "ArrowLeft"))
    {
      e.preventDefault();
      var curP = gSnap.child('players/p' + playerID);
      var dir = (key == "ArrowUp" ? 1 : key == "ArrowDown" ? 0 : key == "ArrowRight" ? 3 : key == "ArrowLeft" ? 2 : -1);
      if(dir != -1 && mainPieces[curP.val().loc][dir + parseInt(mainPieces[curP.val().loc][4] == "'" ? 6 : 8)] != -1)
      {
        //var loc = parseInt(mainPieces[curP.val().loc][dir + parseInt(mainPieces[curP.val().loc][4] == "'" ? 6 : 8)]);
        newGameRef.child('players/p' + playerID).update({
          loc: parseInt(mainPieces[curP.val().loc][dir + parseInt(mainPieces[curP.val().loc][4] == "'" ? 6 : 8)])
        });
      }
    }
  }
  else
  {
    if(key == "ArrowLeft" || key == "ArrowRight") newGameRef.child('players/p' + playerID).update({x: gSnap.child('players/p' + playerID).val().x + (key == "ArrowRight" ? 10 : -10)});
    if(key == "ArrowUp" || key == "ArrowDown") newGameRef.child('players/p' + playerID).update({y: gSnap.child('players/p' + playerID).val().y + (key == "ArrowDown" ? 10 : -10)});
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




  if(playerID != -1 && gSnap && gSnap.child('players/p' + playerID).val().color != c.value)
  {
    newGameRef.child('players/p' + playerID).update({
      color: c.value,
    });
  }




}
setInterval(Update,20);

function SaveUsername()
{
  if(gSnap)
  {
    for(i = 0; i < gSnap.val().playerAmt; i++)
    {
      //alert(i);
      if(gSnap.child('players/p' + i).exists() && i != playerID)
      {
        if(gSnap.child('players/p' + i).val().name == document.getElementById('name_i').value)
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
    if(playerID != -1) newGameRef.child('players/p' + playerID).update({
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
    newGameRef.child('players/p' + playerID).update({
      online: false
    });
  }
}

//LOAD BASIC DATA
var usableObjsLocs,usableColors = [], uo;
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
function LoadMap()
{
  map = document.getElementById("map_loc").value;
  res = map.split("&");

  for(i = 0; i < res.length; i++)
  {
    var prop = res[i].split(",");
      //if(!pieceIds.includes(prop[0])) pieceIds.push(prop[0]);
  }
  console.log("FINISHED ADDING TO PIECESIDS ARRAY");
  console.log(pieceIds);


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
  if(playerID != -1)
  {
    mode = 1;
    //alert(playerID);
    newGameRef.child('players/p' + playerID).update({
      mode: (gSnap.child('players/p' + playerID).val().mode ? gSnap.child('players/p' + playerID).val().mode : 0) + 1
    });
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
