var mouseX = 0;
var mouseY = 0;

var rotateY = 0;
var rotateX = 0;

// prettier-ignore
var rotationY = [0.0, 0.0, 0.0, 0.0, 
                 0.0, 1.0, 0.0, 0.0, 
                 0.0, 0.0, 0.0, 0.0, 
                 0.0, 0.0, 0.0, 1.0,
];

// prettier-ignore
var rotationX = [1.0, 0.0, 0.0, 0.0,
                 0.0, 0.0, 0.0, 0.0,
                 0.0, 0.0, 0.0, 0.0, 
                 0.0, 0.0, 0.0, 1.0,
];

document.getElementById("glCanvas").addEventListener("mousemove", function (e) {
  if (e.buttons == 1) {
    rotateX -= (mouseY - e.y) * 0.1;
    rotateY += (mouseX - e.x) * 0.1;

    let coX = Math.cos(rotateX);
    let siX = Math.sin(rotateX);
    rotationX[5] = coX;
    rotationX[6] = siX;
    rotationX[9] = -siX;
    rotationX[10] = coX;

    let coY = Math.cos(rotateY);
    let siY = Math.sin(rotateY);
    rotationY[0] = coY;
    rotationY[2] = -siY;
    rotationY[8] = siY;
    rotationY[10] = coY;

    gl.uniformMatrix4fv(matXGL, false, new Float32Array(rotationX));
    gl.uniformMatrix4fv(matYGL, false, new Float32Array(rotationY));
    Render();
  }
  mouseX = e.x;
  mouseY = e.y;
});

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

  let shapeSelected = document.getElementById("shape");
  switch (shapeSelected.selectedIndex) {
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
      CreateCylinder(radiusValue, height, scValue);
      break;
  }

  let modifierSelected = document.getElementById("modifier");
  switch (modifierSelected.selectedIndex) {
    case 0:
      modifier = nullModifier;
      break;
    case 1:
      modifier = bend;
      break;
  }
}
