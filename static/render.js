import * as THREE from "three";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

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
  
  // Renderer. Canvas: canvas brings WegGL2 and Threejs canvases together
  const w = window.innerWidth;
  const h = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.shadowMap.enabled = true;

  // Camera
  const fov = 70;
  const aspect = w / h;
  const near = 0.001;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far); 
  camera.position.set(5, 5, -10);

  // Label Renderer
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(w, h);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';
  labelRenderer.domElement.style.pointerEvents = 'none';
  document.body.appendChild(labelRenderer.domElement);
  
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xe4e3e2 ); //bsi ltgrey
  
  //const CameraHelper = new THREE.CameraHelper( camera );
  //scene.add( CameraHelper );

  // Orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.02;
 
  // Paragraph example for Label Renderer
  const p = document.createElement('p');
  p.textContent = 'Hello';
  // const cPointLabel = new CSS2DObject(p);
  // scene.add(cPointLabel);
  // cPointLabel.position.set(4,4,4);

  // Contain label in div
  const div = document.createElement('div');
  div.appendChild(p);
  const divContainer = new CSS2DObject(div);
  scene.add(divContainer);


  // END OF SCENE SET UP

  var slab1, slab2, slab3, column, wall, beam1, beam2, roof, stair;


  //"It looks like you're trying to create a THREE.Mesh with walls, 
  // but walls might not be a geometry. Instead, try accessing the first 
  // child of object if it exists:" (Duck Debugger)

  // Create mesh function, for all objects
  function createMesh(geometry, material, name) {
    const mesh = new THREE.Mesh(geometry, material.clone());
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

    //const edges = new THREE.EdgesGeometry(slab2.geometry); 
    //const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x949494, linewidth: 0.2 } ) ); 
    //scene.add(line)


  // Materials
  const slabMat = new THREE.MeshStandardMaterial({
    color: 0xc8c6c5,
    flatShading: true,
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xc8c6c5,
    metalness: 0.5,
    flatShading: true,
  });

  const stairMat = new THREE.MeshStandardMaterial({
    color: 0xc8c6c5,
    metalness: 1.0,
    flatShading: true
  });

  // Obj loader
  const loader = new OBJLoader();

  // Group of all objects
  const group = new THREE.Group();
  console.log(group);
  scene.add(group)

  // LEVEL 1 FLOOR BUILD-UP
  function createSlab1(loader, createMesh, next, callback) {
    loader.load('static/Slab1.obj', function(object) {
      console.log(object.children.length); // Check if there are children
      if (object.children.length > 0) {
        let slab1 = object.children[0]; // Use the first child
        slab1.add(createMesh(slab1.geometry, slabMat, 'Slab1'));
        next();
        callback(slab1);
      } else {
        console.error("No children found in the loaded object.");
      }
    });
  }
  
  // Usage
  createSlab1(loader, createMesh, next, function(slab_1) {
    console.log(slab_1);
    group.add(slab_1);
  });

  // LEVEL 2 FLOOR BUILD-UP
  function createSlab2(loader, createMesh, next, callback) {
    loader.load('static/Slab2.obj', function(object) {
      console.log(object.children.length); // Check if there are children
      if (object.children.length > 0) {
        let slab2 = object.children[0]; // Use the first child
        slab2.add(createMesh(slab2.geometry, slabMat, 'Slab2'));
        next();
        callback(slab2);
      } else {
        console.error("No children found in the loaded object.");
      }
    });
  }

  // Usage
  createSlab2(loader, createMesh, next, function(slab_2) {
    console.log(slab_2);
    group.add(slab_2);
  });

  // LANDING FLOOR
  function createSlab3(loader, createMesh, next, callback) {
    loader.load('static/Slab3.obj', function(object) {
      console.log(object.children.length); // Check if there are children
      if (object.children.length > 0) {
        let slab3 = object.children[0]; // Use the first child
        slab3.add(createMesh(slab3.geometry, slabMat, 'Slab3'));
        next();
        callback(slab3);
      } else {
        console.error("No children found in the loaded object.");
      }
    });
  }

  // Usage
  createSlab3(loader, createMesh, next, function(slab_3) {
    console.log(slab_3);
    group.add(slab_3);
  });

//   // Columns  TODO for loop + createMesh
//   loader.load('static/Column.obj', function(object) {
//     console.log(object.children.length); // Check if there are children
//     if (object.children.length > 0) {
//       const colMat = new THREE.MeshStandardMaterial({
//         color: 0x949494,
//         metalness: 0.5,
//         flatShading: true
//       });

//       column = object.children[0]; // Use the first child
//       const meshA = new THREE.Mesh( column.geometry, colMat ); meshA.position.set( 1.925, 0, 0 ); 
//       const meshB = new THREE.Mesh( column.geometry, colMat ); meshB.position.set( 1.925, 0, 1.95 );
//       const meshC = new THREE.Mesh( column.geometry, colMat ); meshC.position.set( 1.925, 0, -1.95 );
      
//       meshA.castShadow = true;
//       meshA.receiveShadow = true;
//       meshB.castShadow = true;
//       meshB.receiveShadow = true;
//       meshC.castShadow = true;
//       meshC.receiveShadow = true;
  
//       const columns = new THREE.Group(); 
//       columns.add( meshA ); 
//       columns.add( meshB );
//       columns.add( meshC );      
//       scene.add(columns);

//       next();
//     } else {
//       console.error("No children found in the loaded object.");
//     }
//   });

  // WALL 
  function createWall(loader, createMesh, next, callback) {
    loader.load('static/Wall.obj', function(object) {
      console.log(object.children.length); // Check if there are children
      if (object.children.length > 0) {
        let wall = object.children[0]; // Use the first child
        wall.add(createMesh(wall.geometry, wallMat, 'Wall'));
        next();
        callback(wall);
      } else {
        console.error("No children found in the loaded object.");
      }
    });
  }

  // Usage
  createWall(loader, createMesh, next, function(wall_1) {
    console.log(wall_1);
    group.add(wall_1);
  });

  // ROOF BEAMS
  function createBeams1(loader, createMesh, next, callback) {
    const mesh = [];
    loader.load('static/Beam1.obj', function(object) {
      console.log(object.children.length); // Check if there are children
      if (object.children.length > 0) {
        let beam1 = object.children[0]; // Use the first child
        let p = 0;
        let q = 0;
        let r = -1.95;
        for (let i = 0; i < 3; i++) {
          mesh[i] = createMesh(beam1.geometry, wallMat, `Beam1${i}`)
          mesh[i].add(beam1)
          mesh[i].position.set(p, q, r)
          console.log(`Mesh ${i} position:`, mesh[i].position);
          r += 1.95;
        }
        const beams1 = new THREE.Group();
        for (let i = 0; i < mesh.length; i++) {
          beams1.add(mesh[i]);
        }
  
        next();
        callback(beams1);

      } else {
        console.error("No children found in the loaded object.");
      }
    });
  }

  // Usage
  createBeams1(loader, createMesh, next, function(beams_1) {
    console.log(beams_1);
    group.add(beams_1);
  });

  // LEVELS 1 & 2 BEAMS
  function createBeams2(loader, createMesh, next, callback) {
    const mesh = [];
    loader.load('static/Beam2.obj', function(object) {
      console.log(object.children.length); // Check if there are children
      if (object.children.length > 0) {
        let beam2 = object.children[0]; // Use the first child
        let p = 0;
        let q = 0;
        let r = -1.95;
        for (let i = 0; i < 3; i++) {
          mesh[i] = createMesh(beam2.geometry, wallMat, `Beam2${i}`)
          mesh[i].add(beam2)
          mesh[i].position.set(p, q, r)
          console.log(`Mesh ${i} position:`, mesh[i].position);
          r += 1.95;
          }
        let s = 0;
        let t = 2.5;
        let u = -1.95;
        for (let j = 0; j < 3; j++) {
          mesh[3 + j] = createMesh(beam2.geometry, wallMat, `Beam2${3 + j}`);
          mesh[3 + j].add(beam2);
          mesh[3 + j].position.set(s, t, u);
          console.log(`Mesh ${3 + j} position:`, mesh[3 + j].position);
          u += 1.95;
        }

        const beams2 = new THREE.Group();
        for (let i = 0; i < mesh.length; i++) {
          beams2.add(mesh[i]);
        }

        next();
        callback(beams2);

      } else {
        console.error("No children found in the loaded object.");
      }
    });
  }

  // Usage
  createBeams2(loader, createMesh, next, function(beams_2) {
    console.log(beams_2);
    group.add(beams_2);
  });

  // ROOF BUILD-UP
  function createRoof(loader, createMesh, next, callback) {
    loader.load('static/Roof.obj', function(object) {
      console.log(object.children.length); // Check if there are children
      if (object.children.length > 0) {
        let roof = object.children[0]; // Use the first child
        roof.add(createMesh(roof.geometry, slabMat, 'Roof'));
        next();
        callback(roof);
      } else {
        console.error("No children found in the loaded object.");
      }
    });
  }

  // Usage
  createRoof(loader, createMesh, next, function(roof_1) {
    console.log(roof_1);
    group.add(roof_1);
  });

  // STAIRS
  function createStairs(loader, createMesh, next, callback) {
    const mesh = [];
    loader.load('static/Stair.obj', function(object) {
      console.log(object.children.length); // Check if there are children
      if (object.children.length > 0) {
        let stair = object.children[0]; // Use the first child

        let m = 0.00;
        let n = 0.541071;
                
        for (let i = 0; i < 13; i++) {
          mesh[i] = createMesh(stair.geometry, stairMat, `Stair${i}`);
          mesh[i].add(stair);
          mesh[i].position.set(m, n);
          console.log(`Mesh ${i} position:`, mesh[i].position);
          m += 0.165; 
          n += 0.17857;
        }

        const stairs = new THREE.Group(); 
        for (let i = 0; i < 13; i++) {
          stairs.add( mesh[i] );
        }

        next();
        callback(stairs);
      } else {
        console.error("No children found in the loaded object.");
      }
    });
  }

  // Usage
  createStairs(loader, createMesh, next, function(stairs) {
    console.log(stairs);
    group.add(stairs);
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
//     if (column) {
//       console.log('done');
//     }
     if (wall) {
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

//   // END OF GEOMETRY SETUP

// ADD GROUP TO SCENE HERE

    // ADD PARAGRAPH CONTAINER DIV
    // const p = document.createElement('p');
    // p.className = 'tooltip';
    // const pContainer = document.createElement('div');
    // pContainer.appendChild(p);
    // const cPointLabel = new CSS2DObject(pContainer);
    // scene.add(cPointLabel);


//   // RAYCASTER
 
    // const mousPos = new THREE.Vector2();
    // const raycaster = new THREE.Raycaster();

    // window.addEventListener('mousemove', function(e) {
    //   mousPos.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    //   mousPos.y = - (e.clientY / this.window.innerHeight) * 2 + 1;

    //   raycaster.setFromCamera(mousPos, camera);
    //   const intersects = raycaster.intersectObject(group);
    //   console.log(intersects);
    //   if (intersects.length > 0) {
    //     switch (intersects[0].object.name) {

//         case 'Wall':
//           p.className = 'tooltip show';
//           cPointLabel.position.set(10,10,10);
//           p.textContent = 'ifcWall Properties: blah, blah...';
//           break;

            // case 'Slab1':
            // p.className = 'tooltip show';
            // cPointLabel.position.set(3,3,3);
            // p.textContent = 'ifcSlab Properties: blah, blah...';
            // break;

//         case 'Stairs':
//           p.className = 'tooltip show';
//           cPointLabel.position.set(10,10,10);
//           p.textContent = 'ifcStair Properties: blah, blah...';
//           break;

    //       default:
    //         break;
    //     }

    //   } else {

    //       p.className = 'tooltip hide';
    //   }

    // });


  // COMMENT OUT ALL TO HERE

  // END RAYCASTER SETUP

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
  //const gridHelper = new THREE.GridHelper(12, 12);
  //scene.add(gridHelper);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    controls.update();
  }

  animate();

  function handleWindowResize() {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    labelRenderer.setSize(this.w, this.h);
  }

  //if true then canvas can be manually resized
  canvas.addEventListener("resize", handleWindowResize, true);

}