// Copy rendered demo videos (videos/out/*.mp4, *.webp) into the theme.
// Mirrors the folder: stale renders in the theme are removed.
// Usage: npm run sync-videos
import { copyFile, lstat, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'videos', 'out');
const dest = join(root, 'theme', 'assets', 'video');

async function main() {
  const files = (await readdir(src)).filter((f) => /\.(mp4|webp)$/i.test(f));
  if (!files.length) throw new Error(`No rendered videos or posters in ${src}.`);
  // Check the entire source before changing the destination. Do not hide access errors
  // or treat a directory/symlink named *.mp4 as a rendered file.
  for (const f of files) {
    const info = await lstat(join(src, f));
    if (!info.isFile() || info.size === 0) throw new Error(`Invalid rendered file: ${f} (expected a non-empty regular file).`);
  }

  await mkdir(dest, { recursive: true });
  if (!(await lstat(dest)).isDirectory()) throw new Error(`Video destination must be a regular directory: ${dest}`);
  for (const f of files) {
    try {
      const info = await lstat(join(dest, f));
      if (!info.isFile()) throw new Error(`Video destination is not a regular file: ${f}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  for (const f of files) {
    await copyFile(join(src, f), join(dest, f));
    console.log(`copied ${f}`);
  }
  for (const f of await readdir(dest)) {
    if (/\.(mp4|webp)$/i.test(f) && !files.includes(f)) {
      await rm(join(dest, f));
      console.log(`removed stale ${f}`);
    }
  }
  console.log(`${files.length} file(s) synced to theme/assets/video/`);
}

try {
  await main();
} catch (error) {
  console.error(`Video sync failed: ${error.message}`);
  process.exitCode = 1;
}
