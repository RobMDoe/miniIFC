import * as THREE from "three";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

//import { TransformControls } from 'three/addons/controls/TransformControls.js';

main()

function main() {

  // canvas
  const canvas = document.getElementById("mycanvas");

  // initialize the GL context
  const gl = canvas.getContext("webgl2");
  if (!gl){
    alert(
      "Unable to initialize WebGL2. Your browser or machine may not support it.",
    );
    return;
  }

  // set z up
  THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);

  // set clear color to black, fully opaque //affects mycanvas only
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  // renderer
  const w = window.innerWidth;
  const h = window.innerHeight;

  // canvas: canvas brings WegGL2 and Threejs canvases together
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.shadowMap.enabled = true;

   // Camera
  const fov = 75;
  const aspect = w / h;
  const near = 0.001;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far); 
  camera.position.set(10, 10, 10);
  
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xe4e3e2 ); //bsi ltgrey
  
   //const CameraHelper = new THREE.CameraHelper( camera );
  //scene.add( CameraHelper );

  // Orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.02;

  // Geometry object + material, called by function
  // Buffer geometry passed in (obj?)
  function init(geometry) {

    console.log(geometry);
   
    const material = new THREE.MeshStandardMaterial({
      color: 0xc8c6c5,
      flatShading: true,
    });
    
    const mesh = new THREE.Mesh(geometry, material); 
    const edges = new THREE.EdgesGeometry( geometry ); 
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0xa39f9e } ) );
    scene.add( line );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    
  }

  // initiate obj loader
  const loadA = new OBJLoader();
  // call geometry function when loader loaded (import as buffer geometry)
  loadA.load('static/Wall.obj', (obj) => init(obj.children[0].geometry));
  loadA.load('static/Slab1.obj', (obj) => init(obj.children[0].geometry));
  loadA.load('static/Slab2.obj', (obj) => init(obj.children[0].geometry));
  loadA.load('static/Roof.obj', (obj) => init(obj.children[0].geometry));
  loadA.load('static/Beam1.obj', (obj) => init(obj.children[0].geometry));


  //function init(beams) {

    //console.log(beams);
   
    //const material = new THREE.MeshStandardMaterial({
      //color: 0xc8c6c5,
      //flatShading: true,
    //});
    
    //const mesh = new THREE.Mesh( beams, material );
    //const beamA = new THREE.Mesh( mesh, material ); beamA.position.set( 2.0, 0, 0 );
    //const beamB = new THREE.Mesh( mesh, material ); beamB.position.set( 4.0, 0, 0 );
    //const group = new THREE.Group(); group.add( beamA ); group.add( beamB );
    //const edges = new THREE.EdgesGeometry( mesh ); 
    //const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0xa39f9e } ) );
    //scene.add( line );
    //mesh.castShadow = true;
    //mesh.receiveShadow = true;
    //scene.add( group );
    
  //} 
   
  // initiate obj loader for beams
  //const loadB = new OBJLoader();
  //loadB.load('static/Beam1.obj', (obj) => init(obj.children[0].beams));
  //loadB.load('static/Beam2.obj', (obj) => init(obj.children[0].beams));

  // directional light
  const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
  scene.add(dLight);
  dLight.position.set(-15,40,15);
  dLight.castShadow = true;
  dLight.shadow.camera.top = 10;
  dLight.shadow.camera.bottom = -10;
  scene.add(dLight)

  //const dLightHelper = new THREE.DirectionalLightHelper(dLight, 10);
  //scene.add(dLightHelper);

  //const dLightShadowHelper = new THREE.CameraHelper(dLight.shadow.camera);
  //scene.add(dLightShadowHelper);
  
  const aLight = new THREE.AmbientLight( 0xffffff, 0.8 );
  scene.add(aLight);

  // Add plane
  const planeGeometry = new THREE.PlaneGeometry( 14, 14 );
  const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    side: THREE.DoubleSide,
    visible: true
  });

  const plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.rotation.x = -0.5 * Math.PI;
  plane.receiveShadow = true;
  scene.add(plane);

  // Axes helper - for OBJ y is up, z is thickness
  //const axesHelper = new THREE.AxesHelper(2);
  //scene.add(axesHelper);
  
  // Grid helper
  const gridHelper = new THREE.GridHelper(14, 14);
  const gridMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x000000,
    side: THREE.DoubleSide
  });
  scene.add(gridHelper, gridMaterial);

  function handleWindowResize() {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  }

  animate();

  //if true then canvas can be manually resized
  canvas.addEventListener("resize", handleWindowResize, true);

}



// TRANSFORM CONTROLS - NOT USEFUL?

    // Transform controls
    //const transform = new TransformControls(camera, renderer.domElement)
    //transform.attach(mesh)
    //scene.add(transform)

    // THREE controls.getHelper;

    // transform.getHelper(mesh)

    //transform.addEventListener('keydown', function (event) {
      //switch (event.code) {
          //case 'KeyG':
              //transform.setMode('translate')
              //break
          //case 'KeyR':
              //transform.setMode('rotate')
              //break
          //case 'KeyS':
              //transform.setMode('scale')
              //break
      //}
    //})
