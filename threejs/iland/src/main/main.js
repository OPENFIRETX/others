import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

// 水
import { Water } from "three/examples/jsm/objects/Water2"

// 导入gltf库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"

//场景
const scene = new THREE.Scene()

// 相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth, window.innerHeight,
    0.1,
    2000
)

camera.position.set(-50, 50, 130)

// 更新摄像头宽高
camera.aspect = window.innerWidth / window.innerHeight
// 更新投影矩阵
camera.updateProjectionMatrix()

scene.add(camera)

//初始化渲染器
const renderer = new THREE.WebGL1Renderer({
    antialias: true
})

renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth, window.innerHeight)

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)


function render() {
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}

render()

//添加平面
// const planGeometery = new THREE.PlaneGeometry(100, 100)
// const planMaterial = new THREE.MeshBasicMaterial({
//     color: 0xffffff
// })
// const plane = new THREE.Mesh(planGeometery, planMaterial)
// scene.add(plane)

// 创建天空球
const texture = new THREE.TextureLoader().load("./textures/sky.jpg")


const skyGeometry = new THREE.SphereGeometry(100, 60, 60)
const skyMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("./textures/sky.jpg")
})
skyGeometry.scale(1, 1, -1)
const sky = new THREE.Mesh(skyGeometry, skyMaterial)
scene.add(sky)

scene.background = texture
scene.environment = texture

const video = document.createElement("video")
video.src = "./textures/sky.mp4"
video.loop = true

window.addEventListener("click", (e) => {
    if (video.paused) {
        video.play()
        let texture = new THREE.VideoTexture(video)
        skyMaterial.map = new THREE.VideoTexture(video)
        skyMaterial.map.needsUpdate = true
    }

})

// 载入环境HDR
const hdrLoader = new RGBELoader()
hdrLoader.loadAsync("./assets/050.hdr").then((texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
})

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-100, 100, 1)




// 创建水面

const waterGeometry = new THREE.CircleGeometry(300, 64)
const water = new Water(waterGeometry, {
    textureWidth: 1024,
    textureHeight: 1024,
    color: 0xeeeeff,
    flowDirection: new THREE.Vector2(1, 1),
    scale: 1
})



// 水面旋转
water.rotation.x = -Math.PI / 2

scene.add(water)



const loader = new GLTFLoader()

const dracoLoader = new DRACOLoader()

dracoLoader.setDecoderPath("./draco/")

loader.setDRACOLoader(dracoLoader)

loader.load("./model/island2.glb", (gltf) => {
    scene.add(gltf.scene)
})
