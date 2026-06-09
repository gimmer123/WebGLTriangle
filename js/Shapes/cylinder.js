function CreateCylinder(radius, height, sectorCount) {
  vertices.length = 0;
  sectorStep = (2 * Math.PI) / sectorCount;
  let sectorAngle;
  let xzCoordinates = [];
  let uvCoordinates = [];
  let top = height / 2;
  let bot = -height / 2;

  for (i = 0; i <= sectorCount; i++) {
    sectorAngle = i * sectorStep;
    let x = radius * Math.cos(sectorAngle);
    let z = radius * Math.sin(sectorAngle);

    xzCoordinates.push(x);
    xzCoordinates.push(z);
  }

  for (i = 0; i <= sectorCount; i++) {
    let x = xzCoordinates.shift();
    let z = -xzCoordinates.shift();
    let x2 = xzCoordinates[0];
    let z2 = -xzCoordinates[1];
    let u = (x2 + x) / 2 / radius;
    let v = (z2 + z) / 2 / radius;

    console.log("x2: ", x2, "x: ", x, "u: ", u);
    // prettier-ignore
    AddQuad(x, top, z, 0, 0, 255, 0, 1, u, 0, v,
            x, bot, z, 0, 0, 255, 0, 0, u, 0, v,
            x2,bot, z2, 0, 0,255, 1, 0, u,0,v,
            x2,top, z2, 0, 0,255, 1, 1, u,0,v
    );

    // prettier-ignore
    AddTriangle(0, top, 0, 0, 0, 255, 0.5, 1, 0, 1, 0,
                x, top, z, 0, 0, 255,   0, 0, 0, 1, 0,
                x2, top,z2,0, 0, 255,   1, 0, 0, 1, 0)

    // prettier-ignore
    AddTriangle(0, bot, 0, 0, 0, 255, 0.5, 1, 0, -1, 0,
                x2,bot,z2, 0, 0, 255,   0, 0, 0, -1, 0,
                x,bot,z, 0, 0, 255,   1, 0, 0, -1, 0
    );
  }
}
