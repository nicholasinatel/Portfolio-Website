if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}

var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight,
    r = 450,
    mouseY = 0,
    windowHalfY = window.innerHeight / 2,
    camera, scene, renderer, canvas;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 3000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    var i, line, material, p,
        parameters = [
            [0.1, 0x8905D2, 0.1],
            [0.1, 0x6249EE, 0.1],
            [0.1, 0x8B40ED, 0.1],
            [0.1, 0x466DED, 0.1],
            [0.1, 0x7070F2, 0.1],
            [0.1, 0x2B0CD5, 0.1],
            [0.1, 0x7070F2, 0.1],
            [0.1, 0x214FE6, 0.1],
            [0.1, 0x5F08D3, 0.1]
        ];

    var geometry = createGeometry();

    canvas = document.getElementById('canvas');
    

    for (i = 0; i < parameters.length; ++i) {

        p = parameters[i];

        material = new THREE.LineBasicMaterial({
            color: p[1],
            opacity: p[2]
        });

        line = new THREE.LineSegments(geometry, material);
        line.scale.x = line.scale.y = line.scale.z = p[0]++;
        line.userData.originalScale = p[0];
        line.rotation.y = Math.random() * Math.PI;
        line.updateMatrix();
        scene.add(line);
    }

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });



    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    console.log("Over  here");
    console.log(renderer.domElement);
    document.body.appendChild(renderer.domElement);
    // $("body").appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    window.addEventListener('resize', onWindowResize, false);

    // test geometry swapability
    setInterval(function () {
        var geometry = createGeometry();
        scene.traverse(function (object) {

            if (object.isLine) {
                object.geometry.dispose();
                object.geometry = geometry;
            }
        });
    }, 100000); // This was making the code go stuck
}

function createGeometry() {

    var geometry = new THREE.BufferGeometry();
    var vertices = [];

    var vertex = new THREE.Vector3();

    for (var i = 0; i < 1500; i++) {

        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.normalize();
        vertex.multiplyScalar(r);

        vertices.push(vertex.x, vertex.y, vertex.z);

        vertex.multiplyScalar(Math.random() * 0.01 + 1);

        vertices.push(vertex.x, vertex.y, vertex.z);
    }
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    return geometry;
}

function onWindowResize() {

    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {
    if (event.touches.length > 1) {

        event.preventDefault();

        mouseY = event.touches[0].pageY - windowHalfY;

    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}
//
function animate() {

    requestAnimationFrame(animate);

    render();

}

function updateSize() {
    // var width = canvas.clientWidth;
    // var height = canvas.clientHeight;
    
    // if (canvas.width !== width || canvas.height != height) {

    //     renderer.setSize(width, height, false);

    // }
}
//
var rpmY = 7;
var rpmX = 2;

function render() {

    updateSize();
    renderer.render(scene, camera);

    var time = Date.now() * 0.00005;

    for (var i = 0; i < scene.children.length; i += 1) {
        var object = scene.children[i];
        if (object.isLine) {
            object.rotation.y = rpmY * (time * (i < 4 ? (i + 1) : -(i + 1)));
            object.rotation.x = rpmX * (time * (i < 4 ? (i + 1) : -(i + 1)));
            if (i < 9) {
                var scale = object.userData.originalScale * (i / 5 + 0.1) * (1 + 20 * Math.sin(2 * time));
                object.scale.x = object.scale.y = object.scale.z = scale;
            }
        }
    }
}
