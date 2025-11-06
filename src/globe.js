import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const light = new THREE.DirectionalLight(0xffffff, 1);
scene.add(new THREE.AmbientLight(0x333333));
scene.add(light);

const loader = new THREE.TextureLoader();
// Try multiple texture URLs and gracefully fall back to a plain material if all fail
const textureCandidates = [
  'https://raw.githubusercontent.com/fireship-io/threejs-earth/main/earthmap1k.jpg',
  'https://threejs.org/examples/textures/earth_atmos_2048.jpg',
  '/aqua.png' // fallback to a small local image if available
];

let earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2a65a0 });

function tryLoadTexture(index = 0) {
  if (index >= textureCandidates.length) {
    // no texture found — use plain colored material
    earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2a65a0, shininess: 10 });
    createEarth();
    return;
  }
  const url = textureCandidates[index];
  loader.load(
    url,
    (tex) => {
      // success
      earthMaterial = new THREE.MeshPhongMaterial({ map: tex });
      createEarth();
    },
    undefined,
    (err) => {
      console.warn('Failed to load texture', url, err);
      tryLoadTexture(index + 1);
    }
  );
}

function createEarth() {
  const earth = new THREE.Mesh(new THREE.SphereGeometry(2, 64, 64), earthMaterial);
  scene.add(earth);
  // expose to animation loop
  window.__aquaEarth = earth;
}

tryLoadTexture(0);
scene.add(earth);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  if (window.__aquaEarth) window.__aquaEarth.rotation.y += 0.001;
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
