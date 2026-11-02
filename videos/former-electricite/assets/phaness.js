// Phaness video system V3: camera, thread and reveal helpers. Every helper adds tweens to a paused GSAP
// timeline, so every frame stays a pure function of time. Requires gsap.
window.PH = (() => {
  const EASE = {
    arrive: "expo.out", // text and objects landing
    land: "power4.out", // heavier objects landing
    move: "power3.inOut", // camera and thread
    soft: "sine.inOut", // bumps inside a move
    exit: "power3.in", // leaving, zoom through
    spring: "back.out(1.5)", // position and scale only, never opacity
  };
  const $ = (s) => (typeof s === "string" ? document.querySelector(s) : s);
  const $$ = (s) => (typeof s === "string" ? Array.from(document.querySelectorAll(s)) : [].concat(s));

  // Camera. A view is {x, y, z, rx, ry, rz}: the world point at screen centre, zoom, tilt/orbit/roll in degrees.
  function camera(tl, start) {
    const world = $("#world");
    const lens = $("#lens");
    const vars = (v) => {
      const o = {};
      for (const k of ["x", "y", "z"]) if (v[k] != null) o["--" + k] = v[k];
      for (const k of ["rx", "ry", "rz"]) if (v[k] != null) o["--" + k] = v[k] + "deg";
      return o;
    };
    gsap.set(world, vars({ x: 960, y: 540, z: 1, rx: 0, ry: 0, rz: 0, ...start }));
    return {
      // Plain move, for reframes and slow orbits.
      to(at, view, dur = 1.2, ease = EASE.move) {
        tl.to(world, { ...vars(view), duration: dur, ease }, at);
        return this;
      },
      // Move between two places: pulls back and tilts in mid-flight (`via`), with a blur peak at top speed.
      travel(at, view, dur = 1.3, { via = {}, blur = 5, ease = EASE.move } = {}) {
        const main = { ...view };
        for (const k of Object.keys(via)) delete main[k];
        tl.to(world, { ...vars(main), duration: dur, ease }, at);
        for (const k of Object.keys(via)) {
          tl.to(world, { ...vars({ [k]: via[k] }), duration: dur / 2, ease: EASE.soft }, at);
          tl.to(world, { ...vars({ [k]: view[k] ?? 0 }), duration: dur / 2, ease: EASE.soft }, at + dur / 2);
        }
        if (blur) {
          tl.to(lens, { filter: `blur(${blur}px)`, duration: dur / 2, ease: "power2.in" }, at);
          tl.to(lens, { filter: "blur(0px)", duration: dur / 2, ease: "power2.out" }, at + dur / 2);
        }
        return this;
      },
    };
  }

  // The green thread: one path through the whole film, cut into named segments.
  // segs: [["name", "M ..."], ["next", "L ..."]]. paths: selectors of paths that share the same d (a white copy, say).
  function thread(tl, { paths, head, segs }) {
    const els = $$(paths.join(","));
    const headEl = head ? $(head) : null;
    const d = segs.map((s) => s[1]).join(" ");
    const probe = document.createElementNS("http://www.w3.org/2000/svg", "path");
    probe.setAttribute("d", d);
    const total = probe.getTotalLength();
    const marks = {};
    let prefix = "";
    for (const [name, part] of segs) {
      prefix += part + " ";
      probe.setAttribute("d", prefix);
      marks[name] = probe.getTotalLength() / total;
    }
    for (const el of els) {
      el.setAttribute("d", d);
      el.setAttribute("pathLength", "1");
      gsap.set(el, { attr: { "stroke-dasharray": "1 1.01", "stroke-dashoffset": 1 }, opacity: 0 });
    }
    if (headEl) {
      headEl.style.offsetPath = `path("${d}")`;
      gsap.set(headEl, { opacity: 0 });
    }
    let cur = 0;
    return {
      total,
      show(at) {
        tl.set(els, { opacity: 1 }, at);
        if (headEl) tl.set(headEl, { opacity: 1 }, at);
        return this;
      },
      hideHead(at) {
        if (headEl) tl.to(headEl, { scale: 0, duration: 0.25, ease: EASE.exit }, at);
        return this;
      },
      // Draw up to the end of segment `name`. Calls go in chronological order.
      to(at, dur, name, { ease = EASE.move } = {}) {
        const end = marks[name];
        tl.to(els, { attr: { "stroke-dashoffset": 1 - end }, duration: dur, ease }, at);
        if (headEl) tl.to(headEl, { offsetDistance: end * 100 + "%", duration: dur, ease }, at);
        cur = end;
        return this;
      },
    };
  }

  // Stroke drawing for any SVG shapes. Hidden shapes get opacity 0 so round caps leave no dot.
  function draw(tl, sel, at, { dur = 0.8, stagger = 0.06, ease = "power2.inOut" } = {}) {
    $$(sel).forEach((el, i) => {
      el.setAttribute("pathLength", "1");
      gsap.set(el, { attr: { "stroke-dasharray": "1 1.01", "stroke-dashoffset": 1 }, opacity: 0 });
      tl.set(el, { opacity: 1 }, at + i * stagger);
      tl.to(el, { attr: { "stroke-dashoffset": 0 }, duration: dur, ease }, at + i * stagger);
    });
  }

  function split(el, unit) {
    const text = el.textContent;
    el.textContent = "";
    el.setAttribute("aria-label", text);
    const parts = unit === "letter" ? Array.from(text) : text.split(/(?<=\s)/);
    return parts.map((p) => {
      const s = document.createElement("span");
      s.className = "ph-word";
      s.textContent = p;
      el.appendChild(s);
      return s;
    });
  }

  // Word by word, out of a light blur, no translate.
  function words(tl, sel, at, { stagger = 0.08, dur = 0.26 } = {}) {
    const parts = split($(sel), "word");
    gsap.set(parts, { opacity: 0, filter: "blur(6px)" });
    tl.to(parts, { opacity: 1, filter: "blur(0px)", duration: dur, stagger, ease: EASE.arrive }, at);
  }

  // Word by word, from light grey to the text colour, no move at all.
  function ink(tl, sel, at, { from = "#dde5df", stagger = 0.09, dur = 0.3 } = {}) {
    const parts = split($(sel), "word");
    const to = getComputedStyle($(sel)).color;
    gsap.set(parts, { color: from, opacity: 0 });
    tl.set(parts, { opacity: 1, stagger }, at);
    tl.to(parts, { color: to, duration: dur, stagger, ease: "none" }, at);
  }

  // Letter by letter, for a name.
  function letters(tl, sel, at, { stagger = 0.05, dur = 0.34 } = {}) {
    const parts = split($(sel), "letter");
    gsap.set(parts, { opacity: 0, filter: "blur(5px)" });
    tl.to(parts, { opacity: 1, filter: "blur(0px)", duration: dur, stagger, ease: EASE.arrive }, at);
  }

  // Masked rise for a whole line.
  function rise(tl, sel, at, { dur = 0.7, y = 26 } = {}) {
    gsap.set(sel, { opacity: 0, y });
    tl.to(sel, { opacity: 1, duration: dur * 0.5, ease: "none" }, at);
    tl.to(sel, { y: 0, duration: dur, ease: EASE.arrive }, at);
  }

  function out(tl, sel, at, { dur = 0.22 } = {}) {
    tl.to(sel, { opacity: 0, filter: "blur(6px)", duration: dur, ease: "power2.in" }, at);
  }

  // Scale up with a controlled overshoot, for nodes and small objects.
  function pop(tl, sel, at, { dur = 0.5, stagger = 0, origin = "50% 50%" } = {}) {
    gsap.set(sel, { scale: 0, transformOrigin: origin });
    tl.to(sel, { scale: 1, duration: dur, stagger, ease: EASE.spring }, at);
  }

  // Grow out of one edge. dir: "up" | "down" | "left" | "right".
  function grow(tl, sel, at, { dir = "up", dur = 0.7, ease = EASE.land } = {}) {
    const inset = { up: "100% 0 0 0", down: "0 0 100% 0", left: "0 0 0 100%", right: "0 100% 0 0" }[dir];
    gsap.set(sel, { clipPath: `inset(${inset})` });
    tl.to(sel, { clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease }, at);
  }

  // Common ending: green flood opening from a screen point, logo letter by letter, signature, 2.6 s minimum.
  function outro(tl, at, { x = 960, y = 540, dur = 0.75 } = {}) {
    gsap.set("#end", { clipPath: `circle(0px at ${x}px ${y}px)` });
    tl.to("#end", { clipPath: `circle(2300px at ${x}px ${y}px)`, duration: dur, ease: "power3.inOut" }, at);
    letters(tl, "#end .ph-logo", at + 0.35);
    words(tl, "#end .ph-sign", at + 0.85);
  }

  return { EASE, camera, thread, draw, words, ink, letters, rise, out, pop, grow, outro };
})();
