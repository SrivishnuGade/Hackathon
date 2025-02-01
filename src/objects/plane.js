import * as THREE from 'three';
export function addPlane(scene,z,angle,color)
{
    const planeGeometry = new THREE.PlaneGeometry(150, 2000);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    const parent = new THREE.Object3D();
    scene.add(parent);

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 0, z);
    parent.add(plane);

    parent.rotation.y = THREE.MathUtils.degToRad(90);
    plane.rotation.x = THREE.MathUtils.degToRad(angle-90);
}


export function addTriangle(scene, z, angle1, angle2, color) {
    const length = 1000;

    // Define the 3 vertices of the triangle
    const vertices = new Float32Array([
        z, 0.2, 0,  // Vertex 1 (Base point)
        z + -length * Math.cos(THREE.MathUtils.degToRad(angle1)), 
        0.2 + length * Math.sin(THREE.MathUtils.degToRad(angle1)), 0,  // Vertex 2
        z + -length * Math.cos(THREE.MathUtils.degToRad(angle2)), 
        0.2 + length * Math.sin(THREE.MathUtils.degToRad(angle2)), 0   // Vertex 3
    ]);

    // Create BufferGeometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();  // Helps with shading

    // Define material (transparent and colored)
    const material = new THREE.MeshStandardMaterial({
        color: color,
        transparent: true,
        opacity: 0.5, // Adjust transparency
        side: THREE.DoubleSide, // Ensures visibility from both sides
    });

    // Create the mesh
    const triangle = new THREE.Mesh(geometry, material);

    // Add to scene
    scene.add(triangle);
}

export function addQuadrilateral(scene, z1,z2, angle1, angle2, color) {
    const length = 1000;

    // Define the 4 vertices of the quadrilateral
    const vertices = new Float32Array([
        z1, 0.2, 0,  // Vertex 1 (Base point)
        z1 + -length * Math.cos(THREE.MathUtils.degToRad(angle1)), 
        0.2 + length * Math.sin(THREE.MathUtils.degToRad(angle1)), 0,  // Vertex 2
        z2 + -length * Math.cos(THREE.MathUtils.degToRad(angle2)), 
        0.2 + length * Math.sin(THREE.MathUtils.degToRad(angle2)), 0,   // Vertex 3
        z2,0.2,0
    ]);

    // Create BufferGeometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex([0, 1, 2, 0, 2, 3]); // Define the two triangles that make up the quadrilateral
    geometry.computeVertexNormals();  // Helps with shading

    // Define material (transparent and colored)
    const material = new THREE.MeshStandardMaterial({
        color: color,
        transparent: true,
        opacity: 0.5, // Adjust transparency
        side: THREE.DoubleSide, // Ensures visibility from both sides
    });

    // Create the mesh
    const quadrilateral = new THREE.Mesh(geometry, material);

    // Add to scene
    scene.add(quadrilateral);
}