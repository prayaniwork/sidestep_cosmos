window.SKIN = {
  name:'paper',
  fonts:['400 40px "Young Serif"', '400 22px "Geist Mono"', '400 16px "Geist"'],
  ideaColors:['#FBF8F1', '#FFD666', '#9DB8F2', '#EE8C6E', '#B7D3A8', '#D9C2F0', '#F2B8C6'],
  worldWord:'wall', placeLabel:'Pin it to my wall', revealEyebrow:'Fresh off the press', artWord:'poster',
  colorUnlock:['Rare paper stocks', 'Your posters can print on sage, lilac or rose'],
  worldLabel:'Your idea wall. Drag to look around, tap a poster to open its idea.',
  logo:'<svg viewBox="0 0 30 30" aria-hidden="true"><rect x="4" y="6" width="15" height="19" rx="1.5" fill="#9DB8F2" transform="rotate(-8 11 15)"/><rect x="11" y="5" width="15" height="19" rx="1.5" fill="#FBF8F1" stroke="#26322B" stroke-width="1.2" transform="rotate(6 18 14)"/><circle cx="18.5" cy="7" r="2.2" fill="#C8452F"/></svg>',
  worldHint:'Drag to look around · tap a poster to open it',
  worldEmpty:'Your wall is bare. Your first idea gets pinned here.',
  introTitle:'Fill a wall with your own ideas.',
  introGrow:'Each idea is printed as a poster and pinned to your wall. Every spark adds a scrap of paper.',
  examples:['Waiting Room Radio', 'Patients stuck waiting more than 20 minutes', 'Patients vote on the next song from a small screen. The playlist shows what is coming up but hides the rest, so people stay curious about what plays next.'],
  doneTitle:i => `Pinned to your wall: ${i.name.replace(/[<>&]/g, '')}.`
};

window.World = (() => {
  const T = window.THREE;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DRILL = {far:'#FFD666', second:'#EE8C6E', bridge:'#9DB8F2', notes:'#2F5D50'};
  const SCRAPS = ['#FFD666', '#EE8C6E', '#9DB8F2', '#FBF8F1', '#B7D3A8', '#2F5D50', '#F2B8C6'];
  const PW = 1.3, PH = 1.84, GX = 1.75, GY = 2.4, TOP = 2;
  let R, scene, camera, onPick, scrapMesh, scrapCount = 0, nextSlotMesh;
  const posters = new Map(); let allIdeas = [], bests = [], cols = 4;
  const tweens = [];
  const cam = {p:V(0, 0, 12), l:V(0, 0, 0), tp:V(0, 0, 12), tl:V(0, 0, 0)};
  let view = 'world', focusId = null, pending = null, pan = 0, tpan = 0, px = 0, py = 0, shake = 0, hover = null;
  const ray = new T.Raycaster(), tmpM = new T.Matrix4(), tmpQ = new T.Quaternion(), tmpS = V(1, 1, 1);
  const MAXSCRAP = 420;

  const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const out = k => 1 - Math.pow(1 - k, 3);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function tween(dur, fn){ return new Promise(res => tweens.push({t:0, dur:reduce ? dur * .5 : dur, fn, res})); }
  function hash(s){ let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; }
  function rng(seed){ let a = seed | 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function slot(i){ const c = i % cols, r = Math.floor(i / cols); return V((c - (cols - 1) / 2) * GX, TOP - r * GY, .03); }
  const rows = () => Math.max(1, Math.ceil((allIdeas.length + 1) / cols));

  function rounded(w, h, r){ const s = new T.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
  function cardGeo(w, h){ const g = new T.ShapeGeometry(rounded(w, h, .05), 6), uv = g.attributes.uv, p = g.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h); return g; }
  function wrap(g, text, x, y, maxW, lh, maxLines){ const words = String(text).split(/\s+/); let line = '', n = 0;
    for (let i = 0; i < words.length; i++) { const t = line ? line + ' ' + words[i] : words[i];
      if (g.measureText(t).width > maxW && line) { if (++n >= maxLines) { g.fillText(line.replace(/[.,;:]?$/, '…'), x, y); return y; } g.fillText(line, x, y); line = words[i]; y += lh; } else line = t; }
    g.fillText(line, x, y); return y; }
  function grain(g, w, h, a){ for (let i = 0; i < w * h / 90; i++) { g.fillStyle = `rgba(38,50,43,${Math.random() * a})`; g.fillRect(Math.random() * w, Math.random() * h, 1.6, 1.6); } }
  function tex(c){ const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t; }
  function posterTex(idea){
    const W = 520, H = 736, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
    g.fillStyle = idea ? SKIN.ideaColors[idea.color || 0] : '#FBF8F1'; g.fillRect(0, 0, W, H); grain(g, W, H, .07);
    g.fillStyle = '#26322B';
    if (!idea) { g.font = '400 26px "Geist Mono", monospace'; g.fillText('IDEA No. ???', 40, 70); g.font = '400 64px "Young Serif", Georgia, serif'; g.fillText('Forged.', 40, 190); return tex(c); }
    g.font = '400 22px "Geist Mono", monospace'; g.fillText('IDEA No. ' + String(idea.n).padStart(3, '0'), 40, 64);
    const d = new Date(idea.date).toLocaleDateString(undefined, {day:'numeric', month:'short'}).toUpperCase(); g.textAlign = 'right'; g.fillText(d, W - 40, 64); g.textAlign = 'left';
    g.fillRect(40, 84, W - 80, 3);
    g.font = '400 58px "Young Serif", Georgia, serif'; let y = wrap(g, idea.name, 40, 162, W - 80, 64, 4);
    y += 58; g.font = '400 20px "Geist Mono", monospace'; g.fillText('FOR', 40, y); y += 36;
    g.font = '400 27px "Geist", system-ui, sans-serif'; y = wrap(g, idea.who, 40, y, W - 80, 36, 3);
    g.save(); g.translate(W - 110, H - 110); g.rotate(-.2); g.strokeStyle = '#C8452F'; g.fillStyle = '#C8452F'; g.lineWidth = 4;
    g.beginPath(); g.arc(0, 0, 70, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(0, 0, 60, 0, Math.PI * 2); g.stroke();
    g.font = '400 18px "Geist Mono", monospace'; g.textAlign = 'center'; g.fillText('HOOK', 0, -18); g.font = '400 22px "Young Serif", Georgia, serif';
    const hlab = idea.hook ? idea.hook.label : 'Idea', hl = hlab.length > 16 ? hlab.slice(0, 15) + '…' : hlab; g.fillText(hl, 0, 14); g.restore();
    g.font = '400 17px "Geist Mono", monospace'; g.fillStyle = 'rgba(38,50,43,.7)'; wrap(g, 'BRIEF: ' + idea.brief.toUpperCase(), 40, H - 90, W - 230, 24, 3);
    return tex(c);
  }
  function cardTex(text, color, label){
    const W = 360, H = 490, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
    g.fillStyle = color; g.fillRect(0, 0, W, H); grain(g, W, H, .08);
    const dark = color === '#2F5D50'; g.fillStyle = dark ? '#FBF8F1' : '#26322B';
    g.font = '400 20px "Geist Mono", monospace'; g.fillText(label, 28, 50); g.fillRect(28, 66, W - 56, 2);
    g.font = '400 34px "Young Serif", Georgia, serif'; wrap(g, text, 28, 124, W - 56, 42, 8);
    return tex(c);
  }
  function backTex(color){
    const c = document.createElement('canvas'); c.width = 360; c.height = 490; const g = c.getContext('2d');
    g.fillStyle = color; g.fillRect(0, 0, 360, 490); g.globalAlpha = .16; g.fillStyle = '#26322B';
    for (let y = -490; y < 490; y += 26) { g.save(); g.translate(0, y); g.rotate(.5); g.fillRect(0, 0, 900, 9); g.restore(); }
    g.globalAlpha = 1; g.font = '400 40px "Young Serif", Georgia, serif'; g.textAlign = 'center'; g.fillText('Sidestep', 180, 260); return tex(c);
  }
  function outlineTex(){
    const c = document.createElement('canvas'); c.width = 520; c.height = 736; const g = c.getContext('2d');
    g.strokeStyle = 'rgba(38,50,43,.45)'; g.setLineDash([22, 16]); g.lineWidth = 5; g.strokeRect(10, 10, 500, 716);
    g.fillStyle = 'rgba(38,50,43,.55)'; g.font = '400 24px "Geist Mono", monospace'; g.textAlign = 'center'; g.fillText('YOUR NEXT IDEA', 260, 360); g.fillText('GOES HERE', 260, 396);
    return tex(c);
  }
  function pin(color){
    const p = new T.Group();
    const head = new T.Mesh(new T.SphereGeometry(.075, 20, 14), new T.MeshStandardMaterial({color, roughness:.35, metalness:.1})); head.position.z = .12; head.castShadow = true;
    const neck = new T.Mesh(new T.CylinderGeometry(.018, .018, .12, 8), new T.MeshStandardMaterial({color:0xB8B8B0, metalness:.6, roughness:.3})); neck.rotation.x = Math.PI / 2; neck.position.z = .06;
    p.add(head, neck); return p;
  }
  function makePoster(idea, best){
    const g = new T.Group();
    const m = new T.Mesh(cardGeo(PW, PH), new T.MeshStandardMaterial({map:posterTex(idea), roughness:.95})); m.castShadow = true; m.userData.id = idea.id; g.add(m);
    const p = pin(best ? 0xE8B230 : 0xC8452F); p.position.set(0, PH / 2 - .14, 0); g.add(p);
    if (best) { const star = new T.Mesh(new T.CircleGeometry(.17, 5), new T.MeshStandardMaterial({color:0xE8B230, roughness:.6})); star.position.set(PW / 2 - .2, PH / 2 - .2, .006); g.add(star); }
    g.userData = {id:idea.id, rot:(hash(idea.id) - .5) * .09, lift:0, mesh:m, pin:p};
    return g;
  }

  function init(canvas, labels, cb){
    onPick = cb.onPick;
    if (!T) return false;
    try { R = new T.WebGLRenderer({canvas, antialias:true}); } catch (e) { return false; }
    R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.setClearColor(0xD6E2DA, 1);
    R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap; R.outputEncoding = T.sRGBEncoding;
    scene = new T.Scene();
    camera = new T.PerspectiveCamera(38, 1, .1, 200);
    scene.add(new T.HemisphereLight(0xffffff, 0xB9C9BE, .62));
    const sun = new T.DirectionalLight(0xfff8ee, .62); sun.position.set(-5, 7, 10); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, {left:-14, right:14, top:14, bottom:-26, near:1, far:40}); sun.shadow.bias = -.0005; sun.target.position.set(0, -4, 0); scene.add(sun, sun.target);
    // wall with a subtle fibre texture
    const wc = document.createElement('canvas'); wc.width = wc.height = 512; const wg = wc.getContext('2d'); wg.fillStyle = '#D6E2DA'; wg.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2600; i++) { wg.strokeStyle = `rgba(${Math.random() < .5 ? '255,255,255' : '38,50,43'},${Math.random() * .05})`; wg.lineWidth = 1; const x = Math.random() * 512, y = Math.random() * 512, a = Math.random() * 6; wg.beginPath(); wg.moveTo(x, y); wg.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9); wg.stroke(); }
    const wt = tex(wc); wt.wrapS = wt.wrapT = T.RepeatWrapping; wt.repeat.set(10, 10);
    const wall = new T.Mesh(new T.PlaneGeometry(80, 80), new T.MeshStandardMaterial({map:wt, roughness:1})); wall.position.set(0, -10, 0); wall.receiveShadow = true; scene.add(wall);
    // scraps: every spark adds one
    scrapMesh = new T.InstancedMesh(new T.PlaneGeometry(.36, .15), new T.MeshStandardMaterial({roughness:1, side:T.DoubleSide}), MAXSCRAP);
    scrapMesh.castShadow = true; scrapMesh.count = 0; scene.add(scrapMesh);
    const r = rng(7), col = new T.Color();
    for (let i = 0; i < MAXSCRAP; i++) { col.set(SCRAPS[Math.floor(r() * SCRAPS.length)]); scrapMesh.setColorAt(i, col); }
    nextSlotMesh = new T.Mesh(cardGeo(PW, PH), new T.MeshBasicMaterial({map:outlineTex(), transparent:true})); scene.add(nextSlotMesh);
    const size = () => { const w = innerWidth, h = innerHeight; R.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      const nc = camera.aspect < .75 ? 2 : camera.aspect < 1.15 ? 3 : 4; if (nc !== cols) { cols = nc; layout(); } };
    size(); addEventListener('resize', size);
    let down = null;
    canvas.addEventListener('pointerdown', e => { down = {y:e.clientY, x:e.clientX, pan:tpan, moved:false}; try { canvas.setPointerCapture(e.pointerId); } catch (_) {} });
    canvas.addEventListener('pointermove', e => {
      px = e.clientX / innerWidth * 2 - 1; py = -(e.clientY / innerHeight * 2 - 1);
      if (view === 'world' && !down) hover = pickAt(e.clientX, e.clientY);
      canvas.style.cursor = hover ? 'pointer' : 'grab';
      if (!down) return; const dy = e.clientY - down.y, dx = e.clientX - down.x;
      if (Math.hypot(dx, dy) > 6) { down.moved = true; focusId = null; }
      if (down.moved && view === 'world') tpan = clamp(down.pan + dy * .012, -(rows() - 1) * GY - 1, 1);
    });
    canvas.addEventListener('pointerup', e => { if (down && !down.moved && view === 'world') { const id = pickAt(e.clientX, e.clientY); if (id) onPick(id); } down = null; });
    canvas.addEventListener('pointercancel', () => { down = null; });
    canvas.addEventListener('wheel', e => { if (view !== 'world') return; e.preventDefault(); focusId = null; tpan = clamp(tpan - e.deltaY * .006, -(rows() - 1) * GY - 1, 1); }, {passive:false});
    let last = performance.now();
    const loop = now => { const dt = Math.min(.05, (now - last) / 1000); last = now; frame(dt, now / 1000); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    return true;
  }
  function pickAt(x, y){
    ray.setFromCamera(new T.Vector2(x / innerWidth * 2 - 1, -(y / innerHeight * 2 - 1)), camera);
    const h = ray.intersectObjects([...posters.values()].map(p => p.userData.mesh))[0];
    return h ? h.object.userData.id : null;
  }
  function layout(){
    allIdeas.forEach((i, k) => { const p = posters.get(i.id); if (p) { p.position.copy(slot(k)); p.rotation.z = p.userData.rot; } });
    if (nextSlotMesh) { nextSlotMesh.position.copy(slot(allIdeas.length)); nextSlotMesh.position.z = .005; }
    layoutScraps();
  }
  function scrapPos(i){
    const r = rng(1000 + i), side = r() < .5 ? -1 : 1, half = (cols - 1) / 2 * GX + PW / 2;
    const x = side * (half + .35 + r() * 1.9), y = TOP + 1.3 - r() * (rows() * GY + 2.2);
    return {x, y, rz:(r() - .5) * 1.3};
  }
  function layoutScraps(){
    if (!scrapMesh) return;
    for (let i = 0; i < scrapCount; i++) { const s = scrapPos(i); tmpQ.setFromAxisAngle(V(0, 0, 1), s.rz); tmpM.compose(V(s.x, s.y, .012 + (i % 5) * .002), tmpQ, tmpS); scrapMesh.setMatrixAt(i, tmpM); }
    scrapMesh.count = scrapCount; scrapMesh.instanceMatrix.needsUpdate = true; if (scrapMesh.instanceColor) scrapMesh.instanceColor.needsUpdate = true;
  }
  function wallView(){
    const rs = rows(), cy = TOP - (rs - 1) * GY / 2;
    const fitW = cols * GX + 3.6, fov = camera.fov * Math.PI / 180;
    const dW = (fitW / 2) / (Math.tan(fov / 2) * camera.aspect), dH = (Math.min(rs, 2) * GY + 1.4) / 2 / Math.tan(fov / 2);
    const d = clamp(Math.max(dW, dH), 6, 26), y = rs > 2 ? TOP - GY / 2 + pan : cy;
    return [[0, y - .4, d], [0, y, 0]];
  }
  function setView(name){ view = name; if (name !== "world") focusId = null; hover = null; if (camera) target(); }
  function target(){
    const [p, l] = wallView(), nar = Math.min(2.2, Math.max(1, 1.45 / camera.aspect));
    const V_ = {
      world:[p, l], today:[[p[0] + 2.2, p[1] + .6, p[2] * .72], [l[0] + 2.2, l[1] + .6, 0]], drill:[[-3, p[1] - 1.5, 5], [-3.4, p[1] - 1.5, 0]],
      forge:[[0, 0, 2.2 + 4.4 * nar], [0, 0, 2.2]], shape:[[0, .3, 2.2 + 5.4 * nar], [0, .3, 2.2]], done:[p, l],
      notes:[[p[0] - 2.4, p[1] + .3, p[2] * .75], [l[0] - 2.4, l[1] + .3, 0]], gallery:[[0, l[1] - 1, p[2] * 1.25], [0, l[1] - 1, 0]], profile:[[p[0] + 1.5, p[1] - 2, p[2]], [l[0] + 1.5, l[1] - 2, 0]]
    };
    const [a, b] = V_[view] || V_.world; cam.tp.set(...a); cam.tl.set(...b);
  }
  function frame(dt, t){
    for (let i = tweens.length - 1; i >= 0; i--) { const w = tweens[i]; w.t += dt; const k = Math.min(1, w.t / w.dur); w.fn(k, w.t); if (k >= 1) { tweens.splice(i, 1); w.res(); } }
    pan += (tpan - pan) * .1;
    if (focusId && posters.get(focusId)) { const p = posters.get(focusId).position, fz = Math.max(6.6, 3.4 / camera.aspect); cam.tp.set(p.x, p.y - 1.3, fz); cam.tl.set(p.x, p.y - .8, 0); }
    else if (view === 'world' || view === 'done') target();
    cam.p.lerp(cam.tp, .045); cam.l.lerp(cam.tl, .06);
    camera.position.copy(cam.p); camera.position.x += px * .3; camera.position.y += py * .18;
    if (shake > 0) { camera.position.x += (Math.random() - .5) * shake; camera.position.y += (Math.random() - .5) * shake; shake *= .85; if (shake < .002) shake = 0; }
    camera.lookAt(cam.l);
    posters.forEach(p => { const u = p.userData, on = (hover === u.id || focusId === u.id) ? 1 : 0; u.lift += (on - u.lift) * .15;
      u.mesh.position.z = u.lift * .18; u.mesh.rotation.x = -u.lift * .06; u.mesh.rotation.y = Math.sin(t * .6 + u.rot * 40) * .015; u.pin.position.z = u.lift * .18; });
    R.render(scene, camera);
  }
  function setIdeas(ideas, best){
    allIdeas = ideas.slice(); bests = best || [];
    if (!scene) return;
    posters.forEach(p => scene.remove(p)); posters.clear();
    ideas.forEach(i => { const p = makePoster(i, bests.includes(i.id)); scene.add(p); posters.set(i.id, p); });
    layout();
  }
  function setSparks(n){ scrapCount = Math.min(MAXSCRAP, n); layoutScraps(); }
  function spark(kind){
    if (!scene) return;
    const m = new T.Mesh(new T.PlaneGeometry(.36, .15), new T.MeshStandardMaterial({color:DRILL[kind] || '#FBF8F1', roughness:1, side:T.DoubleSide})); m.castShadow = true;
    const s = scrapPos(scrapCount); scrapCount = Math.min(MAXSCRAP, scrapCount + 1);
    const start = V(s.x + (Math.random() - .5) * 2, cam.l.y + 5, 1.5); m.position.copy(start); scene.add(m);
    const i = scrapCount - 1;
    tween(1.2, k => { const e = out(k); m.position.set(start.x + (s.x - start.x) * e + Math.sin(k * 9) * .25 * (1 - k), start.y + (s.y - start.y) * e, 1.5 * (1 - e) + .012); m.rotation.set(Math.sin(k * 12) * (1 - k), Math.cos(k * 8) * (1 - k), s.rz + (1 - k) * 4); })
      .then(() => { scene.remove(m); tmpQ.setFromAxisAngle(V(0, 0, 1), s.rz); tmpM.compose(V(s.x, s.y, .012 + (i % 5) * .002), tmpQ, tmpS); scrapMesh.setMatrixAt(i, tmpM); scrapMesh.count = Math.max(scrapMesh.count, i + 1); scrapMesh.instanceMatrix.needsUpdate = true; });
  }
  function forge(texts, hook){
    if (!scene) return Promise.resolve();
    setView('forge');
    const F = V(0, 0, 2.2), items = texts.map((t, i) => ({t, c:['#FFD666', '#EE8C6E', '#9DB8F2'][i % 3], l:'SPARK'})).concat([{t:hook, c:'#2F5D50', l:'HOOK'}]);
    const N = items.length, CW = 1.02, CH = 1.39, geo = cardGeo(CW, CH);
    const g = new T.Group(); g.position.copy(F); scene.add(g);
    const cards = items.map((it, i) => { const c = new T.Group(), f = new T.Mesh(geo, new T.MeshStandardMaterial({map:cardTex(it.t, it.c, it.l), roughness:.95}));
      const b = new T.Mesh(geo, new T.MeshStandardMaterial({map:backTex(it.c), roughness:.95})); b.rotation.y = Math.PI; b.position.z = -.003; f.castShadow = true; c.add(f, b); g.add(c);
      const k = i - (N - 1) / 2; return {c, fx:k * 1.12, fy:-Math.abs(k) * .1, fr:-k * .1, sr:(Math.random() - .5) * 3, i}; });
    const poster = new T.Group(); const pm = new T.Mesh(cardGeo(PW, PH), new T.MeshStandardMaterial({map:posterTex(null), roughness:.95})); pm.castShadow = true; poster.add(pm);
    poster.visible = false; poster.scale.setScalar(CH / PH); g.add(poster);
    const sc = document.createElement('canvas'); sc.width = sc.height = 256; const sg = sc.getContext('2d'); sg.strokeStyle = sg.fillStyle = '#C8452F'; sg.lineWidth = 9;
    sg.beginPath(); sg.arc(128, 128, 110, 0, 7); sg.stroke(); sg.lineWidth = 4; sg.beginPath(); sg.arc(128, 128, 92, 0, 7); sg.stroke();
    sg.font = '400 44px "Young Serif", Georgia, serif'; sg.textAlign = 'center'; sg.textBaseline = 'middle'; sg.fillText('FORGED', 128, 128);
    const stamp = new T.Mesh(new T.PlaneGeometry(.8, .8), new T.MeshBasicMaterial({map:tex(sc), transparent:true, opacity:0, depthWrite:false})); stamp.position.set(.2, -.35, .02); stamp.rotation.z = -.25; poster.add(stamp);
    return tween(4.1, (k, t) => {
      cards.forEach(({c, fx, fy, fr, sr, i}) => {
        const d0 = t - i * .1;
        if (t < 1.9) { const e = out(clamp(d0 / .7, 0, 1)); c.position.set(fx, -5 + (fy + 5) * e + Math.sin(t * 2 + i) * .03 * e, i * .02); c.rotation.set(0, 0, sr * (1 - e) + fr * e); }
        else if (t < 2.5) { const e = ease((t - 1.9) / .6); c.position.set(fx * (1 - e), fy * (1 - e), i * .012); c.rotation.set(0, 0, fr * (1 - e) + (i - N / 2) * .03 * e); }
        c.visible = t < 2.78;
      });
      if (t >= 2.5 && t < 3.05) { const e = ease((t - 2.5) / .55); g.rotation.y = e * Math.PI * 2; if (t > 2.78) { poster.visible = true; poster.scale.setScalar(CH / PH + (1 - CH / PH) * clamp((t - 2.78) / .27, 0, 1)); } }
      if (t >= 3.05) { g.rotation.y = 0; poster.scale.setScalar(1); const f = clamp((t - 3.05) / .35, 0, 1); stamp.scale.setScalar(2.4 - 1.4 * out(f)); stamp.material.opacity = .92 * Math.min(1, f * 1.5); if (f >= 1 && !g.userData.thunk) { g.userData.thunk = true; shake = .06; } }
    }).then(() => { cards.forEach(({c}) => g.remove(c)); pending = {g, poster, pm, stamp}; });
  }
  function place(idea){
    if (!scene) return Promise.resolve();
    allIdeas.push(idea);
    const k = allIdeas.length - 1, p = makePoster(idea, false), to = slot(k);
    if (!pending) { scene.add(p); posters.set(idea.id, p); layout(); setView('world'); focusId = idea.id; return tween(1, () => {}); }
    const P = pending; pending = null;
    P.pm.material.map = posterTex(idea); P.pm.material.needsUpdate = true;
    const from = P.g.position.clone(), rot = p.userData.rot;
    setView('world'); focusId = null;
    cam.tp.set(to.x, to.y - .2, 5.2); cam.tl.set(to.x, to.y, 0);
    nextSlotMesh.visible = false;
    return tween(2, (kk, t) => {
      cam.tp.set(to.x, to.y - .2, 5.2); cam.tl.set(to.x, to.y, 0);
      const e = ease(kk); P.g.position.lerpVectors(from, V(to.x, to.y, .03), e); P.g.position.z += Math.sin(kk * Math.PI) * 1.2;
      P.g.rotation.z = rot * e; P.g.rotation.x = Math.sin(kk * Math.PI) * -.3;
      P.stamp.material.opacity = .92 * (1 - clamp(kk * 1.6, 0, 1));
    }).then(() => {
      scene.remove(P.g); scene.add(p); posters.set(idea.id, p); layout(); nextSlotMesh.visible = true;
      const pinP = p.userData.pin; pinP.position.z = 1.2;
      focusId = idea.id;
      return tween(.45, kk => { pinP.position.z = 1.2 * (1 - out(kk)); if (kk >= 1 && !p.userData.t) { p.userData.t = 1; shake = .04; } });
    });
  }
  function focus(id){ if (!id) { focusId = null; return; } if (posters.has(id)) { if (view !== 'world') setView('world'); focusId = id; } }
  return {init, setIdeas, setSparks, view:setView, spark, forge, place, focus};
})();
