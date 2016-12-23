let canvas = document.getElementById('canvas');

let DEFAULT_SETTINGS = {
    HEIGHT: window.innerHeight,
    WIDTH: window.innerWidth,
    FOV: 50, /* Camera frustum vertical field of view (degrees) */
    ASPECT_RATIO: this.WIDTH / this.HEIGHT,
    NEAR: 0.1, /* Camera frustum near plane (degrees)*/
    FAR: 1000, /* Camera frustum far plane (degrees)*/
    cameraX: -35,
    cameraY: 17,
    cameraZ: 70 
};

const {HEIGHT, WIDTH, FOV, ASPECT_RATIO, NEAR, FAR, 
       cameraX, cameraY, cameraZ} = DEFAULT_SETTINGS;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, NEAR, FAR);
camera.position.x = cameraX;
camera.position.y = cameraY;
camera.position.z = cameraZ;
camera.lookAt(scene.position);

let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xffffff));
renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMap.enabled = true;

let spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-30, 20, 0);
spotLight.castShadow = true;
scene.add(spotLight);

let cameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
let axisHelper = new THREE.AxisHelper(20);

let PlaneGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
let PlaneMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
let plane = new THREE.Mesh(PlaneGeometry, PlaneMaterial);
plane.receiveShadow = true;
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 15;
plane.position.y = 0;
plane.position.z = 0;

const OrbitControls = new THREE.OrbitControls(camera);


// CONTROLS ===============================================================

const controls = new function() {
    this.numberOfObjects = scene.children.length;
    this.showAxes = true;
    this.showPlane = true;
    this.showCamera = true;

    this.resetCamera = function () {
       camera.position.x = cameraX;
       camera.position.y = cameraY;
       camera.position.z = cameraZ;
    };

    this.outputObjects = function() {
        console.log(scene.children);
    };
}

let gui = new dat.GUI;
gui.add(controls, 'showAxes').listen();
gui.add(controls, 'showPlane').listen();
gui.add(controls, 'showCamera').listen();
gui.add(controls, 'outputObjects');
gui.add(controls, 'resetCamera');

// ===============================================================

canvas.appendChild(renderer.domElement);
const stats = initStats();
render();

function initStats() {
    let statsContainer = document.getElementById('stats');
    let stats = new Stats();
    stats.showPanel(0);
    statsContainer.appendChild(stats.domElement);
    return stats;
}

function render() {
    controls.showAxes ? scene.add(axisHelper) : scene.remove(axisHelper);
    controls.showPlane ? scene.add(plane) : scene.remove(plane);
    controls.showCamera ? scene.add(cameraHelper) : scene.remove(cameraHelper);

    OrbitControls.update();
    stats.begin();
    stats.end();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize, false);