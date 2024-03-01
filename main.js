import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import GUI from 'lil-gui'; 
import { CubeTextureLoader, LoadingManager } from 'three';

// const gui = new GUI()
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 2, 8);

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// 加载器生命周期管理
const loadingManager = new LoadingManager();
loadingManager.onError = (err) => {
	console.log('贴图导入错误：' + err)
}

// 方形世界贴图
const cubeTextureLoader = new CubeTextureLoader(loadingManager);
const cubeTexture = cubeTextureLoader.setPath('/pic2/')
.load([
	'px.png',
	'nx.png',
	'py.png',
	'ny.png',
	'pz.png',
	'nz.png',
])
cubeTexture.mapping = THREE.CubeReflectionMapping;
scene.background = cubeTexture

const torusGeometry = new THREE.TorusGeometry( 1, 0.5, 16, 100 );
const normalMat = new THREE.MeshNormalMaterial({envMap: cubeTexture});
const torusMesh = new THREE.Mesh( torusGeometry, normalMat );
torusMesh.position.set(0, -5, 0);
const torusClone = torusMesh.clone();
torusClone.position.set(0, 5, 0);
for(let i = 0; i < 100; i++){
	const torusClone = torusMesh.clone();
	torusClone.position.x = (Math.random() - 0.5) * 100;
	torusClone.position.y = (Math.random() - 0.5) * 100;
	torusClone.position.z = (Math.random() - 0.5) * 100;
	torusClone.rotation.x = Math.random() * Math.PI;
	torusClone.rotation.y = Math.random() * Math.PI;
	scene.add(torusClone);
}

// 文本几何体属性
const myProps = {
	font: null,
	size: 1.5,
	height: 0.4,
	curveSegments: 2,
	bevelEnabled: true,
	bevelThickness: 0.5,
	bevelSize: 0.3,
	bevelSegments: 1,
	words: '春春真可爱~<3',
	color: new THREE.Color('skyblue'),
	dynamicColor: true
}

const material = new THREE.MeshBasicMaterial({ color: myProps.color, envMap: cubeTexture });
scene.add( torusMesh );
// 参数更新，重新加载几何体
function updateGeometry(textGoeMesh){
	textGoeMesh.geometry.dispose();
	textGoeMesh.geometry = new TextGeometry( myProps.words, myProps);
	textGoeMesh.geometry.center(new THREE.Vector3());
}
let textGoeMesh
// 创建文本几何体
function createTextGeo() {
    const textGeometry = new TextGeometry( myProps.words, myProps);
	textGoeMesh = new THREE.Mesh( textGeometry,  material);
	textGoeMesh.geometry.center(new THREE.Vector3());
	scene.add( textGoeMesh );
	
	// gui.add(myProps, 'size').name('大小').min(0.5).max(10).step(0.5).onChange(() => updateGeometry(textGoeMesh))
	// gui.add(myProps, 'height').name('厚度').min(0.2).max(2).step(0.2).onChange(() => updateGeometry(textGoeMesh))
	// gui.add(myProps, 'bevelThickness').name('倒角厚度').min(0.02).max(2).step(0.02).onChange(() => updateGeometry(textGoeMesh))
	// gui.add(myProps, 'bevelSize').name('倒角放缩').min(0.02).max(2).step(0.02).onChange(() => updateGeometry(textGoeMesh))
	// gui.add(myProps, 'bevelSegments').name('倒角细分').min(0).max(10).step(1).onChange(() => updateGeometry(textGoeMesh))
	// gui.add(material, 'wireframe').name('线框模型')
	// gui.add(myProps, 'dynamicColor').name('动态色彩')
	// // gui.add(myProps, 'words').name('更换语句').onChange(() => updateGeometry(textGoeMesh))
	// gui.addColor(material, 'color').name('颜色').onChange(() => {
	// 	myProps.dynamicColor = false;
	// })
}

//加载字体
const loader = new FontLoader();
loader.load( 'sans.json', function ( font ) {
	myProps.font = font;
	createTextGeo()
} );

//轨道辅助器
const orbitControls = new OrbitControls( camera, renderer.domElement );
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.1;
orbitControls.enablePan = false
orbitControls.autoRotate = true;
orbitControls.autoRotateSpeed = 0.8;
orbitControls.update()

const colorsEnum = [0x3098c5, 0xff3d3d, 0x8457a2, 0xd56c6c, 0x61e5d6, 0x77ee7f, 'skyblue', 0xbec9f4]
const wordsEnum = [
	"脑婆亲亲~",
	"爱你一万年",
	"妇女节快乐鸭",
	"想见你想见你",
	"你是我的小宝贝",
	"要想我哦~",
	"春春真可爱^_^",
	"Mua~Mua~",
]

// const wordsEnum = [
// 	"原神！启动~",
// 	"万元申万的",
// 	"我真的好喜欢原神啊",
// 	"不玩原神只能过一个失败的人生",
// 	"我们元神玩家实在是太有实力了",
// 	"一键为所有网友安装元神",
// 	"原神，嘿嘿<3",
// 	"Mua~Mua~",
// ]
//动画函数
function tick(){
	renderer.render( scene, camera );
	myProps.dynamicColor && material.color.set(colorsEnum[Math.floor(Date.now() / 1200) % colorsEnum.length])
	myProps.words = wordsEnum[Math.floor(Date.now() / 1500) % wordsEnum.length]
	textGoeMesh && updateGeometry(textGoeMesh)
	orbitControls.update();
	requestAnimationFrame(tick);
}
tick()