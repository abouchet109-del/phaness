// Copies the shared Phaness video system (_system/) into every video project.
// Edit the shared files in _system/, then run: node sync-system.mjs
import { cpSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const VIDEOS = ["former-pas", "securiser-epi", "expliquer-pac", "accompagner-radiateur"];
const SHARED_SCENES = ["sky.html", "intro.html", "outro.html"];
const root = new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

for (const video of VIDEOS) {
  const dir = join(root, video);
  if (!existsSync(dir)) continue;
  cpSync(join(root, "_system", "assets"), join(dir, "assets"), { recursive: true });
  for (const scene of SHARED_SCENES) {
    cpSync(join(root, "_system", "compositions", scene), join(dir, "compositions", scene));
  }
  console.log(`synced ${video}: ${readdirSync(join(dir, "compositions")).join(", ")}`);
}
