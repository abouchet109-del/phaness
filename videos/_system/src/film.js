// Glue between the film composition (GSAP clock, overlay labels) and the 3D scene.
import { createStage } from "./engine.js";

// build(stage, anchors) sets up the world and returns frame(t) -> whiteness (0..1) for the cloud wipe.
export async function run(build) {
  const host = window.__phFilm;
  try {
    await document.fonts.load('600 100px "Geist"');
  } catch (e) {
    /* the overlay still falls back to the next family */
  }
  const stage = createStage(document.getElementById("film-canvas"));
  const anchors = {};
  const frame = await build(stage, anchors);
  const els = Array.from(document.querySelectorAll("[data-anchor]"));
  host.render = (t) => {
    const white = frame(t) || 0;
    stage.render(t, white);
    for (const el of els) {
      const a = anchors[el.dataset.anchor];
      if (!a) continue;
      const p = stage.project(typeof a === "function" ? a(t) : a);
      el.style.left = p.x.toFixed(1) + "px";
      el.style.top = p.y.toFixed(1) + "px";
    }
  };
  host.render(host.clock.t);
  host.ready();
}
