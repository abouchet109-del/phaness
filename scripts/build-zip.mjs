// Build dist/phaness.zip: the theme folder (as phaness/) ready to upload in WordPress.
// Syncs the rendered videos first, checks required files, then writes the zip
// with Node built-ins only (no zip tool needed).
// Usage: npm run build:zip
import { spawnSync } from 'node:child_process';
import { deflateRawSync } from 'node:zlib';
import { lstat, mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const themeDir = join(root, 'theme');
const outFile = join(root, 'dist', 'phaness.zip');
const FOLDER = 'phaness';
const temporaryFile = `${outFile}.tmp`;
// The approved V2 catalogue must stay complete even if work.php cannot be parsed.
const VIDEO_SLUGS = ['former-electricite', 'securiser-usine', 'expliquer-pac', 'accompagner-solaire'];
const REQUIRED = [
  'style.css', 'theme.json', 'functions.php',
  'templates/front-page.html', 'templates/index.html', 'parts/header.html', 'parts/footer.html',
  'inc/cleanup.php', 'inc/legal-pages.php', 'inc/seo.php',
  'assets/css/site.css', 'assets/js/site.js', 'assets/js/hero.js',
  'assets/fonts/Geist-Variable.woff2', 'assets/fonts/OFL.txt',
  'assets/img/favicon.svg', 'assets/img/og.png', 'assets/img/og.svg',
  ...['header', 'footer', 'hero', 'promise', 'offers', 'sectors', 'method', 'difference',
    'why', 'work', 'contact', 'legal-mentions', 'legal-privacy'].map((name) => `patterns/${name}.php`),
];

// Development and system files that must not ship.
const EXCLUDE = /(^|\/)(\.git|node_modules|\.DS_Store|Thumbs\.db|desktop\.ini|\.gitignore|\.gitkeep)(\/|$)|\.(log|map|zip|bak|orig|tmp)$|~$/i;

// ZIP uses IEEE CRC-32. Keep Node 20 support (zlib.crc32 requires Node 22).
const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0);
  return value >>> 0;
});
function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}

async function main() {
  // A failed build must never leave a previous package looking current.
  await rm(outFile, { force: true });
  await rm(temporaryFile, { force: true });

  // 1. Videos
  const sync = spawnSync(process.execPath, [join(root, 'scripts', 'sync-videos.mjs')], { stdio: 'inherit' });
  if (sync.status !== 0) {
    throw new Error(`Video sync failed${sync.error ? `: ${sync.error.message}` : ` (exit ${sync.status}, signal ${sync.signal ?? 'none'})`}.`);
  }

  // 2. Checks
  const errors = [];
  async function requireFile(rel) {
    try {
      const info = await lstat(join(themeDir, rel));
      if (!info.isFile() || info.size === 0) throw new Error('not a non-empty regular file');
    } catch (error) {
      errors.push(`Required file theme/${rel}: ${error.code ?? error.message}`);
    }
  }
  for (const rel of REQUIRED) await requireFile(rel);
  try {
    const work = await readFile(join(themeDir, 'patterns', 'work.php'), 'utf8');
    const slugs = [...work.matchAll(/(['"])slug\1\s*=>\s*(['"])([a-z0-9-]+)\2/g)].map((m) => m[3]);
    if (slugs.length !== VIDEO_SLUGS.length || new Set(slugs).size !== VIDEO_SLUGS.length ||
        VIDEO_SLUGS.some((slug) => !slugs.includes(slug))) {
      errors.push('patterns/work.php must declare exactly the four approved V2 video slugs.');
    }
  } catch (error) {
    errors.push(`Cannot read patterns/work.php: ${error.code ?? error.message}`);
  }
  for (const slug of VIDEO_SLUGS) {
    for (const ext of ['mp4', 'webp']) {
      await requireFile(`assets/video/${slug}.${ext}`);
    }
  }
  if (errors.length) {
    throw new Error(`Theme package not created; required files and all four rendered demos must be present:\n${errors.map((error) => `  - ${error}`).join('\n')}`);
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
      else throw new Error(`Cannot package a symlink or special file: theme/${rel}`);
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
  await writeFile(temporaryFile, Buffer.concat([...chunks, ...central, end]));
  await rename(temporaryFile, outFile);

  const size = (await stat(outFile)).size;
  console.log(`\n${files.length} files -> dist/phaness.zip (folder "${FOLDER}/")`);
  console.log(`Size: ${(size / 1024 / 1024).toFixed(2)} MB (${size} bytes)`);
  console.log('All required files and videos present.');
}

try {
  await main();
} catch (error) {
  await rm(temporaryFile, { force: true });
  await rm(outFile, { force: true });
  console.error(error.message);
  process.exitCode = 1;
}
