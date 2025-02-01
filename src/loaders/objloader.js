// src/loaders/objLoader.js
// This code loads the runway model
// and adds it to the scene.
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadRunway(scene) {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('/assets/runway/scene.gltf', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1);
        model.position.set(0, -0.88, 0);
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
    return new Promise((resolve, reject) => {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('/assets/A320/scene.gltf', (gltf) => {
            const model = gltf.scene;
            model.scale.set(2.5, 2.5, 2.5);
            model.position.set(0, 0.2, 0);
            model.rotation.y = 0;
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            scene.add(model);
            console.log("plane loaded");
            resolve(model);
        }, undefined, (error) => {
            reject(error);
        });
    });
}

export function loadtower(scene){
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('/assets/airport_tower/scene.gltf', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.02, 0.02, 0.02);
        model.position.set(200, -2, -20);
        model.rotation.y = 90;
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        scene.add(model);
        console.log("tower loaded");
    });
}