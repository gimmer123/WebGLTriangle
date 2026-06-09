/** @type {WebGL2RenderingContext} */
var gl =
  document.getElementById("glCanvas").getContext("webgl") ||
  document.getElementById("glCanvas").getContext("experimental-webgl");

var vertices = [];

var matXGL = 0;
var matYGL = 0;

var modifierGL = 0;
var modifier;
var bend;

//prettier-ignore
var nullModifier = [1.0, 0.0, 0.0, 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    0.0, 0.0, 0.0, 1.0
];

var textureGL = 0;
var display = [0.0, 0.0, 0.0, 0.0];
var displayGL = 0;
var proGL = 0;
// prettier-ignore
var projection = [0.0, 0.0, 0.0, 0.0,
                  0.0, 0.0, 0.0, 0.0,
                  0.0, 0.0, 0.0, 0.0,
                  0.0, 0.0, 0.0, 0.0
]

var modGL = 0;

// prettier-ignore
var modelView = [1.0, 0.0, 0.0, 0.0,
                 0.0, 1.0, 0.0, 0.0,
                 0.0, 0.0, 1.0, 0.0,
                 0.0, 0.0, -1.2,1.0,
];

function Update() {
  const textureCheck = document.getElementById("t");
  display[3] = textureCheck.checked ? 1.0 : 0.0;

  const lightColor = document.getElementById("light").value;
  display[0] = parseInt(lightColor.substring(1, 3), 16) / 255.0;
  display[1] = parseInt(lightColor.substring(3, 5), 16) / 255.0;
  display[2] = parseInt(lightColor.substring(5, 7), 16) / 255.0;

  gl.uniform4fv(displayGL, new Float32Array(display));
  Render();
}

function Render() {
  gl.clearColor(0.0, 0.4, 0.6, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const zoom = document.getElementById("zoom").value;
  modelView[14] = -zoom;
  const fov = document.getElementById("fov").value;
  const aspect = gl.canvas.width / gl.canvas.height;
  Perspective(fov, aspect, 1.0, 2000.0);

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 11);
}

function AddVertex(x, y, z, r, g, b, u, v, nx, ny, nz) {
  const index = vertices.length;
  vertices.length += 11;
  vertices[index + 0] = x;
  vertices[index + 1] = y;
  vertices[index + 2] = z;
  vertices[index + 3] = r;
  vertices[index + 4] = g;
  vertices[index + 5] = b;
  vertices[index + 6] = u;
  vertices[index + 7] = v;
  vertices[index + 8] = nx;
  vertices[index + 9] = ny;
  vertices[index + 10] = nz;
}

function IsPow2(value) {
  return (value & (value - 1)) === 0;
}

function radian(degrees) {
  return Math.PI / 180;
}

function Perspective(fovy, aspect, near, far) {
  projection.fill(0);
  const f = Math.tan((fovy * Math.PI) / 360.0);
  projection[0] = f / aspect;
  projection[5] = f;
  projection[10] = (far + near) / (near - far);
  projection[11] = (2 * far * near) / (near - far);
  projection[14] = -1;
  gl.uniformMatrix4fv(proGL, false, new Float32Array(projection));
  gl.uniformMatrix4fv(modGL, false, new Float32Array(modelView));
}
