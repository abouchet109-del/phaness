// accompagner-solaire: set and use a home solar installation (orientation and tilt, inverter, daily monitoring).
import { run } from "../../_system/src/film.js";
import * as P from "../../_system/src/engine.js";

const { THREE, E, ease, seg, lerp, clamp, smooth, PAL, mesh, group, clay, plastic } = P;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// Timing (seconds) — keep in sync with the overlay timeline in compositions/film.html
const T = {
  dive: 2.4, land: 4.2,
  sun: 4.6, compass: 5.6, tilt: 6.6, tiltEnd: 8.2, ch1End: 10.2,
  cable: 10.6, inv: 11.8, power: 12.6, ch2End: 16.0,
  phone: 16.4, chart: 17.2, chartEnd: 19.4, ch3End: 21.6,
  egg: 23.0, end: 26,
};
const ARR = V(3.0, 0, 1.4); // ground-mounted array (pivot below its centre)
const TILT = THREE.MathUtils.degToRad(30);
const INV = V(-0.86, 1.7, -0.9); // inverter on the house's right wall
const PH = V(0.9, 2.7, 3.6); // phone
const PH_YAW = -0.96; // the phone turns to face the camera (shot from the south-west, house out of frame)
const PH_OFF = V(Math.cos(PH_YAW), 0, -Math.sin(PH_YAW)).multiplyScalar(-1.9); // phone on the right third

run(async (stage, anchors) => {
  const { scene } = stage;
  const sky = P.buildSky(stage);

  // ------------------------------------------------ island, garden, house
  mesh(P.pebble(9.6, 2.6, 0.8), clay(0xeef1f7, { rough: 0.8, rim: 0.12 }), { parent: scene, pos: [0.4, 0, 0.4] });
  const sea = P.cloudField(scene, {
    seed: 9, clusters: 180, radius: 50, inner: 8.8, y: -1.8, jitterY: 0.9, min: 1.4, max: 3.8, center: [0.4, 0, 0.4], drift: 0.1,
    avoid: (x, z) => Math.hypot(x - 0.4, z - 0.4) < 9.0,
  });
  mesh(P.pebble(5.6, 0.3, 0.25), clay(0xe3ecdf, { rough: 0.9, rim: 0.05 }), { parent: scene, pos: [3.0, 0.12, 1.6], scale: [1, 1, 0.8] });
  const wallMat = clay(0xfbfbfd, { rough: 0.85, rim: 0.1 });
  const house = group(scene, [-3.6, 0, -1.6]);
  mesh(P.rbox(5.2, 3.2, 4.2, 0.2), wallMat, { parent: house, pos: [0, 1.6, 0] });
  const roofMat = clay(PAL.vermDeep, { rough: 0.6, rim: 0.15 });
  for (const sz of [-1, 1]) mesh(P.rbox(5.8, 0.26, 2.9, 0.1), roofMat, { parent: house, pos: [0, 4.05, sz * 1.08], rot: [sz * 0.62, 0, 0] });
  mesh(P.rbox(1.0, 1.9, 0.12, 0.12), clay(PAL.night, { rim: 0.3 }), { parent: house, pos: [-0.9, 0.95, 2.1] });
  for (const x of [0.9, 1.9]) mesh(P.rbox(0.8, 0.9, 0.1, 0.1), plastic(0xa9badc, { rough: 0.12, coat: 1, env: 1.6 }), { parent: house, pos: [x, 1.9, 2.1] });
  mesh(P.rbox(0.1, 0.9, 1.2, 0.1), plastic(0xa9badc, { rough: 0.12, coat: 1, env: 1.6 }), { parent: house, pos: [2.62, 2.2, 0.9] });
  // a small tree
  const tree = group(scene, [-2.2, 0, 2.4]);
  mesh(P.cyl(0.1, 0.14, 1.2, 16), clay(PAL.soft), { parent: tree, pos: [0, 0.6, 0] });
  mesh(P.sphere(0.8), clay(0xcfe0d3, { rough: 0.8 }), { parent: tree, pos: [0, 1.7, 0] });
  mesh(P.sphere(0.55), clay(0xdcebdf, { rough: 0.8 }), { parent: tree, pos: [0.45, 1.35, 0.2] });

  // ------------------------------------------------ the ground-mounted array (2 rows x 4 panels), tilts on its axle
  const cells = P.canvasTexture(512, 256, drawCells);
  cells.update({});
  const glass = plastic(0xffffff, { rough: 0.14, coat: 1, coatRough: 0.08, env: 2.2, rim: 0.3, map: cells.tex });
  const frameMat = clay(0xf4f6fa, { rough: 0.5 });
  const arr = group(scene, [ARR.x, 0, ARR.z]);
  for (const x of [-2.4, 2.4]) {
    mesh(P.rbox(0.18, 1.2, 0.18, 0.06), clay(PAL.soft), { parent: arr, pos: [x, 0.6, 0] });
    mesh(P.cyl(0.2, 0.24, 0.12, 24), clay(PAL.night), { parent: arr, pos: [x, 0.06, 0] });
  }
  mesh(P.cyl(0.08, 0.08, 5.2, 20), clay(PAL.night), { parent: arr, pos: [0, 1.2, 0], rot: [0, 0, Math.PI / 2] });
  const deck = group(arr, [0, 1.2, 0]);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
    const p = group(deck, [-1.83 + c * 1.22, 0.08, -0.62 + r * 1.24]);
    mesh(P.rbox(1.16, 0.08, 1.18, 0.05), frameMat, { parent: p });
    const g = mesh(new THREE.PlaneGeometry(1.06, 1.08), glass, { parent: p, pos: [0, 0.046, 0], rot: [-Math.PI / 2, 0, 0], cast: false });
  }
  // tilt gauge (quarter arc at the end of the axle)
  const gauge = group(arr, [2.75, 1.2, 0], [0, Math.PI / 2, 0]);
  const gaugeArc = mesh(P.torus(0.95, 0.035, 64, TILT), clay(PAL.verm, { emissive: PAL.verm, emissiveIntensity: 0.4 }), { parent: gauge, cast: false });
  mesh(P.rbox(1.0, 0.04, 0.04, 0.02), clay(PAL.night), { parent: gauge, pos: [0.5, 0, 0], cast: false });
  // compass on the lawn: arrow to the south (+z)
  const comp = group(scene, [ARR.x - 0.2, 0.2, ARR.z + 2.6]);
  mesh(P.cyl(0.75, 0.8, 0.1, 64), plastic(0xffffff, { rim: 0.2 }), { parent: comp });
  const needle = group(comp, [0, 0.08, 0]);
  mesh(P.cyl(0.0, 0.16, 0.9, 3), clay(PAL.verm), { parent: needle, pos: [0, 0, 0.3], rot: [Math.PI / 2, 0, 0] });
  mesh(P.cyl(0.16, 0.0, 0.5, 3), clay(PAL.night), { parent: needle, pos: [0, 0, -0.4], rot: [Math.PI / 2, 0, 0] });

  // ------------------------------------------------ the sun: crosses the background sky (placed in camera space, far away)
  const sun = mesh(P.sphere(1.3), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffd27a).multiplyScalar(1.3), fog: false }), { parent: scene, cast: false, receive: false });
  sun.userData.noAO = true;
  const sunHalo = P.halo(scene, 0xffc46b, 11, 0.6);
  sunHalo.material.fog = false;
  const fwd = V(), right = V(), up = V();
  const sunPos = (k, cam) => {
    cam.getWorldDirection(fwd);
    right.crossVectors(fwd, cam.up).normalize();
    up.crossVectors(right, fwd).normalize();
    const a = Math.PI * k; // 0 = east (right of frame), 1 = west (left)
    return cam.position.clone().addScaledVector(fwd, 46).addScaledVector(right, Math.cos(a) * 15).addScaledVector(up, 3.5 + Math.sin(a) * 6);
  };

  // ------------------------------------------------ the cable to the inverter, the inverter, the meter
  const cable = P.tube([[ARR.x - 2.4, 0.2, ARR.z], [ARR.x - 3.2, 0.16, ARR.z - 0.6], [0.4, 0.16, -0.2], [-0.7, 0.2, -0.6], [-0.95, 0.6, -0.8], [-0.95, 1.1, -0.9]], 0.06, false, 160);
  const cableMesh = mesh(cable.geo, clay(PAL.night, { rough: 0.5, rim: 0.25 }), { parent: scene });
  const sparks = P.flow(scene, cable.curve, { count: 16, size: 0.07, color: 0xffc46b, emissive: 0xffa23a, glow: 0.8 });
  const inv = group(scene, [INV.x, INV.y, INV.z]);
  mesh(P.rbox(0.28, 1.3, 1.0, 0.12), plastic(0xffffff, { rim: 0.25 }), { parent: inv });
  const invTex = P.canvasTexture(512, 512, drawInverter);
  const invScreen = mesh(new THREE.PlaneGeometry(0.7, 0.7), new THREE.MeshBasicMaterial({ map: invTex.tex, toneMapped: false }), { parent: inv, pos: [0.146, 0.15, 0], rot: [0, Math.PI / 2, 0], cast: false });
  invScreen.userData.noAO = true;
  const invLed = mesh(P.sphere(0.045, 16), plastic(0xffd0c4, { emissive: PAL.verm, emissiveIntensity: 0 }), { parent: inv, pos: [0.15, -0.4, 0.3] });

  // ------------------------------------------------ the phone (monitoring app)
  const phone = group(scene, [PH.x, PH.y, PH.z]);
  const phoneBody = group(phone);
  mesh(P.slab(1.7, 3.3, 0.18, 0.3), plastic(PAL.night, { rim: 0.35 }), { parent: phoneBody });
  const appTex = P.canvasTexture(512, 1000, drawApp);
  const appScreen = mesh(new THREE.PlaneGeometry(1.52, 2.97), new THREE.MeshBasicMaterial({ map: appTex.tex, toneMapped: false }), { parent: phoneBody, pos: [0, 0, 0.095], cast: false });
  appScreen.userData.noAO = true;

  // ------------------------------------------------ anchors for the labels
  anchors.compass = () => V(comp.position.x, 0.3, comp.position.z);
  anchors.tilt = () => V(ARR.x + 2.75, 1.2 + Math.sin(TILT * 0.5) * 0.95, ARR.z - Math.cos(TILT * 0.5) * 0.95 * 0 + 0.2);
  anchors.inv = () => INV.clone().add(V(0.2, 0.65, 0.3));

  // ------------------------------------------------ camera
  const cam = P.rig([
    ...P.openingKeys(T.dive),
    { t: T.land, tgt: [0.6, 1.4, 0.6], az: 28, el: 26, dist: 22, fov: 30, dof: 3, e: "io4" },
    { t: 5.6, tgt: [ARR.x + 0.6, 1.6, ARR.z + 0.6], az: 18, el: 14, dist: 12.5, fov: 30, dof: 5, e: "io" },
    { t: T.ch1End, tgt: [ARR.x, 1.5, ARR.z + 0.4], az: -34, el: 12, dist: 10.5, fov: 30, dof: 6, e: "sine" },
    { t: 11.6, tgt: [0.6, 0.6, -0.2], az: 30, el: 28, dist: 7.5, fov: 30, dof: 6, e: "io" },
    { t: 12.6, tgt: [INV.x + 0.1, INV.y, INV.z], az: 78, el: 6, dist: 4.4, fov: 30, dof: 9, e: "io" },
    { t: T.ch2End, tgt: [INV.x + 0.1, INV.y + 0.05, INV.z], az: 98, el: 2, dist: 3.9, fov: 30, dof: 9, e: "sine" },
    { t: 17.4, tgt: [PH.x + PH_OFF.x, PH.y, PH.z + PH_OFF.z], az: -64, el: 6, dist: 7.2, fov: 30, dof: 8, e: "io4" },
    { t: T.ch3End, tgt: [PH.x + PH_OFF.x, PH.y + 0.05, PH.z + PH_OFF.z], az: -48, el: 2, dist: 6.6, fov: 30, dof: 8, e: "sine" },
    ...P.closingKeys(T.egg, T.end),
  ]);

  const dir = V();
  return (t) => {
    const c = cam(t);
    stage.setCamera(c.pos, c.tgt, c.fov, c.dof, c.focus, c.roll);
    // the key light follows the sun across the day
    const day = ease(t, T.sun, T.ch2End, E.sine);
    const sp = sunPos(lerp(0.15, 0.6, day), stage.camera);
    const az = lerp(1.1, -0.6, day); // key light from the south-east, swinging west
    stage.keyDir.set(Math.sin(az) * 0.7, 1.0, Math.cos(az) * 0.7).normalize();
    stage.shadowFocus(c.tgt, clamp(c.focus * 0.75, 5, 16));
    sky.update(t, c.pos.y);
    sea.update(t);
    sky.setDawn(ease(t, 0, 0.9, E.out) * (1 - ease(t, T.dive, T.dive + 0.8, E.io)));
    sky.setEgg(ease(t, T.egg - 0.6, T.egg + 0.9, E.out4), ease(t, T.egg - 0.2, T.egg + 1.6, E.io));

    // sun rises along its path
    const sunOn = E.spring(seg(t, T.sun, T.sun + 0.9), 0.7, 9);
    sun.position.copy(sp);
    sun.scale.setScalar(Math.max(0.0001, sunOn));
    sunHalo.position.copy(sp);
    sunHalo.material.opacity = 0.65 * clamp(sunOn);
    sun.visible = sunHalo.visible = t < 11.4;

    // compass needle spins and settles on south, then the array tilts to 30 degrees
    const cs = E.spring(seg(t, T.compass, T.compass + 1.2), 0.55, 8);
    comp.scale.setScalar(Math.max(0.0001, clamp(seg(t, T.compass - 0.1, T.compass + 0.3)) * (0.6 + 0.4 * cs)));
    needle.rotation.y = (1 - cs) * 5.5;
    const tilt = lerp(0.05, TILT, E.spring(seg(t, T.tilt, T.tiltEnd), 0.75, 8));
    deck.rotation.x = tilt;
    gauge.scale.setScalar(Math.max(0.0001, ease(t, T.tilt, T.tilt + 0.4, E.out)));
    gaugeArc.geometry.dispose();
    gaugeArc.geometry = P.torus(0.95, 0.035, 64, Math.max(0.01, tilt));
    gaugeArc.rotation.z = 0;

    // energy flows to the inverter; its screen counts up
    const flowK = ease(t, T.cable, T.cable + 0.8, E.out);
    sparks.update(t, 0.32, 1, flowK * (t < T.ch2End + 0.4 ? 1 : 0));
    const ledK = ease(t, T.inv, T.inv + 0.3);
    invLed.material.emissiveIntensity = 1.6 * ledK;
    const kw = lerp(0, 2.4, ease(t, T.power, T.power + 1.6, E.out));
    invTex.update({ on: Math.round(ledK * 10) / 10, kw: Math.round(kw * 10) / 10 });

    // the phone flips in, the day's production curve draws itself
    const pk = E.spring(seg(t, T.phone, T.phone + 1.0), 0.7, 9);
    phone.scale.setScalar(Math.max(0.0001, pk));
    phone.visible = t > T.phone - 0.05;
    phoneBody.rotation.set((1 - pk) * 0.6, PH_YAW + (1 - pk) * -2.2 + Math.sin(t * 0.9) * 0.05, (1 - pk) * 0.2);
    phone.position.y = PH.y + (1 - clamp(pk)) * -1.2;
    const ck = ease(t, T.chart, T.chartEnd, E.io);
    appTex.update({ k: Math.round(ck * 60) / 60 });

    return P.ceilingWhite(c.pos.y);
  };
});

// Photovoltaic cells: a navy grid with thin bright busbars.
function drawCells(g, s, w, h) {
  const bg = g.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#2c3f74");
  bg.addColorStop(1, "#15224a");
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  g.strokeStyle = "rgba(220,227,240,0.55)";
  g.lineWidth = 3;
  for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo((i * w) / 6, 0); g.lineTo((i * w) / 6, h); g.stroke(); }
  for (let j = 1; j < 3; j++) { g.beginPath(); g.moveTo(0, (j * h) / 3); g.lineTo(w, (j * h) / 3); g.stroke(); }
  g.strokeStyle = "rgba(220,227,240,0.18)";
  g.lineWidth = 1.5;
  for (let i = 0; i < 24; i++) { g.beginPath(); g.moveTo(((i + 0.5) * w) / 24, 0); g.lineTo(((i + 0.5) * w) / 24, h); g.stroke(); }
}

// Inverter screen: status dot and the live output.
function drawInverter(g, s, w, h) {
  g.fillStyle = "#0b1633";
  g.fillRect(0, 0, w, h);
  g.fillStyle = s.on > 0.5 ? "#e34234" : "#4a5878";
  g.beginPath();
  g.arc(70, 76, 22, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.7)";
  g.font = `560 40px "Geist", sans-serif`;
  g.textBaseline = "middle";
  g.fillText(s.on > 0.5 ? "En production" : "Veille", 110, 78);
  g.fillStyle = "#ffffff";
  g.font = `640 170px "Geist", sans-serif`;
  g.textAlign = "right";
  g.textBaseline = "alphabetic";
  g.fillText(s.kw.toFixed(1).replace(".", ","), 350, 330);
  g.font = `600 70px "Geist", sans-serif`;
  g.textAlign = "left";
  g.fillText("kW", 366, 330);
  // output bar
  g.fillStyle = "rgba(255,255,255,0.14)";
  g.fillRect(56, 400, 400, 22);
  g.fillStyle = "#e34234";
  g.fillRect(56, 400, 400 * (s.kw / 3), 22);
}

// Monitoring app: production over the day, a bell curve that draws itself.
function drawApp(g, s, w, h) {
  const bg = g.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#ffffff");
  bg.addColorStop(1, "#eef2f8");
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  g.fillStyle = "#0b1633";
  g.font = `640 54px "Geist", sans-serif`;
  g.textBaseline = "alphabetic";
  g.fillText("Aujourd’hui", 44, 120);
  g.fillStyle = "#4a5878";
  g.font = `520 34px "Geist", sans-serif`;
  g.fillText("Production", 44, 176);
  // total so far
  const total = 18.6 * (s.k < 1 ? smoothK(s.k) : 1);
  g.fillStyle = "#0b1633";
  g.font = `660 118px "Geist", sans-serif`;
  const totalTxt = total.toFixed(1).replace(".", ",");
  g.fillText(totalTxt, 44, 320);
  const tw = g.measureText(totalTxt).width;
  g.font = `600 44px "Geist", sans-serif`;
  g.fillText("kWh", 44 + tw + 14, 320);
  // chart
  const x0 = 44, x1 = w - 44, y0 = 820, y1 = 420;
  g.strokeStyle = "#dce3f0";
  g.lineWidth = 3;
  for (let i = 0; i < 4; i++) { const y = y0 - (i * (y0 - y1)) / 3; g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); }
  const N = 80, upto = Math.floor(N * s.k);
  const pt = (i) => {
    const u = i / N;
    const v = Math.exp(-Math.pow((u - 0.52) / 0.19, 2));
    return [lerp(x0, x1, u), lerp(y0, y1 + 30, v)];
  };
  if (upto > 1) {
    g.beginPath();
    g.moveTo(x0, y0);
    for (let i = 0; i <= upto; i++) { const [x, y] = pt(i); g.lineTo(x, y); }
    const [lx] = pt(upto);
    g.lineTo(lx, y0);
    g.closePath();
    const fill = g.createLinearGradient(0, y1, 0, y0);
    fill.addColorStop(0, "rgba(227,66,52,0.32)");
    fill.addColorStop(1, "rgba(227,66,52,0.02)");
    g.fillStyle = fill;
    g.fill();
    g.beginPath();
    for (let i = 0; i <= upto; i++) { const [x, y] = pt(i); i ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.strokeStyle = "#e34234";
    g.lineWidth = 8;
    g.lineJoin = "round";
    g.stroke();
    const [hx, hy] = pt(upto);
    g.fillStyle = "#ffffff";
    g.beginPath(); g.arc(hx, hy, 16, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#e34234"; g.lineWidth = 7; g.stroke();
  }
  g.fillStyle = "#4a5878";
  g.font = `520 30px "Geist", sans-serif`;
  g.textAlign = "left"; g.fillText("6 h", x0, y0 + 50);
  g.textAlign = "center"; g.fillText("12 h", (x0 + x1) / 2 + 10, y0 + 50);
  g.textAlign = "right"; g.fillText("20 h", x1, y0 + 50);
  g.textAlign = "left";
}
function smoothK(k) {
  // share of the day's energy produced by fraction k of the day (integral of the bell curve, approximated)
  return k * k * (3 - 2 * k);
}
