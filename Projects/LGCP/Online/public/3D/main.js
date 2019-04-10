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

var uc = [];
var uo;

		firebase.database().ref('colors/').once('value',function(snap){
	  for(var i = 0; i < snap.val().length; i++)
	  {
    	var co = snap.child(i).val();
      uc.push({color: (co.color.startsWith("0") ? "#" + co.color.substr(2,6) : co.color), op: snap.child(i).val().op + 0.25, reflect: (snap.child(i).val().reflect)});

      var s = document.createElement("span");
      s.id = "cm_" + i;
      s.onclick = function(e){
      	console.log("color: " + this.innerHTML + " : id - " + this.id);
        var tid = this.id.split("_")[1];
        if(selObjs.length > 0)
        {
        	selObjs.forEach(function(c){
          	if(c)
          	lGameRef.child("pieces/" + c.name.split("_")[1]).update({color: parseInt(tid)});
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
    //console.log(usableColors);
	});

  ////////

	/*firebase.database().ref('colors/').once('value',function(snap){
	  for(var i = 0; i < snap.val().length; i++)
	  {
    	var co = snap.child(i).val();
	    uc.push({color: (co.color.startsWith("0") ? "#" + co.color.substr(2,6) : co.color), op: snap.child(i).val().op + 0.25, reflect: (snap.child(i).val().reflect)});*/

      /*var s = document.createElement("span");
      s.id = "cm_" + i;
      s.onclick = function(e){
      	console.log("color: " + this.innerHTML + " : id - " + this.id);
        var tid = this.id.split("_")[1];
        if(selObjs.length > 0)
        {
        	selObjs.forEach(function(c){
          	lGameRef.child("pieces/" + c.id).update({color: parseInt(tid)});
          });
        }
      }
      s.innerHTML = snap.child(i).val().name;
      document.getElementById("colors_dd").appendChild(s);*/
	  //}
	  //console.log("LOAD COLORS COMPLETE");
    //console.log(uc);

    firebase.database().ref('objLocs/').once('value',function(snap){
	 		uo = snap;
	    var dd = document.getElementById("objs_dd");
	    snap.forEach(function(c1){
	    	c1.forEach(function(c2){
			var cd = document.createElement("span");
	    		cd.onclick = `AddPiece($(c1.key + "." + c2.key))`;
			cd.innerHTML = c2.key;
			dd.appendChild(cd);
		});
	    });

      init();
		});
	//});








var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;
var selObjs = [];

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild( renderer.domElement );

renderer.setClearColor( 0xffffff, 1);
renderer.shadowMapEnabled = true;
//renderer.shadowMap.width = 1000;

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshStandardMaterial( { color: 0x00ff00} );
var player = new THREE.Mesh( geometry, material );
player.position.set(3,3,0);
//scene.add( player );

camera.position.set(0,5,5);

function animate() {
	requestAnimationFrame( animate );
  render();
	//renderer.render( scene, camera );
  update();
}
animate();

var overMenu = false;
var m = document.getElementById("menu");
m.onmouseover = function(e){
	overMenu = true;
};
m.onmouseleave = function(e){
	overMenu = false;
}

      document.addEventListener('mousedown', (event) =>
      {
      	console.log("CLICK!");
      	var button = event.button;

        if(button == 0)
        {
        	if(selObjs[0] && !overMenu && (intersects.length == 0 || INTERSECTED != selObjs[0] || isShift))  //if(selObjs[0] && !overMenu && (INTERSECTED || isShift)) // ||  // && (INTERSECTED != selObjs[0])
        	{
        		//EditMaterial(selObj, [{id: 0, way: false}], 0xff0000);
            //if(!INTERSECTED) return;
            if(isShift && INTERSECTED)
            {
            	var a = selObjs.indexOf(INTERSECTED);
              if(a == -1)
              {
              	INTERSECTED.material.wireframe = true;
              	var b = selObjs.push(INTERSECTED);
                return;
              }
              else
              {
              	INTERSECTED.material.wireframe = false;
                selObjs.splice(a,1);
                return;
              }
            }
            else// if(isShift || (!isShift && INTERSECTED))
            //if(isShift)
            {
              if(!INTERSECTED) return;
              //if(INTERSECTED) alert("desel");
              selObjs.forEach(function(c){
                c.material.wireframe = false;
              });
                selObjs = [];
                if(intersects.length > 0)
                {
                  selObjs[0] = INTERSECTED;
                  selObjs[0].material.wireframe = true;
                //EditMaterial(selObj, [{id: 0, way: true}], 0x0000ff);
                }
            }


        	}
        	else if(!overMenu)
        	{
        		selObjs[0] = INTERSECTED;
        		if(selObjs[0]) selObjs[0].material.wireframe = true;//EditMaterial(selObj, [{id: 0, way: true}], 0x0000ff);
        		}
        	}
      });

function render() {

				renderer.render( scene, camera );
}


      function update()
      {
  		    	// find intersections
		//camera.lookAt(lookAtObj.position);
  		// create a Ray with origin at the mouse position
  		//   and direction into the scene (camera direction)
  		var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
  		vector.unproject(camera);
  		var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

  		// create an array containing all objects in the scene with which the ray intersects
  		intersects = ray.intersectObjects(pieces);//scene.children);

  		// INTERSECTED = the object in the scene currently closest to the camera
  		//		and intersected by the Ray projected from the mouse position

  		// if there is one (or more) intersections
  		if (intersects.length > 0) {
  		  // if the closest object intersected is not the currently stored intersection object
  		  if (intersects[0].object != INTERSECTED) {
  		    // restore previous intersection object (if it exists) to its original color
  		    if (INTERSECTED)
  		      //INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            INTERSECTED.traverse(function(child)
        	{
        	if (child instanceof THREE.Mesh)
            	{
                	//child.material.color = new THREE.Color(INTERSECTED.currentHex);
                    //child.material.wireframe = false;
                	//child.material.color.opacity = 0.5;
           		}
        	});
  		    // store reference to closest object as current intersection object
  		    INTERSECTED = intersects[0].object;
  		    // store color of closest object (for later restoration)
            INTERSECTED.traverse(function(child)
        	{
        	if (child instanceof THREE.Mesh)
            	{
                	child.currentHex = INTERSECTED.material.color.getHex();
                	//child.material.color.opacity = 0.5;
           		}
        	});
  		    //INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
  		    // set a new color for closest object
  		    //INTERSECTED.material.color.setHex(0xffff00);
            INTERSECTED.traverse(function(child)
        	{
        	if (child instanceof THREE.Mesh)
            	{
                	//child.material.color = new THREE.Color(0xffff00);
                    //child.material.wireframe = true;
                	//child.material.color.opacity = 0.5;
           		}
        	});
  		  }
  		} else // there are no intersections
  		{
  		  // restore previous intersection object (if it exists) to its original color
  		  if (INTERSECTED)
  		    //INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            INTERSECTED.traverse(function(child)
        	{
        	if (child instanceof THREE.Mesh)
            	{
                	//child.material.color = new THREE.Color(INTERSECTED.currentHex);
                    //child.material.wireframe = false;
                	//child.material.color.opacity = 0.5;
           		}
        	});
  		  // remove previous intersection object reference
  		  //     by setting current intersection object to "nothing"
  		  INTERSECTED = null;
  		}



      /*if(newGameRef)
      {

      		for(i = 0; i < playersArr.length; i++)
          {
          		newGameRef.child(('player' + i),function(snap){
              		playersArr[i].position.set

              });
          }
      }*/





      }



function SetUpLights()
{
	var light2 = new THREE.AmbientLight( 0xffffff, 0.7 ); //0.7
  scene.add( light2 );

  directionalLight = new THREE.DirectionalLight( 0xffffff, 0.65);
  directionalLight.castShadow = true;
  directionalLight.target = player;
  directionalLight.shadow.camera.left = -450.5; //default is 450.5
	directionalLight.shadow.camera.right = 450.5;
	directionalLight.shadow.camera.top = 450.5;
	directionalLight.shadow.camera.bottom = -450.5;
  directionalLight.shadowMapWidth = 2048;
	directionalLight.shadowMapHeight = 2048;
  directionalLight.shadow.camera.far = 2000;
  directionalLight.shadow.camera.near = -1000;

  scene.add(directionalLight);
  directionalLight.position.set( player.position.x - 1,player.position.y + 2, player.position.z - 2 );

	var dl2 = new THREE.DirectionalLight(0xffffff, 0.4);
  dl2.target = player;
  dl2.position.set(4,-1,-0.5);
  scene.add(dl2);
}

var controls = new THREE.OrbitControls( camera, renderer.domElement );

function init()
{
	SetUpLights();
  //LoadMap();
  //LoadGame();

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener( 'resize', onWindowResize, false );



}

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
	user = result.user;
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
	} else {
    // No user is signed in.
    console.log("no user in");
    document.getElementById("p_Username").innerHTML = "no user";
  }

  });
  user = firebase.auth().currentUser;
  if(user)console.log(user);
}





var isShift = false;
var isSpace = false;
var dirOrder = [1,0,3,2];
document.addEventListener('keydown',function(e){
	var key = e.key;
  console.log(key);
  if(key == "Shift") isShift = true;
  if(key == " ")
  {
    isSpace = true;
    if(selObjs[0]) e.preventDefault();
  }
    //Editor
  if(key == "w" || key == "s" || key == "d" || key == "a")
  {
  var dir = (key == "w" ? dirOrder[0] : key == "s" ? dirOrder[1] : key == "d" ? dirOrder[2] : key == "a" ? dirOrder[3] : -1);
  if(isSpace && selObjs.length == 1)
  {
  	var arrP = lSnap.child("pieces/" + selObjs[0].name.split("_")[1]).val();
  	AddPiece(0,{x: arrP.x + (dir == 3 ? 20 : dir == 2 ? -20 : 0), y: arrP.y + (dir == 1 ? -20 : dir == 0 ? 20 : 0), color: 0, spaced: true, dir: dir});
  }
  //else
  {
  	var speed = 10 * 1;//ed.moveInc;

    if(selObjs.length > 0)
    {
    selObjs.forEach(function(c){
      //var old = c.name;//.split("_")[1];
    	//c.name.replace("p_","");
      var r = c.name.split("_")[1];
    	if(dir == 3 || dir == 2)
      {
      	//var par = document.getElementById(selObj.id).parentNode;
        //par.style.marginLeft.replace("px","");
        //par.style.marginLeft = (parseFloat(par.style.marginLeft) + (dir == 3 ? 16 : -16)) + "px";
        lGameRef.child("pieces/" + r).update({
        	x: (lSnap.child("pieces/" + r).val().x + (dir == 3 ? speed : -speed))
        });
      }
      if(dir == 0 || dir == 1)
      {
      	//var par = document.getElementById(selObj.id).parentNode;
        //par.style.marginTop.replace("px","");
        //par.style.marginTop = (parseFloat(par.style.marginTop) + (dir == 1 ? -16 : 16)) + "px";
       	lGameRef.child("pieces/" + r).update({
        	y: (lSnap.child("pieces/" + r).val().y + (dir == 1 ? -speed : speed))
        });
      }
      //c.name = old;
   	});


    }
  }
	}


  //Move By Z Up
  if(key == "W")
  {
  	//alert("Increasing Z by 4");
    selObjs.forEach(function(c){
    	var props = {};
      var r = c.name.split("_")[1];
      props[3] = parseInt(lSnap.child("pieces/" + r + "/props/3").val()) + 4;
    	lGameRef.child("pieces/" + r + "/props").update(props);
    });
  }
  //Move By Z Down
  if(key == "S")
  {
  	//alert("Decreasing Z by 4");
    selObjs.forEach(function(c){
    	var props = {};
      var r = c.name.split("_")[1];
      props[3] = parseInt(lSnap.child("pieces/" + r + "/props/3").val()) - 4;
    	lGameRef.child("pieces/" + r + "/props").update(props);
    });
  }

  //Turn Right or Left 45 Deg
  if(key == "D" || key == "A")
  {
  	selObjs.forEach(function(c){
      var r = c.name.split("_")[1];
    	var lo = lSnap.child("pieces/" + r);
    	if(lo.val().props[4] != "'")
      {
      	var props = {};
      	props[6] = parseFloat(lSnap.child("pieces/" + r + "/props/6").val()) + (key == "D" ? 22.5 : -22.5);
    		lGameRef.child("pieces/" + r + "/props").update(props);
      }
      else
      {
      	var ol = lSnap.child("pieces/" + r + "/props/rot/z").val();
        if(!ol) ol = 0;
      	var num = parseFloat(ol) + (key == "D" ? 22.5 : -22.5);
      	if(num != 0) lGameRef.child("pieces/" + r + "/props/rot").update({z: num});
        else lGameRef.child("pieces/" + r + "/props/rot").update({z: null});
      }
    });
  }

//Deselect
if(key == "F")
{
  selObjs.forEach(function(c){
    c.material.wireframe = false;
  });
    selObjs = [];
    /*if(intersects.length > 0)
    {
      selObjs[0] = INTERSECTED;
      selObjs[0].material.wireframe = true;
    //EditMaterial(selObj, [{id: 0, way: true}], 0x0000ff);
  }*/
}

  //Delete piece
if(key == "X")
{
  if(selObjs.length == 0) return;
  for(var i = 0; i < selObjs.length; i++)
  {
    //if(selObjs[i].parentNode.props[0] == "0.0")
    if(lSnap.child("pieces/" + selObjs[i].name.split("_")[1]).val().props[0] == "0.0")
    {
      for(var i2 = 0; i2 < 4; i2++)
      {
        var s = scene.getObjectByName("p_" + lSnap.child("pieces/" + selObjs[i].name.split("_")[1] + "/props/" + (i2 + 6)).val());
        if(s)
        {
          for(var i3 = 0; i3 < 4; i3++)
          {
            if(lSnap.child("pieces/" + s.name.split("_")[1] + "/props/" + (i3 + 6)).val() == selObjs[i].name.split("_")[1])
            {
              var props = {};
              props[i3 + 6] = -1;
              lGameRef.child("pieces/" + s.name.split("_")[1] + "/props").update(props);
            }
          }
        }


      }
    }

    lGameRef.child("pieces/" + selObjs[i].name.split("_")[1]).set({});
  }
  selObjs = [];
}


  //Moving
  if((key == "ArrowUp" || key == "ArrowDown" || key == "ArrowRight" || key == "ArrowLeft"))
  {
     e.preventDefault();
     console.log("lSnap : " + lSnap.val().loc);
     console.log(user);
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
     if(!lSnap.child('players/' + user.uid + "/fighting").exists())
     {
      var curP = lSnap.child('players/' + user.uid);
      var dir = (key == "ArrowUp" ? dirOrder[0] : key == "ArrowDown" ? dirOrder[1] : key == "ArrowRight" ? dirOrder[2] : key == "ArrowLeft" ? dirOrder[3] : -1);
      var nArr = lSnap.child("pieces/" + curP.val().loc).child("props").val();
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

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  ReDir();
}

function GetPos(i,mid)
{
	var o = uo.child(mid[0]).child(mid[1]).val();
	var bx = lSnap.child("pieces/" + i).val().x;
  var lx = parseFloat(bx);
  //lx -= (o.off ? o.off.left : 0);
  //lx -= 500;
  lx /= 1.5;
  var by = lSnap.child("pieces/" + i).val().y;
  var ly = parseFloat(by);
  //ly -= (o.off ? o.off.top : 0);
  //ly -= 250;
  ly /= 1.5;
  //lGameRef.child("pieces/" + i).update({x: lx, y: ly});
  return {x: lx, y: ly};
}

var rr = 0;
function ReDir()
{
  if(!lSnap) return;

  var r = camera.rotation.z;
  var d = -1;
  //if(players[])
  r *= 180/Math.PI;
  console.log("FIRST R: " + r);
  //r  = r % 180;
  //console.log("SECOND R: " + r);
  /*//forward
  if(r <= 45 && r >= -45) dirOrder = [1,0,3,2];
  //right
  else if(r > 45 && r < 135) dirOrder = [2,3,1,0];
  //back
  else if(r >= 135 && r <= 225) dirOrder = [0,1,2,3];
  //Left
  else if(r > 225 && r < -45) dirOrder = [3,2,0,1];*/

  //forward
  if(r <= 45 && r >= -45) dirOrder = [1,0,3,2];
  //right
  else if(r < -45 && r > -135) dirOrder = [3,2,0,1];
  //back
  else if((r <= -135 && r >= -180) || (r <= 180 && r >= 135)) dirOrder = [0,1,2,3];
  //left
  else if(r > 45 && r < 135) dirOrder = [2,3,1,0];

  var rr = dirOrder[0];
  if(lSnap.child("players/" + user.uid).val().rot != camera.rotation.z)
  {
    lGameRef.child("players/" + user.uid).update({rot: rr == 0 ? 0 : rr == 1 ? 180 : rr == 2 ? -90 : rr == 3 ? 90 : 0});
  }
  //rr = rr == 0 ? 0 : rr == 1 ? 180 : rr == 2 ? -90 : rr == 3 ? 90 : 0;
  //players[user.uid].rotation.y = rr;
}

var map = "0.0,0,0,0,',3,-1,-1,1,-1,0&0.0,-20,0,0,',2,2,-1,-1,0,1,1.6&0.0,-20,20,0,',3,3,1,-1,-1,2&0.0,-20,40,0,',8,4,2,-1,-1,3,1.7&0.0,-20,60,0,',8,5,3,-1,-1,4,1.5&0.0,-20,100,0,',1,6,4,-1,-1,5,1.1&0.0,-20,120,0,',0,7,5,64,9,6,1.6&0.0,-20,140,0,',1,-1,6,-1,8,7,0.0,1&0.0,0,140,0,',0,-1,9,7,10,8&0.0,0,120,0,',1,8,-1,6,-1,9,0.0,0&0.0,20,140,0,',8,-1,-1,8,11,10&0.0,40,140,0,',8,-1,-1,10,12,11,1.5&0.0,60,140,0,',8,-1,-1,11,13,12&0.0,80,140,0,',0,17,16,12,14,13&0.0,100,140,0,',1,-1,15,13,-1,14&0.0,100,120,12,',0,14,-1,16,-1,15&0.0,80,120,12,',1,13,-1,-1,15,16&0.0,80,160,0,',1,18,13,-1,-1,17&0.0,80,180,0,',0,19,17,-1,-1,18&0.0,80,200,0,',1,20,18,-1,22,19&0.0,80,220,0,',0,-1,19,-1,21,20&0.0,100,220,0,',1,-1,22,20,-1,21&0.0,100,200,0,',0,21,-1,19,21,22&0.0,0,180,0,',1,24,-1,-1,-1,23&0.0,0,200,0,',0,25,23,-1,-1,24&0.0,0,220,0,',1,26,24,-1,-1,25,1.0&0.0,0,240,0,',2,27,25,56,-1,26,1.1&0.0,0,260,0,',3,28,26,-1,-1,27,1.2&0.0,0,280,0,',1,29,27,-1,-1,28,1.3&0.0,0,300,0,',0,30,28,-1,-1,29&0.0,0,320,0,',1,31,29,-1,-1,30&0.0,0,360,0,',0,32,30,34,33,31&0.0,0,380,0,',1,-1,31,-1,-1,32&0.0,20,360,0,',1,-1,-1,31,-1,33&0.0,-20,360,0,',1,-1,-1,35,31,34&0.0,-40,360,0,',0,-1,-1,36,34,35&0.0,-60,360,0,',1,41,-1,37,35,36&0.0,-80,360,0,',0,40,42,38,36,37&0.0,-100,360,0,',1,39,-1,-1,37,38&0.0,-100,380,0,',0,-1,38,-1,40,39&0.0,-80,380,0,',6,-1,37,39,41,40&0.0,-60,380,0,',0,-1,36,40,-1,41&0.0,-80,340,0,',1,37,43,-1,-1,42&0.0,-80,320,0,',0,42,44,-1,-1,43&0.0,-80,300,0,',1,43,45,-1,-1,44&0.0,-80,260,0,',0,44,53,46,-1,45&0.0,-100,260,0,',1,-1,47,-1,45,46&0.0,-100,240,0,',0,46,57,48,53,47&0.0,-120,240,0,',1,-1,-1,49,47,48&0.0,-160,240,0,',0,52,-1,50,48,49&0.0,-180,240,0,',1,51,-1,-1,49,50&0.0,-180,260,0,',0,-1,50,-1,52,51&0.0,-160,260,0,',1,-1,49,51,-1,52&0.0,-80,240,0,',1,45,-1,47,54,53&0.0,-60,240,0,',0,-1,-1,53,55,54&0.0,-40,240,0,',1,-1,-1,54,56,55&0.0,-20,240,0,',3,-1,-1,55,26,56&0.0,-100,220,0,',1,47,58,-1,-1,57&0.0,-100,200,0,',0,57,59,-1,-1,58&0.0,-100,180,0,',1,58,60,-1,-1,59&0.0,-100,160,0,',0,59,61,-1,-1,60&0.0,-100,140,0,',1,60,67,65,62,61&0.0,-80,140,0,',8,-1,-1,61,63,62&0.0,-60,140,0,',8,-1,-1,62,64,63&0.0,-40,140,0,',8,-1,-1,63,6,64&0.0,-120,140,0,',0,-1,66,68,61,65&0.0,-120,120,12,',1,65,-1,-1,67,66&0.0,-100,120,12,',0,61,-1,66,-1,67&0.0,-140,140,0,',1,-1,-1,69,65,68&0.0,-160,140,0,',0,-1,-1,70,68,69&0.0,-180,140,0,',1,-1,-1,71,69,70&0.0,-200,140,0,',0,72,-1,-1,70,71&0.0,-200,160,0,',1,-1,71,-1,-1,72&0.1,-15,80,0,0,0,90,8,0,0,0,0,-1&0.1,-25,80,0,0,0,90,8,0,0,0,0,-1&5.1,-10,10,-4,',2&5.0,-20,60,-4,',7&2.0,-20,90,-4,',0&5.1,-10,130,-4,',0&5.0,40,140,-4,',7&5.1,90,130,-4,',0&5.0,-60,140,-4,',7&5.1,-110,130,-4,',0&0.1,5,160,0,0,0,90,8,0,0,0,0,-1&0.1,-5,160,0,0,0,90,8,0,0,0,0,-1&0.1,5,340,0,0,0,90,8,0,0,0,0,-1&0.1,-5,340,0,0,0,90,8,0,0,0,0,-1&0.1,-75,280,0,0,0,90,8,0,0,0,0,-1&0.1,-85,280,0,0,0,90,8,0,0,0,0,-1&0.1,-140,245,0,',8,0,0,0,0,-1&0.1,-140,235,0,',8,0,0,0,0,-1&5.1,-10,250,-4,',2&2.3,0,190,-4,0,0,90,0&2.0,80,170,-4,',0&5.1,90,210,-4,',0&5.1,-90,250,-4,',0&2.0,-50,240,-4,',0&2.0,-150,140,-4,',0&2.0,-130,240,-4,',0&2.0,-30,360,-4,',0&5.1,10,370,-4,',0&2.3,0,310,-4,0,0,90,0&2.3,-80,310,-4,0,0,90,0&5.1,-170,250,-4,',0&5.1,-190,150,-4,',0&5.2,-80,380,-4,',0&2.3,-100,190,-4,0,0,90,0&3.0,-5,75,12,',1&3.0,-5,75,0,',1&4.2,90,120,0,',1&4.2,-110,120,0,',1&3.4,90,105,0,',1&3.4,-110,105,0,',1&3.1,90,105,12,',1&3.1,-110,105,12,',1&3.0,115,105,12,',1&3.0,65,105,12,',1&3.0,-135,105,12,',1&3.0,-85,105,12,',1&3.0,-145,255,0,',1&3.0,-145,255,12,',1&3.0,-145,225,0,',1&3.0,-145,225,12,',1&3.0,-195,225,0,',1&3.0,-195,225,12,',1&3.0,-35,75,0,',1&3.0,-35,75,12,',1&7.0,0,160,4,',1&7.0,-20,80,4,',1&7.0,-80,280,4,',1&7.0,0,340,4,',1&7.0,-140,240,4,0,0,90,1&1.0,-35,155,0,',1&8.1,-35,155,4,',1&10.1,-35,155,16,0,0,-112,19&8.0,-35,75,24,',1&8.0,-5,75,24,',1&1.1,-165,160,0,0,0,90,0&8.0,-165,165,4,',8&8.0,-165,155,4,',8&0.1,-165,160,8,0,0,90,8,-1,-1,-1,-1,140&9.0,-165,160,12,0,0,45,4&1.0,-115,275,0,',1&8.1,-115,275,4,',1&10.1,-115,275,16,0,0,-68,19&4.0,-30,270,0,',0&9.0,-15,255,0,',7&0.1,-30,255,0,',7,-1,-1,-1,-1,147&0.1,-15,270,0,0,0,90,7,-1,-1,-1,-1,148&11.0,-30,255,4,0,0,180,7&11.0,-15,270,4,0,0,-90,7&8.3,-30,270,16,',7&8.0,-30,270,12,',7";

var gc = "LeEpic2";


/*var uo = {
	0: {
  	0: "https://claeb008.github.io/objs/0/Tile.obj"
  }
};*/
var pieces = [];
var loc = new THREE.Vector3(10,5,20);
function ImportPiece(path,path2,callback,link)
{
//alert(0);
	// instantiate a loader
var loader = new THREE.OBJLoader();
//alert(2);
// load a resource
  //if(path2)
  {
  	if(!uo.child(path).exists()) return;
  	if(!uo.child(path2).exists()) return;
  }
loader.load(
	// resource URL
  //("https://claeb008.github.io/objs/" + path + "/" + (path2 ? path2 : "") + "/" + (path2 ? uo.val()[path][path2] : "") + ".obj"),
	("https://claeb008.github.io/objs/" + (!link ? path + "/" + uo.val()[path][path2] : link) + ".obj"),
	// called when resource is loaded
	function ( object ) {
		var obj = object.content;
    /*object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {

            //child.material = new THREE.MeshStandardMaterial({color: 0xff0000});
						//child.position = loc;//pieces.push(child);
            //child.localScale.set(0.5,0.5,0.5);
            //console.log(child);
            //console.log(object.children[0]);
        }
    } );*/
    //var r = 1.25;
    var r = 1.25;
    object.children[0].scale.set(r,r,r);
		pieces.push(object);
    scene.add( object );

    if(callback) callback(object);
	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' + error);
	}
);
}

THREE.Object3D.prototype.rotateAroundWorldAxis = function(axis, radians)
{
  rotWorldMatrix = new THREE.Matrix4();
  rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
  rotWorldMatrix.multiply(this.matrix);
  this.matrix = rotWorldMatrix;
  this.rotation.setFromRotationMatrix(this.matrix);
}

//ImportPiece(0,0);
var players = {};
function LoadPlayer(alts)
{
	ImportPiece(0,0,function(child){
  	var go = child.children[0];

    //go.position.set(0,0,12);
    //go.scale.set(1,1,1);

    SetColor(child.children[0],6);
    go[user.uid] = go;
    //go.name = user.uid;
    go.castShadow = true;
    go.receiveShadow = true;
    lGameRef.child("players/" + alts.key).on('value',function(snap){
    	var p = scene.getObjectByName("p_" + snap.val().loc);
    	go.position.addVectors(p.position, new THREE.Vector3(0,4,0));
      if(snap.child("rot").exists()) go.rotation.y = snap.val().rot * Math.PI/180;
    });
    //go.material = new THREE.MeshPhongMaterial({color: 0xff0000});
  },"Microfig");
}

var lSnap;
var lGameRef;
function LoadGame()
{
  document.body.appendChild( renderer.domElement );
	lGameRef = database.ref("Multi/" + gc);
  lGameRef.on('value',function(snap){
  	lSnap = snap;
  });
  lGameRef.child("pieces").on('child_added',function(snap){
  	//SpawnPiece
    SpawnPiece(snap);
  });
  lGameRef.child("pieces").on('child_removed',function(snap){
  	DestroyPiece(snap);
  });
  lGameRef.child("players").on('child_added',function(snap){
  	//SpawnPiece
    //SpawnPiece(snap);
    LoadPlayer(snap);
  });
}

function SpawnPiece(alts)
{
	var prop = alts.val().props;//c.split(",");
    var mid = prop[0].split(".");
    mid[0] = parseInt(mid[0]);
    mid[1] = parseInt(mid[1]);
    if(prop[0])
    {
    	ImportPiece(mid[0],(mid[1] ? mid[1] : 0),function(child){
      var go = child.children[0];
      var sc = 1;//0.75
      child.children[0].position.set(parseFloat(alts.val().props[1]) * sc,parseFloat(prop[3]) * sc,parseFloat(alts.val().props[2]) * sc);
      //child.children[0].position.set(parseFloat(alts.val().x) * 0.75,parseFloat(prop[3]) * 0.75,parseFloat(alts.val().y) * 0.75);
      var rot = {x: 0, y: 0, z: 0};
      if(alts.child("props/rot/z").exists())
      {
      	//go.rotateAroundWorldAxis(new THREE.Vector3(1,0,0), parseFloat(prop[4]) * Math.PI/180);
				//go.rotateAroundWorldAxis(new THREE.Vector3(0,1,0), -parseFloat(prop[6]) * Math.PI/180);
				//go.rotateAroundWorldAxis(new THREE.Vector3(0,0,1), parseFloat(prop[5]) * Math.PI/180);
        //go.rotateAroundWorldAxis(new THREE.Vector3(0,1,0), -parseFloat(alts.val().props.rot.z) * Math.PI/180);
      }
      else if(prop[4] != "'")
      {
      	//go.rotateAroundWorldAxis(new THREE.Vector3(0,1,0), -parseFloat(alts.val().props[6]) * Math.PI/180);
      }
      //var colObj = uc[prop[prop[4] == "'" ? 5 : 7]];
      SetColor(child.children[0],alts.val().color);
      //child.children[0].material = new THREE.MeshPhongMaterial({envMap: cubeMap,color: colObj.color,transparent: (colObj.op < 1),opacity: colObj.op,reflectivity: (colObj.reflect ? 1 : 0.55),specular: 0xaaaaaa,shininess: 10}); //color: uc[prop[4] == "'" ? 5 : 7].color
      pieces.push(go);
      go.name = "p_" + alts.key;
      child.name = "ph_" + alts.key;

      lGameRef.child("pieces/" + alts.key).on('value',function(snap){
      if(!snap.child("props").exists()) return;
      var sc = 1;
      var i = parseInt(snap.key);
      //alert(snap.key);
      var prop = snap.val().props;
      var go = scene.getObjectByName("p_" + snap.key);//pieces[parseInt(snap.val().key)];
      	//go.position.set(parseFloat(snap.val().props[1]) * sc,parseFloat(prop[3]) * sc,parseFloat(snap.val().props[2]) * sc);
        go.position.set(parseFloat(snap.val().x) * sc,parseFloat(prop[3]) * sc,parseFloat(snap.val().y) * sc);
        SetColor(go,snap.val().color,0);
        //go.position.set(parseFloat(GetPos(i,snap.val().props[0].split(".")).x) * sc,parseFloat(prop[3]) * sc,GetPos(i,snap.val().props[0].split(".")).y * sc);
      	if(snap.child("props/rot/").exists())
      	{
      		//go.rotateAroundWorldAxis(new THREE.Vector3(1,0,0), parseFloat(prop[4]) * Math.PI/	180);
					//go.rotateAroundWorldAxis(new THREE.Vector3(0,1,0), -parseFloat(prop[6]) * Math.PI/180);
					//go.rotateAroundWorldAxis(new THREE.Vector3(0,0,1), parseFloat(prop[5]) * Math.PI/180);
          go.rotation.set(0,-parseFloat(snap.val().props.rot.z) * Math.PI/180,0);
        	//go.rotateAroundWorldAxis(new THREE.Vector3(0,1,0), -parseFloat(snap.val().props.rot.z) * Math.PI/180);
      	}
      	else if(prop[4] != "'")
      	{
        	go.rotation.set(0,-parseFloat(snap.val().props[6]) * Math.PI/180,0);
      		//go.rotateAroundWorldAxis(new THREE.Vector3(0,1,0), -parseFloat(snap.val().props[6]) * Math.PI/180);
      	}
        else go.rotation.set(0,0,0);
      });
      });
    }
}

function DestroyPiece(alts)
{
	if(!parseInt(alts.key))
  {
  	console.log("couldnt parse int: " + alts.key + " : " + 				parseInt(alts.key));
  	return;
  }
	var i = parseInt(alts.key);
  lGameRef.child("pieces/" + i).off();
  var t = scene.getObjectByName("ph_" + i);//document.getElementById(i).parentNode;
  //document.getElementById("area").removeChild(t);
  scene.remove(scene.getObjectByName("ph_" + i));
  console.log(t);
  console.log(i);
  //console.log(t);
  //console.log("vs2: " + t + " : " + t.alt.mp + " : " + t.alt.md + " : " + t.props);
	//mp[t.alt.mp] = {};
  //mainDOMs[t.alt.md] = {};

  console.log("successfully removed");
}

var maxX = 0;
var minX = 0;
var maxZ = 0;
var minZ = 0;
function LoadMap()
{
	var res = map.split("&");
  res.forEach(function(c){
  	var prop = c.split(",");
    var mid = prop[0].split(".");
    mid[0] = parseInt(mid[0]);
    mid[1] = parseInt(mid[1]);
    if(prop[0])
    {
    	ImportPiece(mid[0],(mid[1] ? mid[1] : 0),function(child){
      var go = child.children[0];
      var of = 1;
      var x = parseFloat(prop[1]) * of;
      var z = parseFloat(prop[2]) * of;
      if(x * of > maxX) maxX = x;
      if(x * of < minX) minX = x;
      if(z * of > maxZ) maxZ = z;
      if(z * of < minZ) minZ = z;
      child.children[0].position.set(x,parseFloat(prop[3]) * of,z);
      var rot = {x: 0, y: 0, z: 0};
      if(prop[4] != "'")
      {
      	go.rotateAroundWorldAxis(new THREE.Vector3(1,0,0), parseFloat(prop[4]) * Math.PI/180);
				go.rotateAroundWorldAxis(new THREE.Vector3(0,1,0), -parseFloat(prop[6]) * Math.PI/180);
				go.rotateAroundWorldAxis(new THREE.Vector3(0,0,1), parseFloat(prop[5]) * Math.PI/180);
      }
      //var colObj = uc[prop[prop[4] == "'" ? 5 : 7]];
      SetColor(child.children[0],prop[prop[4] == "'" ? 5 : 7]);
      go.receiveShadow = true;
      go.castShadow = true;
      //child.children[0].material = new THREE.MeshPhongMaterial({envMap: cubeMap,color: colObj.color,transparent: (colObj.op < 1),opacity: colObj.op,reflectivity: (colObj.reflect ? 1 : 0.55),specular: 0xaaaaaa,shininess: 10}); //color: uc[prop[4] == "'" ? 5 : 7].color
      });
    }
  });


  //LoadPlayer();
}

function AddPiece(id,atr)
{
console.log(id);
	if(!atr) atr = {x: 500, y: 250, color: 0, spaced: false};
  //if(!id) id = 5;
  console.log(id);
  var nowId = lSnap.val().pieces.length;


  //var src2 = (id == 0 ? "0.0,0,0,0,',5,-1,-1,-1,-1," + lSnap.val().pieces.length : id == 0.1 ? "0.1,0,0,0,',5" : "5.0,0,0,-4,',5");
  var src = (id == 0 ? ["0.0",0,0,0,"'",5,-1,-1,-1,-1,lSnap.val().pieces.length] : id == 0.1 ? ["0.1",0,0,0,"'",5,-1,-1,-1,-1,lSnap.val().pieces.length] : id == "1.0" ? "1.0,0,0,-4,',5".split(",") : "5.0,0,0,-4,',5".split(","));
  if(selObjs[0] && !atr.spaced) src[3] = (parseInt(selObjs[0].position.y)) + 4;

  if(atr.spaced && true)
  {
  	//var dir = atr.dir;
  	//src[dir + 6] =
    //var tar = {};
    //tar[dir + 6] = nowId;
    var idd = selObjs[0].name.split("_")[1];
    if(atr.dir == 0) lGameRef.child("pieces/" + idd + "/props").update({6: nowId});
    if(atr.dir == 1) lGameRef.child("pieces/" + idd + "/props").update({7: nowId});
    if(atr.dir == 2) lGameRef.child("pieces/" + idd + "/props").update({8: nowId});
    if(atr.dir == 3) lGameRef.child("pieces/" + idd + "/props").update({9: nowId});
    if(atr.dir == 0 || atr.dir == 1) src[(atr.dir == 0 ? 1 : 0) + 6] = idd;
    if(atr.dir == 2 || atr.dir == 3) src[(atr.dir == 2 ? 3 : 2) + 6] = idd;
  }

	lGameRef.child("pieces/" + lSnap.val().pieces.length).set({src: "", props: src, x: atr.x, y: atr.y, color: atr.color, spaced: atr.spaced});
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







function SetColor(who,id,subid)
{
	var colObj = uc[id];
	if(!subid) who.material = new THREE.MeshPhongMaterial({envMap: cubeMap,color: colObj.color,transparent: (colObj.op < 1),opacity: colObj.op,reflectivity: (colObj.reflect ? 1 : 0.55),specular: 0xaaaaaa,shininess: 10,wireframe: who.material.wireframe});
  else
  {
  	switch(subid)
    {
    	case 0:
      	who.material.color = colObj.color;
      break;
    }
  }
}

var cubeMap = loadCubemap();
function loadCubemap() {


var path = "https://threejs.org/examples/textures/cube/SwedishRoyalCastle/";
var format = '.png';


var urls = [
    //path + 'px' + format, path + 'nx' + format,
    //path + 'py' + format, path + 'ny' + format,
    //path + 'pz' + format, path + 'nz' + format
    "https://Claeb008.github.io/cubemaps/0/Right.png",
    "https://Claeb008.github.io/cubemaps/0/Left.png",
    "https://Claeb008.github.io/cubemaps/0/Top.png",
    "https://Claeb008.github.io/cubemaps/0/Bottom.png",
    "https://Claeb008.github.io/cubemaps/0/Front.png",
    "https://Claeb008.github.io/cubemaps/0/Back.png"
];


var loader = new THREE.CubeTextureLoader();


loader.setCrossOrigin ('');
var cubeMap = loader.load(urls)//,//new THREE.CubeRefractionMapping());

cubeMap.format = THREE.RGBFormat;

return cubeMap;

}


/////////////////////
//RightClick Menu Stuff

var cxMenu = document.getElementById("menu").style;
var cxBase = document.getElementById("menu");
if (document.addEventListener) {
  document.addEventListener('contextmenu', function(e) {
   	if(!isShift) return;
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
	//if(!isShift) return;
  //cxMenu.top = y + "px";
  //cxMenu.left = x + "px";
	if(y > window.innerHeight / 2) cxMenu.top = (y - cxBase.scrollHeight) + "px";
  else cxMenu.top = y + "px";
  cxMenu.left = x + "px";
  cxMenu.visibility = "visible";
  cxMenu.opacity = "1";
}
