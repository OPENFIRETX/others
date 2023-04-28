<template>
  <div class="container" ref="container"></div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { ref, onMounted } from "vue";
// 场景
const scene = new THREE.Scene();

// 相机
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 0.1

// 渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const container = ref(null)

const render = () => {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

// // ==========================
// //添加立方体
// const geometry = new THREE.BoxGeometry(10, 10, 10)
// // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// // const cube = new THREE.Mesh(geometry, material)
// // scene.add(cube)

// //4_b
// var arr = ["4_l", "4_r", "4_u", "4_d", "4_b", "4_f"]
// var boxMaterials = []

// // 加载纹理
// arr.forEach((item) => {
//   let texture = new THREE.TextureLoader().load(`./assets/living/${item}.jpg`)

//   if (item === "4_u" || item === "4_d") {
//     texture.rotation = Math.PI
//     texture.center = new THREE.Vector2(0.5, 0.5)
//   }
//   boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))

// })
// // cube.material = boxMaterials
// const cube = new THREE.Mesh(geometry, boxMaterials)
// cube.geometry.scale(1, 1, -1)
// scene.add(cube)
// // ==============================


// 添加球体
const geometry = new THREE.SphereGeometry(5, 32, 32)
const loader = new RGBELoader()
loader.load("./assets/living/Living.hdr", (texture) => {
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const sphere = new THREE.Mesh(geometry, material)
  sphere.geometry.scale(1,1,-1)
  scene.add(sphere)

})

//挂载完毕获取dom
onMounted(() => {
  // 添加控制器
  const controls = new OrbitControls(camera, container.value)
  controls.enableDamping = true


  container.value.appendChild(renderer.domElement)
  render()
})

</script>

<style>
* {
  margin: 0;
  padding: 0;
}

.container {
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;

}
</style>
