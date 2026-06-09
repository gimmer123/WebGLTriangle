// prettier-ignore
function AddTriangle(x1, y1, z1, r1, g1, b1, u1, v1, nx1, ny1, nz1,
                     x2, y2, z2, r2, g2, b2, u2, v2, nx2, ny2, nz2,
                     x3, y3, z3, r3, g3, b3, u3, v3, nx3, ny3, nz3) {
  AddVertex(x1, y1, z1, r1, g1, b1, u1, v1, nx1, ny1, nz1);
  AddVertex(x2, y2, z2, r2, g2, b2, u2, v2, nx2, ny2, nz2);
  AddVertex(x3, y3, z3, r3, g3, b3, u3, v3, nx3, ny3, nz3);
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
