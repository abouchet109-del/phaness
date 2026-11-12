// Axonometric helpers for the HELIUP film. Plan units: x runs right-down, y runs left-down, z is up.
// Flat artwork is authored in plan coordinates inside a <g transform="matrix(...)">; vertical faces use faceX / faceY.
(function () {
  const C = 0.8660254, S = 0.5;
  const f = (n) => +n.toFixed(3);
  function Iso(k, ox, oy) { this.k = k; this.ox = ox; this.oy = oy; }
  Iso.prototype = {
    p(x, y, z) { z = z || 0; return [this.ox + (x - y) * C * this.k, this.oy + (x + y) * S * this.k - z * this.k]; },
    pts(a) { return a.map((q) => this.p(q[0], q[1], q[2]).map(f).join(",")).join(" "); },
    // plan (x, y) at height z -> screen
    top(z) { const o = this.p(0, 0, z || 0), k = this.k; return `matrix(${f(C * k)} ${f(S * k)} ${f(-C * k)} ${f(S * k)} ${f(o[0])} ${f(o[1])})`; },
    // face of constant y: u = x, v = z (up)
    faceY(y, z) { const o = this.p(0, y, z || 0), k = this.k; return `matrix(${f(C * k)} ${f(S * k)} 0 ${f(-k)} ${f(o[0])} ${f(o[1])})`; },
    // face of constant x: u = y, v = z (up)
    faceX(x, z) { const o = this.p(x, 0, z || 0), k = this.k; return `matrix(${f(-C * k)} ${f(S * k)} 0 ${f(-k)} ${f(o[0])} ${f(o[1])})`; },
    poly(a, fill, extra) { return `<polygon points="${this.pts(a)}" fill="${fill}" ${extra || ""}/>`; },
    // box with its 3 visible faces. c = {top, l, r, stroke, sw}
    box(x, y, z, w, d, h, c, id) {
      const st = c.stroke ? `stroke="${c.stroke}" stroke-width="${c.sw || 1}" stroke-linejoin="round"` : "";
      return `<g ${id ? `id="${id}"` : ""}>` +
        this.poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], c.l, st) +
        this.poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], c.r, st) +
        this.poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], c.top, st) + `</g>`;
    },
  };
  window.Iso = Iso;
  window.HF = { C, S, f, NAVY: "#00043E", CYAN: "#07BDF0", WB: "#F7FAFF", LAV: "#D0CDF1", BK: "#000F08" };
})();
