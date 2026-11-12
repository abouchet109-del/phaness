// The business park shared by sequences 1, 5 and 6 (same layout, same camera angle). Plan units, 1 unit ~ 8 cm.
(function () {
  const { f } = window.HF;
  const K = 1.15, OX = 960, OY = 540 - 500 * K; // aerial framing: plan (500,500) lands at screen (960,540)
  const PW = 24, PD = 10; // Stykon panel in plan units (1949 x 789 mm), long side along x

  const B = [
    { id: 0, x: 90, y: 100, w: 220, d: 120, h: 28, t: "wh" },
    { id: 1, x: 390, y: 90, w: 210, d: 130, h: 24, t: "wh" },
    { id: 2, x: 700, y: 100, w: 190, d: 110, h: 18, t: "com" },
    { id: 3, x: 110, y: 280, w: 200, d: 100, h: 22, t: "ind" },
    { id: 4, x: 400, y: 285, w: 200, d: 95, h: 30, t: "fac" },
    { id: 5, x: 710, y: 275, w: 180, d: 105, h: 20, t: "wh" },
    { id: 6, x: 90, y: 440, w: 220, d: 120, h: 26, t: "wh" },
    { id: 7, x: 380, y: 430, w: 240, d: 140, h: 36, t: "wh", central: true },
    { id: 8, x: 700, y: 445, w: 200, d: 110, h: 16, t: "pub" },
    { id: 9, x: 100, y: 640, w: 210, d: 130, h: 30, t: "wh" },
    { id: 10, x: 390, y: 650, w: 210, d: 120, h: 22, t: "com" },
    { id: 11, x: 700, y: 640, w: 190, d: 125, h: 28, t: "wh" },
    { id: 12, x: 110, y: 850, w: 200, d: 100, h: 20, t: "ind" },
    { id: 13, x: 400, y: 850, w: 200, d: 110, h: 26, t: "wh" },
    { id: 14, x: 710, y: 855, w: 180, d: 100, h: 18, t: "fac" },
  ];
  const CEN = B[7];

  // Rooftop volumes (lanterneaux, units, stacks); [x, y, w, d, h, kind]
  function extras(b) {
    const e = [], cy = b.y + b.d / 2;
    if (b.central) {
      [410, 480, 550].forEach((x) => e.push([x, cy - 8 - 14, 40, 16, 5, "lan"]));
      [410, 480, 550].forEach((x) => e.push([x, cy + 6 + 14 - 16 + 14, 40, 16, 5, "lan"]));
      e.length = 0;
      [405, 475, 545].forEach((x) => { e.push([x, cy - 34, 40, 14, 5, "lan"]); e.push([x, cy + 20, 40, 14, 5, "lan"]); });
    } else if (b.t === "wh") {
      const n = Math.floor((b.w - 40) / 56);
      for (let i = 0; i < n; i++) e.push([b.x + 22 + i * 56, cy - 7, 30, 14, 4, "lan"]);
    } else if (b.t === "com") {
      for (let i = 0; i < 3; i++) e.push([b.x + 30 + i * 55, b.y + 28, 22, 16, 7, "hvac"]);
    } else if (b.t === "ind") {
      e.push([b.x + 40, b.y + 30, 10, 10, 18, "stack"], [b.x + 70, b.y + 30, 10, 10, 14, "stack"], [b.x + 110, cy - 6, 50, 14, 5, "lan"]);
    } else if (b.t === "fac") {
      e.push([b.x + 25, cy - 8, 60, 16, 7, "hvac"], [b.x + 120, cy - 5, 9, 9, 20, "stack"]);
    } else if (b.t === "pub") {
      e.push([b.x + 130, b.y + 25, 22, 22, 9, "hvac"]);
    }
    return e;
  }
  B.forEach((b) => { b.ex = extras(b); });

  // Panel cells (plan origin of each 24 x 10 module): avoid rooftop volumes and one walkway along x.
  function cells(b) {
    const m = 10, x0 = b.x + m, y0 = b.y + m, cols = Math.floor((b.w - 2 * m) / PW), rows = Math.floor((b.d - 2 * m) / PD);
    const cy = b.y + b.d / 2, out = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const px = x0 + c * PW, py = y0 + r * PD;
      if (py < cy + 4 && py + PD > cy - 4 && (b.central ? false : true)) continue; // walkway
      let hit = false;
      for (const e of b.ex) if (px < e[0] + e[2] + 3 && px + PW > e[0] - 3 && py < e[1] + e[3] + 3 && py + PD > e[1] - 3) { hit = true; break; }
      if (hit) continue;
      out.push([px, py, c, r]);
    }
    return out;
  }
  B.forEach((b) => { b.cells = cells(b); });

  const PAL = {
    dawn: { sky: "#0A1050", ground: "#0A1050", apron: "#10186A", road: "#161F70", mark: "#3A44A0", park: "#1B2478", top: "#CBD0F2", rim: "#EAEEFF", seam: "#AEB5E3", left: "#6D77B3", right: "#464F8E", rib: "rgba(0,4,62,.30)", shadow: "rgba(0,4,62,.45)", tree: "#2E3A92", treeS: "#1A2266", lanT: "#E3E7FF", lanL: "#8E98D2", lanR: "#6872B0", lanG: "#9DB1F2", hv: "#B9C0EA", truck: "#DDE2FA", cab: "#9AA4D6", door: "#2C3580", panel: "#0A2A86", panelE: "#4C78D8", glass: "#1A2A8E" },
    day: { sky: "#C9D0EC", ground: "#BEC7E6", apron: "#CCD3EE", road: "#A6B0D6", mark: "#EDF0FB", park: "#B2BCE0", top: "#F6F8FF", rim: "#FFFFFF", seam: "#D9DEF3", left: "#E2E7F7", right: "#A7B2D8", rib: "rgba(0,4,62,.16)", shadow: "rgba(0,4,62,.20)", tree: "#8497CB", treeS: "#6E80B8", lanT: "#FFFFFF", lanL: "#CFD6EE", lanR: "#9EAAD3", lanG: "#B6C6F2", hv: "#E7EBFA", truck: "#F7FAFF", cab: "#B4BDE0", door: "#7480B8", panel: "#0B2F94", panelE: "#5A87E6", glass: "#9FB4EE" },
  };

  function cellPath(cs, ins) {
    ins = ins || 0.45;
    return cs.map((c) => `M${f(c[0] + ins)} ${f(c[1] + ins)}h${PW - 2 * ins}v${PD - 2 * ins}h${-(PW - 2 * ins)}z`).join("");
  }

  function roadRects() {
    const r = [];
    [[-3000, 230, 7000, 40], [-3000, 380, 7000, 50], [-3000, 570, 7000, 60], [-3000, 780, 7000, 60], [-3000, 960, 7000, 50], [-3000, 40, 7000, 40]].forEach((a) => r.push(a));
    [[320, -3000, 60, 7000], [620, -3000, 80, 7000], [20, -3000, 60, 7000], [900, -3000, 70, 7000]].forEach((a) => r.push(a));
    return r;
  }

  function build(svg, mode, pre) {
    const c = PAL[mode], I = new window.Iso(K, OX, OY);
    let defs = `<defs><pattern id="${pre}rib" patternUnits="userSpaceOnUse" width="5" height="400"><rect width="0.9" height="400" fill="${c.rib}"/></pattern>`;
    B.forEach((b) => { defs += `<clipPath id="${pre}cp${b.id}"><rect id="${pre}cr${b.id}" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.d}"/></clipPath>`; });
    defs += `</defs>`;

    // ground
    let g = `<g id="${pre}ground" transform="${I.top(0)}"><rect x="-3000" y="-3000" width="7000" height="7000" fill="${c.ground}"/>`;
    roadRects().forEach((a) => { g += `<rect x="${a[0]}" y="${a[1]}" width="${a[2]}" height="${a[3]}" fill="${c.road}"/>`; });
    // lane marks
    g += `<g stroke="${c.mark}" stroke-width="1" stroke-dasharray="10 12" vector-effect="non-scaling-stroke" opacity=".55" fill="none">` +
      [250, 405, 600, 810, 985].map((y) => `<path d="M-1000 ${y}H2000" vector-effect="non-scaling-stroke"/>`).join("") +
      [350, 660, 50, 935].map((x) => `<path d="M${x} -1000V2000" vector-effect="non-scaling-stroke"/>`).join("") + `</g>`;
    // aprons and parking
    B.forEach((b) => { g += `<rect x="${b.x - 14}" y="${b.y - 14}" width="${b.w + 28}" height="${b.d + 28}" fill="${c.apron}"/>`; });
    [[395, 590, 200, 30], [705, 560, 190, 55], [400, 230, 190, 36], [700, 215, 190, 36]].forEach((a, i) => {
      g += `<rect x="${a[0]}" y="${a[1]}" width="${a[2]}" height="${a[3]}" fill="${c.park}"/><path d="${Array.from({ length: Math.floor(a[2] / 8) + 1 }, (_, j) => `M${a[0] + j * 8} ${a[1] + 2}v${a[3] - 4}`).join("")}" stroke="${c.mark}" stroke-width="1" fill="none" opacity=".4" vector-effect="non-scaling-stroke"/>`;
    });
    g += `</g>`;

    // painter's list
    const items = [];
    B.forEach((b) => items.push({ key: b.x + b.w / 2 + b.y + b.d / 2, svg: bldg(I, b, c, pre) }));
    // trees on the verges of the two main vertical roads
    for (let y = 120; y < 1000; y += 64) {
      [326, 374, 626, 694].forEach((x, i) => { if (y > 400 && y < 440) return; items.push({ key: x + y, svg: tree(I, x, y + (i % 2) * 20, c) }); });
    }
    // trucks at the docks and on the road
    [[412, 578], [452, 580], [492, 576]].forEach((p) => items.push({ key: p[0] + p[1] + 12, svg: truck(I, p[0], p[1], c, true) }));
    [[330, 150], [335, 520], [640, 700], [640, 300]].forEach((p) => items.push({ key: p[0] + p[1] + 16, svg: truck(I, p[0], p[1], c, false) }));
    items.sort((a, b) => a.key - b.key);

    svg.innerHTML = defs + `<g id="${pre}cam"><g id="${pre}world">${g}<g id="${pre}items">${items.map((i) => i.svg).join("")}</g><g id="${pre}traces" fill="none"></g></g></g>`;
    return { I, c, pre };
  }

  function tree(I, x, y, c) {
    const [sx, sy] = I.p(x, y, 0), [cx, cy] = I.p(x, y, 11);
    return `<g><ellipse cx="${f(sx + 3)}" cy="${f(sy)}" rx="7" ry="3.5" fill="${c.shadow}"/><rect x="${f(sx - 1)}" y="${f(sy - 11)}" width="2" height="11" fill="${c.treeS}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="6.5" fill="${c.tree}"/><circle cx="${f(cx - 2)}" cy="${f(cy - 2)}" r="3.2" fill="${c.treeS}" opacity=".35"/></g>`;
  }
  function truck(I, x, y, c, dock) {
    const cl = { top: c.truck, l: c.truck, r: c.cab };
    const tr = dock ? I.box(x, y, 0, 10, 28, 11, { top: c.truck, l: "#C7CEEE", r: "#AEB7E0" }) : I.box(x, y, 0, 30, 10, 11, { top: c.truck, l: "#C7CEEE", r: "#AEB7E0" });
    const cab = dock ? I.box(x, y + 28, 0, 10, 8, 8, { top: c.cab, l: c.cab, r: "#808ABF" }) : I.box(x + 30, y, 0, 8, 10, 8, { top: c.cab, l: c.cab, r: "#808ABF" });
    return `<g>${tr}${cab}</g>`;
  }

  function bldg(I, b, c, pre) {
    const { x, y, w, d, h } = b, i = b.id;
    let s = `<g id="${pre}b${i}">`;
    // soft cast shadow
    s += `<g id="${pre}sh${i}" transform="${I.top(0)}" fill="${c.shadow}" opacity=".9">` + [0.35, 0.7, 1].map((t) => `<rect x="${f(x + h * 0.9 * t)}" y="${f(y + h * 0.35 * t)}" width="${w}" height="${d}"/>`).join("") + `</g>`;
    // walls
    s += `<g id="${pre}w${i}">` +
      I.poly([[x, y + d, 0], [x + w, y + d, 0], [x + w, y + d, h], [x, y + d, h]], c.left) +
      I.poly([[x + w, y, 0], [x + w, y + d, 0], [x + w, y + d, h], [x + w, y, h]], c.right) +
      `<g transform="${I.faceY(y + d, 0)}"><rect x="${x}" y="0" width="${w}" height="${h}" fill="url(#${pre}rib)"/></g>` +
      `<g transform="${I.faceX(x + w, 0)}"><rect x="${y}" y="0" width="${d}" height="${h}" fill="url(#${pre}rib)"/></g>`;
    if (b.t === "wh" || b.central) { // dock doors on the front (+y) wall
      s += `<g transform="${I.faceY(y + d, 0)}" fill="${c.door}">` + Array.from({ length: Math.floor((w - 30) / 36) }, (_, j) => `<rect x="${x + 22 + j * 36}" y="0" width="22" height="${Math.min(15, h - 6)}"/>`).join("") + `</g>`;
    }
    s += `</g>`;
    // roof
    s += `<g id="${pre}R${i}"><g transform="${I.top(h)}">` +
      `<rect x="${x}" y="${y}" width="${w}" height="${d}" fill="${c.rim}"/>` +
      `<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${d - 8}" fill="${c.top}"/>` +
      `<path d="${Array.from({ length: Math.floor((d - 8) / 10) }, (_, j) => `M${x + 4} ${y + 10 + j * 10}h${w - 8}`).join("")}" stroke="${c.seam}" stroke-width=".9" fill="none" vector-effect="non-scaling-stroke"/>`;
    if (b.t === "pub") s += `<rect x="${x + 40}" y="${y + 36}" width="56" height="36" fill="${c.glass}" opacity=".85"/>`;
    // lavender survey grid (hidden until sequence 1 shows it)
    s += `<path id="${pre}g${i}" d="${Array.from({ length: Math.floor(w / 12) + 1 }, (_, j) => `M${x + j * 12} ${y}v${d}`).join("")}${Array.from({ length: Math.floor(d / 12) + 1 }, (_, j) => `M${x} ${y + j * 12}h${w}`).join("")}" stroke="#D0CDF1" stroke-width="1.2" fill="none" opacity="0" vector-effect="non-scaling-stroke"/>`;
    s += `<g id="${pre}p${i}" clip-path="url(#${pre}cp${i})" opacity="0"><path d="${cellPath(b.cells)}" fill="${c.panel}" stroke="${c.panelE}" stroke-width=".5" stroke-opacity=".6"/></g>`;
    s += `</g>`;
    // volumes on the roof, drawn on top of the panels
    b.ex.forEach((e) => {
      const col = e[5] === "lan" ? { top: c.lanT, l: c.lanL, r: c.lanR } : { top: c.hv, l: c.lanL, r: c.lanR };
      s += I.box(e[0], e[1], h, e[2], e[3], e[4], col);
    });
    s += `</g>`;
    // outlines (drawn first in sequence 1)
    const sw = `fill="none" stroke="#F7FAFF" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"`;
    s += `<g id="${pre}o${i}">` +
      `<polygon points="${I.pts([[x, y, h], [x + w, y, h], [x + w, y + d, h], [x, y + d, h]])}" ${sw}/>` +
      `<polygon points="${I.pts([[x, y + d, 0], [x + w, y + d, 0], [x + w, y + d, h], [x, y + d, h]])}" ${sw}/>` +
      `<polygon points="${I.pts([[x + w, y, 0], [x + w, y + d, 0], [x + w, y + d, h], [x + w, y, h]])}" ${sw}/>` + `</g>`;
    return s + `</g>`;
  }

  function flat(tl, pre, t, dur) {
    const go = (sel, vars) => (tl ? tl.to(sel, Object.assign({ duration: dur, ease: "power3.inOut" }, vars), t) : gsap.set(sel, vars));
    go("#" + pre + "ground rect", { fill: "#00043E" });
    go("#" + pre + "ground path", { opacity: 0 });
    go("#" + pre + "items > g:not([id])", { opacity: 0 });
    B.forEach((b) => {
      go(["#" + pre + "w" + b.id, "#" + pre + "sh" + b.id, "#" + pre + "b" + b.id + " > g:not([id])"], { opacity: 0 });
      go("#" + pre + "R" + b.id, { y: b.h * K });
      go("#" + pre + "R" + b.id + " > g > rect:nth-of-type(1)", { fill: "#0A1262" });
      go("#" + pre + "R" + b.id + " > g > rect:nth-of-type(2)", { fill: "#060D5E" });
      go("#" + pre + "R" + b.id + " > g > path:nth-of-type(1)", { opacity: 0 });
      go("#" + pre + "p" + b.id + " path", { fill: "#07BDF0", stroke: "#06A6D4" });
    });
  }
  window.Park = { flat, B, CEN, K, OX, OY, PW, PD, PAL, build, cellPath, roofY: OY + 500 * K - 36 * K, Z: 2.7 / K };
})();
