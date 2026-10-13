import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, isMaskable = false) {
  // Simple uncompressed/deflated raw RGBA PNG generator
  const buffer = Buffer.alloc(width * height * 4);
  const cx = width / 2;
  const cy = height * 0.46;
  const outerR = isMaskable ? width * 0.28 : width * 0.35;
  const innerR = outerR * 0.35;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep forest green brand background #1b4332
      let r = 27;
      let g = 67;
      let b = 50;
      let a = 255;

      // Darker vignette at bottom
      if (y > height * 0.65) {
        r = 15;
        g = 41;
        b = 30;
      }

      // Steppe hill in lower half
      const hillY = height * 0.65 + Math.sin((x / width) * Math.PI) * (height * 0.1);
      if (y > hillY) {
        r = 45;
        g = 106;
        b = 79;
      }

      // Golden Shaniraq Sun Ring
      if (dist <= outerR && dist >= outerR * 0.8) {
        r = 234;
        g = 179;
        b = 8;
      } else if (dist < outerR * 0.8 && dist >= outerR * 0.65) {
        r = 250;
        g = 204;
        b = 21;
      } else if (dist < outerR * 0.65 && dist >= innerR) {
        // Crossbars
        if (Math.abs(dx) < width * 0.02 || Math.abs(dy) < width * 0.02) {
          r = 113;
          g = 63;
          b = 18;
        } else if (Math.abs(dx - dy) < width * 0.02 || Math.abs(dx + dy) < width * 0.02) {
          r = 113;
          g = 63;
          b = 18;
        } else {
          r = 234;
          g = 179;
          b = 8;
        }
      } else if (dist < innerR && dist >= innerR * 0.4) {
        r = 202;
        g = 138;
        b = 4;
      } else if (dist < innerR * 0.4) {
        r = 113;
        g = 63;
        b = 18;
      }

      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }

  // Build PNG chunk format
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT (filter type 0 per line)
  const rawScanlines = Buffer.alloc(height * (width * 4 + 1));
  let scanOffset = 0;
  for (let y = 0; y < height; y++) {
    rawScanlines[scanOffset++] = 0; // filter 0
    buffer.copy(rawScanlines, scanOffset, y * width * 4, (y + 1) * width * 4);
    scanOffset += width * 4;
  }

  const compressedData = zlib.deflateSync(rawScanlines);
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeInt32BE(crc, 8 + len);
  return chunk;
}

// Standard CRC32 table
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return c ^ -1;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PNG icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, false));

console.log('PWA icons created successfully in public/');
