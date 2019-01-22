var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var object;

var cobj;
var cube2;
var tempObj = new THREE.Object3D();

var projector, mouse = {
  x: 0,
  y: 0
},
INTERSECTED;

var intersects;
var selObj;

//var canNow = true;
var p0 = 0, p1 = 0, pieceIds = [];
var pieces = [];
var mainPieces =
[
// ModelID 1/2, X pos, Y pos, Z pos, ColorID, Forward, Back, Right, Left, TileID
//[0,0,80,80,80,7,-1,-1,-1,-1,0],
];
var usableObjsLocs_OLD =
[
["Tile.obj"],
  ["4by4Plate.obj","6by6Plate.obj"],
  [],
  ["1by1Brick.obj","2by1Brick.obj"]
];
var usableObjsLocs = [];
var usableObjsLocs1 =
[
["Tile.obj","2by1Plate_Stud.obj"],
  ["1by1Plate.obj","1by2Plate.obj","1by3Plate.obj","1by4Plate.obj"],
  ["2by2Plate.obj","2by3Plate.obj","2by4Plate.obj","2by6Plate.obj"],   ["1by1Brick.obj","1by2Brick.obj","1by3Brick.obj","1by4Brick.obj","1by6Brick.obj","1by8Brick.obj","1by10Brick.obj","1by12Brick.obj"],//"1by16Brick.obj"],
  ["2by2Brick.obj","2by3Brick.obj","2by4Brick.obj","2by6Brick.obj","2by8Brick.obj","2by10Brick.obj"],
  ["4by4Plate.obj","6by6Plate.obj","8by8Plate.obj"],
  ["1by3Brick_Bow.obj","1by4Brick_Bow.obj","1by4Brick_Bow_2Tall.obj"],
  ["2by1Door.obj","2by1Door_Gate.obj","2by1Door_ShutterGate.obj"],
  ["1by1PlateRound.obj","1by1BrickRound.obj","1by1Cone.obj","2by2FlatCone.obj"],
  ["1by1Tile.obj"],
  ["Fire.obj","Feather.obj"],
  ["1by1Slope.obj","1by1Slope2Sided.obj","1by1Slope4Sided.obj","1by2SlopeWithPlate.obj","1by2Slope.obj","1by2BrickWSlope.obj","2by2BrickW2Slopes_Corner.obj","2by2BrickWInverted2Slopes.obj","2by2BrickWSlope.obj","2by3BrickWSlope.obj","2by4BrickWSlope.obj","2by6BrickWSlope.obj","3by1BrickWSlope_25.obj","3by2BrickWSlope_25.obj","4by6BrickW2Slopes.obj","1by2RidgedTile.obj","1by2Slope2Tall.obj","2by2Slope2Tall.obj","1by2Slope3Tall.obj","2by2Slope3Tall.obj"],
  ["1by2Slope_Inv.obj","2by2Slope_Inv.obj","1by3Slope_Inv.obj","2by3Slope_Inv.obj","1by2Slope3Tall_Inv.obj"],
  ["StickAerial.obj"],

  [
  "Arch1x6x1WEdge.obj",
  "Brick1x1WHolder-Side.obj",
  "Brick1x2WHole.obj",
  "Brick2x2Dome.obj",
  "BrickCurved2x2.obj", // 4
  "BrickWArch1x1.obj",
  "Butt.obj",
  "DorsalFin.obj",
  "FacetBrick3x3x1.obj", // 8
  "FenceWBars.obj", // 9
  "FlatTile1x2.obj",
  "Frog.obj", // 11
  "HornSmall.obj",
  "MinifigBackPlateWKnob.obj",
  "PalisadeBrick1x2.obj",
  "Plate1x1WHolder-Side.obj", // 15
  "Plate1x1WTooth.obj",
  "Plate1x2WSlide.obj",
  "Plate2x2Round.obj",
  "PlateWBows2x2.obj", // 19
  "PyramidBrick2x2x2x73.obj",
  "RadiatorGrill.obj",
  "SlideHandle.obj",
  "SteeringWheelSmall.obj",
  "Streamer.obj",
  "StudW4Points-Flower.obj",
  "Turkey-Drumstick.obj"
  ]
];
/*function readTextFile(file) {
var rawFile = new XMLHttpRequest();
rawFile.open("GET", file, false);
rawFile.onreadystatechange = function ()
{
  if(rawFile.readyState === 4)
  {
      if(rawFile.status === 200 || rawFile.status == 0)
      {
          var allText = rawFile.responseText;
          alert(allText);
          alert(allText[0]);

          return allText;
      }
  }
}
rawFile.send(null);
}
usableObjsLocs = readTextFile('https://Claeb008.github.io/objs/PiecesArr.txt');*/



var usableObjsGeo =
[
[], // Pieces that you can actually walk on // 0
  [], // Plates that are x by x // 1
  [], // Plates that are 2 by x // 2
  [], // Bricks // 3
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  []

];
var usableObjs =
[
[], // Pieces that you can actually walk on // 0
  [], // Plates that are x by x // 1
  [], // Plates that are 2 by x // 2
  [], // Bricks // 3
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  []

];

var out = [];
for(var attr in "https://Claeb008.github.io/objs/")
{
  console.log("attr: " + attr);
  out.push(attr.value);
  //alert(attr);
}
//alert(out);

var usableColors123 =
[
"gray", // 0
  "darkgray", // 1
  new THREE.Color(0,128 / 255,0), //"green", // 2
  new THREE.Color(0,198 / 255,0), //"lightgreen", // 3
  "white", // 4
  "black", // 5
  "red", // 6
  new THREE.Color(0,0.4,1),//"blue",//0x2653A7, // 7
  "brown", // 8
  "limegreen", // 9
  0xDBC181, // 10 BrickYellow
  0x8D7959 // 11 SandYellow
];
function colors(color,op)
{
this.color = color;
this.op = op;
}
var usableColors222 =
[
new colors("gray",1),
new colors("lightgray",1),
new colors(new THREE.Color(0,128 / 255,0),1),
new colors(new THREE.Color(0,198 / 255,0),1),
new colors("white",1),
new colors(new THREE.Color(0.1,0.1,0.1),1),
new colors("red",1),
new colors(new THREE.Color(0,0.4,1),1),
new colors("brown",1),
new colors("limegreen",1),
new colors(0xDBC181,1),
new colors(0x8D7959,1)


];
var usableColors = [];


var player;
var playersArr = [];
var newGameRef;
var pInfo =
{
loc: 0,
  //rot: 0,
  roll: -1,
  curMoves: 0,
  moveAmt: 0

};

var manager;
var loader;

//Lighting
var directionalLight;

//GETFIREBASE READY ///////////////////////////////////////////////////////////////////////////
// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
  apiKey: "AIzaSyDfIFP4ZgQct3tg3jtvKqCaRR8V8kbVmTw",
  authDomain: "lgcp-9bb89.firebaseapp.com",
  databaseURL: "https://lgcp-9bb89.firebaseio.com",
  projectId: "lgcp-9bb89",
  storageBucket: "lgcp-9bb89.appspot.com",
  messagingSenderId: "192476211570"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
//////////////////////////////////////////////////////////////////////////////////////
// GAME




  function GetPiecesReady2()
    {

    }
  // Adds the pieces geometry to the UsableObjs array
  function GetPiecesReady()
    {


        //if(usableObjsLocs[p0].length > p1)
          if(usableObjsLocs[p0].length > p1)
          {
            if(pieceIds.includes(p0 + "." + p1))
              {
                ImportPiece("https://Claeb008.github.io/objs/" + p0 + "/" + usableObjsLocs[p0][p1] + ".obj", p0 * 160,80,p1 * 160, 1, [p0,p1]);
                  p1++;
              }
              else
              {
                p1++;
                GetPiecesReady();
              }
              //ImportPiece("https://Claeb008.github.io/objs/" + usableObjsLocs[p0][p1], p0 * 160,80,p1 * 160, 1, [p0,p1]);
              //console.log(p0 + " : " + p1);
              //p1++;
              //counter++;

          }
          else if(usableObjsLocs.length - 1 > p0)
          {
            p0++;
              p1 = 0;
              GetPiecesReady();
          }
          else
          {
            for(i = 0; i < usableObjsLocs.length; i++)
              {
                for(i2 = 0; i2 < usableObjsLocs[i].length; i2++)
                  {
                    console.log("LAST: " + p0 + " : " + p1);

                      scene.remove(usableObjs[i][i2]);
                  }
              }
              console.log("FINISHED LOADING OBJECTS");
              LoadMap();
          }
          //console.log(usableObjsLocs[p0][p1].length);
        /*for(i = 0; i < usableObjsLocs.length; i++)
          {
            for(i2 = 0; i2 < usableObjsLocs[i].length; i2++)
              {
                console.log("IMPOROT THIS PIECE: " + "https://Claeb008.github.io/objs/" + i + "/" + usableObjsLocs[i][i2]);
                ImportPiece("https://Claeb008.github.io/objs/" + i + "/" + usableObjsLocs[i][i2], i * 10,100,i2 * 10, 1);
              }
          }*/
    }
    function GetPiecesReady_Old()
    {
        for(i = 0; i < usableObjsLocs.length; i++)
          {
            for(i2 = 0; i2 < usableObjsLocs[i].length; i2++)
              {
                console.log("IMPOROT THIS PIECE: " + "https://Claeb008.github.io/objs/" + i + "/" + usableObjsLocs[i][i2]);
                ImportPiece("https://Claeb008.github.io/objs/" + i + "/" + usableObjsLocs[i][i2], i * 10,100,i2 * 10);
              }
          }
    }

  init();
  animate();

    function FixMan()
    {
      manager = new THREE.LoadingManager( loadModel );

              function loadModel() {

        object.traverse( function ( child ) {

          if ( child.isMesh )
          {
              child.material = new THREE.MeshPhongMaterial( { color: "#ff0000",specular: 0x555555,shininess:100} ); //0x00f000
              child.castShadow = true; //default is false
              child.receiveShadow = true; //default
                              //child.material.wireframe = true;
              child.scale.set(5,5,5);
              object = child;
          }//child.material.map = texture;



        } );

        //cobj.position.y = - 95;
        //scene.add( object );

      }
    }

    function onError() {}

          function onProgress( xhr )
          {

      if ( xhr.lengthComputable ) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

      }

    }

    function init() {

      //container = document.createElement( 'div' );
      //document.body.appendChild( container );
              container = document.getElementById("candiv");

      camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20000 );
      camera.position.z = 250;

      // scene

      scene = new THREE.Scene();

      //var ambientLight = new THREE.AmbientLight( 0x606060 ); //0.4
      //scene.add( ambientLight );

      //var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
      //camera.add( pointLight );
      scene.add( camera );

              //PostProcesses
      // material

      var mat = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

      //light

      var light2 = new THREE.AmbientLight( 0xffffff, 0.7 ); // 0.2 // soft white light // 0xffff60
      scene.add( light2 );

      //var light3 = new THREE.PointLight( 0xffffff, 2, 1000 );
      //light3.position.set( 50, -10, 30 );
      //light3.castShadow = true;            // default false
      //scene.add( light3 );


          renderer = new THREE.WebGLRenderer({ antialias: true});
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
              renderer.shadowMap.enabled = true;
      renderer.shadowMap.soft = true;
              renderer.shadowMapType = THREE.PCFSoftShadowMap;

      renderer.shadowCameraNear = 3;
      renderer.shadowCameraFar = camera.far;
      renderer.shadowCameraFov = 50;

      renderer.shadowMap.bias = 0.0039;
      renderer.shadowMap.darkness = 0.3;
      renderer.shadowMapWidth = 2048;
      renderer.shadowMapHeight = 2048;




      // manager

    FixMan();

      //var manager = new THREE.LoadingManager( loadModel );

      manager.onProgress = function ( item, loaded, total ) {

        console.log( item, loaded, total );

      };

      // texture

      var textureLoader = new THREE.TextureLoader( manager );

      var texture = textureLoader.load( 'https://threejs.org/examples/textures/UV_Grid_Sm.jpg' );

      // model

      //Setup PLAYER
      ImportPiece('https://Claeb008.github.io/objs/Microfig.obj', 0, 16, 0, -1);

      //



      container.appendChild( renderer.domElement );

      document.addEventListener( 'mousemove', onDocumentMouseMove, false );

      //

      window.addEventListener( 'resize', onWindowResize, false );

              var controls = new THREE.OrbitControls( camera, renderer.domElement );
              //Floor

              var floorGeo = new THREE.BoxBufferGeometry(1000,1,1000);
              var floorMat = new THREE.MeshPhongMaterial({color: 0xffffff});
              var floor = new THREE.Mesh(floorGeo, floorMat);
              //floor.castShadow = true;
              floor.position.set(0,-16,0);
      floor.receiveShadow = true;
              scene.add(floor);

    }

    function onWindowResize() {

      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function onDocumentMouseMove( event ) {

      mouseX = ( event.clientX - windowHalfX ) / 2;
      mouseY = ( event.clientY - windowHalfY ) / 2;
              mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1.05; //1.05

    }

    //

    function animate() {

      requestAnimationFrame( animate );
      render();
      update();
    }

    function render() {

      //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
      //camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

      //camera.lookAt( scene.position );

      renderer.render( scene, camera );

    }
          //THIS IS THE OFFICIAL GETPIECESREADY
          //GetPiecesReady()

    //var pppg = new THREE.BoxGeometry( 5,5,5  )
    //scene.add(pppg);

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
    var indexID;
    function ImportPiece(path, x,y,z, id, atr)
    {
      loader = new THREE.OBJLoader( manager );

  loader.load( path, function ( obj ) {

  object = obj;

      object.traverse(function(child)
      {
        if (child instanceof THREE.Mesh)
            {
                  child.position.x = x;
            child.position.y = y;
            child.position.z = z;
                //child.material.color.opacity = 0.5;

                  //pieces.push(child);
                  if(id == 1)
                  {
                    child.scale.set(5,5,5);
                      child.material = new THREE.MeshPhongMaterial({color: "blue",specular: 0x555555,shininess: 100});
                      child.castShadow = true;
                      child.receiveShadow = true;
                    usableObjs[atr[0]][atr[1]] = child;
                      usableObjsGeo[atr[0]][atr[1]] = child.geometry;

                    GetPiecesReady();
                      scene.remove(object)

                      //if(p0 == usableObjsLocs.length - 1 && p1 == usableObjsLocs[p0 - 1].length) console.log("THIS IS THE FINAL LINE");
                      //if(p0 == 10 && p1 == 2) console.log("THIS IS THE LAST LINE 222");
                  }
                  else if(id == 2)
                  {
                    LoadMapPiece();
                      //0,0,0,0,0&0,0,80,0,0&0,0,160,0,0&0,0,160,80,0
                  }
                  else if(id == 3)
                  {
                    child.geometry = usableObjsLocs[atr[0]][atr[1]];

                      //child.material = new THREE.MeshLambertMaterial({color: "red"});
                      child.castShadow = true;
                      child.receiveShadow = true;
                      pieces.push(child);
                    scene.add(object);

                  }
                  else
                  {
                    if(id != -1)
                      {

                        {pieces.push(child);
                          scene.add(object);}

                      }
                      else
                      {
                        child.scale.set(5,5,5);
                          child.rotation.set(0,180 * Math.PI / 180,0);
                        //child.material = new THREE.MeshPhongMaterial({color: "red",specular: 0x555555,shininess: 100});
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                        player = child;
                          scene.add(player);
                          playersArr.push(player);
                          //indexID = playersArr.push(player);
                          if(directionalLight)
                          {
                          indexID = playersArr.push(player);
                          directionalLight.target = player;
                            directionalLight.position.set( player.position.x - 1, player.position.y + 4, player.position.z - 2 );
                            //playersArr.push(player);
                           alert("just before");
                           alert("atr -3 : " + indexID + " : " + playersArr[0].position.y);



                                  newGameRef.child('player' + 1).child('loc').on('value',function(snap){
                                      //playersArr[playersArr.includes(player)]

          //alert("atr -3 : " + indexID + " : " + playersArr[0].position.y);
               //alert(gSnap);
               //alert(snap.val());
                          playersArr[1].position.set(pieces[snap.val()].position.x,pieces[snap.val()].position.y + 16,pieces[snap.val()].position.z);
               //player.position.set(180,0,0);


                                  });







                            //AddOnToPlayers();
                            return;
                          }

                          directionalLight = new THREE.DirectionalLight( 0xffffff, 0.65);
                          //scene.add(directionalLight);
      //player.add(directionalLight);
      //directionalLight.position.set( 1, 3, 2 ).normalize();
          //directionalLight.rotation.set(0,0,80);
              directionalLight.castShadow = true;
                    //directionalLight.position.x = -75;
    //directionalLight.position.y = 250;
    //directionalLight.position.z = -110;
    directionalLight.target = player;//new THREE.Object3D();
    //directionalLight.target.position.set(150,0,0);
              directionalLight.shadow.camera.left = -450.5; //default is 450.5
      directionalLight.shadow.camera.right = 450.5;
      directionalLight.shadow.camera.top = 450.5;
      directionalLight.shadow.camera.bottom = -450.5;
              directionalLight.shadowMapWidth = 2048;
      directionalLight.shadowMapHeight = 2048;
              directionalLight.shadow.camera.far = 2000;
              directionalLight.shadow.camera.near = -1000;
              //directionalLight.shadow.camera.width = 1024;
      //directionalLight.shadow.camera.height = 1024;
              //var dl = new THREE.CameraHelper( directionalLight.shadow.camera );
      //scene.add( directionalLight );
              //scene.add(dl);
              scene.add(directionalLight);
              directionalLight.position.set( player.position.x - 1, player.position.y + 4, player.position.z - 2 );

              var dl2 = new THREE.DirectionalLight( 0xffffff, 0.3);
              dl2.position.x = -100;
              dl2.position.y = 250;
              dl2.position.z = 110;
              dl2.castShadow = true;
              dl2.target = new THREE.Object3D();
          dl2.target.position.set(150,0,0);
              dl2.shadow.camera.left = -450.5;
      dl2.shadow.camera.right = 450.5;
      dl2.shadow.camera.top = 450.5;
      dl2.shadow.camera.bottom = -450.5;
              //scene.add(dl2);
              //scene.add(dl);
                  }}
            }
      });



        //object.material.color.setHex(0xff0000);
        //object.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

  }, onProgress, onError );

    }

    var curX = 0;
    function ImportObj(id)
    {
      if(id == 0)
      {
        ImportPiece("https://Claeb008.github.io/objs/" + document.getElementById("obj_loc").value, curX, 0, 0);
        curX += 80;
      }
      else if(id == 2)
      {
        ImportPiece("https://Claeb008.github.io/objs/" + document.getElementById("obj_loc_rel1").value + "/" + document.getElementById("obj_loc").value, curX, 0, 0);
      }
      else if(id == 1)
      {
      //object = new THREE.Object3D();



        //var testObj = usableObjs[document.getElementById("obj_loc_rel1").value][document.getElementById("obj_loc_rel2").value];
        //var tmpObj = null;

          //child.geometry = testObj.geometry;
          //child.material = testObj.material;
          //child.scale.set(5,5,5);






    object = new THREE.Mesh(usableObjs[1][0].geometry, usableObjs[1][0].material);
          object.scale.set(5,5,5);
          //object = usableObjs[1][0];

          console.log("hello1");
          scene.add(object);
          pieces.push(object);








          //object = new THREE.Object3D();
          //tmpObj = null;


    }
    }
    function AddOnToPlayers()
    {
      if(newGameRef)
      {
      //indexID =
      //playersArr.push(player);
          alert("atr -3 : " + indexID + " : " + playersArr[0].position.y);
          firebase.database().ref('gameplay/' + document.getElementById('i_OpenGame').value + "/player" + 1).on('value',function(snapO)
               {
               player.position.set(pieces[snapO.val().loc].position.x,pieces[snapO.val().loc].position.y + 16,pieces[snapO.val().loc].position.z);

     }
      );}
    }
    function ImportObj_Old()
    {
      loader = new THREE.OBJLoader();
      loader.load("https://Claeb008.github.io/objs/" + document.getElementById("obj_loc").value, function(obj)
      {
        obj.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshLambertMaterial("red");
              //child.material = new THREE.MeshPhongMaterial( { emissive: 0xffffff } );
              child.castShadow = true; //default is false
              child.receiveShadow = true;
              //child.material.transparent = true;
              //child.material.opacity = 0.5;
              child.material.wireframe = true;
              //child.material.color = new THREE.Color("red");
          }
        });



        tempObj = new THREE.Object3D();
        tempObj.model = obj;

        tempObj.add(tempObj.model);

        //scene.add(tempObj);
        tempObj.position.x = curX;
        //tempObj.scale.set(10,10,10);
        object = tempObj;
        scene.add(object);


        tempObj.model.Material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
        tempObj.model.Material.color = new THREE.Color("blue");






        //obj.color.setHex( 0x00ff00);
        //tempObj = obj;
        //tempObj.name = "tempObj";
          //                  geo222 = tempObj.mesh;
        //mat222 = tempObj.material;

        //scene.add(tempObj);
        //scene.add(cobj);
        //tempObj.position.x = curX;


        //tempObj.material.color = new THREE.Color( 0x0000ff ); //= new THREE.MeshBasicMaterial({color: "#ff0000"});

        //scene.getObjectByName("tempObj").material.color = new THREE.Color("blue");
        curX += 80;

        var geometry2 = new THREE.BoxBufferGeometry( 20,20,20 );
        var material2 = new THREE.MeshBasicMaterial( { color: 0xffff00, 	wireframe: true} );
        cube2 = new THREE.Mesh( geometry2, material2 );
        cube2.name = "cube2";
        scene.add( cube2 );

        //cube2 = tempObj;

      });
    }

    function MoveObj()
    {
        if(selObj) EditMaterial(selObj, [], document.getElementById("obj_col").value);

          //ImportPiece("https://Claeb008.github.io/objs/" + document.getElementById("obj_loc").value, 0, 0, 0);

        //var domEvent = new THREEx.DomEvent();
        //domEvent.bind(tempObj, 'click', function(object3d){ object3d.scale.x *= 2; });
      //tempObj.position.y += 10;
      //tempObj.material = new THREE.MeshBasicMaterial( { color: "#00ff00"} );
      //tempObj.geometry = new THREE.BoxGeometry(1,1,1);
      //cube2.position.y += 10;

    }

    function EditMaterial(obj, ids, color)
    {
      obj.traverse(function(child)
      {
        if (child instanceof THREE.Mesh)
          {
            for(i = 0; i < ids.length; i++)
          {
            switch(ids[i].id)
              {
                case 0:
                          child.material.wireframe = (ids[i].way);
                  break;
              }
          }

              if(ids.length == 0)
              {
                child.material.color = new THREE.Color(color);
                //child.material.color.opacity = 0.5;
              }
          }
      });


    }

    document.addEventListener('mousedown', (event) =>
    {
      var button = event.button;

      if(button == 0)
      {
        if(selObj && (intersects.length == 0 || INTERSECTED != selObj))
        {
          EditMaterial(selObj, [{id: 0, way: false}], 0xff0000);
            selObj = null;
            if(intersects.length > 0)
            {
              selObj = INTERSECTED;
            EditMaterial(selObj, [{id: 0, way: true}], 0x0000ff);
            }
        }
        else
        {
          selObj = INTERSECTED;
          if(selObj) EditMaterial(selObj, [{id: 0, way: true}], 0x0000ff);
          }
        }
    });
    function clickUp()
    {

    }

    document.addEventListener('keyup', (event) =>
    {
        const keyName = event.key;
    });
    var lookAtObj = new THREE.Object3D();
    scene.add(lookAtObj);
    document.addEventListener('keydown', (event) =>
    {
        const keyName = event.key;
          //console.log(keyName);
    if(selObj)
          {
            if(keyName == "d" || keyName == "D")
              {
                selObj.position.x += 40;
              }
              if(keyName == "a" || keyName == "A")
              {
                selObj.position.x -= 40;
              }
              if(keyName == "w" || keyName == "W")
              {
                if(event.shiftKey) selObj.position.y += 16;
                else selObj.position.z -= 40;
                  console.log(selObj.position.y);
              }
              if(keyName == "s" || keyName == "S")
              {
                if(event.shiftKey) selObj.position.y -= 16;
                else selObj.position.z += 40;
              }
              if(keyName == "h")
              {
                selObj.position.y = -500;

                  selObj.geometry.dispose();
                  selObj.material.dispose();
                  //selObj.material.map.dispose();
                  //scene.remove(selObj);

              }
              if(keyName == "k")
              {
                for(i = 0; i < pieces.length; i++)
                {
                    pieces[i].position.y = -500;

                  pieces[i].geometry.dispose();
                  pieces[i].material.dispose();
                }
              }
              if(keyName == "g")
              {
                selObj.traverse(function(child)
            {
              if (child instanceof THREE.Mesh)
                {

                //newObj = new THREE.Mesh(child.geometry, new THREE.MeshLambertMaterial({color: 0x0000ff}));
                  //scene.add(newObj);
                    }
        });
              }

              if(keyName == "c") EditMaterial(selObj, [], document.getElementById("obj_col").value);

          }

          //Rolling
          if(keyName == "r" && ((pInfo.curMoves == pInfo.moveAmt && !newGameRef) || (newGameRef)))
          {
            if(newGameRef)
            {
              //newGameRef.once('value',function(snap){
                  var turn = gSnap.child('turn').val();
                  var curP = gSnap.child('player' + turn);

                      if(curP.val().curMoves == curP.val().moveAmt){

                  var roll = Math.floor((Math.random()) * 6);
                      var moveAmt = (roll == 0 ? 1 : roll == 1 || roll == 2 ? 2 : roll == 3 || roll == 4 ? 3 : 4)


                  newGameRef.child('player' + turn).update({
                      roll: roll,
                      curMoves: 0,
                      moveAmt: moveAmt


                  });

                  //console.log("roll : " + pInfo.roll.toString() + " / moveAmt : " + pInfo.moveAmt.toString());
                      document.getElementById("l_curMoves").innerHTML = "0";
                    document.getElementById("l_moveAmt").innerHTML = moveAmt;
                          }
              //});




                /*newGameRef.once('value',function(snap){
                    var ss = snap.child('player' + snap.child('turn').val());
                    var roll = ss.child('roll');
                    var curMoves = ss.child('curMoves');
                    var moveAmt = ss.child('moveAmt');

                    if(curMoves.val() == moveAmt.val())
                    {



                        newGameRef.child('player' + snap.child('turn').val()).update({
                            roll: Math.floor((Math.random()) * 6),
                            curMoves: 0,
                            moveAmt: (roll .val() == 0 ? 1 : roll.val() == 1 || roll.val() == 2 ? 2 : roll.val() == 3 || roll.val() == 4 ? 3 : 4)


                        });

                        document.getElementById("l_curMoves").innerHTML = curMoves.val();
                        document.getElementById("l_moveAmt").innerHTML = moveAmt.val();
                    }

                });*/
            }
            else {pInfo.roll = (Math.random()) * 6;
              pInfo.roll = Math.floor(pInfo.roll);
              pInfo.curMoves = 0;
              pInfo.moveAmt = (pInfo.roll == 0 ? 1 : pInfo.roll == 1 || pInfo.roll == 2 ? 2 : pInfo.roll == 3 || pInfo.roll == 4 ? 3 : 4);//pInfo.roll - 1);
              console.log("roll : " + pInfo.roll.toString() + " / moveAmt : " + pInfo.moveAmt.toString());
              document.getElementById("l_curMoves").innerHTML = pInfo.curMoves;
              document.getElementById("l_moveAmt").innerHTML = pInfo.moveAmt;

          }}

          // 8,9,10,11, 12
          // 6,7,8,9, 10
          if(keyName == "l") console.log(gSnap.val().player0);
          if((keyName == "ArrowUp" || keyName == "ArrowDown" || keyName == "ArrowRight" || keyName == "ArrowLeft"))
          {
            event.preventDefault();
              var dir = (keyName == "ArrowUp" ? 0 : keyName == "ArrowDown" ? 1 : keyName == "ArrowRight" ? 2 : keyName == "ArrowLeft" ? 3 : -1);
            //newGameRef.once('value',function(snap){
            var turn = gSnap.child('turn').val();
            var curP = gSnap.child('player' + turn);
            if(curP.val().curMoves < curP.val().moveAmt)
            {

              //var dir = (keyName == "ArrowUp" ? 0 : keyName == "ArrowDown" ? 1 : keyName == "ArrowRight" ? 2 : keyName == "ArrowLeft" ? 3 : -1);


              if(dir != -1 && mainPieces[curP.val().loc][dir + parseInt(mainPieces[curP.val().loc][4] == "'" ? 6 : 8)] != -1)// && mainPieces[pInfo.loc][dir + 6 + (mainPieces[pInfo.loc][4] == "'" ? 0 : 3)] != -1)
              {

                var curMoves = curP.val().curMoves + 1;
                  var loc = parseInt(mainPieces[curP.val().loc][dir + parseInt(mainPieces[curP.val().loc][4] == "'" ? 6 : 8)]); // + 6
                //pInfo.curMoves++;
                newGameRef.child('player' + turn).update({
                    curMoves: curMoves,
                    loc: loc
                });
                document.getElementById("l_curMoves").innerHTML = curMoves;
                //player.position.set(parseInt(mainPieces[pInfo.loc][2]),parseInt(mainPieces[pInfo.loc][3]) + 16,parseInt(mainPieces[pInfo.loc][4]));
                  //playersArr[turn].position.set(pieces[loc].position.x,pieces[loc].position.y + 16,pieces[loc].position.z);
                  playersArr[turn].rotation.set(0,(dir == 0 ? 0 : dir == 1 ? 180 : dir == 2 ? -90 : dir == 3 ? 90 : 0) * Math.PI / 180,0);
                  //directionalLight.rotation.set();
                  //directionalLight.target.position.set(directionalLight.position.x + 2, directionalLight.position.y + 2, directionalLight.position.y + 2);
                  directionalLight.position.set(playersArr[turn].position.x - 1, playersArr[turn].position.y + 3, playersArr[turn].position.z - 2 );
                  directionalLight.target = playersArr[turn];
                  if(curMoves == curP.val().moveAmt && newGameRef)
          {


                                                              if(gSnap.val().turn + 1 >= gSnap.val().playerAmt) newGameRef.update({
                      turn: 0
                  });
                  else newGameRef.update({
                      turn: gSnap.child('turn').val() + 1

                  });
                  //camera.position.x = playersArr[turn].position.x;
                  //camera.position.y = playersArr[turn].position.y;

                  /*newGameRef.child('player' + snap.child('turn').val()).update({
                  roll: pInfo.roll,
                  curMoves: pInfo.curMoves,
                  moveAmt: pInfo.moveAmt,
                  loc: pInfo.loc

              });*/



          }


              }
              console.log(mainPieces[pInfo.loc][dir + 8]);

              }
            //});
          }
  });

    function MoveCam(dir, amt)
    {
        switch(dir)
          {
            case 0:
              camera.position.y += amt;
              break;
              case 1:
              camera.position.y -= amt;
              break;
              case 2:
              camera.position.x += amt;
              break;
              case 3:
              camera.position.x -= amt;
              break;
              case 4:
              camera.position.z -= amt;
              break;
              case 5:
              camera.position.z += amt;
              break;


              case 6:
              camera.rotation.y += amt;
              break;
              case 7:
              camera.rotation.y -= amt;
              break;
          }
    }

    //var index = 0;
    //var map = document.getElementById("map_loc").value;
    //var res = map.split("&");

    //0,0,0,0,0,6&0,0,80,0,0,8&0,0,160,0,0,6&0,0,160,0,80,8
    //0,0,0,0,0,6,-1,-1,1,-1,0&0,0,80,0,0,8,-1,-1,2,0,1&0,0,160,0,0,6,-1,3,-1,1,2&0,0,160,0,80,8,2,-1,-1,-1,3&1,1,0,-16,0,2
    function LoadMapPieces()
    {
          map = document.getElementById("map_loc").value;
          res = map.split("&");

          for(i = 0; i < res.length; i++)
          {
            var prop = res[i].split(",");
              if(!pieceIds.includes(prop[0])) pieceIds.push(prop[0]);
          }
          console.log("FINISHED ADDING TO PIECESIDS ARRAY");
          console.log(pieceIds);



          GetPiecesReady();
    }
    THREE.Object3D.prototype.rotateAroundWorldAxis = function(axis, radians)
    {
rotWorldMatrix = new THREE.Matrix4();
rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
rotWorldMatrix.multiply(this.matrix);
this.matrix = rotWorldMatrix;
this.rotation.setFromRotationMatrix(this.matrix);
    }
    function LoadMap()
    {
        //map = document.getElementById("map_loc").value;
          //res = map.split("&");


          for(i = 0; i < res.length; i++)
          {
            console.log(i);
            var prop = res[i].split(",");

              var mid = prop[0].split(".");

              if(usableObjs[mid[0]][mid[1]])
              {
              //ImportPiece("https://Claeb008.github.io/objs/" + prop[0] + "/" + usableObjsLocs[prop[0]][prop[1]], prop[2], prop[3], prop[4], 2);
              var colObj = usableColors[parseInt(prop[(prop[4] == "'" ? 5 : 7)])];
              if(!colObj) colObj = new colors("gray",100);
              var go = new THREE.Mesh(usableObjs[mid[0]][mid[1]].geometry, new THREE.MeshPhongMaterial({envMap: cubeMap,color: (colObj.color.startsWith("0") ? parseInt(colObj.color) : colObj.color),transparent: (colObj.op < 1),opacity: colObj.op,reflectivity: (colObj.reflect ? 1 : 0.55),specular: 0xaaaaaa,shininess: 10}));//,roughness: (colObj.reflect ? 0 : 0.1)})); // 5 //specular: 0x222222,shininess: 50 //5
              go.position.set(parseInt(prop[1]) * 4, parseInt(prop[3]) * 4, parseInt(prop[2]) * 4); // 2, 3, 4
              if(prop[4] != "'")
              {
                   //go.rotation.set(parseFloat(prop[4]) * Math.PI / 180, -parseFloat(prop[6]) * Math.PI / 180, parseFloat(prop[5]) * Math.PI / 180); // 4, 5, 6 //45 * Math.PI / 180

                   //go.rotateAroundWorldAxis();
                   go.rotateAroundWorldAxis(new THREE.Vector3(1,0,0), parseFloat(prop[4]) * Math.PI/180);
                   go.rotateAroundWorldAxis(new THREE.Vector3(0,1,0), -parseFloat(prop[6]) * Math.PI/180);
                   go.rotateAroundWorldAxis(new THREE.Vector3(0,0,1), parseFloat(prop[5]) * Math.PI/180);


                  //go.rotateX(parseFloat(prop[4]) * Math.PI / 180);
                  //go.rotateY(-parseFloat(prop[6]) * Math.PI / 180);
                  //go.rotateZ(parseFloat(prop[5]) * Math.PI / 180);
                  //go.rotation.set(parseFloat(prop[5]) * Math.PI / 180, -parseFloat(prop[6]) * Math.PI / 180, parseFloat(prop[4]) * Math.PI / 180);



//rotate 30 degrees on world X
//rotateAroundWorldAxis(go, new THREE.Vector3(1,0,0), parseFloat(prop[5]) * Math.PI/180);
//rotateAroundWorldAxis(go, new THREE.Vector3(0,1,0), parseFloat(prop[6]) * Math.PI/180);
//rotateAroundWorldAxis(go, new THREE.Vector3(0,0,1), parseFloat(prop[4]) * Math.PI/180);

                  if(go.rotation.y != 0 && go.rotation.z != 0)
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
              go.props = prop;

              //go = new THREE.Object3D();
              //go.add(pieces[i]);

              //go.position.set(prop[2], prop[3], prop[4]);

              go.castShadow = true;
              go.receiveShadow = true;
              go.scale.set(5,5,5);

              var str = pieces.push(go);
              //console.log("RETURN TEST 1 : " + (parseInt(str) - 1));
              scene.add(go);
              //if(i == 1) pieces[i - 1].remove(pieces[i]);
              //console.log("something : " + mainPieces[0][8]);

              }

          }

          //pieces[0].position.y += 80;
    }
    var rotWorldMatrix;
    // Rotate an object around an arbitrary axis in world space
function rotateAroundWorldAxis(object, axis, radians) {
  rotWorldMatrix = new THREE.Matrix4();
  rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
  rotWorldMatrix.multiplySelf(object.matrix);        // pre-multiply
  object.matrix = rotWorldMatrix;
  object.rotation.getRotationFromMatrix(object.matrix, object.scale);
}

    var map;
    var res;
    function StartIt()
    {
        map = document.getElementById("map_loc").value;
        res = map.split("&");

          LoadMapPiece();
    }
    //0,0,0,0,0&0,0,80,0,0
    var index = 0;
    function LoadMapPiece()
    {



        var prop = res[index].split(",");
          ImportPiece("https://Claeb008.github.io/objs/" + prop[0] + "/" + usableObjsLocs[prop[0]][prop[1]], prop[2], prop[3], prop[4], 2);
          index++;
    }

    var bSet = document.getElementById("b_settings")
    var pSet = document.getElementById("p_settings")
    var tSet = document.getElementById("t_settings");

    bSet.onmousedown=function(e) {
      //alert(e.target.className);
      if(pSet.style.visibility == "hidden") pSet.style.visibility = "visible";
      else pSet.style.visibility = "hidden";
};

var smr = document.getElementById("i_smr");
var sms = document.getElementById("i_sms");

smr.value = 2048;
sms.value = 450.5;

//MenuButtons
function MB(id,subid)
{
switch(id)
  {
    //Settings
    case 0:
        switch(subid)
          {
            //Shadow Map Width
            case 0: // smr = Shadow Map Resolution // Default: 2048
                console.log("0,0");
                directionalLight.shadow.mapSize.width = smr.value;
                  directionalLight.shadow.mapSize.height = smr.value;

              break;
              case 1: // sms = Shadow Map Size // Default: 450.5
                console.log("0,1");
                //var i = parseInt(sms.value);
                //directionalLight.shadow.camera.left = -1450.5;
                  //directionalLight.shadow.camera.right = 1450.5;
                  //directionalLight.shadow.camera.top = 1450.5;
                  //directionalLight.shadow.camera.bottom = -1450.5;

                  //directionalLight.shadow.camera.left = -1450.5;
        //directionalLight.shadow.camera.right = 1450.5;
        //directionalLight.shadow.camera.top = 1450.5;
        //directionalLight.shadow.camera.bottom = -1450.5;
                //directionalLight.shadow.mapSize.width = 2048;
        //directionalLight.shadow.mapSize.height = 2048;
                //directionalLight.shadow.camera.far = 1000;
                //directionalLight.shadow.camera.near = -500;

              break;
          }
      break;
  }
}

function SaveMap()
{
var levelstr = "";
  //console.log(usableColors.indexOf(pieces[2].material.color));
  //console.log(pieces[2].props[1]);
  for(i = 0; i < pieces.length; i++)
  {
    if(i != 0) levelstr += "&";
    for(p = 0; p < pieces[i].props.length; p++)
      {
        if(p != 0) levelstr += ",";
          if(p == 1) levelstr += pieces[i].position.x / 4;
          else if(p == 2) levelstr += pieces[i].position.z / 4;
          else if(p == 3) levelstr += pieces[i].position.y / 4;
          else levelstr += pieces[i].props[p];
      }
  }
  console.log(levelstr);
}



////////////////////////////////////////////////////////////////////

//NETWORKING

var user;

var provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
'login_hint': 'user@example.com'
});
function LogIn()
{
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

///LGC STUFF NOW



function ResumeGame()
{
    var ibox = document.getElementById("i_OpenGame");
     firebase.database().ref('gameplay/' + ibox.value).on('value',function(snap){
        gSnap = snap;
     });
    newGameRef = firebase.database().ref('gameplay/' + ibox.value);
      UpdateGameLabels();

              var yourP = newGameRef.child('player' + (gSnap.val().playerAmt ? gSnap.val().playerAmt : 0));
      yourP.update({
          roll: 0,
              curMoves: 0,
              moveAmt: 0,
              charID: 0,
              name: document.getElementById('p_Username').innerHTML,
              uid: user.uid,
              loc: 0,
              pos: {
                x: 0,
                  y: 0

              }
      });
              if(!gSnap.val().playerAmt)
      {
          newGameRef.set({
              playerAmt: 1,
              turn: 0
          });
      }

}
function OpenGame()
{
    if(newGameRef)
      {
        alert("Your already in a game! Please clear it first");
          return;
      }
    var ibox = document.getElementById("i_OpenGame");
     firebase.database().ref('gameplay/' + ibox.value).on('value',function(snap){
        gSnap = snap;
     });
    newGameRef = firebase.database().ref('gameplay/' + ibox.value);
      newGameRef.set({
          player0: {
            roll: 0,
              curMoves: 0,
              moveAmt: 0,
              charID: 0,
              name: document.getElementById('p_Username').innerHTML,
              //uid: user.uid,
              loc: 0,
              pos: {
                x: 0,
                  y: 0

              }

          },
          playerAmt: 1,
          turn: 0,

      });

      //else newGameRef.update({playerAmt: gSnap.val().playerAmt + 1});



      //UpdateGameLabels();
}
function UpdateGameLabels()
{
if(document.getElementById('l_playerAmt').innerHTML != '-') return;
    var ibox = document.getElementById("i_OpenGame");
      var mRef = 'gameplay/' + ibox.value + "/";
    var playerAmtRef = firebase.database().ref(mRef + 'playerAmt');
      playerAmtRef.on('value',function(snap){
        document.getElementById('l_playerAmt').innerHTML = snap.val();

      });
      firebase.database().ref(mRef + 'player0/' + 'name').on('value',function(snap){
        document.getElementById('l_playerName').innerHTML = snap.val();

      });
}
var playerID = 2;
function AllowJoin()
{
  newGameRef.once('value',function(snap){
      for(i = 0; i < snap.child('playerAmt').val(); i++)
      {
          if(i != playerID)
          {
              var nplayer = new THREE.Mesh(player.geometry,player.material);
              nplayer.scale.set(5,5,5);
              playersArr.push(nplayer);
              nplayer.position.set(180,0,0);
                          //directionalLight.target = nplayer;
                            //directionalLight.position.set( nplayer.position.x - 1, nplayer.position.y + 4, nplayer.position.z - 2 );
                            //playersArr.push(player);
                           //alert("just before");
                           //alert("atr -3 : " + indexID + " : " + playersArr[0].position.y);
                           scene.add(nplayer);
                           nplayer.position.set(180,360,0);
                           alert(playersArr[1] == nplayer);
                           alert(playersArr[0] == nplayer);
                           //alert(playersArr[indexID]);
                           //alert(nplayer);



                                  //newGameRef.child('player' + playerID - 1).child('loc').on('value',function(snap){
                                      //playersArr[playersArr.includes(player)]

          //alert("atr -3 : " + indexID + " : " + playersArr[0].position.y);
               //alert(gSnap);
               //alert(snap.val());
                          //playersArr[1].position.set(pieces[snap.val()].position.x,pieces[snap.val()].position.y + 16,pieces[snap.val()].position.z);
               //player.position.set(180,0,0);


                                  //});
          }

          //ImportPiece('https://Claeb008.github.io/objs/Microfig.obj', 0, player.position.y + 96, 0, -1, -3);

      }

  });
}
function JoinGame()
{
    var ibox = document.getElementById("i_OpenGame");
    newGameRef = firebase.database().ref('gameplay/' + ibox.value);
      newGameRef.once('value').then(function(snap){
        newGameRef.child("player" + (snap.child('playerAmt').val())).update({
            roll: 2,
              curMoves: 0,
              moveAmt: 0,
              charID: 0,
              name: document.getElementById('p_Username').innerHTML,
              //uid: user.uid,
              loc: 0,
            pos: {
                x: 0,
                  y: 0

              }


      });
      playerID = snap.val().playerAmt;
      document.getElementById('l_playerID').innerHTML = snap.child('playerAmt').val();
      newGameRef.update({
        playerAmt: snap.child('playerAmt').val() + 1

      });
      });
      firebase.database().ref('gameplay/' + ibox.value).on('value',function(snap){
        gSnap = snap;
        //player.position.set(pieces[snapO.loc].position.x,pieces[snapO.loc].position.y + 16,pieces[snapO.loc].position.z);
     });
}


function ClearGame()
{
if(!newGameRef)
{
alert("You can't clear a game if you aren't in one!");
  return;
}

var k = newGameRef.key;
firebase.database().ref('gameplay/' + k).set(null);
  newGameRef = null;
}

firebase.database().ref('objLocs/').once('value',function(snap){
//alert(snap.val().length);
  //alert(snap.getChildren());
  for(i = 0; i < snap.val().length; i++)
  {
    usableObjsLocs.push(snap.child(i).val());
  }
 // usableObjsLocs.push();
 alert(usableObjsLocs);

});
firebase.database().ref('colors/').once('value',function(snap){
  for(i = 0; i < snap.val().length; i++)
  {
    usableColors.push({color: snap.child(i).val().color, op: snap.child(i).val().op + 0.25, reflect: (snap.child(i).val().reflect)});//new colors(snap.child(i).val().color,snap.child(i).val().op));

  }
  alert(usableColors);
  console.log("LOAD COLORS COMPLETE");
  alert(usableColors[16].reflect);
  alert(usableColors[0].reflect);
});

var gSnap;


firebase.database().ref('gameplay/Bot/player0/loc').on('value',function(snap){
  if(snap.exists() && playersArr[0] && pieces[snap.val()]){
      playersArr[0].position.set(pieces[snap.val()].position.x,pieces[snap.val()].position.y + 16,pieces[snap.val()].position.z);
  }
});
firebase.database().ref('gameplay/Bot/player1/loc').on('value',function(snap){
  if(snap.exists() && playersArr[1] && pieces[snap.val()]){
      playersArr[1].position.set(pieces[snap.val()].position.x,pieces[snap.val()].position.y + 16,pieces[snap.val()].position.z);
  }
});

function SetPlayerID()
{
  playerID = parseInt(document.getElementById('i_SetPlayerID').value);
}



/*firebase.database().ref('colors/').update({
0: {
    color: "gray",
    op: 0.5
},
1: {
    color: "darkgray",
    op: 1
},
2:{color: "0x008000",op:1},
3: {
    color: "0x00C600",
    op: 1
},
4:{
  color: "white",
  op: 1
},
5:{color: "0x3C3C3C",op:1}, //
6:{color: "red",op:1},
7:{color: "0x0066FF",op:1},
8:{color: "brown",op:1},
9:{color: "limegreen",op:1},
10:{color: "0xDBC181",op:1},
11:{color: "0x8D7959",op:1},


});*/


















































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

var cubeMap = loadCubemap();
//var cubemap = THREE.ImageUtils.loadTextureCube(urls, new THREE.CubeRefractionMapping());
//scene.background = cubeMap;

var geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
//var geometry = new THREE.SphereGeometry (10, 30, 30);
var material = new THREE.MeshPhongMaterial({
  color: 0xFFC03A,
  envMap: cubeMap,
  reflectivity: 1,//0.25,
      specular: 0xffffff,
      roughness: 0.0
  //refractionRatio: 0.95
});
//material.refractionRatio = 0.95;
mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);



























/* cubemap = THREE.ImageUtils.loadTextureCube(urls, new THREE.CubeRefractionMapping());
      //cubemap.format = THREE.RGBFormat;

      var shader = THREE.ShaderLib[ "cube" ];
      shader.uniforms[ "tCube" ].texture = cubemap;
      var material = new THREE.ShaderMaterial( {
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
      });
      var skybox = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000 ), material );


  ///

var loader = new THREE.ObjectLoader();
loader.load("models/stanford-dragon.json", function ( obj ) {
  jsonModel = obj;

  obj.scale.set (10,10,10);
//	scene.add (obj);
});

  // the center piece
      var reflectionMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, //0xcccccc,
        envMap: cubemap,
    refractionRatio: 0.95
      });*/


javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
