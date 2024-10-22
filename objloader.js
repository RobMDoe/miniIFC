import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { OBJLoader } from "jsm/loaders/OBJLoader.js";

//renderer
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

//camera
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;

// scene
const scene = new THREE.Scene();

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;


// geometry object
function init(geometry) {
  const material = new THREE.MeshNormalMaterial({
    color: 0xffffff,
    flatShading: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const sunlight = new THREE.DirectionalLight(0xffffff);
  sunlight.position.y = 2;
  scene.add(sunlight);

  const filllight = new THREE.DirectionalLight(0x88ccff);
  filllight.position.x = 1;
  filllight.position.y = -2;
  scene.add(filllight);

  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
  });

  const wireMesh = new THREE.Mesh(geometry,wireMat);
  mesh.add(wireMesh);

  const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
  scene.add(hemiLight);

  function animate(t = 0) {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  }
  animate();
}

// obj loader
const loader = new OBJLoader();
loader.load("../obj_files/model.obj", (obj) => init(obj.children[0].geometry));

// renderer view
function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);