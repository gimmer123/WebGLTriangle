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
  const back = -d;
  const front = d;

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
      leftZ = back + columnDepth * column;
      rightZ = leftZ + columnDepth;

      //prettier-ignore
      AddQuad(leftX, topY, leftZ, c, c, c, 0.0, 1.0, -1.0, 0.0, 0.0,
              leftX, botY, leftZ, c, c, c, 0.0, 0.0, -1.0, 0.0, 0.0,
              rightX,botY, rightZ,c, c, c, 1.0, 0.0, -1.0, 0.0, 0.0,
              rightX,topY, rightZ,c, c, c, 1.0, 1.0, -1.0, 0.0, 0.0
      );

      // Draw Right-side
      leftX = right;
      rightX = right;
      leftZ = front - columnDepth * column;
      rightZ = leftZ - columnDepth;

      //prettier-ignore
      AddQuad(leftX, topY, leftZ, c, c, c, 0.0, 1.0, 1.0, 0.0, 0.0,
              leftX, botY, leftZ, c, c, c, 0.0, 0.0, 1.0, 0.0, 0.0,
              rightX,botY, rightZ,c, c, c, 1.0, 0.0, 1.0, 0.0, 0.0,
              rightX,topY, rightZ,c, c, c, 1.0, 1.0, 1.0, 0.0, 0.0
      );

      c = c == 255 ? 0 : 255;
    }

    c = row % 2 == 0 ? 255 : 0;
    // Draw Top and Bot
    let botZ = front - rowDepth * row;
    let topZ = botZ - rowDepth;
    console.log(topZ, botZ);
    for (let column = 0; column < columnAmount; column++) {
      // Draw Top
      topY = top;
      botY = top;
      let leftX = left + columnWidth * column;
      let rightX = leftX + columnWidth;

      //prettier-ignore
      AddQuad(leftX, topY, topZ, c, c, c, 0.0, 1.0, 0.0, 1.0, 0.0, 
              leftX, botY, botZ, c, c, c, 0.0, 0.0, 0.0, 1.0, 0.0,
              rightX,botY, botZ, c, c, c, 1.0, 0.0, 0.0, 1.0, 0.0,
              rightX,topY, topZ, c, c, c, 1.0, 1.0, 0.0, 1.0, 0.0
      );

      // Draw Bot
      topY = bot;
      botY = bot;
      leftX = right - columnWidth * column;
      rightX = leftX - columnWidth;

      //prettier-ignore
      AddQuad(leftX, topY, topZ, c, c, c, 1.0, 0.0, 0.0, -1.0, 0.0,
              leftX, botY, botZ, c, c, c, 1.0, 1.0, 0.0, -1.0, 0.0,
              rightX,botY, botZ, c, c, c, 0.0, 1.0, 0.0, -1.0, 0.0,
              rightX, topY,topZ, c, c, c, 0.0, 0.0, 0.0, -1.0, 0.0
      );
      c = c == 255 ? 0 : 255;
    }
  }
}
