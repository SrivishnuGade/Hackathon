// src/loaders/objLoader.js
// This code loads the runway model
// and adds it to the scene.
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const plane = {};

export function loadRunway(scene) {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('/assets/runway/scene.gltf', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1);
        model.position.set(0, 0, 0);
        model.rotation.y = Math.PI / 2;
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        scene.add(model);
        console.log("runway loaded");
    });
}

export function loadAirplane(scene) {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('/assets/A320/scene.gltf', (gltf) => {
        const model = gltf.scene;
        model.scale.set(2.5, 2.5, 2.5);
        model.position.set(0, 4, 0);
        model.rotation.y = 0;
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        scene.add(model);
        // plane.push(model);
        console.log("plane loaded");
    });
}

export { plane };
