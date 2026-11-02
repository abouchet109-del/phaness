// Copy the shared system (_system/assets) into each film's assets/. Films load it from there.
// Usage: node build.mjs [film ...]            default: the five V3 films that have an index.html
//        node build.mjs --new <film>          empty the film folder and start it from _system/template
import { cpSync, existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const FILMS = ["presentation-phaness", "former-electricite", "securiser-usine", "expliquer-pac", "accompagner-solaire"];
const args = process.argv.slice(2);

if (args[0] === "--new") {
  const film = args[1];
  if (!FILMS.includes(film)) throw new Error(`Unknown film: ${film}`);
  const dir = join(root, film);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  cpSync(join(root, "_system", "template"), dir, { recursive: true });
  writeFileSync(join(dir, "meta.json"), JSON.stringify({ id: film, name: film, createdAt: new Date().toISOString() }, null, 2) + "\n");
  args.splice(0, 2, film);
}

for (const film of args.length ? args : FILMS) {
  const dir = join(root, film);
  if (!existsSync(join(dir, "index.html"))) continue;
  // V2 folders still hold a bundled three.js scene: leave them alone until they are restarted.
  if (existsSync(join(dir, "src", "scene.js"))) continue;
  cpSync(join(root, "_system", "assets"), join(dir, "assets"), { recursive: true });
  console.log(`built ${film}`);
}
