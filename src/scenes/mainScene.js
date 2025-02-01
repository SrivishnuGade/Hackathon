// src/scenes/mainScene.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initFog } from '../environment/fog.js';
import { initLighting } from '../environment/lighting.js';
import { initGround } from '../environment/ground.js';
import { initSky } from '../environment/sky.js';
import { loadRunway, loadAirplane, loadtower } from '../loaders/objloader.js';
import { addPlane } from '../objects/plane.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { add } from 'three/tsl';
import { combinedLanding,movePlaneDown ,glideRunway} from '../movements/flightMovements.js';
import { addQuadrilateral } from '../objects/plane.js';
import { goAround } from '../movements/flightMovements.js';



const scene = new THREE.Scene();
initFog(scene);

let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 10, 8000);
// camera.position.set(-22.050717709373014, 1.4950698496896732e-15,  -10.484449512827148);
camera.position.set(365.7863760272274,91.49016868039627,-518.766053531943)

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.id = "myCanvas";
document.body.appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.minPolarAngle = 0;
// controls.maxPolarAngle = Math.PI / 2;
// controls.enableDamping = true;
// controls.dampingFactor = 0.1;


initLighting(scene);
initGround(scene);
initSky(scene);

let plane;
let plane2;
const clouds = [];
let radius = 200; 
const cameraOffset = new THREE.Vector3(-100, 10, -1);
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotationX = -90-45, targetRotationY = 10;
let rotationSpeed = 0.7;
let zoomSpeed = 0.05;
let verticalSpeed = 0.75;
let horizontalSpeed = 14.0625;

const higherFOVCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
higherFOVCamera.position.copy(camera.position);
higherFOVCamera.lookAt(scene.position);

function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}
function onMouseMove(event) {
    if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        targetRotationX -= deltaX * rotationSpeed;
        targetRotationY += deltaY * rotationSpeed;

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
}
function onMouseUp() {
    isDragging = false;
}
function onWheel(event) {
    // Adjust the radius based on the scroll input
    radius += event.deltaY * zoomSpeed;
    radius = Math.max(10, Math.min(500, radius)); // Clamp the radius
}
function onKeyDown(event) {
    if (event.key === 'c' || event.key === 'C') {
        if (camera === higherFOVCamera) {
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.copy(higherFOVCamera.position);
            camera.lookAt(scene.position);
        } else {
            higherFOVCamera.position.copy(camera.position);
            higherFOVCamera.lookAt(scene.position);
            camera = higherFOVCamera;
        }
    }
    else if (event.key === 'w' || event.key === 'W') {
        verticalSpeed = 0.1;
    }
    else if (event.key === 's' || event.key === 'S') {
        verticalSpeed = 1.2;
    }
    else if (event.key === 'a' || event.key === 'A') {
        horizontalSpeed = 7.5;
    }
    else if (event.key === 'd' || event.key === 'D') {
        horizontalSpeed = 17.5;
    }
}
function onKeyUp(event) {
    if (event.key === 'w' || event.key === 'W' || event.key === 's' || event.key === 'S') {
        // Gradually decelerate the vertical speed when the key is released
        verticalSpeed = 0.75;
    }
    if (event.key === 'a' || event.key === 'A' || event.key === 'd' || event.key === 'D') {
        // Gradually decelerate the horizontal speed when the key is released
        horizontalSpeed = 14.0625;
    }
}

window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('wheel', onWheel, false);
window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);

function createFluffyCloud() {
    const cloudGroup = new THREE.Group();
    
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
    });

    // Adjusted geometry to make particles slightly larger and smoother
    const particleGeometry = new THREE.SphereGeometry(10, 16, 16); // Larger spheres for fluffier particles

    // Create multiple particles to form a fluffy cloud
    for (let i = 0; i < 150; i++) { // Reduced particle count for performance, but larger particles
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);

        // Randomly position each particle to form a spread-out, fluffy cloud shape
        particle.position.set(
            (Math.random() - 0.5) * 80, // x position, wider spread
            (Math.random() - 0.5) * 20, // y position, less vertical spread
            (Math.random() - 0.5) * 80  // z position, wider spread
        );

        // Randomize size slightly for a more natural look
        particle.scale.setScalar(Math.random() * 0.8 + 0.6);
        cloudGroup.add(particle);
    }

    // Set the overall position of the cloud cluster higher in the scene
    cloudGroup.position.set(
        Math.random() * 1600 - 800, // x position within -400 to 400
        200 + Math.random() * 50,   // height above ground for a natural cloud level
        Math.random() * 1600 - 800  // z position within -400 to 400
    );

    return cloudGroup;
}

// Add multiple fluffy clouds to the scene
for (let i = 0; i < 100; i++) {
    const cloud = createFluffyCloud();
    clouds.push(cloud);
    scene.add(cloud);
}

loadRunway(scene);
loadtower(scene);

// loadAirplane(scene).then((model) => {
//     plane = model;
//     console.log('Plane position:', plane.position);
//     plane.position.set(-225-1125, plane.position.y+60, 0);
    
//     combinedLanding(plane);
// }).catch((error) => {
//     console.error('Error loading airplane:', error);
// });

loadAirplane(scene).then((model) => {
    plane = model;
    console.log('Plane position:', plane.position);
    plane.position.set(-255-1125, plane.position.y+60, 0);
    const intervalId = setInterval(() => {
        movePlaneDown(plane, verticalSpeed, horizontalSpeed);

        if (plane.position.y <= 0.21 && plane.position.x> -270) {
            clearInterval(intervalId); // Exit the interval
            glideRunway(plane);
        }
        else if(plane.position.y <= 0.21 && plane.position.x< -365){
            clearInterval(intervalId); // Exit the interval
            console.log("Bad Landing");
        }
        if (plane.position.y>=Math.tan(THREE.MathUtils.degToRad(6))*(-180-plane.position.x)){
            clearInterval(intervalId);
            goAround(plane);
        }
    }, 250);
}).catch((error) => {
    console.error('Error loading airplane:', error);
});





// addPlane(scene,330,90,0x00ff00);
// // addPlane(scene,-200,,0xff0000);
// addPlane(scene,-225,2,0x00ff00);

// addPrism(scene, -225, 2, 4, 0x00ff00);
// addPrism(scene, -225, 4, 10, 0xff0000);
// addPrism(scene, -225, 2, 0, 0x00ff00);

// addTriangle(scene, -225, 2, 4, 0x00ff00);
// addTriangle(scene, -225, 4, 10, 0xff0000);
// addTriangle(scene, -225, 2, 0, 0xff0000);

addQuadrilateral(scene, -245, -205, 2, 4, 0x00ff00);
addQuadrilateral(scene, -205, -180, 4, 6, 0xffa500);
addQuadrilateral(scene, -180, -120, 6, 10, 0xff0000);
addQuadrilateral(scene, -270, -240, 1, 2, 0xffa500);
addQuadrilateral(scene, -270, -270, 0,1, 0xff0000);
const xCoordinateElement = document.getElementById('x-coordinate');
const yCoordinateElement = document.getElementById('y-coordinate');

function animateCloud() {
    clouds.forEach(cloud => {
        cloud.position.x += 0.1;
        if (cloud.position.x > 500) cloud.position.x = -500;
    });

    if (plane) {
        if (camera === higherFOVCamera) {
            // Cockpit view
            camera.position.set(
                plane.position.x +2.55,
                plane.position.y + 0.345,
                plane.position.z
            );
            const offsetX = -radius * Math.sin(THREE.MathUtils.degToRad(targetRotationX)) * Math.cos(THREE.MathUtils.degToRad(targetRotationY));
            const offsetY = -radius * Math.sin(THREE.MathUtils.degToRad(targetRotationY));
            const offsetZ = -radius * Math.cos(THREE.MathUtils.degToRad(targetRotationX)) * Math.cos(THREE.MathUtils.degToRad(targetRotationY));
            camera.lookAt(
                plane.position.x + offsetX,
                plane.position.y + offsetY,
                plane.position.z + offsetZ
            );
        } else {
            targetRotationY=Math.max(0, Math.min(90, targetRotationY));
            const offsetX = radius * Math.sin(THREE.MathUtils.degToRad(targetRotationX)) * Math.cos(THREE.MathUtils.degToRad(targetRotationY));
            const offsetY = radius * Math.sin(THREE.MathUtils.degToRad(targetRotationY));
            const offsetZ = radius * Math.cos(THREE.MathUtils.degToRad(targetRotationX)) * Math.cos(THREE.MathUtils.degToRad(targetRotationY));

            camera.position.set(
                plane.position.x + offsetX,
                plane.position.y + offsetY,
                plane.position.z + offsetZ
            );

            camera.lookAt(plane.position);
            // console.log("xrot",targetRotationX);
            // console.log("yrot",targetRotationY);
            // console.log("camera", camera.position);
            // console.log("plane", plane.position);
            // console.log("verticalSpeed", verticalSpeed);
            // console.log("horizontalSpeed", horizontalSpeed);

        }
        
        if(plane.position.y<=0.21 && plane.position.x>=-365){
            xCoordinateElement.textContent = `Touchdown successful`;
            yCoordinateElement.textContent = `Breaks applied`;
        }
        if(plane.position.x<=365 && plane.position.y<=0.21){
            xCoordinateElement.textContent = `Bad Landing!`;
            yCoordinateElement.textContent = ``;
        }
        if(plane.position.x>200 && plane.position.y<=0.21){
            xCoordinateElement.textContent = `Landing Successful`;
            yCoordinateElement.textContent = ``;
            
        }
        if(plane.position.y>=Math.tan(THREE.MathUtils.degToRad(6))*(-180-plane.position.x)){
            xCoordinateElement.textContent = `Go Around`;
            yCoordinateElement.textContent = ``;
        }
        else{
            xCoordinateElement.textContent = `Distance to touchdown: ${-((plane.position.x+225)*4/1125).toFixed(2)} Nautical Miles`;
            yCoordinateElement.textContent = `Atltitude: ${((plane.position.y-0.2)*65/3).toFixed(2)} feet`;
        }
        
    }
    if (plane2){
        console.log(plane2.position);
    }

    
    renderer.render(scene, camera);
    // console.log(camera.position);
    requestAnimationFrame(animateCloud);
}

animateCloud();
