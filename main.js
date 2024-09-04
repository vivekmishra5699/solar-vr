// Import necessary modules from Three.js and additional controls and VR button from the examples
import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/webxr/VRButton.js';

// Set up the canvas and renderer
const canvas = document.getElementById("bg");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Set up the camera and scene
const camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 5000);
const scene = new THREE.Scene();

// Set up orbit controls for the camera
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableZoom = true;
orbit.zoomSpeed = 0.8;
const minZoom = 0; 
const maxZoom = 1200; 
orbit.minDistance = minZoom;
orbit.maxDistance = maxZoom;

// Enable shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Set the camera position
camera.position.set(50, 35, 55);
orbit.update();

// Create a camera rig and add the camera to it
const cameraRig = new THREE.Group();
cameraRig.add(camera);
scene.add(cameraRig);

// Add lighting to the scene
const sunLight = new THREE.PointLight(0xFFFFFF,1);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x757575, 1);
scene.add(ambientLight);

// Load background texture and create a large sphere for the background
const textureLoader = new THREE.TextureLoader();
const spaceTexture = textureLoader.load('textures/galaxy.webp');
const backgroundGeometry = new THREE.SphereGeometry(3000, 164, 164);
const backgroundMaterial = new THREE.MeshBasicMaterial({
    map: spaceTexture,
    side: THREE.BackSide
});
const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
backgroundMesh.rotation.x = Math.PI / 2.67; 
scene.add(backgroundMesh);

// Load textures for the sun and planets
const textures = {
    sun: {
        colorMap: textureLoader.load('textures/sun/8k_sun.jpg'),
        normalMap: textureLoader.load('textures/planet/mercury/Normal.jpg'),
        specularMap: textureLoader.load('textures/sun/sun_detailed.jpg'),
        displacementMap: textureLoader.load('textures/sun/sun-alpha-2k.jpg')
    },
    mercury: {
       normalMap: textureLoader.load('textures/planets/mercury/Normal.jpg'),
        colorMap: textureLoader.load('textures/planets/mercury/Mercury_Bump.jpg'),
    },
    venus: {
        colorMap: textureLoader.load('textures/planets/venus/venus.jpg'),
    },
    earth: {
        colorMap: textureLoader.load('textures/planets/earth/earth.jpg'),
        normalMap: textureLoader.load('textures/planets/earth/earth_normal.jpg'),
        specularMap: textureLoader.load('textures/planets/earth/earth_specular.jpg'),
        displacementMap: textureLoader.load('textures/planets/earth/earthbump (2).jpg')
    },
    mars: {
        colorMap: textureLoader.load('textures/planets/mars/mars.jpg'),
        normalMap: textureLoader.load('textures/planets/mars/Mars_Normal.jpg'),
    },
    jupiter: {
        colorMap: textureLoader.load('textures/planets/jupiter/Jupiter_Map.jpg'),
        normalMap: textureLoader.load('textures/planets/jupiter/Jupiter_Normal.jpg'),
    },
    saturn: {
        colorMap: textureLoader.load('textures/planets/saturn/Saturn_Map.jpg'),
        normalMap: textureLoader.load('textures/planets/saturn/Saturn_Normal.jpg')
    },
    saturnRings: {
        colorMap: textureLoader.load('textures/planets/saturn/ring.jpeg'),
        alphaMap: textureLoader.load('textures/planets/saturn/saturn_ring.png')
    },
    uranus: {
        colorMap: textureLoader.load('textures/planets/uranus/Uranus-0.jpg'),
        normalMap: textureLoader.load('textures/planets/uranus/Uranus_Normal.jpg')
    },
    neptune:{
        colorMap: textureLoader.load('textures/planets/neptune/Neptune.jpg'),
        normalMap: textureLoader.load('textures/planets//neptune/Neptune_Normal.jpg')
    }
};

// Create the sun mesh
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

// Function to create planets with specific attributes
function createPlanet(radius, maps, distanceFromSun, orbitalSpeed, name) {
    const planetGeometry = new THREE.SphereGeometry(radius, 64, 64);
    const planetMaterial = new THREE.MeshPhongMaterial({
        map: maps.colorMap,
        displacementScale : 0.65
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

    // Create orbit line for the planet
    const orbitLineGeometry = new THREE.BufferGeometry();
    const orbitLineMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
    const orbitPoints = [];
    const segments = 100; // Reduced number of segments
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = distanceFromSun * Math.cos(theta);
        const z = distanceFromSun * Math.sin(theta);
        orbitPoints.push(x, 0, z);
    }
    orbitLineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
    const orbitLine = new THREE.Line(orbitLineGeometry, orbitLineMaterial);
    scene.add(orbitLine);

    return planet;
}

// Create and add clouds around the Earth
const cloudpic = textureLoader.load('textures/planets/earth/Cloud_Map.jpg');
const clouds = new THREE.SphereGeometry(16.2, 64, 64);
const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudpic,
    transparent: true,
    opacity:0.3
});
const earthCloud = new THREE.Mesh(clouds, cloudMaterial);
scene.add(earthCloud);

// Data for the planets in the solar system
const planetsData = [
    [6, textures.mercury, 105, 0.04, 'Mercury'],
    [10, textures.venus, 160, 0.015, 'Venus'],
    [16, textures.earth, 220, 0.033, 'Earth'],
    [7, textures.mars, 300, 0.028, 'Mars'],
    [20, textures.jupiter, 500, 0.015, 'Jupiter'],
    [8, textures.saturn, 800, 0.0095, 'Saturn'],
    [13, textures.uranus, 1100, 0.01, 'Uranus'],
    [13, textures.neptune, 1400, 0.009, 'Neptune']
];

// Create the planets and store them in an array
const planets = planetsData.map(data => createPlanet(data[0], data[1], data[2], data[3], data[4]));

// Function to create Saturn's rings
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

// Ensure Saturn is added to the scene and add its rings
const saturn = planets.find(planet => planet.name === 'Saturn');
if (saturn) {
    const saturnRings = createSaturnRings(
        13, 
        23, 
        textures.saturnRings.colorMap, 
        textures.saturnRings.alphaMap 
    );
    saturn.add(saturnRings);
    console.log('Saturn rings added:', saturnRings);
} else {
    console.error('Saturn not found in planets array');
}

// Function to add particles to Saturn's rings
function addSaturnRingParticles() {
    const particles = 10000; 

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    const yellowColor = new THREE.Color(0xd8ae6d); 

    for (let i = 0; i < particles; i++) {
        const theta = Math.random() * Math.PI * 2;
        const radius = THREE.MathUtils.randFloat(22, 35);
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        const y = THREE.MathUtils.randFloatSpread(0.5);
        positions.push(x, y, z);
        colors.push(yellowColor.r, yellowColor.g, yellowColor.b); 
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

// Set the animation loop
renderer.setAnimationLoop(animate);
planets.forEach(planet => {
    planet.castShadow = true;
    planet.receiveShadow = true;
});

// Add an event listener to handle window resize
window.addEventListener('resize', onWindowResize);

// Main animation loop
function animate(time, xrFrame) {
    sun.rotation.y += 0.005;
    planets.forEach(planet => {
        if (planet.rotating !== false) {
            const angle = planet.orbitalSpeed * Date.now() * 0.004;
            planet.position.x = Math.cos(angle) * planet.distanceFromSun;
            planet.position.z = Math.sin(angle) * planet.distanceFromSun;
            planet.rotation.y += 0.1;
            earthCloud.rotation.y += 0.01;
        }
    });

    const earth = planets.find(planet => planet.name === 'Earth');
    if (earth) {
        earthCloud.position.x = earth.position.x;
        earthCloud.position.z = earth.position.z;
        earthCloud.position.y = earth.position.y;
    }

    if (xrFrame) {
        window.location.href = 'vr-mode/vr.html';
    }

    renderer.render(scene, camera);
}

// Add VR button to the document
document.body.appendChild(VRButton.createButton(renderer));

// Update camera aspect ratio and renderer size on window resize
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle clicks on planets and open their respective info pages
function onClick(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const objectsToIntersect = [...planets];
    if (saturn) {
        objectsToIntersect.push(saturn);
        if (saturn.rings) objectsToIntersect.push(saturn.rings);
        if (saturn.ringParticles) objectsToIntersect.push(saturn.ringParticles);
    }

    const intersects = raycaster.intersectObjects(objectsToIntersect, true);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.name === 'Saturn' || object === saturn.rings || object === saturn.ringParticles) {
            const url = `planet_info/saturn/saturn.html`;
            window.open(url, '_blank');
        } else {
            const planet = intersects[0].object;
            const planetName = planet.name.toLowerCase();
            const url = `planet_info/${planetName}/${planetName}.html`;
            window.open(url, '_blank');
        }
    }
}

// Add click event listener to the window
window.addEventListener('click', onClick, false);

// Function to add stars to the background
function addStars() {
    const particles = 20000;

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
    const starTexture = textureLoader.load('/textures/planets/star.png'); 

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

    // Animate the stars
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
// Add stars to the scene
addStars();
export { planets };
