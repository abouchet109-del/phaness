// Build dist/phaness.zip: the theme folder (as phaness/) ready to upload in WordPress.
// Syncs the rendered videos first, checks required files, then writes the zip
// with Node built-ins only (no zip tool needed).
// Usage: npm run build:zip
import { spawnSync } from 'node:child_process';
import { crc32, deflateRawSync } from 'node:zlib';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const themeDir = join(root, 'theme');
const outFile = join(root, 'dist', 'phaness.zip');
const FOLDER = 'phaness';

// Development and system files that must not ship.
const EXCLUDE = /(^|\/)(\.git|node_modules|\.DS_Store|Thumbs\.db|desktop\.ini|\.gitignore|\.gitkeep)(\/|$)|\.(log|map|zip|bak|orig|tmp)$|~$/i;

// 1. Videos
const sync = spawnSync(process.execPath, [join(root, 'scripts', 'sync-videos.mjs')], { stdio: 'inherit' });
if (sync.status !== 0) {
  console.error('Video sync failed.');
  process.exit(1);
}

// 2. Checks
const warnings = [];
for (const f of ['style.css', 'theme.json', 'templates/front-page.html']) {
  if (!existsSync(join(themeDir, f))) warnings.push(`MISSING required file: theme/${f}`);
}
let slugs = [];
try {
  const work = await readFile(join(themeDir, 'patterns', 'work.php'), 'utf8');
  slugs = [...work.matchAll(/'slug'\s*=>\s*'([^']+)'/g)].map((m) => m[1]);
} catch {
  warnings.push('Cannot read theme/patterns/work.php: expected videos not checked.');
}
for (const slug of slugs) {
  for (const ext of ['mp4', 'webp']) {
    if (!existsSync(join(themeDir, 'assets', 'video', `${slug}.${ext}`))) {
      warnings.push(`MISSING video file: theme/assets/video/${slug}.${ext}`);
    }
  }
}

const missingVideos = warnings.filter((warning) => warning.startsWith('MISSING video file:'));
if (missingVideos.length) {
  console.error('\nTheme package not created: render and sync all four demo videos first.');
  for (const warning of missingVideos) console.error(`  - ${warning}`);
  process.exit(1);
}

// 3. Collect files
async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    const rel = relative(themeDir, full).split(sep).join('/');
    if (EXCLUDE.test(rel)) continue;
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (e.isFile()) out.push(rel);
  }
  return out;
}
const files = (await walk(themeDir)).sort();

// 4. Write zip (deflate; store already-compressed media)
const STORED = /\.(mp4|webp|png|jpe?g|woff2?|zip)$/i;
const chunks = [];
const central = [];
let offset = 0;
const dosTime = (d) => ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xffff;
const dosDate = (d) => (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xffff;

for (const rel of files) {
  const data = await readFile(join(themeDir, rel));
  const { mtime } = await stat(join(themeDir, rel));
  const name = Buffer.from(`${FOLDER}/${rel}`, 'utf8');
  const method = STORED.test(rel) ? 0 : 8;
  const body = method === 8 ? deflateRawSync(data, { level: 9 }) : data;
  const crc = crc32(data);
  const h = Buffer.alloc(30);
  h.writeUInt32LE(0x04034b50, 0);
  h.writeUInt16LE(20, 4);
  h.writeUInt16LE(0x0800, 6); // UTF-8 names
  h.writeUInt16LE(method, 8);
  h.writeUInt16LE(dosTime(mtime), 10);
  h.writeUInt16LE(dosDate(mtime), 12);
  h.writeUInt32LE(crc, 14);
  h.writeUInt32LE(body.length, 18);
  h.writeUInt32LE(data.length, 22);
  h.writeUInt16LE(name.length, 26);
  chunks.push(h, name, body);
  const c = Buffer.alloc(46);
  c.writeUInt32LE(0x02014b50, 0);
  c.writeUInt16LE(20, 4);
  c.writeUInt16LE(20, 6);
  c.writeUInt16LE(0x0800, 8);
  c.writeUInt16LE(method, 10);
  c.writeUInt16LE(dosTime(mtime), 12);
  c.writeUInt16LE(dosDate(mtime), 14);
  c.writeUInt32LE(crc, 16);
  c.writeUInt32LE(body.length, 20);
  c.writeUInt32LE(data.length, 24);
  c.writeUInt16LE(name.length, 28);
  c.writeUInt32LE(offset, 42);
  central.push(c, name);
  offset += h.length + name.length + body.length;
}
const cdSize = central.reduce((n, b) => n + b.length, 0);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(cdSize, 12);
end.writeUInt32LE(offset, 16);

await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, Buffer.concat([...chunks, ...central, end]));

const size = (await stat(outFile)).size;
console.log(`\n${files.length} files -> dist/phaness.zip (folder "${FOLDER}/")`);
console.log(`Size: ${(size / 1024 / 1024).toFixed(2)} MB (${size} bytes)`);
if (warnings.length) {
  console.log('\nWARNINGS:');
  for (const w of warnings) console.log(`  - ${w}`);
} else {
  console.log('All required files and videos present.');
}
