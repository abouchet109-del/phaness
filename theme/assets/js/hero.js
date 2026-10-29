// Phaness hero: a glowing organic egg floating in soft clouds.
// Single full-screen fragment shader (WebGL1, no library).
// Usage: const hero = mountHero(canvas, { onStats }); hero.destroy();

const VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R;uniform float T;uniform vec2 M;uniform vec3 E;uniform vec4 C;uniform sampler2D N;
const vec3 BG=vec3(.961,.969,.984),NIGHT=vec3(.043,.086,.2),SOFT=vec3(.29,.345,.47),
MIST=vec3(.863,.89,.941),SHADE=vec3(.72,.77,.88),VERM=vec3(.89,.259,.204),L=vec3(-.5,.72,-.48);
const mat2 RM=mat2(1.6,1.2,-1.2,1.6);
mat2 rA,rB;float W;
float ns(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);return texture2D(N,(i+f+.5)/256.).r;}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*ns(p);p=RM*p;a*=.5;}return s;}
float fb3(vec2 p){float s=0.,a=.5;for(int i=0;i<3;i++){s+=a*ns(p);p=RM*p;a*=.5;}return s/.875;}
float egg(vec3 p){
  p.xy=rA*p.xy;p.yz=rB*p.yz;
  float w=sin(p.x*2.1+T*.7)*sin(p.y*1.7-T*.5)*sin(p.z*2.3+T*.6)*.022;
  vec3 s=p;s.xz*=1.+.13*p.y;
  return (length(s*vec3(1.,.78,1.))-W)*.8+w;
}
vec3 nrm(vec3 p){const vec2 e=vec2(.002,-.002);
  return normalize(e.xyy*egg(p+e.xyy)+e.yyx*egg(p+e.yyx)+e.yxy*egg(p+e.yxy)+e.xxx*egg(p+e.xxx));}
// sea of clouds with a billowy horizon at height y0: x = coverage, y = lighting, z = depth
vec3 sea(vec2 p,float y,float y0){
  float a=fbm(p),b=fbm(p+vec2(-.05,.1));
  float d=(y0-y)*1.1+(a-.5)*1.7;
  return vec3(smoothstep(0.,.3,d),clamp(.72+(a-b)*9.-d*.3,0.,1.),d);
}
void main(){
  vec2 fc=gl_FragCoord.xy,uv=fc/R;
  float t=T,pu=.64+.26*sin(t*.8)+.06*sin(t*2.1);
  float px=1./E.z;
  vec2 q=(fc-E.xy*R)*px;
  float k=mix(.12,1.,smoothstep(C.z,C.w,dot(uv,C.xy)));
  vec3 core=vec3(M.x*.14,-.22+M.y*.1,0.);

  // sky
  vec3 col=mix(BG,vec3(1.),.55*smoothstep(1.2,-.2,uv.y-uv.x*.3));
  float hal=exp(-max(length(q/vec2(1.,1.3))-1.,0.)*2.)*pu;
  col=mix(col,vec3(1.,.8,.75),hal*.3*k);

  // domain warp shared by all cloud layers
  vec2 c=q*.5;
  vec2 w=vec2(fb3(c*.8+vec2(0.,t*.012)),fb3(c*.8+vec2(4.3,1.7)-t*.01))-.5;

  float warm=exp(-length((q-core.xy)*vec2(.7,1.))*1.)*pu;

  // far sea, hazy, behind the egg
  vec3 s=sea(vec2(c.x*.6+t*.006,c.y)*2.+w*.5+M*.03,q.y,-.2);
  vec3 cc=mix(mix(MIST,SHADE,.4),vec3(1.),s.y);
  cc=mix(cc,BG,.35+.4*smoothstep(0.,1.5,s.z));
  cc=mix(cc,vec3(1.,.84,.78),warm*.35);
  col=mix(col,cc,s.x*k);

  // egg
  vec2 qe=q-vec2(M.x*.07,sin(t*.55)*.05+M.y*.05);
  float ra=sin(t*.4)*.06-M.x*.12,rb=.1+M.y*.14;
  rA=mat2(cos(ra),sin(ra),-sin(ra),cos(ra));rB=mat2(cos(rb),sin(rb),-sin(rb),cos(rb));
  W=1.+.012*pu;
  vec3 ro=vec3(0.,0.,-5.),rd=normalize(vec3(qe,5.));
  float b=dot(ro,rd),h=b*b-dot(ro,ro)+2.4;
  if(h>0.){
    h=sqrt(h);
    float tt=-b-h,md=1e3,tm=tt;
    for(int i=0;i<40;i++){
      float d=egg(ro+rd*tt);
      if(d<md){md=d;tm=tt;}
      if(d<.0005||tt>-b+h)break;
      tt+=d;
    }
    float al=1.-smoothstep(0.,2.5*px,md);
    if(al>0.){
      vec3 p=ro+rd*tm,n=nrm(p);
      float wr=clamp(dot(n,L)*.5+.5,0.,1.),fr=pow(1.-clamp(-dot(n,rd),0.,1.),2.5);
      vec3 ec=mix(mix(NIGHT,SOFT,.25),MIST,smoothstep(.15,.72,wr));
      ec=mix(ec,vec3(1.),smoothstep(.6,.98,wr));
      ec+=vec3(.8,.86,1.)*.14*clamp(-n.y,0.,1.)*(1.-wr);
      vec3 dc=core-ro;float dr=length(dc-rd*dot(dc,rd));
      vec3 dp=p-core-vec3(0.,-.4,-.3);
      float g=pu*(.62*exp(-dot(dp,dp)*1.)+.3*exp(-dr*dr*4.));
      vec3 gc=mix(VERM,vec3(1.,.56,.44),smoothstep(.35,.75,g));
      gc=mix(gc,vec3(1.,.94,.9),smoothstep(.7,1.,g));
      ec=mix(ec,gc,smoothstep(0.,.55,g)*(1.-fr*.9)*(.45+.55*wr));
      ec+=VERM*.22*pu*(1.-wr)*fr*clamp(.5-n.y,0.,1.);
      ec+=.22*pow(clamp(dot(reflect(rd,n),L),0.,1.),10.);
      ec=mix(ec,vec3(.95,.97,1.),fr*.35);
      col=mix(col,ec,al);
    }
  }

  // near sea, the egg sinks into it
  s=sea(vec2(c.x*.55+t*.012,c.y)*2.4+w*.6+M*.08,q.y,-.95);
  cc=mix(SHADE,vec3(1.),s.y);
  cc=mix(cc,mix(MIST,BG,.6),smoothstep(.5,2.5,s.z));
  cc=mix(cc,vec3(1.,.74,.66),warm*clamp(1.2-s.z,0.,1.)*.75);
  col=mix(col,cc,s.x*k);

  // settle into page background at the bottom, dither
  col=mix(col,BG,smoothstep(.12,0.,uv.y)*.85);
  col+=(texture2D(N,fc/256.).r-.5)/255.;
  gl_FragColor=vec4(col,1.);
}`;

// CSS fallback that imitates the render (no WebGL / context lost)
function fallbackBg(side) {
  // egg center and radii in % of the box
  const [x, y, rx, ry] = side ? [69, 50, 13, 26] : [50, 29, 24, 14];
  const e = (w, h, cx, cy, stops) => `radial-gradient(ellipse ${w}% ${h}% at ${cx}% ${cy}%,${stops})`;
  return [
    e(side ? 60 : 95, side ? 20 : 11, x + (side ? 3 : 0), y + ry * 0.95, '#fff 0%,rgba(255,255,255,.85) 45%,rgba(255,255,255,0) 100%'),
    e(rx * 0.4, ry * 0.3, x - rx * 0.35, y - ry * 0.45, 'rgba(255,255,255,.95),rgba(255,255,255,0)'),
    e(rx * 0.7, ry * 0.5, x, y + ry * 0.2, 'rgba(255,228,220,.95) 0%,rgba(227,66,52,.5) 45%,rgba(227,66,52,0) 100%'),
    e(rx * 0.6, ry * 0.7, x + rx * 0.4, y + ry * 0.2, 'rgba(74,88,120,.3),rgba(74,88,120,0)'),
    e(rx, ry, x, y, '#f7f8fc 0%,#e6eaf3 55%,#bcc5da 84%,rgba(245,247,251,0) 100%'),
    e(rx * 2.4, ry * 1.8, x, y, 'rgba(227,66,52,.07),rgba(227,66,52,0) 70%'),
    '#F5F7FB',
  ].join(',');
}

function noiseData() {
  const d = new Uint8Array(65536);
  let s = 0x9e3779b9;
  for (let i = 0; i < d.length; i++) {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    d[i] = s & 255;
  }
  return d;
}

/**
 * Mounts the hero shader on a canvas.
 * options: dpr (max pixel ratio, 1.5), quality (start resolution scale, 1),
 * minQuality (0.5), layout ('auto' | 'side' | 'top'), time (start, s), staticFrame (bool),
 * forceFallback (bool), onStats ({ fps, quality, width, height }) => void.
 */
export function mountHero(canvas, options = {}) {
  const o = Object.assign({ dpr: 1.5, quality: 1, minQuality: 0.5, layout: 'auto' }, options);
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ptr = [0, 0], tgt = [0, 0];
  let gl = null, U = {}, raf = 0, compileRaf = 0, ready = false, last = 0, time = o.time || 0, q = o.quality;
  let frames = 0, acc = 0, warm = 0, prev = null, locked = false, onScreen = true, side = true, egg = [0.69, 0.5, 1], calm = [1, 0, 0.1, 0.55];

  const still = () => o.staticFrame || mq.matches;

  function init() {
    ready = false;
    if (o.forceFallback) return false;
    const attrs = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false };
    gl = canvas.getContext('webgl', attrs) || canvas.getContext('experimental-webgl', attrs);
    if (!gl) return false;
    const context = gl;
    const parallel = gl.getExtension('KHR_parallel_shader_compile');
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      return s;
    };
    const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return false;
    const p = gl.createProgram();
    gl.attachShader(p, vs); gl.attachShader(p, fs);
    gl.bindAttribLocation(p, 0, 'a');
    gl.linkProgram(p);
    const finish = () => {
      compileRaf = 0;
      if (gl !== context || gl.isContextLost()) return;
      // Asking for compile/link status too early blocks the main thread. Keep
      // the CSS visual while the driver compiles the shader in the background.
      if (parallel && !gl.getProgramParameter(p, parallel.COMPLETION_STATUS_KHR)) {
        compileRaf = requestAnimationFrame(finish);
        return;
      }
      const linked = gl.getProgramParameter(p, gl.LINK_STATUS);
      gl.deleteShader(vs); gl.deleteShader(fs);
      if (!linked) {
        gl.deleteProgram(p);
        gl = null;
        resize();
        return;
      }
      gl.useProgram(p);
      for (const n of ['R', 'T', 'M', 'E', 'C', 'N']) U[n] = gl.getUniformLocation(p, n);

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 256, 256, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, noiseData());
      for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
        [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
      gl.uniform1i(U.N, 0);
      ready = true;
      resize();
      canvas.style.background = '';
      update();
    };
    finish();
    return true;
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    const cw = Math.max(1, r.width), ch = Math.max(1, r.height);
    side = o.layout === 'side' || (o.layout === 'auto' && cw >= 768 && cw > ch);
    if (!gl || !ready) { canvas.style.background = fallbackBg(side); return; }
    const s = Math.min(window.devicePixelRatio || 1, o.dpr) * q;
    const w = Math.max(1, Math.round(cw * s)), h = Math.max(1, Math.round(ch * s));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    // egg position (0..1, y up) and scale in render px per unit
    egg = side ? [0.69, 0.5, Math.min(h * 0.205, w * 0.13)] : [0.5, 0.71, Math.min(w * 0.24, h * 0.13)];
    calm = side ? [1, 0, 0.22, 0.62] : [0, 1, 0.3, 0.6];
    gl.viewport(0, 0, w, h);
    if (!raf) draw();
  }

  function draw() {
    if (!gl || !ready || gl.isContextLost()) return;
    gl.uniform2f(U.R, canvas.width, canvas.height);
    gl.uniform1f(U.T, still() ? (o.time || 4.2) : time);
    gl.uniform2f(U.M, ptr[0], ptr[1]);
    gl.uniform3f(U.E, egg[0], egg[1], egg[2]);
    gl.uniform4f(U.C, calm[0], calm[1], calm[2], calm[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    time += dt;
    const e = Math.min(1, dt * 2.2);
    ptr[0] += (tgt[0] - ptr[0]) * e;
    ptr[1] += (tgt[1] - ptr[1]) * e;
    draw();
    // adaptive resolution: step down while frames are slow; if a step brings
    // no gain (frame rate capped elsewhere, e.g. power saving), undo it and stop
    if (++warm > 30) {
      acc += dt;
      if (++frames === 60) {
        const fps = 60 / acc;
        if (prev && fps < prev[0] * 1.12) { q = prev[1]; prev = null; locked = true; resize(); }
        else if (!locked && fps < 48 && q > o.minQuality) { prev = [fps, q]; q = Math.max(o.minQuality, q * 0.85); resize(); }
        else prev = null;
        if (o.onStats) o.onStats({ fps, quality: q, width: canvas.width, height: canvas.height });
        frames = 0; acc = 0;
      }
    }
  }

  function update() {
    const run = gl && ready && onScreen && !document.hidden && !still();
    if (run && !raf) { last = performance.now(); warm = frames = 0; acc = 0; raf = requestAnimationFrame(frame); }
    if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
    if (!run) draw();
  }

  const onMove = (e) => {
    tgt[0] = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
    tgt[1] = Math.max(-1, Math.min(1, 1 - (e.clientY / window.innerHeight) * 2));
  };
  const onOut = (e) => { if (!e.relatedTarget) tgt[0] = tgt[1] = 0; };
  const onLost = (e) => { e.preventDefault(); cancelAnimationFrame(raf); cancelAnimationFrame(compileRaf); raf = compileRaf = 0; ready = false; gl = null; resize(); };
  const onRestored = () => { if (!init()) gl = null; resize(); update(); };

  const io = window.IntersectionObserver ? new IntersectionObserver((en) => { onScreen = en[0].isIntersecting; update(); }) : null;
  const ro = window.ResizeObserver ? new ResizeObserver(resize) : null;

  if (!init()) gl = null;
  resize();
  if (io) io.observe(canvas);
  if (ro) ro.observe(canvas); else window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerout', onOut);
  document.addEventListener('visibilitychange', update);
  mq.addEventListener && mq.addEventListener('change', update);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);
  update();

  return {
    get webgl() { return !!gl; },
    destroy() {
      cancelAnimationFrame(raf); raf = 0;
      cancelAnimationFrame(compileRaf); compileRaf = 0; ready = false;
      if (io) io.disconnect(); if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('visibilitychange', update);
      mq.removeEventListener && mq.removeEventListener('change', update);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      gl = null;
    },
  };
}
