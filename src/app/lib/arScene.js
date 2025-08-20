import * as THREE from "three";

export function initAR(containerId) {
  const container = document.getElementById(containerId);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });

  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const texture = new THREE.TextureLoader().load("../../public/Avator.png"); // Replace with API-generated image
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    plane.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
}