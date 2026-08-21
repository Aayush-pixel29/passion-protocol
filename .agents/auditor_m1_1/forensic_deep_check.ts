import fs from "node:fs";
import path from "node:path";

const ROOT = "d:/passion-protocol";
const IMAGES_DIR = path.join(ROOT, "public", "images");
const GLOBALS_CSS = path.join(ROOT, "app", "globals.css");
const LAYOUT_TSX = path.join(ROOT, "app", "layout.tsx");

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

interface DetailedAssetReport {
  filename: string;
  bytes: number;
  magicHeaderHex: string;
  isMagicValid: boolean;
  width: number;
  height: number;
  aspectRatio: number;
  aspectRatioLabel: string;
  expectedRatio: string;
  ratioMatchesSpec: boolean;
  chunksFound: string[];
  hasIHDR: boolean;
  hasIDAT: boolean;
  hasIEND: boolean;
  sha256Prefix: string;
}

function parsePngChunks(buf: Buffer): string[] {
  const chunks: string[] = [];
  let offset = 8;
  while (offset < buf.length) {
    if (offset + 8 > buf.length) break;
    const length = buf.readUInt32BE(offset);
    const chunkType = buf.subarray(offset + 4, offset + 8).toString("ascii");
    chunks.push(chunkType);
    offset += 8 + length + 4; // length + type + data + CRC
  }
  return chunks;
}

const crypto = require("crypto");

const EXPECTED_22 = [
  { filename: "hero-network-matrix.png", expectedRatio: "16:9" },
  { filename: "hero-synergy-orbit.png", expectedRatio: "1:1" },
  { filename: "bento-vibe-engine.png", expectedRatio: "1:1" },
  { filename: "bento-roles-complement.png", expectedRatio: "1:1" },
  { filename: "bento-project-incubator.png", expectedRatio: "1:1" },
  { filename: "bento-privacy-shield.png", expectedRatio: "1:1" },
  { filename: "bento-smart-contracts.png", expectedRatio: "1:1" },
  { filename: "role-software-coder.png", expectedRatio: "1:1" },
  { filename: "role-creative-designer.png", expectedRatio: "1:1" },
  { filename: "role-hardware-maker.png", expectedRatio: "1:1" },
  { filename: "role-business-growth.png", expectedRatio: "1:1" },
  { filename: "role-marketing-writer.png", expectedRatio: "1:1" },
  { filename: "role-general-builder.png", expectedRatio: "1:1" },
  { filename: "avatar-alex-coder.png", expectedRatio: "1:1" },
  { filename: "avatar-maya-designer.png", expectedRatio: "1:1" },
  { filename: "avatar-david-hardware.png", expectedRatio: "1:1" },
  { filename: "avatar-elena-growth.png", expectedRatio: "1:1" },
  { filename: "avatar-carlos-writer.png", expectedRatio: "1:1" },
  { filename: "avatar-priya-fintech.png", expectedRatio: "1:1" },
  { filename: "empty-discover-deck.png", expectedRatio: "16:9" },
  { filename: "empty-messages-chat.png", expectedRatio: "16:9" },
  { filename: "cta-nebula-backdrop.png", expectedRatio: "16:9" }
];

const assetReports: DetailedAssetReport[] = [];

for (const exp of EXPECTED_22) {
  const filePath = path.join(IMAGES_DIR, exp.filename);
  if (!fs.existsSync(filePath)) {
    console.error(`MISSING: ${exp.filename}`);
    continue;
  }
  const buf = fs.readFileSync(filePath);
  const magic = buf.subarray(0, 8);
  const isMagicValid = magic.equals(PNG_MAGIC);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const aspectRatio = width / height;
  const chunks = parsePngChunks(buf);
  const hasIHDR = chunks.includes("IHDR");
  const hasIDAT = chunks.includes("IDAT");
  const hasIEND = chunks.includes("IEND");
  
  let ratioMatchesSpec = false;
  let aspectRatioLabel = `${aspectRatio.toFixed(3)}`;
  if (exp.expectedRatio === "1:1") {
    ratioMatchesSpec = aspectRatio >= 0.98 && aspectRatio <= 1.02;
    aspectRatioLabel = "1:1";
  } else {
    ratioMatchesSpec = aspectRatio >= 1.70 && aspectRatio <= 1.85;
    aspectRatioLabel = "16:9";
  }

  const hash = crypto.createHash("sha256").update(buf).digest("hex");

  assetReports.push({
    filename: exp.filename,
    bytes: buf.length,
    magicHeaderHex: magic.toString("hex"),
    isMagicValid,
    width,
    height,
    aspectRatio,
    aspectRatioLabel,
    expectedRatio: exp.expectedRatio,
    ratioMatchesSpec,
    chunksFound: Array.from(new Set(chunks)),
    hasIHDR,
    hasIDAT,
    hasIEND,
    sha256Prefix: hash.substring(0, 16)
  });
}

// Check duplicates
const hashes = assetReports.map(a => a.sha256Prefix);
const uniqueHashes = new Set(hashes);
const hasDuplicateImages = uniqueHashes.size !== hashes.length;

console.log("=== FORENSIC ASSET SUMMARY ===");
console.log(`Total Assets Checked: ${assetReports.length} / 22`);
console.log(`Unique Image Hashes: ${uniqueHashes.size} / 22 (Duplicates: ${hasDuplicateImages ? "YES (VIOLATION)" : "NO (CLEAN)"})`);
console.log(`All Magic Bytes Valid: ${assetReports.every(a => a.isMagicValid)}`);
console.log(`All PNG Chunks (IHDR, IDAT, IEND) Valid: ${assetReports.every(a => a.hasIHDR && a.hasIDAT && a.hasIEND)}`);
console.log(`All Aspect Ratios Valid: ${assetReports.every(a => a.ratioMatchesSpec)}`);
console.log(`Total Asset Weight: ${(assetReports.reduce((s, a) => s + a.bytes, 0) / (1024 * 1024)).toFixed(2)} MB`);

fs.writeFileSync(
  path.join(__dirname, "detailed_asset_audit.json"),
  JSON.stringify({ assetReports, hasDuplicateImages }, null, 2)
);
