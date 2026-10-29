// Hero regressions use a simulated GPU; no browser or dependency is required.
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(repo, path), 'utf8');
const heroSource = read('theme/assets/js/hero.js').replace('export function mountHero', 'function mountHero') + '\nglobalThis.mountHero=mountHero;';
const documentStub = () => ({ hidden: false, addEventListener() {}, removeEventListener() {} });

test('CSS fallback and context restoration work without WebGL or IntersectionObserver', () => {
  const events = {};
  const window = { matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }), addEventListener() {}, removeEventListener() {}, devicePixelRatio: 1 };
  const canvas = { style: {}, getBoundingClientRect: () => ({ width: 390, height: 800 }), getContext: () => null, addEventListener(type, fn) { events[type] = fn; }, removeEventListener() {} };
  const context = vm.createContext({ window, document: documentStub(), Uint8Array, Float32Array, performance: { now: () => 0 }, requestAnimationFrame() { throw new Error('Unexpected WebGL animation'); }, cancelAnimationFrame() {} });
  vm.runInContext(heroSource, context);
  const hero = context.mountHero(canvas);
  assert.equal(hero.webgl, false);
  assert.match(canvas.style.background, /radial-gradient/);
  events.webglcontextrestored();
  assert.equal(hero.webgl, false);
  hero.destroy();
});

test('GPU compilation stays asynchronous and reduced motion has no animation loop', () => {
  const queue = new Map();
  let seq = 0, compiled = false, links = 0, draws = 0;
  const gl = new Proxy({ LINK_STATUS: 1, createShader: () => ({}), createProgram: () => ({}), getExtension: () => ({ COMPLETION_STATUS_KHR: 2 }), getProgramParameter(_p, status) { if (status === 2) return compiled; assert.equal(compiled, true); links++; return true; }, isContextLost: () => false, drawArrays() { draws++; } }, { get(target, key) { return key in target ? target[key] : (() => {}); } });
  const window = { matchMedia: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }), devicePixelRatio: 1, addEventListener() {}, removeEventListener() {} };
  const canvas = { style: {}, width: 300, height: 150, getBoundingClientRect: () => ({ width: 390, height: 800 }), getContext: () => gl, addEventListener() {}, removeEventListener() {} };
  const context = vm.createContext({ window, document: documentStub(), Uint8Array, Float32Array, performance: { now: () => 0 }, requestAnimationFrame(fn) { const id = ++seq; queue.set(id, fn); return id; }, cancelAnimationFrame(id) { queue.delete(id); } });
  vm.runInContext(heroSource, context);
  const hero = context.mountHero(canvas);
  assert.equal(links, 0); assert.equal(draws, 0); assert.match(canvas.style.background, /radial-gradient/); assert.equal(queue.size, 1);
  compiled = true;
  const [id, finish] = queue.entries().next().value;
  queue.delete(id); finish();
  assert.equal(links, 1); assert.ok(draws > 0); assert.equal(canvas.style.background, ''); assert.equal(queue.size, 0);
  hero.destroy();
});
