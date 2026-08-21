/**
 * Passion Protocol - Master E2E Test Suite Runner
 * 
 * Aggregates and executes:
 * - Infrastructure Suites (asset verification, theme tokens, build & lint)
 * - 4-Tier Test Matrix (Tier 1 Features, Tier 2 Boundaries, Tier 3 Combinations, Tier 4 Scenarios)
 * 
 * Provides:
 * - Formatted console reporting with ANSI colors and progress indicators
 * - Tier-by-tier metrics and execution timing breakdown
 * - Process exit code (0 for pass, 1 for failure)
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { runSuites, colors, symbols, type SummaryStats, type SuiteResult } from './test_framework';

const TEST_DIR = __dirname;

// Known test suites in execution priority order
const KNOWN_SUITES = [
  'asset_verification.test.ts',
  'theme_tokens.test.ts',
  'build_and_lint.test.ts',
  'tier1_features.test.ts',
  'tier2_boundaries.test.ts',
  'tier3_combinations.test.ts',
  'tier4_scenarios.test.ts',
];

async function discoverAndLoadTestSuites(): Promise<string[]> {
  const loadedSuites: string[] = [];

  // 1. First, load known suites in order if they exist
  for (const suiteFilename of KNOWN_SUITES) {
    const fullPath = path.join(TEST_DIR, suiteFilename);
    if (fs.existsSync(fullPath)) {
      try {
        const fileUrl = pathToFileURL(fullPath).href;
        await import(fileUrl);
        loadedSuites.push(suiteFilename);
      } catch (err: any) {
        console.error(`${colors.red}${symbols.cross} Failed to import suite ${suiteFilename}: ${err.message}${colors.reset}`);
        if (err.stack) console.error(err.stack);
      }
    }
  }

  // 2. Discover any additional *.test.ts files not in the known list
  const allFiles = fs.readdirSync(TEST_DIR);
  for (const file of allFiles) {
    if (file.endsWith('.test.ts') && !KNOWN_SUITES.includes(file)) {
      const fullPath = path.join(TEST_DIR, file);
      try {
        const fileUrl = pathToFileURL(fullPath).href;
        await import(fileUrl);
        loadedSuites.push(file);
      } catch (err: any) {
        console.error(`${colors.red}${symbols.cross} Failed to import suite ${file}: ${err.message}${colors.reset}`);
      }
    }
  }

  return loadedSuites;
}

function printTierSummaryTable(stats: SummaryStats): void {
  console.log(`\n${colors.bold}${colors.cyan}╔══════════════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}║                   E2E TEST MATRIX EXECUTION SUMMARY                      ║${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}╠══════════════════════════════════════════╦═══════╦════════╦════════╦═════╣${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}║ Suite / Category                         ║ Total ║ Passed ║ Failed ║  ms ║${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}╠══════════════════════════════════════════╬═══════╬════════╬════════╬═════╣${colors.reset}`);

  for (const suite of stats.suiteResults) {
    const name = suite.name.length > 40 ? suite.name.substring(0, 37) + '...' : suite.name.padEnd(40);
    const total = String(suite.total).padStart(5);
    const passed = `${colors.green}${String(suite.passed).padStart(6)}${colors.reset}`;
    const failed = suite.failed > 0
      ? `${colors.brightRed}${String(suite.failed).padStart(6)}${colors.reset}`
      : `${colors.gray}${String(suite.failed).padStart(6)}${colors.reset}`;
    const time = `${String(suite.durationMs).padStart(4)}ms`;

    console.log(`║ ${colors.white}${name}${colors.reset} ║ ${total} ║ ${passed} ║ ${failed} ║ ${time}║`);
  }

  console.log(`${colors.bold}${colors.cyan}╚══════════════════════════════════════════╩═══════╩════════╩════════╩═════╝${colors.reset}`);
}

export async function main(): Promise<void> {
  const startTime = performance.now();

  console.log(`\n${colors.bold}${colors.magenta}=== Discovering and loading E2E Test Suites in ${TEST_DIR} ===${colors.reset}\n`);
  const loadedSuites = await discoverAndLoadTestSuites();
  console.log(`${colors.dim}Loaded ${loadedSuites.length} test suite module(s): ${loadedSuites.join(', ')}${colors.reset}\n`);

  if (loadedSuites.length === 0) {
    console.error(`${colors.red}${symbols.cross} No test suites found in ${TEST_DIR}${colors.reset}`);
    process.exit(1);
  }

  const stats = await runSuites();
  printTierSummaryTable(stats);

  const totalTimeSec = ((performance.now() - startTime) / 1000).toFixed(2);

  if (stats.failedTests > 0) {
    console.error(`\n${colors.bgRed}${colors.white}${colors.bold} FAILURE ${colors.reset} ${colors.red}Test run finished with ${stats.failedTests} failed test(s) in ${totalTimeSec}s.${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`\n${colors.bgGreen}${colors.black}${colors.bold} SUCCESS ${colors.reset} ${colors.green}All ${stats.totalTests} tests passed cleanly across ${stats.totalSuites} suite(s) in ${totalTimeSec}s.${colors.reset}\n`);
    process.exit(0);
  }
}

// Execute main if run directly
if (require.main === module || process.argv[1]?.includes('runner.ts')) {
  main().catch((err) => {
    console.error(`${colors.red}Unhandled error in test runner:${colors.reset}`, err);
    process.exit(1);
  });
}
