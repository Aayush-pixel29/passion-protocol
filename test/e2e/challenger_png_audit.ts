import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT_DIR = path.resolve(__dirname, '../..');
const IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// CRC32 table implementation for validating PNG chunks
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  CRC_TABLE[n] = c;
}

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

interface ExpectedAsset {
  filename: string;
  expectedRatio: '1:1' | '16:9';
  minWidth: number;
  minHeight: number;
  category: string;
}

const REQUIRED_22: ExpectedAsset[] = [
  // Hero (2)
  { filename: 'hero-network-matrix.png', expectedRatio: '16:9', minWidth: 800, minHeight: 450, category: 'Hero Backdrop' },
  { filename: 'hero-synergy-orbit.png', expectedRatio: '1:1', minWidth: 400, minHeight: 400, category: 'Hero Preview' },
  // Bento Grid (5)
  { filename: 'bento-vibe-engine.png', expectedRatio: '1:1', minWidth: 400, minHeight: 400, category: 'Bento 3D Graphics' },
  { filename: 'bento-roles-complement.png', expectedRatio: '1:1', minWidth: 400, minHeight: 400, category: 'Bento 3D Graphics' },
  { filename: 'bento-project-incubator.png', expectedRatio: '1:1', minWidth: 400, minHeight: 400, category: 'Bento 3D Graphics' },
  { filename: 'bento-privacy-shield.png', expectedRatio: '1:1', minWidth: 400, minHeight: 400, category: 'Bento 3D Graphics' },
  { filename: 'bento-smart-contracts.png', expectedRatio: '1:1', minWidth: 400, minHeight: 400, category: 'Bento 3D Graphics' },
  // Role Icons (6)
  { filename: 'role-software-coder.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256, category: 'Role Holograms' },
  { filename: 'role-creative-designer.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256, category: 'Role Holograms' },
  { filename: 'role-hardware-maker.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256, category: 'Role Holograms' },
  { filename: 'role-business-growth.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256, category: 'Role Holograms' },
  { filename: 'role-marketing-writer.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256, category: 'Role Holograms' },
  { filename: 'role-general-builder.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256, category: 'Role Holograms' },
  // Avatars (6)
  { filename: 'avatar-alex-coder.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256, category: 'Builder Avatars' },
  { filename: 'avatar-maya-designer.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256, category: 'Builder Avatars' },
  { filename: 'avatar-david-hardware.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256, category: 'Builder Avatars' },
  { filename: 'avatar-elena-growth.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256, category: 'Builder Avatars' },
  { filename: 'avatar-carlos-writer.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256, category: 'Builder Avatars' },
  { filename: 'avatar-priya-fintech.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256, category: 'Builder Avatars' },
  // Empty States (2)
  { filename: 'empty-discover-deck.png', expectedRatio: '16:9', minWidth: 800, minHeight: 450, category: 'Empty States' },
  { filename: 'empty-messages-chat.png', expectedRatio: '16:9', minWidth: 800, minHeight: 450, category: 'Empty States' },
  // CTA Backdrop (1)
  { filename: 'cta-nebula-backdrop.png', expectedRatio: '16:9', minWidth: 800, minHeight: 450, category: 'CTA Backdrop' },
];

interface AuditResult {
  filename: string;
  category: string;
  sizeBytes: number;
  sizeFormatted: string;
  magicHeaderValid: boolean;
  width: number;
  height: number;
  aspectRatio: number;
  expectedRatio: string;
  ratioPassed: boolean;
  bitDepth: number;
  colorType: number;
  colorTypeName: string;
  compressionMethod: number;
  filterMethod: number;
  interlaceMethod: number;
  totalChunks: number;
  chunkTypes: string[];
  allCrcValid: boolean;
  hasIdat: boolean;
  idatBytes: number;
  hasIend: boolean;
  trailingBytes: number;
  sha256: string;
  status: 'PASS' | 'FAIL';
  errors: string[];
}

const COLOR_TYPE_NAMES: Record<number, string> = {
  0: 'Grayscale',
  2: 'Truecolor (RGB)',
  3: 'Indexed-color (Palette)',
  4: 'Grayscale with alpha',
  6: 'Truecolor with alpha (RGBA)',
};

function auditFile(spec: ExpectedAsset): AuditResult {
  const assetPath = path.join(IMAGES_DIR, spec.filename);
  const errors: string[] = [];

  if (!fs.existsSync(assetPath)) {
    return {
      filename: spec.filename,
      category: spec.category,
      sizeBytes: 0,
      sizeFormatted: '0 B',
      magicHeaderValid: false,
      width: 0,
      height: 0,
      aspectRatio: 0,
      expectedRatio: spec.expectedRatio,
      ratioPassed: false,
      bitDepth: 0,
      colorType: 0,
      colorTypeName: 'Unknown',
      compressionMethod: 0,
      filterMethod: 0,
      interlaceMethod: 0,
      totalChunks: 0,
      chunkTypes: [],
      allCrcValid: false,
      hasIdat: false,
      idatBytes: 0,
      hasIend: false,
      trailingBytes: 0,
      sha256: '',
      status: 'FAIL',
      errors: ['File does not exist on disk'],
    };
  }

  const stat = fs.statSync(assetPath);
  const sizeBytes = stat.size;
  const sizeFormatted = `${(sizeBytes / 1024).toFixed(2)} KB`;

  if (sizeBytes === 0) {
    errors.push('File is 0 bytes (empty)');
  }
  if (sizeBytes < 1024) {
    errors.push(`File is suspiciously small (< 1 KB): ${sizeBytes} bytes`);
  }

  const buffer = fs.readFileSync(assetPath);
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

  // 1. Magic header
  const magicHeaderValid = buffer.length >= 8 && buffer.subarray(0, 8).equals(PNG_MAGIC);
  if (!magicHeaderValid) {
    errors.push(`Invalid PNG magic bytes: ${buffer.subarray(0, 8).toString('hex')}`);
  }

  // 2. Chunk walker
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let compressionMethod = 0;
  let filterMethod = 0;
  let interlaceMethod = 0;
  let totalChunks = 0;
  const chunkTypes: string[] = [];
  let allCrcValid = true;
  let hasIdat = false;
  let idatBytes = 0;
  let hasIend = false;
  let trailingBytes = 0;

  let isFirstChunk = true;

  while (offset + 8 <= buffer.length) {
    const chunkLength = buffer.readUInt32BE(offset);
    const chunkType = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    totalChunks++;
    chunkTypes.push(chunkType);

    if (offset + 8 + chunkLength + 4 > buffer.length) {
      errors.push(`Truncated chunk '${chunkType}' at offset ${offset}: length ${chunkLength} exceeds remaining buffer`);
      allCrcValid = false;
      break;
    }

    const chunkData = buffer.subarray(offset + 8, offset + 8 + chunkLength);
    const chunkCrc = buffer.readUInt32BE(offset + 8 + chunkLength);

    // Verify CRC32
    const chunkTypeAndData = buffer.subarray(offset + 4, offset + 8 + chunkLength);
    const calculatedCrc = crc32(chunkTypeAndData);
    if (chunkCrc !== calculatedCrc) {
      allCrcValid = false;
      errors.push(`CRC mismatch in chunk '${chunkType}' at offset ${offset}: expected 0x${chunkCrc.toString(16)}, got 0x${calculatedCrc.toString(16)}`);
    }

    if (isFirstChunk) {
      isFirstChunk = false;
      if (chunkType !== 'IHDR') {
        errors.push(`First chunk must be 'IHDR', got '${chunkType}'`);
      } else if (chunkLength !== 13) {
        errors.push(`IHDR chunk length must be 13, got ${chunkLength}`);
      } else {
        width = chunkData.readUInt32BE(0);
        height = chunkData.readUInt32BE(4);
        bitDepth = chunkData.readUInt8(8);
        colorType = chunkData.readUInt8(9);
        compressionMethod = chunkData.readUInt8(10);
        filterMethod = chunkData.readUInt8(11);
        interlaceMethod = chunkData.readUInt8(12);

        if (width === 0 || height === 0) {
          errors.push(`Invalid image dimensions: ${width}x${height}`);
        }
        if (![1, 2, 4, 8, 16].includes(bitDepth)) {
          errors.push(`Invalid bit depth: ${bitDepth}`);
        }
        if (![0, 2, 3, 4, 6].includes(colorType)) {
          errors.push(`Invalid color type: ${colorType}`);
        }
      }
    }

    if (chunkType === 'IDAT') {
      hasIdat = true;
      idatBytes += chunkLength;
    }

    if (chunkType === 'IEND') {
      hasIend = true;
      const endOffset = offset + 8 + chunkLength + 4;
      trailingBytes = buffer.length - endOffset;
      if (trailingBytes > 0) {
        errors.push(`Found ${trailingBytes} trailing bytes after IEND chunk`);
      }
      break;
    }

    offset += 8 + chunkLength + 4;
  }

  if (!hasIdat || idatBytes === 0) {
    errors.push('No IDAT chunk or 0 IDAT bytes found');
  }
  if (!hasIend) {
    errors.push('Missing IEND terminal chunk');
  }

  // 3. Aspect Ratio & Dimensions
  const aspectRatio = height > 0 ? width / height : 0;
  let ratioPassed = false;
  if (spec.expectedRatio === '1:1') {
    ratioPassed = aspectRatio >= 0.98 && aspectRatio <= 1.02;
    if (!ratioPassed) {
      errors.push(`Expected 1:1 aspect ratio, got ${aspectRatio.toFixed(4)} (${width}x${height})`);
    }
  } else {
    // 16:9 ratio is ~1.7777
    ratioPassed = aspectRatio >= 1.70 && aspectRatio <= 1.85;
    if (!ratioPassed) {
      errors.push(`Expected 16:9 aspect ratio, got ${aspectRatio.toFixed(4)} (${width}x${height})`);
    }
  }

  if (width < spec.minWidth || height < spec.minHeight) {
    errors.push(`Dimensions ${width}x${height} below minimum required ${spec.minWidth}x${spec.minHeight}`);
  }

  const colorTypeName = COLOR_TYPE_NAMES[colorType] || `Unknown (${colorType})`;
  const status = errors.length === 0 ? 'PASS' : 'FAIL';

  return {
    filename: spec.filename,
    category: spec.category,
    sizeBytes,
    sizeFormatted,
    magicHeaderValid,
    width,
    height,
    aspectRatio,
    expectedRatio: spec.expectedRatio,
    ratioPassed,
    bitDepth,
    colorType,
    colorTypeName,
    compressionMethod,
    filterMethod,
    interlaceMethod,
    totalChunks,
    chunkTypes,
    allCrcValid,
    hasIdat,
    idatBytes,
    hasIend,
    trailingBytes,
    sha256,
    status,
    errors,
  };
}

async function runAdversarialAudit() {
  console.log('\n================================================================');
  console.log('       ADVERSARIAL STRESS TEST: 22 AI SYNTHETIC ASSETS          ');
  console.log('================================================================\n');

  // Check directory contents
  const diskFiles = fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR) : [];
  console.log(`Discovered ${diskFiles.length} files in public/images/`);

  const results = REQUIRED_22.map(auditFile);
  const hashes = new Set<string>();
  const duplicates: string[] = [];

  for (const res of results) {
    if (hashes.has(res.sha256)) {
      duplicates.push(res.filename);
    }
    hashes.add(res.sha256);
  }

  let passCount = 0;
  let failCount = 0;

  console.log('\nDetailed Breakdown:\n');
  for (const r of results) {
    const mark = r.status === 'PASS' ? '✓ PASS' : '✗ FAIL';
    console.log(`[${mark}] ${r.filename.padEnd(30)} | ${r.sizeFormatted.padStart(10)} | ${r.width}x${r.height} (${r.expectedRatio}) | ${r.colorTypeName} | Chunks: ${r.totalChunks} (CRC: ${r.allCrcValid ? 'OK' : 'ERR'})`);
    if (r.errors.length > 0) {
      for (const err of r.errors) {
        console.log(`    -> ERROR: ${err}`);
      }
      failCount++;
    } else {
      passCount++;
    }
  }

  // Check for uniqueness
  if (duplicates.length > 0) {
    console.log(`\n[WARNING] Duplicate asset SHA256 hashes detected: ${duplicates.join(', ')}`);
  } else {
    console.log('\n✓ Asset Uniqueness: All 22 assets have distinct cryptographic SHA256 hashes.');
  }

  // Check for stray / unexpected files
  const requiredSet = new Set(REQUIRED_22.map(r => r.filename));
  const strayFiles = diskFiles.filter(f => !requiredSet.has(f));
  if (strayFiles.length > 0) {
    console.log(`[NOTE] Additional files present in public/images/: ${strayFiles.join(', ')}`);
  } else {
    console.log('✓ Directory Cleanliness: Exactly 22 assets present, 0 unexpected files.');
  }

  console.log('\n================================================================');
  console.log(`AUDIT SUMMARY: ${passCount} / ${REQUIRED_22.length} ASSETS PASSED | ${failCount} FAILED`);
  console.log(`VERDICT: ${failCount === 0 ? 'APPROVE' : 'REJECT'}`);
  console.log('================================================================\n');

  // Output JSON for programmatic parsing
  fs.writeFileSync(
    path.join(__dirname, 'challenger_m1_audit_output.json'),
    JSON.stringify({ results, passCount, failCount, duplicates, strayFiles, totalRequired: REQUIRED_22.length }, null, 2),
    'utf-8'
  );
}

runAdversarialAudit();
