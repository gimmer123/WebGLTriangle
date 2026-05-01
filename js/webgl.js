/** @type {WebGL2RenderingContext} */
var gl =
  document.getElementById("glCanvas").getContext("webgl") ||
  document.getElementById("glCanvas").getContext("experimental-webgl");

var vertices = [];
var mouseX = 0,
  mouseY = 0;
var angle = [0.0, 0.0, 0.0, 1.0];
var angleGL = 0;
var textureGL = 0;
var display = [0.0, 0.0, 0.0, 0.0];
var displayGL = 0;

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

function CreateGeometryUI() {
  const widthElement = document.getElementById("width");
  const width = widthElement ? widthElement.value : 1.0;
  const heightElement = document.getElementById("height");
  const height = heightElement ? heightElement.value : 1.0;
  const depthElement = document.getElementById("depth");
  const depth = depthElement ? depthElement.value : 1.0;
  const divsXElement = document.getElementById("divsX");
  const divsX = divsXElement ? divsXElement.value : 0.0;
  const divsYElement = document.getElementById("divsY");
  const divsY = divsYElement ? divsYElement.value : 0.0;
  const sectorCountElement = document.getElementById("sc");
  const scValue = sectorCountElement ? sectorCountElement.value : 2.0;
  const radiusElement = document.getElementById("radius");
  const radiusValue = radiusElement ? radiusElement.value : 0.5;

  document.getElementById("ui").innerHTML =
    'Width: <input type="number" id="width" value="' +
    width +
    '" onchange="InitShaders();"><br>' +
    'Height: <input type="number" id="height" value="' +
    height +
    '" onchange="InitShaders();"><br>' +
    'Depth: <input type="number" id="depth" value="' +
    depth +
    '" onchange="InitShaders();"><br>' +
    'Divs X: <input type="number" id="divsX" value="' +
    divsX +
    '" onchange="InitShaders();"><br>' +
    'DivsY: <input type="number" id="divsY" value="' +
    divsY +
    '" onchange="InitShaders();"><br>' +
    'Sector Count: <input type="number" id="sc" value="' +
    scValue +
    '" onchange="InitShaders();"><br>' +
    'Radius: <input type="number" id="radius" value="' +
    radiusValue +
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
      CreateBox(width, height, depth, divsX, divsY);
      break;
    case 3:
      gl.disable(gl.CULL_FACE);
      CreateCylinder(radiusValue, height, scValue);
      break;
  }
}

function CreateGeometryBuffers(program) {
  CreateGeometryUI();

  CreateVBO(program, new Float32Array(vertices));

  angleGL = gl.getUniformLocation(program, "Angle");
  CreateTexture(program, "img/textureCheck.jpg");

  gl.useProgram(program);

  gl.uniform4fv(angleGL, new Float32Array(angle));

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

// prettier-ignore
function AddTriangle(x1, y1, z1, r1, g1, b1, u1, v1, nx1, ny1, nz1,
                     x2, y2, z2, r2, g2, b2, u2, v2, nx2, ny2, nz2,
                     x3, y3, z3, r3, g3, b3, u3, v3, nx3, ny3, nz3) {
  AddVertex(x1, y1, z1, r1, g1, b1, u1, v1, nx1, ny1, nz1);
  AddVertex(x2, y2, z2, r2, g2, b2, u2, v2, nx2, ny2, nz2);
  AddVertex(x3, y3, z3, r3, g3, b3, u3, v3, nx3, ny3, nz3);
}

// prettier-ignore
function AddQuad(x1, y1, z1, r1, g1, b1, u1, v1, nx1, ny1, nz1,
                 x2, y2, z2, r2, g2, b2, u2, v2, nx2, ny2, nz2,
                 x3, y3, z3, r3, g3, b3, u3, v3, nx3, ny3, nz3,
                 x4, y4, z4, r4, g4, b4, u4, v4, nx4, ny4, nz4) {
  AddTriangle(x1, y1, z1, r1, g1, b1, u1, v1, nx1, ny1, nz1,
              x2, y2, z2, r2, g2, b2, u2, v2, nx2, ny2, nz2,
              x3, y3, z3, r3, g3, b3, u3, v3, nx3, ny3, nz3);

  AddTriangle(x3, y3, z3, r3, g3, b3, u3, v3, nx3, ny3, nz3,
              x4, y4, z4, r4, g4, b4, u4, v4, nx4, ny4, nz4,
              x1, y1, z1, r1, g1, b1, u1, v1, nx1, ny1, nz1);
}

function CreateTriangle(width, height) {
  vertices.length = 0;
  const w = width * 0.5;
  const h = height * 0.5;

  // prettier-ignore
  AddTriangle(0.0, h, 0.0, 1.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 1.0,
              -w, -h, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0,
               w, -h, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0
  );
}

function CreateQuad(width, height) {
  vertices.length = 0;
  const w = width * 0.5;
  const h = height * 0.5;

  // prettier-ignore
  AddQuad(-w, h, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
          -w,-h, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0,
           w,-h, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0,
           w, h, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0
  );
}

function CreateBox(width, height, depth, divsX, divsY) {
  vertices.length = 0;
  const w = width * 0.5;
  const h = height * 0.5;
  const d = depth * 0.5;

  const rowAmount = Number(divsY) + 1;
  const columnAmount = Number(divsX) + 1;
  const rowHeight = height / rowAmount;
  const columnWidth = width / columnAmount;
  const columnDepth = depth / columnAmount;
  const rowDepth = depth / rowAmount;

  const top = h;
  const left = -w;
  const right = w;
  const bot = -h;
  const back = d;
  const front = -d;

  console.log(
    "Rowamount: ",
    rowAmount,
    " columnAmount: ",
    columnAmount,
    "spaceBetweenX: ",
    columnWidth,
    "spaceBetweenY: ",
    rowHeight,
    "columnDepth: ",
    columnDepth,
    "width: ",
    width,
    "height: ",
    height,
  );

  let c = 255;

  for (let row = 0; row < rowAmount; row++) {
    let botY = bot + rowHeight * row;
    let topY = botY + rowHeight;

    c = row % 2 == 1 ? 0 : 255;

    // Draw Sides
    for (let column = 0; column < columnAmount; column++) {
      // Draw Frontside
      let leftX = left + columnWidth * column;
      let rightX = leftX + columnWidth;
      let leftZ = front;
      let rightZ = front;

      // prettier-ignore
      AddQuad(leftX, topY, leftZ, c, c, c, 0.0, 1.0, 0.0, 0.0, 1.0,
              leftX, botY, leftZ, c, c, c, 0.0, 0.0, 0.0, 0.0, 1.0,
              rightX,botY, rightZ,c, c, c, 1.0, 0.0, 0.0, 0.0, 1.0,
              rightX,topY, rightZ,c, c, c, 1.0, 1.0, 0.0, 0.0, 1.0
      );

      // Draw Backside
      leftX = right - columnWidth * column;
      rightX = leftX - columnWidth;
      leftZ = back;
      rightZ = back;

      //prettier-ignore
      AddQuad(leftX, topY, leftZ, c, c, c, 1, 0, 0.0, 0.0, -1.0,
              leftX, botY, leftZ, c, c, c, 1, 1, 0.0, 0.0, -1.0,
              rightX,botY, rightZ,c, c, c, 0, 1, 0.0, 0.0, -1.0, 
              rightX,topY, rightZ,c, c, c, 0, 0, 0.0, 0.0, -1.0
      );

      // Draw Left-side
      leftX = left;
      rightX = left;
      leftZ = back - columnDepth * column;
      rightZ = leftZ - columnDepth;

      //prettier-ignore
      AddQuad(leftX, topY, leftZ, c, c, c, 0.0, 1.0, 1.0, 0.0, 0.0,
              leftX, botY, leftZ, c, c, c, 0.0, 0.0, 1.0, 0.0, 0.0,
              rightX,botY, rightZ,c, c, c, 1.0, 0.0, 1.0, 0.0, 0.0,
              rightX,topY, rightZ,c, c, c, 1.0, 1.0, 1.0, 0.0, 0.0
      );

      // Draw Right-side
      leftX = right;
      rightX = right;
      leftZ = front + columnDepth * column;
      rightZ = leftZ + columnDepth;

      //prettier-ignore
      AddQuad(leftX, topY, leftZ, c, c, c, 0.0, 1.0, -1.0, 0.0, 0.0,
              leftX, botY, leftZ, c, c, c, 0.0, 0.0, -1.0, 0.0, 0.0,
              rightX,botY, rightZ,c, c, c, 1.0, 0.0, -1.0, 0.0, 0.0,
              rightX,topY, rightZ,c, c, c, 1.0, 1.0, -1.0, 0.0, 0.0
      );

      c = c == 255 ? 0 : 255;
    }

    c = row % 2 == 0 ? 255 : 0;
    // Draw Top and Bot
    let botZ = front + rowDepth * row;
    let topZ = botZ + rowDepth;
    console.log(topZ, botZ);
    for (let column = 0; column < columnAmount; column++) {
      // Draw Top
      topY = top;
      botY = top;
      let leftX = left + columnWidth * column;
      let rightX = leftX + columnWidth;

      //prettier-ignore
      AddQuad(leftX, topY, topZ, c, c, c, 0.0, 1.0, 0.0, -1.0, 0.0, 
              leftX, botY, botZ, c, c, c, 0.0, 0.0, 0.0, -1.0, 0.0,
              rightX,botY, botZ, c, c, c, 1.0, 0.0, 0.0, -1.0, 0.0,
              rightX,topY, topZ, c, c, c, 1.0, 1.0, 0.0, -1.0, 0.0
      );

      // Draw Bot
      topY = bot;
      botY = bot;
      leftX = right - columnWidth * column;
      rightX = leftX - columnWidth;

      //prettier-ignore
      AddQuad(leftX, topY, topZ, c, c, c, 1.0, 0.0, 0.0, 1.0, 0.0,
              leftX, botY, botZ, c, c, c, 1.0, 1.0, 0.0, 1.0, 0.0,
              rightX,botY, botZ, c, c, c, 0.0, 1.0, 0.0, 1.0, 0.0,
              rightX, topY,topZ, c, c, c, 0.0, 0.0, 0.0, 1.0, 0.0
      );
      c = c == 255 ? 0 : 255;
    }
  }
}

function CreateTexture(prog, url) {
  const texture = LoadTexture(url);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  textureGL = gl.getUniformLocation(prog, "Texture");
  displayGL = gl.getUniformLocation(prog, "Display");
}

function LoadTexture(url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixel,
  );
  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    SetTextureFilters(image);
  };
  image.src = url;
  return texture;
}

function SetTextureFilters(image) {
  if (IsPow2(image.width) && IsPow2(image.height)) {
    gl.generateMipmap(gl.TEXTURE_2D);
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
}

function IsPow2(value) {
  return (value & (value - 1)) === 0;
}

function CreateCylinder(radius, height, sectorCount) {
  vertices.length = 0;
  sectorStep = (2 * Math.PI) / sectorCount;
  let sectorAngle;
  let xzCoordinates = [];

  let top = height / 2;
  let bot = -height / 2;

  for (i = 0; i <= sectorCount; i++) {
    sectorAngle = i * sectorStep;
    let x = radius * Math.cos(sectorAngle);
    let z = radius * Math.sin(sectorAngle);

    let index = xzCoordinates.length;
    xzCoordinates.push(x);
    xzCoordinates.push(z);
    console.log(sectorAngle);
  }

  for (i = 0; i <= sectorCount; i++) {
    let x = xzCoordinates.shift();
    let z = xzCoordinates.shift();
    let x2 = xzCoordinates[0];
    let z2 = xzCoordinates[1];

    // prettier-ignore
    AddQuad(x, top, z, 0, 0, 255, 0, 1, -x, -top, -z,
            x, bot, z, 0, 0, 255, 0, 0, -x, -bot, -z,
            x2, bot, z2, 0, 0, 255, 1, 0, -x2, -bot, -z2,
            x2, top, z2, 0, 0, 255, 1, 1, -x2, -top, -z2
    );
  }
}

function radian(degrees) {
  return Math.PI / 180;
}
