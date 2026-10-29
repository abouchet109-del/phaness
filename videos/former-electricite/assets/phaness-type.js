// Phaness film system V2: GSAP helpers for the overlay typography.
// Every helper places tweens at absolute seconds on the film timeline.
window.PH = (function () {
  function split(el, by) {
    if (el.dataset.split) return el.querySelectorAll(by === "letter" ? ".ph-letter" : ".ph-word");
    const text = el.textContent;
    el.textContent = "";
    const parts = by === "letter" ? Array.from(text) : text.split(/(\s+)/);
    parts.forEach(function (p) {
      if (by !== "letter" && /^\s+$/.test(p)) return el.appendChild(document.createTextNode(p));
      const s = document.createElement("span");
      s.className = by === "letter" ? "ph-letter" : "ph-word";
      s.textContent = p;
      el.appendChild(s);
    });
    el.dataset.split = "1";
    return el.querySelectorAll(by === "letter" ? ".ph-letter" : ".ph-word");
  }
  // words blur in one after another, hold dead still, blur out together
  function words(tl, sel, at, out, o) {
    o = o || {};
    const els = split(document.querySelector(sel), "word");
    tl.fromTo(els, { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: o.d || 0.42, ease: "expo.out", stagger: o.stagger || 0.08 }, at);
    if (out != null) tl.to(els, { opacity: 0, filter: "blur(8px)", duration: 0.22, ease: "power2.in", stagger: 0.03 }, out);
  }
  function fade(tl, sel, at, out, o) {
    o = o || {};
    tl.fromTo(sel, { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: o.d || 0.4, ease: "expo.out" }, at);
    if (out != null) tl.to(sel, { opacity: 0, filter: "blur(6px)", duration: 0.2, ease: "power2.in" }, out);
  }
  // a label pinned to a 3D point: dot pops, leader draws, pill lands
  function tag(tl, sel, at, out) {
    const root = document.querySelector(sel);
    const dot = root.querySelector(".ph-dot"), line = root.querySelector(".ph-lead line"), pill = root.querySelector(".ph-tag");
    if (dot) tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.7)" }, at);
    if (line) {
      const len = Math.hypot(line.x2.baseVal.value - line.x1.baseVal.value, line.y2.baseVal.value - line.y1.baseVal.value);
      tl.fromTo(line, { attr: { "stroke-dasharray": len, "stroke-dashoffset": len } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.35, ease: "power3.out" }, at + 0.06);
    }
    tl.fromTo(pill, { opacity: 0, scale: 0.86, filter: "blur(8px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out" }, at + 0.14);
    if (out != null) {
      tl.to(pill, { opacity: 0, filter: "blur(6px)", duration: 0.2, ease: "power2.in" }, out);
      if (line) tl.to(line, { opacity: 0, duration: 0.18 }, out);
      if (dot) tl.to(dot, { scale: 0, duration: 0.2, ease: "power2.in" }, out);
    }
  }
  // chapter mark: number rolls in, word blurs in
  function chapter(tl, sel, at, out) {
    const root = document.querySelector(sel);
    tl.fromTo(root.querySelector(".n"), { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: 0.45, ease: "expo.out" }, at);
    words(tl, sel + " .w", at + 0.08, out);
    if (out != null) tl.to(root.querySelector(".n"), { opacity: 0, duration: 0.2 }, out);
  }
  // logo letter by letter
  function letters(tl, sel, at, o) {
    o = o || {};
    const els = split(document.querySelector(sel), "letter");
    tl.fromTo(els, { opacity: 0, yPercent: 35, filter: "blur(12px)" }, { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 0.7, ease: "expo.out", stagger: o.stagger || 0.07 }, at);
  }
  return { split: split, words: words, fade: fade, tag: tag, chapter: chapter, letters: letters };
})();
