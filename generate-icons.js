import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(size, outPath) {
  const width = size;
  const height = size;

  // CRC32 table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA color type
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw image data: height rows, each row has 1 filter byte (0) + width * 4 bytes RGBA
  const rawBytes = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  const radius = size * 0.22;
  const center = size / 2;

  for (let y = 0; y < height; y++) {
    rawBytes[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      // Background squircle rounded rect
      const dx = Math.abs(x - center) - (center - radius);
      const dy = Math.abs(y - center) - (center - radius);
      let inBounds = true;
      if (dx > 0 && dy > 0) {
        if (dx * dx + dy * dy > radius * radius) {
          inBounds = false;
        }
      }

      if (!inBounds) {
        // Transparent
        rawBytes[offset++] = 0;
        rawBytes[offset++] = 0;
        rawBytes[offset++] = 0;
        rawBytes[offset++] = 0;
        continue;
      }

      // Sky gradient: top-left sky-500 (2, 132, 199) to bottom-right blue-900 (30, 58, 138)
      const t = (x + y) / (2 * size);
      let r = Math.round(2 + t * (30 - 2));
      let g = Math.round(132 + t * (58 - 132));
      let b = Math.round(199 + t * (138 - 199));

      // Sun circle: center at (size * 0.65, size * 0.38), radius = size * 0.16
      const sunX = size * 0.64;
      const sunY = size * 0.38;
      const sunR = size * 0.16;
      const distSun = Math.sqrt((x - sunX) ** 2 + (y - sunY) ** 2);
      if (distSun <= sunR) {
        // Warm golden sun
        r = 251;
        g = 191;
        b = 36;
      }

      // Cloud shape
      // Center circle: (size * 0.5, size * 0.58), r = size * 0.2
      // Left circle: (size * 0.34, size * 0.62), r = size * 0.14
      // Right circle: (size * 0.66, size * 0.62), r = size * 0.14
      // Bottom rect: (size * 0.34 to 0.66, size * 0.58 to 0.76)
      const c1 = Math.sqrt((x - size * 0.5) ** 2 + (y - size * 0.56) ** 2) <= size * 0.2;
      const c2 = Math.sqrt((x - size * 0.34) ** 2 + (y - size * 0.62) ** 2) <= size * 0.14;
      const c3 = Math.sqrt((x - size * 0.66) ** 2 + (y - size * 0.62) ** 2) <= size * 0.14;
      const rect = x >= size * 0.34 && x <= size * 0.66 && y >= size * 0.56 && y <= size * 0.76;

      if (c1 || c2 || c3 || rect) {
        // White cloud
        r = 255;
        g = 255;
        b = 255;
      }

      rawBytes[offset++] = r;
      rawBytes[offset++] = g;
      rawBytes[offset++] = b;
      rawBytes[offset++] = 255; // Alpha
    }
  }

  const deflated = zlib.deflateSync(rawBytes, { level: 9 });
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outPath, png);
  console.log(`Generated ${outPath} (${width}x${height})`);
}

const iconsDir = path.resolve('public', 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

createPng(192, path.join(iconsDir, 'icon-192x192.png'));
createPng(512, path.join(iconsDir, 'icon-512x512.png'));
