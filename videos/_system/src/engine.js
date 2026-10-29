// Phaness shared 3D engine for the demo films.
// One world per film: a sky above a cloud ceiling (opening and closing, the egg of light),
// and the subject below it on soft clay islands. Every frame is a pure function of time.
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export { THREE, RoundedBoxGeometry };

// ---------------------------------------------------------------- math and easing
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export const seg = (t, a, b) => (b <= a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a)));
export const smooth = (k) => k * k * (3 - 2 * k);
export const E = {
  linear: (k) => k,
  io: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  io2: (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2),
  io4: (k) => (k < 0.5 ? 8 * k ** 4 : 1 - Math.pow(-2 * k + 2, 4) / 2),
  sine: (k) => -(Math.cos(Math.PI * k) - 1) / 2,
  in: (k) => k * k * k,
  in2: (k) => k * k,
  out: (k) => 1 - Math.pow(1 - k, 3),
  out4: (k) => 1 - Math.pow(1 - k, 4),
  expo: (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k)),
  // damped spring, ratio ~0.75 reads premium
  spring: (k, zeta = 0.72, w = 11) => {
    if (k <= 0) return 0;
    if (k >= 1) return 1;
    const wd = w * Math.sqrt(1 - zeta * zeta);
    const x = 1 - Math.exp(-zeta * w * k) * (Math.cos(wd * k) + ((zeta * w) / wd) * Math.sin(wd * k));
    return lerp(x, 1, smooth(seg(k, 0.82, 1)));
  },
};
export const ease = (t, a, b, fn = E.io) => fn(seg(t, a, b));
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- palette
export const PAL = {
  night: 0x0b1633,
  soft: 0x4a5878,
  slate: 0x7d8bab,
  shade: 0xb8c4dc,
  mist: 0xdce3f0,
  cloud: 0xf5f7fb,
  white: 0xffffff,
  verm: 0xe34234,
  vermDeep: 0xc8372a,
  peach: 0xf6b7a6,
  butter: 0xf2cf6b,
  glass: 0x1b2a52,
};
export const col = (hex) => new THREE.Color(hex);

// ---------------------------------------------------------------- materials
// Clay: soft diffuse, sheen for the velvety edge, a fresnel rim tinted vermilion.
const RIM = { color: { value: new THREE.Color(PAL.verm) } };
function addRim(material, strength) {
  const uStrength = { value: strength };
  material.userData.rim = uStrength;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uRimColor = RIM.color;
    shader.uniforms.uRimStrength = uStrength;
    shader.fragmentShader = shader.fragmentShader
      .replace("void main() {", "uniform vec3 uRimColor;\nuniform float uRimStrength;\nvoid main() {")
      .replace(
        "#include <opaque_fragment>",
        `#include <opaque_fragment>
        {
          vec3 vd = normalize(vViewPosition);
          float fr = pow(1.0 - clamp(dot(normalize(normal), vd), 0.0, 1.0), 3.2);
          gl_FragColor.rgb += uRimColor * fr * uRimStrength;
        }`,
      );
  };
  material.customProgramCacheKey = () => "phaness-rim";
  return material;
}

export function clay(color, o = {}) {
  const m = new THREE.MeshPhysicalMaterial({
    color: col(color),
    roughness: o.rough ?? 0.62,
    metalness: o.metal ?? 0,
    sheen: o.sheen ?? 0.35,
    sheenRoughness: 0.75,
    sheenColor: col(o.sheenColor ?? 0xffffff),
    clearcoat: o.coat ?? 0,
    clearcoatRoughness: o.coatRough ?? 0.35,
    emissive: col(o.emissive ?? 0x000000),
    emissiveIntensity: o.emissiveIntensity ?? 1,
    transparent: o.opacity !== undefined && o.opacity < 1,
    opacity: o.opacity ?? 1,
    envMapIntensity: o.env ?? 1,
    side: o.side ?? THREE.FrontSide,
  });
  if (o.map) m.map = o.map;
  if (o.emissiveMap) m.emissiveMap = o.emissiveMap;
  return addRim(m, o.rim ?? 0.22);
}
// Soft plastic: a touch of clearcoat, smoother.
export const plastic = (color, o = {}) => clay(color, { rough: 0.42, coat: 0.45, coatRough: 0.3, sheen: 0.15, ...o });
export const glow = (color, intensity = 2) =>
  new THREE.MeshBasicMaterial({ color: col(color).multiplyScalar(intensity), toneMapped: true });

// ---------------------------------------------------------------- geometry helpers
export const rbox = (w, h, d, r = Math.min(w, h, d) * 0.3, seg = 5) => new RoundedBoxGeometry(w, h, d, seg, r);
export const sphere = (r, s = 48) => new THREE.SphereGeometry(r, s, Math.round(s * 0.66));
export const capsule = (r, len, s = 24) => new THREE.CapsuleGeometry(r, len, 10, s);
export const cyl = (rt, rb, h, s = 48) => new THREE.CylinderGeometry(rt, rb, h, s);
export const torus = (R, r, s = 64, arc = Math.PI * 2) => new THREE.TorusGeometry(R, r, 20, s, arc);
export function tube(points, r = 0.08, closed = false, segments = 200) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), closed, "centripetal");
  return { curve, geo: new THREE.TubeGeometry(curve, segments, r, 16, closed) };
}
// Rounded disc / pebble (top flat, soft edge, rounded underside).
export function pebble(radius, height, edge = 0.5, bottom = 0.55) {
  const pts = [];
  pts.push(new THREE.Vector2(0, 0));
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius - edge + Math.sin(a) * edge, -edge + Math.cos(a) * edge));
  }
  for (let i = 1; i <= 20; i++) {
    const k = i / 20;
    const r = (radius) * Math.cos(k * Math.PI * 0.5) ** 0.7;
    const y = -edge - (height - edge) * Math.pow(k, 1.35);
    pts.push(new THREE.Vector2(Math.max(0.001, r * (1 - bottom * k * k) + bottom * 0 ), y));
  }
  pts.push(new THREE.Vector2(0, -height));
  return new THREE.LatheGeometry(pts, 96);
}
// Rounded rectangle shape (2D) for extrusions.
export function rrectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
export function slab(w, h, depth, r, bevel = 0.06) {
  const g = new THREE.ExtrudeGeometry(rrectShape(w - bevel * 2, h - bevel * 2, Math.max(0.01, r - bevel)), {
    depth: Math.max(0.001, depth - bevel * 2),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 6,
    curveSegments: 24,
  });
  g.translate(0, 0, -depth / 2 + bevel);
  g.computeVertexNormals();
  return g;
}
export function eggGeometry(w = 0.78, h = 1.0, k = 0.14) {
  const pts = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI;
    pts.push(new THREE.Vector2(Math.max(0.0001, Math.sin(a) * w * (1 + k * Math.cos(a))), -Math.cos(a) * h));
  }
  return new THREE.LatheGeometry(pts, 96);
}
export function mesh(geo, mat, o = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = o.cast ?? true;
  m.receiveShadow = o.receive ?? true;
  if (o.pos) m.position.set(...o.pos);
  if (o.rot) m.rotation.set(...o.rot);
  if (o.scale !== undefined) Array.isArray(o.scale) ? m.scale.set(...o.scale) : m.scale.setScalar(o.scale);
  if (o.parent) o.parent.add(m);
  return m;
}
export function group(parent, pos = [0, 0, 0], rot = [0, 0, 0]) {
  const g = new THREE.Group();
  g.position.set(...pos);
  g.rotation.set(...rot);
  if (parent) parent.add(g);
  return g;
}

// ---------------------------------------------------------------- canvas textures (displays, screens)
export function canvasTexture(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  let last = null;
  return {
    tex,
    ctx,
    canvas: c,
    // redraw only when the state key changes
    update(state) {
      const key = JSON.stringify(state);
      if (key === last) return;
      last = key;
      ctx.clearRect(0, 0, w, h);
      draw(ctx, state, w, h);
      tex.needsUpdate = true;
    },
  };
}
export const FONT = '"Geist", "Inter", sans-serif';

// ---------------------------------------------------------------- the stage
const SKY = [
  [0.0, "#8fa6d4"],
  [0.22, "#b4c4e4"],
  [0.4, "#dbe3f2"],
  [0.48, "#f7efec"],
  [0.5, "#fbe4dc"],
  [0.53, "#eef1f8"],
  [1.0, "#cdd7ea"],
];
function skyTexture() {
  const c = document.createElement("canvas");
  c.width = 8;
  c.height = 512;
  const g = c.getContext("2d");
  const grad = g.createLinearGradient(0, 0, 0, 512);
  for (const [k, v] of SKY) grad.addColorStop(k, v);
  g.fillStyle = grad;
  g.fillRect(0, 0, 8, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const FinishShader = {
  uniforms: {
    tDiffuse: { value: null },
    uFrame: { value: 0 },
    uGrain: { value: 0.022 },
    uVig: { value: 0.34 },
    uWhite: { value: 0 },
    uRes: { value: new THREE.Vector2(1920, 1080) },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uFrame, uGrain, uVig, uWhite; uniform vec2 uRes; varying vec2 vUv;
    float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
    float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
    float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a * vn(p); p *= 2.03; a *= 0.5; } return s; }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      vec2 q = vUv - 0.5;
      float v = smoothstep(0.35, 0.95, length(q * vec2(1.0, 0.82)) * 1.25);
      c.rgb = mix(c.rgb, c.rgb * vec3(0.84, 0.88, 0.97), v * uVig * 2.0);
      if (uWhite > 0.0) {
        float n = fbm(vUv * vec2(3.2, 1.8) + vec2(0.0, uWhite * 0.6));
        float thr = uWhite * 1.6 - 0.3;
        float m = smoothstep(n - 0.28, n + 0.28, thr);
        vec3 w = mix(vec3(0.972, 0.978, 0.99), vec3(0.93, 0.945, 0.975), vUv.y * 0.4 + n * 0.3);
        c.rgb = mix(c.rgb, w, m);
      }
      vec2 px = mod(floor(vUv * uRes) + vec2(mod(uFrame * 37.0, 251.0), mod(uFrame * 61.0, 241.0)), 1024.0);
      float g = fract(sin(dot(px, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
      c.rgb += g * uGrain;
      gl_FragColor = vec4(c.rgb, 1.0);
    }`,
};

export function createStage(canvas, o = {}) {
  const W = o.width ?? 1920, H = o.height ?? 1080;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = o.exposure ?? 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  const scene = new THREE.Scene();
  scene.background = skyTexture();
  scene.fog = new THREE.Fog(0xe9edf6, 55, 170);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  scene.environmentIntensity = o.env ?? 0.55;

  const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 600);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xa9b8d8, o.hemi ?? 1.0);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff1e6, o.key ?? 3.1);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 10;
  key.shadow.blurSamples = 18;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(PAL.verm, o.rim ?? 1.1);
  scene.add(rim, rim.target);
  const fill = new THREE.DirectionalLight(0xdfe7ff, 0.5);
  scene.add(fill, fill.target);
  const keyDir = new THREE.Vector3(-0.55, 1.0, 0.65).normalize();
  const rimDir = new THREE.Vector3(0.5, 0.45, -1.0).normalize();
  const fillDir = new THREE.Vector3(0.8, 0.3, 0.5).normalize();

  const target = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, target);
  composer.setPixelRatio(1);
  composer.setSize(W, H);
  composer.addPass(new RenderPass(scene, camera));

  // GTAO noise is built with Math.random: seed it so every render worker agrees.
  const realRandom = Math.random;
  Math.random = mulberry32(7);
  const gtao = new GTAOPass(scene, camera, W, H);
  Math.random = realRandom;
  gtao.output = GTAOPass.OUTPUT.Default;
  gtao.blendIntensity = o.ao ?? 1.0;
  gtao.updateGtaoMaterial({ radius: 0.55, distanceExponent: 1.6, thickness: 1.4, scale: 1.0, samples: 16, distanceFallOff: 1.0 });
  gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
  const baseHide = gtao._overrideVisibility.bind(gtao);
  gtao._overrideVisibility = function () {
    baseHide();
    const cache = this._visibilityCache;
    this.scene.traverse((obj) => {
      if (obj.userData.noAO && obj.visible) {
        obj.visible = false;
        cache.push(obj);
      }
    });
  };
  composer.addPass(gtao);
  const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: 0.0, maxblur: 0.008 });
  composer.addPass(bokeh);
  composer.addPass(new OutputPass());
  const finish = new ShaderPass(FinishShader);
  composer.addPass(finish);

  const focusPt = new THREE.Vector3();
  const stage = {
    THREE, renderer, scene, camera, composer, gtao, bokeh, finish, key, rim, hemi, fill, keyDir,
    // place the camera; dof = aperture (0 = sharp), focus defaults to the target distance
    setCamera(pos, look, fov = 30, dof = 0, focus = null, roll = 0) {
      camera.position.copy(pos);
      camera.up.set(Math.sin(roll), Math.cos(roll), 0);
      camera.lookAt(look);
      camera.fov = fov;
      camera.updateProjectionMatrix();
      const f = focus ?? pos.distanceTo(look);
      bokeh.uniforms.focus.value = f;
      bokeh.uniforms.aperture.value = dof * 0.0001;
      bokeh.enabled = dof > 0.001;
    },
    // keep the soft shadow frustum on what the camera looks at
    shadowFocus(center, size = 14) {
      focusPt.copy(center);
      key.target.position.copy(center);
      key.position.copy(center).addScaledVector(keyDir, 60);
      const sc = key.shadow.camera;
      sc.left = -size; sc.right = size; sc.top = size; sc.bottom = -size;
      sc.near = 1; sc.far = 140;
      sc.updateProjectionMatrix();
      rim.target.position.copy(center);
      rim.position.copy(center).addScaledVector(rimDir, 50);
      fill.target.position.copy(center);
      fill.position.copy(center).addScaledVector(fillDir, 50);
    },
    render(t, white = 0) {
      finish.uniforms.uFrame.value = Math.round(t * 30);
      finish.uniforms.uWhite.value = clamp(white);
      composer.render();
    },
    project(v) {
      const p = v.clone().project(camera);
      return { x: (p.x * 0.5 + 0.5) * W, y: (-p.y * 0.5 + 0.5) * H, z: p.z, ok: p.z < 1 && p.z > -1 };
    },
  };
  stage.shadowFocus(new THREE.Vector3(0, 0, 0));
  return stage;
}

// ---------------------------------------------------------------- camera rig
// Keys: { t, tgt:[x,y,z], az (deg), el (deg), dist, fov, dof, focus?, roll?, e (ease into this key) }.
// Spherical interpolation gives orbits and dives instead of straight cuts.
export function rig(keys) {
  const tgt = new THREE.Vector3(), pos = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3();
  return (t) => {
    let i = 0;
    while (i < keys.length - 2 && t >= keys[i + 1].t) i++;
    const k0 = keys[i], k1 = keys[Math.min(i + 1, keys.length - 1)];
    const fn = typeof k1.e === "function" ? k1.e : E[k1.e ?? "io"];
    const k = k1 === k0 ? 1 : fn(seg(t, k0.t, k1.t));
    a.set(...k0.tgt); b.set(...k1.tgt);
    tgt.lerpVectors(a, b, k);
    const az = THREE.MathUtils.degToRad(lerp(k0.az, k1.az, k));
    const el = THREE.MathUtils.degToRad(lerp(k0.el, k1.el, k));
    const dist = Math.exp(lerp(Math.log(k0.dist), Math.log(k1.dist), k));
    pos.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(dist).add(tgt);
    const f0 = k0.focus ?? k0.dist, f1 = k1.focus ?? k1.dist;
    return {
      pos, tgt, fov: lerp(k0.fov ?? 30, k1.fov ?? 30, k), dof: lerp(k0.dof ?? 0, k1.dof ?? 0, k),
      focus: lerp(f0, f1, k), roll: THREE.MathUtils.degToRad(lerp(k0.roll ?? 0, k1.roll ?? 0, k)),
    };
  };
}

// ---------------------------------------------------------------- clouds
// A field of clay puffs. Each cluster is a few overlapping spheres; the field drifts slowly.
const puffGeo = new THREE.IcosahedronGeometry(1, 3);
export function cloudField(parent, o) {
  const rnd = mulberry32(o.seed ?? 1);
  const items = [];
  const clusters = o.clusters ?? 60;
  for (let c = 0; c < clusters; c++) {
    let x, z, tries = 0;
    do {
      const a = rnd() * Math.PI * 2, r = Math.sqrt(lerp((o.inner ?? 0) ** 2 / (o.radius ** 2), 1, rnd())) * o.radius;
      x = (o.center?.[0] ?? 0) + Math.cos(a) * r * (o.stretch ?? 1);
      z = (o.center?.[2] ?? 0) + Math.sin(a) * r;
      tries++;
    } while (o.avoid && o.avoid(x, z) && tries < 30);
    if (o.avoid && o.avoid(x, z)) continue;
    const big = lerp(o.min ?? 1.2, o.max ?? 3.2, Math.pow(rnd(), 1.6));
    const n = 3 + Math.floor(rnd() * 4);
    const by = (o.y ?? 0) + (rnd() - 0.5) * (o.jitterY ?? 0.6);
    for (let i = 0; i < n; i++) {
      const s = big * lerp(0.45, 1, rnd()) * (i === 0 ? 1 : 0.85);
      const ang = rnd() * Math.PI * 2, d = big * lerp(0.4, 1.1, rnd()) * (i === 0 ? 0 : 1);
      items.push({
        x: x + Math.cos(ang) * d, y: by + s * (o.lift ?? 0.15) + (i === 0 ? 0 : (rnd() - 0.35) * big * 0.35),
        z: z + Math.sin(ang) * d * 0.8, s, sy: s * (o.squash ?? 0.78), ph: rnd() * 6.28,
      });
    }
  }
  const mat = clay(o.color ?? 0xffffff, {
    rough: 0.92, sheen: 0.8, sheenColor: 0xffffff, rim: o.rim ?? 0.02, emissive: o.emissive ?? 0xe9eef8, emissiveIntensity: o.glow ?? 0.12, env: 0.6,
  });
  const inst = new THREE.InstancedMesh(puffGeo, mat, items.length);
  inst.castShadow = o.cast ?? false;
  inst.receiveShadow = o.receive ?? true;
  inst.frustumCulled = false;
  parent.add(inst);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3();
  const field = {
    mesh: inst, items, mat,
    update(t, extra) {
      const drift = (o.drift ?? 0.12) * t;
      items.forEach((it, i) => {
        let x = it.x + drift, y = it.y + Math.sin(t * 0.35 + it.ph) * (o.bob ?? 0.05), z = it.z;
        let sc = 1;
        if (extra) ({ x, y, z, sc } = extra(it, x, y, z, i));
        p.set(x, y, z);
        s.set(it.s * sc, it.sy * sc, it.s * sc);
        m4.compose(p, q, s);
        inst.setMatrixAt(i, m4);
      });
      inst.instanceMatrix.needsUpdate = true;
      inst.computeBoundingSphere();
    },
  };
  field.update(0);
  return field;
}

// ---------------------------------------------------------------- flow particles along a curve
const dotGeo = new THREE.SphereGeometry(1, 16, 12);
export function flow(parent, curve, o = {}) {
  const n = o.count ?? 40;
  const mat = clay(0xffffff, { rough: 0.4, sheen: 0.2, rim: 0.1, emissive: o.emissive ?? 0x000000, emissiveIntensity: o.glow ?? 0 });
  const inst = new THREE.InstancedMesh(dotGeo, mat, n);
  inst.castShadow = o.cast ?? false;
  inst.receiveShadow = false;
  inst.frustumCulled = false;
  parent.add(inst);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color();
  const api = {
    mesh: inst,
    // t: time, speed: loops per second, reveal: 0..1 of the path that shows dots, amount: 0..1 size
    update(t, speed = 0.15, reveal = 1, amount = 1) {
      for (let i = 0; i < n; i++) {
        let u = (i / n + t * speed) % 1;
        if (u < 0) u += 1;
        curve.getPointAt(u, p);
        if (o.jitter) {
          const r = mulberry32(i * 97 + 3);
          p.x += (r() - 0.5) * o.jitter; p.y += (r() - 0.5) * o.jitter; p.z += (r() - 0.5) * o.jitter;
        }
        const edge = o.closed ? 1 : smooth(seg(u, 0, 0.06)) * smooth(seg(1 - u, 0, 0.06));
        const vis = u <= reveal ? 1 : 0;
        const r = (o.size ?? 0.07) * amount * edge * vis * (o.sizeFn ? o.sizeFn(u) : 1);
        s.setScalar(Math.max(r, 0.00001));
        m4.compose(p, q, s);
        inst.setMatrixAt(i, m4);
        c.set(o.colorFn ? o.colorFn(u) : (o.color ?? PAL.verm));
        inst.setColorAt(i, c);
      }
      inst.instanceMatrix.needsUpdate = true;
      if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    },
  };
  api.update(0, 0, 0, 0);
  return api;
}
// Grow a tube along its length (0..1).
export function grow(meshObj, k) {
  const g = meshObj.geometry;
  const total = g.index.count;
  const per = 16 * 6;
  g.setDrawRange(0, Math.floor((total / per) * clamp(k)) * per);
  meshObj.visible = k > 0.001;
}

// ---------------------------------------------------------------- soft glow sprite (never in AO)
export function halo(parent, color, size, opacity = 0.5) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  const cc = col(color);
  const rgb = `${Math.round(cc.r * 255)},${Math.round(cc.g * 255)},${Math.round(cc.b * 255)}`;
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.35, `rgba(${rgb},0.45)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity, depthWrite: false, fog: false }));
  sp.scale.setScalar(size);
  sp.userData.noAO = true;
  parent.add(sp);
  return sp;
}

// ---------------------------------------------------------------- the egg of light (closing)
export function buildEgg(parent) {
  const g = group(parent);
  const uGlow = { value: 0 };
  const mat = new THREE.MeshPhysicalMaterial({
    color: col(0xfff6f2), roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.18,
    iridescence: 0.25, iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 520],
    sheen: 0.6, sheenColor: col(0xffe0d8), sheenRoughness: 0.5, envMapIntensity: 1.2,
  });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uGlow = uGlow;
    sh.vertexShader = sh.vertexShader
      .replace("void main() {", "varying vec3 vObj;\nvoid main() {\nvObj = position;");
    sh.fragmentShader = sh.fragmentShader
      .replace("void main() {", "uniform float uGlow;\nvarying vec3 vObj;\nvoid main() {")
      .replace(
        "#include <opaque_fragment>",
        `#include <opaque_fragment>
        {
          vec3 vd = normalize(vViewPosition);
          float facing = clamp(dot(normalize(normal), vd), 0.0, 1.0);
          float core = exp(-pow(length(vObj - vec3(0.0, -0.2, 0.0)) * 1.05, 2.0));
          float inner = pow(facing, 1.1) * core;
          vec3 hot = mix(vec3(0.89, 0.26, 0.2), vec3(1.0, 0.62, 0.5), smoothstep(0.12, 0.55, inner));
          hot = mix(hot, vec3(1.0, 0.96, 0.92), smoothstep(0.5, 0.92, inner));
          gl_FragColor.rgb = mix(gl_FragColor.rgb, hot * 1.3, clamp(inner * uGlow * 1.25, 0.0, 0.94));
          float edge = pow(1.0 - facing, 2.5);
          gl_FragColor.rgb += vec3(1.0, 0.55, 0.45) * edge * 0.35 * uGlow + hot * inner * uGlow * 0.3;
        }`,
      );
  };
  mat.customProgramCacheKey = () => "phaness-egg";
  const egg = mesh(eggGeometry(), mat, { parent: g, receive: false });
  egg.castShadow = false;
  const light = new THREE.PointLight(0xff8a6a, 0, 9, 2);
  light.position.set(0, -0.9, 0.6);
  g.add(light);
  const h1 = halo(g, 0xf7b3a2, 7, 0.0);
  h1.position.set(0, -0.2, -1.2);
  return {
    group: g, egg, mat, halo: h1, light,
    set(glow) {
      uGlow.value = glow;
      light.intensity = 10 * glow;
      h1.material.opacity = 0.55 * glow;
    },
  };
}

// ---------------------------------------------------------------- the sky above the ceiling (opening + closing)
// Ceiling of clouds at CEIL_Y; the subject lives below. A valley in the clouds leads to the egg:
// in the opening a vermilion light glows under the valley, in the closing the egg rises out of it.
export const CEIL_Y = 22;
export const EGG_POS = [0, CEIL_Y + 3.2, -18];
const valley = (x, z) => z > EGG_POS[2] + 2.2 && Math.abs(x - EGG_POS[0]) < 2.6 + (z - EGG_POS[2]) * 0.42;
export function buildSky(stage, o = {}) {
  const scene = stage.scene;
  const root = group(scene);
  const ceil = cloudField(root, {
    seed: 11, clusters: 420, radius: 70, y: CEIL_Y, jitterY: 2.2, min: 2.2, max: 5.5, squash: 0.62, drift: 0.25,
    center: o.center ?? [0, 0, -10], glow: 0.16, avoid: (x, z) => valley(x, z) && z > EGG_POS[2] + 9,
  });
  const top = cloudField(root, {
    seed: 12, clusters: 260, radius: 90, y: CEIL_Y + 1.6, jitterY: 0.8, min: 2.5, max: 6.5, squash: 0.55, drift: 0.3,
    center: o.center ?? [0, 0, -10], glow: 0.18,
    avoid: (x, z) => Math.hypot(x - EGG_POS[0], z - EGG_POS[2]) < 3.4 || valley(x, z),
  });
  const eggHolder = group(root, EGG_POS);
  const egg = buildEgg(eggHolder);
  egg.group.scale.setScalar(1.5);
  // the light under the clouds (opening)
  const dawn = new THREE.PointLight(0xff7a5c, 0, 30, 1.6);
  dawn.position.set(EGG_POS[0], CEIL_Y + 1.2, EGG_POS[2] + 1);
  root.add(dawn);
  const dawnHalo = halo(root, 0xf7a593, 11, 0);
  dawnHalo.position.set(EGG_POS[0], CEIL_Y + 2.4, EGG_POS[2] - 1);
  return {
    ceil, top, egg, eggHolder,
    // rise 0..1 lifts the egg out of the clouds; glow 0..1 lights it from inside
    setEgg(rise, glow) {
      eggHolder.position.y = EGG_POS[1] - 3.6 + rise * 3.6;
      egg.set(glow);
    },
    setDawn(k) {
      dawn.intensity = 45 * k;
      dawnHalo.material.opacity = 0.0 * k;
    },
    update(t, camY = 0) {
      const near = camY > CEIL_Y - 14;
      root.visible = near;
      if (near) {
        ceil.update(t);
        top.update(t);
        egg.group.rotation.y = t * 0.25;
      }
    },
  };
}
// Shared camera keys: the opening (over the valley, then the dive) and the closing (on the egg).
export function openingKeys(tDive) {
  return [
    { t: 0, tgt: [0, CEIL_Y + 2.6, EGG_POS[2]], az: -4, el: 9, dist: 31, fov: 30, dof: 1.5 },
    { t: tDive, tgt: [0, CEIL_Y + 1.6, EGG_POS[2] + 2], az: 3, el: 15, dist: 24, fov: 30, dof: 1.5, e: "sine" },
  ];
}
export function closingKeys(tEgg, tEnd) {
  return [
    { t: tEgg, tgt: [EGG_POS[0], EGG_POS[1] - 1.0, EGG_POS[2]], az: -6, el: 11, dist: 17, fov: 30, dof: 2, e: "io4" },
    { t: tEnd, tgt: [EGG_POS[0], EGG_POS[1] - 1.1, EGG_POS[2]], az: 4, el: 10, dist: 15.6, fov: 30, dof: 2, e: "sine" },
  ];
}
// Whiteness while the camera crosses the ceiling band.
export function ceilingWhite(camY) {
  const a = CEIL_Y - 2.5, b = CEIL_Y + 3.5;
  if (camY < a - 1.5 || camY > b + 1.5) return 0;
  const mid = (a + b) / 2, half = (b - a) / 2 + 1.5;
  return smooth(clamp(1 - Math.abs(camY - mid) / half)) * 1.05;
}

// ---------------------------------------------------------------- a clay figurine (worker, technician)
export function figure(parent, o = {}) {
  const g = group(parent, o.pos ?? [0, 0, 0]);
  const body = clay(o.body ?? PAL.soft, { rough: 0.6 });
  const skin = clay(o.skin ?? 0xf1d6c8, { rough: 0.55, rim: 0.3 });
  const dark = clay(o.legs ?? PAL.night, { rough: 0.6 });
  const hip = group(g, [0, 0.92, 0]);
  const torso = mesh(capsule(0.27, 0.42), body, { parent: hip, pos: [0, 0.42, 0] });
  const headG = group(hip, [0, 1.06, 0]);
  const head = mesh(sphere(0.23), skin, { parent: headG });
  const legs = [-1, 1].map((sx) => {
    const lg = group(hip, [sx * 0.13, 0.02, 0]);
    mesh(capsule(0.11, 0.62), dark, { parent: lg, pos: [0, -0.42, 0] });
    const foot = mesh(rbox(0.22, 0.13, 0.34, 0.06), clay(o.shoes ?? PAL.night, { rough: 0.5 }), { parent: lg, pos: [0, -0.86, 0.05] });
    return { g: lg, foot };
  });
  const arms = [-1, 1].map((sx) => {
    const ag = group(hip, [sx * 0.36, 0.66, 0]);
    mesh(capsule(0.085, 0.5), body, { parent: ag, pos: [0, -0.3, 0] });
    const hand = mesh(sphere(0.095, 24), skin, { parent: ag, pos: [0, -0.62, 0] });
    ag.rotation.z = sx * 0.12;
    return { g: ag, hand, sx };
  });
  return {
    group: g, hip, torso, head: headG, legs, arms, mats: { body, skin, dark },
    // phase in cycles; amount 0..1
    walk(phase, amount = 1) {
      const s = Math.sin(phase * Math.PI * 2);
      legs[0].g.rotation.x = s * 0.45 * amount;
      legs[1].g.rotation.x = -s * 0.45 * amount;
      arms[0].g.rotation.x = -s * 0.4 * amount;
      arms[1].g.rotation.x = s * 0.4 * amount;
      hip.position.y = 0.92 + Math.abs(Math.cos(phase * Math.PI * 2)) * 0.04 * amount;
    },
  };
}
