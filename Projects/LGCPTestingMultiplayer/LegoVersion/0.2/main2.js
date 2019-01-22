// Set up the scene, camera, and renderer as global variables.
var scene, camera, renderer, player, playersArr;

init();
animate();

// Globals from the previous step go here...


///////////////////////////////////////////

///AESOME TEXURE FOR REFLECTIONS
//loadCubemap();
//manager = new THREE.LoadingManager(  );
//var loader = new THREE.TextureLoader( manager );
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
  //mesh = new THREE.Mesh(geometry, material);
  //scene.add(mesh);

///////////////////////////////////////////






// Sets up the scene.
function init() {

  // Create the scene and set the scene size.
  scene = new THREE.Scene();
  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;

  // More code goes here next...

  // Create a camera, zoom it out from the model a bit, and add it to the scene.
camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
camera.position.set(0,6,0);
scene.add(camera);


    // Create a renderer and add it to the DOM.
    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.soft = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 50;

    renderer.shadowMap.bias = 0.0039;
    renderer.shadowMap.darkness = 0.3;
    renderer.shadowMapWidth = 2048;
    renderer.shadowMapHeight = 2048;
    document.body.appendChild(renderer.domElement);




    // Create an event listener that resizes the renderer with the browser window.
window.addEventListener('resize', function()
{
  var WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
});

FixMan();
ImportPiece('https://Claeb008.github.io/objs/Microfig.obj', 0, 16, 0, -1);

var floorGeo = new THREE.BoxBufferGeometry(1000,1,1000);
var floorMat = new THREE.MeshPhongMaterial({color: 0xffffff});
var floor = new THREE.Mesh(floorGeo, floorMat);
floor.position.set(0,-16,0);
floor.receiveShadow = true;
scene.add(floor);

var light2 = new THREE.AmbientLight( 0xffffff, 0.7 ); // 0.2 // soft white light // 0xffff60
				scene.add( light2 );




// Add OrbitControls so that we can pan around with the mouse.
controls = new THREE.OrbitControls(camera, renderer.domElement);
}

// Renders the scene and updates the render as needed.
function animate() {

  // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  requestAnimationFrame(animate);

  // Render the scene.
  renderer.render(scene, camera);
  controls.update();

}

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
                      directionalLight.position.set(150,200,0);
          //scene.add(dl2);
          //scene.add(dl);
              }}
        }
  });



    //object.material.color.setHex(0xff0000);
    //object.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

}, onProgress, onError );

}
