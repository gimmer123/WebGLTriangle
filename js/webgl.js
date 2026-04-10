var gl =
  document.getElementById("glCanvas").getContext("webgl") ||
  document.getElementById("glCanvas").getContext("experimental-webgl");

function InitWebGL() {
  if (!gl) {
    alert("WebGL is not supported");
    return;
  }
  let canvas = document.getElementById("glCanvas");
  if (
    canvas.width != canvas.clientWidth ||
    canvas.height != canvas.clientHeight
  ) {
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

function CreateGeometryBuffers(program) {
  const vertices = [
    0.0, 0.5, 0.0, 1.0, 0.0, 0.0, -0.5, -0.5, 0.0, 0.0, 1.0, 0.0, 0.5, -0.5,
    0.0, 0.0, 0.0, 1.0,
  ];

  CreateVBO(program, new Float32Array(vertices));

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
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
