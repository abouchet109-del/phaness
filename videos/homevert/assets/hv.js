// HOME Vert demo film: shared drawing helpers. Base 1920x1080 (rendered x2 in 4K).
// Roof plane coordinates: u runs along the eave (metres), v runs up the slope (metres). Everything flat is drawn in plane
// space inside one matrix; the camera is one uniform scale about the panel corner PF, so that corner never moves.
(function () {
  const C = 0.8660254, S = 0.5;
  const f = (n) => +n.toFixed(3);
  const PAL = { green: "#0B8457", greenHi: "#46C08F", anth: "#373640", deep: "#1D1C23", grey: "#EBEBEC", blue: "#F0F5FA", white: "#FFFFFF", amber: "#F2B45A", terra: "#B0553A", alu: "#C5C9CF", beige: "#D9CBAE" };

  // ---------- axonometric projection (plan x right-down, y left-down, z up) ----------
  function Iso(k, ox, oy) { this.k = k; this.ox = ox; this.oy = oy; }
  Iso.prototype = {
    p(x, y, z) { if (Array.isArray(x)) { z = x[2]; y = x[1]; x = x[0]; } z = z || 0; return [this.ox + (x - y) * C * this.k, this.oy + (x + y) * S * this.k - z * this.k]; },
    pts(a) { return a.map((q) => this.p(q[0], q[1], q[2]).map(f).join(",")).join(" "); },
    poly(a, fill, extra) { return `<polygon points="${this.pts(a)}" fill="${fill}" ${extra || ""}/>`; },
    top(z) { const o = this.p(0, 0, z || 0), k = this.k; return `matrix(${f(C * k)} ${f(S * k)} ${f(-C * k)} ${f(S * k)} ${f(o[0])} ${f(o[1])})`; },
    faceY(y, z) { const o = this.p(0, y, z || 0), k = this.k; return `matrix(${f(C * k)} ${f(S * k)} 0 ${f(-k)} ${f(o[0])} ${f(o[1])})`; },
    faceX(x, z) { const o = this.p(x, 0, z || 0), k = this.k; return `matrix(${f(-C * k)} ${f(S * k)} 0 ${f(-k)} ${f(o[0])} ${f(o[1])})`; },
    // matrix for flat artwork on a plane given by a 3D origin and two 3D unit vectors
    plane(o3, u3, v3) {
      const o = this.p(o3), a = this.p(o3[0] + u3[0], o3[1] + u3[1], o3[2] + u3[2]), b = this.p(o3[0] + v3[0], o3[1] + v3[1], o3[2] + v3[2]);
      return `matrix(${f(a[0] - o[0])} ${f(a[1] - o[1])} ${f(b[0] - o[0])} ${f(b[1] - o[1])} ${f(o[0])} ${f(o[1])})`;
    },
    box(x, y, z, w, d, h, c, id) {
      const st = c.stroke ? `stroke="${c.stroke}" stroke-width="${c.sw || 1}" stroke-linejoin="round"` : "";
      return `<g ${id ? `id="${id}"` : ""}>` +
        this.poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], c.l, st) +
        this.poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], c.r, st) +
        this.poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], c.top, st) + `</g>`;
    },
  };

  // ---------- the house: a gable roof (only the front slope is seen), a low plinth, 20 panels ----------
  const G = { W: 14, D: 9.6, ze: 4.6, yr: 4.8, oh: 0.35, cos: Math.cos(Math.PI / 6), sin: 0.5, tan: Math.tan(Math.PI / 6) };
  G.Lv = (G.D + G.oh - G.yr) / G.cos;
  const rp = (u, v) => [u, G.D + G.oh - v * G.cos, G.ze - G.oh * G.tan + v * G.sin]; // roof plane -> world
  const PAN = { w: 1.0, h: 1.7, u0: 2.0, du: 1.06, v0: 1.0, dv: 1.8, cols: 10, rows: 2 };
  const PFUV = [PAN.u0 + 6 * PAN.du + PAN.w, PAN.v0]; // the panel corner that stays still during the pull-back

  function roofMatrix(I) { const o = rp(0, 0), a = rp(1, 0), b = rp(0, 1); return I.plane(o, [a[0] - o[0], a[1] - o[1], a[2] - o[2]], [b[0] - o[0], b[1] - o[1], b[2] - o[2]]); }

  function defs(pre) {
    return `<defs>
      <linearGradient id="${pre}glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22395A"/><stop offset="1" stop-color="#121F34"/></linearGradient>
      <pattern id="${pre}cellD" patternUnits="userSpaceOnUse" width="0.155" height="0.163"><rect x="0.005" y="0.005" width="0.145" height="0.153" rx="0.012" fill="#223D62"/><path d="M0.052 0.01V0.153M0.103 0.01V0.153" stroke="#7F9BBE" stroke-opacity=".22" stroke-width="0.0035"/></pattern>
      <pattern id="${pre}cellL" patternUnits="userSpaceOnUse" width="0.155" height="0.163"><rect x="0.005" y="0.005" width="0.145" height="0.153" rx="0.012" fill="#2F5686"/><path d="M0.052 0.01V0.153M0.103 0.01V0.153" stroke="#C9DBEF" stroke-opacity=".5" stroke-width="0.0035"/><path d="M0.012 0.006H0.14" stroke="#CFE0F3" stroke-opacity=".45" stroke-width="0.004"/></pattern>
      <pattern id="${pre}tile" patternUnits="userSpaceOnUse" width="0.9" height="0.52">
        <rect width="0.9" height="0.52" fill="#B2573B"/>
        <rect x="0" y="0" width="0.3" height="0.26" fill="#A44F35"/><rect x="0.6" y="0" width="0.3" height="0.26" fill="#BA5E41"/><rect x="0.15" y="0.26" width="0.3" height="0.26" fill="#BA5E41"/><rect x="0.75" y="0.26" width="0.3" height="0.26" fill="#A44F35"/>
        <path d="M0 0.255H0.9M0 0.515H0.9" stroke="#5C2415" stroke-opacity=".55" stroke-width="0.03"/>
        <path d="M0 0.285H0.9M0 0.545H0.9" stroke="#E08F6E" stroke-opacity=".25" stroke-width="0.012"/>
        <path d="M0.3 0V0.26M0.6 0V0.26M0.9 0V0.26M0.15 0.26V0.52M0.45 0.26V0.52M0.75 0.26V0.52" stroke="#5C2415" stroke-opacity=".45" stroke-width="0.012"/>
      </pattern>
      <linearGradient id="${pre}roofsh" x1="0" y1="0" x2="1" y2="0.2"><stop offset="0" stop-color="#FFE2B5" stop-opacity=".14"/><stop offset="1" stop-color="#14070A" stop-opacity=".26"/></linearGradient>
      <pattern id="${pre}grain" patternUnits="userSpaceOnUse" width="7" height="7"><circle cx="1.2" cy="1.5" r=".55" fill="#8C7A58" fill-opacity=".22"/><circle cx="4.6" cy="3.4" r=".5" fill="#FFFFFF" fill-opacity=".2"/><circle cx="2.8" cy="5.9" r=".6" fill="#8C7A58" fill-opacity=".18"/><circle cx="6" cy="0.6" r=".45" fill="#FFFFFF" fill-opacity=".15"/></pattern>
      <linearGradient id="${pre}revg" gradientUnits="userSpaceOnUse" x1="-1.3" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
      <linearGradient id="${pre}glintg" gradientUnits="userSpaceOnUse" x1="-0.9" y1="0" x2="0.9" y2="0"><stop offset="0" stop-color="#FFC878" stop-opacity="0"/><stop offset="0.5" stop-color="#FFE3B0" stop-opacity=".8"/><stop offset="1" stop-color="#FFC878" stop-opacity="0"/></linearGradient>
    </defs>`;
  }

  function house(pre, I, o) {
    o = o || {};
    const W = G.W, D = G.D, ze = G.ze, yr = G.yr, zr = ze + (D - yr) * G.tan;
    const P = (u, v) => I.p(rp(u, v));
    let s = defs(pre);
    // ground shadow + plinth
    s += I.poly([[-0.2 + 1.5, -1.2 + 0.9, 0], [W + 1.2 + 1.5, -1.2 + 0.9, 0], [W + 1.2 + 1.5, D + 1.2 + 0.9, 0], [-0.2 + 1.5, D + 1.2 + 0.9, 0]], "rgba(0,0,0,.32)");
    s += I.box(-1.2, -1.2, -0.5, W + 2.4, D + 2.4, 0.5, { top: "#DCDCE0", l: "#A6A6AE", r: "#86868F", stroke: "rgba(255,255,255,.14)", sw: 1 }, pre + "plinth");
    // walls
    s += I.poly([[0, D, 0], [W, D, 0], [W, D, ze], [0, D, ze]], PAL.beige);
    s += I.poly([[0, D, 0], [W, D, 0], [W, D, ze], [0, D, ze]], `url(#${pre}grain)`);
    s += I.poly([[W, 0, 0], [W, D, 0], [W, D, ze], [W, yr, zr], [W, 0, ze]], "#BDAF92");
    s += I.poly([[W, 0, 0], [W, D, 0], [W, D, ze], [W, yr, zr], [W, 0, ze]], `url(#${pre}grain)`);
    // base skirting (socle) of the walls
    s += `<g transform="${I.faceY(D, 0)}"><rect x="0" y="0" width="${W}" height="0.35" fill="#A89A7E"/></g>`;
    // windows on the front wall (face y = D): u = x, v = z
    let win = "";
    [1.6, 5.2, 8.8].forEach((x) => {
      win += `<rect x="${x}" y="1.25" width="2.2" height="2.0" fill="#EEEEF0"/><rect x="${x + 0.12}" y="1.37" width="1.96" height="1.76" fill="#2D3948"/><path d="M${x + 0.12} 1.37L${x + 1.2} 1.37L${x + 0.12} 2.5Z" fill="#7C8DA3" fill-opacity=".35"/><path d="M${x + 1.1} 1.37V3.13" stroke="#EEEEF0" stroke-width="0.07"/><rect x="${x - 0.08}" y="1.17" width="2.36" height="0.08" fill="#BFC2C8"/>`;
    });
    s += `<g transform="${I.faceY(D, 0)}">${win}</g>`;
    // inverter box on the wall (where the green line arrives), face y = D
    s += `<g transform="${I.faceY(D, 0)}"><rect x="12.05" y="1.5" width="0.78" height="1.0" rx="0.05" fill="#E8E8EB" stroke="#9A9CA5" stroke-width="0.03"/><rect x="12.17" y="1.64" width="0.54" height="0.3" rx="0.03" fill="#373640"/><circle cx="12.44" cy="2.17" r="0.07" fill="#0B8457"/></g>`;
    // back slope: seen from above, darker (faces away from the light)
    s += `<g transform="${I.plane([0, yr, zr], [1, 0, 0], [0, -G.cos, -G.sin])}"><rect x="-0.35" y="0" width="${W + 0.7}" height="${G.Lv}" fill="url(#${pre}tile)"/><rect x="-0.35" y="0" width="${W + 0.7}" height="${G.Lv}" fill="#160808" fill-opacity=".42"/><rect x="-0.35" y="0" width="${W + 0.7}" height="0.2" fill="#8A3E2A"/></g>`;
    // roof: edge strips first (they sit under the plane), then the plane
    const A = rp(W + 0.35, 0), B = rp(W + 0.35, G.Lv), Ac = rp(-0.35, 0), Bc = rp(W + 0.35, 0);
    s += I.poly([A, B, [B[0], B[1], B[2] - 0.2], [A[0], A[1], A[2] - 0.2]], "#7F3A28");
    s += I.poly([[W + 0.35, yr, zr], [W + 0.35, -0.35, zr - (yr + 0.35) * G.tan], [W + 0.35, -0.35, zr - (yr + 0.35) * G.tan - 0.2], [W + 0.35, yr, zr - 0.2]], "#7F3A28");
    s += I.poly([rp(-0.35, 0), rp(W + 0.35, 0), [Bc[0], Bc[1], Bc[2] - 0.22], [Ac[0], Ac[1], Ac[2] - 0.22]], "#E6E7EA");
    s += `<g transform="${roofMatrix(I)}" id="${pre}roof">`;
    s += `<rect x="-0.35" y="0" width="${W + 0.7}" height="${G.Lv}" fill="url(#${pre}tile)"/>`;
    s += `<rect x="-0.35" y="0" width="${W + 0.7}" height="${G.Lv}" fill="url(#${pre}roofsh)"/>`;
    s += `<rect x="-0.35" y="${G.Lv - 0.2}" width="${W + 0.7}" height="0.2" fill="#8A3E2A"/><rect x="-0.35" y="${G.Lv - 0.22}" width="${W + 0.7}" height="0.03" fill="#D9886A" fill-opacity=".6"/>`;
    // gutter line on the eave
    s += `<rect x="-0.35" y="0" width="${W + 0.7}" height="0.09" fill="#B9BDC4"/>`;
    // rails, shadows, panels
    let rails = "", sh = "", fr = "", dim = "", lit = "", fh = "", clamp = "", clip = "";
    for (let r = 0; r < PAN.rows; r++) {
      const v0 = PAN.v0 + r * PAN.dv;
      [0.32, 1.38].forEach((dv) => { rails += `<rect x="${PAN.u0 - 0.15}" y="${v0 + dv}" width="${PAN.cols * PAN.du + 0.1}" height="0.05" fill="#40424B"/>`; });
      for (let c = 0; c < PAN.cols; c++) {
        const u0 = PAN.u0 + c * PAN.du;
        sh += `<rect x="${f(u0 + 0.08)}" y="${f(v0 - 0.07)}" width="1" height="1.7" fill="rgba(35,10,6,.45)"/>`;
        fr += `<rect x="${f(u0)}" y="${f(v0)}" width="1" height="1.7" rx="0.02" fill="#C5C9CF" stroke="#8E939B" stroke-width="0.012"/>`;
        const g0 = `translate(${f(u0 + 0.035)} ${f(v0 + 0.035)})`;
        dim += `<g transform="${g0}"><rect width="0.93" height="1.63" fill="url(#${pre}glass)"/><rect width="0.93" height="1.63" fill="url(#${pre}cellD)"/></g>`;
        lit += `<g transform="${g0}"><rect width="0.93" height="1.63" fill="url(#${pre}cellL)"/></g>`;
        fh += `<rect x="${f(u0 + 0.006)}" y="${f(v0 + 0.006)}" width="0.988" height="1.688" rx="0.02" fill="none" stroke="#FFFFFF" stroke-opacity=".75" stroke-width="0.012"/>`;
        clip += `<rect x="${f(u0 + 0.035)}" y="${f(v0 + 0.035)}" width="0.93" height="1.63"/>`;
        if (c < PAN.cols - 1) { clamp += `<rect x="${f(u0 + 0.985)}" y="${f(v0 + 0.3)}" width="0.1" height="0.12" fill="#9EA3AB"/><rect x="${f(u0 + 0.985)}" y="${f(v0 + 1.38)}" width="0.1" height="0.12" fill="#9EA3AB"/>`; }
      }
    }
    s += rails + sh + fr + dim;
    s += `<mask id="${pre}revm" maskUnits="userSpaceOnUse" x="-60" y="-60" width="140" height="140"><g id="${pre}rev"><rect x="-100" y="-60" width="200" height="140" fill="url(#${pre}revg)"/></g></mask>`;
    s += `<g id="${pre}lit" mask="url(#${pre}revm)">${lit}${fh}</g>`;
    s += clamp;
    s += `<clipPath id="${pre}pclip">${clip}</clipPath><g clip-path="url(#${pre}pclip)"><g id="${pre}glint"><rect x="-0.9" y="-1" width="1.8" height="12" fill="url(#${pre}glintg)"/></g></g>`;
    s += `</g>`;
    return s;
  }

  // ---------- the green line: shadow, body, satin highlight. Constant on-screen thickness via setW ----------
  function trace(id, d, extra) {
    return `<g class="tr" id="${id}" opacity="0" ${extra || ""}><path d="${d}" fill="none" stroke="rgba(0,0,0,.38)" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#0B8457" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#5AD1A0" stroke-opacity=".7" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }
  const TW = 7; // on-screen px at 1080p
  function setW(g, s) {
    const p = g.children; s = s || 1;
    p[0].setAttribute("stroke-width", f((TW + 4) / s)); p[0].setAttribute("transform", `translate(0 ${f(3 / s)})`);
    p[1].setAttribute("stroke-width", f(TW / s));
    p[2].setAttribute("stroke-width", f(TW * 0.28 / s)); p[2].setAttribute("transform", `translate(0 ${f(-TW * 0.2 / s)})`);
  }
  // draw a trace from a to b of its length (0..1). Uses real path lengths (no pathLength scaling).
  const PADL = 6;
  function lens(id) { return Array.from(document.querySelectorAll('#' + id + ' path')).map((p) => ({ p, L: p.getTotalLength() })); }
  function draw(tl, id, t, dur, from, to, ease) {
    tl.set('#' + id, { opacity: 1 }, t);
    lens(id).forEach(({ p, L }) => {
      p.style.strokeDasharray = L + ' ' + (L * 3 + 20);
      tl.fromTo(p, { strokeDashoffset: L * (1 - (from || 0)) + (from ? 0 : PADL) }, { strokeDashoffset: L * (1 - (to == null ? 1 : to)), duration: dur, ease: ease || 'power2.inOut' }, t);
    });
  }
  // erase from the start (the head stays): the tail leaves first
  function retract(tl, id, t, dur, ease) {
    lens(id).forEach(({ p, L }) => { p.style.strokeDasharray = L + ' ' + (L * 3 + 20); tl.to(p, { strokeDashoffset: -L - PADL, duration: dur, ease: ease || 'power2.inOut' }, t); });
  }

  // ---------- text entrances ----------
  const FX = {
    lines(tl, sel, t, dur, stagger) { tl.fromTo(sel, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: dur || 0.5, ease: "power4.out", stagger: stagger == null ? 0.1 : stagger }, t); },
    out(tl, sel, t, dur) { tl.to(sel, { opacity: 0, duration: dur || 0.25, ease: "power2.in" }, t); },
    wipe(tl, sel, t, dur) { tl.fromTo(sel, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: dur || 0.4, ease: "power3.out" }, t); },
  };

  // ---------- the shared camera of sequences 1 and 2: a pure function of absolute time ----------
  const ease = (n) => gsap.parseEase(n);
  const K = [[0, Math.log(14), "sine.inOut"], [1.7, Math.log(13), "power2.inOut"], [4.7, Math.log(1.0), "sine.inOut"], [6.2, Math.log(1.04), "power3.inOut"], [7.0, Math.log(0.42), "none"]];
  const I0 = new Iso(40, 900, 450);
  const PF = I0.p(rp(PFUV[0], PFUV[1]));
  const CARDC = [1310, 350]; // where the miniature house sits in the simulation card
  const HC = I0.p(7, 4.8, 3);
  const CAMEND = { x: CARDC[0] - PF[0] - 0.42 * (HC[0] - PF[0]), y: CARDC[1] - PF[1] - 0.42 * (HC[1] - PF[1]) };
  function camAt(T) {
    let ls = K[K.length - 1][1], k = K.length - 1;
    for (let i = 0; i < K.length - 1; i++) if (T < K[i + 1][0]) { const p = Math.min(1, Math.max(0, (T - K[i][0]) / (K[i + 1][0] - K[i][0]))); ls = K[i][1] + (K[i + 1][1] - K[i][1]) * ease(K[i][2])(p); k = i; break; }
    const q = Math.min(1, Math.max(0, (T - 6.2) / 0.8)), e = ease("power3.inOut")(q);
    return { s: Math.exp(ls), tx: CAMEND.x * e, ty: CAMEND.y * e };
  }
  // apply a camera state to a group (uniform scale about PF) and keep every green line at constant thickness
  function applyCam(gEl, PF, st, traces) {
    gEl.setAttribute("transform", `translate(${f(PF[0] + st.tx)} ${f(PF[1] + st.ty)}) scale(${f(st.s)}) translate(${f(-PF[0])} ${f(-PF[1])})`);
    traces.forEach((g) => setW(g, st.s));
  }

  window.HV = { I0, PF, CARDC, C, S, f, PAL, Iso, G, rp, PAN, PFUV, roofMatrix, house, trace, setW, draw, retract, FX, camAt, applyCam, CAMEND, TW };
})();
