import * as THREE from "./three/build/three.module.js"
import {VRButton} from "./three/examples/jsm/webxr/VRButton.js"

function main() {
  //Globals
  const distance = 0.3
  const height = 1.6

  //Canvas and Renderer
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas})
  renderer.xr.enabled = true
  renderer.setSize( window.innerWidth, window.innerHeight )
  document.body.appendChild( renderer.domElement )
  document.body.appendChild(VRButton.createButton(renderer))

  //Scene setup
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  //Camera
  const fov = 50
  const aspect = window.innerWidth / window.innerHeight
  const near = 0.1
  const far = 10
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, height, 0)
  camera.layers.set(2)

  //Left
  const geometry_plane = new THREE.PlaneGeometry(100, 100)
  const material = new THREE.MeshPhongMaterial({color:0xffffff})
  const planeL = new THREE.Mesh(geometry_plane, material)
  scene.add(planeL)
  planeL.position.set(0, height, -distance)
  planeL.layers.set(2)

  //Right
  const material2 = new THREE.MeshPhongMaterial({color: 0xffffff})
  const planeR = new THREE.Mesh(geometry_plane, material2)
  scene.add(planeR)
  planeR.position.set(0, height, -distance)
  planeR.layers.set(1)

  //Initialise light function
  function make_light(s, i, xangle, yangle, color) {
    var size = s
    var intensity = i
    var x = distance*Math.tan(xangle*Math.PI/180)
    var y = distance*Math.tan(yangle*Math.PI/180)
    var light = new THREE.SpotLight(color)
    light.physicallyCorrectLights = true
    light.intensity = intensity
    light.angle = 2*Math.atan(size/(2*distance))
    scene.add(light)
    light.position.set(x,height+y,0)
    scene.add(light.target)
    light.target.position.set(x, height+y, -distance)
    light.layers.set(2)
  }

  //Fixation Point
  make_light(0.002, 10, 0, 0, 0xff0000);

  //Test Pattern generation
  for(let i=3; i<=24; i+=6) {
    for(let j=3; j<=24; j+=6) {
      if(i*i+j*j<=24*24 && i!=0 && j!=0){
        make_light(0.002, 10, i, j, 0xffffff)
        make_light(0.002, 10, -i, j, 0xffffff)
        make_light(0.002, 10, i, -j, 0xffffff)
        make_light(0.002, 10, -i, -j, 0xffffff)
      }
    }
  }

  //Renderer resizing code
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }

  function render(time) {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    renderer.render(scene, camera)
  }
  renderer.setAnimationLoop(render)
}

main()