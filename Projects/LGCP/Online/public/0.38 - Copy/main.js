// Initialize Firebase
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
var newGameRef = firebase.database().ref('Multi');

//Variables
var gSnap;
var lsp = {};
var psp = {};
var updated = false;
var player;
var mp = []
var mainDOMs = [];
var mode = -1;
var gameStarted = false;
var enemy;

//Update Root Snap (Used to be gSnap in past versions)
var rSnap;

//Update pSnap, which equals lGameRef.child('players/' + user.uid); // The game >> players arr >> you
var pRef;
var pSnap;

//Variables for Editor
var selObj;
var selObjs = [];


//NETWORKING

var user;
var userRef;

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



LoadAuth();
function LoadAuth()
{
	firebase.auth().onAuthStateChanged(function(user1) {
	if (user1) {
  	// User is signed in.
  	console.log("this user is signed in");
  	document.getElementById("p_Username").innerHTML = user1.displayName;
  	document.getElementById("p_Photo").src = user1.photoURL;
  	console.log(user1);
  	user = user1;


    userRef = firebase.database().ref('users/' + user1.uid);
       userRef.once('value').then(function(snap){
       userRef.update({
        loginTimes: snap.child('loginTimes').val() + 1,//parseInt(snap.val()) + 1
				name: user1.displayName
      	});

       });


  //Update Root Snap (Used to be gSnap in past versions)
  firebase.database().ref("Multi").once('value',function(snap){
    //alert("bhello");
  	//if(snap != rSnap) document.getElementById('loading_l').style = "visibility: hidden;";
  	rSnap = snap;
    console.log("rrrrrrrrrrrrrrrrrrrrrrr");


    var times = 0;
    snap.forEach(function(c){
      if(c.child("players/" + user.uid).exists())
      {
        document.getElementById("game_i").value = c.key;
        times++;
        //LoadGame();
        //return;
      }
    });

    if(times == 0)
    {
      document.getElementById("menuControls").style.visibility = "visible";
      console.log("You must not already be in a game");
    }
    else
    {
      LoadGame();
      console.log("Your in a game");
    }
  	//updated = true;


	});

  //Update gSnap
	userRef.on('value',function(snap){
  //alert("jhello");
  	if(!gSnap)
    {
    	document.getElementById('loading_l').style.visibility = "hidden";
      gSnap = snap;
      updated = true;

    	StartAuth();
      init();
    }
  	if(snap != gSnap)
  	{
  		//document.getElementById('loading_l').style = "visibility: hidden;";
      gSnap = snap;
      updated = true;

  	}
  	gSnap = snap;

    //Update player position
    if(player)
    {
      player.props.x = snap.val().x;
      player.props.y = snap.val().y;
    	player.style.marginLeft = snap.val().x + "px";
      player.style.marginTop = snap.val().y + "px";
    }
	});


	} else {
  // No user is signed in.
  console.log("no user in");
  document.getElementById("p_Username").innerHTML = "no user";
}

});
user = firebase.auth().currentUser;
if(user)console.log(user);
}

function StartAuth()
{
	/*if(!gSnap.child("loc").exists())
  {
  	userRef.update({
    	game: "none",
      health: 4,
      loc: 0,
      playerClass: 0
    });
  }*/
}

//Input vars
var up = 0;
var right = 0;
var su = false;
var sr = false;
var isShift = false;
var isSpace = false;
//Input //Key presses to interact with the world
document.addEventListener('keydown',function(e){
	//if(e.key == "ArrowRight") right = 1;
  //if(e.key == "ArrowLeft") right = -1;
  //if(e.key == "ArrowUp") up = 1;
  //if(e.key == "ArrowDown") up = -1;
  //if(e.key == "g") console.log(player.props.width);
  var key = e.key;
  if(key == "Shift") isShift = true;
  if(key == " ")
  {
    isSpace = true;
    if(selObjs[0]) e.preventDefault();
  }
  //console.log(key + "r");

  //Editor
  if(key == "w" || key == "s" || key == "d" || key == "a")
  {
  var dir = (key == "w" ? 1 : key == "s" ? 0 : key == "d" ? 3 : key == "a" ? 2 : -1);
  if(isSpace && selObjs.length == 1)
  {
  	var arrP = lsp[selObjs[0].id].val();//lSnap.child("pieces/" + selObjs[0].id).val();
  	AddPiece(0,{x: arrP.x + (dir == 3 ? 20 : dir == 2 ? -20 : 0), y: arrP.y + (dir == 1 ? -20 : dir == 0 ? 20 : 0), color: 0, spaced: true, dir: dir});
  }
  else
  {
  	var speed = 10 * ed.moveInc;

    if(selObjs.length > 0)
    {
    selObjs.forEach(function(c){
      var old = c.id;
    	c.id.replace("sub","");
      var r = c.id;
    	if(dir == 3 || dir == 2)
      {
      	//var par = document.getElementById(selObj.id).parentNode;
        //par.style.marginLeft.replace("px","");
        //par.style.marginLeft = (parseFloat(par.style.marginLeft) + (dir == 3 ? 16 : -16)) + "px";
        lGameRef.child("pieces/" + r).update({
        	x: (lsp[r].val().x + (dir == 3 ? speed : -speed))
        });
      }
      if(dir == 0 || dir == 1)
      {
      	//var par = document.getElementById(selObj.id).parentNode;
        //par.style.marginTop.replace("px","");
        //par.style.marginTop = (parseFloat(par.style.marginTop) + (dir == 1 ? -16 : 16)) + "px";
       	lGameRef.child("pieces/" + r).update({
        	y: (lsp[r].val().y + (dir == 1 ? -speed : speed))
        });
      }
      c.id = old;
   	});


    }
  }
	}



  //Moving
  if((key == "ArrowUp" || key == "ArrowDown" || key == "ArrowRight" || key == "ArrowLeft"))
  {
     e.preventDefault();
     //console.log("lSnap : " + lSnap.val().loc);
     if(!lSnap.child("loc").exists())
     {
       lGameRef.child('players/' + user.uid).update({
         here: true
       });
     }
     /*if(!lSnap.child('players/' + user.uid + "/fighting").exists())
     {
      var curP = lSnap.child('players/' + user.uid);
      var dir = (key == "ArrowUp" ? 1 : key == "ArrowDown" ? 0 : key == "ArrowRight" ? 3 : key == "ArrowLeft" ? 2 : -1);
      if(dir != -1 && mp[curP.val().loc][dir + parseInt(mp[curP.val().loc][4] == "'" ? 6 : 8)] != -1 && !lSnap.child("props/" + mp[curP.val().loc][dir + parseInt(mp[curP.val().loc][4] == "'" ? 6 : 8)]).exists())
      {
        v_loc = parseInt(mp[curP.val().loc][dir + parseInt(mp[curP.val().loc][4] == "'" ? 6 : 8)]);
        //var loc = parseInt(mainPieces[curP.val().loc][dir + parseInt(mainPieces[curP.val().loc][4] == "'" ? 6 : 8)]);
        lGameRef.child('players/' + user.uid).update({
          loc: v_loc
        });

      }
     }  */
     if(!psp[user.uid].child("fighting").exists())
     {
      var curP = psp[user.uid];
      var dir = (key == "ArrowUp" ? 1 : key == "ArrowDown" ? 0 : key == "ArrowRight" ? 3 : key == "ArrowLeft" ? 2 : -1);
      var nArr = lsp[curP.val().loc].child("props").val();
      if(dir != -1 && nArr[dir + parseInt(nArr[4] == "'" ? 6 : 8)] != -1 && !lSnap.child("props/" + nArr[dir + parseInt(nArr[4] == "'" ? 6 : 8)]).exists())
      {
        v_loc = parseInt(nArr[dir + parseInt(nArr[4] == "'" ? 6 : 8)]);
        //var loc = parseInt(mainPieces[curP.val().loc][dir + parseInt(mainPieces[curP.val().loc][4] == "'" ? 6 : 8)]);
        lGameRef.child('players/' + user.uid).update({
          loc: v_loc
        });

      }
     }
  }



  //Rolling
    if(key == "r")
    {
    	if(!enemy)
      {
      	CheckAround();
        console.log("No enemy");
        return;
      }

      var roll = Math.floor(Math.random() * 6);
      var curMoves = (roll > 3 ? roll - 2 : roll); // 0 = move 1 space : 1 = shield : 2 = move 2 spaces : 3 = move 3 spaces

      if(lSnap.child('players/' + user.uid).val().fighting.state) //if you are fighting
      {
        var me = lSnap.child('players/' + user.uid).val();
        if(roll == 1 || roll == 3 || roll == 0) //DESTROY
        {

          alert("Start HIS HEALTH IS " + lSnap.child(enemy).val().health);

          alert("HIS HEALTH IS " + (parseInt(lSnap.child(enemy).val().health) - 1));
          if(parseInt(lSnap.child(enemy).val().health) - 1 <= 0)
          {

            lGameRef.child('props/' + me.fighting.where).set({});
            lGameRef.child('players/' + user.uid + "/fighting").set({});
            //CheckAround();
            //alert("DESTROYED");
            console.log("DESTREOYED");
            alert(enemy);

            return;
          }
          else
          {

          }
          lGameRef.child('props/' + me.fighting.where + "/Subitem").update({health: lSnap.child(enemy).val().health - 1});
        }
        else // SKULL / FAILED
        {
          pRef.update({health: pSnap.val().health - parseInt(lSnap.child(enemy).val().health)});
          alert("SKULL / FAILED - YOU LOST " + lSnap.child(enemy).val().health + " HEALTH");
        }
      }
    }


  //Shifters
  //Deselect piece
  if(key == "F"){
		Actions(0);
  }
  //Move By Z Up
  if(key == "W")
  {
  	alert("Increasing Z by 4");
    selObjs.forEach(function(c){
    	var props = {};
      props[3] = parseInt(lsp[c.id].child("props/3")).val()) + 4;
    	lGameRef.child("pieces/" + c.id + "/props").update(props);
    });
  }
  //Move By Z Down
  if(key == "S")
  {
  	alert("Decreasing Z by 4");
    selObjs.forEach(function(c){
    	var props = {};
      props[3] = parseInt(lsp[c.id].child("props/3")).val()) - 4;
    	lGameRef.child("pieces/" + c.id + "/props").update(props);
    });
  }
  //Turn Right or Left 45 Deg
  if(key == "D" || key == "A")
  {
  	selObjs.forEach(function(c){
    	var lo = lsp[c.id];
    	if(lo.val().props[4] != "'")
      {
      	var props = {};
      	props[6] = parseFloat(lsp[c.id].child("props/6")).val()) + (key == "D" ? 22.5 : -22.5);
    		lGameRef.child("pieces/" + c.id + "/props").update(props);
      }
      else
      {
      	var ol = lsp[c.id].child("props/rot/z")).val();
        if(!ol) ol = 0;
      	var num = parseFloat(ol) + (key == "D" ? 22.5 : -22.5);
      	if(num != 0) lGameRef.child("pieces/" + c.id + "/props/rot").update({z: num});
        else lGameRef.child("pieces/" + c.id + "/props/rot").update({z: null});
      }
    });
  }
  //Delete piece
  if(key == "X")
  {
  	if(selObjs.length == 0) return;
  	for(var i = 0; i < selObjs.length; i++)
    {
    	if(selObjs[i].parentNode.props[0] == "0.0")
      {
      	for(var i2 = 0; i2 < 4; i2++)
        {
        	var s = document.getElementById(lsp[selObjs[i].id].child("props/" + (i2 + 6))).val());
          if(s)
          {
          	for(var i3 = 0; i3 < 4; i3++)
            {
            	if(lsp[s.id].child("props/" + (i3 + 6))).val() == selObjs[i].id)
              {
              	var props = {};
                props[i3 + 6] = -1;
              	lGameRef.child("pieces/" + s.id + "/props").update(props);
              }
            }
          }


        }
      }

    	lGameRef.child("pieces/" + selObjs[i].id).set({});
    }
    selObjs = [];

    /*if(selObjs.length == 0) return;
  	for(var i = 0; i < selObjs.length; i++)
    {


    	lGameRef.child("pieces/" + selObjs[i].id).set({});
    }
    selObjs = [];*/

    /*var index = selObj.indexOf();

    if (index > -1) {
       arr.splice(index, 1);
    }*/
  }

  //Zooming
  if(key == "]"){
    console.log(document.getElementById("area").style.zoom);
  	document.getElementById("area").style.zoom = (parseFloat(document.getElementById("area").style.zoom) + 0.1);


  }
  if(key == "["){
    console.log(document.getElementById("area").style.zoom);
  	document.getElementById("area").style.zoom -= 0.1;
  }
  if(key == "h") console.log(document.getElementById("area").style.zoom);

  if(key == "v")
  {
  	//SpawnPiece(); //This is add the piece locally so you can visually see it
    AddPiece(); //This is add the piece to the database
  }



});
document.addEventListener('keyup',function(e){
	if(e.key == "ArrowRight") right = 0;
  if(e.key == "ArrowLeft") right = 0;
  if(e.key == "ArrowUp") up = 0;
  if(e.key == "ArrowDown") up = 0;
  if(e.key == "Shift") isShift = false;
  if(e.key == " ") {
    isSpace = false;
    if(selObjs[0]) e.preventDefault();
  }

});


//Check Around for Monsters
var v_loc;
function CheckAround()
{
return;

  for(i = 0; i < 4; i++)
  {
  	if(!v_loc)
    {
    	v_loc = psp[user.uid].val().loc;
    }
  	//alert(v_loc);
    /*console.log("v_loc: " + v_loc);
    console.log("mp: " + mp);
    console.log("lSnap: " + lSnap);*/
    //alert(mp);
    //alert(lSnap);
    if((!mp[v_loc] || psp[user.uid].child("fighting")).exists()) && enemy) return;
    var v = mp[v_loc][i + parseInt(mp[v_loc][4] == "'" ? 6 : 8)];
    console.log(v + " i " + i);
    //lGameRef.once('value',function(snap){
      if(lSnap.child('props/' + v + '/Subitem').exists())
      {
        if(lSnap.child('props/' + v + '/Subitem/health').val() > 0)
        {
          alert("FIGHTING! - " + user.uid);
          enemy = ('props/' + v + '/Subitem');
          //alert("parent = " + enemy.parent.key);
          lGameRef.child('players/' + user.uid).update({fighting: {state: true, where: v}});
        }
      }
    //});

  }
}

//Update
var scene = document.getElementById("Scene");
var dir;
function Update()
{
  //Collision Detections through all collision objects in the scene
  for (var i = 0; i < boxes.length; i++) {
        //ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
        if(!document.getElementById("box" + i))
        {
        	//console.log("box doesnt exist");
        	return;
        }

        dir = colCheck(player, boxes[i]);

        if (dir === "l" || dir === "r") {
            right = 0;
            //sr = true;
            //if(!dir === "b" || !dir === "t") su = false;
            //player.jumping = false;
        } else if (dir === "b") {
        		up = 0;
            //sr = false;
            //su = true;
            //player.grounded = true;
            //player.jumping = false;
        } else if (dir === "t") {
        		up = 0;
            //sr = false;
            //su = true;
            //player.velY *= -1;
            //player.velY = 0;
        } else {
        	//su = false;
        }

  }

  	//Movement
 	if(right != 0) userRef.update({x: gSnap.val().x + (right > 0 ? (gSnap.val().x < 395 ? 5 : 0) : (gSnap.val().x > 0 ? -5 : 0))});
  if(up != 0) userRef.update({y: gSnap.val().y + (up > 0 ? (gSnap.val().y > 0 ? -5 : 0) : (gSnap.val().y < 210 ? 5 : 0))});

  //if(right != 0) userRef.update({x: gSnap.val().x + (right > 0 ? 5 : -5)});
  //if(up != 0) userRef.update({y: gSnap.val().y + (up > 0 ? 5 : -5)});
}
setInterval(Update,50);



//Init //Load You Into World

//TEMP BOXES
var boxes = [];
boxes.push({
	props: {
  	x: 10,
    y: 10,
    width: 20,
    height: 20
  }
});
boxes.push({
	props: {
  	x: 200,
    y: 50,
    width: 45,
    height: 25
  }
});

var headPlayer;
function init()
{
	//FROM OLD AWITU
	/*player = document.createElement("span");
  player.innerHTML = "t";
  player.style.position = "absolute";
  player.id = user.uid;
  player.className = "PlayerClass";
  player.props = {width: 10, height: 20};

  headPlayer = document.createElement("div");
  headPlayer.appendChild(player);

	document.getElementById("Players").appendChild(headPlayer);

  //////////LoadRoom(gSnap.val().areaSuper,gSnap.val().areaSub, {start: true});

  //Load Temp Boxes for collision testing
  for(i = 0; i < boxes.length; i++)
  {
  	var tbox = document.createElement("div");
    tbox.style.position = "absolute";
    tbox.style.width = boxes[i].props.width + "px";
    tbox.style.height = boxes[i].props.height + "px";
    tbox.style.marginLeft = boxes[i].props.x + "px";
    tbox.style.marginTop = boxes[i].props.y + "px";
    tbox.style.backgroundColor = "red";
    tbox.id = ("box" + i);
    document.getElementById("Scene").appendChild(tbox);
  }*/

  /*document.getElementById("area").style.zoom = 1;

  database.ref("Multi").once('value',function(snap){
    snap.forEach(function(c){
      if(c.child("players/" + user.uid).exists())
      {
        document.getElementById("game_i").value = c.key;
        LoadGame();
        return;
      }
    });

    document.getElementById("menuControls").style.visibility = "visible";
  });*/
}







var lGameRef;
//var players;
var players = [];
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

   // i = parseInt(snap.key);//snap.key.substr(1,snap.key.length - 1);
   i = snap.val().id;

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
  }
  var player_d = document.createElement('p');
  player_d.innerHTML = "P";
  player_d.style = "color: blue; position: absolute;";
  player_d.className = "player";
  players[i] = player_d;
  //if(snap.child('loc').exists())
  if(mp.length > 0 || snap.child('loc').exists())
  {
    //document.getElementById('pBox').insertBefore(player_d,players[i - 1]);
    document.getElementById('area').appendChild(player_d);
    player_d.style.zIndex = 700;
    var ob = document.getElementById(snap.val().loc);
    if(ob)
    {
      players[i].style.marginLeft = ob.parentNode.style.marginLeft;
      players[i].style.marginTop = ob.parentNode.style.marginTop;
      players[i].innerHTML = snap.val().name;
      //players[i].innerHTML = gSnap.val().name;//.substr(1,snap.key.length - 1);
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
    lGameRef.child('players/' + snap.key).update({
      online: true
    });
  }
  //alert(snap.val().name + " : " + localStorage.username);

  //Add listener to player in lGameRef
  lGameRef.child('players/' + snap.key).on('value',function(osnap){
    psp[osnap.key] = osnap;
    if(osnap.child('loc').exists() && players[i])
    {

      players[i].style.color = osnap.val().color;

      //if(snap.child('loc').exists())
      if(mp.length > 0 && osnap.child('loc').exists())
      {
      	var ob2 = document.getElementById(osnap.val().loc).parentNode;
        if(ob2)
        {
          mode = 1;
          players[i].style.marginLeft = ob2.style.marginLeft;
          players[i].style.marginTop = ob2.style.marginTop;
          //.substr(1,snap.key.length - 1);
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

  var i2 = parseInt(snap.val().id);
  //if(snap.parent.key != "players") return;
  if(!snap.child('loc').exists()) return;
  lGameRef.child('players/' + i2).off('value',function(snap){
    console.log('hopefully off now');
  });

  //alert(i2);
  //document.getElementById(snap.child('loc').exists() ? 'area' : 'pBox').removeChild(players[i]);
  document.getElementById('area').removeChild(players[i2]);
  //players.splice(i,1);
  //lGameRef.update({pAmt: lSnap.val().pAmt - 1});
  players[i2] = null;
});


}
var usableObjsLocs,usableColors = [], uo, res = [];
var ed = {
	moveInc: 1
};
function LoadBasicData()
{
	//LOAD BASIC DATA

	firebase.database().ref('objLocs2D/').once('value',function(snap){
	  uo = snap;
	});
	firebase.database().ref('colors/').once('value',function(snap){
	  for(var i = 0; i < snap.val().length; i++)
	  {
    	var co = snap.child(i).val();
	    usableColors.push({color: (co.color.startsWith("0") ? "#" + co.color.substr(2,6) : co.color), op: snap.child(i).val().op + 0.25, reflect: (snap.child(i).val().reflect)});

      var s = document.createElement("span");
      s.id = "cm_" + i;
      s.onclick = function(e){
      	console.log("color: " + this.innerHTML + " : id - " + this.id);
        var tid = this.id.split("_")[1];
        if(selObjs.length > 0)
        {
        	selObjs.forEach(function(c){
          	lGameRef.child("pieces/" + c.id).update({color: parseInt(tid)});
          });
        	//var co = usableColors[this.id.split("_")[1]];

          //WAS BEFORE//lGameRef.child("pieces/" + selObj.id).update({color: (co.color.startsWith("0") ? "#" + co.color.substr(2,6) : co.color)});

        	/*var co = usableColors[this.id];
        	selObj.childNodes[0].childNodes[0].style.fill = (co.color.startsWith("0") ? "#" + co.color.substr(2,6) : co.color);*/
        }
          //var colObj = usableColors[parseInt(prop[(prop[4] == "'" ? 5 : 7)])];
  //////////////////////////////////Testing
 	//if(!alts.child("color").exists()) lGameRef.child("pieces/" + i).update({color: (colObj.color.startsWith("0") ? "#" + colObj.color.substr(2,6) : colObj.color)});

      }
      s.innerHTML = snap.child(i).val().name;
      document.getElementById("colors_dd").appendChild(s);
	  }
	  console.log("LOAD COLORS COMPLETE");
    console.log(usableColors);
	});

  //Set Default Move Inc
  document.getElementById("i_mi").value = 1;
}

var map,prop,pieceIds;
var res = [];
var subDOMs = [];
//LOAD MAP
function LoadMap(mode)
{
	res = [];

  if(!lSnap || !gSnap)
  {
    alert("The game is not fully loaded yet!");
    return;
  }

  if(mp.length > 0)
  {
    alert("Your already in a LGCP game!");
    return;
  }
  //map = document.getElementById("map_loc").value;
  map = "";

  var gr = document.getElementById("game_i").value;

  if(mode == 1)
  {
  	lSnap.child("pieces").forEach(function(c){
    	//res.push(c.val().src);
      res.push(c.val().props);
    });
    /*for(i = 0; i < rSnap.child(gr).val().amt; i++)
    {
      res.push(rSnap.child(gr + "/pieces/" + i + "/src").val());
    }*/
  }
  else
  {
    res = map.split("&");
  }

  for(i = 0; i < res.length; i++)
  {
  	//if(!res[i]) return;
    var prop = res[i];//.split(",");
      //if(!pieceIds.includes(prop[0])) pieceIds.push(prop[0]);
  }
  console.log("FINISHED ADDING TO PIECESIDS ARRAY");
  console.log(pieceIds);

var ar = [];

//Determine weather subitems already exist, if they dont then they need to be loaded.
var loadProps = false;
if(!lSnap.child("props").exists()) loadProps = true;

lGameRef.child("pieces").on('child_added',function(snap){
	SpawnPiece(snap);
});
lGameRef.child("pieces").on('child_removed',function(snap){
	DestroyPiece(snap);
});

  /*for(i = 0; i < res.length; i++)
  {
    console.log(i);
    var prop = res[i].split(",");

      var mid = prop[0].split(".");

      //if(usableObjs[mid[0]][mid[1]])
      //if(mid[0] == "0")
      var o;
      if(uo.child(mid[0]).child(mid[1]).exists())
      {
       o = uo.child(mid[0]).child(mid[1]).val();
      //ImportPiece("https://Claeb008.github.io/objs/" + prop[0] + "/" + usableObjsLocs[prop[0]][prop[1]], prop[2], prop[3], prop[4], 2);
      var colObj = usableColors[parseInt(prop[(prop[4] == "'" ? 5 : 7)])];
      if(!colObj) colObj = new colors("gray",100);
      var head = document.createElement('div');
      var gom = document.createElement('div');

      head.appendChild(gom);
      head.style = "position: absolute;"; //transform: rotate(" + (prop[4] != "'" ? parseFloat(prop[6]) : 0) + "deg);";
      gom.style = "transform: rotate(" + (prop[4] != "'" ? parseFloat(prop[6]) : 0) + "deg);" + "position: absolute;";

      gom.innerHTML = o.src;
      //Tests
      ar.push(i);
      gom.id = i;


      gom.childNodes[0].childNodes[0].onclick = function(e){
      	mainDOMs.forEach(function(c){
        	c.childNodes[0].childNodes[0].childNodes[0].style.stroke = "";
        });
        this.style.stroke = "orange";
        this.style.strokeWidth = "4px";
        selObj = this.parentNode.parentNode;
        console.log("PIECE at " + selObj.id);
      }
      //gom.contents().find("circle")[0].style.pointerEvents = "none";
      if(gom.childNodes[0].childNodes[1]) gom.childNodes[0].childNodes[1].style.pointerEvents = "none";


      //"color: black; position: absolute; width: 10px; height: 10px; background-color: red"; //(colObj.color.startsWith("0") ? parseInt(colObj.color) : colObj.color);
      document.getElementById('area').appendChild(head);
      document.getElementById('r').style.fill = (colObj.color.startsWith("0") ? "#" + colObj.color.substr(2,6) : colObj.color);
      document.getElementById('r').id = "l";

      head.style.marginLeft = parseFloat(prop[1]) * 1.5 + 500 + (o.off ? o.off.left : 0) + (prop[4] != "'" ? -2 : 0) + "px";
      head.style.marginTop = parseFloat(prop[2]) * 1.5 + 250 + (o.off ? o.off.top : 0) + (prop[4] != "'" ? -2 : 0) +  "px";
      head.style.zIndex = parseFloat(prop[3]);





      if(prop[4] != "'")
      {

      }
      mp.push(prop);
      mainDOMs.push(head);
      head.props = prop;

      //FOR EDITOR //Add event listener to pieces so when their props change they'll be updated
      lGameRef.child("pieces/" + i).on('value',function(snap){
      	var who = parseInt(snap.key);
        if(!snap.child("x").exists()) return;

        document.getElementById(who).parentNode.style.marginLeft = snap.val().x + "px";
        document.getElementById(who).parentNode.style.marginTop = snap.val().y + "px";
      });

      //SUBITEMS

		//Detect if any subitems are currently present
		if(loadProps)
    {
    	//alert(lSnap.child("props").val().length);
      if(prop[prop[4] == "'" ? 11 : 13])
      {
      	lGameRef.child("props/" + i + "/Subitem").update({
          health: 2
        });
      }
    }

		if(lSnap.child("props/" + i + "/Subitem").exists())
    {
    	  if(prop[prop[4] == "'" ? 11 : 13]) // Loading a subitem
      	{

				var sub = document.createElement('span');
				sub.style = "position: absolute;";
				sub.innerHTML = i;
				sub.style.zIndex = 1000;
				sub.style.marginLeft = 16 + "px";
				sub.style.marginTop = 16 + "px";
				sub.id = 'sub' + i;

				head.appendChild(sub);



      }
      }
    }


  }*/
  lGameRef.child('props/').on('child_added',function(snap){
  	if(snap.child('Subitem').exists() && !document.getElementById('sub' + snap.key))
    {
    		var i = parseInt(snap.key);

    		var sub = document.createElement('span');
				sub.style = "position: absolute;";
				sub.innerHTML = i;
				sub.style.zIndex = 1000;
				sub.style.marginLeft = 16 + "px";
				sub.style.marginTop = 16 + "px";
				sub.id = 'sub' + i;

				mainDOMs[i].appendChild(sub);

        CheckAround();
    }
  });
  lGameRef.child('props/').on('child_removed',function(snap){
				if(snap.child('Subitem').exists() && document.getElementById('sub' + snap.key))
				{
					console.log("REMOVE this sub : " + this.i + " : " + snap.key);
					var subitema = document.getElementById('sub' + snap.key);
					mainDOMs[parseInt(snap.key)].removeChild(subitema);
				}
	});
  LStart();

  document.getElementById("menuControls").style.visibility = "hidden";
  document.getElementById('menuControlsExit').style.visibility = "visible";
  document.getElementById('loading_l').style.visibility = "hidden";
}

//Loading a Game / Joining a Game
var lSnap;
function LoadGame()
{
  if(!rSnap.child(document.getElementById("game_i").value).exists())
  {
    alert("That game does not exist!");
    console.log(document.getElementById("game_i").value);
    return;
  }
  document.getElementById('loading_l').style.visibility = "visible";
  document.getElementById('loading_l').innerHTML = "Loading Map...";
  //  LoadMap(1);
  lGameRef = newGameRef.child(document.getElementById("game_i").value);
  lGameRef.once('value',function(snap){

		//first join setup
		if(!lSnap)
    {
    	if(!snap.child("players/" + user.uid + "/id").exists())
      {
      	lSnap = snap;
        console.log("pAMT: " + snap.val().pAmt);

  			lGameRef.child('players/' + user.uid).update({
  			  name: user.displayName,
  			  id: snap.val().pAmt,
  			  loc: 0,
  			  health: 4
  			});

        lGameRef.update({
          pAmt: snap.val().pAmt + 1
        });

        pRef = lGameRef.child('players/' + user.uid);
  			pRef.on('value',function(snap){
  				pSnap = snap;
  			});

      }
      lSnap = snap;


      //////////////////////////////

      pRef = lGameRef.child('players/' + user.uid);
      pRef.on('value',function(snap){
        pSnap = snap;
      });

      pRef.update({update: true});



      //LStart();
        LoadMap(1);

        CheckAround();

        //////////////////////////////////////////////



    }

    lSnap = snap;

    //////////////////CheckAround();


    /*if(playerID == 0)
    {
      if(lSnap.child('requests').exists())
      {

      }
    }*/
  });




}
//LoadMap(1);




LoadBasicData();

//Actions for Editor
function Actions(id,atr)
{
	switch(id)
  {
  	//Deselect //OLD
  	case -1:
    	mainDOMs.forEach(function(c){
      	if(c.childNodes) c.childNodes[0].childNodes[0].childNodes[0].style.stroke = "";
    	});
    	selObj = null;
    break;
    //Deselect //NEW
    case 0:
    	mainDOMs.forEach(function(c){
      	if(c.childNodes) c.childNodes[0].childNodes[0].childNodes[0].style.stroke = "";
    	});
    	selObjs = [];
    break;
  }
}

//Opening the website
window.onload = function (e)
{
  if(lSnap)
  {
    var currentdate = new Date();
    var datetime = {
      date: currentdate.getDate(),
      month: (currentdate.getMonth()+1),
      year: currentdate.getFullYear(),
      hour: currentdate.getHours()
    };
    lGameRef.child("players/" + user.uid).update({left: datetime});
  }
}






























































































































var listeners = [];
var started = false;
var wSnap;
var wRef;
function LoadRoom(areaSup,areaSub,atr)
{
	var rRef = database.ref("World/" + areaSup + "/" + areaSub + "/players");
  rRef.off();
  var oRef = database.ref("World/" + gSnap.val().areaSuper + "/" + gSnap.val().areaSub + "/players");
  oRef.off();
  //rRef.child(user.uid).set({});
  if(gSnap.val().areaSub != areaSub || gSnap.val().areaSuper != areaSup || (atr ? atr.start : false))
  {
  	//alert("NEW!");
    if(atr ? !atr.start : true) oRef.child(user.uid).remove();
  }
  else
  {
  	//alert("OLD, EXITING");
    return;
  }

  rRef.child(user.uid).update({here: true});

	userRef.update({
  	areaSuper: areaSup,
    areaSub: areaSub
  });

  	oRef.once('value',function(snapshotMAIN){
     	if(atr ? !atr.start : true)
  		{
  			snapshotMAIN.forEach(function(sSnap){
  	  		if(sSnap.key == user.uid) return;

  	  		database.ref("users/" + sSnap.key).off();

  	  		var c = document.getElementById(sSnap.key);
  	  		document.getElementById("Players").removeChild(c);
  	  	});
      }





  rRef.on('child_added',function(snapshot){
  	if(snapshot.key != user.uid) // && database.ref("Users/" + snapshot.key).exists()
      {
      	var other = document.createElement("span");
        other.innerHTML = "d"
        other.style.position = "absolute";
        other.style.visibility = "hidden";
        other.id = snapshot.key;
        other.className = "PlayerClass";
        document.getElementById("Players").appendChild(other);

        //listeners.push(database.ref("users/" + snapshot.key));
        var tmp2 = null;
        database.ref("users/" + snapshot.key).on('value',function(thisSnap){
        	var obj = document.getElementById(thisSnap.key);
        	if(!thisSnap.child('x').exists() || !obj)
          {
           	 return;
          }
        	obj.style.marginLeft = thisSnap.val().x + "px";
          obj.style.marginTop = thisSnap.val().y + "px";
          if(obj.style.visibility == "hidden") obj.style.visibility = "visible";

          tmp2 = thisSnap;
        });
        listeners.push({sn: tmp2, src: (database.ref("users/" + snapshot.key))});

      }
  });


  }); // FROM BEFORE FOREACH LOOP

  rRef.on('child_removed',function(snapshot){
  	if(snapshot.key != user.uid && document.getElementById(snapshot.key))
    {
   		database.ref("users/" + snapshot.key).off();
      //alert(snapshot.key);
     	var c = document.getElementById(snapshot.key);
  	  document.getElementById("Players").removeChild(c);
    }
  });
}



///////////////////Spawning Pieces Other than the main LoadMap function
var lastTile;
function SpawnPiece(alts,atr)
{
	var ar = [];
var res2;
	//res = "5.0,0,0,-16,',0";
  //if(alts.val().src || alts.src) res2 = (alts.val() ? alts.val().src : alts.src);
  //else
  {
  	//res2 = (alts.val() ? alts.val().props : alts.props);
  }
  console.log(res2);
  var i = parseInt(alts.key);//mainDOMs.length;
  if(!alts.child("props").exists()) res2 = (alts.val() ? alts.val().src : alts.src);

  var prop = (res2 ? res2.split(",") : alts.val().props);//res2.split(",")

  if(!prop) return;
  //lGameRef.child("pieces/" + i).update({props: prop});

  var mid = prop[0].split(".");

  //var colObj = usableColors[parseInt(prop[(prop[4] == "'" ? 5 : 7)])];
  //////////////////////////////////Testing
  //parseFloat(prop[1]) * 1.5 + 500 + (o ? (o.off ? o.off.left : 0) : 0) + (prop[4] != "'" ? -2 : 0);
  /*var o = (uo.child(mid[0]).child(mid[1]).exists() ? uo.child(mid[0]).child(mid[1]).val() : null)
  if(!alts.child("xx").exists())
  {
    if(prop[1] == 0 && prop[2] == 0 && prop[0] != "0.0")
    {
      var lx = alts.val().x;
      lx -= (prop[4] != "'" ? -2 : 0);
      lx -= (o ? (o.off ? o.off.left : 0) : 0);
      lx -= 500;
      lx /= 1.5;
      var ly = alts.val().y;
      ly -= (prop[4] != "'" ? -2 : 0);
      ly -= (o ? (o.off ? o.off.left : 0) : 0);
      ly -= 500;
      ly /= 1.5;
      lGameRef.child("pieces/" + i).update({xx: lx, yy: ly});
    }
  }*/

  //lGameRef.child("pieces/" + i).update({xx: alts.val().x, yy: alts.val().y});
  //lGameRef.child("pieces/" + i).update({x: alts.val().props[1], y: alts.val().props[2]});
  //lGameRef.child("pieces/" + i).update({x: parseFloat(alts.val().x), y: parseFloat(alts.val().y)});
  //alert("dione");
  //alert("done");
  //return; //tests
 	//if(!alts.child("color").exists()) lGameRef.child("pieces/" + i).update({color: (colObj.color.startsWith("0") ? "#" + colObj.color.substr(2,6) : colObj.color)});
  //if(alts.child("col").exists()) lGameRef.child("pieces/" + i).update({color: parseInt(prop[(prop[4] == "'" ? 5 : 7)]),col: null});


  var o;
  if(!uo.child(mid[0]).child(mid[1]).exists())
  {
  	//mp.push({na: true});
    //mainDOMs.push({na: true});
  	return;
  }

   o = uo.child(mid[0]).child(mid[1]).val();

  var colObj = usableColors[parseInt(prop[(prop[4] == "'" ? 5 : 7)])];
  //if(!colObj) colObj = new colors("gray",100);
  var head = document.createElement('div');
  var gom = document.createElement('div');

  head.appendChild(gom);
  head.style = "position: absolute;"; //transform: rotate(" + (prop[4] != "'" ? parseFloat(prop[6]) : 0) + "deg);";
  //gom.style = "transform: rotate(" + (prop[4] != "'" ? parseFloat(prop[6]) : 0) + "deg);" + "position: absolute;";
  gom.style = "position: absolute";

  gom.innerHTML = o.src;
  //Tests
  ar.push(i);
  gom.id = i;

  gom.childNodes[0].childNodes[0].onclick = function(e){
    if(!isShift)
    {
    	mainDOMs.forEach(function(c){
			if(c.childNodes)
			{
	      if(c.childNodes) c.childNodes[0].childNodes[0].childNodes[0].style.stroke = "";

      	var index = selObjs.indexOf(c.childNodes[0]);

    		if (index > -1) {
       		selObjs.splice(index, 1);
    		}
			}
    	});

      //Updating Set Controls
      for(var i0 = 0; i0 < 4; i0++)
      {
      	var l = document.getElementById("i_" + i0);
      	l.value = lsp[this.parentNode.parentNode.id].val().props[i0 + 6];
        l.style.backgroundColor = "lightgreen";

      }
      var l = document.getElementById("to_0");
      l.value = lsp[this.parentNode.parentNode.id].val().props[10];
      l.style.backgroundColor = "lightgreen";

      //Update Hidden Piece Details HPD
      var lo = lsp[this.parentNode.parentNode.id];
      if(lo.child("props/0").val().split(".")[0] == "0") document.getElementById("l_hpd_id").innerHTML = lo.val().props[(lo.val().props[4] == "'" ? 10 : 12)];
      else document.getElementById("l_hpd_id").innerHTML = "-";
      document.getElementById("l_hpd_zPos").innerHTML = lo.val().props[3];
    }
    /*if(selObjs.length > 1 || selObjs.length == 0)
    {
    	document.getElementById("l_hpd_id").innerHTML = "-";
      document.getElementById("l_hpd_zPos").innerHTML = "-";
    }*/
    this.style.stroke = "orange";
    this.style.strokeWidth = "4px";
    if(selObjs.indexOf(this.parentNode.parentNode) == -1) selObjs.push(this.parentNode.parentNode);
    else{

    	var index = selObjs.indexOf(this.parentNode.parentNode);
 			this.style.stroke = "";
    	if (index > -1) {
       	selObjs.splice(index, 1);
    	}
    }
    console.log("PIECE at " + this.parentNode.parentNode.id);
  }

  if(gom.childNodes[0].childNodes[1]) gom.childNodes[0].childNodes[1].style.pointerEvents = "none";

  document.getElementById('area').appendChild(head);
  document.getElementById('r').style.fill = (alts.val() ? alts.val().color : alts.color);//(colObj.color.startsWith("0") ? "#" + colObj.color.substr(2,6) : colObj.color);
  document.getElementById('r').id = "l";





  //head.style.marginLeft = parseFloat(prop[1]) * 1.5 + 500 + (o.off ? o.off.left : 0) + (prop[4] != "'" ? -2 : 0) + "px";
  //head.style.marginTop = parseFloat(prop[2]) * 1.5 + 250 + (o.off ? o.off.top : 0) + (prop[4] != "'" ? -2 : 0) +  "px";
  head.style.zIndex = parseFloat(prop[3]) + 500;

  if(prop[4] != "'")
  {

  }
  if(prop[0] == "0.0")
  {
  	lastTile = head;
    if(alts.child("spaced").exists())
    {
    	//Actions(0);
      selObjs[0] = gom;
      lGameRef.child("pieces/" + gom.id).update({spaced: null});
    }
  }
  var mp0 = mp.push(prop);
  var md0 = mainDOMs.push(head);
  head.props = prop;
  head.alt = {
  	mp: mp0,
    md: md0
  };

  //lGameRef.child("pieces/" + gom.id).update({props: prop});

  //FOR EDITOR //Add event listener to pieces so when their props change they'll be updated
  lGameRef.child("pieces/" + i).on('value',function(snap){
    var who = parseInt(snap.key);
    lsp[who] = snap;
    if(!snap.child("x").exists()) return;
    /*if(!mainDOMs[who])
    {
      //alert("SOMETHING WENT WRONG");
      return;
    }*/
    var o = uo.child(mid[0]).child(mid[1]).val();
    var prop = snap.val();
    var me = document.getElementById(who);
    var lo = lsp[who];
    document.getElementById(who).parentNode.style.marginLeft = (GetPos(1,prop,o)) + (lo.val().props[4] != "'" || lo.child("props/rot").exists() ? 0 : 0) + "px"; //parseFloat(snap.val().x
    document.getElementById(who).parentNode.style.marginTop = (GetPos(2,prop,o)) + (lo.val().props[4] != "'" || lo.child("props/rot").exists() ? 0 : 0) + "px";
    //Set Rotation
    if(snap.child("props/rot").exists())
    {
      console.log(`rotate(${parseFloat(snap.val().props.rot.z)}deg);`);
      console.log("rotate(" + snap.val().props.rot.z + "deg);");
      me.childNodes[0].style = "transform: rotate(" + snap.val().props.rot.z + "deg);";//`rotate(${parseFloat(snap.val().props.rot.z)}deg);`;
    }
    else if(snap.val().props[4] != "'")
    {
      console.log(parseFloat(snap.val().props[6]));
      me.style = `transform: rotate(${snap.val().props[6]}deg);`;
      //alert("change!");
      //console.log(me.style.transform);
    }
    else me.childNodes[0].style = `transform: rotate(${0}deg);`;
    console.log(document.getElementById(who));
    if(document.getElementById(who).childNodes)
    {
    	//console.log("col id: " + snap.val().color);
    	//console.log(usableColors[snap.val().color].color);
    	var colId = snap.val().color;
      var sobj = document.getElementById(who).childNodes[0].childNodes[0];
    	if(usableColors[colId]) sobj.style.fill = usableColors[colId].color;//snap.val().color;

      //Extras including is it transparent? will it need a guide outline?
      //Transparent Object
      //if(usableColors[colId].op < 1)
      sobj.style.opacity = usableColors[colId].op;


      //Set the Z axis
      me.parentNode.style.zIndex = parseFloat(snap.val().props[3]) + 500;

      //= "transform: rotate(" + (prop[4] != "'" ? parseFloat(prop[6]) : 0) + "deg);" + "position: absolute;";





      //Clear Object specifically the color "Transparent"
      //if(usableColors[colId].op == 0.3) sobj.style.border = "0px 0px 5px blue";
    }

  });
}

function AddPiece(id,atr)
{
console.log(id);
	if(!atr) atr = {x: 500, y: 250, color: 0, spaced: false};
  //if(!id) id = 5;
  console.log(id);
  var nowId = lsp.length;//lSnap.val().pieces.length;


  //var src2 = (id == 0 ? "0.0,0,0,0,',5,-1,-1,-1,-1," + lSnap.val().pieces.length : id == 0.1 ? "0.1,0,0,0,',5" : "5.0,0,0,-4,',5");
  var src = (id == 0 ? ["0.0",0,0,0,"'",5,-1,-1,-1,-1,lsp.length] : id == 0.1 ? ["0.1",0,0,0,"'",5,-1,-1,-1,-1,lsp.length] : id == "1.0" ? "1.0,0,0,-4,',5".split(",") : "5.0,0,0,-4,',5".split(","));
  if(selObjs[0] && !atr.spaced) src[3] = (parseInt(selObjs[0].parentNode.style.zIndex) - 500) + 4;

  if(atr.spaced && true)
  {
  	//var dir = atr.dir;
  	//src[dir + 6] =
    //var tar = {};
    //tar[dir + 6] = nowId;
    if(atr.dir == 0) lGameRef.child("pieces/" + selObjs[0].id + "/props").update({6: nowId});
    if(atr.dir == 1) lGameRef.child("pieces/" + selObjs[0].id + "/props").update({7: nowId});
    if(atr.dir == 2) lGameRef.child("pieces/" + selObjs[0].id + "/props").update({8: nowId});
    if(atr.dir == 3) lGameRef.child("pieces/" + selObjs[0].id + "/props").update({9: nowId});
    if(atr.dir == 0 || atr.dir == 1) src[(atr.dir == 0 ? 1 : 0) + 6] = selObjs[0].id;
    if(atr.dir == 2 || atr.dir == 3) src[(atr.dir == 2 ? 3 : 2) + 6] = selObjs[0].id;
  }

	lGameRef.child("pieces/" + lsp.length).set({src: "", props: src, x: atr.x, y: atr.y, color: atr.color, spaced: atr.spaced});
}

function DestroyPiece(alts)
{
	if(!parseInt(alts.key))
  {
  	console.log("couldnt parse int: " + alts.key + " : " + parseInt(alts.key));
  	return;
  }
  console.log("??? parse int: " + alts.key + " : " + parseInt(alts.key));
	var i = parseInt(alts.key);
  var t = document.getElementById(i).parentNode;
  document.getElementById("area").removeChild(t);
  console.log(t);
  console.log("vs2: " + t + " : " + t.alt.mp + " : " + t.alt.md + " : " + t.props);
	mp[t.alt.mp] = {};
  mainDOMs[t.alt.md] = {};
  lGameRef.child("pieces/" + i).off();
  console.log("successfully removed");

}

function TileOptions(id)
{
  switch(id)
  {
    //Set TileLocID
    case 0:
    if(selObjs.length == 0)
    {
      alert("more than 0 objects only supported");
      return;
    }
    selObjs.forEach(function(c){
      if(document.getElementById("to_0").value == lsp[c.id].val().props[10])
      {
        console.log("value is the same");
        return;
      }
      var v = document.getElementById("to_0").value;
      var props = {};
      props[10] = v;
      lGameRef.child("pieces/" + c.id + "/props").update(props);
      document.getElementById("to_0").style.backgroundColor = "yellow";
    });
    break;
  }
}
var es = [];
function ConnectSurroundingTiles()
{
	if(selObjs.length == 1 && selObjs[0].parentNode.getBoundingClientRect() && (lsp[selObjs[0].id].val().props[0].split(".")[0] == "0" && lsp[selObjs[0].id].val().props[10] != -1)) //lSnap.child("pieces/" + selObjs[0].id).val().props[0] == "0.0"
  {
  	var obj = selObjs[0];
  	var rect = obj.getBoundingClientRect();
		var xx  = rect.left + rect.width / 2;
		var yy = rect.top + rect.height / 2;

    console.log("x: " + xx + " y: " + yy);

    es = [];
    var sp = [
      {x:0,y:-30},
      {x:0,y:30},
      {x:30,y:0},
      {x:-30,y:0}
    ];
    var spp = [
      {x:2,y:0},
      {x:-2,y:0},
      {x:0,y:2},
      {x:0,y:-2}
    ];
    for(var i = 0; i < 4; i++)
    {
      es[i] = null;
      for(var i2 = 0; i2 < 4; i2++)
      {
        var r = document.elementFromPoint(xx + sp[i].x + spp[i2].x,yy + sp[i].y + spp[i2].y);
        //if(es[i] != r) es[i] = r;
        if(!es[i]) es[i] = r;
        if(es[i] && es[i] != r) es[i] = r;
      }

    }
		/*if(document.elementFromPoint(xx,yy - 30))
    {
      es.push(document.elementFromPoint(xx + 2,yy - 30));
    }
    else
    {
      es.push(document.elementFromPoint(xx - 2,yy - 30));
    }
    else es.push(0);
    es.push(document.elementFromPoint(xx,yy + 30));
    es.push(document.elementFromPoint(xx + 30,yy));
    es.push(document.elementFromPoint(xx - 30,yy))*/
    for(var i = 0; i < es.length; i++)
    {
    	if(es[i].id == "l") es[i] = es[i].parentNode.parentNode;
      //if(!es[i].id) es[i] = null;
    }
    for(var i = 0; i < 4; i++)
    {
    	if(lSnap.child("pieces/" + es[i].id + "/props").exists())
      {
        if(lSnap.child("pieces/" + es[i].id).val().props[10] != -1)
        {
          var props = {};
          props[i + 6] = selObjs[0].id;
        	if(lSnap.child("pieces/" + es[i].id + "/props").exists() ? lsp[es[i].id].val().props[0].split(".")[0] == "0" : false) lGameRef.child("pieces/" + es[i].id + "/props").update(props);
          var ops = (i == 0 ? 1 : i == 1 ? 0 : i == 2 ? 3 : i == 3 ? 2 : -1);
          if(ops != -1)
          {
          	var props2 = {};
          	props2[ops + 6] = es[i].id;
        		if(lsp[es[i].id].val().props[0].split(".")[0] == "0") lGameRef.child("pieces/" + selObjs[0].id + "/props").update(props2);
          } else console.log("somehow returned -1");
        }
      }
    }
    console.log("CONNECTION WAS SUCCESSFUL");
    /*var topElt;
    	topElt = document.elementFromPoint(xx + 30,yy);
      if(topElt.id == "l") topElt = topElt.parentNode.parentNode;
      console.log("RIGHT: " + (topElt ? topElt.id : "CANT"));
      topElt = document.elementFromPoint(xx - 30,yy);
      if(topElt.id == "l") topElt = topElt.parentNode.parentNode;
      console.log("LEFT: " + (topElt ? topElt.id : "CANT"));
      topElt = document.elementFromPoint(xx,yy + 30);
      if(topElt.id == "l") topElt = topElt.parentNode.parentNode;
      console.log("DOWN: " + (topElt ? topElt.id : "CANT"));
      topElt = document.elementFromPoint(xx,yy - 30);
      if(topElt.id == "l") topElt = topElt.parentNode.parentNode;
      console.log("UP: " + (topElt ? topElt.id : "CANT"));*/



    //topElt=document.elementFromPoint(x,y);
    //if(elt.isSameNode(topElt)) console.log('no overlapping');
  }
  else if(!selObjs[0].parentNode.getBoundingClientRect())
  {
  	alert("This function uses an experimental feature and your browser must not support it!");
    return;
  }
  else
  {
  	alert(selObjs.length == 0 ? "There arent any tiles selected!" : selObjs.length > 1 ? "This only works with 1 tile selected currently!" : "You have to select a 2x2 Tile W Stud");
    return;
  }
}

function SetDir(id)
{
	if(selObjs.length > 1 || selObjs.length == 0)
  {
  	alert("single object only supported");
  	return;
  }
  if(document.getElementById("i_" + id).value == lsp[selObjs[0].id].val().props[id + 6])
  {
  	console.log("value is the same");
    return;
  }
  var v = document.getElementById("i_" + id).value;
  var props = {};
  props[id + 6] = v;
  lGameRef.child("pieces/" + selObjs[0].id + "/props").update(props);
  document.getElementById("i_" + id).style.backgroundColor = "yellow";
}

function EditorActions(id,atr)
{
	switch(id)
  {
  	//Set Move Inc
  	case 0:
    	var lo = document.getElementById("i_mi");
      ed.moveInc = lo.value;
      //console.log("Set MoveInc: " + lo.value + " : " + ed.moveInc);

    break;
  }
}

function CreateGame()
{
  var vas = document.getElementById("gameCreate_i").value; //database.ref("Multi/" + in).update({});
  if(vas.length == 0) return;

  database.ref("Multi/" + vas).endAt(vas).once('value',function(snap){
    var amt = 0;
    snap.forEach(function(c){
      alert("A game already exists with that name!");
      amt++;
      //return;
    });
    if(amt == 0) CreateGameP2(vas);
  });
}
function CreateGameP2(va)
{
  alert("CREATING GAME AT: " + va);
  var map = document.getElementById("map_i").value;
  var gc = document.getElementById("gameCreate_i").value;
  if(!map || map.length == 0) map = "0.0,0,0,0,',16,-1,-1,-1,-1,0";
  var res = map.split("&");
  var pieces = [];
  for(var i = 0; i < res.length; i++)
  {
    var prop = res[i].split(",");
    var mid = prop[0].split(".");
    var o = uo.child(mid[0]).child(mid[1]).val();
    pieces[i] = {};
    var rot = {z:null};
    if(prop[4] != "'")
    {
      rot = {z: parseFloat(prop[6])};
      for(var i2 = 4; i2 < 6; i2++)
      {
        prop.splice(i2,1);
      }
      prop[4] = "'";

      //if(prop.length >= 8)


      //"5.0,0,0,-4,45,45,45,0"
      //rot = {z: parseFloat(prop[6])};
      //for(var i2 = 0; i2 < prop.length; i2++)
      //{
        //tprop[i2] = prop[i2 >= 4 ? i2 + 2 : i2];
      //}
      //prop = tprop;
    }
    if(rot.z) prop.rot = rot;
    pieces[i].props = prop;
    pieces[i].src = "";
    pieces[i].color = prop[prop[4] != "'" ? 7 : 5];
    pieces[i].x = parseFloat(prop[1]);//parseFloat(prop[1]) * 1.5 + 500 + (o ? (o.off ? o.off.left : 0) : 0) + (prop[4] != "'" ? -2 : 0);
    pieces[i].y = parseFloat(prop[2]);//parseFloat(prop[2]) * 1.5 + 250 + (o ? (o.off ? o.off.top : 0) : 0) + (prop[4] != "'" ? -2 : 0);
  }
  console.log("FINISHED FOR LOOP FOR CREATION");
  newGameRef.child(gc).set({pAmt: 0, amt: 0, pieces: pieces});
  document.getElementById("game_i").value = gc;
  //Waiting();
  //LoadAuth();
}
//var waiting = false;

function GetPos(num,prop,o)
{
  if(num == 1) return parseFloat(prop.x) * 1.5 + 500 + (o ? (o.off ? o.off.left : 0) : 0) + (prop[4] != "'" ? -2 : 0);
  else if(num == 2) return parseFloat(prop.y) * 1.5 + 250 + (o ? (o.off ? o.off.top : 0) : 0) + (prop[4] != "'" ? -2 : 0);
}

function Waiting()
{
  LoadGame();
}

function LeaveGame()
{
  if(lSnap && pSnap && user.uid)
  {
    lGameRef.child("players/" + user.uid).set(null);
  }
}

/////////////////////
//RightClick Menu Stuff

var cxMenu = document.getElementById("menu").style;
var cxBase = document.getElementById("menu");
if (document.addEventListener) {
  document.addEventListener('contextmenu', function(e) {
  	if(cxMenu.visibility == "visible")
    {
    	cxMenu.opacity = "0";
    	//setTimeout(function() {
      cxMenu.visibility = "hidden";
    //}, 100001);
    }
    else
    {
    	var posX = e.clientX;
    	var posY = e.clientY;
    	menu(posX, posY);
    	//e.preventDefault();
    }
    e.preventDefault();
  }, false);
  /*document.addEventListener('click', function(e) {
    cxMenu.opacity = "0";
    setTimeout(function() {
      cxMenu.visibility = "hidden";
    }, 100001);
  }, false);*/
} else {
  document.attachEvent('oncontextmenu', function(e) {
    var posX = e.clientX;
    var posY = e.clientY;
    menu(posX, posY);
    e.preventDefault();
  });
  document.attachEvent('onclick', function(e) {
    cxMenu.opacity = "0";
    setTimeout(function() {
      cxMenu.visibility = "hidden";
    }, 501);
  });
}

function menu(x, y) {
  //cxMenu.top = y + "px";
  //cxMenu.left = x + "px";
	if(y > window.innerHeight / 2) cxMenu.top = (y - cxBase.scrollHeight) + "px";
  else cxMenu.top = y + "px";
  cxMenu.left = x + "px";
  cxMenu.visibility = "visible";
  cxMenu.opacity = "1";
}


































































































//Handling Collisions
function colCheck(shapeA, shapeB) {
		//Check whether they are the same object or not // Helps so you dont colide with yourself and cant move
    if(shapeA == shapeB) return;

    // get the vectors to check against
    var vX = (shapeA.props.x + (shapeA.props.width / 2)) - (shapeB.props.x + (shapeB.props.width / 2)),
        vY = (shapeA.props.y + (shapeA.props.height / 2)) - (shapeB.props.y + (shapeB.props.height / 2) + 1),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.props.width / 2) + (shapeB.props.width / 2),
        hHeights = (shapeA.props.height / 2) + (shapeB.props.height / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    //console.log(Math.abs(vX) < hWidths && Math.abs(vY) < hHeights);
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                //shapeA.props.y += oY;
                userRef.update({y: gSnap.val().y + oY});
            } else {
                colDir = "b";
                //shapeA.props.y -= oY;
                userRef.update({y: gSnap.val().y - oY});
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                //shapeA.props.x += oX;
                userRef.update({x: gSnap.val().x + oX});
            } else {
                colDir = "r";
                //shapeA.props.x -= oX;
                userRef.update({x: gSnap.val().x - oX});
            }
        }
    }
    return colDir;
}
