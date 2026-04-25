/** @type {WebGL2RenderingContext} */
var gl =
  document.getElementById("glCanvas").getContext("webgl") ||
  document.getElementById("glCanvas").getContext("experimental-webgl");

var vertices = [];
var mouseX = 0,
  mouseY = 0;
var angle = [0.0, 0.0, 0.0, 1.0];
var angleGL = 0;

document.getElementById("glCanvas").addEventListener("mousemove", function (e) {
  if (e.buttons == 1) {
    angle[0] -= (mouseY - e.y) * 0.1;
    angle[1] += (mouseX - e.x) * 0.1;
    gl.uniform4fv(angleGL, new Float32Array(angle));
    Render();
  }
  mouseX = e.x;
  mouseY = e.y;
});

function InitWebGL() {
  if (!gl) {
    alert("WebGL is not supported");
    return;
  }
  let canvas = document.getElementById("glCanvas");
  if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  InitViewport();
}

function InitViewport() {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.0, 0.4, 0.6, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  InitShaders();
}

function InitShaders() {
  const vertexShader = InitVertexShader();
  const fragmentShader = InitFragmentShader();

  let program = InitShaderProgram(vertexShader, fragmentShader);

  if (!ValidateShaderProgram(program)) {
    return false;
  }

  return CreateGeometryBuffers(program);
}

function InitVertexShader() {
  let element = document.getElementById("vertexShader");
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, element.value);
  gl.compileShader(vertexShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    let error = gl.getShaderInfoLog(vertexShader);
    console.error("Failed to initialize vertex shader: ", error);
    return;
  }
  return vertexShader;
}

function InitFragmentShader() {
  let element = document.getElementById("fragmentShader");
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, element.value);
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    let error = gl.getShaderInfoLog(fragmentShader);
    console.error("Failed to initialize fragment shader: ", error);
    return;
  }
  return fragmentShader;
}

function InitShaderProgram(vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    let error = getProgramInfoLog(program);
    console.error("Failed to link program: ", error);
    return;
  }
  return program;
}

function ValidateShaderProgram(program) {
  gl.validateProgram(program);

  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    let error = gl.getProgramInfoLog(program);
    alert("Errors found validating shader program: ", error);
    return false;
  }
  return true;
}

function CreateGeometryUI() {
  const widthElement = document.getElementById("width");
  const width = widthElement ? widthElement.value : 1.0;
  const heightElement = document.getElementById("height");
  const height = heightElement ? heightElement.value : 1.0;
  const depthElement = document.getElementById("depth");
  const depth = depthElement ? depthElement.value : 1.0;

  document.getElementById("ui").innerHTML =
    'Width: <input type="number" id="width" value="' +
    width +
    '" onchange="InitShaders();"><br>' +
    'Height: <input type="number" id="height" value="' +
    height +
    '" onchange="InitShaders();"><br>' +
    'Depth: <input type="number" id="depth" value="' +
    depth +
    '" onchange="InitShaders();">';

  let selection = document.getElementById("shape");
  switch (selection.selectedIndex) {
    case 0:
      CreateTriangle(width, height);
      break;
    case 1:
      CreateQuad(width, height);
      break;
    case 2:
      CreateBox(width, height, depth);
  }
}

function CreateGeometryBuffers(program) {
  CreateGeometryUI();

  CreateVBO(program, new Float32Array(vertices));

  angleGL = gl.getUniformLocation(program, "Angle");

  gl.useProgram(program);

  Render();
}

function CreateVBO(program, vertices) {
  let vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const vertSize = 6 * Float32Array.BYTES_PER_ELEMENT;

  let position = gl.getAttribLocation(program, "Pos");
  gl.vertexAttribPointer(position, 3, gl.FLOAT, gl.FALSE, vertSize, 0);
  gl.enableVertexAttribArray(position);

  const colorStart = 3 * Float32Array.BYTES_PER_ELEMENT;
  let color = gl.getAttribLocation(program, "Color");
  gl.vertexAttribPointer(color, 3, gl.FLOAT, gl.FALSE, vertSize, colorStart);
  gl.enableVertexAttribArray(color);
}

function Render() {
  gl.clearColor(0.0, 0.4, 0.6, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 6);
}

function AddVertex(x, y, z, r, g, b) {
  const index = vertices.length;
  vertices.length += 6;
  vertices[index + 0] = x;
  vertices[index + 1] = y;
  vertices[index + 2] = z;
  vertices[index + 3] = r;
  vertices[index + 4] = g;
  vertices[index + 5] = b;
}

function AddTriangle(x1, y1, z1, r1, g1, b1, x2, y2, z2, r2, g2, b2, x3, y3, z3, r3, g3, b3) {
  AddVertex(x1, y1, z1, r1, g1, b1);
  AddVertex(x2, y2, z2, r2, g2, b2);
  AddVertex(x3, y3, z3, r3, g3, b3);
}

function AddQuad(x1, y1, z1, r1, g1, b1, x2, y2, z2, r2, g2, b2, x3, y3, z3, r3, g3, b3, x4, y4, z4, r4, g4, b4) {
  AddTriangle(x1, y1, z1, r1, g1, b1, x2, y2, z2, r2, g2, b2, x3, y3, z3, r3, g3, b3);
  AddTriangle(x3, y3, z3, r3, g3, b3, x4, y4, z4, r4, g4, b4, x1, y1, z1, r1, g1, b1);
}

function CreateTriangle(width, height) {
  vertices.length = 0;
  const w = width * 0.5;
  const h = height * 0.5;
  AddTriangle(0.0, h, 0.0, 1.0, 0.0, 0.0, -w, -h, 0.0, 0.0, 1.0, 0.0, w, -h, 0.0, 0.0, 0.0);
}

function CreateQuad(width, height) {
  vertices.length = 0;
  const w = width * 0.5;
  const h = height * 0.5;
  AddQuad(-w, h, 0.0, 1.0, 0.0, 0.0, -w, -h, 0.0, 0.0, 1.0, 0.0, w, -h, 0.0, 0.0, 0.0, 1.0, w, h, 0.0, 1.0, 1.0, 0.0);
}

function CreateBox(width, height, depth) {
  vertices.length = 0;
  const w = width * 0.5;
  const h = height * 0.5;
  const d = depth * 0.5;
  AddQuad(-w, h, -d, 1.0, 0.0, 0.0, -w, -h, -d, 0.0, 1.0, 0.0, w, -h, -d, 0.0, 0.0, 1.0, w, h, -d, 1.0, 1.0, 0.0);
  AddQuad(-w, -h, d, 1.0, 0.0, 0.0, -w, h, d, 0.0, 1.0, 0.0, w, h, d, 0.0, 0.0, 1.0, w, -h, d, 1.0, 1.0, 0.0);
  AddQuad(-w, h, d, 1.0, 0.0, 0.0, -w, h, -d, 0.0, 1.0, 0.0, w, h, -d, 0.0, 0.0, 1.0, w, h, d, 1.0, 1.0, 0.0);
  AddQuad(-w, h, d, 1.0, 0.0, 0.0, -w, h, -d, 0.0, 1.0, 0.0, w, h, -d, 0.0, 0.0, 1.0, w, h, d, 1.0, 1.0, 0.0);
  AddQuad(w, -h, d, 1.0, 0.0, 0.0, w, -h, -d, 0.0, 1.0, 0.0, -w, -h, -d, 0.0, 0.0, 1.0, -w, -h, d, 1.0, 1.0, 0.0);
  AddQuad(-w, h, d, 1.0, 0.0, 0.0, -w, -h, d, 0.0, 1.0, 0.0, -w, -h, -d, 0.0, 0.0, 1.0, -w, h, -d, 1.0, 1.0, 0.0);
  AddQuad(w, -h, d, 1.0, 0.0, 0.0, w, h, d, 0.0, 1.0, 0.0, w, h, -d, 0.0, 0.0, 1.0, w, -h, -d, 1.0, 1.0, 0.0);
}
