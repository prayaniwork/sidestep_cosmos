window.SKIN = {
  name:'cosmos',
  fonts:['italic 400 36px "Newsreader"', '400 16px "Geist"'],
  ideaColors:['#F1D8A6', '#D3C4F1', '#B4C0F2', '#BBDCE0', '#F3C9B8', '#E6E1FF', '#C9E4CF'],
  worldWord:'galaxy', placeLabel:'Add to my galaxy', revealEyebrow:'Your new idea', artWord:'star picture',
  colorUnlock:['New star colours', 'Rose, pearl and jade stars'],
  worldLabel:'Your galaxy of ideas. Drag to look around. Tap a star to see its idea.',
  logo:'<svg viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="3.6" fill="#F1D8A6"/><ellipse cx="15" cy="15" rx="13" ry="5" fill="none" stroke="#B4C0F2" stroke-opacity=".7" stroke-width="1.2" transform="rotate(-24 15 15)"/><circle cx="26" cy="9" r="1.4" fill="#EDECF7"/></svg>',
  worldHint:'Drag to look around · tap a star to see its idea',
  worldEmpty:'Your galaxy is empty for now. Your first idea will be its first star.',
  introTitle:'Grow a galaxy of your own ideas.',
  introGrow:'Each idea becomes a star in your galaxy, with its own picture.',
  examples:['Waiting Room Radio', 'People waiting a long time to see a doctor', 'People vote on the next song while they wait. They can see the next song but not the rest, so they stay curious.'],
  doneTitle:i => `A new star is born: ${i.name.replace(/[<>&]/g, '')}.`
};

window.World = (() => {
  const T = window.THREE;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DRILL = {far:'#F1D8A6', second:'#D3C4F1', bridge:'#B4C0F2', notes:'#BBDCE0'};
  let R, scene, camera, world, dust, dustGeo, halo, dot, labelsEl, onPick, canvasEl;
  const stars = new Map(); let lineGroup;
  const tweens = [];
  const cam = {p:V(0, 7, 14), l:V(0, 0, 0), tp:V(0, 7, 14), tl:V(0, 0, 0)};
  let view = 'world', yaw = 0, pitch = 0, tyaw = 0, tpitch = 0, zoom = 1, focusId = null, pending = null, shake = 0, px = 0, py = 0;
  const ray = new T.Raycaster(); const tmp = V(0, 0, 0);
  const MAXDUST = 14000;

  const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const out = k => 1 - Math.pow(1 - k, 3);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function tween(dur, fn){ return new Promise(res => tweens.push({t:0, dur:reduce ? dur * .5 : dur, fn, res})); }
  function slot(i){ const a = i * 2.39996 + .8, r = 1.6 + Math.sqrt(i) * .95; return V(Math.cos(a) * r, Math.sin(i * 1.7) * .35, Math.sin(a) * r); }
  const spread = () => 1.6 + Math.sqrt(Math.max(stars.size, 1)) * .95;

  function glow(){
    const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.18, 'rgba(255,255,255,.6)'); r.addColorStop(.45, 'rgba(255,255,255,.13)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c);
  }
  function dotTex(){
    const c = document.createElement('canvas'); c.width = c.height = 32; const g = c.getContext('2d');
    const r = g.createRadialGradient(16, 16, 0, 16, 16, 16); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.35, 'rgba(255,255,255,.8)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 32, 32); return new T.CanvasTexture(c);
  }
  function textSprite(text, color){
    const c = document.createElement('canvas'); c.width = 1024; c.height = 128; const g = c.getContext('2d');
    g.font = 'italic 400 46px "Newsreader", Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    let s = text.length > 44 ? text.slice(0, 42) + '…' : text;
    g.shadowColor = 'rgba(0,0,0,.9)'; g.shadowBlur = 14; g.fillStyle = color || '#F4F5FF'; g.fillText(s, 512, 64);
    const tex = new T.CanvasTexture(c); const sp = new T.Sprite(new T.SpriteMaterial({map:tex, transparent:true, depthWrite:false, opacity:0}));
    sp.scale.set(2.6, .325, 1); return sp;
  }
  function makeStar(idea, best){
    const col = new T.Color(SKIN.ideaColors[idea.color || 0]);
    const core = new T.Mesh(new T.SphereGeometry(best ? .1 : .075, 16, 12), new T.MeshBasicMaterial({color:0xffffff}));
    const h = new T.Sprite(new T.SpriteMaterial({map:halo, color:col, transparent:true, blending:T.AdditiveBlending, depthWrite:false}));
    h.userData.id = idea.id; core.add(h);
    if (best) { const ring = new T.Mesh(new T.RingGeometry(.28, .3, 48), new T.MeshBasicMaterial({color:col, transparent:true, opacity:.7, side:T.DoubleSide, blending:T.AdditiveBlending})); ring.rotation.x = Math.PI / 2; core.add(ring); }
    const lab = document.createElement('div'); lab.className = 'star-label'; lab.textContent = idea.name; labelsEl.appendChild(lab);
    return {core, halo:h, lab, best, born:1, base:best ? 1.35 : 1, phase:Math.random() * 6, idea};
  }
  function clearStars(){ stars.forEach(s => { world.remove(s.core); s.lab.remove(); }); stars.clear(); }
  function rebuildLines(ideas){
    if (lineGroup) world.remove(lineGroup);
    lineGroup = new T.Group(); world.add(lineGroup);
    const byWeek = {};
    ideas.forEach(i => { const d = new Date(i.date); d.setDate(d.getDate() - (d.getDay() + 6) % 7); (byWeek[d.toDateString()] ||= []).push(i); });
    const mat = new T.LineBasicMaterial({color:0xC9CCEF, transparent:true, opacity:.28, blending:T.AdditiveBlending, depthWrite:false});
    Object.values(byWeek).forEach(list => { if (list.length < 2) return;
      const pts = list.map(i => stars.get(i.id)).filter(Boolean).map(s => s.core.position.clone());
      if (pts.length > 1) lineGroup.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), mat)); });
  }
  let allIdeas = [], bests = [];

  function init(canvas, labels, cb){
    canvasEl = canvas; labelsEl = labels; onPick = cb.onPick;
    if (!T) return false;
    try { R = new T.WebGLRenderer({canvas, antialias:true, alpha:false}); } catch (e) { return false; }
    R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.setClearColor(0x05060D, 1);
    scene = new T.Scene(); scene.fog = new T.FogExp2(0x05060D, .025);
    camera = new T.PerspectiveCamera(50, 1, .05, 400);
    world = new T.Group(); scene.add(world);
    halo = glow(); dot = dotTex();

    // galaxy dust: grows with sparks
    const pos = new Float32Array(MAXDUST * 3), col = new Float32Array(MAXDUST * 3);
    const cin = new T.Color(0xF3E3C3), cout = new T.Color(0x7C86D9), cc = new T.Color();
    for (let i = 0; i < MAXDUST; i++) {
      const r = Math.pow(Math.random(), 1.4) * 9, arm = (i % 3) * Math.PI * 2 / 3, a = arm + r * .62;
      const j = () => Math.pow(Math.random(), 3) * (Math.random() < .5 ? 1 : -1) * (.4 + r * .12);
      pos[i * 3] = Math.cos(a) * r + j(); pos[i * 3 + 1] = (Math.random() - .5) * .45 * (1 - r / 10); pos[i * 3 + 2] = Math.sin(a) * r + j();
      cc.copy(cin).lerp(cout, Math.min(1, r / 8)); if (Math.random() < .06) cc.set(0xC9B6F0);
      col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b;
    }
    dustGeo = new T.BufferGeometry(); dustGeo.setAttribute('position', new T.BufferAttribute(pos, 3)); dustGeo.setAttribute('color', new T.BufferAttribute(col, 3));
    dust = new T.Points(dustGeo, new T.PointsMaterial({size:.06, map:dot, vertexColors:true, transparent:true, opacity:.95, depthWrite:false, blending:T.AdditiveBlending}));
    world.add(dust);
    // far background stars
    const bg = new Float32Array(2400 * 3);
    for (let i = 0; i < 2400; i++) { const v = V(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize().multiplyScalar(60 + Math.random() * 60); bg[i * 3] = v.x; bg[i * 3 + 1] = v.y; bg[i * 3 + 2] = v.z; }
    const bgGeo = new T.BufferGeometry(); bgGeo.setAttribute('position', new T.BufferAttribute(bg, 3));
    scene.add(new T.Points(bgGeo, new T.PointsMaterial({size:.35, map:dot, color:0xA9ABD0, transparent:true, opacity:.7, fog:false, depthWrite:false, blending:T.AdditiveBlending})));
    // nebula glows
    [[0x8F7FD0, -4, -3, 9], [0x4E5BB8, 5, 2, 12], [0xF1D8A6, 0, 0, 5]].forEach(([c, x, z, s]) => { const n = new T.Sprite(new T.SpriteMaterial({map:halo, color:c, transparent:true, opacity:.12, blending:T.AdditiveBlending, depthWrite:false})); n.position.set(x, -.3, z); n.scale.setScalar(s); world.add(n); });

    const size = () => { const w = innerWidth, h = innerHeight; R.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
    size(); addEventListener('resize', size);

    let down = null;
    canvas.addEventListener('pointerdown', e => { down = {x:e.clientX, y:e.clientY, yaw:tyaw, pitch:tpitch, moved:false}; try { canvas.setPointerCapture(e.pointerId); } catch (_) {} });
    canvas.addEventListener('pointermove', e => {
      px = e.clientX / innerWidth * 2 - 1; py = -(e.clientY / innerHeight * 2 - 1);
      if (!down) return; const dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (Math.hypot(dx, dy) > 6) { down.moved = true; focusId = null; }
      if (down.moved && view === 'world') { tyaw = down.yaw + dx * .006; tpitch = clamp(down.pitch + dy * .003, -.3, .45); }
    });
    canvas.addEventListener('pointerup', e => { if (down && !down.moved) tap(e); down = null; });
    canvas.addEventListener('pointercancel', () => { down = null; });
    canvas.addEventListener('wheel', e => { if (view !== 'world') return; e.preventDefault(); zoom = clamp(zoom * (1 + e.deltaY * .001), .45, 1.8); }, {passive:false});

    let last = performance.now();
    const loop = now => { const dt = Math.min(.05, (now - last) / 1000); last = now; frame(dt, now / 1000); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    return true;
  }
  function tap(e){
    if (view !== 'world') return;
    const v = new T.Vector2(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1));
    ray.setFromCamera(v, camera);
    const hits = ray.intersectObjects([...stars.values()].map(s => s.halo));
    if (hits[0]) onPick(hits[0].object.userData.id);
  }
  function viewTarget(){
    const s = spread(), nar = camera ? Math.max(1, 1.1 / camera.aspect) : 1, d = Math.max(9, s * 2.3) * zoom * Math.min(nar, 1.8);
    const V_ = {
      world:[[0, d * .5, d], [0, 0, 0]], today:[[4.5, 2, 6.5], [-1, -.3, 0]], drill:[[0, 1.2, 4.6], [0, -.2, -1]],
      forge:[[0, .9, 2 + 4.4 * nar], [0, .5, 2]], shape:[[0, 1.4, 2 + 5.5 * nar], [0, .5, 2]], done:[[0, d * .45, d * .9], [0, 0, 0]],
      notes:[[-5, 2.6, 6.5], [1.2, 0, 0]], gallery:[[0, 11, 5], [0, 0, 0]], profile:[[3.5, 6, 7.5], [0, 0, 0]]
    };
    return V_[view] || V_.world;
  }
  function setView(name){
    view = name; if (name !== 'world') focusId = null;
    const [p, l] = viewTarget(); cam.tp.set(...p); cam.tl.set(...l);
    labelsEl.style.opacity = name === 'world' ? 1 : 0;
  }
  function frame(dt, now){
    for (let i = tweens.length - 1; i >= 0; i--) { const w = tweens[i]; w.t += dt; const k = Math.min(1, w.t / w.dur); w.fn(k, w.t); if (k >= 1) { tweens.splice(i, 1); w.res(); } }
    if (view === 'world' && !focusId) { const [p, l] = viewTarget(); cam.tp.set(...p); cam.tl.set(...l); }
    if (focusId && stars.get(focusId)) { const s = stars.get(focusId); s.core.getWorldPosition(tmp); tmp.y -= .75; cam.tl.lerp(tmp, .08); cam.tp.copy(tmp).add(V(0, 1.5, 3.8 * Math.max(1, .9 / camera.aspect))); }
    const auto = reduce ? 0 : dt * .016;
    if (!focusId) tyaw += auto;
    yaw += (tyaw - yaw) * .06; pitch += (tpitch - pitch) * .06;
    world.rotation.y = yaw; world.rotation.x = pitch * .6;
    cam.p.lerp(cam.tp, .022); cam.l.lerp(cam.tl, .032);
    camera.position.copy(cam.p);
    camera.position.x += px * .35; camera.position.y += py * .2;
    if (shake > 0) { camera.position.x += (Math.random() - .5) * shake; camera.position.y += (Math.random() - .5) * shake; shake *= .9; if (shake < .002) shake = 0; }
    camera.lookAt(cam.l);
    const t = now;
    stars.forEach(s => {
      if (s.born < 1) s.born = Math.min(1, s.born + dt * .45);
      const b = s.born < 1 ? 1 + Math.sin(s.born * Math.PI) * 3 : 1;
      s.halo.scale.setScalar(s.base * (.85 + Math.sin(t * 2 + s.phase) * .1) * b * (focusId === s.idea.id ? 1.4 : 1));
    });
    if (view === 'world') {
      const w = innerWidth, h = innerHeight;
      stars.forEach(s => { s.core.getWorldPosition(tmp); const d = tmp.distanceTo(camera.position); tmp.project(camera);
        const vis = tmp.z < 1 && Math.abs(tmp.x) < 1.1 && Math.abs(tmp.y) < 1.1;
        s.lab.style.transform = `translate(${(tmp.x * .5 + .5) * w}px,${(-tmp.y * .5 + .5) * h}px) translate(-50%,-160%)`;
        s.lab.style.opacity = vis ? (focusId === s.idea.id ? 1 : clamp(1.4 - d / 14, .25, .9)) : 0;
        s.lab.classList.toggle('on', focusId === s.idea.id); });
    }
    R.render(scene, camera);
  }
  function setIdeas(ideas, best){
    allIdeas = ideas.slice(); bests = best || [];
    if (!world) return;
    clearStars();
    ideas.forEach((i, k) => { const s = makeStar(i, bests.includes(i.id)); s.core.position.copy(slot(k)); world.add(s.core); stars.set(i.id, s); });
    rebuildLines(ideas);
  }
  function setSparks(n){ if (dustGeo) dustGeo.setDrawRange(0, Math.min(MAXDUST, 2600 + n * 45)); }
  function spark(kind){
    if (!scene) return;
    const c = new T.Color(DRILL[kind] || '#ffffff');
    const s = new T.Sprite(new T.SpriteMaterial({map:halo, color:c, transparent:true, blending:T.AdditiveBlending, depthWrite:false}));
    const dir = V(0, 0, -1).applyQuaternion(camera.quaternion);
    const start = camera.position.clone().add(dir.multiplyScalar(2)).add(V((Math.random() - .5) * 2, -.8, 0));
    const a = Math.random() * Math.PI * 2, r = 1 + Math.random() * 6, end = world.localToWorld(V(Math.cos(a) * r, 0, Math.sin(a) * r));
    s.position.copy(start); scene.add(s);
    tween(1.9, k => { const e = ease(k); s.position.lerpVectors(start, end, e); s.position.y += Math.sin(k * Math.PI) * .8; s.scale.setScalar(.7 * (1 - e) + .08); s.material.opacity = 1 - k * .6; })
      .then(() => { scene.remove(s); dustGeo.setDrawRange(0, Math.min(MAXDUST, dustGeo.drawRange.count + 45)); });
  }

  function forge(texts, hook){
    if (!scene) return Promise.resolve();
    setView('forge');
    const C = V(0, .5, 2);
    const items = texts.map((t, i) => ({t, c:['#F1D8A6', '#D3C4F1', '#B4C0F2'][i % 3]})).concat([{t:hook, c:'#BBDCE0'}]);
    const N = items.length, g = new T.Group(); g.position.copy(C); scene.add(g);
    const orbs = items.map((it, i) => { const o = new T.Sprite(new T.SpriteMaterial({map:halo, color:new T.Color(it.c), transparent:true, blending:T.AdditiveBlending, depthWrite:false}));
      o.scale.setScalar(.001); const lab = textSprite(it.t, it.c); g.add(o, lab); return {o, lab, a0:i / N * Math.PI * 2}; });
    const flash = new T.Sprite(new T.SpriteMaterial({map:halo, color:0xffffff, transparent:true, opacity:0, blending:T.AdditiveBlending, depthWrite:false})); g.add(flash);
    const ring = new T.Mesh(new T.RingGeometry(.92, 1, 96), new T.MeshBasicMaterial({color:0xFFE2B0, transparent:true, opacity:0, side:T.DoubleSide, blending:T.AdditiveBlending, depthWrite:false}));
    ring.lookAt(camera.position.clone().sub(C)); g.add(ring);
    const BN = 500, bp = new Float32Array(BN * 3), bv = [];
    for (let i = 0; i < BN; i++) bv.push(V(Math.random() - .5, (Math.random() - .5) * .6, Math.random() - .5).normalize().multiplyScalar(1.5 + Math.random() * 3));
    const bGeo = new T.BufferGeometry(); bGeo.setAttribute('position', new T.BufferAttribute(bp, 3));
    const burst = new T.Points(bGeo, new T.PointsMaterial({size:.08, map:dot, color:0xFFE9C4, transparent:true, opacity:0, blending:T.AdditiveBlending, depthWrite:false})); g.add(burst);
    const newborn = new T.Mesh(new T.SphereGeometry(.09, 16, 12), new T.MeshBasicMaterial({color:0xffffff}));
    const nh = new T.Sprite(new T.SpriteMaterial({map:halo, color:0xF1D8A6, transparent:true, blending:T.AdditiveBlending, depthWrite:false})); nh.scale.setScalar(.001); newborn.add(nh); g.add(newborn);
    const D = 4.2, SL = 1.75;
    return tween(D * SL, (k, tt) => {
      const t = tt / SL;
      let r; if (t < .7) r = 1.7 * out(t / .7); else if (t < 2.1) r = 1.7; else if (t < 2.9) r = 1.7 * (1 - ease((t - 2.1) / .8)); else r = 0;
      const spin = t * .5 + (t > 2.1 ? Math.pow(t - 2.1, 2) * 2.6 : 0);
      orbs.forEach(({o, lab, a0}) => {
        const a = a0 + spin; o.position.set(Math.cos(a) * r, Math.sin(a) * r * .55, Math.sin(a) * r * .35);
        o.scale.setScalar(t < 2.9 ? .75 * Math.min(1, t / .5) : 0);
        lab.position.copy(o.position).add(V(0, -.34, .01));
        lab.material.opacity = t < .7 ? t / .7 : t < 1.9 ? 1 : Math.max(0, 1 - (t - 1.9) / .4);
      });
      if (t >= 2.9) {
        if (!shake && t < 3) shake = .08;
        const f = Math.min(1, (t - 2.9) / 1.2);
        flash.material.opacity = 1 - f; flash.scale.setScalar(.5 + 7 * out(f));
        ring.material.opacity = .9 * (1 - f); ring.scale.setScalar(.2 + 4.5 * out(f));
        burst.material.opacity = 1 - f; const arr = bGeo.attributes.position.array;
        for (let i = 0; i < BN; i++) { arr[i * 3] = bv[i].x * out(f); arr[i * 3 + 1] = bv[i].y * out(f); arr[i * 3 + 2] = bv[i].z * out(f); }
        bGeo.attributes.position.needsUpdate = true;
        nh.scale.setScalar(2.2 * Math.min(1, f * 2) * (1 + Math.sin(t * 5) * .06));
      }
    }).then(() => {
      [...g.children].forEach(ch => { if (ch !== newborn) g.remove(ch); });
      pending = {g, star:newborn, glow:nh};
    });
  }
  function place(idea){
    if (!scene) { allIdeas.push(idea); return Promise.resolve(); }
    const idx = allIdeas.length;
    allIdeas.push(idea);
    const s = makeStar(idea, false);
    const target = slot(idx);
    setView('world'); focusId = null;
    if (!pending) { s.core.position.copy(target); world.add(s.core); stars.set(idea.id, s); s.born = 0; rebuildLines(allIdeas); focusId = idea.id; return tween(1, () => {}); }
    const P = pending; pending = null;
    const from = V(0, 0, 0); P.g.getWorldPosition(from);
    P.glow.material.color.set(SKIN.ideaColors[idea.color || 0]);
    return tween(3.8, k => {
      const e = ease(k), to = world.localToWorld(target.clone());
      P.g.position.lerpVectors(from, to, e); P.g.position.y += Math.sin(k * Math.PI) * 1.4;
      P.glow.scale.setScalar(2.2 - 1.2 * e);
      cam.tl.lerp(P.g.position, .06);
    }).then(() => {
      scene.remove(P.g);
      s.core.position.copy(target); world.add(s.core); stars.set(idea.id, s); s.born = 0;
      rebuildLines(allIdeas); focusId = idea.id;
      return tween(1.8, () => {});
    });
  }
  function focus(id){ if (!id) { focusId = null; return; } if (stars.has(id)) { if (view !== 'world') setView('world'); focusId = id; } }
  return {init, setIdeas, setSparks, view:setView, spark, forge, place, focus};
})();

/* ---------- star chart art: one per idea, drawn from its brief and ingredients ---------- */
(() => {
  const SH = {
    hourglass:['The Hourglass', [[[.3,.15],[.7,.15],[.5,.5],[.7,.85],[.3,.85],[.5,.5],[.3,.15]]]],
    house:['The House', [[[.2,.5],[.5,.18],[.8,.5],[.8,.85],[.2,.85],[.2,.5]], [[.44,.85],[.44,.64],[.57,.64],[.57,.85]]]],
    train:['The Night Train', [[[.12,.38],[.78,.38],[.88,.56],[.88,.72],[.12,.72],[.12,.38]], [[.3,.8]], [[.7,.8]], [[.12,.55],[.88,.56]]]],
    frame:['The Gallery Frame', [[[.2,.2],[.8,.2],[.8,.8],[.2,.8],[.2,.2]], [[.32,.68],[.48,.42],[.58,.56],[.68,.46]]]],
    leaf:['The Leaf', [[[.2,.82],[.34,.42],[.7,.18],[.76,.55],[.46,.78],[.2,.82]], [[.2,.82],[.7,.18]]]],
    key:['The Key', [[[.18,.36],[.32,.26],[.44,.4],[.32,.54],[.18,.46],[.18,.36]], [[.44,.4],[.86,.62]], [[.7,.54],[.65,.65]], [[.8,.59],[.76,.7]]]],
    drop:['The Drop', [[[.5,.12],[.7,.5],[.68,.7],[.5,.86],[.32,.7],[.3,.5],[.5,.12]]]],
    speech:['The Speech Bubble', [[[.15,.25],[.85,.25],[.85,.65],[.46,.65],[.3,.84],[.33,.65],[.15,.65],[.15,.25]]]],
    cup:['The Cup', [[[.24,.36],[.7,.36],[.65,.8],[.29,.8],[.24,.36]], [[.7,.46],[.82,.5],[.8,.63],[.67,.66]], [[.4,.26],[.44,.12]], [[.55,.26],[.58,.12]]]],
    scales:['The Scales', [[[.5,.14],[.5,.86]], [[.18,.3],[.82,.3]], [[.18,.3],[.1,.56],[.27,.56],[.18,.3]], [[.82,.3],[.73,.56],[.9,.56],[.82,.3]], [[.34,.86],[.66,.86]]]],
    heart:['The Heart', [[[.5,.82],[.18,.46],[.24,.26],[.4,.22],[.5,.35],[.6,.22],[.76,.26],[.82,.46],[.5,.82]]]],
    hammer:['The Hammer', [[[.24,.24],[.66,.24],[.72,.34],[.24,.38],[.24,.24]], [[.46,.38],[.52,.88]]]],
    arc:['The Long Arc', [[[.12,.72],[.26,.42],[.5,.28],[.74,.42],[.88,.72]], [[.12,.72],[.2,.8]], [[.88,.72],[.8,.8]]]],
    pencil:['The Pencil', [[[.18,.82],[.24,.66],[.7,.2],[.8,.3],[.34,.76],[.18,.82]], [[.62,.28],[.72,.38]]]],
    moon:['The Crescent', [[[.56,.14],[.35,.24],[.25,.5],[.35,.76],[.6,.86],[.8,.72],[.6,.68],[.48,.5],[.52,.3],[.56,.14]], [[.8,.24]], [[.72,.42]]]],
    triangle:['The Loop', [[[.5,.18],[.84,.76],[.16,.76],[.5,.18]], [[.5,.4],[.66,.66],[.34,.66],[.5,.4]]]],
    tree:['The Tree', [[[.5,.14],[.26,.5],[.4,.5],[.2,.72],[.8,.72],[.6,.5],[.74,.5],[.5,.14]], [[.5,.72],[.5,.9]]]],
    phone:['The Handset', [[[.32,.12],[.68,.12],[.68,.88],[.32,.88],[.32,.12]], [[.44,.8],[.56,.8]], [[.44,.2],[.56,.2]]]],
    umbrella:['The Umbrella', [[[.14,.46],[.3,.24],[.5,.17],[.7,.24],[.86,.46],[.14,.46]], [[.5,.46],[.5,.8],[.42,.86]]]],
    plane:['The Plane', [[[.5,.1],[.55,.4],[.88,.56],[.55,.56],[.55,.78],[.65,.88],[.35,.88],[.45,.78],[.45,.56],[.12,.56],[.45,.4],[.5,.1]]]],
    book:['The Open Book', [[[.5,.3],[.2,.22],[.2,.78],[.5,.86],[.8,.78],[.8,.22],[.5,.3],[.5,.86]]]]
  };
  const KEYS = Object.keys(SH);
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = seed => { let a = seed | 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  function glowDot(g, x, y, r, col, a){
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(255,252,244,${a})`); gr.addColorStop(.18, rgba(col, .85 * a)); gr.addColorStop(1, rgba(col, 0));
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    g.fillStyle = `rgba(255,255,255,${a})`; g.beginPath(); g.arc(x, y, Math.max(1.4, r * .09), 0, 7); g.fill();
  }
  SKIN.art = (c, idea, k = 1) => {
    const g = c.getContext('2d'), W = c.width, H = c.height, r = rng(hash(idea.id + idea.name));
    const tint = SKIN.ideaColors[idea.color || 0], key = SH[idea.shape] ? idea.shape : KEYS[hash(idea.id) % KEYS.length], [title, lines] = SH[key];
    g.globalCompositeOperation = 'source-over';
    const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#06070F'); bg.addColorStop(1, '#0D0F22'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter';
    const neb = [tint, '#6B74C4', '#9C88D6', tint];
    const nk = cl(k * 1.8, 0, 1);
    for (let i = 0; i < 6; i++) { const x = W * (.15 + r() * .7), y = H * (.15 + r() * .7), rad = W * (.16 + r() * .28), col = neb[i % 4];
      const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, rgba(col, .2 * nk)); gr.addColorStop(.5, rgba(col, .07 * nk)); gr.addColorStop(1, rgba(col, 0)); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    for (let i = 0; i < 340; i++) { const x = r() * W, y = r() * H, big = r() < .06, a = (.25 + r() * .6) * cl(k * 2 - r() * .6, 0, 1);
      g.fillStyle = `rgba(237,236,247,${a})`; g.beginPath(); g.arc(x, y, big ? 1.4 : .7, 0, 7); g.fill(); }
    const box = H * .78, ox = W * .5 - box / 2 + (r() - .5) * W * .16, oy = (H - box) / 2;
    const P = ([x, y]) => [ox + x * box, oy + y * box];
    const segs = [], verts = [];
    lines.forEach(pl => { pl.forEach(pt => { if (!verts.some(v => v[0] === pt[0] && v[1] === pt[1])) verts.push(pt); }); for (let j = 0; j < pl.length - 1; j++) segs.push([P(pl[j]), P(pl[j + 1])]); });
    const lk = cl((k - .3) / .5, 0, 1) * segs.length;
    g.globalCompositeOperation = 'source-over';
    g.lineWidth = 1.4; g.strokeStyle = 'rgba(237,236,247,.42)'; g.lineCap = 'round';
    segs.forEach(([a, b], j) => { const f = cl(lk - j, 0, 1); if (f <= 0) return; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f); g.stroke(); });
    g.globalCompositeOperation = 'lighter';
    verts.forEach((v, j) => { const a = cl((k - .25) * 3 - j * .08, 0, 1); if (!a) return; const [x, y] = P(v); glowDot(g, x, y, 9 + r() * 9, tint, a); });
    // the idea's own ingredients: brighter stars scattered around the figure
    const ing = idea.sparks.length + 1;
    for (let i = 0; i < ing; i++) { const a = cl((k - .75) * 5 - i * .25, 0, 1); if (!a) continue;
      const ang = r() * Math.PI * 2, d = box * (.55 + r() * .2), x = cl(ox + box / 2 + Math.cos(ang) * d, 30, W - 30), y = cl(oy + box / 2 + Math.sin(ang) * d * .7, 30, H - 30);
      glowDot(g, x, y, i === ing - 1 ? 30 : 20, i === ing - 1 ? '#BBDCE0' : tint, a); }
    g.globalCompositeOperation = 'source-over';
    const ta = cl((k - .8) * 5, 0, 1);
    g.fillStyle = `rgba(169,171,200,${.85 * ta})`; g.font = '500 17px "Geist", system-ui, sans-serif';
    g.fillText(`CONSTELLATION · ${title.toUpperCase()}`, 34, H - 34);
    g.textAlign = 'right'; g.fillText(`MADE FROM ${idea.sparks.length} SPARKS`, W - 34, H - 34); g.textAlign = 'left';
  };
})();
