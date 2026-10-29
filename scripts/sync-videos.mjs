// Copy rendered demo videos (videos/out/*.mp4, *.webp) into the theme.
// Mirrors the folder: stale renders in the theme are removed.
// Usage: npm run sync-videos
import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'videos', 'out');
const dest = join(root, 'theme', 'assets', 'video');

let files;
try {
  files = (await readdir(src)).filter((f) => /\.(mp4|webp)$/i.test(f));
} catch {
  console.log(`No ${src} folder yet: nothing to copy.`);
  process.exit(0);
}

await mkdir(dest, { recursive: true });
for (const f of await readdir(dest)) {
  if (/\.(mp4|webp)$/i.test(f) && !files.includes(f)) {
    await rm(join(dest, f));
    console.log(`removed stale ${f}`);
  }
}
for (const f of files) {
  await copyFile(join(src, f), join(dest, f));
  console.log(`copied ${f}`);
}
console.log(`${files.length} file(s) synced to theme/assets/video/`);
