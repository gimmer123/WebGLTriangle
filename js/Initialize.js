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
  CreateGeometryUI();

  CreateVBO(program, new Float32Array(vertices));

  matXGL = gl.getUniformLocation(program, "rotationX");
  matYGL = gl.getUniformLocation(program, "rotationY");
  proGL = gl.getUniformLocation(program, "Projection");
  modGL = gl.getUniformLocation(program, "ModelView");
  modifierGL = gl.getUniformLocation(program, "Modifier");
  CreateTexture(program, "img/textureCheck.jpg");

  gl.useProgram(program);

  gl.uniformMatrix4fv(matXGL, false, new Float32Array(rotationX));
  gl.uniformMatrix4fv(matYGL, false, new Float32Array(rotationY));
  gl.uniformMatrix4fv(modifierGL, false, new Float32Array(modifier));

  gl.uniform4fv(displayGL, new Float32Array(display));

  Render();
}

function CreateVBO(program, vertices) {
  let vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const stride = 11 * Float32Array.BYTES_PER_ELEMENT;

  let position = gl.getAttribLocation(program, "Pos");
  gl.vertexAttribPointer(position, 3, gl.FLOAT, gl.FALSE, stride, 0);
  gl.enableVertexAttribArray(position);

  const colorOffset = 3 * Float32Array.BYTES_PER_ELEMENT;
  let color = gl.getAttribLocation(program, "Color");
  gl.vertexAttribPointer(color, 3, gl.FLOAT, gl.FALSE, stride, colorOffset);
  gl.enableVertexAttribArray(color);

  const uvOffset = colorOffset * 2;
  let uv = gl.getAttribLocation(program, "UV");
  gl.vertexAttribPointer(uv, 2, gl.FLOAT, gl.FALSE, stride, uvOffset);
  gl.enableVertexAttribArray(uv);

  const normalOffset = 8 * Float32Array.BYTES_PER_ELEMENT;
  let normal = gl.getAttribLocation(program, "Normal");
  gl.vertexAttribPointer(normal, 3, gl.FLOAT, gl.FALSE, stride, normalOffset);
  gl.enableVertexAttribArray(normal);
}
