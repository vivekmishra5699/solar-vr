import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js';
const scene = new THREE.Scene();
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("bg");
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 35);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableRotate = false;
    orbit.enablePan = false;
    const minZoom = 10;
    const maxZoom = 200;
    orbit.minDistance = minZoom;
    orbit.maxDistance = maxZoom;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1 );
    directionalLight.position.set(5, 5, 15);
    scene.add(directionalLight);

    const textureLoader = new THREE.TextureLoader();

    const earthGeometry = new THREE.SphereGeometry(20, 64, 64);
    const earthTexture = textureLoader.load('/solar-vr/textures/planets/earth/earth.jpg');
    const earthNormalMap = textureLoader.load('/solar-vr/textures/planets/earth/earth_normal.jpg');
    const earthSpecularMap = textureLoader.load('/solar-vr/textures/planets/earth/earth_specular.jpg');
    const earthDisplacementMap = textureLoader.load('/solar-vr/textures/planets/earth/Earth_Bump.jpg');
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        normalMap: earthNormalMap,
        specularMap: earthSpecularMap,
        displacementMap: earthDisplacementMap,
        displacementScale: 1,
        transparent:false
      
    });
   

    const cloudGeometry = new THREE.SphereGeometry(20.2, 64, 64);
    const cloudTexture = textureLoader.load('/solar-vr/textures/planets/earth/Cloud_Map.jpg');

    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.2
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(cloudMesh);

    earthMesh.position.set(30, 0, 0);
    cloudMesh.position.set(30, 0, 0);

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

            earthMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, earthMesh.quaternion);
            cloudMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, cloudMesh.quaternion);
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

        if (!isDragging) {
            earthMesh.rotation.y += 0.0045;
            cloudMesh.rotation.y += 0.0048;
        }

        const targetPosition = new THREE.Vector3(0, 0, 90);
        camera.position.lerp(targetPosition, 0.0045);
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

    const material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true });
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
