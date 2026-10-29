// Isolated packaging fixtures only: no renders are created in the project.
// Run: node --test scripts/packaging.test.mjs
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const repository = join(dirname(fileURLToPath(import.meta.url)), '..');
const slugs = ['former-electricite', 'securiser-usine', 'expliquer-pac', 'accompagner-solaire'];
const media = slugs.flatMap((slug) => ['mp4', 'webp'].map((ext) => `${slug}.${ext}`));

// Independent bit-at-a-time reference; no Node 22-only zlib.crc32 dependency.
function referenceCrc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'phaness-packaging-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'scripts'));
  for (const file of ['build-zip.mjs', 'sync-videos.mjs']) {
    await cp(join(repository, 'scripts', file), join(root, 'scripts', file));
  }
  const theme = join(repository, 'theme');
  await cp(theme, join(root, 'theme'), {
    recursive: true,
    filter: (path) => !relative(theme, path).replaceAll('\\', '/').startsWith('assets/video'),
  });
  await mkdir(join(root, 'videos', 'out'), { recursive: true });
  for (const file of media) {
    // These bytes test copying/archiving, not video decoding or visual quality.
    await writeFile(join(root, 'videos', 'out', file), `SYNTHETIC TEST FIXTURE: ${file}\n`);
  }
  await mkdir(join(root, 'dist'));
  await writeFile(join(root, 'dist', 'phaness.zip'), 'obsolete archive');
  await writeFile(join(root, 'dist', 'phaness.zip.tmp'), 'interrupted previous build');
  return root;
}

function run(root, script = 'build-zip.mjs') {
  return spawnSync(process.execPath, [join(root, 'scripts', script)], { cwd: root, encoding: 'utf8' });
}

async function blocked(root, pattern) {
  const result = run(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, pattern);
  await assert.rejects(lstat(join(root, 'dist', 'phaness.zip')), { code: 'ENOENT' });
  await assert.rejects(lstat(join(root, 'dist', 'phaness.zip.tmp')), { code: 'ENOENT' });
}

test('ZIP contents, central directory, CRC and extraction match the theme', async (t) => {
  const root = await fixture(t);
  const video = join(root, 'theme', 'assets', 'video');
  await mkdir(video, { recursive: true });
  await writeFile(join(video, 'old-v1.mp4'), 'stale fixture');
  await writeFile(join(video, '.gitkeep'), '');
  await writeFile(join(root, 'theme', 'debug.log'), 'excluded');
  await writeFile(join(root, 'theme', 'bundle.js.map'), 'excluded');
  await writeFile(join(root, 'theme', 'épreuve.txt'), 'UTF-8 filename and deflated content');
  await writeFile(join(root, 'theme', 'crc-vector.txt'), '123456789');
  await writeFile(join(root, 'theme', 'empty.txt'), '');
  const result = run(root);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  await assert.rejects(lstat(join(video, 'old-v1.mp4')), { code: 'ENOENT' });
  const zip = await readFile(join(root, 'dist', 'phaness.zip'));
  const end = zip.length - 22;
  assert.equal(zip.readUInt32LE(end), 0x06054b50);
  const count = zip.readUInt16LE(end + 10);
  let cursor = zip.readUInt32LE(end + 16);
  const names = [];
  const methods = new Set();
  for (let i = 0; i < count; i++) {
    assert.equal(zip.readUInt32LE(cursor), 0x02014b50);
    const method = zip.readUInt16LE(cursor + 10);
    const crc = zip.readUInt32LE(cursor + 16);
    const compressed = zip.readUInt32LE(cursor + 20);
    const size = zip.readUInt32LE(cursor + 24);
    const nameLength = zip.readUInt16LE(cursor + 28);
    const name = zip.subarray(cursor + 46, cursor + 46 + nameLength).toString('utf8');
    const local = zip.readUInt32LE(cursor + 42);
    assert.equal(zip.readUInt32LE(local), 0x04034b50);
    assert.equal(zip.readUInt16LE(local + 6), 0x0800);
    assert.equal(zip.readUInt16LE(local + 8), method);
    assert.equal(zip.readUInt32LE(local + 14), crc);
    assert.equal(zip.subarray(local + 30, local + 30 + nameLength).toString('utf8'), name);
    assert.ok(name.startsWith('phaness/'));
    assert.ok(!name.includes('..'));
    const start = local + 30 + nameLength + zip.readUInt16LE(local + 28);
    const body = zip.subarray(start, start + compressed);
    const extracted = method === 8 ? inflateRawSync(body) : body;
    assert.equal(extracted.length, size);
    assert.equal(referenceCrc32(extracted), crc, name);
    if (name === 'phaness/crc-vector.txt') assert.equal(crc, 0xcbf43926);
    if (name === 'phaness/empty.txt') assert.equal(crc, 0);
    assert.deepEqual(extracted, await readFile(join(root, 'theme', name.slice('phaness/'.length))));
    names.push(name);
    methods.add(method);
    cursor += 46 + nameLength + zip.readUInt16LE(cursor + 30) + zip.readUInt16LE(cursor + 32);
  }
  assert.equal(cursor, end);
  assert.equal(zip.readUInt32LE(end + 12), end - zip.readUInt32LE(end + 16));
  assert.deepEqual([...methods].sort(), [0, 8]);
  assert.equal(new Set(names).size, count);
  for (const file of media) assert.ok(names.includes(`phaness/assets/video/${file}`));
  assert.ok(names.includes('phaness/épreuve.txt'));
  assert.ok(!names.some((name) => /old-v1|gitkeep|debug\.log|\.map$/.test(name)));
  // Independent reader where available; all assertions above remain portable.
  const verify = spawnSync('unzip', ['-t', join(root, 'dist', 'phaness.zip')], { encoding: 'utf8' });
  if (!verify.error) {
    assert.equal(verify.status, 0, verify.stdout + verify.stderr);
    // macOS's older unzip can misdecode UTF-8 names. The UTF-8 entry is checked
    // above; independently extract every ASCII production path with unzip.
    const asciiNames = names.filter((name) => /^[\x20-\x7e]+$/.test(name));
    const extract = spawnSync('unzip', ['-q', join(root, 'dist', 'phaness.zip'), ...asciiNames, '-d', join(root, 'extracted')]);
    assert.equal(extract.status, 0, String(extract.stderr));
    for (const name of asciiNames) assert.deepEqual(await readFile(join(root, 'extracted', name)), await readFile(join(root, 'theme', name.slice(8))));
  }
});

test('every required theme file blocks packaging when missing', async (t) => {
  const root = await fixture(t);
  async function files(dir) {
    const found = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) found.push(...await files(path));
      else found.push(path);
    }
    return found;
  }
  // All currently shipped theme files are runtime files or the font licence.
  for (const path of await files(join(root, 'theme'))) {
    const data = await readFile(path);
    await rm(path);
    await blocked(root, /Required file|Cannot read/);
    await writeFile(path, data);
  }
});

test('missing or empty MP4/poster blocks packaging', async (t) => {
  const root = await fixture(t);
  for (const file of media) {
    const path = join(root, 'videos', 'out', file);
    const bytes = await readFile(path);
    await rm(path);
    await blocked(root, /Required file/);
    await writeFile(path, '');
    await blocked(root, /Video sync failed/);
    await writeFile(path, bytes);
  }
});

test('missing source folder cannot reuse old theme media or ZIP', async (t) => {
  const root = await fixture(t);
  assert.equal(run(root).status, 0);
  await rm(join(root, 'videos', 'out'), { recursive: true });
  await blocked(root, /Video sync failed/);
});

test('empty render source fails synchronization', async (t) => {
  const root = await fixture(t);
  await rm(join(root, 'videos', 'out'), { recursive: true });
  await mkdir(join(root, 'videos', 'out'));
  await blocked(root, /No rendered videos or posters/);
});

test('sync I/O error blocks packaging and removes stale ZIP', async (t) => {
  const root = await fixture(t);
  await writeFile(join(root, 'theme', 'assets', 'video'), 'destination is a file');
  await blocked(root, /Video sync failed/);
});

test('media directories and symlinks fail before destination changes', async (t) => {
  const root = await fixture(t);
  const file = join(root, 'videos', 'out', media[0]);
  const sentinel = join(root, 'theme', 'assets', 'video', 'keep.mp4');
  await mkdir(dirname(sentinel), { recursive: true });
  await writeFile(sentinel, 'unchanged');
  await rm(file);
  await mkdir(file);
  await blocked(root, /Invalid rendered file/);
  assert.equal(await readFile(sentinel, 'utf8'), 'unchanged');
  await rm(file, { recursive: true });
  await symlink(join(root, 'videos', 'out', media[1]), file);
  await blocked(root, /Invalid rendered file/);
});

test('empty, renamed and duplicated video declarations cannot bypass catalogue checks', async (t) => {
  const root = await fixture(t);
  const path = join(root, 'theme', 'patterns', 'work.php');
  const original = await readFile(path, 'utf8');
  for (const work of ['', '<?php // no catalogue', original.replace(slugs[0], 'unknown-film'), original.replace(slugs[0], slugs[1])]) {
    await writeFile(path, work);
    await blocked(root, /four approved V2 video slugs/);
  }
  // Both PHP string quote styles are supported.
  await writeFile(path, original.replaceAll("'slug'", '"slug"').replace(/=> '([a-z-]+)'/g, '=> "$1"'));
  assert.equal(run(root).status, 0);
});

test('empty required file and symlinked runtime asset are rejected', async (t) => {
  const root = await fixture(t);
  const path = join(root, 'theme', 'assets', 'js', 'site.js');
  await writeFile(path, '');
  await blocked(root, /not a non-empty regular file/);
  await rm(path);
  await symlink(join(root, 'theme', 'assets', 'js', 'hero.js'), path);
  await blocked(root, /not a non-empty regular file/);
});

test('extra symlink cannot be silently omitted from the archive', async (t) => {
  const root = await fixture(t);
  await symlink(join(root, 'theme', 'style.css'), join(root, 'theme', 'extra.css'));
  await blocked(root, /Cannot package a symlink or special file/);
});
