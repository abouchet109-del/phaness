// former-electricite: a training capsule on voltage (U), current (I) and power (P = U x I), on one clay circuit.
import { run } from "../../_system/src/film.js";
import * as P from "../../_system/src/engine.js";

const { THREE, E, ease, seg, lerp, clamp, smooth, PAL, mesh, group, clay, plastic } = P;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// Timing (seconds) — keep in sync with the overlay timeline in compositions/film.html
const T = {
  dive: 2.4, land: 4.2,
  volt: 5.4, voltEnd: 7.6, ch1End: 10.2,
  flyIn: 10.7, flyOut: 13.1, meter: 13.8, ch2End: 16.0,
  bulb: 16.6, ch3End: 21.6,
  egg: 23.0, end: 26,
};
const BAT = V(-3.7, 0.12, -0.3);
const BULB = V(3.7, 0.12, 0.0);
const MET = V(0.0, 0.46, 1.95);

run(async (stage, anchors) => {
  const { scene } = stage;
  const sky = P.buildSky(stage);

  // ------------------------------------------------ the island
  mesh(P.pebble(9.2, 2.6, 0.8), clay(0xeef1f7, { rough: 0.8, rim: 0.12 }), { parent: scene, pos: [0, 0, 0.3] });
  const sea = P.cloudField(scene, {
    seed: 21, clusters: 180, radius: 50, inner: 8.6, y: -1.8, jitterY: 0.9, min: 1.4, max: 3.8, center: [0, 0, 0.3], drift: 0.1,
    avoid: (x, z) => Math.hypot(x, z - 0.3) < 8.8,
  });
  mesh(P.rbox(11.5, 0.14, 5.4, 0.07), clay(0xdfe5f1, { rough: 0.75, rim: 0.05 }), { parent: scene, pos: [0, 0.07, 0.4] });

  // ------------------------------------------------ battery with its voltage display
  const bat = group(scene, [BAT.x, BAT.y, BAT.z]);
  mesh(P.cyl(0.95, 0.95, 2.5, 64), plastic(PAL.night, { rim: 0.4 }), { parent: bat, pos: [0, 1.25, 0] });
  mesh(P.cyl(0.97, 0.97, 0.5, 64), plastic(PAL.verm, { rim: 0.2 }), { parent: bat, pos: [0, 2.3, 0] });
  mesh(P.cyl(0.35, 0.4, 0.3, 40), clay(PAL.mist, { rough: 0.4 }), { parent: bat, pos: [0, 2.68, 0] });
  const voltTex = P.canvasTexture(512, 256, drawReadout);
  const voltScreen = mesh(new THREE.PlaneGeometry(1.15, 0.58), new THREE.MeshBasicMaterial({ map: voltTex.tex, toneMapped: false, transparent: true }), { parent: bat, pos: [0, 1.15, 0.97], cast: false });
  voltScreen.userData.noAO = true;
  // the voltage column: a glass tube that fills (pressure difference)
  const col = group(scene, [BAT.x - 1.9, BAT.y, BAT.z + 0.9]);
  mesh(P.cyl(0.42, 0.48, 0.24, 40), clay(PAL.night, { rim: 0.3 }), { parent: col, pos: [0, 0.12, 0] });
  const colGlass = mesh(P.cyl(0.32, 0.32, 3.0, 40), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.28, depthWrite: false }), { parent: col, pos: [0, 1.74, 0], cast: false });
  colGlass.userData.noAO = true;
  const fill = mesh(P.cyl(0.25, 0.25, 1, 40), clay(PAL.verm, { emissive: PAL.verm, emissiveIntensity: 0.25, rough: 0.4 }), { parent: col, pos: [0, 0.24, 0], cast: false });
  const ticks = [];
  for (let i = 1; i <= 5; i++) ticks.push(mesh(P.rbox(0.18, 0.03, 0.03, 0.01, 1), clay(PAL.night), { parent: col, pos: [0.36, 0.24 + i * 0.5, 0.12], cast: false }));

  // ------------------------------------------------ the wire: a glass pipe, charges flow inside
  const pts = [
    [BAT.x, 1.6, BAT.z], [BAT.x, 3.1, BAT.z], [-2.5, 3.9, -0.45], [0, 4.15, -0.7], [2.4, 3.9, -1.6], [3.7, 3.2, -2.4],
    [3.7, 1.2, -1.9], [3.7, 0.7, -0.8], [2.7, 0.5, 0.0], [2.2, 0.46, 1.4], [1.4, 0.46, 1.95], [-1.4, 0.46, 1.95], [-3.4, 0.5, 1.1], [BAT.x, 0.9, BAT.z + 0.4],
  ];
  const wire = P.tube(pts, 0.24, true, 360);
  const wireMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.1, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 1.4 });
  const wireMesh = mesh(wire.geo, wireMat, { parent: scene, cast: false });
  wireMesh.userData.noAO = true;
  const core = mesh(P.tube(pts, 0.035, true, 360).geo, clay(PAL.soft, { rough: 0.5 }), { parent: scene, cast: false });
  const charges = P.flow(scene, wire.curve, { count: 120, size: 0.075, closed: true, jitter: 0.26, colorFn: () => 0xffb347, emissive: 0xff8a3a, glow: 0.9 });

  // ------------------------------------------------ ammeter on the front run of the wire
  const met = group(scene, [MET.x, MET.y, MET.z]);
  mesh(P.rbox(1.7, 1.25, 0.7, 0.32), plastic(0xffffff, { rim: 0.25 }), { parent: met, pos: [0, 0.62, -0.05] });
  const dial = P.canvasTexture(512, 360, drawDial);
  const dialFace = mesh(new THREE.PlaneGeometry(1.42, 1.0), new THREE.MeshBasicMaterial({ map: dial.tex, toneMapped: false, transparent: true }), { parent: met, pos: [0, 0.66, 0.31], cast: false });
  dialFace.userData.noAO = true;

  // ------------------------------------------------ bulb on its socket, with a power readout
  const bulb = group(scene, [BULB.x, BULB.y, BULB.z]);
  mesh(P.cyl(0.85, 0.95, 0.9, 48), plastic(0xffffff, { rim: 0.25 }), { parent: bulb, pos: [0, 0.45, 0] });
  mesh(P.cyl(0.42, 0.5, 0.5, 40), clay(PAL.soft, { rough: 0.45 }), { parent: bulb, pos: [0, 1.15, 0] });
  for (let i = 0; i < 3; i++) mesh(P.torus(0.45, 0.04, 40), clay(PAL.mist), { parent: bulb, pos: [0, 1.0 + i * 0.13, 0], rot: [Math.PI / 2, 0, 0] });
  const globeMat = new THREE.MeshPhysicalMaterial({ color: 0xfff4ec, roughness: 0.08, clearcoat: 1, transparent: true, opacity: 0.35, depthWrite: false, emissive: new THREE.Color(0xffb27a), emissiveIntensity: 0 });
  const globe = mesh(P.sphere(1.0, 64), globeMat, { parent: bulb, pos: [0, 2.3, 0], cast: false });
  globe.userData.noAO = true;
  const filMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.soft) });
  const fil = group(bulb, [0, 2.2, 0]);
  mesh(P.torus(0.28, 0.035, 48, Math.PI * 1.2), filMat, { parent: fil, rot: [0, 0, -0.3], cast: false });
  for (const x of [-0.26, 0.26]) mesh(P.cyl(0.025, 0.025, 0.8, 12), clay(PAL.soft), { parent: fil, pos: [x, -0.42, 0], cast: false });
  const bulbLight = new THREE.PointLight(0xffa36a, 0, 18, 1.5);
  bulbLight.position.set(0, 2.3, 0.4);
  bulb.add(bulbLight);
  const bulbHalo = P.halo(bulb, 0xfff0d8, 3.2, 0);
  const coreGlow = P.halo(bulb, 0xffffff, 1.4, 0);
  coreGlow.position.set(0, 2.45, 0.3);
  bulbHalo.position.set(0, 2.3, 0.2);
  const wattTex = P.canvasTexture(512, 256, drawReadout);
  const wattScreen = mesh(new THREE.PlaneGeometry(1.0, 0.5), new THREE.MeshBasicMaterial({ map: wattTex.tex, toneMapped: false, transparent: true }), { parent: bulb, pos: [0, 0.48, 0.93], cast: false, rot: [-0.06, 0, 0] });
  wattScreen.userData.noAO = true;

  // ------------------------------------------------ anchors for the labels
  anchors.volt = () => V(BAT.x, BAT.y + 1.7, BAT.z + 0.97);
  anchors.amp = () => V(MET.x, MET.y + 1.3, MET.z);
  anchors.watt = () => V(BULB.x - 0.75, BULB.y + 2.6, BULB.z + 0.4);

  // ------------------------------------------------ camera (+ a fly-through inside the wire)
  const cam = P.rig([
    ...P.openingKeys(T.dive),
    { t: T.land, tgt: [0, 1.9, 0.4], az: -14, el: 26, dist: 17, fov: 30, dof: 3, e: "io4" },
    { t: 5.4, tgt: [BAT.x - 0.6, 1.8, BAT.z + 0.4], az: -30, el: 9, dist: 8.2, fov: 30, dof: 7, e: "io" },
    { t: 9.4, tgt: [BAT.x - 0.4, 1.9, BAT.z + 0.4], az: 22, el: 6, dist: 7.4, fov: 30, dof: 7, e: "sine" },
    { t: T.flyIn, tgt: [-2.5, 3.9, -0.45], az: -70, el: 4, dist: 1.6, fov: 40, dof: 0, e: "in2" },
    { t: T.flyOut, tgt: [2.5, 3.8, -0.6], az: 90, el: 4, dist: 1.6, fov: 40, dof: 0 },
    { t: T.meter, tgt: [MET.x, MET.y + 0.7, MET.z], az: -18, el: 10, dist: 5.2, fov: 30, dof: 8, e: "out4" },
    { t: T.ch2End, tgt: [MET.x, MET.y + 0.7, MET.z], az: -32, el: 7, dist: 4.8, fov: 30, dof: 8, e: "sine" },
    { t: 17.2, tgt: [BULB.x - 0.6, 1.75, BULB.z], az: -26, el: 8, dist: 7.6, fov: 30, dof: 7, e: "io" },
    { t: 19.2, tgt: [BULB.x - 1.4, 1.75, BULB.z], az: 14, el: 7, dist: 7.6, fov: 30, dof: 7, e: "sine" },
    { t: T.ch3End, tgt: [BULB.x - 1.6, 1.75, BULB.z], az: 24, el: 8, dist: 7.4, fov: 30, dof: 6, e: "sine" },
    ...P.closingKeys(T.egg, T.end),
  ]);
  const fp = V(), ft = V(), cp = V(), ct = V();

  return (t) => {
    const c = cam(t);
    // along the wire: the camera tracks the charges on the top run
    const w = ease(t, T.flyIn - 0.45, T.flyIn, E.io2) * (1 - ease(t, T.flyOut, T.flyOut + 0.45, E.io2));
    const u = lerp(0.1, 0.33, ease(t, T.flyIn - 0.45, T.flyOut + 0.45, E.sine));
    wire.curve.getPointAt(u, fp).add(V(0, 0.55, 1.25));
    wire.curve.getPointAt(u + 0.06, ft);
    cp.lerpVectors(c.pos, fp, w);
    ct.lerpVectors(c.tgt, ft, w);
    stage.setCamera(cp, ct, lerp(c.fov, 44, w), lerp(c.dof, 6, w), w > 0.5 ? cp.distanceTo(ct) : c.focus, c.roll);
    stage.shadowFocus(ct, clamp(c.focus * 0.75, 5, 16));
    sky.update(t, cp.y);
    sea.update(t);
    sky.setDawn(ease(t, 0, 0.9, E.out) * (1 - ease(t, T.dive, T.dive + 0.8, E.io)));
    sky.setEgg(ease(t, T.egg - 0.6, T.egg + 0.9, E.out4), ease(t, T.egg - 0.2, T.egg + 1.6, E.io));

    // U: the column fills, the battery readout counts to 12 V
    const uK = E.spring(seg(t, T.volt, T.voltEnd), 0.8, 8);
    const h = Math.max(0.001, 2.5 * uK);
    fill.scale.y = h;
    fill.position.y = 0.24 + h / 2;
    voltTex.update({ v: Math.round(clamp(uK) * 12 * 10) / 10, unit: "V", dec: false, on: clamp(seg(t, T.volt - 0.4, T.volt)) });

    // I: charges start to move and speed up; the meter needle climbs to 2 A
    const iK = ease(t, T.flyIn - 1.0, T.meter + 0.6, E.io);
    const amount = ease(t, T.volt + 0.4, T.voltEnd, E.out);
    const phase = 0.006 * t + (0.05 - 0.006) * integ(t, T.flyIn - 1.0, T.meter + 0.6);
    charges.update(1, phase, 1, amount);
    dial.update({ a: Math.round(clamp(iK) * 2 * 50) / 50 });

    // P: the filament warms from vermilion to white, the bulb lights the set, 24 W
    const pK = ease(t, T.bulb, T.bulb + 1.4, E.io2);
    const flick = 1 - 0.04 * Math.max(0, Math.sin(t * 31)) * (1 - pK);
    const warm = new THREE.Color(PAL.verm).lerp(new THREE.Color(0xfff2d6), smooth(seg(pK, 0.3, 1)));
    filMat.color.copy(new THREE.Color(PAL.soft).lerp(warm.multiplyScalar(lerp(1, 4.0, pK)), clamp(pK * 3)));
    globeMat.emissiveIntensity = 0.45 * pK * flick;
    globeMat.opacity = 0.3 + 0.15 * pK;
    bulbLight.intensity = 28 * pK * flick;
    bulbHalo.material.opacity = 0.7 * pK * flick;
    coreGlow.material.opacity = 0.95 * pK * flick;
    wattTex.update({ v: Math.round(pK * 24), unit: "W", dec: false, on: clamp(seg(t, T.bulb - 0.4, T.bulb)) });

    return P.ceilingWhite(cp.y);
  };
});

// integral over [0, t] of an eased 0..1 ramp between a and b (sine ease), in seconds
function integ(t, a, b) {
  if (t <= a) return 0;
  const d = b - a;
  const k = Math.min(t, b) - a;
  const part = k / 2 - (d / (2 * Math.PI)) * Math.sin((Math.PI * k) / d);
  return part + Math.max(0, t - b);
}

// Rounded readout: value + unit on a night pill.
function drawReadout(g, s, w, h) {
  g.clearRect(0, 0, w, h);
  g.globalAlpha = s.on;
  g.fillStyle = "#0b1633";
  rr(g, 6, 6, w - 12, h - 12, 60);
  g.fill();
  g.fillStyle = "#ffffff";
  g.font = `640 150px "Geist", sans-serif`;
  g.textAlign = "right";
  g.textBaseline = "alphabetic";
  const txt = String(s.dec ? s.v.toFixed(1) : Math.round(s.v)).replace(".", ",");
  g.fillText(txt, w * 0.66, h * 0.73);
  g.fillStyle = "#e34234";
  g.font = `640 110px "Geist", sans-serif`;
  g.textAlign = "left";
  g.fillText(s.unit, w * 0.7, h * 0.73);
  g.globalAlpha = 1;
}

// Ammeter dial: 0-3 A arc, vermilion needle.
function drawDial(g, s, w, h) {
  g.clearRect(0, 0, w, h);
  g.fillStyle = "#f5f7fb";
  rr(g, 6, 6, w - 12, h - 12, 70);
  g.fill();
  const cx = w / 2, cy = h * 0.86, R = 200;
  const a0 = Math.PI * 1.1, a1 = Math.PI * 1.9;
  g.lineCap = "round";
  g.strokeStyle = "#dce3f0";
  g.lineWidth = 22;
  g.beginPath(); g.arc(cx, cy, R, a0, a1); g.stroke();
  const k = s.a / 3;
  g.strokeStyle = "#e34234";
  g.beginPath(); g.arc(cx, cy, R, a0, a0 + (a1 - a0) * Math.max(0.001, k)); g.stroke();
  g.fillStyle = "#4a5878";
  g.font = `560 34px "Geist", sans-serif`;
  g.textAlign = "center";
  for (let i = 0; i <= 3; i++) {
    const a = a0 + ((a1 - a0) * i) / 3;
    g.fillText(String(i), cx + Math.cos(a) * (R - 52), cy + Math.sin(a) * (R - 52) + 12);
  }
  const an = a0 + (a1 - a0) * k;
  g.strokeStyle = "#0b1633";
  g.lineWidth = 10;
  g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(an) * (R - 20), cy + Math.sin(an) * (R - 20)); g.stroke();
  g.fillStyle = "#0b1633";
  g.beginPath(); g.arc(cx, cy, 20, 0, Math.PI * 2); g.fill();
  g.font = `640 76px "Geist", sans-serif`;
  g.fillText(`${s.a.toFixed(1).replace(".", ",")} A`, cx, cy - 76);
}
function rr(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
