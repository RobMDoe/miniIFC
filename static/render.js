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
  camera.position.set(0, 5, 10);
  camera.lookAt(0, 0, 0);
  camera.layers.enable(1);

  // Label Renderer
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(w, h);
  labelRenderer.domElement.style.position = 'fixed';
  labelRenderer.domElement.style.top = '0px';
  labelRenderer.domElement.style.left = '0px';
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
  // const p = document.createElement('p');
  // p.textContent = 'Hello';
  // const cPointLabel = new CSS2DObject(p);
  // scene.add(cPointLabel);
  // cPointLabel.position.set(4,4,4);

  // Contain label in div
  // const div = document.createElement('div');
  // div.appendChild(p);
  // const divContainer = new CSS2DObject(div);
  // scene.add(divContainer);


  // END OF SCENE SET UP


  var wall, slab1, slab2, slab3, column, beam1, beam2, roof, stair;

  // Create mesh function, for all objects
  function createMesh(geometry, material, name, layer) {
    material.side = THREE.DoubleSide; // Make the material double-sided
    const mesh = new THREE.Mesh(geometry, material.clone());
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.layers.set(layer);
    const edges = new THREE.EdgesGeometry( geometry ); 
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x7f7f7f, linewidth: 0.05 } ) ); mesh.add( line );
      
    return mesh;
  }


  // Materials
   const slabMat = new THREE.MeshStandardMaterial({
     color: 0xc8c6c5,
     side: THREE.DoubleSide,
     flatShading: true,
   });

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xc8c6c5,
    side: THREE.DoubleSide,
    metalness: 0.5,
    flatShading: true,
  });

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xc8c6c5,
    side: THREE.DoubleSide,
    metalness: 1.0,
    flatShading: true
  });

  // Obj loader
  const loader = new OBJLoader();

  // Group of all objects
  const group = new THREE.Group();
  // console.log(group);

  scene.add(group)

  const w_group = new THREE.Group();
  group.add(w_group);

  const s1_group = new THREE.Group();
  group.add(s1_group);

  const s2_group = new THREE.Group();
  group.add(s2_group);

  // const c_group = new THREE.Group();
  // group.add(c_group);

  //"It looks like you're trying to create a THREE.Mesh with walls, 
  // but walls might not be a geometry. Instead, try accessing the first 
  // child of object if it exists:" (CS50 Duck Debugger)

  // WALL 
  function createWall(loader, createMesh, next, callback) {
    loader.load('static/Wall.obj', function(object) {
      console.log(object.children.length); // Check if there are children
      if (object.children.length > 0) {
        let wall = object.children[0]; // Use the first child
        wall.name = 'Wall';
        wall.add(createMesh(wall.geometry, wallMat, 'Wall', 1));
        next();
        callback(wall);
      } else {
        console.error("No children found in the loaded object.");
      }
    });
  }

  // Usage // Calls function createWall
  createWall(loader, createMesh, next, function(w_Add) {
    console.log(w_Add);
    w_group.add(w_Add);
  });


  // LEVEL 1 FLOOR BUILD-UP
  function createSlab1(loader, createMesh, next, callback) {
    loader.load('static/Slab1.obj', function(object) {
      console.log(object.children.length); // Check if there are children
      if (object.children.length > 0) {
        let slab1 = object.children[0]; // Use the first child
        slab1.name = 'Slab1';
        slab1.add(createMesh(slab1.geometry, slabMat, 'Slab1', 1));
        next();
        callback(slab1);
      } else {
        console.error("No children found in the loaded object.");
      }
    });
  }
  
  // Usage
  createSlab1(loader, createMesh, next, function(s1_Add) {
    console.log(s1_Add);
    s1_group.add(s1_Add);
  });


  // LEVEL 2 FLOOR BUILD-UP
  function createSlab2(loader, createMesh, next, callback) {
    loader.load('static/Slab2.obj', function(object) {
      console.log(object.children.length); // Check if there are children
      if (object.children.length > 0) {
        let slab2 = object.children[0]; // Use the first child
        slab2.name = 'Slab2';
        slab2.add(createMesh(slab2.geometry, slabMat, 'Slab2', 1));
        next();
        callback(slab2);
      } else {
        console.error("No children found in the loaded object.");
      }
    });
  }

  // Usage
  createSlab2(loader, createMesh, next, function(s2_Add) {
    console.log(s2_Add);
    s2_group.add(s2_Add);
  });


  // LANDING FLOOR
  function createSlab3(loader, createMesh, next, callback) {
    loader.load('static/Slab3.obj', function(object) {
      console.log(object.children.length); // Check if there are children
      if (object.children.length > 0) {
        let slab3 = object.children[0]; // Use the first child
        slab3.name = 'Slab3';
        slab3.add(createMesh(slab3.geometry, slabMat, 'Slab3', 1));
        next();
        callback(slab3);
      } else {
        console.error("No children found in the loaded object.");
      }
    });
  }

  // Usage
  createSlab3(loader, createMesh, next, function(s3_Add) {
    console.log(s3_Add);
    s1_group.add(s3_Add);
  });


  // COLUMNS
  function createColumns(loader, createMesh, next, callback) {
    const mesh = [];
    loader.load('static/Column.obj', function(object) {
      console.log(object.children.length); // Check if there are children
      if (object.children.length > 0) {
        let column = object.children[0]; // Use the first child
        let a = 1.925;
        let b = 0;
        let c = -1.95;
        for (let i = 0; i < 3; i++) {
          mesh[i] = createMesh(column.geometry, steelMat, `Columns`, 1)
          mesh[i].position.set(a, b, c)
          console.log(`Mesh ${i} position:`, mesh[i].position);
          c += 1.95;
        }

        const c_Add = new THREE.Group();
        for (let i = 0; i < mesh.length; i++) {
          c_Add.add(mesh[i]);
        }
  
        next();
        callback(c_Add);

      } else {
        console.error("No children found in the loaded object.");
      }
    });
  }

  // Usage
  createColumns(loader, createMesh, next, function(c_Add) {
    console.log(c_Add);
    group.add(c_Add);
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
          mesh[i] = createMesh(beam1.geometry, steelMat, `Beams`, 1)
          mesh[i].add(beam1)
          mesh[i].position.set(p, q, r)
          console.log(`Mesh ${i} position:`, mesh[i].position);
          r += 1.95;
        }
        const b1_Add = new THREE.Group();
        for (let i = 0; i < mesh.length; i++) {
          b1_Add.add(mesh[i]);
        }
  
        next();
        callback(b1_Add);

      } else {
        console.error("No children found in the loaded object.");
      }
    });
  }

  // Usage
  createBeams1(loader, createMesh, next, function(b1_Add) {
    console.log(b1_Add);
    group.add(b1_Add);
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
          mesh[i] = createMesh(beam2.geometry, steelMat, `Beam2${i}`)
          mesh[i].add(beam2)
          mesh[i].position.set(p, q, r)
          console.log(`Mesh ${i} position:`, mesh[i].position);
          r += 1.95;
          }
        let s = 0;
        let t = 2.5;
        let u = -1.95;
        for (let j = 0; j < 3; j++) {
          mesh[3 + j] = createMesh(beam2.geometry, steelMat, `Beam2${3 + j}`);
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
          mesh[i] = createMesh(stair.geometry, steelMat, `Stair${i}`);
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
    if (wall) {
      console.log('done');
    }
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
    if (beam1) {
      console.log('done');
    }
    if (beam2) {
      console.log('done');
    }
    //  if (roof) {
    //    console.log('done');
    //  }
    //  if (stair) {
    //    console.log('done');
    //  }
   }

// END OF GEOMETRY SETUP

  // ADD PARAGRAPH CONTAINER DIV
  const p = document.createElement('p');
  p.className = 'tooltip';
  const pContainer = document.createElement('div');
  pContainer.appendChild(p);
  const cPointLabel = new CSS2DObject(pContainer);
  scene.add(cPointLabel);



  // how to use // p.expandingList = document.createElement("ul", { is: "expanding-list" });
  // to make propertysets list for WallCommon

  // Get the comma-separated string
  let listString = 'Reference: Value, Status: Value, Acoustic Rating: Value, Fire Rating: Value, Combustible: Value, SurfaceSpreadofFlame: Value, Thermal Transmittance: Value, IsExternal: Value, ExtendtoStructure: Value, LoadBearing: Value, Compartmentation: Value';

  // Split the string into an array of items
  let listItems = listString.split(', ');

  // Create a new list element
  let ul = document.createElement('ul');

  // Remove all text nodes from ul
  ul.childNodes.forEach(node => {
  if (node.nodeType === Node.TEXT_NODE) {
      ul.removeChild(node);
    }
  });

  // Iterate over the array and create list items
  listItems.forEach(function(item) {
      let li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);

  });

// RAYCASTER
 
  const mousPos = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  raycaster.layers.set(1);

  window.addEventListener('click', function(e) {
    mousPos.x = (e.clientX / w) * 2 - 1;
    mousPos.y = - (e.clientY / h) * 2 + 1;
    console.log("Mouse Position:", mousPos);
  
    raycaster.setFromCamera(mousPos, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    console.log("Intersections:", intersects);
  
    if (intersects.length > 0) {
      let intersectedObject = intersects[0].object;
      console.log("Clicked on:", intersectedObject.name);

        switch (intersectedObject.name) {

          case 'Wall':
            p.className = 'tooltip show';
            cPointLabel.position.set(0,0,5);
            p.textContent = 'Pset_WallCommon:';
            p.appendChild(ul);
            console.log("p after appending:", p);
            //p.baseURI(https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/link/pset_wallcommon.htm);
            break;
            
          case 'Slab1':
            p.className = 'tooltip show';
            cPointLabel.position.set(0,0,5);
            p.textContent = 'Pset_SlabCommon_1: TODO';
            break;            
            
          case 'Slab2':
            p.className = 'tooltip show';
            cPointLabel.position.set(0,0,5);
            p.textContent = 'Pset_SlabCommon_2: TODO';
            break;

          case 'Slab3':
            p.className = 'tooltip show';
            cPointLabel.position.set(0,0,5);
            p.textContent = 'Pset_SlabCommon_3: TODO';
            break;

          case 'Columns':
            p.className = 'tooltip show';
            cPointLabel.position.set(0,0,5);
            p.textContent = 'Pset_ColumnCommon: TODO';
            break;

          case 'Beams':
            p.className = 'tooltip show';
            cPointLabel.position.set(0,0,5);
            p.textContent = 'Pset_BeamCommon_1: TODO';
            break;
        

          default:

            break;
  
          }
  
    } else {
        p.className = 'tooltip hide';
        console.log("Not hovering over any object");
    }

  });

          // case 'Slab2':
          //   p.className = 'tooltip show';
          //   cPointLabel.position.set(0,0,0);
          //   p.textContent = 'ifcSlab2 Properties: TODO';
          //   break;      case 'Slab1':

          // case 'Slab3':        
          //   p.className = 'tooltip show';
          //   cPointLabel.position.set(0,0,0);
          //   p.textContent = 'ifcSlab3 Properties: TODO';
          //   break;
        



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
