import * as THREE from "three"
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"


// 创建场景
const scene = new THREE.Scene()

const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMapTextrue = cubeTextureLoader.load([
    "./imgs/1.jpg",
    "./imgs/1.jpg",
    "./imgs/1.jpg",
    "./imgs/1.jpg",
    "./imgs/1.jpg",
    "./imgs/1.jpg",



])
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.1
})

scene.background = envMapTextrue

// 创=========================================================建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.set(0, 0, 10)
scene.add(camera)


const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
// =========================================================创建几何体和材质
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

//设置位置
cube.position.set(0, 0, 0)
// 设置缩放、旋转
// cube.scale.set(3,2,1)
cube.rotation.set(Math.PI / 4, 0, 0)

// 几何体添加到场景
scene.add(cube)




//====================================================控制器
const gui = new dat.GUI()
gui.add(cube.position, "x").min(0).max(5).step(0.01)

const params = {
    color: "#ffff00",
    fn: () => {
        gsap.to(cube.position, { x: 5, duration: 2, yoyo: true, repeat: -1 })
    }
}
gui.addColor(params, "color").onChange(val => {
    cube.material.color.set(val)
})

gui.add(cube, "visible").name("是否显示")

gui.add(params, "fn").name("运动")

var folder = gui.addFolder("设置立方体")
folder.add(cube.material, "wireframe")

// ==================================================初始化渲染器
const renderer = new THREE.WebGLRenderer()

// 设置渲染的尺寸
renderer.setSize(window.innerWidth, window.innerHeight)

// 将web渲染的canvas添加到body
document.body.appendChild(renderer.domElement)

// 使用渲染器 通过相机将场景渲染
// renderer.render(scene, camera)


// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
//设置惯性
controls.enableDamping = true

//添加坐标
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 设置时钟
const clock = new THREE.Clock()


// 设置动画
var animate1 = gsap.to(cube.position, {
    duration: 2,
    ease: "bounce.out",
    y: -5,
})
gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5 })

window.addEventListener("dblclick", () => {
    if (!document.fullscreenElement) {
        renderer.domElement.requestFullscreen()

    } else {
        document.exitFullscreen()
    }
})

function render() {
    controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(render)
}


render()

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
    //   console.log("画面变化了");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
}); 