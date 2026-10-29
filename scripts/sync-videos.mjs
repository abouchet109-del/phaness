// Copy rendered demo videos (videos/out/*.mp4, *.webp) into the theme.
// Usage: npm run sync-videos
import { copyFile, mkdir, readdir } from 'node:fs/promises';
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
for (const f of files) {
  await copyFile(join(src, f), join(dest, f));
  console.log(`copied ${f}`);
}
console.log(`${files.length} file(s) synced to theme/assets/video/`);
