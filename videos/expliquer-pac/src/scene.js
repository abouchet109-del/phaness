// expliquer-pac: how an air-to-water heat pump works, how it is installed, how you set it.
import { run } from "../../_system/src/film.js";
import * as P from "../../_system/src/engine.js";

const { THREE, E, ease, seg, lerp, clamp, smooth, PAL, mesh, group, clay, plastic } = P;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// Timing (seconds) — keep in sync with the overlay timeline in compositions/film.html
const T = {
  dive: 2.6, land: 4.4,
  explode: 4.9, loop: 5.7, ch1End: 10.3,
  close: 10.3, lift: 11.0, pipes: 11.7, pro: 12.8, check: 14.3, ch2End: 15.7,
  wallIn: 16.25, setStart: 17.1, setEnd: 18.3, prog: 18.7, eco: 20.2, ch3End: 22.6,
  egg: 24.0, end: 28,
};
const TH = V(70, 2.4, 0.42); // thermostat position (interior set)

run(async (stage, anchors) => {
  const { scene } = stage;
  const sky = P.buildSky(stage);

  // ------------------------------------------------ outdoor island
  const isle = mesh(P.pebble(7.4, 2.4, 0.7), clay(0xeef1f7, { rough: 0.8, rim: 0.12 }), { parent: scene, pos: [0.6, 0, -0.6] });
  const sea = P.cloudField(scene, {
    seed: 3, clusters: 170, radius: 46, inner: 6.5, y: -1.6, jitterY: 0.9, min: 1.3, max: 3.6, center: [0.6, 0, -0.6], drift: 0.1,
    avoid: (x, z) => Math.hypot(x - 0.6, z + 0.6) < 6.6,
  });
  // house wall with a window
  const wallMat = clay(0xfbfbfd, { rough: 0.85, rim: 0.1 });
  const wall = mesh(P.rbox(10, 5.6, 0.8, 0.38), wallMat, { parent: scene, pos: [1.4, 2.8, -3.0] });
  mesh(P.rbox(2.6, 2.2, 0.3, 0.14), clay(PAL.mist, { rough: 0.7 }), { parent: scene, pos: [4.2, 3.4, -2.62] });
  mesh(P.rbox(2.2, 1.8, 0.2, 0.1), plastic(PAL.glass, { rough: 0.15, coat: 1, rim: 0.3 }), { parent: scene, pos: [4.2, 3.4, -2.5] });
  // wall sleeve where the links go in
  const sleeve = mesh(P.cyl(0.32, 0.32, 0.2, 40), clay(PAL.mist), { parent: scene, pos: [2.35, 0.95, -2.55], rot: [Math.PI / 2, 0, 0] });

  // ------------------------------------------------ outdoor unit (casing parts + support)
  const unit = group(scene, [0, 0, 0]);
  const support = group(unit);
  const supMat = clay(PAL.night, { rough: 0.5, rim: 0.3 });
  for (const x of [-0.95, 0.95]) {
    mesh(P.rbox(0.26, 0.24, 1.3, 0.1), supMat, { parent: support, pos: [x, 0.12, 0] });
    for (const z of [-0.38, 0.38]) mesh(P.cyl(0.12, 0.14, 0.14, 24), clay(PAL.soft), { parent: support, pos: [x, 0.31, z] });
  }
  const body = group(unit, [0, 0.38, 0]); // casing origin at its bottom centre
  const caseMat = plastic(0xf7f8fb, { rim: 0.25 });
  const caseParts = {
    bottom: mesh(P.rbox(2.7, 0.16, 1.0, 0.07), caseMat, { parent: body, pos: [0, 0.08, 0] }),
    lid: mesh(P.rbox(2.76, 0.2, 1.06, 0.09), plastic(PAL.mist, { rim: 0.25 }), { parent: body, pos: [0, 1.74, 0] }),
    back: mesh(P.rbox(2.7, 1.56, 0.12, 0.05), caseMat, { parent: body, pos: [0, 0.92, -0.44] }),
    left: mesh(P.rbox(0.12, 1.56, 1.0, 0.05), caseMat, { parent: body, pos: [-1.29, 0.92, 0] }),
    right: mesh(P.rbox(0.12, 1.56, 1.0, 0.05), caseMat, { parent: body, pos: [1.29, 0.92, 0] }),
  };
  const front = group(body, [0, 0.92, 0.46]);
  mesh(P.rbox(2.7, 1.56, 0.12, 0.05), caseMat, { parent: front });
  const grille = group(front, [-0.42, 0, 0.07]);
  const gMat = clay(PAL.soft, { rough: 0.5 });
  [0.62, 0.46, 0.3].forEach((r) => mesh(P.torus(r, 0.028), gMat, { parent: grille }));
  mesh(P.rbox(1.3, 0.05, 0.05, 0.02), gMat, { parent: grille });
  mesh(P.rbox(0.05, 1.3, 0.05, 0.02), gMat, { parent: grille });
  mesh(P.cyl(0.72, 0.72, 0.06, 64), clay(PAL.night, { rough: 0.6 }), { parent: grille, pos: [0, 0, -0.03], rot: [Math.PI / 2, 0, 0] });
  const fan = group(grille, [0, 0, 0.0]);
  for (let i = 0; i < 3; i++) {
    const b = mesh(P.rbox(0.24, 0.56, 0.04, 0.1), clay(PAL.slate, { rough: 0.45 }), { parent: fan, pos: [0, 0.3, 0] });
    const pivot = group(fan, [0, 0, 0], [0, 0, (i / 3) * Math.PI * 2]);
    pivot.add(b);
    b.rotation.y = 0.5;
  }
  mesh(P.sphere(0.11), clay(PAL.mist), { parent: fan, pos: [0, 0, 0.04] });
  const panel = mesh(P.rbox(0.62, 0.42, 0.05, 0.08), clay(PAL.mist, { rough: 0.6 }), { parent: front, pos: [0.82, 0.32, 0.07] });

  // ------------------------------------------------ the refrigerant cycle (exploded view)
  const cyc = group(scene, [0, 0.4, 0.35]);
  const finMat = clay(0xe4e9f2, { rough: 0.5 });
  const pipeMat = clay(PAL.soft, { rough: 0.5 });
  // evaporator: finned coil
  const evap = group(cyc);
  for (let i = 0; i < 13; i++) mesh(P.rbox(0.82, 0.05, 0.7, 0.02, 2), finMat, { parent: evap, pos: [0, -0.72 + i * 0.12, 0] });
  for (const z of [-0.18, 0.18]) mesh(P.cyl(0.05, 0.05, 1.62, 16), pipeMat, { parent: evap, pos: [0.25, 0, z] });
  for (const z of [-0.18, 0.18]) mesh(P.cyl(0.05, 0.05, 1.62, 16), pipeMat, { parent: evap, pos: [-0.25, 0, z] });
  // compressor
  const comp = group(cyc);
  mesh(P.capsule(0.32, 0.42), plastic(PAL.night, { rim: 0.4 }), { parent: comp, pos: [0, 0.05, 0] });
  mesh(P.torus(0.33, 0.035), clay(PAL.verm, { rim: 0.2 }), { parent: comp, pos: [0, 0.18, 0], rot: [Math.PI / 2, 0, 0] });
  mesh(P.rbox(0.8, 0.1, 0.6, 0.05), clay(PAL.soft), { parent: comp, pos: [0, -0.5, 0] });
  // condenser: plate heat exchanger
  const cond = group(cyc);
  for (let i = 0; i < 9; i++) mesh(P.rbox(0.07, 1.1, 0.62, 0.03, 2), clay(i % 2 ? 0xf1d3cb : 0xfbe8e2, { rough: 0.5 }), { parent: cond, pos: [-0.3 + i * 0.075, 0, 0] });
  for (const x of [-0.4, 0.4]) mesh(P.rbox(0.08, 1.24, 0.7, 0.04), clay(PAL.night, { rim: 0.35 }), { parent: cond, pos: [x, 0, 0] });
  // expansion valve
  const valve = group(cyc);
  mesh(P.sphere(0.2), plastic(PAL.night, { rim: 0.4 }), { parent: valve });
  mesh(P.cyl(0.07, 0.07, 0.24, 20), clay(PAL.soft), { parent: valve, pos: [0, 0.24, 0] });
  mesh(P.torus(0.15, 0.04), clay(PAL.verm), { parent: valve, pos: [0, 0.37, 0], rot: [Math.PI / 2, 0, 0] });

  // packed (inside casing, local to cyc) -> exploded
  const POSE = {
    evap: { a: [-0.35, 0.95, -0.55], ra: [0, 0, Math.PI / 2], b: [-2.0, 2.0, 0], rb: [0, 0.35, 0], sa: 0.8 },
    comp: { a: [0.7, 0.62, -0.35], ra: [0, 0, 0], b: [0, 0.75, 0], rb: [0, 0.6, 0], sa: 0.85 },
    cond: { a: [0.72, 1.3, -0.3], ra: [0, Math.PI / 2, 0], b: [2.0, 2.0, 0], rb: [0, -0.3, 0], sa: 0.7 },
    valve: { a: [0.15, 1.2, -0.3], ra: [0, 0, 0], b: [0, 3.3, 0], rb: [0, 0.4, 0], sa: 0.8 },
  };
  const parts = { evap, comp, cond, valve };

  // the loop: valve (top) -> evaporator (left) -> compressor (bottom) -> condenser (right) -> valve
  const loopPts = [
    [0, 3.3, 0], [-1.45, 3.3, 0], [-2.0, 2.85, 0], [-2.0, 2.0, 0], [-2.0, 1.2, 0], [-1.45, 0.75, 0],
    [0, 0.75, 0], [1.45, 0.75, 0], [2.0, 1.2, 0], [2.0, 2.0, 0], [2.0, 2.85, 0], [1.45, 3.3, 0],
  ];
  const loop = P.tube(loopPts, 0.055, true, 300);
  const loopMesh = mesh(loop.geo, clay(0xe9edf5, { rough: 0.5, rim: 0.15 }), { parent: cyc });
  const cold = new THREE.Color(PAL.slate), cool = new THREE.Color(PAL.shade), hot = new THREE.Color(PAL.verm), warm = new THREE.Color(PAL.peach);
  const tmp = new THREE.Color();
  const fluidColor = (u) => {
    // u 0 = valve; evaporator ~0.25, compressor ~0.5, condenser ~0.75
    if (u < 0.25) return tmp.copy(cold).lerp(cool, smooth(seg(u, 0.12, 0.3))).getHex();
    if (u < 0.5) return tmp.copy(cool).lerp(cold, 0.2).lerp(hot, smooth(seg(u, 0.46, 0.56))).getHex();
    if (u < 0.75) return tmp.copy(hot).lerp(warm, smooth(seg(u, 0.66, 0.8))).getHex();
    return tmp.copy(warm).lerp(cold, smooth(seg(u, 0.92, 1.0))).getHex();
  };
  const fluid = P.flow(cyc, loop.curve, { count: 70, size: 0.1, closed: true, colorFn: fluidColor });
  // outside air through the evaporator
  const airLines = [1.5, 2.0, 2.5].map((y, i) => {
    const c = new THREE.CatmullRomCurve3([V(-5.2, y + 0.2, 0.6 - i * 0.3), V(-3.4, y, 0.2), V(-2.0, y, 0), V(-0.9, y - 0.1, -0.2)]);
    return P.flow(cyc, c, { count: 9, size: 0.07, colorFn: (u) => tmp.set(0xffffff).lerp(cold, smooth(seg(u, 0.45, 0.85))).getHex(), jitter: 0.06 });
  });

  // ------------------------------------------------ hydraulic links into the house
  const supply = P.tube([[1.4, 0.92, 0.05], [1.9, 0.92, 0.0], [2.2, 0.98, -1.4], [2.25, 1.05, -2.55]], 0.085, false, 120);
  const ret = P.tube([[1.4, 0.7, 0.2], [1.85, 0.7, 0.15], [2.4, 0.78, -1.3], [2.45, 0.85, -2.55]], 0.085, false, 120);
  const supplyMesh = mesh(supply.geo, clay(PAL.verm, { rough: 0.55, rim: 0.15 }), { parent: scene });
  const retMesh = mesh(ret.geo, clay(PAL.slate, { rough: 0.55 }), { parent: scene });
  const water = P.flow(scene, supply.curve, { count: 14, size: 0.07, color: 0xffffff });

  // ------------------------------------------------ the technician + commissioning badge
  const pro = P.figure(scene, { body: PAL.night, legs: PAL.soft });
  const cap = mesh(P.sphere(0.25, 32), clay(PAL.verm, { rim: 0.2 }), { parent: pro.head, pos: [0, 0.06, 0], scale: [1, 0.62, 1] });
  mesh(P.rbox(0.3, 0.04, 0.2, 0.02), clay(PAL.verm), { parent: pro.head, pos: [0, 0.07, 0.22] });
  const tablet = mesh(P.rbox(0.42, 0.3, 0.04, 0.05), plastic(PAL.night, { rim: 0.4 }), { parent: pro.arms[1].hand, pos: [0, 0.08, 0.12] });
  const badge = group(scene, [0, 2.95, 0.4]);
  mesh(P.torus(0.42, 0.075), clay(PAL.verm, { rim: 0.2 }), { parent: badge });
  mesh(P.cyl(0.4, 0.4, 0.08, 48), plastic(0xffffff), { parent: badge, rot: [Math.PI / 2, 0, 0] });
  const tick = group(badge, [0, 0, 0.06]);
  mesh(P.capsule(0.05, 0.16), clay(PAL.verm), { parent: tick, pos: [-0.09, -0.04, 0], rot: [0, 0, 0.8] });
  mesh(P.capsule(0.05, 0.34), clay(PAL.verm), { parent: tick, pos: [0.08, 0.05, 0], rot: [0, 0, -0.65] });

  // ------------------------------------------------ interior set: thermostat
  const room = group(scene, [TH.x, 0, 0]);
  mesh(P.pebble(6, 1.8, 0.6), clay(0xeef1f7, { rough: 0.8 }), { parent: room, pos: [0, 0, 1.5] });
  mesh(P.rbox(14, 7, 0.6, 0.3), wallMat, { parent: room, pos: [0, 3.5, -0.2] });
  // radiator under the thermostat
  for (let i = 0; i < 9; i++) mesh(P.capsule(0.09, 0.7), clay(0xf4f6fa, { rough: 0.5 }), { parent: room, pos: [-0.9 + i * 0.225, 0.85, 0.25] });
  const radHalo = P.halo(room, PAL.peach, 3.2, 0);
  radHalo.position.set(0, 0.9, 0.5);
  const thermo = group(scene, [TH.x, TH.y, TH.z]);
  mesh(P.rbox(1.5, 1.5, 0.12, 0.3), clay(PAL.mist, { rough: 0.7 }), { parent: thermo, pos: [0, 0, -0.08] });
  mesh(P.cyl(0.58, 0.6, 0.2, 64), plastic(0xfbfbfd, { rim: 0.3 }), { parent: thermo, rot: [Math.PI / 2, 0, 0], pos: [0, 0, 0.04] });
  const dial = group(thermo, [0, 0, 0.15]);
  mesh(P.torus(0.5, 0.075, 96), plastic(PAL.night, { rim: 0.45 }), { parent: dial });
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    mesh(P.rbox(0.025, 0.06, 0.04, 0.01, 1), clay(PAL.soft), { parent: dial, pos: [Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0.07], rot: [0, 0, a], cast: false });
  }
  mesh(P.sphere(0.035, 16), clay(PAL.verm), { parent: dial, pos: [0, 0.5, 0.08] });
  const disp = P.canvasTexture(512, 512, drawDisplay);
  const screen = mesh(new THREE.CircleGeometry(0.42, 96), new THREE.MeshBasicMaterial({ map: disp.tex, toneMapped: false }), { parent: thermo, pos: [0, 0, 0.152], cast: false });
  screen.userData.noAO = true;

  // ------------------------------------------------ anchors for the labels
  const wp = (obj) => () => obj.getWorldPosition(new THREE.Vector3());
  anchors.evap = () => evap.getWorldPosition(V()).add(V(-0.1, 0.9, 0.3));
  anchors.comp = () => comp.getWorldPosition(V()).add(V(0, -0.55, 0.35));
  anchors.cond = () => cond.getWorldPosition(V()).add(V(0.1, 0.75, 0.3));
  anchors.valve = () => valve.getWorldPosition(V()).add(V(0, 0.45, 0));
  anchors.support = () => V(0.95, 0.2, 0.65);
  anchors.links = () => supply.curve.getPointAt(0.62);
  anchors.set = () => TH.clone().add(V(0.38, 0.38, 0.2));
  anchors.prog = () => TH.clone().add(V(-0.5, -0.32, 0.2));
  anchors.eco = () => TH.clone().add(V(0.12, -0.32, 0.2));

  // ------------------------------------------------ camera
  const egg = P.EGG_POS;
  const cam = P.rig([
    { t: 0, tgt: [0, P.CEIL_Y + 1.8, -24], az: 0, el: 7, dist: 32, fov: 32, dof: 3 },
    { t: T.dive, tgt: [0, P.CEIL_Y + 1.4, -20], az: 0, el: 10, dist: 27, fov: 32, dof: 3, e: "sine" },
    { t: T.land, tgt: [0.1, 1.5, 0], az: -32, el: 24, dist: 13, fov: 30, dof: 4, e: "io4" },
    { t: 6.2, tgt: [0, 2.1, 0.3], az: -22, el: 15, dist: 11.5, fov: 30, dof: 5, e: "out" },
    { t: T.ch1End, tgt: [0, 2.1, 0.3], az: 22, el: 10, dist: 10.6, fov: 30, dof: 5, e: "sine" },
    { t: 11.8, tgt: [0.9, 1.3, -0.6], az: 38, el: 19, dist: 12.5, fov: 30, dof: 5 },
    { t: 15.6, tgt: [1.1, 1.2, -0.9], az: 50, el: 13, dist: 11.2, fov: 30, dof: 5, e: "sine" },
    { t: T.wallIn, tgt: [2.3, 0.95, -2.55], az: 34, el: 6, dist: 0.5, fov: 36, dof: 2, e: "in" },
    { t: T.wallIn, tgt: [TH.x, TH.y, TH.z], az: -6, el: 3, dist: 0.7, fov: 36, dof: 8 },
    { t: 17.4, tgt: [TH.x, TH.y - 0.1, TH.z], az: -20, el: 7, dist: 4.4, fov: 30, dof: 9, e: "out4" },
    { t: T.ch3End, tgt: [TH.x, TH.y - 0.1, TH.z], az: 18, el: 3, dist: 3.9, fov: 30, dof: 9, e: "sine" },
    { t: T.egg, tgt: [egg[0], egg[1] - 0.2, egg[2]], az: 0, el: 5, dist: 11.5, fov: 30, dof: 6, e: "io4" },
    { t: T.end, tgt: [egg[0], egg[1] - 0.1, egg[2]], az: 0, el: 4, dist: 10.4, fov: 30, dof: 6, e: "sine" },
  ]);

  function pose(name, k) {
    const p = POSE[name], o = parts[name];
    o.position.set(lerp(p.a[0], p.b[0], k), lerp(p.a[1], p.b[1], k), lerp(p.a[2], p.b[2], k));
    o.rotation.set(lerp(p.ra[0], p.rb[0], k), lerp(p.ra[1], p.rb[1], k), lerp(p.ra[2], p.rb[2], k));
    o.scale.setScalar(lerp(p.sa, 1, k));
  }

  return (t) => {
    const c = cam(t);
    stage.setCamera(c.pos, c.tgt, c.fov, c.dof, c.focus, c.roll);
    stage.shadowFocus(c.tgt, clamp(c.focus * 0.75, 5, 16));
    sky.update(t, c.pos.y);
    sea.update(t);

    // explode / close
    const open = ease(t, T.explode, T.explode + 1.3, E.io) * (1 - ease(t, T.close, T.close + 0.9, E.io));
    const spread = ease(t, T.explode + 0.35, T.explode + 1.6, (k) => E.spring(k, 0.78, 9)) * (1 - ease(t, T.close, T.close + 0.8, E.io));
    caseParts.lid.position.y = 1.74 + open * 2.6;
    caseParts.lid.rotation.x = -open * 0.25;
    front.position.set(0, 0.92 + open * 0.3, 0.46 + open * 2.4);
    front.rotation.x = open * 0.12;
    caseParts.left.position.x = -1.29 - open * 1.9;
    caseParts.right.position.x = 1.29 + open * 1.9;
    caseParts.back.position.z = -0.44 - open * 1.2;
    for (const m of [caseParts.lid, front, caseParts.left, caseParts.right, caseParts.back]) m.scale.setScalar(1 - open * 0.35);
    front.visible = caseParts.left.visible = caseParts.right.visible = open < 0.995;
    caseParts.lid.visible = caseParts.back.visible = open < 0.995;
    for (const n of Object.keys(parts)) pose(n, spread);
    const inside = open > 0.02 || spread > 0.02;
    for (const n of Object.keys(parts)) parts[n].visible = inside;
    fan.rotation.z = -t * 9;

    // the loop and its fluid
    const loopK = ease(t, T.loop, T.loop + 0.9, E.out) * (1 - ease(t, T.close - 0.1, T.close + 0.4, E.io));
    P.grow(loopMesh, loopK);
    fluid.update(t, 0.11, loopK, ease(t, T.loop + 0.5, T.loop + 1.1) * (1 - ease(t, T.close - 0.2, T.close + 0.2)));
    const airK = ease(t, T.loop + 0.8, T.loop + 1.4) * (1 - ease(t, T.close - 0.3, T.close));
    airLines.forEach((a, i) => a.update(t + i * 0.37, 0.45, 1, airK));

    // installation: lift and settle on the support, links grow, the pro arrives
    const lift = Math.sin(Math.PI * ease(t, T.lift, T.lift + 0.5, E.out)) * 0.55 * (t < T.lift + 0.5 ? 1 : 0);
    const settle = t > T.lift + 0.5 ? (1 - E.spring(seg(t, T.lift + 0.5, T.lift + 1.4), 0.55, 14)) * -0.05 : 0;
    body.position.y = 0.38 + Math.max(lift, 0) + (t > T.lift + 0.5 ? -0.05 - settle : 0) + (t > T.lift + 0.5 ? 0.05 : 0);
    const pipesK = ease(t, T.pipes, T.pipes + 1.0, E.io);
    P.grow(supplyMesh, pipesK);
    P.grow(retMesh, ease(t, T.pipes + 0.15, T.pipes + 1.15, E.io));
    water.update(t, 0.35, 1, ease(t, T.pipes + 1.0, T.pipes + 1.4) * (t < T.wallIn ? 1 : 0));
    const walkK = ease(t, T.pro, T.pro + 1.4, E.out);
    pro.group.visible = t > T.pro - 0.1 && t < T.wallIn + 0.1;
    pro.group.position.set(lerp(4.6, 2.05, walkK), 0, lerp(1.6, 1.15, walkK));
    pro.group.rotation.y = lerp(-1.75, -0.9, ease(t, T.pro + 0.9, T.pro + 1.7));
    pro.walk((t - T.pro) * 1.6, 1 - ease(t, T.pro + 1.1, T.pro + 1.5));
    const raise = ease(t, T.pro + 1.4, T.pro + 1.9, E.out);
    pro.arms[1].g.rotation.x = -1.2 * raise;
    tablet.visible = true;
    const b = ease(t, T.check, T.check + 0.7, (k) => E.spring(k, 0.6, 12)) * (1 - ease(t, T.ch2End - 0.3, T.ch2End));
    badge.scale.setScalar(Math.max(0.0001, b));
    badge.rotation.y = (1 - b) * 1.5 + Math.sin(t * 1.2) * 0.08;
    badge.position.y = 2.95 + (1 - b) * -0.4;

    // thermostat: setpoint 21 -> 19, schedule ring, eco
    const setK = ease(t, T.setStart, T.setEnd, E.io);
    dial.rotation.z = setK * 0.7;
    const temp = lerp(21, 19, setK);
    const progK = ease(t, T.prog, T.prog + 1.1, E.io);
    const ecoK = ease(t, T.eco, T.eco + 0.5, E.out);
    disp.update({ temp: Math.round(temp * 20) / 20, prog: Math.round(progK * 48) / 48, eco: Math.round(ecoK * 20) / 20 });
    radHalo.material.opacity = 0.55 * (1 - 0.55 * ecoK);

    // the egg rises out of the sea at the end
    const rise = ease(t, T.egg - 0.6, T.egg + 0.9, E.out4);
    sky.eggHolder.position.y = egg[1] - 2.6 + rise * 2.6;
    sky.egg.set(ease(t, T.egg - 0.2, T.egg + 1.6, E.io));
    sky.egg.group.rotation.y = t * 0.25;

    const wallWhite = ease(t, T.wallIn - 0.3, T.wallIn, E.in2) * (1 - ease(t, T.wallIn, T.wallIn + 0.55, E.out));
    return Math.max(P.ceilingWhite(c.pos.y), wallWhite);
  };
});

// Round thermostat display: setpoint, schedule ring, eco mode.
function drawDisplay(g, s, w, h) {
  const cx = w / 2, cy = h / 2;
  const bg = g.createRadialGradient(cx, cy * 0.8, 20, cx, cy, w / 2);
  bg.addColorStop(0, "#1b2a52");
  bg.addColorStop(1, "#0b1633");
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  // schedule ring: 24 hours, comfort 6-8 h and 17-22 h, eco otherwise (example)
  const comfort = (hr) => (hr >= 6 && hr < 8) || (hr >= 17 && hr < 22);
  for (let i = 0; i < 24; i++) {
    if (i / 24 >= s.prog) break;
    const a0 = -Math.PI / 2 + (i / 24) * Math.PI * 2 + 0.02, a1 = a0 + (Math.PI * 2) / 24 - 0.04;
    g.beginPath();
    g.arc(cx, cy, 228, a0, a1);
    g.lineWidth = 22;
    g.lineCap = "round";
    g.strokeStyle = comfort(i) ? "#e34234" : "#7d8bab";
    g.stroke();
  }
  // setpoint track (5..30 °C)
  const start = Math.PI * 0.75, span = Math.PI * 1.5;
  g.beginPath();
  g.arc(cx, cy, 182, start, start + span);
  g.lineWidth = 10;
  g.strokeStyle = "rgba(255,255,255,0.14)";
  g.stroke();
  g.beginPath();
  g.arc(cx, cy, 182, start, start + span * ((s.temp - 5) / 25));
  g.strokeStyle = "#e34234";
  g.stroke();
  // rolling digits
  g.save();
  g.beginPath();
  g.rect(cx - 170, cy - 130, 300, 190);
  g.clip();
  const lo = Math.floor(s.temp), f = s.temp - lo;
  g.fillStyle = "#ffffff";
  g.font = `620 172px ${'"Geist", sans-serif'}`;
  g.textAlign = "right";
  g.textBaseline = "alphabetic";
  const ease = f * f * (3 - 2 * f);
  g.globalAlpha = 1 - ease;
  g.fillText(String(lo), cx + 62, cy + 40 - ease * 150);
  g.globalAlpha = ease;
  g.fillText(String(lo + 1), cx + 62, cy + 40 + (1 - ease) * 150);
  g.restore();
  g.globalAlpha = 1;
  g.fillStyle = "#ffffff";
  g.font = `560 54px ${'"Geist", sans-serif'}`;
  g.textAlign = "left";
  g.fillText("°C", cx + 70, cy - 52);
  g.font = `520 30px ${'"Geist", sans-serif'}`;
  g.textAlign = "center";
  g.fillStyle = "rgba(255,255,255,0.6)";
  g.fillText("Consigne", cx, cy - 110);
  // eco leaf
  if (s.eco > 0) {
    g.globalAlpha = s.eco;
    g.save();
    g.translate(cx - 46, cy + 112);
    g.rotate(-0.6);
    g.beginPath();
    g.ellipse(0, 0, 13, 24, 0, 0, Math.PI * 2);
    g.fillStyle = "#ffffff";
    g.fill();
    g.restore();
    g.font = `600 40px ${'"Geist", sans-serif'}`;
    g.textAlign = "left";
    g.fillStyle = "#ffffff";
    g.fillText("Éco", cx - 22, cy + 126);
    g.globalAlpha = 1;
  }
}
