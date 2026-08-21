/**
 * Build & Lint Verification Suite
 * 
 * Verifies:
 * 1. Environment and configuration file integrity (package.json, tsconfig.json, eslint.config.mjs, .env.example)
 * 2. TypeScript compilation without errors (`tsc --noEmit`)
 * 3. ESLint execution without errors (`npm run lint` / `next lint`)
 * 4. Next.js configuration and build readiness
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { describe, test, expect, assert } from './test_framework';

const ROOT_DIR = path.resolve(__dirname, '../..');

describe('Build & Lint Integrity Suite', () => {

  describe('1. Configuration & Dependency Checks', () => {
    test('package.json exists and specifies required Next.js / Supabase dependencies', () => {
      const pkgPath = path.join(ROOT_DIR, 'package.json');
      assert.ok(fs.existsSync(pkgPath), 'package.json must exist in project root');

      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      expect(pkg.dependencies).toBeDefined();
      expect(pkg.dependencies.next).toBeDefined();
      expect(pkg.dependencies.react).toBeDefined();
      expect(pkg.dependencies['react-dom']).toBeDefined();
      expect(pkg.dependencies['@supabase/ssr']).toBeDefined();
      expect(pkg.dependencies['@supabase/supabase-js']).toBeDefined();

      expect(pkg.devDependencies).toBeDefined();
      expect(pkg.devDependencies.typescript).toBeDefined();
      expect(pkg.devDependencies.eslint).toBeDefined();
    });

    test('tsconfig.json exists and configures strict TypeScript & path aliases', () => {
      const tsconfigPath = path.join(ROOT_DIR, 'tsconfig.json');
      assert.ok(fs.existsSync(tsconfigPath), 'tsconfig.json must exist');

      const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf-8');
      const tsconfig = JSON.parse(tsconfigContent);

      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.strict).toBe(true);
      expect(tsconfig.compilerOptions.paths).toBeDefined();
      expect(tsconfig.compilerOptions.paths['@/*']).toBeDefined();
    });

    test('next.config.ts exists in root directory', () => {
      const nextConfigPath = path.join(ROOT_DIR, 'next.config.ts');
      const nextConfigJsPath = path.join(ROOT_DIR, 'next.config.js');
      const nextConfigMjsPath = path.join(ROOT_DIR, 'next.config.mjs');
      const exists = fs.existsSync(nextConfigPath) || fs.existsSync(nextConfigJsPath) || fs.existsSync(nextConfigMjsPath);
      assert.ok(exists, 'next.config must exist');
    });

    test('.env.example exists and documents Supabase environment variables', () => {
      const envExamplePath = path.join(ROOT_DIR, '.env.example');
      assert.ok(fs.existsSync(envExamplePath), '.env.example must exist');

      const envContent = fs.readFileSync(envExamplePath, 'utf-8');
      expect(envContent).toContain('NEXT_PUBLIC_SUPABASE_URL');
      expect(envContent).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    });
  });

  describe('2. TypeScript Typechecking (`tsc --noEmit`)', () => {
    test('TypeScript compiles cleanly with 0 type errors', () => {
      try {
        execSync('npx tsc --noEmit', {
          cwd: ROOT_DIR,
          encoding: 'utf-8',
          stdio: ['ignore', 'pipe', 'pipe'],
          timeout: 60000,
        });
        assert.ok(true, 'TypeScript compilation completed with 0 errors');
      } catch (err: any) {
        const stdout = err.stdout ? err.stdout.toString() : '';
        const stderr = err.stderr ? err.stderr.toString() : '';
        const message = `${stdout}\n${stderr}`.trim();
        assert.fail(`TypeScript typechecking failed with errors:\n${message}`);
      }
    });
  });

  describe('3. ESLint Verification (`npm run lint`)', () => {
    test('Next.js lint runs cleanly with 0 lint errors', () => {
      try {
        execSync('npm run lint', {
          cwd: ROOT_DIR,
          encoding: 'utf-8',
          stdio: ['ignore', 'pipe', 'pipe'],
          timeout: 60000,
        });
        assert.ok(true, 'npm run lint completed with 0 errors');
      } catch (err: any) {
        const stdout = err.stdout ? err.stdout.toString() : '';
        const stderr = err.stderr ? err.stderr.toString() : '';
        const message = `${stdout}\n${stderr}`.trim();
        assert.fail(`Next.js lint failed with errors:\n${message}`);
      }
    });
  });
});
