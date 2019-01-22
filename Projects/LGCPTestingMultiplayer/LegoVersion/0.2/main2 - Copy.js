//TRHEEJS


var container = document.getElementById("candiv");

camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20000 );
camera.position.z = 250;
camera.position.y = 20;
scene = new THREE.Scene();
scene.add(camera);

var light2 = new THREE.AmbientLight( 0xffffff, 0.7 ); // 0.2 // soft white light // 0xffff60
       scene.add( light2 );

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

container.appendChild( renderer.domElement );

window.addEventListener( 'resize', onWindowResize, false );

var controls = new THREE.OrbitControls( camera, renderer.domElement );

function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

function animate()
{
	requestAnimationFrame( animate );
	render();
  controls.update();
}

function render()
{
	renderer.render( scene, camera );
}



var floorGeo = new THREE.BoxBufferGeometry(1000,1,1000);
var floorMat = new THREE.MeshPhongMaterial({color: 0xffffff});
var floor = new THREE.Mesh(floorGeo, floorMat);
floor.position.set(0,-16,0);
floor.receiveShadow = true;
scene.add(floor);

//directionalLight = new THREE.DirectionalLight( 0xffffff, 0.65);
