import * as THREE from "./three/build/three.module.js";
import {VRButton} from "./three/examples/jsm/webxr/VRButton.js";

function main() {
  //GLOBALS
  const distance = 0.3;
  const height = 1.6;

  //Canvas and Renderer
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.xr.enabled = true;
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  document.body.appendChild(VRButton.createButton(renderer));

  //Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  //Camera
  const fov = 50;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, height, 0);

  //Make plane
  const screen_height = 2*distance*Math.tan(fov/2*Math.PI/180);
  const plane_geometry = new THREE.PlaneGeometry(screen_height, screen_height);
  const plane_material = new THREE.MeshStandardMaterial({color:0xffffff})
  const plane = new THREE.Mesh(plane_geometry, plane_material);
  scene.add(plane);
  plane.position.set(0, height, -distance);
  plane.layers.set(2)

  //Initialise light
  function make_light(s, i, xangle, yangle, layer=0) {
    const size = s;
    const intensity = i;
    const x = distance*Math.tan(xangle*Math.PI/180);
    const y = distance*Math.tan(yangle*Math.PI/180);
    const light = new THREE.SpotLight(0xffffff);
    light.physicallyCorrectLights = true;
    light.intensity = intensity;
    light.angle = 2*Math.atan(size/(2*distance));
    scene.add(light);
    light.position.set(x,height+y,0);
    scene.add(light.target);
    light.target.position.set(x, height+y, -distance);
    light.layers.set(2);
    return light
  }

  const test = make_light(0.1, 100, 0, 0, 1);

  //Renderer resizing code
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
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(render);
}

main();