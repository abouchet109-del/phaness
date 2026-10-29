// Build every film: copy the shared system (_system/assets) into <film>/assets and bundle
// <film>/src/scene.js (three.js + the shared engine) into <film>/assets/scene.js.
// Usage: node build.mjs [film ...]
import { cpSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = dirname(fileURLToPath(import.meta.url));
const FILMS = ["expliquer-pac", "securiser-usine", "accompagner-solaire", "former-electricite"];
const names = process.argv.slice(2).length ? process.argv.slice(2) : FILMS;

for (const film of names) {
  const dir = join(root, film);
  if (!existsSync(join(dir, "src", "scene.js"))) continue;
  cpSync(join(root, "_system", "assets"), join(dir, "assets"), { recursive: true });
  await build({
    entryPoints: [join(dir, "src", "scene.js")],
    outfile: join(dir, "assets", "scene.js"),
    bundle: true,
    format: "iife",
    minify: true,
    target: "es2020",
    legalComments: "none",
    logLevel: "warning",
  });
  console.log(`built ${film}`);
}
