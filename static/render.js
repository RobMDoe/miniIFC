import * as THREE from "three";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

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

  //ALTERNATIVE 

  const loader = new OBJLoader();

  var slab1, slab2, slab3, column, walls, beam1, beam2, roof, stair;

  //"It looks like you're trying to create a THREE.Mesh with walls, 
  // but walls might not be a geometry. Instead, try accessing the first 
  // child of object if it exists:" (Duck Debugger)

  // Level 1 floor build-up
  loader.load('static/Slab1.obj', function(object) {
    console.log(object.children.length); // Check if there are children
    if (object.children.length > 0) {
      const slabMat = new THREE.MeshStandardMaterial({
        color: 0xc8c6c5,
        flatShading: true,
      });

      slab1 = object.children[0]; // Use the first child
      const mesh = new THREE.Mesh(slab1.geometry,slabMat); // Use the geometry of the child
      const edges = new THREE.EdgesGeometry(slab1.geometry); 
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x949494, linewidth: 0.2 } ) ); 
      scene.add( line );      
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      next();
    } else {
      console.error("No children found in the loaded object.");
    }
  });

  // Level 2 floor build-up
  loader.load('static/Slab2.obj', function(object) {
    console.log(object.children.length); // Check if there are children
    if (object.children.length > 0) {
      const slabMat = new THREE.MeshStandardMaterial({
        color: 0xc8c6c5,
        flatShading: true,
      });

      slab2 = object.children[0]; // Use the first child
      const mesh = new THREE.Mesh(slab2.geometry,slabMat); // Use the geometry of the child
      const edges = new THREE.EdgesGeometry(slab2.geometry); 
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x949494, linewidth: 0.2 } ) ); 
      scene.add( line ); 
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      next();
    } else {
      console.error("No children found in the loaded object.");
    }
  });

  // Level 2 landing
  loader.load('static/Slab3.obj', function(object) {
    console.log(object.children.length); // Check if there are children
    if (object.children.length > 0) {
      const slabMat = new THREE.MeshStandardMaterial({
        color: 0xc8c6c5,
        metalness: 1.0,
        flatShading: true,
      });

      slab3 = object.children[0]; // Use the first child
      const mesh = new THREE.Mesh(slab3.geometry,slabMat); // Use the geometry of the child
      const edges = new THREE.EdgesGeometry(slab3.geometry); 
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x949494, linewidth: 0.2 } ) ); 
      scene.add( line ); 
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      next();
    } else {
      console.error("No children found in the loaded object.");
    }
  });

  // Columns
  loader.load('static/Column.obj', function(object) {
    console.log(object.children.length); // Check if there are children
    if (object.children.length > 0) {
      const colMat = new THREE.MeshStandardMaterial({
        color: 0x949494,
        metalness: 0.5,
        flatShading: true
      });

      column = object.children[0]; // Use the first child
      const meshA = new THREE.Mesh( column.geometry, colMat ); meshA.position.set( 1.925, 0, 0 ); 
      const meshB = new THREE.Mesh( column.geometry, colMat ); meshB.position.set( 1.925, 0, 1.95 );
      const meshC = new THREE.Mesh( column.geometry, colMat ); meshC.position.set( 1.925, 0, -1.95 );
      
      meshA.castShadow = true;
      meshA.receiveShadow = true;
      meshB.castShadow = true;
      meshB.receiveShadow = true;
      meshC.castShadow = true;
      meshC.receiveShadow = true;
  
      const group = new THREE.Group(); 
      group.add( meshA ); 
      group.add( meshB );
      group.add( meshC );      
      scene.add( group );
      scene.add(mesh);
      next();
    } else {
      console.error("No children found in the loaded object.");
    }
  });

  loader.load('static/Wall.obj', function(object) {
    console.log(object.children.length); // Check if there are children
    if (object.children.length > 0) {
      const wallMat = new THREE.MeshStandardMaterial({
        color: 0xc8c6c5,
        flatShading: true,
      });

      walls = object.children[0]; // Use the first child
      const mesh = new THREE.Mesh(walls.geometry, wallMat); // Use the geometry of the child
      const edges = new THREE.EdgesGeometry(walls.geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x949494, linewidth: 0.2 } ) ); 
      scene.add( line ); 
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      next();
    } else {
      console.error("No children found in the loaded object.");
    }
  });

  // Roof beams
  loader.load('static/Beam1.obj', function(object) {
    console.log(object.children.length); // Check if there are children
    
    if (object.children.length > 0) {
      const beamMat = new THREE.MeshStandardMaterial({
        color: 0x949494,
        metalness: 0.5,
        flatShading: true
      });
      
      beam1 = object.children[0]; // Use the first child
      const meshA = new THREE.Mesh( beam1.geometry, beamMat ); meshA.position.set( 0, 0, 0 ); 
      const meshB = new THREE.Mesh( beam1.geometry, beamMat ); meshB.position.set( 0, 0, 1.95 );
      const meshC = new THREE.Mesh( beam1.geometry, beamMat ); meshC.position.set( 0, 0, -1.95 );   
      
      meshA.castShadow = true;
      meshA.receiveShadow = true;
      meshB.castShadow = true;
      meshB.receiveShadow = true;
      meshC.castShadow = true;
      meshC.receiveShadow = true;
  
      const group = new THREE.Group(); 
      group.add( meshA ); 
      group.add( meshB );
      group.add( meshC );      
      scene.add( group );

      //scene.add(mesh);
      next();
    } else {
      console.error("No children found in the loaded object.");
    }
  });

  // Level 1 & 2 beams
  loader.load('static/Beam2.obj', function(object) {
    console.log(object.children.length); // Check if there are children
    
    if (object.children.length > 0) {
      const beamMat = new THREE.MeshStandardMaterial({
        color: 0x949494, 
        metalness: 0.5,
        flatShading: true
      });
      
      beam2 = object.children[0]; // Use the first child
      const meshA = new THREE.Mesh( beam2.geometry, beamMat ); meshA.position.set( 0, 0, 0 ); 
      const meshB = new THREE.Mesh( beam2.geometry, beamMat ); meshB.position.set( 0, 0, 1.95 );
      const meshC = new THREE.Mesh( beam2.geometry, beamMat ); meshC.position.set( 0, 0, -1.95 );   
      const meshD = new THREE.Mesh( beam2.geometry, beamMat ); meshD.position.set( 0, 2.5, 0 ); 
      const meshE = new THREE.Mesh( beam2.geometry, beamMat ); meshE.position.set( 0, 2.5, 1.95 );
      const meshF = new THREE.Mesh( beam2.geometry, beamMat ); meshF.position.set( 0, 2.5, -1.95 );

      meshA.castShadow = true;
      meshA.receiveShadow = true;
      meshB.castShadow = true;
      meshB.receiveShadow = true;
      meshC.castShadow = true;
      meshC.receiveShadow = true;
      meshD.castShadow = true;
      meshD.receiveShadow = true;
      meshE.castShadow = true;
      meshE.receiveShadow = true;
      meshF.castShadow = true;
      meshF.receiveShadow = true;
  
      const group = new THREE.Group(); 
      group.add( meshA ); 
      group.add( meshB );
      group.add( meshC );
      group.add( meshD ); 
      group.add( meshE );
      group.add( meshF );    
      scene.add( group );

      next();
    } else {
      console.error("No children found in the loaded object.");
    }
  });

  // Roof build-up
  loader.load('static/Roof.obj', function(object) {
    console.log(object.children.length); // Check if there are children
    if (object.children.length > 0) {
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0xc8c6c5,
        flatShading: true,
      });

      roof = object.children[0]; // Use the first child
      const mesh = new THREE.Mesh(roof.geometry,roofMat); // Use the geometry of the child
      const edges = new THREE.EdgesGeometry(roof.geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x949494, linewidth: 0.2 } ) ); 
      scene.add(line);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      next();
    } else {
      console.error("No children found in the loaded object.");
    }
  });

  // Stairs
  loader.load('static/Stair.obj', function(object) {
    console.log(object.children.length); // Check if there are children
    
    if (object.children.length > 0) {
      const stairMat = new THREE.MeshStandardMaterial({
        color: 0xc8c6c5,
        metalness: 1.0,
        flatShading: true
      });
    
      stair = object.children[0]; // Use the first child. Make loops
      const edges = new THREE.EdgesGeometry(stair.geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0xc8c6c5, linewidth: 0.2 } ) ); 
     
      const mesh = [];
      console.log(mesh);
      let m = 0.00;
      let n = 0.541071;
      for (let i = 0; i < 13; i++) {
        mesh[i] = new THREE.Mesh( stair.geometry, stairMat ); mesh[i].position.set( m, n);
        scene.add(line);
        m += 0.165; 
        n += 0.17857;
      }

      for (let i = 0; i < 13; i++) {
        mesh[i].castShadow = true;
        mesh[i].receiveShadow = true;
      }
  
      const group = new THREE.Group(); 
      for (let i = 0; i < 13; i++) {
        group.add( mesh[i] );
      }

      //const a = new THREE.Vector3( 0, 1, 0 );
      scene.add(group)  //.rotateOnAxis(a, 0));

      next();
    } else {
      console.error("No children found in the loaded object.");
    }
  });

  // allows previous function to fully load
  function next() {
    if (slab1) {
      console.log('done');
    }
    if (slab2) {
      console.log('done');
    }
    if (slab3) {
      console.log('done');
    }
    if (column) {
      console.log('done');
    }
    if (walls) {
      console.log('done');
    }
    if (beam1) {
      console.log('done');
    }
    if (beam2) {
      console.log('done');
    }
    if (roof) {
      console.log('done');
    }
    if (stair) {
      console.log('done');
    }
  }

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
  const planeGeometry = new THREE.PlaneGeometry( 12, 12 );
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
  const gridHelper = new THREE.GridHelper(12, 12);
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
