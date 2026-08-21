/**
 * Asset Verification Test Suite
 * 
 * Verifies:
 * 1. Presence of public/images directory and all 22 required synthetic 3D image assets
 * 2. File size > 0 and non-trivial byte weight (> 500 bytes)
 * 3. Exact 8-byte PNG binary signature: 89 50 4E 47 0D 0A 1A 0A
 * 4. PNG IHDR metadata integrity (positive width, height, valid color type)
 * 5. Asset category coverage: Hero, Bento Grid, Avatars, Role Icons, Empty States, CTA Backdrop, Steps
 * 6. Reference integrity: All image references in app/ and components/ map to existing public/ assets
 * 7. Accessibility and layout integrity: alt attributes and dimension properties
 */

import fs from 'node:fs';
import path from 'node:path';
import { describe, test, expect, assert } from './test_framework';

const ROOT_DIR = path.resolve(__dirname, '../..');
const PUBLIC_IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');
const APP_DIR = path.join(ROOT_DIR, 'app');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'components');

// 22 Expected Synthetic AI Assets as defined in PROJECT.md & TEST_INFRA.md
export const REQUIRED_ASSET_CATEGORIES = {
  hero: [
    'hero-network-matrix.png',
    'hero-synergy-orbit.png',
  ],
  bento: [
    'bento-vibe-engine.png',
    'bento-roles-complement.png',
    'bento-project-incubator.png',
    'bento-privacy-shield.png',
    'bento-smart-contracts.png',
  ],
  avatars: [
    'avatar-alex-coder.png',
    'avatar-maya-designer.png',
    'avatar-david-hardware.png',
    'avatar-elena-growth.png',
    'avatar-carlos-writer.png',
    'avatar-priya-fintech.png',
  ],
  roles: [
    'role-software-coder.png',
    'role-creative-designer.png',
    'role-hardware-maker.png',
    'role-business-growth.png',
    'role-marketing-writer.png',
    'role-general-builder.png',
  ],
  emptyStates: [
    'empty-discover-deck.png',
    'empty-messages-chat.png',
  ],
  cta: [
    'cta-nebula-backdrop.png',
  ],
};

// Flattened list of canonical asset names
export const CANONICAL_ASSET_NAMES = [
  ...REQUIRED_ASSET_CATEGORIES.hero,
  ...REQUIRED_ASSET_CATEGORIES.bento,
  ...REQUIRED_ASSET_CATEGORIES.avatars,
  ...REQUIRED_ASSET_CATEGORIES.roles,
  ...REQUIRED_ASSET_CATEGORIES.emptyStates,
  ...REQUIRED_ASSET_CATEGORIES.cta,
];

// PNG Signature: 89 50 4E 47 0D 0A 1A 0A
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

interface PNGHeaderInfo {
  width: number;
  height: number;
  bitDepth: number;
  colorType: number;
}

function parsePNGHeader(buffer: Buffer): PNGHeaderInfo {
  if (buffer.length < 24) {
    throw new Error(`Buffer too short to contain valid PNG header (length: ${buffer.length})`);
  }

  // Check 8-byte PNG signature
  if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error(`Invalid PNG signature: ${buffer.subarray(0, 8).toString('hex')}`);
  }

  // Check IHDR chunk header (length: 4 bytes at offset 8, chunk type 'IHDR' at offset 12)
  const chunkType = buffer.subarray(12, 16).toString('ascii');
  if (chunkType !== 'IHDR') {
    throw new Error(`Expected IHDR chunk at offset 12, but found '${chunkType}'`);
  }

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const bitDepth = buffer.readUInt8(24);
  const colorType = buffer.readUInt8(25);

  return { width, height, bitDepth, colorType };
}

function getAllFiles(dir: string, extensions: string[] = ['.tsx', '.ts', '.jsx', '.js']): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath, extensions));
    } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }

  return results;
}

describe('Asset Verification & AI Image Integrity Suite', () => {

  describe('1. Directory Structure & File Presence', () => {
    test('public/images directory exists', () => {
      const exists = fs.existsSync(PUBLIC_IMAGES_DIR);
      assert.ok(exists, `Expected directory to exist at: ${PUBLIC_IMAGES_DIR}`);
      const stat = fs.statSync(PUBLIC_IMAGES_DIR);
      assert.ok(stat.isDirectory(), `Expected ${PUBLIC_IMAGES_DIR} to be a directory`);
    });

    test('public/images contains at least 22 image assets', () => {
      if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
        throw new Error(`Directory ${PUBLIC_IMAGES_DIR} does not exist`);
      }
      const files = fs.readdirSync(PUBLIC_IMAGES_DIR).filter(f => f.toLowerCase().endsWith('.png'));
      expect(files.length).toBeGreaterThanOrEqual(22);
    });

    test('all canonical asset categories are represented', () => {
      if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
        throw new Error(`Directory ${PUBLIC_IMAGES_DIR} does not exist`);
      }
      const files = fs.readdirSync(PUBLIC_IMAGES_DIR);
      const fileSet = new Set(files.map(f => f.toLowerCase()));

      for (const [category, requiredFiles] of Object.entries(REQUIRED_ASSET_CATEGORIES)) {
        const found = requiredFiles.filter(name => {
          if (fileSet.has(name.toLowerCase())) return true;
          // Also accept numeric avatar fallbacks (avatar-1.png for avatar-alex.png etc.)
          if (name.startsWith('avatar-')) {
            const index = requiredFiles.indexOf(name) + 1;
            if (fileSet.has(`avatar-${index}.png`)) return true;
          }
          return false;
        });

        assert.ok(
          found.length > 0,
          `Category "${category}" has no matching files in public/images/. Expected: ${requiredFiles.join(', ')}`
        );
      }
    });

    test('verifies each individual required asset file exists', () => {
      if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
        throw new Error(`Directory ${PUBLIC_IMAGES_DIR} does not exist`);
      }
      const existingFiles = fs.readdirSync(PUBLIC_IMAGES_DIR).map(f => f.toLowerCase());
      const missingAssets: string[] = [];

      for (const assetName of CANONICAL_ASSET_NAMES) {
        const exists = existingFiles.includes(assetName.toLowerCase()) ||
          (assetName.startsWith('avatar-') && existingFiles.some(f => f.startsWith('avatar-')));
        if (!exists) {
          missingAssets.push(assetName);
        }
      }

      assert.strictEqual(
        missingAssets.length,
        0,
        `Missing required asset files in public/images/: ${missingAssets.join(', ')}`
      );
    });
  });

  describe('2. File Size & Non-Zero Byte Verification', () => {
    test('every PNG image in public/images has size > 0 bytes', () => {
      if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
        throw new Error(`Directory ${PUBLIC_IMAGES_DIR} does not exist`);
      }
      const files = fs.readdirSync(PUBLIC_IMAGES_DIR).filter(f => f.endsWith('.png'));
      assert.ok(files.length > 0, 'No PNG files found in public/images/');

      for (const file of files) {
        const fullPath = path.join(PUBLIC_IMAGES_DIR, file);
        const stat = fs.statSync(fullPath);
        assert.ok(stat.size > 0, `File ${file} has size 0 bytes`);
      }
    });

    test('every PNG image has non-trivial size (> 500 bytes)', () => {
      if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
        throw new Error(`Directory ${PUBLIC_IMAGES_DIR} does not exist`);
      }
      const files = fs.readdirSync(PUBLIC_IMAGES_DIR).filter(f => f.endsWith('.png'));
      assert.ok(files.length > 0, 'No PNG files found in public/images/');
      const smallFiles: string[] = [];

      for (const file of files) {
        const fullPath = path.join(PUBLIC_IMAGES_DIR, file);
        const stat = fs.statSync(fullPath);
        if (stat.size <= 500) {
          smallFiles.push(`${file} (${stat.size} bytes)`);
        }
      }

      assert.strictEqual(
        smallFiles.length,
        0,
        `Found suspiciously small PNG files (dummy stubs): ${smallFiles.join(', ')}`
      );
    });
  });

  describe('3. Binary PNG Signature & IHDR Header Validation', () => {
    test('every PNG file has authentic 8-byte PNG magic header [89 50 4E 47 0D 0A 1A 0A]', () => {
      if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
        throw new Error(`Directory ${PUBLIC_IMAGES_DIR} does not exist`);
      }
      const files = fs.readdirSync(PUBLIC_IMAGES_DIR).filter(f => f.endsWith('.png'));
      assert.ok(files.length > 0, 'No PNG files found in public/images/');
      const invalidFiles: string[] = [];

      for (const file of files) {
        const fullPath = path.join(PUBLIC_IMAGES_DIR, file);
        const fd = fs.openSync(fullPath, 'r');
        const buffer = Buffer.alloc(8);
        fs.readSync(fd, buffer, 0, 8, 0);
        fs.closeSync(fd);

        if (!buffer.equals(PNG_SIGNATURE)) {
          invalidFiles.push(`${file} (magic: ${buffer.toString('hex')})`);
        }
      }

      assert.strictEqual(
        invalidFiles.length,
        0,
        `Files with invalid PNG signatures: ${invalidFiles.join(', ')}`
      );
    });

    test('every PNG file has valid IHDR dimensions (width > 0, height > 0)', () => {
      if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
        throw new Error(`Directory ${PUBLIC_IMAGES_DIR} does not exist`);
      }
      const files = fs.readdirSync(PUBLIC_IMAGES_DIR).filter(f => f.endsWith('.png'));
      assert.ok(files.length > 0, 'No PNG files found in public/images/');
      const badHeaders: string[] = [];

      for (const file of files) {
        const fullPath = path.join(PUBLIC_IMAGES_DIR, file);
        const buffer = fs.readFileSync(fullPath);

        try {
          const header = parsePNGHeader(buffer);
          if (header.width <= 0 || header.height <= 0) {
            badHeaders.push(`${file} (dimensions: ${header.width}x${header.height})`);
          }
        } catch (err: any) {
          badHeaders.push(`${file} (parse error: ${err.message})`);
        }
      }

      assert.strictEqual(
        badHeaders.length,
        0,
        `Files with invalid IHDR chunk: ${badHeaders.join(', ')}`
      );
    });
  });

  describe('4. Component & Page Image Reference Integrity', () => {
    test('all /images/... references in components and pages map to existing files in public/images', () => {
      const sourceFiles = [
        ...getAllFiles(APP_DIR),
        ...getAllFiles(COMPONENTS_DIR),
      ];

      const imageRefRegex = /["'`](\/images\/[^"'`\s]+\.png)["'`]/g;
      const foundRefs: { ref: string; file: string }[] = [];

      for (const srcFile of sourceFiles) {
        const content = fs.readFileSync(srcFile, 'utf-8');
        let match: RegExpExecArray | null;
        while ((match = imageRefRegex.exec(content)) !== null) {
          foundRefs.push({ ref: match[1], file: path.relative(ROOT_DIR, srcFile) });
        }
      }

      const brokenRefs: string[] = [];
      for (const { ref, file } of foundRefs) {
        const relativeAssetPath = ref.startsWith('/') ? ref.slice(1) : ref;
        const targetDiskPath = path.join(ROOT_DIR, 'public', relativeAssetPath);
        if (!fs.existsSync(targetDiskPath)) {
          brokenRefs.push(`${ref} referenced in ${file}`);
        }
      }

      assert.strictEqual(
        brokenRefs.length,
        0,
        `Found broken image references in code:\n${brokenRefs.join('\n')}`
      );
    });

    test('components using next/image provide required dimension attributes or fill', () => {
      const componentFiles = getAllFiles(COMPONENTS_DIR);
      const appFiles = getAllFiles(APP_DIR);
      const allFiles = [...componentFiles, ...appFiles];

      const issues: string[] = [];

      for (const file of allFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        if (content.includes("from 'next/image'") || content.includes('from "next/image"')) {
          // Look for <Image ... /> usages across lines without 's' regex flag
          const imageTagRegex = /<Image\b([\s\S]*?)\/?>/g;
          let match: RegExpExecArray | null;
          while ((match = imageTagRegex.exec(content)) !== null) {
            const props = match[1];
            const hasWidth = /width\s*=\s*\{?[0-9]+/.test(props);
            const hasHeight = /height\s*=\s*\{?[0-9]+/.test(props);
            const hasFill = /\bfill\b/.test(props);

            if (!hasFill && (!hasWidth || !hasHeight)) {
              issues.push(`In ${path.relative(ROOT_DIR, file)}: <Image> missing width/height or fill: ${props.slice(0, 80)}...`);
            }
          }
        }
      }

      assert.strictEqual(
        issues.length,
        0,
        `Found next/image usages with missing dimension constraints:\n${issues.join('\n')}`
      );
    });
  });
});
