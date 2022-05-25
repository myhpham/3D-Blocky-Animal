//Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

// Set up contexts
function setUpWebGL() {
	// Retrieve canvas context
	canvas = document.getElementById('webgl', { alpha:false });
	
	// Retrieve WebGL rendering context
	// Enhance performance of graphics
	gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
	if(!gl) {
		console.log("Failed to get rendering context");
		return;
	}

	// Turn on depth
	gl.enable(gl.DEPTH_TEST);
}

// Connect variables to GLSL
function connectVariableToGLSL() {
	// Initialize shaders (compiles and installs)
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to intialize shaders.');
		return;
	}

	// // Get the storage location of a_Position
	a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}

	// Get the storage location of u_FragColor
	u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
		return;
	}

	u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	if (!u_ModelMatrix) {
		console.log('Failed to get the storage location of u_ModelMatrix');
		return;
	}

	u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
	if(!u_GlobalRotateMatrix) {
		console.log('Failed to get the storage location of u_GlobalRotateMatrix');
		return;
	}

	// Set up initial value for matrix
	var identityM = new Matrix4();
	gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Global UI elements
let g_globalAngle = 0;
let g_neckAngle = 0;
let g_headAngle = 0;
let g_tailAngle = 0;
let g_Animation = true;

// Initialize HTML UI actions
function addActionsforHTMLUI() {
	// Buttons
	document.getElementById('a_On').onclick = function() {g_Animation=true};
	document.getElementById('a_Off').onclick = function() {g_Animation=false};

	// Sliders
	document.getElementById('neckAngle').addEventListener('input', function() { g_neckAngle = this.value; renderAllShapes(); });
	document.getElementById('headAngle').addEventListener('input', function() { g_headAngle = this.value; renderAllShapes(); });
	document.getElementById('angleSlider').addEventListener('input', function() { g_globalAngle = this.value; renderAllShapes(); });
}

function main() {

	setUpWebGL();
	connectVariableToGLSL();
	addActionsforHTMLUI();

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Clear <canvas>
	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//renderAllShapes();

	requestAnimationFrame(tick);
}

// Tick global variables
// Div by 1000 because performance.now return ms
var g_startTime = performance.now()/1000;
var g_seconds = performance.now()/1000 - g_startTime;

// Set  up for tick animation
function tick() {
	// Save current time
	g_seconds = performance.now()/1000 - g_startTime;

	updateAnimationAngles();

	// Draw everything
	renderAllShapes();

	// Tell browser to update again
	requestAnimationFrame(tick);
}

let t_neckTranslate = 0;

function updateAnimationAngles() {
	if(g_Animation) {
		g_neckAngle = (25*Math.sin(g_seconds));
		if(g_neckAngle <= 0){
			g_neckAngle = -1 * g_neckAngle;
		}
		//console.log(g_neckAngle);
		//t_neckTranslate = g_neckAngle/145;
		g_headAngle = (-10*Math.sin(g_seconds));
		if(g_headAngle > 0) {
			g_headAngle = -1 * g_headAngle;
		}
		g_tailAngle = (-45*Math.sin(g_seconds));
	}
}

// Render shapes
function renderAllShapes() {

	// Check time at start of function
	var startTime = performance.now();

	// Pass matrix to global matrix
	var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)

	// Clear <canvas> 
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Body
	var body = new Cube();
	body.color = [0.933, 0.909, 0.909, 1];
	body.matrix.translate(-0.05, -0.3, 0);
	body.matrix.scale(0.9, 0.6, 0.35);
	var bodyCoords = new Matrix4(body.matrix);
	body.render();

	// Spot 1
	var spot1 = new Cube();
	spot1.color = [0.33, 0.296, 0.2, 1];
	spot1.matrix = bodyCoords;
	spot1.matrix.translate(0.4, 0.6, -0.05);
	spot1.matrix.scale(0.2, 0.4, 0);
	spot1.render();

	// Spot 2
	var spot2 = new Cube();
	spot2.color = [0.33, 0.296, 0.2, 1];
	spot2.matrix = bodyCoords;
	spot2.matrix.translate(0.4, 0.5, 0);
	spot2.matrix.scale(1, 0.4, 1);
	spot2.render();

	// Spot 3
	var spot3 = new Cube();
	spot3.color = [0.33, 0.296, 0.2, 1];
	spot3.matrix = bodyCoords;
	spot3.matrix.translate(-1, -3, 0);
	spot3.matrix.scale(0.5, 1, 1);
	spot3.render();

	// Spot 4
	var spot4 = new Cube();
	spot4.color = [0.33, 0.296, 0.2, 1];
	//spot4.matrix = bodyCoords;
	spot4.matrix.translate(0.1, 0, 0.37);
	spot4.matrix.scale(0.3, 0.2, 0);
	var spotCoords = new Matrix4(spot4.matrix);
	spot4.render();

	// Spot 5
	var spot5 = new Cube();
	spot5.color = [0.33, 0.296, 0.2, 1];
	spot5.matrix = spotCoords;
	spot5.matrix.translate(1.2, 1, 0);
	spot5.matrix.scale(0.3, 0.5, 0);
	spot5.render();

	// Spot 6
	var spot6 = new Cube();
	spot6.color = [0.33, 0.296, 0.2, 1];
	spot6.matrix = spotCoords;
	spot6.matrix.translate(0.3, -0.8, 0);
	spot6.matrix.scale(1.5, 1, 1);
	spot6.render();

	// Neck
	var neck = new Cube();
	neck.color = [0.933, 0.909, 0.909, 1];
	t_neckTranslate = g_neckAngle/150;
	//t_neckTranslate = 25*Math.sin(g_seconds)/145;
	neck.matrix.translate(0, -t_neckTranslate, 0);
	neck.matrix.translate(-0.3, 0.023, 0);
	neck.matrix.rotate(-4, 0, 0, 1);
	//neck.matrix.rotate(25*Math.sin(g_seconds), 0, 0, 1);			// Animation
	neck.matrix.rotate(g_neckAngle, 0, 0, 1);						// Animation
	//console.log(g_neckAngle);
	neck.matrix.scale(0.42, 0.3, 0.35);
	var neckCoord = new Matrix4(neck.matrix);
	neck.render();

	// Under neck
	var u_Neck = new Pyramid();
	u_Neck.color = [0.933, 0.909, 0.909, 1];
	u_Neck.matrix = neckCoord;
	u_Neck.matrix.rotate(21.5, 0, 0, 1);
	u_Neck.matrix.scale(1, -1, 1);
	//var wholeNeck = new Matrix4(u_Neck.matrix * neck.matrix);
	u_Neck.render();

	// Head
	var head = new Cube();
	head.color = [0.933, 0.909, 0.909, 1];
	head.matrix = neckCoord;
	head.matrix.translate(0, -1.07, 0);
	/*
	if(g_Animation) {
		head.matrix.rotate(10*Math.sin(g_seconds), 0, 0, 1);
	}
	else {
		head.matrix.rotate(g_headAngle, 0, 0, 1);
	}
	*/
	head.matrix.rotate(-g_headAngle, 0, 0, 1);			// Animation
	//console.log(g_headAngle);
	//head.matrix.rotate(-g_pinkAngle, 0, 0, 1);
	head.matrix.rotate(21, 0, 0, 1);
	head.matrix.scale(0.4, 1, 1);
	head.render();

	// Head hump
	var headHump = new Cube();
	headHump.color = [0.933, 0.909, 0.909, 1];
	headHump.matrix = neckCoord;
	headHump.matrix.translate(0, -0.15, 0.3);
	headHump.matrix.scale(0.4, 1, 0.4);
	headHump.render();

	// Snout 1
	var snout1 = new Pyramid();
	snout1.color = [0.933, 0.909, 0.909, 1];
	snout1.matrix = neckCoord;
	snout1.matrix.translate(0.08, 1.15, -0.67);
	snout1.matrix.scale(1, -1, 1);
	snout1.matrix.rotate(95, 0, 0, 1);
	snout1.matrix.scale(1, 2.3, 2.41);
	//snout1.matrix.rotate(-g_pinkAngle, 0, 0, 1);
	snout1.render();

	// Snout 2
	var snout2 = new Cube();
	snout2.color = [0.933, 0.909, 0.909, 1];
	snout2.matrix = neckCoord;
	snout2.matrix.translate(0.34, -0.14, 0.15);
	snout2.matrix.rotate(21, 0, 0, 1);
	snout2.matrix.scale(0.65, 1, 0.7);
	snout2.render();

	// Upper lip
	var upLip = new Cube();
	upLip.color = [0.933, 0.909, 0.909, 1];
	upLip.matrix = neckCoord;
	upLip.matrix.translate(0.58, 0.86, 0);
	upLip.matrix.rotate(-5, 0, 0, 1);
	upLip.matrix.scale(0.4, 0.3, 1);
	upLip.render();

	// Bottom lip
	var bLip = new Cube();
	bLip.color = [0.933, 0.909, 0.909, 1];
	bLip.matrix = neckCoord;
	bLip.matrix.translate(-1.45, -0.3, 0);
	//bLip.matrix.rotate(, 0, 0, 1);
	bLip.render();

	// Ear 1
	var ear1 = new Cube();
	ear1.color = [0.33, 0.296, 0.2, 1];
	ear1.matrix = neckCoord;
	ear1.matrix.translate(1.6, -3, -0.35);
	ear1.matrix.scale(0.6, 0.6, 0.5);
	ear1.matrix.rotate(-20, 0, 0, 1);
	ear1.matrix.rotate(45, 0, 1, 0);
	ear1.render();

	// Ear 2
	var ear2 = new Cube();
	ear2.color = [0.33, 0.296, 0.2, 1];
	ear2.matrix = neckCoord;
	//ear2.matrix.rotate(90, 0, 0, 1);
	ear2.matrix.translate(1.2, -1, 0.7);
	ear2.matrix.translate(-3.5, 1.5, 1.5);
	ear2.render();

	// Tail
	var tail = new Cube();
	tail.color = [0.33, 0.296, 0.2, 1];
	tail.matrix.translate(0.81, 0.25, 0.152);
	/*
	if(g_Animation) {
		tail.matrix.rotate(20*Math.sin(g_seconds), 1, 0, 0);
	}
	*/
	tail.matrix.rotate(g_tailAngle, 1, 0, 0);
	tail.matrix.rotate(20, 0, 0, 1);
	tail.matrix.scale(1, -1, 1);
	tail.matrix.scale(0.03, 0.4, 0.03);
	//var tailCoord = new Matrix4(tail.matrix);
	tail.render();

	/*
	var grass = new Pyramid();
	grass.color = [0, 1, 0, 1];
	grass.matrix.translate(0, 0.4, 0);
	grass.matrix.scale(0.02, 0.5, 0.02);
	grass.render();
	*/

	// Utters
	var utters = new Cube();
	utters.color = [0.941, 0.752, 0.815, 1];
	utters.matrix.translate(0.4, -0.36, 0.1);
	utters.matrix.scale(0.23, 0.07, 0.15);
	utters.render();


	// Leg 1
	var leg1 = new Cube();
	leg1.color = [0.933, 0.909, 0.909, 1];
	leg1.matrix.translate(-0.05, -0.4, 0);
	//leg1.matrix.rotate(45, 0, 0, 0);
	var leg1Coord = new Matrix4(leg1.matrix);
	leg1.matrix.scale(0.1, 0.3, 0.05);
	leg1.render();

	// Leg 1_1
	var leg1_1 = new Cube();
	leg1_1.color = [0.933, 0.909, 0.909, 1];
	leg1_1.matrix = leg1Coord;
	leg1_1.matrix.translate(0.04, -0.19, 0);
	leg1_1.matrix.rotate(10, 0, 0, 1);
	leg1_1.matrix.scale(0.09, 0.2, 0.05);
	leg1_1.render();

	// Leg 2
	var leg2 = new Cube();
	leg2.color = [0.933, 0.909, 0.909, 1];
	leg2.matrix.translate(-0.05, -0.4, 0.3);
	//leg1.matrix.rotate(45, 0, 0, 0);
	var leg2Coord = new Matrix4(leg2.matrix);
	leg2.matrix.scale(0.1, 0.3, 0.05);
	leg2.render();

	// Leg 2_2
	var leg2_1 = new Cube();
	leg2_1.color = [0.933, 0.909, 0.909, 1];
	leg2_1.matrix = leg2Coord;
	leg2_1.matrix.translate(0.01, -0.19, 0);
	//leg2_1.matrix.rotate(10, 0, 0, 1);
	leg2_1.matrix.scale(0.09, 0.2, 0.05);
	leg2_1.render();

	// Leg 3
	var leg3 = new Cube();
	leg3.color = [0.933, 0.909, 0.909, 1];
	leg3.matrix.translate(0.75, -0.4, 0);
	//leg1.matrix.rotate(45, 0, 0, 0);
	var leg3Coord = new Matrix4(leg3.matrix);
	leg3.matrix.scale(0.1, 0.3, 0.05);
	leg3.render();

	// Leg 3_1
	var leg3_1 = new Cube();
	leg3_1.color = [0.933, 0.909, 0.909, 1];
	leg3_1.matrix = leg3Coord;
	leg3_1.matrix.translate(0.01, -0.19, 0);
	//leg3_3.matrix.rotate(10, 0, 0, 1);
	leg3_1.matrix.scale(0.09, 0.2, 0.05);
	leg3_1.render();

	// Leg 4
	var leg4 = new Cube();
	leg4.color = [0.933, 0.909, 0.909, 1];
	leg4.matrix.translate(0.75, -0.4, 0.3);
	//leg1.matrix.rotate(45, 0, 0, 0);
	var leg4Coord = new Matrix4(leg4.matrix);
	leg4.matrix.scale(0.1, 0.3, 0.05);
	leg4.render();

	// Leg 4_1
	var leg4_1 = new Cube();
	leg4_1.color = [0.933, 0.909, 0.909, 1];
	leg4_1.matrix = leg4Coord;
	leg4_1.matrix.translate(0.04, -0.19, 0);
	leg4_1.matrix.rotate(10, 0, 0, 1);
	leg4_1.matrix.scale(0.09, 0.2, 0.05);
	leg4_1.render();

	/*	
	//red box
	var body = new Cube();
	body.color = [1.0, 0.0, 0.0, 1.0];
	body.matrix.translate(-0.25, -0.25, 0.0);
	body.matrix.rotate(g_redAngle, 0, 0, 1);
	//body.matrix.rotate(45*Math.sin(g_seconds), 0, 0, 1);			// Animation
	var bodyCoordinatesMatrix = new Matrix4(body.matrix);
	body.matrix.scale(0.5, 1, 0.5);
	body.render();

	//pink box
	var leftArm = new Cube();
	leftArm.matrix = bodyCoordinatesMatrix;
	leftArm.color = [1.0, 0.0, 1, 1.0];
	leftArm.matrix.translate(0.5, 0, 0)
	leftArm.matrix.rotate(g_pinkAngle, 1, 0, 0);
	leftArm.matrix.scale(0.25, 0.5, 0.25);
	leftArm.render();

	//yellow box
	var bottomCube = new Cube();
	bottomCube.color = [1.0, 1.0, 0.0, 1.0];
	bottomCube.matrix.rotate(90, 1, 0, 0);
	bottomCube.matrix.rotate(90, 0, 0, 1);
	bottomCube.matrix.scale(0.25, 1, 0.25);
	bottomCube.matrix.translate(-1, -0.5, 0.5);
	bottomCube.render();
	*/
}


