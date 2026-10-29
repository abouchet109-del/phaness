// securiser-usine: safety rules for a newcomer's first day in a factory (PPE, traffic lanes, evacuation).
import { run } from "../../_system/src/film.js";
import * as P from "../../_system/src/engine.js";

const { THREE, E, ease, seg, lerp, clamp, smooth, PAL, mesh, group, clay, plastic } = P;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// Timing (seconds) — keep in sync with the overlay timeline in compositions/film.html
const T = {
  dive: 2.4, land: 4.2,
  helmet: 5.4, glasses: 6.2, vest: 7.0, shoes: 7.8, ch1End: 10.2,
  walk1: 10.4, stop: 12.0, lift: 12.0, liftEnd: 14.4, walk2: 14.3, ch2End: 16.0,
  alarm: 16.4, arrows: 17.0, walk3: 17.6, sign: 18.4, safe: 20.6, ch3End: 21.6,
  egg: 23.0, end: 26,
};
const LANE_Z = 2.4; // pedestrian lane (along x)
const AISLE_X = 1.2; // forklift aisle (along z)

run(async (stage, anchors) => {
  const { scene } = stage;
  const sky = P.buildSky(stage);

  // ------------------------------------------------ the island and the workshop
  mesh(P.pebble(10.5, 2.8, 0.8), clay(0xeef1f7, { rough: 0.8, rim: 0.12 }), { parent: scene, pos: [0.8, 0, 0] });
  const sea = P.cloudField(scene, {
    seed: 5, clusters: 190, radius: 52, inner: 9.5, y: -1.8, jitterY: 0.9, min: 1.4, max: 3.8, center: [0.8, 0, 0], drift: 0.1,
    avoid: (x, z) => Math.hypot(x - 0.8, z) < 9.8,
  });
  const floorMat = clay(0xdfe5f1, { rough: 0.75, rim: 0.05 });
  mesh(P.rbox(13.4, 0.12, 10.4, 0.06), floorMat, { parent: scene, pos: [0, 0.06, -0.2] });
  const wallMat = clay(0xfbfbfd, { rough: 0.85, rim: 0.1 });
  mesh(P.rbox(13.4, 4.6, 0.5, 0.22), wallMat, { parent: scene, pos: [0, 2.3, -5.4] });
  mesh(P.rbox(0.5, 4.6, 6.2, 0.22), wallMat, { parent: scene, pos: [-6.7, 2.3, -2.3] });
  // shed roof ribs along the back wall
  for (let i = 0; i < 4; i++) mesh(P.capsule(0.32, 2.6, 24), wallMat, { parent: scene, pos: [-5 + i * 3.35, 4.9, -5.3], rot: [0, 0, Math.PI / 2] });

  // racks with boxes (back left)
  const upMat = clay(PAL.night, { rough: 0.5, rim: 0.3 }), beamMat = clay(PAL.verm, { rough: 0.5 });
  const boxCols = [0xffffff, 0xf3d9cf, PAL.mist, 0xf6c9b9];
  for (let r = 0; r < 2; r++) {
    const x0 = -5.6 + r * 3.1;
    for (const x of [x0, x0 + 2.7]) for (const z of [-4.9, -3.9]) mesh(P.rbox(0.12, 3.4, 0.12, 0.05), upMat, { parent: scene, pos: [x, 1.8, z] });
    for (let l = 0; l < 3; l++) {
      const y = 0.5 + l * 1.15;
      for (const z of [-4.9, -3.9]) mesh(P.rbox(2.8, 0.12, 0.1, 0.04), beamMat, { parent: scene, pos: [x0 + 1.35, y, z] });
      for (let b = 0; b < 3; b++) {
        if ((r * 7 + l * 3 + b) % 5 === 4) continue;
        const h = 0.55 + ((r + l + b) % 3) * 0.12;
        mesh(P.rbox(0.72, h, 0.78, 0.1), clay(boxCols[(r + l * 2 + b) % 4], { rough: 0.7 }), { parent: scene, pos: [x0 + 0.5 + b * 0.85, y + 0.06 + h / 2, -4.4] });
      }
    }
  }
  // machine (back right)
  const mach = group(scene, [4.2, 0.12, -3.6]);
  mesh(P.rbox(3.4, 2.2, 2.2, 0.3), plastic(0xf7f8fb, { rim: 0.25 }), { parent: mach, pos: [0, 1.1, 0] });
  mesh(P.rbox(3.6, 0.3, 2.4, 0.12), clay(PAL.night, { rim: 0.3 }), { parent: mach, pos: [0, 0.15, 0] });
  mesh(P.rbox(1.1, 0.8, 0.1, 0.12), plastic(0xa9badc, { rough: 0.12, coat: 1, env: 1.6 }), { parent: mach, pos: [-0.7, 1.45, 1.12] });
  mesh(P.cyl(0.16, 0.16, 0.12, 32), clay(PAL.verm), { parent: mach, pos: [0.8, 1.45, 1.12], rot: [Math.PI / 2, 0, 0] });
  const fly = group(mach, [1.75, 1.3, 0]);
  mesh(P.torus(0.55, 0.12), clay(PAL.night, { rim: 0.3 }), { parent: fly, rot: [0, Math.PI / 2, 0] });
  for (let i = 0; i < 3; i++) mesh(P.rbox(0.08, 1.0, 0.08, 0.03), clay(PAL.soft), { parent: fly, rot: [(i / 3) * Math.PI, 0, 0] });

  // ------------------------------------------------ floor markings
  const lineMat = clay(PAL.butter, { rough: 0.55, rim: 0.05 });
  for (const dz of [-0.75, 0.75]) mesh(P.rbox(15.6, 0.03, 0.12, 0.02, 2), lineMat, { parent: scene, pos: [0.9, 0.13, LANE_Z + dz], cast: false });
  // forklift aisle edges (dashed) and the crossing (zebra)
  for (const dx of [-1.1, 1.1]) for (let i = 0; i < 9; i++) {
    const z = -4.6 + i * 1.15;
    if (Math.abs(z - LANE_Z) < 1.0) continue;
    mesh(P.rbox(0.1, 0.03, 0.6, 0.02, 2), clay(0xffffff, { rough: 0.6 }), { parent: scene, pos: [AISLE_X + dx, 0.13, z], cast: false });
  }
  for (let i = 0; i < 5; i++) mesh(P.rbox(0.28, 0.03, 1.3, 0.04, 2), clay(0xffffff, { rough: 0.6 }), { parent: scene, pos: [AISLE_X - 0.8 + i * 0.4, 0.13, LANE_Z], cast: false });
  // evacuation chevrons along the lane, to the assembly point
  const chevrons = [];
  for (let i = 0; i < 9; i++) {
    const m = clay(PAL.shade, { rough: 0.5, emissive: PAL.verm, emissiveIntensity: 0 });
    const g = group(scene, [2.4 + i * 0.75, 0.15, LANE_Z]);
    mesh(P.capsule(0.06, 0.34, 12), m, { parent: g, pos: [-0.1, 0, -0.13], rot: [Math.PI / 2, 0, -0.8], cast: false });
    mesh(P.capsule(0.06, 0.34, 12), m, { parent: g, pos: [-0.1, 0, 0.13], rot: [Math.PI / 2, 0, 0.8], cast: false });
    g.rotation.x = 0;
    chevrons.push({ g, m });
  }

  // ------------------------------------------------ the alarm beacon (on the machine)
  const beacon = group(scene, [3.2, 2.66, -3.4]);
  mesh(P.cyl(0.4, 0.42, 0.16, 40), clay(PAL.night, { rim: 0.3 }), { parent: beacon, pos: [0, -0.16, 0] });
  const domeMat = plastic(0xf4b0a4, { emissive: PAL.verm, emissiveIntensity: 0, rough: 0.25 });
  mesh(P.cyl(0.3, 0.34, 0.5, 40), domeMat, { parent: beacon, pos: [0, 0.15, 0] });
  mesh(new THREE.SphereGeometry(0.3, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2), domeMat, { parent: beacon, pos: [0, 0.4, 0] });
  const beaconLight = new THREE.PointLight(PAL.verm, 0, 16, 1.4);
  beaconLight.position.set(0, 0.5, 0.6);
  beacon.add(beaconLight);
  const beaconHalo = P.halo(beacon, 0xff6a55, 4.2, 0);
  beaconHalo.position.set(0, 0.35, 0.4);

  // ------------------------------------------------ assembly point (outside, right)
  const ASM = V(8.4, 0, LANE_Z);
  const asm = group(scene, [ASM.x, 0, ASM.z - 1.0]);
  mesh(P.cyl(0.07, 0.07, 2.6, 20), clay(PAL.soft), { parent: asm, pos: [0, 1.3, 0] });
  const signTex = P.canvasTexture(256, 256, drawAssembly);
  signTex.update({});
  const sign = group(asm, [0, 2.75, 0.06]);
  mesh(P.rbox(1.2, 1.2, 0.12, 0.22), plastic(0xffffff, { rim: 0.2 }), { parent: sign });
  const face = mesh(new THREE.PlaneGeometry(1.0, 1.0), new THREE.MeshBasicMaterial({ map: signTex.tex, toneMapped: false, transparent: true }), { parent: sign, pos: [0, 0, 0.065], cast: false });
  face.userData.noAO = true;
  const ring = mesh(P.torus(1.3, 0.05, 96), clay(PAL.verm, { emissive: PAL.verm, emissiveIntensity: 0.3 }), { parent: scene, pos: [ASM.x, 0.14, ASM.z], rot: [Math.PI / 2, 0, 0], cast: false });

  // ------------------------------------------------ the newcomer and the PPE
  const man = P.figure(scene, { body: PAL.soft, legs: PAL.night });
  const helmet = group(man.head, [0, 0.07, 0]);
  mesh(new THREE.SphereGeometry(0.27, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2), plastic(PAL.verm, { rim: 0.2 }), { parent: helmet });
  mesh(P.cyl(0.34, 0.34, 0.035, 40), plastic(PAL.verm, { rim: 0.2 }), { parent: helmet, pos: [0, 0.0, 0.04] });
  mesh(P.rbox(0.07, 0.26, 0.5, 0.03), plastic(0xd83a2d), { parent: helmet, pos: [0, 0.16, 0], rot: [0, 0, 0] });
  const glasses = group(man.head, [0, 0.03, 0.17]);
  mesh(P.rbox(0.4, 0.12, 0.06, 0.05), plastic(0x1b2a52, { rough: 0.08, coat: 1, env: 1.8, rim: 0.4 }), { parent: glasses });
  mesh(P.torus(0.235, 0.018, 40, Math.PI), clay(PAL.night), { parent: glasses, pos: [0, 0, -0.17], rot: [Math.PI / 2, 0, 0] });
  const vest = group(man.hip, [0, 0.44, 0]);
  const vestMat = clay(PAL.butter, { rough: 0.5, rim: 0.15 });
  mesh(P.capsule(0.3, 0.32), vestMat, { parent: vest, scale: [1, 1, 0.92] });
  for (const y of [-0.12, 0.08]) mesh(P.torus(0.3, 0.03, 48), plastic(0xffffff, { rough: 0.2 }), { parent: vest, pos: [0, y, 0], rot: [Math.PI / 2, 0, 0], scale: [1, 0.92, 1] });
  const shoes = man.legs.map((lg) => {
    const s = group(lg.g, [0, -0.86, 0.05]);
    mesh(P.rbox(0.27, 0.17, 0.4, 0.07), clay(PAL.night, { rough: 0.45, rim: 0.35 }), { parent: s });
    mesh(P.rbox(0.28, 0.1, 0.12, 0.05), clay(PAL.verm), { parent: s, pos: [0, -0.02, 0.17] });
    return s;
  });
  const MAN0 = V(-5.0, 0.12, LANE_Z);

  // ------------------------------------------------ the forklift
  const fork = group(scene, [AISLE_X, 0.12, -6]);
  const fbody = plastic(PAL.verm, { rim: 0.2 });
  mesh(P.rbox(1.3, 0.9, 1.9, 0.3), fbody, { parent: fork, pos: [0, 0.75, -0.2] });
  mesh(P.rbox(1.2, 0.5, 0.7, 0.22), clay(PAL.night, { rim: 0.3 }), { parent: fork, pos: [0, 1.25, -0.85] });
  mesh(P.rbox(0.12, 1.4, 0.12, 0.04), clay(PAL.night), { parent: fork, pos: [-0.5, 1.9, -0.25] });
  mesh(P.rbox(0.12, 1.4, 0.12, 0.04), clay(PAL.night), { parent: fork, pos: [0.5, 1.9, -0.25] });
  mesh(P.rbox(1.12, 0.1, 1.2, 0.05), clay(PAL.night), { parent: fork, pos: [0, 2.6, -0.05] });
  const fwarn = mesh(P.sphere(0.1, 20), plastic(0xffd0c4, { emissive: PAL.verm, emissiveIntensity: 0.6 }), { parent: fork, pos: [0, 2.72, -0.2] });
  const mast = group(fork, [0, 0.2, 0.85]);
  for (const x of [-0.45, 0.45]) mesh(P.rbox(0.12, 2.4, 0.12, 0.04), clay(PAL.night), { parent: mast, pos: [x, 1.1, 0] });
  const carriage = group(mast, [0, 0.4, 0.1]);
  for (const x of [-0.3, 0.3]) mesh(P.rbox(0.12, 0.06, 1.1, 0.03), clay(PAL.soft), { parent: carriage, pos: [x, 0, 0.55] });
  mesh(P.rbox(1.1, 0.12, 1.1, 0.04), clay(0xf3d9cf, { rough: 0.8 }), { parent: carriage, pos: [0, 0.1, 0.55] });
  mesh(P.rbox(0.9, 0.7, 0.9, 0.1), clay(0xffffff, { rough: 0.7 }), { parent: carriage, pos: [0, 0.52, 0.55] });
  const wheels = [];
  for (const x of [-0.68, 0.68]) for (const z of [0.45, -0.9]) {
    const w = group(fork, [x, 0.3, z], [0, 0, Math.PI / 2]);
    mesh(P.cyl(0.3, 0.3, 0.24, 32), clay(PAL.night, { rough: 0.6 }), { parent: w });
    mesh(P.cyl(0.14, 0.14, 0.26, 24), clay(PAL.mist), { parent: w });
    wheels.push(w);
  }

  // ------------------------------------------------ anchors for the labels
  const wp = (obj, off) => () => obj.getWorldPosition(V()).add(off);
  anchors.helmet = wp(man.head, V(0, 0.32, 0));
  anchors.vest = wp(man.hip, V(0, 0.4, 0.3));
  anchors.shoes = wp(man.legs[1].foot, V(0, 0, 0.1));
  anchors.lane = () => V(-2.6, 0.15, LANE_Z + 0.75);
  anchors.fork = wp(fork, V(0, 2.9, 0));
  anchors.asm = () => V(ASM.x, 3.4, ASM.z - 1.0);

  // ------------------------------------------------ camera
  const cam = P.rig([
    ...P.openingKeys(T.dive),
    { t: T.land, tgt: [0.4, 1.0, 0], az: -38, el: 34, dist: 24, fov: 30, dof: 3, e: "io4" },
    { t: 5.2, tgt: [-5.0, 1.35, LANE_Z], az: -40, el: 12, dist: 7.5, fov: 30, dof: 7, e: "io" },
    { t: T.ch1End, tgt: [-5.0, 1.3, LANE_Z], az: 55, el: 8, dist: 6.2, fov: 30, dof: 8, e: "sine" },
    { t: 12.2, tgt: [-0.6, 1.0, LANE_Z - 0.6], az: 32, el: 44, dist: 14, fov: 30, dof: 5, e: "io" },
    { t: T.ch2End, tgt: [1.0, 0.8, LANE_Z - 0.8], az: -12, el: 56, dist: 15, fov: 30, dof: 4, e: "sine" },
    { t: 17.8, tgt: [2.6, 1.6, LANE_Z - 1.5], az: -48, el: 14, dist: 12, fov: 30, dof: 5, e: "io" },
    { t: T.ch3End, tgt: [6.6, 1.5, LANE_Z - 0.4], az: -20, el: 10, dist: 10.5, fov: 30, dof: 6, e: "sine" },
    ...P.closingKeys(T.egg, T.end),
  ]);

  return (t) => {
    const c = cam(t);
    stage.setCamera(c.pos, c.tgt, c.fov, c.dof, c.focus, c.roll);
    stage.shadowFocus(c.tgt, clamp(c.focus * 0.75, 5, 16));
    sky.update(t, c.pos.y);
    sea.update(t);
    sky.setDawn(ease(t, 0, 0.9, E.out) * (1 - ease(t, T.dive, T.dive + 0.8, E.io)));
    sky.setEgg(ease(t, T.egg - 0.6, T.egg + 0.9, E.out4), ease(t, T.egg - 0.2, T.egg + 1.6, E.io));
    fly.rotation.x = t * 3;

    // PPE drop in one after another (spring), the newcomer turns with the camera
    const drop = (at) => E.spring(seg(t, at, at + 0.7), 0.62, 11);
    const h = drop(T.helmet);
    helmet.position.y = 0.07 + (1 - h) * 1.6;
    helmet.scale.setScalar(Math.max(0.0001, clamp(seg(t, T.helmet - 0.05, T.helmet + 0.15))));
    helmet.rotation.y = (1 - h) * 2.4;
    const g = drop(T.glasses);
    glasses.scale.setScalar(Math.max(0.0001, g));
    glasses.position.z = 0.17 + (1 - g) * 0.4;
    const v = drop(T.vest);
    vest.scale.set(Math.max(0.0001, v), Math.max(0.0001, v * 1.0), Math.max(0.0001, v));
    vest.rotation.y = (1 - v) * -3;
    const s = drop(T.shoes);
    shoes.forEach((sh, i) => sh.scale.setScalar(Math.max(0.0001, E.spring(seg(t, T.shoes + i * 0.12, T.shoes + i * 0.12 + 0.7), 0.6, 11))));

    // newcomer path: entrance -> stop line -> wait -> cross -> evacuate to the assembly point
    const k1 = ease(t, T.walk1, T.stop, E.io2);
    const k2 = ease(t, T.walk2, T.ch2End - 0.2, E.io2);
    const k3 = ease(t, T.walk3, T.safe, E.io2);
    let x = lerp(MAN0.x, AISLE_X - 1.45, k1);
    x = lerp(x, AISLE_X + 1.7, k2);
    x = lerp(x, ASM.x - 0.2, k3);
    man.group.position.set(x, 0.12, LANE_Z);
    const walking = (t > T.walk1 && t < T.stop) || (t > T.walk2 && t < T.ch2End - 0.2) || (t > T.walk3 && t < T.safe);
    const amt = walking ? Math.min(1, Math.min(t - (t < T.stop ? T.walk1 : t < T.ch2End ? T.walk2 : T.walk3), 0.3) / 0.3) : 0;
    man.walk(t * 1.7, amt);
    // faces the camera while equipping, then walks along +x
    const turn = ease(t, 4.6, 5.3, E.io) * (1 - ease(t, T.walk1 - 0.3, T.walk1 + 0.3, E.io));
    man.group.rotation.y = lerp(Math.PI / 2, -0.55, turn);
    // looks at the forklift while waiting
    man.head.rotation.y = 0.75 * ease(t, T.stop - 0.1, T.stop + 0.4) * (1 - ease(t, T.liftEnd - 0.5, T.liftEnd));
    // raises a hand at the assembly point
    man.arms[1].g.rotation.x = -2.6 * ease(t, T.safe - 0.1, T.safe + 0.4, E.out);

    // forklift drives down the aisle, crossing the lane while the newcomer waits
    const fk = ease(t, T.lift, T.liftEnd, E.sine);
    const fz = lerp(-6.5, 8.5, fk);
    fork.position.z = fz;
    fork.visible = t > T.lift - 0.1 && t < T.liftEnd + 0.1;
    wheels.forEach((w) => (w.rotation.x = fz / 0.3));
    carriage.position.y = 0.4 + 0.25 * Math.sin(t * 0.8);
    fwarn.material.emissiveIntensity = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 12));

    // alarm: beacon pulses, chevrons light in sequence towards the exit, the ring glows
    const al = ease(t, T.alarm, T.alarm + 0.3) * (1 - ease(t, T.ch3End + 0.3, T.ch3End + 0.8));
    const pulse = 0.55 + 0.45 * Math.sin((t - T.alarm) * Math.PI * 2 * 1.6);
    domeMat.emissiveIntensity = 2.2 * al * pulse;
    beaconLight.intensity = 30 * al * pulse;
    beaconHalo.material.opacity = 0.75 * al * pulse;
    chevrons.forEach((ch, i) => {
      const on = ease(t, T.arrows + i * 0.16, T.arrows + i * 0.16 + 0.3, E.out);
      const wave = 0.6 + 0.4 * Math.max(0, Math.sin((t - T.arrows) * 6 - i * 0.9));
      ch.m.emissiveIntensity = on * wave * 1.4;
      ch.m.color.set(on > 0.5 ? 0xf6b7a6 : PAL.shade);
      ch.g.position.y = 0.15 + on * 0.03;
    });
    const sg = E.spring(seg(t, T.sign, T.sign + 0.8), 0.6, 10);
    sign.scale.setScalar(Math.max(0.0001, sg));
    sign.rotation.y = (1 - sg) * 2.2;
    ring.material.emissiveIntensity = 0.2 + 1.2 * ease(t, T.safe - 0.2, T.safe + 0.4) * (0.7 + 0.3 * Math.sin(t * 5));
    ring.scale.setScalar(0.6 + 0.4 * ease(t, T.sign, T.sign + 0.8, E.out));

    return P.ceilingWhite(c.pos.y);
  };
});

// Assembly point pictogram: four arrows pointing to a centre dot.
function drawAssembly(g, s, w, h) {
  g.fillStyle = "#0b1633";
  rr(g, 8, 8, w - 16, h - 16, 40);
  g.fill();
  g.fillStyle = "#ffffff";
  const c = w / 2;
  g.beginPath();
  g.arc(c, c, 26, 0, Math.PI * 2);
  g.fill();
  for (let i = 0; i < 4; i++) {
    g.save();
    g.translate(c, c);
    g.rotate((i * Math.PI) / 2 + Math.PI / 4);
    g.beginPath();
    g.moveTo(0, -48);
    g.lineTo(-24, -76);
    g.lineTo(-10, -76);
    g.lineTo(-10, -104);
    g.lineTo(10, -104);
    g.lineTo(10, -76);
    g.lineTo(24, -76);
    g.closePath();
    g.fill();
    g.restore();
  }
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
