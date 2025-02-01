// src/scenes/mainScene.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initFog } from '../environment/fog.js';
import { initLighting } from '../environment/lighting.js';
import { initGround } from '../environment/ground.js';
import { initSky } from '../environment/sky.js';
import { cars, loadModel } from '../loaders/gltfloader.js';
import { plane, loadRunway, loadAirplane } from '../loaders/objloader.js';
import { moveCarRight, moveCarRight1, moveCarRight2, moveCarRight3 ,
    moveCarLeft1,moveCarLeft11,moveCarLeft12,moveCarLeft13,
    moveCarLeft2,moveCarLeft21,moveCarLeft22,moveCarLeft23,
    moveCarStraight,moveCarStraight1,moveCarStraight2,moveCarStraight3,
    moveCarFront,moveCarFront1,moveCarFront2,moveCarFront3,
    changeLane,changeLane1,changeLane2,changeLane3
} from '../movements/carMovements.js';
import html2canvas from 'html2canvas';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';



const scene = new THREE.Scene();
initFog(scene);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(30, 75, 350);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.id = "myCanvas";
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2;
controls.enableDamping = true;
controls.dampingFactor = 0.1;


initLighting(scene);
initGround(scene);
initSky(scene);

const clouds = [];
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
        Math.random() * 800 - 400, // x position within -400 to 400
        150 + Math.random() * 100,   // height above ground for a natural cloud level
        Math.random() * 800 - 400  // z position within -400 to 400
    );

    return cloudGroup;
}

// Add multiple fluffy clouds to the scene
for (let i = 0; i < 10; i++) {
    const cloud = createFluffyCloud();
    clouds.push(cloud);
    scene.add(cloud);
}

loadRunway(scene);
loadAirplane(scene);









function animateCloud() {
    clouds.forEach(cloud => {
        cloud.position.x += 0.1;
        if (cloud.position.x > 500) cloud.position.x = -500;
    });
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animateCloud);
}

animateCloud();
