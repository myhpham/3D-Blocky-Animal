// SHADERS

// Vertex shader program
var VSHADER_SOURCE =
`
	precision mediump float;

	attribute vec4 a_Position;
	uniform mat4 u_ModelMatrix;
	uniform mat4 u_GlobalRotateMatrix;

	void main() {
		gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
	}
 `

// Fragment shader program
var FSHADER_SOURCE =
`
	precision mediump float;

	uniform vec4 u_FragColor;

	void main() {
		gl_FragColor = u_FragColor;
	}
`