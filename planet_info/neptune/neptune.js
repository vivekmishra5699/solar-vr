import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("bg");
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 35); // Adjusted camera position

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableRotate = false; // Disable orbiting
    orbit.enablePan = false; // Disable panning
    const minZoom = 10;
    const maxZoom = 200; 
    orbit.minDistance = minZoom;
    orbit.maxDistance = maxZoom;

    const ambientLight = new THREE.AmbientLight(0x404040, 2.75); // Soft white light
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 15);
    scene.add(directionalLight);

    const textureLoader = new THREE.TextureLoader();

    const neptuneGeometry = new THREE.SphereGeometry(20, 164, 164); // Increase segments for smoother bumps
    const neptuneTexture = textureLoader.load('/textures/planets/neptune/Neptune.jpg');
    const normalTexture = textureLoader.load('/textures/planets/neptune/Neptune_Normal.jpg');
    const bumpTexture = textureLoader.load('/textures/planets/uranus/neptune/Neptune_Bump.jpg');
    
    const neptuneMaterial = new THREE.MeshPhongMaterial({
        map: neptuneTexture,
        normalTexture:normalTexture,
        bumpTexture:bumpTexture,
        bumpScale:0.75,
        shininess: 1
    });
    
  
    const neptuneMesh = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
    scene.add(neptuneMesh);
    
    
    neptuneMesh.position.set(30, 0, 0);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    function onDocumentMouseDown(event) {
        event.preventDefault();
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    }

    function onDocumentMouseMove(event) {
        if (isDragging) {
            const deltaMove = { x: event.clientX - previousMousePosition.x, y: event.clientY - previousMousePosition.y };

            const deltaRotationQuaternion = new THREE.Quaternion()
                .setFromEuler(new THREE.Euler(
                    toRadians(deltaMove.y * 0.5),
                    toRadians(deltaMove.x * 0.5),
                    0,
                    'XYZ'
                ));

            neptuneMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, neptuneMesh.quaternion);

            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    }

    function onDocumentMouseUp(event) {
        isDragging = false;
    }
    function onDocumentTouchStart(event) {
        event.preventDefault();
        isDragging = true;
        previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }

    function onDocumentTouchMove(event) {
        if (isDragging) {
            const deltaMove = { x: event.touches[0].clientX - previousMousePosition.x, y: event.touches[0].clientY - previousMousePosition.y };

            const deltaRotationQuaternion = new THREE.Quaternion()
                .setFromEuler(new THREE.Euler(
                    toRadians(deltaMove.y * 0.5),
                    toRadians(deltaMove.x * 0.5),
                    0,
                    'XYZ'
                ));

            earthMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, earthMesh.quaternion);
            cloudMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, cloudMesh.quaternion);
            previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }
    }

    function onDocumentTouchEnd(event) {
        isDragging = false;
    }
    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        neptuneMesh.rotation.y += 0.0045;
        const targetPosition = new THREE.Vector3(0, 0, 90); // Target position for the camera
        camera.position.lerp(targetPosition, 0.0045); // Smoothly interpolate camera position towards the target
    }

    animate();

    document.addEventListener('mousedown', onDocumentMouseDown);
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('touchstart', onDocumentTouchStart);
    document.addEventListener('touchmove', onDocumentTouchMove);
    document.addEventListener('touchend', onDocumentTouchEnd);

    document.getElementById("button1").addEventListener("click", function () {
        window.close("http://localhost:5173", "_blank");
    });
});

function addStars() {
    const particles = 7000;

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    const color = new THREE.Color();

    for (let i = 0; i < particles; i++) {
        const x = THREE.MathUtils.randFloatSpread(300);
        const y = THREE.MathUtils.randFloatSpread(300);
        const z = THREE.MathUtils.randFloatSpread(300);
        positions.push(x, y, z);

        color.set(0xFEFCFF);
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();

    const textureLoader = new THREE.TextureLoader();
    const starTexture = textureLoader.load('/textures/planets/star.png'); // Make sure to replace with the correct path to your star texture

    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        map: starTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    function animateStars() {
        const time = Date.now() * 0.001;
        const colorsAttribute = points.geometry.attributes.color;
        for (let i = 0; i < colorsAttribute.count; i++) {
            const brightness = 0.5 + 0.5 * Math.sin(time + i);
            colorsAttribute.setXYZ(i, brightness, brightness, brightness);
        }
        colorsAttribute.needsUpdate = true;
        requestAnimationFrame(animateStars);
    }

    animateStars();
}
addStars();

