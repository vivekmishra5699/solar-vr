import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import { VRButton } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/webxr/VRButton.js';
const canvas = document.getElementById("bg");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType('local');

const vrButton = VRButton.createButton(renderer); // Create VR button
vrButton.id = 'vr-button'; // Add an ID to the VR button
document.body.appendChild(vrButton);
setTimeout(() => {
    // 10000 milliseconds = 10 seconds
 
const camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 5000);
const scene = new THREE.Scene();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
camera.position.set(50, 35, 55);
const cameraRig = new THREE.Group();
cameraRig.add(camera);
scene.add(cameraRig);
const sunLight = new THREE.PointLight(0xFFFFFF,1);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x757575, 1);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();
const spaceTexture = textureLoader.load('/solar-vr/textures/galaxy.webp');
// Create a large sphere for the background
const backgroundGeometry = new THREE.SphereGeometry(3000, 164, 164);
const backgroundMaterial = new THREE.MeshBasicMaterial({
    map: spaceTexture,
    side: THREE.BackSide
});
const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);

// Rotate the background mesh to align with the vertical axis
backgroundMesh.rotation.x = Math.PI / 2.67; // Rotate 90 degrees around the x-axis

scene.add(backgroundMesh);

const textures = {
    sun: {
        colorMap: textureLoader.load('/solar-vr/textures/sun/8k_sun.jpg'),
        normalMap: textureLoader.load('/solar-vr/texture/planet/mercury/Normal.jpg'),
        specularMap: textureLoader.load('/solar-vr/texture/sun/sun_detailed.jpg'),
        displacementMap: textureLoader.load('/solar-vr/textures/sun/sun-alpha-2k.jpg')
    },
    mercury: {
        colorMap: textureLoader.load('/solar-vr/textures/planets/mercury/Mercury_Bump.jpg'),
        normalMap: textureLoader.load('/solar-vr/textures/planets/mercury/Normal.jpg'),
       
    },
    venus: {
        colorMap: textureLoader.load('/solar-vr/textures/planets/venus/venus.jpg'),
    },
    earth: {
        colorMap: textureLoader.load('/solar-vr/textures/planets/earth/earth.jpg'),//4096 for more clear view
        normalMap: textureLoader.load('/solar-vr/textures/planets/earth/earth_normal.jpg'),
        specularMap: textureLoader.load('/solar-vr/textures/planets/earth/earth_specular.jpg'),
        displacementMap: textureLoader.load('/solar-vr/textures/planets/earth/earthbump (2).jpg')
    },
    mars: {
        colorMap: textureLoader.load('/solar-vr/textures/planets/mars/mars.jpg'),
        normalMap: textureLoader.load('/solar-vr/textures/planets/mars/Mars_Normal.jpg'),
    },
    jupiter: {
        colorMap: textureLoader.load('/solar-vr/textures/planets/jupiter/Jupiter_Map.jpg'),
        normalMap: textureLoader.load('/solar-vr/textures/planets/jupiter/Jupiter_Normal.jpg'),
    },
    saturn: {
        colorMap: textureLoader.load('/solar-vr/textures/planets/saturn/Saturn_Map.jpg'),
        normalMap: textureLoader.load('/solar-vr/textures/planets/saturn/Saturn_Normal.jpg')
    },
    saturnRings: {
        colorMap: textureLoader.load('/solar-vr/textures/planets/saturn/ring.jpeg'),
        alphaMap: textureLoader.load('/solar-vr/textures/planets/saturn/saturn_ring.png')
    },
    uranus: {
        colorMap: textureLoader.load('/solar-vr/textures/planets/uranus/Uranus-0.jpg'),
        normalMap: textureLoader.load('/solar-vr/textures/planets/uranus/Uranus_Normal.jpg')
    },
    neptune:{
        colorMap: textureLoader.load('/solar-vr/textures/planets/neptune/Neptune.jpg'),
        normalMap: textureLoader.load('/solar-vr/textures/planets//neptune/Neptune_Normal.jpg')
    }
};


// SUN
const sunMaterial = new THREE.MeshPhongMaterial({
    map: textures.sun.colorMap,
    normalMap: textures.sun.normalMap,
    specularMap: textures.sun.specularMap,
    displacementMap: textures.sun.displacementMap,
    displacementScale: 0.05
});
const sunGeometry = new THREE.SphereGeometry(64, 64, 32);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

//creating planets
function createPlanet(radius, maps, distanceFromSun, orbitalSpeed, name) {
    const planetGeometry = new THREE.SphereGeometry(radius, 50, 50);
    const planetMaterial = new THREE.MeshPhongMaterial({
        map: maps.colorMap,
        displacementScale : 1
    });
    if (maps.normalMap) planetMaterial.normalMap = maps.normalMap;
    if (maps.specularMap) planetMaterial.specularMap = maps.specularMap;
    if(maps.displacementMap) planetMaterial.displacementMap = maps.displacementMap;


    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.distanceFromSun = distanceFromSun;
    planet.orbitalSpeed = orbitalSpeed;
    planet.name = name;
    planet.rotating = true;

    const angle = Math.random() * Math.PI * 5;
    planet.position.x = Math.cos(angle) * distanceFromSun;
    planet.position.z = Math.sin(angle) * distanceFromSun;

    scene.add(planet);


    const orbitPoints = [];

    const segments = 360;
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = distanceFromSun * Math.cos(theta);
        const z = distanceFromSun * Math.sin(theta);
        orbitPoints.push(x, 0, z);
    }

    return planet;
}

const cloudpic = textureLoader.load('/textures/planets/earth/clouds.png');
const clouds = new THREE.SphereGeometry(16.1, 32, 64);
const cloudMaterial = new THREE.MeshStandardMaterial({ map: cloudpic, transparent: true, opacity: 0.98 });
const earthCloud = new THREE.Mesh(clouds, cloudMaterial);
scene.add(earthCloud);

const planetsData = [
    [6, textures.mercury, 105, 0.05, 'Mercury'],
    [10, textures.venus, 160, 0.015, 'Venus'],
    [16, textures.earth, 220, 0.01, 'Earth'],
    [7, textures.mars, 300, 0.008, 'Mars'],
    [20, textures.jupiter, 500, 0.005, 'Jupiter'],
    [8, textures.saturn, 800, 0.003, 'Saturn'],
    [13, textures.uranus, 1100, 0.002, 'Uranus'],
    [13, textures.neptune, 1400, 0.0015, 'Neptune']
];

const planets = planetsData.map(data => createPlanet(data[0], data[1], data[2], data[3], data[4]));

function createSaturnRings(innerRadius, outerRadius, textureMap, alphaMap) {
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 18, 1);
    const ringTexture = textureMap;
    const ringAlpha = alphaMap;

    const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        alphaMap: ringAlpha,
        side: THREE.DoubleSide,
        transparent: false
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    return ring;
}


// Ensure Saturn is added to the scene
const saturn = planets.find(planet => planet.name === 'Saturn');
if (saturn) {
    const saturnRings = createSaturnRings(
        13, // Inner radius
        23, // Outer radius
        textures.saturnRings.colorMap, // Color texture
        textures.saturnRings.alphaMap // Alpha texture
    );
    saturn.add(saturnRings);
    console.log('Saturn rings added:', saturnRings);
} else {
    console.error('Saturn not found in planets array');
}
function addSaturnRingParticles() {
    const particles = 10000; // Number of particles

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    const yellowColor = new THREE.Color(0xd8ae6d); // Yellow color

    for (let i = 0; i < particles; i++) {
        const theta = Math.random() * Math.PI * 2;
        const radius = THREE.MathUtils.randFloat(22, 35);
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        const y = THREE.MathUtils.randFloatSpread(0.5);
        positions.push(x, y, z);
        colors.push(yellowColor.r, yellowColor.g, yellowColor.b); // Set color to yellow
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();

    const material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true });
    const points = new THREE.Points(geometry, material);
    saturn.add(points);

    function animateSaturnRingParticles() {
        const time = Date.now() * 0.001;
        const colorsAttribute = points.geometry.attributes.color;
        for (let i = 0; i < colorsAttribute.count; i++) {
            const brightness = 0.5 + 0.5 * Math.sin(time + i);
            colorsAttribute.setXYZ(i, yellowColor.r * brightness, yellowColor.g * brightness, yellowColor.b * brightness);
        }
        colorsAttribute.needsUpdate = true;
        requestAnimationFrame(animateSaturnRingParticles);
    }

    animateSaturnRingParticles();
}

addSaturnRingParticles();





renderer.setAnimationLoop(animate);
planets.forEach(planet => {
    planet.castShadow = true;
    planet.receiveShadow = true;
});


const trackPoints = [
    new THREE.Vector3(0, 400, 2000), // Start far from the Sun
    new THREE.Vector3(0, 5, 110), // Move closer to the Sun
    ...planets.map(planet => new THREE.Vector3(planet.position.x, 5, planet.position.z)) // Points at each planet
];

let currentPointIndex = 0;
let progress = 0;
const animationSpeed = 0.0009;
const orbitDuration = 8000; // Time to orbit around a planet in milliseconds
let orbitStartTime = 0;
let orbiting = false;

renderer.setAnimationLoop(animate);

function animate(time, xrFrame) {
    if (!orbiting) {
        progress += animationSpeed;
        if (progress > 1) {
            progress = 0;
            currentPointIndex = (currentPointIndex + 1) % trackPoints.length;
            if (currentPointIndex === 0) {
                // Reset to initial far position
                cameraRig.position.copy(trackPoints[0]);
                currentPointIndex = 1;
            }
            if (currentPointIndex > 1) {
                // Start orbiting when reaching a planet
                orbiting = true;
                orbitStartTime = Date.now();
            }
        }

        const startPoint = trackPoints[currentPointIndex];
        const endPoint = trackPoints[(currentPointIndex + 1) % trackPoints.length];
        const pointOnLine = new THREE.Vector3().lerpVectors(startPoint, endPoint, progress);
        cameraRig.position.copy(pointOnLine);
        cameraRig.position.y = THREE.MathUtils.lerp(startPoint.y, endPoint.y, progress); // Interpolate Y position
    } else {
        const planet = planets[currentPointIndex - 2];
        const orbitTime = Date.now() - orbitStartTime;
        const angle = (orbitTime / orbitDuration) * Math.PI * 2;
        cameraRig.position.x = planet.position.x + Math.cos(angle) * 30;
        cameraRig.position.z = planet.position.z + Math.sin(angle) * 30;
        cameraRig.position.y = 5; // Ensure camera Y position stays at 5 during orbit

        if (orbitTime > orbitDuration) {
            orbiting = false;
            progress = 0;
        }
    }

    sun.rotation.y += 0.0005;
    planets.forEach(planet => {
        if (planet.rotating !== false) {
            const angle = planet.orbitalSpeed * Date.now() * 0.001;
            planet.position.x = Math.cos(angle) * planet.distanceFromSun;
            planet.position.z = Math.sin(angle) * planet.distanceFromSun;
            planet.rotation.y += 0.01;
        }
    });
    const earth = planets.find(planet => planet.name === 'Earth');
    if (earth) {
        earthCloud.position.x = earth.position.x;
        earthCloud.position.z = earth.position.z;
        earthCloud.position.y = earth.position.y;
        earthCloud.rotation.y += 0.01;
    }

    if (xrFrame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();
        const viewerPose = xrFrame.getViewerPose(referenceSpace);
        if (viewerPose) {
            const position = viewerPose.transform.position;
        }
    }

    renderer.render(scene, camera);
}

function addStars() {
    const particles = 2000;

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    const color = new THREE.Color();

    for (let i = 0; i < particles; i++) {
        const x = THREE.MathUtils.randFloatSpread(4500);
        const y = THREE.MathUtils.randFloatSpread(4500);
        const z = THREE.MathUtils.randFloatSpread(4500);
        positions.push(x, y, z);

        color.set(0xFEFCFF);
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();

    const textureLoader = new THREE.TextureLoader();
    const starTexture = textureLoader.load('/solar-vr/textures/planets/star.png'); // Make sure to replace with the correct path to your star texture

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
}, 5000); 