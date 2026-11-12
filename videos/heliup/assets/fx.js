// Text entrances shared by the scenes: lines rise 22 px under a mask, stay still, leave before the next move.
(function () {
  window.FX = {
    rise(tl, sel, t, dur, stagger) { tl.fromTo(sel, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: dur || 0.45, ease: "power3.out", stagger: stagger == null ? 0.1 : stagger }, t); },
    out(tl, sel, t, dur) { tl.to(sel, { opacity: 0, duration: dur || 0.22, ease: "power2.in" }, t); },
    // box that wipes in from the left (right-angled cartouches)
    wipe(tl, sel, t, dur) { tl.fromTo(sel, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: dur || 0.4, ease: "power3.out" }, t); },
  };
})();
