import * as THREE from 'three';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



init();

function init() {

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
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.shadowMap.enabled = true;

    // Camera
    const fov = 75;
    const aspect = w / h;
    const near = 0.001;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-10, 30, 30);
    // Set z axis up
    // camera.up.set(0,0,1);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xe4e3e2 ); //bsi ltgrey

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.02;

    // THIS IS THE IFC MATERIAL INFO

    // Material, geometry (a function RBs script which is called?
    const material = new THREE.MeshPhongMaterial({
        color: 0xff0000,  //red
        flatShading: true
      });
      
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);



    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(directionalLight);
    directionalLight.position.set(15,15,15);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.bottom = -12;

    const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(dLightHelper);

    const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(dLightShadowHelper);

    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,  //white
      wireframe: true
    
    });

    const wireMesh = new THREE.Mesh(geometry,wireMat);
    mesh.add(wireMesh);


    // SPHERE added to check shadows work
    const material2 = new THREE.MeshPhongMaterial();
    const sph = new THREE.Mesh(new THREE.SphereGeometry(1), material2);
    sph.position.set(0, 1, -2);
    sph.castShadow = true;
    scene.add(sph);

    // Animate
    function animate(t = 0) {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
    }
    animate();
    new THREE.MeshStandardMaterial

    // Add plane to scene
    const planeGeometry = new THREE.PlaneGeometry( 20, 20 );
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    // Axes helper - for OBJ y is up, z is thickness
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper)
    
    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20)
    scene.add(gridHelper)    

    // Model
    const onProgress = function ( xhr ) {

        if ( xhr.lengthComputable ) {

            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log( percentComplete.toFixed( 2 ) + '% downloaded' );

        }

    };

    new OBJLoader()
        .setMaterials( material )
        .setPath( 'static/' )
        .load( 'Wall.obj', function ( object ) {

            object.position.y = - 0.95;
            object.scale.setScalar( 0.01 );
            scene.add( object );

        }, onProgress );


    function handleWindowResize() {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        }
    
        //if true then canvas can be manually resized
    canvas.addEventListener("resize", handleWindowResize, true);

}
