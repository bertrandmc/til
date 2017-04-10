////////////////////////////////////////////////////////////////////////////////
// Staircase exercise                                                         //
// Your task is to complete the model for simple stairs                       //
// Using the provided sizes and colors, complete the staircase                //
// and reach the Gold Cup!                                                    //
////////////////////////////////////////////////////////////////////////////////
/*global, THREE, Coordinates, $, document, window, dat*/

var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var gridX = false;
var gridY = false;
var gridZ = false;
var axes = false;
var ground = true;

function createStairs() {

	// MATERIALS
	var stepMaterialVertical = new THREE.MeshLambertMaterial( {
		color: 0xA85F35
	} );
	var stepMaterialHorizontal = new THREE.MeshLambertMaterial( {
		color: 0xBC7349
	} );

	var stepWidth = 500;
	var stepSize = 200;
	var stepThickness = 50;
    // height from top of one step to bottom of next step up
	var verticalStepHeight = stepSize;
	var horizontalStepDepth = stepSize*2;
    var stepHalfThickness = stepThickness/2;

	for(var level = 0; level < 6; level++) {
        createVerticalStep(level);
        createHorizontalStep(level);
    }

    function createHorizontalStep(level) {
        var stepHorizontal = new THREE.CubeGeometry(stepWidth, stepThickness, horizontalStepDepth);
    	var stepMesh = new THREE.Mesh( stepHorizontal, stepMaterialHorizontal );

        // position first step
        var firstStepZPosition = horizontalStepDepth / 2 - stepHalfThickness;
        // for each level push step forward
        var levelZPosition = level * (horizontalStepDepth - stepThickness);

        // position first tep above vertical step
        var firstStepYPosition =  verticalStepHeight + stepHalfThickness;
        // for each level push step up
        var levelYPosition = level * (verticalStepHeight + stepThickness);

    	stepMesh.position.x = 0;
    	stepMesh.position.y = firstStepYPosition + levelYPosition;
    	stepMesh.position.z = firstStepZPosition + levelZPosition;
    	scene.add( stepMesh );
    }

    function createVerticalStep(level) {
        var stepVertical = new THREE.CubeGeometry(stepWidth, verticalStepHeight, stepThickness);
    	var stepMesh = new THREE.Mesh( stepVertical, stepMaterialVertical );

        // half of height is ground position
        var groundPosition = verticalStepHeight/2;
        var levelIncrease = level * (verticalStepHeight + stepThickness);

        stepMesh.position.x = 0;
        stepMesh.position.y = groundPosition + levelIncrease;
        stepMesh.position.z = level * (horizontalStepDepth - stepThickness);
        scene.add( stepMesh );
    }
}

function createCup() {
	var cupMaterial = new THREE.MeshLambertMaterial( { color: 0xFDD017});
	// THREE.CylinderGeometry takes (radiusTop, radiusBottom, height, segmentsRadius)
	var cupGeo = new THREE.CylinderGeometry( 200, 50, 400, 32 );
	var cup = new THREE.Mesh( cupGeo, cupMaterial );
	cup.position.x = 0;
	cup.position.y = 1725;
	cup.position.z = 1925;
	scene.add( cup );
	cupGeo = new THREE.CylinderGeometry( 100, 100, 50, 32 );
	cup = new THREE.Mesh( cupGeo, cupMaterial );
	cup.position.x = 0;
	cup.position.y = 1525;
	cup.position.z = 1925;
	scene.add( cup );
}

function init() {
	var canvasWidth = 846;
	var canvasHeight = 494;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 40000 );
	camera.position.set( -2700, 500, -600 );

    // Camera(2) for testing has following values:
    // camera.position.set( 1225, 2113, 1814 );
    // cameraControls.target.set(-1800,180,630);

	// CONTROLS
	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
	cameraControls.target.set(0,600,0);

	fillScene();
}

function addToDOM() {
    var container = document.getElementById('container');
    container.appendChild( renderer.domElement );
}


function fillScene() {
	// SCENE
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x808080, 3000, 6000 );

	// LIGHTS
	var ambientLight = new THREE.AmbientLight( 0x222222 );
	var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
	light.position.set( 200, 400, 500 );

	var light2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
	light2.position.set( -400, 200, -300 );

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);
	scene.add(camera)
	createCup();
	var stairs = createStairs();
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
	renderer.render(scene, camera);
}

try {
  init();
  addToDOM();
  animate();
} catch(e) {
    var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
    $('#container').append(errorReport+e);
}
