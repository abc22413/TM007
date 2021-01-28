import * as THREE from './three/build/three.module.js'
/*
Dev goal 1: Find out independent VR presentation
Dev goal 2: Find out how to make game
*/

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//VR Button
import { VRButton } from './three/examples/jsm/webxr/VRButton.js';
document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

//Camera
const fov = 48;
let aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 2;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position = (0, 1.6, 2);

//Controls
controller = new THREE.DeviceOrientationControls(camera);


//Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
cube.position = (0, 1.6, 0)
scene.add(cube);

//Resizing Code
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}, false);

//Rendering function
renderer.setAnimationLoop( function () {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
	renderer.render( scene, camera );
});