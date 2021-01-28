import * as THREE from "./three/build/three.module.js";
import {VRButton} from "./three/examples/jsm/webxr/VRButton.js";
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js'

function main() {
  //Canvas and Renderer
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.xr.enabled = true;
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  document.body.appendChild(VRButton.createButton(renderer));

  //Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );

  //Camera
  const fov = 48;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  //Controls
  var user = new THREE.Group();
  user.position.set(0,0,0);
  /*
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.enableRotate = false;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.update();*/


  camera.position.set(0, 1.6, 0);
  user.add( camera );
  scene.add(user);
  //controls.update();

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  //Cube positioning
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial(0x00ff00);
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.x = 0;
  cube.position.y = 1.6;
  cube.position.z = -2;

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cube.rotation.x += 0.1;

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(render);
}

main();