/**
 * Passion Protocol - Lightweight E2E Test Framework
 * 
 * Provides:
 * - Jest/Vitest-compatible BDD primitives: describe, test, it, expect, assert
 * - Lifecycle hooks: beforeEach, afterEach, beforeAll, afterAll
 * - Rich matcher engine with `.not`, `.resolves`, `.rejects`, deep equality, type checks
 * - Formatted, colorized terminal reporting with execution timing
 * - Structured summary statistics and multi-suite aggregation
 */

// ============================================================================
// ANSI Color Formatting Utilities
// ============================================================================

export const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',

  // Foreground
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  // Bright Foreground
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',

  // Background
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  bgGray: '\x1b[100m',
};

export const symbols = {
  check: '✓',
  cross: '✗',
  bullet: '•',
  pointer: '›',
  arrow: '→',
  warn: '⚠',
  info: 'ℹ',
  ellipsis: '…',
};

// ============================================================================
// Deep Equality & Value Inspection
// ============================================================================

export function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;

  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;

  if (objA.constructor !== objB.constructor) {
    return false;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const item of a) {
      let found = false;
      for (const other of b) {
        if (deepEqual(item, other)) {
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }

  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, val] of a) {
      if (!b.has(key) || !deepEqual(val, b.get(key))) {
        return false;
      }
    }
    return true;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
    const bufA = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
    const bufB = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
    if (bufA.length !== bufB.length) return false;
    for (let i = 0; i < bufA.length; i++) {
      if (bufA[i] !== bufB[i]) return false;
    }
    return true;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) return false;
    if (!deepEqual(objA[key], objB[key])) return false;
  }

  return true;
}

export function formatValue(val: unknown, depth = 0, maxDepth = 4): string {
  if (depth > maxDepth) return `${colors.gray}[Object]${colors.reset}`;
  if (val === null) return `${colors.yellow}null${colors.reset}`;
  if (val === undefined) return `${colors.gray}undefined${colors.reset}`;
  if (typeof val === 'string') return `${colors.green}"${val}"${colors.reset}`;
  if (typeof val === 'number') return `${colors.yellow}${val}${colors.reset}`;
  if (typeof val === 'boolean') return `${colors.cyan}${val}${colors.reset}`;
  if (typeof val === 'bigint') return `${colors.yellow}${val}n${colors.reset}`;
  if (typeof val === 'symbol') return `${colors.magenta}${val.toString()}${colors.reset}`;
  if (typeof val === 'function') return `${colors.blue}[Function: ${val.name || 'anonymous'}]${colors.reset}`;
  if (val instanceof Date) return `${colors.magenta}${val.toISOString()}${colors.reset}`;
  if (val instanceof RegExp) return `${colors.brightRed}${val.toString()}${colors.reset}`;

  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    if (val.length <= 5 && !val.some(x => typeof x === 'object' && x !== null)) {
      return `[ ${val.map(x => formatValue(x, depth + 1, maxDepth)).join(', ')} ]`;
    }
    const items = val.map(x => '  '.repeat(depth + 1) + formatValue(x, depth + 1, maxDepth));
    return `[\n${items.join(',\n')}\n${'  '.repeat(depth)}]`;
  }

  if (typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    if (keys.length <= 3 && !keys.some(k => typeof obj[k] === 'object' && obj[k] !== null)) {
      const inlineProps = keys.map(k => `${k}: ${formatValue(obj[k], depth + 1, maxDepth)}`);
      return `{ ${inlineProps.join(', ')} }`;
    }
    const props = keys.map(k => `${'  '.repeat(depth + 1)}${k}: ${formatValue(obj[k], depth + 1, maxDepth)}`);
    return `{\n${props.join(',\n')}\n${'  '.repeat(depth)}}`;
  }

  return String(val);
}

// ============================================================================
// Assertion Error Class
// ============================================================================

export class AssertionError extends Error {
  public actual?: unknown;
  public expected?: unknown;
  public operator?: string;

  constructor(message: string, actual?: unknown, expected?: unknown, operator?: string) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
    this.operator = operator;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssertionError);
    }
  }
}

// ============================================================================
// Expect & Matchers Implementation
// ============================================================================

export interface Matchers<R> {
  toBe(expected: unknown): R;
  toEqual(expected: unknown): R;
  toStrictEqual(expected: unknown): R;
  toBeDefined(): R;
  toBeUndefined(): R;
  toBeNull(): R;
  toBeNaN(): R;
  toBeTruthy(): R;
  toBeFalsy(): R;
  toBeGreaterThan(expected: number | bigint): R;
  toBeGreaterThanOrEqual(expected: number | bigint): R;
  toBeLessThan(expected: number | bigint): R;
  toBeLessThanOrEqual(expected: number | bigint): R;
  toBeCloseTo(expected: number, precision?: number): R;
  toContain(expected: unknown): R;
  toContainEqual(expected: unknown): R;
  toHaveLength(expected: number): R;
  toHaveProperty(keyPath: string | string[], expectedValue?: unknown): R;
  toMatch(expected: RegExp | string): R;
  toMatchObject(expected: Record<string, unknown>): R;
  toBeInstanceOf(expected: unknown): R;
  toThrow(expectedErrorOrMessage?: string | RegExp | Error | (new (...args: unknown[]) => Error)): R;
  resolves: Matchers<Promise<void>>;
  rejects: Matchers<Promise<void>>;
  not: Matchers<R>;
}

class Expectation<T = unknown> implements Matchers<void> {
  private actual: T;
  private isNot: boolean;
  private isPromise: boolean;
  private expectReject: boolean;

  constructor(actual: T, isNot = false, isPromise = false, expectReject = false) {
    this.actual = actual;
    this.isNot = isNot;
    this.isPromise = isPromise;
    this.expectReject = expectReject;
  }

  get not(): Matchers<void> {
    return new Expectation(this.actual, !this.isNot, this.isPromise, this.expectReject);
  }

  get resolves(): Matchers<Promise<void>> {
    return this.createAsyncMatcher(false);
  }

  get rejects(): Matchers<Promise<void>> {
    return this.createAsyncMatcher(true);
  }

  private createAsyncMatcher(expectReject: boolean): Matchers<Promise<void>> {
    const self = this;
    const asyncProxy: Record<string, unknown> = {};

    const matcherNames = [
      'toBe', 'toEqual', 'toStrictEqual', 'toBeDefined', 'toBeUndefined', 'toBeNull',
      'toBeNaN', 'toBeTruthy', 'toBeFalsy', 'toBeGreaterThan', 'toBeGreaterThanOrEqual',
      'toBeLessThan', 'toBeLessThanOrEqual', 'toBeCloseTo', 'toContain', 'toContainEqual',
      'toHaveLength', 'toHaveProperty', 'toMatch', 'toMatchObject', 'toBeInstanceOf', 'toThrow'
    ];

    for (const name of matcherNames) {
      asyncProxy[name] = async (...args: unknown[]) => {
        let resolvedValue: unknown;
        let rejectedError: unknown;
        let didReject = false;

        try {
          resolvedValue = await (self.actual as Promise<unknown>);
        } catch (err) {
          rejectedError = err;
          didReject = true;
        }

        if (expectReject) {
          if (!didReject) {
            throw new AssertionError(
              `Expected promise to reject, but it resolved with ${formatValue(resolvedValue)}`,
              resolvedValue,
              'Promise rejection',
              'rejects'
            );
          }
          const targetExp = new Expectation(rejectedError, self.isNot);
          return (targetExp as Record<string, any>)[name](...args);
        } else {
          if (didReject) {
            throw new AssertionError(
              `Expected promise to resolve, but it rejected with ${formatValue(rejectedError)}`,
              rejectedError,
              'Promise resolution',
              'resolves'
            );
          }
          const targetExp = new Expectation(resolvedValue, self.isNot);
          return (targetExp as Record<string, any>)[name](...args);
        }
      };
    }

    Object.defineProperty(asyncProxy, 'not', {
      get: () => {
        const negated = new Expectation(self.actual, !self.isNot, self.isPromise, self.expectReject);
        return negated.createAsyncMatcher(expectReject);
      }
    });

    return asyncProxy as unknown as Matchers<Promise<void>>;
  }

  private check(passed: boolean, message: string, expected?: unknown, operator?: string) {
    const shouldPass = !this.isNot;
    if (passed !== shouldPass) {
      const fullMessage = this.isNot
        ? `Expected NOT: ${message}`
        : `Expected: ${message}`;
      throw new AssertionError(fullMessage, this.actual, expected, operator);
    }
  }

  toBe(expected: unknown): void {
    const pass = Object.is(this.actual, expected);
    this.check(
      pass,
      `value ${formatValue(this.actual)} to be ${formatValue(expected)}`,
      expected,
      'toBe'
    );
  }

  toEqual(expected: unknown): void {
    const pass = deepEqual(this.actual, expected);
    this.check(
      pass,
      `value ${formatValue(this.actual)} to deeply equal ${formatValue(expected)}`,
      expected,
      'toEqual'
    );
  }

  toStrictEqual(expected: unknown): void {
    this.toEqual(expected);
  }

  toBeDefined(): void {
    const pass = this.actual !== undefined;
    this.check(pass, `value to be defined, but received undefined`, undefined, 'toBeDefined');
  }

  toBeUndefined(): void {
    const pass = this.actual === undefined;
    this.check(pass, `value to be undefined, but received ${formatValue(this.actual)}`, undefined, 'toBeUndefined');
  }

  toBeNull(): void {
    const pass = this.actual === null;
    this.check(pass, `value to be null, but received ${formatValue(this.actual)}`, null, 'toBeNull');
  }

  toBeNaN(): void {
    const pass = typeof this.actual === 'number' && Number.isNaN(this.actual);
    this.check(pass, `value to be NaN, but received ${formatValue(this.actual)}`, NaN, 'toBeNaN');
  }

  toBeTruthy(): void {
    const pass = Boolean(this.actual);
    this.check(pass, `value ${formatValue(this.actual)} to be truthy`, true, 'toBeTruthy');
  }

  toBeFalsy(): void {
    const pass = !this.actual;
    this.check(pass, `value ${formatValue(this.actual)} to be falsy`, false, 'toBeFalsy');
  }

  toBeGreaterThan(expected: number | bigint): void {
    const pass = (this.actual as number | bigint) > expected;
    this.check(
      pass,
      `value ${formatValue(this.actual)} > ${formatValue(expected)}`,
      expected,
      'toBeGreaterThan'
    );
  }

  toBeGreaterThanOrEqual(expected: number | bigint): void {
    const pass = (this.actual as number | bigint) >= expected;
    this.check(
      pass,
      `value ${formatValue(this.actual)} >= ${formatValue(expected)}`,
      expected,
      'toBeGreaterThanOrEqual'
    );
  }

  toBeLessThan(expected: number | bigint): void {
    const pass = (this.actual as number | bigint) < expected;
    this.check(
      pass,
      `value ${formatValue(this.actual)} < ${formatValue(expected)}`,
      expected,
      'toBeLessThan'
    );
  }

  toBeLessThanOrEqual(expected: number | bigint): void {
    const pass = (this.actual as number | bigint) <= expected;
    this.check(
      pass,
      `value ${formatValue(this.actual)} <= ${formatValue(expected)}`,
      expected,
      'toBeLessThanOrEqual'
    );
  }

  toBeCloseTo(expected: number, precision = 2): void {
    const expectedDiff = Math.pow(10, -precision) / 2;
    const actualDiff = Math.abs((this.actual as number) - expected);
    const pass = actualDiff < expectedDiff;
    this.check(
      pass,
      `value ${formatValue(this.actual)} to be close to ${formatValue(expected)} (within ${expectedDiff})`,
      expected,
      'toBeCloseTo'
    );
  }

  toContain(expected: unknown): void {
    let pass = false;
    if (typeof this.actual === 'string') {
      pass = this.actual.includes(String(expected));
    } else if (Array.isArray(this.actual)) {
      pass = this.actual.includes(expected);
    } else if (this.actual instanceof Set) {
      pass = this.actual.has(expected);
    } else if (this.actual instanceof Map) {
      pass = this.actual.has(expected);
    }
    this.check(
      pass,
      `collection ${formatValue(this.actual)} to contain ${formatValue(expected)}`,
      expected,
      'toContain'
    );
  }

  toContainEqual(expected: unknown): void {
    let pass = false;
    if (Array.isArray(this.actual)) {
      pass = this.actual.some(item => deepEqual(item, expected));
    } else if (this.actual instanceof Set) {
      for (const item of this.actual) {
        if (deepEqual(item, expected)) {
          pass = true;
          break;
        }
      }
    }
    this.check(
      pass,
      `collection ${formatValue(this.actual)} to contain equal item ${formatValue(expected)}`,
      expected,
      'toContainEqual'
    );
  }

  toHaveLength(expected: number): void {
    const actualLength = (this.actual as { length?: number })?.length;
    const pass = actualLength === expected;
    this.check(
      pass,
      `target to have length ${formatValue(expected)}, but got ${formatValue(actualLength)}`,
      expected,
      'toHaveLength'
    );
  }

  toHaveProperty(keyPath: string | string[], expectedValue?: unknown): void {
    const keys = Array.isArray(keyPath) ? keyPath : keyPath.split('.');
    let curr: unknown = this.actual;
    let hasProp = true;

    for (const key of keys) {
      if (curr === null || curr === undefined || !Object.prototype.hasOwnProperty.call(curr, key)) {
        hasProp = false;
        break;
      }
      curr = (curr as Record<string, unknown>)[key];
    }

    if (arguments.length >= 2) {
      const pass = hasProp && deepEqual(curr, expectedValue);
      this.check(
        pass,
        `target to have property '${keys.join('.')}' with value ${formatValue(expectedValue)}, but got ${formatValue(curr)}`,
        expectedValue,
        'toHaveProperty'
      );
    } else {
      this.check(
        hasProp,
        `target to have property '${keys.join('.')}'`,
        undefined,
        'toHaveProperty'
      );
    }
  }

  toMatch(expected: RegExp | string): void {
    const str = String(this.actual);
    const pass = typeof expected === 'string' ? str.includes(expected) : expected.test(str);
    this.check(
      pass,
      `string ${formatValue(str)} to match ${formatValue(expected)}`,
      expected,
      'toMatch'
    );
  }

  toMatchObject(expected: Record<string, unknown>): void {
    const matchSubset = (actualVal: unknown, expectedSubset: unknown): boolean => {
      if (typeof expectedSubset !== 'object' || expectedSubset === null) {
        return deepEqual(actualVal, expectedSubset);
      }
      const expObj = expectedSubset as Record<string, unknown>;
      const actObj = actualVal as Record<string, unknown> | null;
      for (const key of Object.keys(expObj)) {
        if (!actObj || !Object.prototype.hasOwnProperty.call(actObj, key)) return false;
        if (!matchSubset(actObj[key], expObj[key])) return false;
      }
      return true;
    };

    const pass = matchSubset(this.actual, expected);
    this.check(
      pass,
      `object ${formatValue(this.actual)} to match subset ${formatValue(expected)}`,
      expected,
      'toMatchObject'
    );
  }

  toBeInstanceOf(expected: unknown): void {
    const pass = this.actual instanceof (expected as new (...args: unknown[]) => unknown);
    const name = (expected as { name?: string }).name || String(expected);
    this.check(
      pass,
      `value ${formatValue(this.actual)} to be instance of ${name}`,
      expected,
      'toBeInstanceOf'
    );
  }

  toThrow(expectedErrorOrMessage?: string | RegExp | Error | (new (...args: unknown[]) => Error)): void {
    if (typeof this.actual !== 'function') {
      throw new AssertionError(
        `Expected a function in expect(...).toThrow(), but received ${typeof this.actual}`,
        this.actual,
        'Function',
        'toThrow'
      );
    }

    let threw = false;
    let thrownError: unknown = null;

    try {
      (this.actual as () => unknown)();
    } catch (err) {
      threw = true;
      thrownError = err;
    }

    if (!expectedErrorOrMessage) {
      this.check(threw, `function to throw an error`, undefined, 'toThrow');
      return;
    }

    if (!threw) {
      this.check(false, `function to throw an error, but it did not throw`, expectedErrorOrMessage, 'toThrow');
      return;
    }

    const msg = thrownError instanceof Error ? thrownError.message : String(thrownError);

    if (typeof expectedErrorOrMessage === 'string') {
      const pass = msg.includes(expectedErrorOrMessage);
      this.check(pass, `thrown error message "${msg}" to contain "${expectedErrorOrMessage}"`, expectedErrorOrMessage, 'toThrow');
    } else if (expectedErrorOrMessage instanceof RegExp) {
      const pass = expectedErrorOrMessage.test(msg);
      this.check(pass, `thrown error message "${msg}" to match ${expectedErrorOrMessage}`, expectedErrorOrMessage, 'toThrow');
    } else if (typeof expectedErrorOrMessage === 'function') {
      const pass = thrownError instanceof expectedErrorOrMessage;
      this.check(pass, `thrown error to be instance of ${expectedErrorOrMessage.name}`, expectedErrorOrMessage, 'toThrow');
    } else if (expectedErrorOrMessage instanceof Error) {
      const pass = msg === expectedErrorOrMessage.message;
      this.check(pass, `thrown error message "${msg}" to equal "${expectedErrorOrMessage.message}"`, expectedErrorOrMessage, 'toThrow');
    }
  }
}

export function expect<T = unknown>(actual: T): Matchers<void> {
  return new Expectation(actual);
}

// ============================================================================
// Node-style Assert Library
// ============================================================================

export interface AssertInterface {
  (condition: unknown, message?: string): void;
  ok(condition: unknown, message?: string): void;
  strictEqual(actual: unknown, expected: unknown, message?: string): void;
  notStrictEqual(actual: unknown, expected: unknown, message?: string): void;
  deepStrictEqual(actual: unknown, expected: unknown, message?: string): void;
  notDeepStrictEqual(actual: unknown, expected: unknown, message?: string): void;
  match(value: string, regexp: RegExp, message?: string): void;
  doesNotMatch(value: string, regexp: RegExp, message?: string): void;
  throws(fn: () => unknown, expected?: unknown, message?: string): void;
  doesNotThrow(fn: () => unknown, message?: string): void;
  fail(message?: string): never;
}

export const assert: AssertInterface = Object.assign(
  function assert(condition: unknown, message?: string): void {
    if (!condition) {
      throw new AssertionError(message || 'Assertion failed: condition is falsy', condition, true, 'assert');
    }
  },
  {
    ok(condition: unknown, message?: string): void {
      if (!condition) {
        throw new AssertionError(message || 'Expected value to be truthy', condition, true, 'assert.ok');
      }
    },
    strictEqual(actual: unknown, expected: unknown, message?: string): void {
      if (!Object.is(actual, expected)) {
        throw new AssertionError(
          message || `Expected values to be strictly equal: ${formatValue(actual)} !== ${formatValue(expected)}`,
          actual,
          expected,
          'assert.strictEqual'
        );
      }
    },
    notStrictEqual(actual: unknown, expected: unknown, message?: string): void {
      if (Object.is(actual, expected)) {
        throw new AssertionError(
          message || `Expected values NOT to be strictly equal: got ${formatValue(actual)}`,
          actual,
          expected,
          'assert.notStrictEqual'
        );
      }
    },
    deepStrictEqual(actual: unknown, expected: unknown, message?: string): void {
      if (!deepEqual(actual, expected)) {
        throw new AssertionError(
          message || `Expected values to be deeply equal:\nActual: ${formatValue(actual)}\nExpected: ${formatValue(expected)}`,
          actual,
          expected,
          'assert.deepStrictEqual'
        );
      }
    },
    notDeepStrictEqual(actual: unknown, expected: unknown, message?: string): void {
      if (deepEqual(actual, expected)) {
        throw new AssertionError(
          message || `Expected values NOT to be deeply equal: got ${formatValue(actual)}`,
          actual,
          expected,
          'assert.notDeepStrictEqual'
        );
      }
    },
    match(value: string, regexp: RegExp, message?: string): void {
      if (!regexp.test(value)) {
        throw new AssertionError(
          message || `Expected string "${value}" to match ${regexp}`,
          value,
          regexp,
          'assert.match'
        );
      }
    },
    doesNotMatch(value: string, regexp: RegExp, message?: string): void {
      if (regexp.test(value)) {
        throw new AssertionError(
          message || `Expected string "${value}" NOT to match ${regexp}`,
          value,
          regexp,
          'assert.doesNotMatch'
        );
      }
    },
    throws(fn: () => unknown, expected?: unknown, message?: string): void {
      let threw = false;
      let thrownError: unknown = null;
      try {
        fn();
      } catch (err) {
        threw = true;
        thrownError = err;
      }
      if (!threw) {
        throw new AssertionError(message || 'Expected function to throw', undefined, 'Error', 'assert.throws');
      }
      if (expected) {
        if (expected instanceof RegExp) {
          const msg = thrownError instanceof Error ? thrownError.message : String(thrownError);
          if (!expected.test(msg)) {
            throw new AssertionError(
              message || `Expected thrown error "${msg}" to match ${expected}`,
              msg,
              expected,
              'assert.throws'
            );
          }
        } else if (typeof expected === 'function') {
          if (!(thrownError instanceof (expected as new (...args: unknown[]) => unknown))) {
            throw new AssertionError(
              message || `Expected thrown error to be instance of ${(expected as { name?: string }).name}`,
              thrownError,
              expected,
              'assert.throws'
            );
          }
        }
      }
    },
    doesNotThrow(fn: () => unknown, message?: string): void {
      try {
        fn();
      } catch (err) {
        throw new AssertionError(
          message || `Expected function NOT to throw, but it threw: ${err}`,
          err,
          undefined,
          'assert.doesNotThrow'
        );
      }
    },
    fail(message?: string): never {
      throw new AssertionError(message || 'Explicit test failure triggered', undefined, undefined, 'assert.fail');
    }
  }
);

// ============================================================================
// Test Suite & Registry Engine
// ============================================================================

export type TestFn = () => void | Promise<void>;
export type HookFn = () => void | Promise<void>;

export interface TestCase {
  name: string;
  fn: TestFn;
  skipped?: boolean;
  only?: boolean;
  todo?: boolean;
  duration?: number;
  error?: Error;
  status?: 'passed' | 'failed' | 'skipped' | 'todo';
}

export interface TestSuite {
  name: string;
  parent?: TestSuite;
  suites: TestSuite[];
  tests: TestCase[];
  beforeEachHooks: HookFn[];
  afterEachHooks: HookFn[];
  beforeAllHooks: HookFn[];
  afterAllHooks: HookFn[];
  tier?: string;
}

export interface SuiteResult {
  name: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  durationMs: number;
  tests: {
    name: string;
    status: 'passed' | 'failed' | 'skipped' | 'todo';
    durationMs: number;
    error?: Error;
  }[];
  childSuites: SuiteResult[];
}

export interface SummaryStats {
  totalSuites: number;
  passedSuites: number;
  failedSuites: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  durationMs: number;
  suiteResults: SuiteResult[];
}

class TestRegistry {
  private rootSuites: TestSuite[] = [];
  private currentSuite: TestSuite | null = null;
  private hasOnly = false;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.rootSuites = [];
    this.currentSuite = null;
    this.hasOnly = false;
  }

  getRoots(): TestSuite[] {
    return this.rootSuites;
  }

  createSuite(name: string, fn: () => void, tier?: string): void {
    const parent = this.currentSuite;
    const suite: TestSuite = {
      name,
      parent: parent || undefined,
      suites: [],
      tests: [],
      beforeEachHooks: [],
      afterEachHooks: [],
      beforeAllHooks: [],
      afterAllHooks: [],
      tier,
    };

    if (parent) {
      parent.suites.push(suite);
    } else {
      this.rootSuites.push(suite);
    }

    this.currentSuite = suite;
    try {
      fn();
    } finally {
      this.currentSuite = parent;
    }
  }

  addTest(name: string, fn: TestFn, options: { skipped?: boolean; only?: boolean; todo?: boolean } = {}): void {
    if (!this.currentSuite) {
      this.createSuite('Default Suite', () => {});
    }

    if (options.only) {
      this.hasOnly = true;
    }

    this.currentSuite!.tests.push({
      name,
      fn,
      skipped: options.skipped,
      only: options.only,
      todo: options.todo,
    });
  }

  addHook(type: 'beforeEach' | 'afterEach' | 'beforeAll' | 'afterAll', fn: HookFn): void {
    if (!this.currentSuite) {
      throw new Error(`Cannot register hook "${type}" outside of a describe block.`);
    }

    switch (type) {
      case 'beforeEach':
        this.currentSuite.beforeEachHooks.push(fn);
        break;
      case 'afterEach':
        this.currentSuite.afterEachHooks.push(fn);
        break;
      case 'beforeAll':
        this.currentSuite.beforeAllHooks.push(fn);
        break;
      case 'afterAll':
        this.currentSuite.afterAllHooks.push(fn);
        break;
    }
  }

  private collectBeforeEach(suite: TestSuite): HookFn[] {
    const hooks: HookFn[] = [];
    let curr: TestSuite | undefined = suite;
    while (curr) {
      hooks.unshift(...curr.beforeEachHooks);
      curr = curr.parent;
    }
    return hooks;
  }

  private collectAfterEach(suite: TestSuite): HookFn[] {
    const hooks: HookFn[] = [];
    let curr: TestSuite | undefined = suite;
    while (curr) {
      hooks.push(...curr.afterEachHooks);
      curr = curr.parent;
    }
    return hooks;
  }

  async runSuite(suite: TestSuite, depth = 0): Promise<SuiteResult> {
    const indent = '  '.repeat(depth);
    const tierBadge = suite.tier ? `${colors.bgCyan}${colors.black} ${suite.tier} ${colors.reset} ` : '';
    console.log(`\n${indent}${tierBadge}${colors.bold}${colors.brightCyan}${suite.name}${colors.reset}`);

    const suiteStartTime = performance.now();
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    const testResults: SuiteResult['tests'] = [];

    // Run beforeAll hooks
    for (const hook of suite.beforeAllHooks) {
      try {
        await hook();
      } catch (err: any) {
        console.error(`${indent}  ${colors.red}${symbols.cross} beforeAll hook failed: ${err.message}${colors.reset}`);
        throw err;
      }
    }

    const beforeEach = this.collectBeforeEach(suite);
    const afterEach = this.collectAfterEach(suite);

    for (const testCase of suite.tests) {
      const isSkipped = testCase.skipped || testCase.todo || (this.hasOnly && !testCase.only);

      if (isSkipped) {
        skipped++;
        testCase.status = 'skipped';
        testResults.push({
          name: testCase.name,
          status: 'skipped',
          durationMs: 0,
        });
        const tag = testCase.todo ? '[TODO]' : '[SKIPPED]';
        console.log(`${indent}  ${colors.yellow}${symbols.bullet} ${tag} ${testCase.name}${colors.reset}`);
        continue;
      }

      const testStart = performance.now();

      try {
        for (const hook of beforeEach) {
          await hook();
        }

        await testCase.fn();

        for (const hook of afterEach) {
          await hook();
        }

        const duration = Math.round(performance.now() - testStart);
        testCase.duration = duration;
        testCase.status = 'passed';
        passed++;

        const timeStr = duration > 50 ? `${colors.yellow}(${duration}ms)${colors.reset}` : `${colors.gray}(${duration}ms)${colors.reset}`;
        console.log(`${indent}  ${colors.green}${symbols.check}${colors.reset} ${colors.white}${testCase.name}${colors.reset} ${timeStr}`);

        testResults.push({
          name: testCase.name,
          status: 'passed',
          durationMs: duration,
        });
      } catch (err: any) {
        const duration = Math.round(performance.now() - testStart);
        testCase.duration = duration;
        testCase.status = 'failed';
        testCase.error = err;
        failed++;

        console.log(`${indent}  ${colors.red}${symbols.cross} ${colors.brightRed}${testCase.name}${colors.reset} ${colors.red}(${duration}ms)${colors.reset}`);
        console.log(`${indent}     ${colors.red}Error: ${err.message || err}${colors.reset}`);
        if (err.stack) {
          const cleanStack = err.stack
            .split('\n')
            .slice(1, 4)
            .map((line: string) => `${indent}     ${colors.gray}${line.trim()}${colors.reset}`)
            .join('\n');
          console.log(cleanStack);
        }

        testResults.push({
          name: testCase.name,
          status: 'failed',
          durationMs: duration,
          error: err,
        });
      }
    }

    // Run child suites
    const childResults: SuiteResult[] = [];
    for (const child of suite.suites) {
      const childRes = await this.runSuite(child, depth + 1);
      childResults.push(childRes);
      passed += childRes.passed;
      failed += childRes.failed;
      skipped += childRes.skipped;
    }

    // Run afterAll hooks
    for (const hook of suite.afterAllHooks) {
      try {
        await hook();
      } catch (err: any) {
        console.error(`${indent}  ${colors.red}${symbols.cross} afterAll hook failed: ${err.message}${colors.reset}`);
      }
    }

    const durationMs = Math.round(performance.now() - suiteStartTime);

    return {
      name: suite.name,
      total: passed + failed + skipped,
      passed,
      failed,
      skipped,
      durationMs,
      tests: testResults,
      childSuites: childResults,
    };
  }

  async runAll(): Promise<SummaryStats> {
    const overallStart = performance.now();
    const suiteResults: SuiteResult[] = [];

    console.log(`${colors.bold}${colors.magenta}======================================================================${colors.reset}`);
    console.log(`${colors.bold}${colors.magenta}  Passion Protocol - E2E Test Suite Runner${colors.reset}`);
    console.log(`${colors.bold}${colors.magenta}======================================================================${colors.reset}`);

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;
    let passedSuites = 0;
    let failedSuites = 0;

    for (const suite of this.rootSuites) {
      const res = await this.runSuite(suite, 0);
      suiteResults.push(res);
      totalTests += res.total;
      passedTests += res.passed;
      failedTests += res.failed;
      skippedTests += res.skipped;

      if (res.failed === 0) {
        passedSuites++;
      } else {
        failedSuites++;
      }
    }

    const durationMs = Math.round(performance.now() - overallStart);

    console.log(`\n${colors.bold}${colors.white}----------------------------------------------------------------------${colors.reset}`);
    console.log(`${colors.bold}Test Suites Summary:${colors.reset}`);
    console.log(
      `Suites:  ${failedSuites > 0 ? `${colors.red}${failedSuites} failed${colors.reset}, ` : ''}${colors.green}${passedSuites} passed${colors.reset}, ${this.rootSuites.length} total`
    );
    console.log(
      `Tests:   ${failedTests > 0 ? `${colors.red}${failedTests} failed${colors.reset}, ` : ''}${skippedTests > 0 ? `${colors.yellow}${skippedTests} skipped${colors.reset}, ` : ''}${colors.green}${passedTests} passed${colors.reset}, ${totalTests} total`
    );
    console.log(`Time:    ${colors.cyan}${(durationMs / 1000).toFixed(2)}s${colors.reset}`);
    console.log(`${colors.bold}${colors.white}----------------------------------------------------------------------${colors.reset}`);

    if (failedTests === 0) {
      console.log(`${colors.bgGreen}${colors.black}${colors.bold} PASS ${colors.reset} ${colors.green}All tests executed successfully with 0 failures.${colors.reset}\n`);
    } else {
      console.log(`${colors.bgRed}${colors.white}${colors.bold} FAIL ${colors.reset} ${colors.red}${failedTests} test(s) failed.${colors.reset}\n`);
    }

    return {
      totalSuites: this.rootSuites.length,
      passedSuites,
      failedSuites,
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      durationMs,
      suiteResults,
    };
  }
}

// Global registry instance
export const globalRegistry = new TestRegistry();

// ============================================================================
// Public BDD API
// ============================================================================

export interface DescribeFn {
  (name: string, fn: () => void): void;
  tier(tierName: string, name: string, fn: () => void): void;
  skip(name: string, fn: () => void): void;
  only(name: string, fn: () => void): void;
}

export const describe: DescribeFn = Object.assign(
  function describe(name: string, fn: () => void): void {
    globalRegistry.createSuite(name, fn);
  },
  {
    tier(tierName: string, name: string, fn: () => void): void {
      globalRegistry.createSuite(name, fn, tierName);
    },
    skip(name: string, fn: () => void): void {
      globalRegistry.createSuite(`[SKIPPED] ${name}`, fn);
    },
    only(name: string, fn: () => void): void {
      globalRegistry.createSuite(name, fn);
    },
  }
);

export interface TestKeyword {
  (name: string, fn: TestFn): void;
  skip(name: string, fn: TestFn): void;
  only(name: string, fn: TestFn): void;
  todo(name: string): void;
}

export const test: TestKeyword = Object.assign(
  function test(name: string, fn: TestFn): void {
    globalRegistry.addTest(name, fn);
  },
  {
    skip(name: string, fn: TestFn): void {
      globalRegistry.addTest(name, fn, { skipped: true });
    },
    only(name: string, fn: TestFn): void {
      globalRegistry.addTest(name, fn, { only: true });
    },
    todo(name: string): void {
      globalRegistry.addTest(name, () => {}, { todo: true });
    },
  }
);

export const it = test;

export function beforeEach(fn: HookFn): void {
  globalRegistry.addHook('beforeEach', fn);
}

export function afterEach(fn: HookFn): void {
  globalRegistry.addHook('afterEach', fn);
}

export function beforeAll(fn: HookFn): void {
  globalRegistry.addHook('beforeAll', fn);
}

export function afterAll(fn: HookFn): void {
  globalRegistry.addHook('afterAll', fn);
}

let isRunnerExecuting = false;

export async function runSuites(): Promise<SummaryStats> {
  isRunnerExecuting = true;
  return await globalRegistry.runAll();
}

export function resetRegistry(): void {
  globalRegistry.reset();
}

// Standalone execution runner: if a test file is run directly (not via runner.ts)
if (typeof process !== 'undefined' && process.argv && process.argv[1]) {
  const scriptPath = process.argv[1].replace(/\\/g, '/');
  if (!scriptPath.endsWith('/runner.ts') && scriptPath.endsWith('.test.ts')) {
    setTimeout(async () => {
      if (!isRunnerExecuting) {
        isRunnerExecuting = true;
        const stats = await globalRegistry.runAll();
        if (stats.failedTests > 0) {
          process.exit(1);
        } else {
          process.exit(0);
        }
      }
    }, 20);
  }
}
