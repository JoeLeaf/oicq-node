const canvas = require('canvas');
const sharp = require("sharp");

async function restore_picture(url) {
  const buffer = await sharp(await (await fetch(url)).arrayBuffer()).toFormat("png").toBuffer();
  const img = await canvas.loadImage(buffer);
  const canvas1 = canvas.createCanvas(img.width, img.height);
  const ctx1 = canvas1.getContext("2d");
  const ut = [39,38,48,49,41,40,46,47,35,34,50,51,33,32,28,29,27,26,36,37,31,30,44,45,43,42,12,13,23,22,14,15,21,20,8,9,25,24,6,7,3,2,0,1,11,10,4,5,19,18,16,17]
  const height_half = img.height / 2;
  for (let inx = 0; inx < 52; inx++) {
    const c = ut[inx] % 26 * 12 + 1;
    const u = height_half * (ut[inx] > 25 ? 1 : 0);
    ctx1.drawImage(img, c, u, 10, height_half, inx % 26 * 10, height_half * (inx > 25 ? 1 : 0), 10, height_half);
  }
  return canvas1.toBuffer();
}

const url = "https://static.geetest.com/pictures/gt/04d0982f6/04d0982f6.webp"
await restore_picture(url);

//如果canvas可以单独用sharp
const sharp = require("sharp");
async function restore_picture(url) {
  const image = sharp(Buffer.from(await (await fetch(url)).arrayBuffer()));
  let s = sharp({ create: { width: 260, height: 160, channels: 3, background: { r: 0, g: 0, b: 0 } } });
  const ut = [39, 38, 48, 49, 41, 40, 46, 47, 35, 34, 50, 51, 33, 32, 28, 29, 27, 26, 36, 37, 31, 30, 44, 45, 43, 42, 12, 13, 23, 22, 14, 15, 21, 20, 8, 9, 25, 24, 6, 7, 3, 2, 0, 1, 11, 10, 4, 5, 19, 18, 16, 17]
  const pic_list = [];
  for (let inx = 0; inx < 52; inx++) {
    const image1 = image.clone();
    const c = ut[inx] % 26 * 12+1;
    const u = 80 * (ut[inx] > 25 ? 1 : 0);
    const l_ = image1.extract({ left: c, top: u, width: 10, height: 80 });
    pic_list.push({
      input: await l_.toBuffer(),
      left: inx % 26 * 10,
      top: 80 * (inx > 25 ? 1 : 0),
    });
  }
  return await s.composite(pic_list).toFormat("png").toBuffer();
}

const url = "https://static.geetest.com/pictures/gt/04d0982f6/04d0982f6.webp"
let buffer = await restore_picture(url);





