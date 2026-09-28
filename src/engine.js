const sidestepApp = () => {
'use strict';
const SKIN = window.SKIN, World = window.World;

/* ================= content ================= */
const BRIEFS = [
  {t:"Make waiting at the doctor's less awful", set:'a clinic waiting room', anchor:'waiting', shape:'hourglass', obj:[['A plastic waiting-room chair','sitting while you wait',['sit','seat','chair']],['An old magazine','reading to pass the time',['read','magazine']],['A take-a-number ticket','showing your place in the queue',['queue','number','turn','place']]]},
  {t:'Help neighbours on one street actually meet', set:'a quiet residential street', anchor:'neighbour', shape:'house', obj:[['A doormat','wiping your feet',['wipe','feet','shoe']],['A wheelie bin','holding rubbish',['rubbish','trash','waste']],['A letterbox','receiving post',['post','mail','letter']]]},
  {t:'Make a long commute feel shorter', set:'a packed commuter train', anchor:'commute', shape:'train', obj:[['A train grab handle','holding on while standing',['hold','grip','stand']],['A paper ticket','proving you paid',['pay','ticket','travel']],['A pair of earphones','listening to audio',['listen','music','audio']]]},
  {t:'Get teenagers excited about a museum', set:'a museum gallery', anchor:'museum', shape:'frame', obj:[['An audio guide','explaining the exhibits',['explain','listen','guide']],['A velvet rope','keeping people back',['barrier','keep back']],['An exhibit label','describing an object',['describe','read','label']]]},
  {t:'Make grocery shopping less wasteful', set:'a supermarket', anchor:'shopping', shape:'leaf', obj:[['A shopping trolley','carrying groceries',['carry','shop','groceries']],['A price sticker','showing the price',['price','label']],['A paper bag','carrying shopping home',['carry','shopping']]]},
  {t:'Make the first day at a new job less scary', set:"an office on someone's first day", anchor:'office', shape:'key', obj:[['A lanyard','holding your ID badge',['badge','id card']],['A sticky note','jotting a reminder',['note','remind','jot']],['A swivel chair','sitting at a desk',['sit','desk','seat']]]},
  {t:'Help people drink more water', set:'a busy kitchen', anchor:'water', shape:'drop', obj:[['A drinking glass','holding a drink',['drink']],['An ice cube tray','freezing water',['ice','freez']],['A kettle','boiling water',['boil','tea']]]},
  {t:'Make a new language stick', set:'a language class', anchor:'language', shape:'speech', obj:[['A flashcard','memorising words',['memor','learn','study']],['A pocket dictionary','looking up words',['look up','translat']],['A whiteboard marker','writing on a whiteboard',['write on','whiteboard']]]},
  {t:'Help a tiny café stand out on a busy street', set:'a small café', anchor:'coffee', shape:'cup', obj:[['A coffee cup lid','keeping coffee in the cup',['coffee','spill']],['A receipt','proving what you bought',['receipt','proof of']],['A chalkboard sign','showing the menu',['menu']]]},
  {t:'Help friends split the bill without awkwardness', set:'a group dinner', anchor:'dinner', shape:'scales', obj:[['A bill folder','bringing the bill',['bill']],['A paper napkin','wiping your mouth',['wipe','mouth']],['A toothpick','cleaning your teeth',['teeth','tooth']]]},
  {t:'Make a hospital stay less lonely', set:'a hospital ward', anchor:'hospital', shape:'heart', obj:[['A hospital wristband','identifying a patient',['identif','patient']],['A bedside curtain','giving privacy',['privacy']],['A drip stand','holding an IV bag',['iv','drip']]]},
  {t:'Get people to repair things instead of binning them', set:'a repair café', anchor:'repair', shape:'hammer', obj:[['A roll of duct tape','sticking things together',['stick','tape','fix']],['A screwdriver','turning screws',['screw']],['A broken umbrella','keeping the rain off, once',['rain']]]},
  {t:'Make a long-distance friendship feel close', set:'two friends in different cities', anchor:'distance', shape:'arc', obj:[['A postcard','sending a short message',['send a','message']],['A phone charger','charging a phone',['charg','battery']],['A cardboard parcel box','posting a gift',['post','ship','parcel']]]},
  {t:'Make filling in a form actually fun', set:'a government office', anchor:'form', shape:'pencil', obj:[['A rubber stamp','marking a document as approved',['stamp','approv']],['A clipboard','holding paper to write on',['hold paper','write on']],['A ballpoint pen','writing',['write','sign']]]},
  {t:'Help a kid fall asleep on time', set:"a child's bedroom", anchor:'bedtime', shape:'moon', obj:[['A night light','lighting a dark room',['light']],['A pillow','resting your head',['sleep','rest']],['An alarm clock','waking you up',['wake','alarm']]]},
  {t:'Make recycling feel rewarding', set:'a recycling centre', anchor:'recycling', shape:'triangle', obj:[['A glass jar','storing food',['store','jam','food']],['A bottle cap','sealing a bottle',['seal','close a']],['A cardboard tube','holding toilet roll',['toilet']]]},
  {t:'Make a city park feel safer at night', set:'a city park at night', anchor:'park', shape:'tree', obj:[['A park bench','sitting outside',['sit','seat']],['A street lamp','lighting the path',['light']],['A park bin','collecting litter',['litter','rubbish','trash']]]},
  {t:'Help grandparents enjoy new tech', set:"a grandparent's living room", anchor:'grandparent', shape:'phone', obj:[['A TV remote','changing the channel',['channel']],['A pair of reading glasses','reading small print',['read']],['A landline phone','making calls',['call']]]},
  {t:'Make a rainy day in the city something to look forward to', set:'a city street in the rain', anchor:'rain', shape:'umbrella', obj:[['A pair of wellies','keeping feet dry',['dry','wear']],['A bus shelter','keeping dry while you wait',['shelter','dry']],['A raincoat','keeping you dry',['dry','wear']]]},
  {t:'Make the airport security queue enjoyable', set:'an airport security line', anchor:'airport', shape:'plane', obj:[['A plastic security tray','holding your things for the scanner',['scan']],['A boarding pass','getting you on the plane',['board','flight']],['A passport','proving who you are',['identif','prove']]]},
  {t:'Help a local library win back visitors', set:'a public library', anchor:'library', shape:'book', obj:[['A library card','borrowing books',['borrow']],['A bookmark','keeping your page',['page']],['A returns trolley','moving returned books',['return']]]}
];
const THINGS = ['an airport','a dating app','Netflix','a restaurant','a beehive','a public library','a volcano','an orchestra','a casino','a kindergarten','a tattoo','a lighthouse','IKEA','a wedding','a spam email','a vegetable garden','a mixtape','the stock market','a bakery','a city bus','a fairy tale','a gym','a courtroom','an ant colony','a group chat','a podcast','a toothbrush','a video game','a job interview','a coral reef','a flea market','a haircut','a subway map','a birthday party','a newsroom','a hotel lobby','a circus','a theme park'];
const RARE = ['a black hole','a mushroom network','a lullaby','a chess opening','a jazz solo','a heist film','a bonsai tree','an emoji','a sourdough starter','a magic trick','a treasure map','a bee dance','a wedding toast','a migrating flock'];
const OBJECTS = [
  ['A brick','building walls',['wall','build']],['A paperclip','holding sheets of paper together',['paper','clip']],['A shoe','wearing on your foot',['wear','foot']],['An umbrella','keeping the rain off',['rain']],
  ['A spoon','eating soup and cereal',['eat','soup','stir']],['A tennis ball','playing tennis',['tennis']],['An old newspaper','reading the news',['read','news']],['A plastic bottle','holding a drink',['drink']],
  ['A rubber band','holding things in a bundle',['bundle']],['A ladder','climbing up high',['climb']],['A bucket','carrying water',['carry water']],['A candle','giving light',['light']],
  ['A single sock','keeping a foot warm',['foot','wear']],['A coat hanger','hanging clothes',['hang']],['A cardboard box','packing and shipping things',['pack','ship','store']],['An egg carton','holding eggs',['egg']],
  ['A pencil','writing and drawing',['write','draw']],['A bedsheet','covering a bed',['bed','sleep']],['A car tyre','rolling a car along the road',['car','drive']],['A key','opening a lock',['lock','open']],
  ['A mirror','looking at yourself',['look at','reflect']],['A balloon','decorating a party',['party']],['A frying pan','cooking on a stove',['cook','fry']],['A sheet of bubble wrap','protecting parcels',['protect','pack']]
];
const TOOLBOX = [['A spirit level','checking something is flat',['level','flat']],['A tape measure','measuring length',['measur']],['A padlock','locking things',['lock']],['A funnel','pouring liquid into a narrow opening',['pour']],['A magnifying glass','making small things look bigger',['magnif','zoom']],['A whistle','making a loud signal',['signal','referee']]];
const LENSES = [
  ['Shrink it to ant size.','What could an ant, or a tiny machine, do with it?'],['Make it the size of a building.','Who would use it now, and for what?'],
  ['Break it into pieces.','What can each piece do on its own?'],['Forget what it is. Use only its shape.','Where else does that shape turn up?'],
  ['Forget the shape. Think about what it is made of.','What else needs that material?'],['Give it to someone unexpected.','A toddler, a cat, an astronaut, a chef.'],
  ['Send it 500 years into the past.','What would people there think it is for?'],['You have a thousand of them.','What becomes possible with lots?'],
  ['Give it as a gift.','What would it mean to the person who gets it?'],['Make it make a noise.','Hit it, shake it, blow through it.'],
  ['Add water, heat or cold.','What does it do when soaked, burnt or frozen?'],['Use it in a game.','What are the rules?']
];
const WILD = [['Make it alive.','What does it eat, want and fear?'],['Turn it inside out.','What was hidden becomes the point.'],['Make it invisible.','What does it do when nobody can see it?'],['Make it the villain.',"How would it ruin someone's day?"]];
const ANGLES = ['Who waits, and for what?','How does each one earn your trust?','What happens in the first ten seconds?','What makes people leave?','Who works in the background?','How does each one end?',"What's hard to get in each?",'What do people always do there?','How does each one make money?','What goes wrong most often?','Who decides what you see?','What do people pretend about?'];
const ACTIONS = ['Stopped scrolling','Clicked','Bought it','Laughed','Cried','Saved it','Shared it','Kept watching','Something else'];
const MECHS = [
  ['Made me curious','It showed a bit and hid the rest'],['Surprised me',"It wasn't what I expected"],['Everyone loved it','Lots of people clearly liked it'],['Felt urgent','It was only there for a short time, or almost gone'],
  ['Felt like me','I saw myself or my life in it'],['Brought back memories','It reminded me of the past'],['Beautifully made','The care and quality impressed me'],['Funny mix',"Two things that don't belong, put together"],
  ['Looked easy','It promised a quick, easy win'],["Didn't want to miss out",'Skipping it felt like losing something'],['A face drew me in',"Someone's face or eyes caught me"],['Wanted to know more','I had to see what happens next'],
  ['Stood out','It looked different from everything around it'],['My kind of people','It felt made for people like me']
];
const MECHS_ADV = [['The first price set the bar','The first number made the rest look good'],['I had already started',"I'd put in time, so I kept going"],['Catchy','A rhyme or a repeat stuck in my head'],['Made just for me','It felt personal']];
const CATS = {
  'food':'pizza bread apple banana cheese pasta rice soup cake chocolate coffee tea milk egg burger sandwich salad orange lemon grape strawberry sugar salt pepper butter honey taco sushi noodle cookie pie wine beer juice tomato potato carrot onion garlic mango meat fish chicken steak donut pancake cereal popcorn fries curry jam yogurt avocado peach cherry melon',
  'animals':'dog cat lion tiger bear wolf fox horse cow pig sheep goat bird eagle owl fish shark whale dolphin snake frog mouse rabbit elephant giraffe monkey bee ant spider butterfly penguin duck chicken deer zebra octopus crab turtle bat camel parrot squirrel hamster',
  'nature':'tree flower forest river ocean sea lake mountain volcano rain snow cloud sun moon star sky wind storm desert island beach rock stone leaf grass sand wave fire ice earth thunder lightning rainbow cave valley glacier planet galaxy jungle hill waterfall',
  'music':'violin guitar piano drum trumpet flute cello harp song melody orchestra jazz opera choir concert rhythm bass saxophone symphony band microphone',
  'tech':'computer phone laptop internet robot keyboard screen software app email wifi battery camera printer server code algorithm drone satellite tablet website smartphone',
  'politics & society':'democracy election government president law vote parliament freedom justice tax court king queen war peace army nation policy senate protest economy money bank politics',
  'the body':'hand foot head heart eye nose mouth ear brain bone blood skin hair finger knee tooth lung arm leg stomach',
  'home & office':'office desk chair table lamp sofa couch bed door window kitchen pen pencil paper stapler folder meeting boss spoon fork knife plate cup mug bottle clock mirror pillow carpet',
  'transport':'car bus train plane airplane bicycle bike boat ship truck taxi subway rocket helicopter motorcycle road airport station tire engine',
  'colours':'red blue green yellow purple pink black white brown grey gray gold silver',
  'sport & games':'football soccer tennis basketball golf cricket ball goal team swimming running marathon boxing chess',
  'clothing':'shirt hat shoe sock jacket dress scarf glove boot coat jeans tie belt',
  'feelings':'love hate joy fear anger sadness happiness hope envy pride shame grief',
  'places':'school hospital church museum library castle city village prison restaurant hotel market park bridge tower factory farm garden',
  'jobs':'doctor teacher nurse chef pilot farmer lawyer artist soldier police engineer scientist dentist',
  'time':'morning night day week year summer winter spring autumn monday birthday christmas holiday'
};
const LEX = {};
for (const [c, l] of Object.entries(CATS)) for (const w of l.split(' ')) (LEX[w] ||= []).push(c);

const DR = {
  far:{name:'Random Words', kind:'Unrelated words', skill:'range'},
  second:{name:'New Uses', kind:'New uses for an object', skill:'reframe'},
  bridge:{name:'Find the Link', kind:'What two things share', skill:'connect'}
};
const SKILLS = {range:{name:'Range', from:'Random Words', c:'far'}, reframe:{name:'Reuse', from:'New Uses', c:'second'}, connect:{name:'Linking', from:'Find the Link', c:'bridge'}, insight:{name:'Noticing', from:'Noticed', c:'notes'}};
const UNLOCKS = [
  {id:'colors', skill:'range', lvl:2, name:SKIN.colorUnlock[0], desc:SKIN.colorUnlock[1]},
  {id:'wild', skill:'reframe', lvl:2, name:'Stranger hints', desc:'Four wilder hints in New Uses'},
  {id:'rare', skill:'connect', lvl:2, name:'Unusual pairs', desc:'Odd pairs like a black hole or a bee dance in extra Find the Link games'},
  {id:'advhooks', skill:'insight', lvl:2, name:'More reasons', desc:'Four more reasons to pick in Noticed'},
  {id:'toolbox', skill:'reframe', lvl:3, name:'Tool objects', desc:'Six tools to reuse in extra New Uses games'}
];

/* ================= helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const fmt = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const pad3 = n => String(n).padStart(3, '0');
const plural = (n, w, p = w + 's') => `${n} ${n === 1 ? w : p}`;
function mulberry(a){ return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* ================= store ================= */
const KEY = 'sidestep.' + SKIN.name + '.v1';
const blank = () => ({sparks:[], notes:[], ideas:[], days:{}, xp:{range:0, reframe:0, connect:0, insight:0}, weekBest:{}, intro:false});
let S = blank();
try { const r = localStorage.getItem(KEY); if (r) S = Object.assign(blank(), JSON.parse(r)); } catch (e) {}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

/* ================= days & briefs ================= */
const EPOCH = new Date(2026, 0, 1);
const dayKey = (d = new Date()) => { d = new Date(d); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const dayNum = (d = new Date()) => Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - EPOCH) / 864e5);
const mod = (a, n) => ((a % n) + n) % n;
const ORDER = (() => { const r = mulberry(20260926), a = BRIEFS.map((_, i) => i); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; })();
function today(){
  const dn = dayNum(), key = dayKey(), b = BRIEFS[ORDER[mod(dn, BRIEFS.length)]];
  return {dn, key, brief:b, obj:b.obj[mod(dn, 3)], pair:THINGS[mod(dn * 7, THINGS.length)], entry:S.days[key]};
}
const entry = () => { const t = today(); return S.days[t.key] ||= {drills:{}, idea:null, brief:t.brief.t}; };
const drillsDone = e => e ? ['far', 'second', 'bridge'].filter(k => e.drills[k]).length : 0;
const dateLong = () => new Date().toLocaleDateString(undefined, {weekday:'long', day:'numeric', month:'long'});
const shortDate = d => new Date(d).toLocaleDateString(undefined, {day:'numeric', month:'short'});
function weekKey(d){ d = new Date(d); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return dayKey(d); }
function streak(){
  const days = new Set(Object.keys(S.days).filter(k => S.days[k].idea));
  let n = 0; const d = new Date();
  if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function bestStreak(){
  let best = 0, run = 0, prev = null;
  for (const k of Object.keys(S.days).filter(k => S.days[k].idea).sort()) { const d = new Date(k + 'T12:00'); run = prev && Math.round((d - prev) / 864e5) === 1 ? run + 1 : 1; best = Math.max(best, run); prev = d; }
  return best;
}
function untilMidnight(){ const n = new Date(), m = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1), s = Math.floor((m - n) / 1000); return `${Math.floor(s / 3600)}h ${String(Math.floor(s % 3600 / 60)).padStart(2, '0')}m`; }
const bestIds = () => Object.values(S.weekBest);

/* ================= xp ================= */
function lvl(xp){ let L = 1, need = 15; while (xp >= need) { xp -= need; L++; need = 15 * L; } return {L, into:xp, need}; }
const has = id => { const u = UNLOCKS.find(x => x.id === id); return lvl(S.xp[u.skill]).L >= u.lvl; };
function award(g, delay = 500){
  const before = UNLOCKS.filter(u => has(u.id)).map(u => u.id), msgs = [];
  for (const [k, v] of Object.entries(g)) { if (!v) continue; const a = lvl(S.xp[k]).L; S.xp[k] += v; const b = lvl(S.xp[k]).L; if (b > a) msgs.push(`${SKILLS[k].name} is now level ${b}`); }
  UNLOCKS.filter(u => has(u.id) && !before.includes(u.id)).forEach(u => msgs.push(`New: ${u.name}`));
  save();
  msgs.forEach((m, i) => setTimeout(() => toast(m), delay + i * 3800));
  return g;
}
function addSparks(list, drill, daily){
  const date = new Date().toISOString(), day = daily ? dayKey() : null;
  for (const text of list) S.sparks.push({id:uid(), text, drill, date, day});
  save(); World.setSparks(S.sparks.length);
}

/* ================= shell ================= */
const ui = document.createElement('main'); ui.id = 'ui';
const canvas = document.createElement('canvas'); canvas.id = 'world'; canvas.setAttribute('aria-label', SKIN.worldLabel);
const veil = document.createElement('div'); veil.id = 'veil';
const labels = document.createElement('div'); labels.id = 'labels'; labels.setAttribute('aria-hidden', 'true');
const tabbar = document.createElement('nav'); tabbar.className = 'tabbar'; tabbar.setAttribute('aria-label', 'Main');
const toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); toastEl.setAttribute('aria-live', 'polite');
document.body.append(canvas, labels, veil, ui, tabbar, toastEl);

let toastT;
function toast(m){ toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 3600); }

const ICON = {
  world:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-20 12 12)"/></svg>',
  today:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>',
  notes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  gallery:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="7" height="9" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="6" rx="1.5"/><rect x="3.5" y="15.5" width="7" height="5" rx="1.5"/><rect x="13.5" y="12.5" width="7" height="8" rx="1.5"/></svg>',
  profile:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5"/><circle cx="12" cy="12" r="3.5"/></svg>'
};
const TABS = [['world', 'Galaxy'], ['today', 'Today'], ['notes', 'Noticed'], ['gallery', 'Ideas'], ['profile', 'You']];
function renderTabs(cur){
  tabbar.innerHTML = TABS.map(([k, l]) => `<button data-tab="${k}" ${cur === k ? 'aria-current="page"' : ''}>${ICON[k]}<span>${l}</span></button>`).join('');
}
tabbar.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) go(b.dataset.tab); });

let cleanups = [], clock = null, current = 'world';
function stopClock(){ if (clock) clearInterval(clock); clock = null; }
function startClock(el, t0, extra){ stopClock(); const u = () => { if (!document.body.contains(el)) return stopClock(); el.textContent = fmt((Date.now() - t0) / 1000); extra && extra(); }; u(); clock = setInterval(u, 1000); }
const FOCUS = ['drill', 'forge', 'reveal'];
function go(name, p = {}){
  cleanups.forEach(f => f()); cleanups = []; stopClock();
  $$('.modal').forEach(m => m.remove());
  current = name;
  document.body.dataset.screen = name;
  document.body.classList.toggle('focus', FOCUS.includes(name));
  ui.scrollTop = 0;
  World.view(name);
  renderTabs(['drill', 'forge', 'reveal'].includes(name) ? 'today' : name);
  SCREENS[name](p);
}
function listen(target, ev, fn){ target.addEventListener(ev, fn); cleanups.push(() => target.removeEventListener(ev, fn)); }
async function cinematic(p){ document.body.classList.add('cine'); try { await p; } finally { document.body.classList.remove('cine'); } }

/* ================= idea card ================= */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const artHTML = (i, anim) => SKIN.art ? `<canvas class="ic-art" ${anim ? 'data-anim="1" ' : ''}data-art="${i.id}" width="960" height="540" aria-hidden="true"></canvas>` : '';
function ideaCard(i, mini, anim){
  const tags = `<div class="ingredients">${i.sparks.map(s => `<span class="ing">${esc(s)}</span>`).join('')}${i.hook ? `<span class="ing hook">Why it works: ${esc(i.hook.label)}</span>` : ''}</div>`;
  const best = bestIds().includes(i.id) ? `<span class="stat best">★ Favourite</span>` : '';
  if (mini) return `<button class="idea-card mini" data-idea="${i.id}" style="--ic:${SKIN.ideaColors[i.color]}">${artHTML(i)}<div class="ic-body">${best}<div class="ic-top"><span>No. ${pad3(i.n)}</span></div><h3>${esc(i.name)}</h3>${i.who ? `<p class="small">For ${esc(i.who)}</p>` : ''}</div></button>`;
  return `<article class="idea-card tilt" style="--ic:${SKIN.ideaColors[i.color]}">${artHTML(i, anim)}<div class="ic-body">${best}<div class="ic-top"><span>Idea No. ${pad3(i.n)}</span><span>${shortDate(i.date)}</span></div><h2>${esc(i.name)}</h2>${i.who ? `<p><b>For:</b> ${esc(i.who)}</p>` : ''}<p>${esc(i.how)}</p>${tags}<p class="ic-brief">Challenge: ${esc(i.brief)}</p></div></article>`;
}
function paintArts(){
  if (!SKIN.art) return;
  $$('canvas[data-art]:not([data-done])').forEach(c => {
    const i = S.ideas.find(x => x.id === c.dataset.art); if (!i) return;
    c.dataset.done = '1';
    if (!c.dataset.anim || reduceMotion) return SKIN.art(c, i, 1);
    const t0 = performance.now(), D = 3200;
    const step = now => { const k = Math.min(1, (now - t0) / D); SKIN.art(c, i, k); if (k < 1 && document.body.contains(c)) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}
new MutationObserver(paintArts).observe(document.body, {childList:true, subtree:true});
let tiltEl = null;
document.addEventListener('pointermove', e => {
  const c = e.target.closest ? e.target.closest('.tilt') : null;
  if (tiltEl && tiltEl !== c) { ['--rx', '--ry'].forEach(p => tiltEl.style.removeProperty(p)); }
  tiltEl = c; if (!c || reduceMotion) return;
  const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  c.style.setProperty('--ry', ((x - .5) * 7).toFixed(2) + 'deg'); c.style.setProperty('--rx', ((.5 - y) * 5).toFixed(2) + 'deg');
  c.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); c.style.setProperty('--my', (y * 100).toFixed(1) + '%');
});
const ideaText = i => `Idea No. ${pad3(i.n)}: ${i.name}${i.who ? `\nFor: ${i.who}` : ''}\nHow it works: ${i.how}\nMade from: ${i.sparks.join(' / ')}${i.hook ? `\nWhy it works: ${i.hook.label}` : ''}\nChallenge: ${i.brief}\n(Sidestep)`;
function copy(text){
  const fallback = () => { const m = document.createElement('div'); m.className = 'modal'; m.innerHTML = `<div class="panel modal-card"><h3>Copy this text</h3><textarea class="copybox" readonly>${esc(text)}</textarea><div class="row end"><button class="btn primary">Done</button></div></div>`; document.body.append(m); const ta = $('textarea', m); ta.focus(); ta.select(); $('button', m).onclick = () => m.remove(); };
  try { navigator.clipboard.writeText(text).then(() => toast('Copied'), fallback); } catch (e) { fallback(); }
}
function openIdea(id){
  const i = S.ideas.find(x => x.id === id); if (!i) return;
  $$('.modal').forEach(m => m.remove());
  const m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-label="${esc(i.name)}">${ideaCard(i)}<div class="row"><button class="btn primary" data-a="world">See it in my ${SKIN.worldWord}</button><button class="btn" data-a="copy">Copy text</button><button class="btn ghost" data-a="close">Close</button></div></div>`;
  document.body.append(m);
  const close = () => { m.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  m.addEventListener('click', e => {
    const a = e.target.closest('[data-a]');
    if (e.target === m || (a && a.dataset.a === 'close')) return close();
    if (!a) return;
    if (a.dataset.a === 'copy') copy(ideaText(i));
    if (a.dataset.a === 'world') { close(); go('world'); World.focus(i.id); showPop(i.id); }
  });
  $('[data-a="world"]', m).focus();
}

/* ================= WORLD ================= */
function progress(e){
  const d = e ? e.drills : {};
  const seg = (k, l) => `<span class="${d[k] ? 'on' : ''}">${l}</span>`;
  return `<div class="prog">${seg('far', 'Words')}${seg('second', 'Uses')}${seg('bridge', 'Link')}<span class="${e && e.idea ? 'on' : ''}">Idea</span></div>`;
}
function scrWorld(){
  const t = today(), e = t.entry, fin = !!(e && e.idea), can = S.sparks.length >= 2;
  const main = fin ? ["See today's idea", 'open'] : can ? ['Create an idea', 'forge'] : ["Play today's games", 'today'];
  const second = fin ? (can ? ['Create another', 'forge'] : null) : can ? ['Play games', 'today'] : null;
  ui.innerHTML = `
    <div class="w-top"><div class="brand">${SKIN.logo}<span>Sidestep</span></div>
      <div class="row"><span class="stat">${plural(S.ideas.length, 'idea')}</span><span class="stat">${plural(S.sparks.length, 'spark')}</span></div></div>
    <div class="w-bottom">
      <p class="w-hint">${S.ideas.length ? SKIN.worldHint : SKIN.worldEmpty}</p>
      <div class="pop" id="pop"></div>
      <div class="panel w-card">
        <p class="eyebrow">${fin ? 'Done for today' : "Today's challenge"} · ${dateLong()}</p>
        <h2>${esc(t.brief.t)}</h2>
        ${progress(e)}
        <div class="row"><button class="btn primary grow" data-w="${main[1]}">${main[0]}</button>${second ? `<button class="btn" data-w="${second[1]}">${second[0]}</button>` : ''}</div>
      </div>
    </div>
    ${S.intro ? '' : `<div class="intro-wrap"><div class="panel intro" role="dialog" aria-modal="true" aria-labelledby="in-t">
      <p class="eyebrow">Welcome</p><h2 id="in-t">${SKIN.introTitle}</h2>
      <ol class="how"><li><span><b>Play quick games.</b> Every answer you type is a spark.</span></li>
      <li><span><b>Create an idea.</b> Pick 2 or 3 sparks and turn them into something new.</span></li>
      <li><span><b>Watch it grow.</b> ${SKIN.introGrow}</span></li></ol>
      <p class="help">No AI. Just you. Take your time.</p>
      <div class="row"><button class="btn primary grow" id="in-go">Let's start</button><button class="btn ghost" id="in-look">Look around first</button></div></div></div>`}`;
  $$('[data-w]').forEach(b => b.onclick = () => { const w = b.dataset.w; if (w === 'open') openIdea(e.idea); else go(w); });
  if (!S.intro) {
    $('#in-go').focus();
    const done = () => { S.intro = true; save(); };
    $('#in-go').onclick = () => { done(); go('today'); };
    $('#in-look').onclick = () => { done(); $('.intro-wrap').remove(); };
  }
}
function showPop(id){
  const i = S.ideas.find(x => x.id === id), pop = $('#pop'); if (!i || !pop) return;
  pop.innerHTML = `<div class="panel pop-card"><div class="row"><div class="grow"><p class="eyebrow">Idea No. ${pad3(i.n)}</p><h3>${esc(i.name)}</h3></div><button class="x" id="pop-x" aria-label="Close">✕</button></div>${i.who ? `<p class="small">For ${esc(i.who)}</p>` : ''}<div class="row"><button class="btn sm primary" id="pop-open">See idea</button></div></div>`;
  const hint = $('.w-hint'); if (hint) hint.hidden = true;
  $('#pop-x').onclick = () => { pop.innerHTML = ''; if (hint) hint.hidden = false; World.focus(null); };
  $('#pop-open').onclick = () => openIdea(id);
}

/* ================= TODAY ================= */
function scrToday(){
  const t = today(), e = t.entry || {drills:{}}, fin = !!e.idea, can = S.sparks.length >= 2;
  const todaySp = S.sparks.filter(s => s.day === t.key).length;
  const idea = fin ? S.ideas.find(i => i.id === e.idea) : null;
  const drill = (k, title, sub) => { const d = e.drills[k];
    return `<li class="step ${d ? 'is-done' : ''}"><span class="num">${d ? '✓' : ''}</span><div class="grow"><h3>${title}</h3><p class="help">${sub}</p></div>${d ? `<span class="stat">${plural(d, 'spark')}</span>` : `<button class="btn sm" data-drill="${k}">Start</button>`}</li>`; };
  ui.innerHTML = `<div class="page">
    <header class="d-head"><p class="eyebrow">Today's challenge · ${dateLong()}</p><h1>${esc(t.brief.t)}</h1><p class="help">Everyone gets the same challenge today. Play any game to collect sparks. Then create an idea when you're ready.</p></header>
    <div class="panel"><div class="row"><div class="grow" style="display:grid;gap:4px"><h3>${fin ? 'Create another idea' : 'Create an idea'}</h3><p class="help">${can ? `You have ${plural(S.sparks.length, 'spark')} to use${todaySp ? `, ${todaySp} from today` : ''}.` : 'You need 2 sparks. Play any game below. It takes about a minute.'}</p></div><button class="btn primary" id="t-forge" ${can ? '' : 'disabled'}>Create</button></div></div>
    ${idea ? `<div class="panel"><p class="eyebrow">Today's idea</p>${ideaCard(idea, true)}</div>` : ''}
    <div class="panel"><p class="eyebrow">Games for today's challenge</p>
      <ul class="steps">
        ${drill('far', 'Random Words', `Start with “${esc(t.brief.anchor)}”. Add 10 words that have nothing to do with each other.`)}
        ${drill('second', 'New Uses', `${esc(t.obj[0])}. Think of new ways to use it.`)}
        ${drill('bridge', 'Find the Link', `What does ${esc(t.brief.set)} have in common with something totally different?`)}
      </ul></div>
    <div class="panel"><h3>Play more</h3><p class="help">Random words, objects and pairs. Every spark is saved.</p>
      <div class="row"><button class="btn sm" data-free="far">Random Words</button><button class="btn sm" data-free="second">New Uses</button><button class="btn sm" data-free="bridge">Find the Link</button><button class="btn sm ghost" id="t-notes">Add something you noticed</button></div></div>
  </div>`;
  $$('[data-drill]').forEach(b => b.onclick = () => go('drill', {type:b.dataset.drill, mode:'daily'}));
  $$('[data-free]').forEach(b => b.onclick = () => go('drill', {type:b.dataset.free, mode:'free'}));
  $('#t-notes').onclick = () => go('notes');
  $('#t-forge').onclick = () => go('forge');
  $$('[data-idea]').forEach(b => b.onclick = () => openIdea(b.dataset.idea));
}

/* ================= DRILLS ================= */
function drillShell(type, mode, title, help, dirty){
  const D = DR[type], idx = {far:1, second:2, bridge:3}[type];
  ui.innerHTML = `<div class="page" style="--c:var(--c-${type});--on-c:var(--on-${type})">
    <div class="row"><button class="btn sm ghost" id="d-back">← Back</button><span class="grow"></span><span class="stat clock" id="clock">0:00</span></div>
    <header class="d-head"><p class="eyebrow">${mode === 'daily' ? `Game ${idx} of 3` : 'Extra game'} · ${D.name}</p>${title}<p class="help">${help}</p></header>
    <div id="stage" class="stage"></div></div>`;
  const back = () => {
    const n = dirty();
    if (!n) return go('today');
    $('#d-back').outerHTML = `<span class="small" id="d-leave">Leave now? You'll lose ${plural(n, 'answer')}. <button class="linkish" id="d-yes">Leave</button> · <button class="linkish" id="d-no">Stay</button></span>`;
    $('#d-yes').onclick = () => go('today');
    $('#d-no').onclick = () => { $('#d-leave').outerHTML = '<button class="btn sm ghost" id="d-back">← Back</button>'; $('#d-back').onclick = back; };
  };
  $('#d-back').onclick = back;
}
function dots(n, of){ let h = ''; for (let i = 0; i < of; i++) h += `<i class="${i < n ? 'on' : ''}"></i>`; return `<div class="dots" aria-label="${n} of ${of}">${h}<span>${n} / ${of}</span></div>`; }
function result(type, mode, n, label, line){
  const e = S.days[dayKey()] || {drills:{}}, next = ['far', 'second', 'bridge'].find(k => !e.drills[k]);
  const btns = mode === 'daily'
    ? (next ? `<button class="btn primary" id="r-next">Next game: ${DR[next].name} →</button><button class="btn" id="r-forge">Create an idea now</button>` : `<button class="btn primary" id="r-next">Create an idea →</button>`) + `<button class="btn ghost" id="r-today">Back</button>`
    : `<button class="btn primary" id="r-again">Play again</button><button class="btn ghost" id="r-today">Back</button>`;
  $('#stage').innerHTML = `<div class="panel"><div class="result"><div class="stamp"><div><b>${n}</b><span>${label}</span></div></div>
    <div style="display:grid;gap:12px"><h2>${line}</h2><p class="help">${plural(n, 'new spark')}, saved.</p><div class="row">${btns}</div></div></div></div>`;
  $('#stage').previousElementSibling.querySelector('.help').hidden = true;
  $('#d-back').onclick = () => go('today');
  const rf = $('#r-forge'); if (rf) rf.onclick = () => go('forge');
  const nx = $('#r-next'); if (nx) nx.onclick = () => next ? go('drill', {type:next, mode:'daily'}) : go('forge');
  const ag = $('#r-again'); if (ag) ag.onclick = () => go('drill', {type, mode:'free'});
  $('#r-today').onclick = () => go('today');
  stopClock();
}
function scrDrill(p){
  const e = S.days[dayKey()];
  if (p.mode === 'daily' && e && e.drills[p.type]) return go('today');
  ({far:drillFar, second:drillSecond, bridge:drillBridge})[p.type](p.mode);
}

/* ---- Far Apart ---- */
function norm(w){
  w = w.toLowerCase().trim().replace(/[^a-z\s-]/g, '').replace(/\s+/g, '');
  if (LEX[w]) return w;
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if (w.endsWith('es') && LEX[w.slice(0, -2)]) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) return w.slice(0, -1);
  return w;
}
function relate(a, b){
  const A = norm(a), B = norm(b);
  if (A.length >= 3 && B.length >= 3 && (A.includes(B) || B.includes(A))) return 'similar words';
  const ca = LEX[A] || [], cb = LEX[B] || [], c = ca.find(x => cb.includes(x));
  return c ? `both are ${c}` : null;
}
function drillFar(mode){
  const t = today(), anchor = mode === 'daily' ? t.brief.anchor : null;
  const st = {words:[], meta:{}, t0:Date.now()};
  drillShell('far', mode, '<h1>10 words. Nothing in common.</h1>',
    (anchor ? `Start with <b>“${esc(anchor)}”</b>. ` : '') + "Type words that have nothing to do with each other, like <i>volcano, violin, pizza</i>. If two words are too alike, a dashed line shows up so you can swap one.",
    () => st.words.length);
  $('#stage').innerHTML = `<div id="dots"></div>
    <div class="field" id="field"><svg class="lines" id="lines" aria-hidden="true"></svg><div class="cloud" id="cloud"></div><p class="field-empty" id="fe">${anchor ? '' : 'Your words appear here.'}</p></div>
    <div class="warns" id="warns" aria-live="polite"></div>
    <form class="entry" id="entry" autocomplete="off"><label for="far-in" class="sr">Next word</label><input class="input" id="far-in" maxlength="28" placeholder="Type a word and press Enter"><button class="btn primary" id="far-add">Add</button></form>
    <div class="row"><p class="small grow">We only catch obvious pairs, like sun and moon. You decide the rest.</p><button class="btn primary" id="far-done" disabled>Finish</button></div>`;
  startClock($('#clock'), st.t0);
  const input = $('#far-in'); input.focus();
  const all = () => anchor ? [anchor, ...st.words] : st.words;
  const pairs = () => { const a = all(), out = []; for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) { const r = relate(a[i], a[j]); if (r) out.push([i, j, r]); } return out; };
  function lines(){
    const f = $('#field'), svg = $('#lines'); if (!f) return;
    const fr = f.getBoundingClientRect(), els = $$('.word', f);
    svg.setAttribute('viewBox', `0 0 ${fr.width} ${fr.height}`);
    svg.innerHTML = pairs().map(([i, j]) => { const a = els[i].getBoundingClientRect(), b = els[j].getBoundingClientRect();
      return `<line x1="${a.left + a.width / 2 - fr.left}" y1="${a.top + a.height / 2 - fr.top}" x2="${b.left + b.width / 2 - fr.left}" y2="${b.top + b.height / 2 - fr.top}" stroke="var(--danger)" stroke-width="2.5" stroke-dasharray="6 6" stroke-linecap="round"/>`; }).join('');
  }
  listen(window, 'resize', lines);
  function draw(newest){
    const P = pairs(), near = new Set(P.flatMap(p => [p[0], p[1]])), off = anchor ? 1 : 0;
    $('#fe').hidden = all().length > 0;
    $('#cloud').innerHTML = (anchor ? `<span class="word anchor" style="font-size:1.1rem">${esc(anchor)}</span>` : '') + st.words.map((w, i) => { const m = st.meta[w];
      return `<span class="word${near.has(i + off) ? ' near' : ''}${w === newest ? ' new' : ''}" style="--wc:var(--w${m.c});--won:var(--on-w${m.c});font-size:${m.size}rem;transform:rotate(${m.rot}deg) translateY(${m.dy}px)">${esc(w)}<button type="button" data-rm="${i}" aria-label="Remove ${esc(w)}">✕</button></span>`; }).join('');
    const a = all();
    $('#warns').innerHTML = P.map(([i, j, r]) => `<div class="warn"><span><b>${esc(a[i])}</b> and <b>${esc(a[j])}</b> are too alike (${r}). ${i === 0 && anchor ? `Try swapping <b>${esc(a[j])}</b>.` : 'Try swapping one.'}</span></div>`).join('');
    $('#dots').innerHTML = dots(st.words.length, 10);
    const full = st.words.length >= 10;
    input.disabled = full; $('#far-add').disabled = full;
    input.placeholder = full ? 'All 10 done. Swap a word, or tap Finish.' : 'Type a word and press Enter';
    $('#far-done').disabled = !full;
    requestAnimationFrame(lines); setTimeout(lines, 520);
  }
  draw();
  $('#entry').onsubmit = ev => {
    ev.preventDefault();
    const w = input.value.trim().replace(/\s+/g, ' '); if (!w) return;
    if (w.split(' ').length > 2) return toast('One word at a time. Two is OK, like "ice cream".');
    if (all().some(x => norm(x) === norm(w))) return toast(`"${w}" is already here.`);
    st.meta[w] = {c:st.words.length % 4 + 1, rot:(Math.random() * 8 - 4).toFixed(1), size:(1.05 + Math.random() * .55).toFixed(2), dy:Math.round(Math.random() * 20 - 10)};
    st.words.push(w); input.value = ''; World.spark('far'); draw(w); if (!input.disabled) input.focus();
  };
  $('#cloud').onclick = ev => { const b = ev.target.closest('[data-rm]'); if (!b) return; st.words.splice(+b.dataset.rm, 1); draw(); input.focus(); };
  $('#far-done').onclick = () => {
    const near = pairs().length, words = st.words.slice();
    addSparks(words, 'far', mode === 'daily');
    if (mode === 'daily') { entry().drills.far = words.length; save(); }
    award({range:words.length + (near === 0 ? 5 : 0)});
    result('far', mode, words.length, 'sparks', near === 0 ? 'Great spread. No close pairs.' : near <= 2 ? 'Nice spread, with a couple of close ones.' : 'Some words were quite alike. Try jumping further next time.');
  };
}

/* ---- Second Life ---- */
function drillSecond(mode){
  const t = today();
  const pool = OBJECTS.concat(has('toolbox') ? TOOLBOX : []);
  const st = {obj:mode === 'daily' ? t.obj : pick(pool), uses:[], lens:null, deck:shuffle(LENSES.concat(has('wild') ? WILD : [])), lp:0, t0:Date.now(), last:Date.now(), used:new Set()};
  const head = () => `<div class="object"><h1 id="obj-name">${esc(st.obj[0])}</h1><p class="usually" id="usually">Usually used for <s>${esc(st.obj[1])}</s>. What else could it do?</p></div>`;
  drillShell('second', mode, head(), 'Think of new ways to use it. Silly ideas count. Add at least 5, and try for 10.', () => st.uses.length);
  $('#stage').innerHTML = `<div class="row"><div id="dots"></div><span class="grow"></span>${mode === 'free' ? '<button class="btn sm" id="reroll">Try another object</button>' : ''}</div>
    <div id="lens-slot"></div>
    <ol class="uses" id="uses"></ol>
    <form class="entry" id="entry" autocomplete="off"><label for="use-in" class="sr">A new use</label><input class="input" id="use-in" maxlength="120" placeholder="Use it as…"><button class="btn primary">Add</button></form>
    <div class="row end"><button class="btn primary" id="done" disabled>Finish</button></div>`;
  const input = $('#use-in'); input.focus();
  startClock($('#clock'), st.t0, () => { const b = $('#lens-btn'); if (b) b.classList.toggle('pulse', Date.now() - st.last > 20000); });
  function drawLens(){
    const slot = $('#lens-slot');
    if (!st.lens) { slot.innerHTML = `<button class="btn" id="lens-btn">Stuck? Get a hint</button>`; $('#lens-btn').onclick = nextLens; return; }
    slot.innerHTML = `<div class="lens" aria-live="polite"><span class="eyebrow" style="color:inherit;opacity:.8">Hint</span><b>${esc(st.lens[0])}</b><span>${esc(st.lens[1])}</span><div class="row"><button class="btn sm" id="lens-next">Another hint</button><button class="btn sm" id="lens-off">Hide hint</button></div></div>`;
    $('#lens-next').onclick = nextLens; $('#lens-off').onclick = () => { st.lens = null; drawLens(); input.focus(); };
  }
  function nextLens(){ st.lens = st.deck[st.lp++ % st.deck.length]; st.last = Date.now(); drawLens(); input.focus(); }
  function draw(){
    $('#dots').innerHTML = dots(Math.min(st.uses.length, 10), 10);
    $('#uses').innerHTML = st.uses.map((u, i) => `<li><span class="n">${i + 1}</span><span class="t">${esc(u.text)}</span>${u.lens ? '<span class="tag">hint</span>' : ''}<button class="x" data-rm="${i}" aria-label="Remove">✕</button></li>`).join('');
    $('#done').disabled = st.uses.length < 5;
    $('#done').textContent = st.uses.length < 5 ? `Finish (${5 - st.uses.length} more to go)` : 'Finish';
    const r = $('#reroll'); if (r) r.hidden = st.uses.length > 0;
  }
  draw(); drawLens();
  const r = $('#reroll');
  if (r) r.onclick = () => { let o; do { o = pick(pool); } while (o === st.obj); st.obj = o; $('#obj-name').textContent = o[0]; $('#usually').innerHTML = `Usually used for <s>${esc(o[1])}</s>. What else could it do?`; input.focus(); };
  $('#entry').onsubmit = ev => {
    ev.preventDefault();
    const v = input.value.trim(); if (!v) return; const n = v.toLowerCase();
    if (st.uses.some(u => u.text.toLowerCase() === n)) return toast('You already added that.');
    if (st.obj[2].some(k => n.includes(k))) toast("That's close to what it's normally for. It counts, but try something new.");
    st.uses.push({text:v, lens:st.lens ? st.lens[0] : null}); if (st.lens) st.used.add(st.lens[0]);
    st.last = Date.now(); input.value = ''; World.spark('second'); draw(); input.focus();
  };
  $('#uses').onclick = ev => { const b = ev.target.closest('[data-rm]'); if (b) { st.uses.splice(+b.dataset.rm, 1); draw(); } };
  $('#done').onclick = () => {
    const name = st.obj[0].replace(/^(A|An|The) /, '').replace(/^pair of /, '');
    addSparks(st.uses.map(u => `${cap(name)} as ${u.text.replace(/^(use it |used )?as /i, '')}`), 'second', mode === 'daily');
    if (mode === 'daily') { entry().drills.second = st.uses.length; save(); }
    award({reframe:st.uses.length + st.used.size});
    result('second', mode, st.uses.length, 'new uses', st.uses.length >= 10 ? 'Ten or more. You went past the obvious.' : 'Nice. The unusual ideas often come after the first few.');
  };
}

/* ---- Bridge ---- */
function drillBridge(mode){
  const t = today();
  const pool = THINGS.concat(has('rare') ? RARE : []);
  const st = {links:[], t0:Date.now(), angles:shuffle(ANGLES), ap:-1};
  if (mode === 'daily') { st.a = t.brief.set; st.b = t.pair; } else { [st.a, st.b] = shuffle(pool); }
  drillShell('bridge', mode, '<h1>What do these two have in common?</h1>',
    'Look past the obvious. For example, an airport and a dating app both make you wait before the good part. Add at least 3, and try for 5.', () => st.links.length);
  const pairHTML = () => `<div class="pair"><div class="side a">${esc(cap(st.a))}</div><span class="x-mark">×</span><div class="side b">${esc(cap(st.b))}</div></div>`;
  $('#stage').innerHTML = `<div id="pair">${pairHTML()}</div>
    <div class="row"><div id="dots"></div><span class="grow"></span>${mode === 'free' ? '<button class="btn sm" id="reroll">Try another pair</button>' : ''}</div>
    <div class="angle"><q id="angle-q">Stuck? Get a question to think about.</q><button class="btn sm" id="angle-btn">Get a hint</button></div>
    <ul class="links" id="links"></ul>
    <form class="entry" id="entry" autocomplete="off"><label for="link-in" class="sr">A shared trait</label><input class="input" id="link-in" maxlength="200" placeholder="Both…"><button class="btn primary">Add</button></form>
    <div class="row end"><button class="btn primary" id="done" disabled>Finish</button></div>`;
  startClock($('#clock'), st.t0);
  const input = $('#link-in'); input.focus();
  function draw(){
    $('#dots').innerHTML = dots(Math.min(st.links.length, 5), 5);
    $('#links').innerHTML = st.links.map((l, i) => `<li><span class="t">${esc(l)}</span><button class="x" data-rm="${i}" aria-label="Remove">✕</button></li>`).join('');
    $('#done').disabled = st.links.length < 3;
    $('#done').textContent = st.links.length < 3 ? `Finish (${3 - st.links.length} more to go)` : 'Finish';
    const r = $('#reroll'); if (r) r.hidden = st.links.length > 0;
  }
  draw();
  const r = $('#reroll'); if (r) r.onclick = () => { [st.a, st.b] = shuffle(pool); $('#pair').innerHTML = pairHTML(); input.focus(); };
  $('#angle-btn').onclick = () => { st.ap = (st.ap + 1) % st.angles.length; $('#angle-q').textContent = st.angles[st.ap]; $('#angle-btn').textContent = 'Another hint'; input.focus(); };
  $('#entry').onsubmit = ev => { ev.preventDefault(); const v = input.value.trim(); if (!v) return; st.links.push(v); input.value = ''; World.spark('bridge'); draw(); input.focus(); };
  $('#links').onclick = ev => { const b = ev.target.closest('[data-rm]'); if (b) { st.links.splice(+b.dataset.rm, 1); draw(); } };
  $('#done').onclick = () => {
    addSparks(st.links.map(l => `${cap(st.a)} × ${st.b}: ${l}`), 'bridge', mode === 'daily');
    if (mode === 'daily') { entry().drills.bridge = st.links.length; save(); }
    award({connect:st.links.length * 2});
    result('bridge', mode, st.links.length, 'links', st.links.length >= 5 ? 'Five or more links. Great eye.' : 'Nice. You found what they share.');
  };
}

/* ================= FORGE ================= */
let forge = {sparks:new Set(), hook:null, draft:{name:'', who:'', how:''}};
function hookOf(h){
  if (!h) return null;
  if (h.type === 'note') { const n = S.notes.find(x => x.id === h.id); if (!n) return null; return {label:n.mechs[0] || n.own || 'Something I noticed', detail:n.what, note:true}; }
  const m = MECHS.concat(MECHS_ADV).find(x => x[0] === h.name); return m ? {label:m[0], detail:m[1], note:false} : null;
}
function scrForge(){
  if (S.sparks.length < 2) { toast('You need 2 sparks first. Play a game to get some.'); return go('today'); }
  const t = today();
  const todays = S.sparks.filter(s => s.day === t.key);
  const older = S.sparks.filter(s => s.day !== t.key).slice(-40).reverse();
  const chip = s => `<button type="button" class="chip" data-sp="${s.id}" aria-pressed="${forge.sparks.has(s.id)}">${esc(s.text)}</button>`;
  const group = k => { const l = todays.filter(s => s.drill === k); return l.length ? `<p class="group-l">${DR[k].name}</p><div class="chips">${l.map(chip).join('')}</div>` : ''; };
  const notes = S.notes.slice().reverse().slice(0, 10);
  const hk = (attr, on, label, title) => `<button type="button" class="chip" ${attr} aria-pressed="${on}" title="${esc(title)}">${esc(label)}</button>`;
  const mechChips = MECHS.concat(has('advhooks') ? MECHS_ADV : []).map(([m, d]) => hk(`data-mech="${esc(m)}"`, !!(forge.hook && forge.hook.type === 'mech' && forge.hook.name === m), m, d)).join('');
  const d = forge.draft;
  ui.innerHTML = `<div class="page">
    <div class="row"><button class="btn sm ghost" data-back>← Back</button></div>
    <header class="d-head"><p class="eyebrow">Create · ${esc(t.brief.t)}</p><h1>Turn your sparks into an idea.</h1><p class="help">Choose 2 or 3 sparks, pick what will make people notice, then describe your idea.</p></header>
    <section class="panel"><div class="row"><h3 class="grow">1. Choose 2 or 3 sparks</h3><span class="stat" id="f-n">0 picked</span></div>
      ${todays.length ? group('far') + group('second') + group('bridge') : ''}
      ${older.length ? (todays.length ? `<details><summary>Older sparks (${older.length})</summary><div class="chips">${older.map(chip).join('')}</div></details>` : `<p class="group-l">Your sparks</p><div class="chips">${older.map(chip).join('')}</div>`) : ''}</section>
    <section class="panel"><div class="row"><h3 class="grow">2. What will make people notice it?</h3><button type="button" class="btn sm ghost" id="f-note">+ Add something you noticed</button></div>
      <p class="small" id="f-hook-d">Pick one reason people will care.</p>
      ${notes.length ? `<p class="group-l">From things you noticed</p><div class="chips">${notes.map(n => hk(`data-note="${n.id}"`, !!(forge.hook && forge.hook.type === 'note' && forge.hook.id === n.id), n.mechs[0] || n.own || 'Something I noticed', n.what)).join('')}</div><details><summary>More reasons</summary><div class="chips">${mechChips}</div></details>`
      : `<div class="chips">${mechChips}</div>`}</section>
    <section class="panel form"><h3>3. Describe your idea</h3>
      <div class="f"><label class="lbl" for="s-name">Give it a name</label><input class="input" id="s-name" maxlength="60" placeholder="e.g. ${esc(SKIN.examples[0])}" value="${esc(d.name)}"></div>
      <div class="f"><label class="lbl" for="s-how">How does it work?</label><textarea id="s-how" rows="3" maxlength="600" placeholder="e.g. ${esc(SKIN.examples[2])}">${esc(d.how)}</textarea></div>
      <div class="f"><label class="lbl" for="s-who">Who is it for? <span class="small">(optional)</span></label><input class="input" id="s-who" maxlength="120" placeholder="e.g. ${esc(SKIN.examples[1])}" value="${esc(d.who)}"></div>
    </section>
    <div class="panel forge-bar"><span class="count" id="f-count"></span><button class="btn primary" id="f-go" disabled>Create it</button></div>
  </div>`;
  $('[data-back]').onclick = () => go('today');
  forge.sparks = new Set([...forge.sparks].filter(id => S.sparks.some(s => s.id === id)));
  const upd = () => {
    const n = forge.sparks.size, h = hookOf(forge.hook);
    const name = $('#s-name').value.trim(), how = $('#s-how').value.trim();
    forge.draft = {name:$('#s-name').value, how:$('#s-how').value, who:$('#s-who').value};
    $('#f-n').textContent = `${n} picked`;
    if (h) $('#f-hook-d').textContent = `${h.label}: ${h.detail}`;
    const need = n < 2 ? `Choose ${2 - n} more spark${2 - n === 1 ? '' : 's'}` : !h ? 'Pick a reason people will notice' : !name ? 'Give it a name' : how.length < 12 ? 'Say how it works' : 'Ready!';
    $('#f-count').textContent = need;
    $('#f-go').disabled = need !== 'Ready!';
  };
  upd();
  ['#s-name', '#s-how', '#s-who'].forEach(s => $(s).addEventListener('input', upd));
  ui.onclick = ev => {
    const sp = ev.target.closest('[data-sp]');
    if (sp) { const id = sp.dataset.sp; if (forge.sparks.has(id)) forge.sparks.delete(id); else { if (forge.sparks.size >= 3) return toast('You can pick up to 3. Remove one first.'); forge.sparks.add(id); }
      $$(`[data-sp="${id}"]`).forEach(b => b.setAttribute('aria-pressed', forge.sparks.has(id))); upd(); return; }
    const c = ev.target.closest('[data-note],[data-mech]');
    if (c) { forge.hook = c.dataset.note ? {type:'note', id:c.dataset.note} : {type:'mech', name:c.dataset.mech};
      $$('[data-note],[data-mech]').forEach(b => b.setAttribute('aria-pressed', b === c)); upd(); }
  };
  cleanups.push(() => { ui.onclick = null; });
  $('#f-note').onclick = () => go('notes', {back:'forge'});
  $('#f-go').onclick = async () => {
    const sp = [...forge.sparks].map(id => S.sparks.find(s => s.id === id)).filter(Boolean), h = hookOf(forge.hook);
    if (sp.length < 2 || !h) return;
    $('#f-go').disabled = true;
    const colors = has('colors') ? SKIN.ideaColors.length : 4, e = entry();
    const idea = {id:uid(), n:S.ideas.length + 1, name:$('#s-name').value.trim(), who:$('#s-who').value.trim(), how:$('#s-how').value.trim(),
      sparks:sp.map(s => s.text), hook:h, brief:t.brief.t, shape:t.brief.shape, date:new Date().toISOString(), color:S.ideas.length % colors};
    S.ideas.push(idea); if (!e.idea) e.idea = idea.id; save();
    const g = {range:0, reframe:0, connect:0, insight:h.note ? 4 : 0};
    sp.forEach(s => { g[DR[s.drill].skill] += 3; });
    award(g, 12000);
    forge = {sparks:new Set(), hook:null, draft:{name:'', who:'', how:''}};
    await cinematic(World.forge(idea.sparks, h.label));
    go('reveal', {id:idea.id});
  };
}

/* ================= REVEAL ================= */
function scrReveal(p){
  const i = S.ideas.find(x => x.id === p.id); if (!i) return go('world');
  ui.innerHTML = `<div class="page reveal">
    <p class="eyebrow r-a">${SKIN.revealEyebrow}</p>
    ${ideaCard(i, false, true)}
    <div class="row r-b"><button class="btn primary grow" id="r-place">${SKIN.placeLabel}</button><button class="btn ghost" id="r-copy">Copy text</button></div>
  </div>`;
  $('#r-copy').onclick = () => copy(ideaText(i));
  $('#r-place').onclick = async () => {
    $('#r-place').disabled = true;
    await cinematic(World.place(i));
    go('world'); World.focus(i.id); showPop(i.id);
    setTimeout(() => toast(`“${i.name}” is now in your ${SKIN.worldWord}`), 600);
  };
}

/* ================= skill rings ================= */
function ring(k, size = 92){
  const {L, into, need} = lvl(S.xp[k]), r = 38, c = 2 * Math.PI * r, f = into / need;
  return `<div class="ring"><div class="ring-wrap"><svg viewBox="0 0 92 92" style="width:${size}px;height:${size}px" aria-hidden="true"><circle cx="46" cy="46" r="${r}" fill="none" stroke="var(--track)" stroke-width="7"/><circle cx="46" cy="46" r="${r}" fill="none" stroke="var(--ring, var(--c-${SKILLS[k].c}))" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - f)}"/></svg><span class="lv">${L}</span></div><span class="nm">${SKILLS[k].name}</span><span class="sub">${into}/${need} to level ${L + 1}</span></div>`;
}

/* ================= NOTES ================= */
function scrNotes(p){
  const F = {action:null, mechs:[]};
  const mechs = MECHS.concat(has('advhooks') ? MECHS_ADV : []);
  ui.innerHTML = `<div class="page" style="max-width:1040px">
    ${p.back === 'forge' ? '<div class="row"><button class="btn sm ghost" data-back>← Back to your idea</button></div>' : ''}
    <header class="d-head" style="max-width:720px"><p class="eyebrow">Noticed</p><h1>What caught your eye?</h1><p class="help">Did something make you stop, click, laugh or buy? Write down what it was and why it worked. You can use it later when you create an idea.</p></header>
    <div class="why-grid">
      <form class="panel form" id="why" novalidate autocomplete="off">
        <div class="f"><label class="lbl" for="n-what">What caught your eye?</label><input class="input" id="n-what" maxlength="160" placeholder="e.g. A video that showed the ending first"></div>
        <div class="f"><span class="lbl" id="mech-l">Why did it work on you?</span>
          <div class="chips" role="group" aria-labelledby="mech-l" id="mechs">${mechs.map(([m, d]) => `<button type="button" class="chip" aria-pressed="false" data-m="${esc(m)}" title="${esc(d)}">${esc(m)}</button>`).join('')}</div>
          <p class="small" id="mech-d">Pick up to 2, or write your own.</p>
          <label class="sr" for="n-own">In my own words</label><input class="input" id="n-own" maxlength="200" placeholder="Or say it in your own words…"></div>
        <details id="more"><summary>Add more (optional)</summary>
          <div class="form" style="margin-top:6px">
            <div class="f"><span class="lbl" id="act-l">What did you do?</span><div class="chips" role="group" aria-labelledby="act-l" id="acts">${ACTIONS.map(a => `<button type="button" class="chip" aria-pressed="false" data-a="${esc(a)}">${esc(a)}</button>`).join('')}</div></div>
            <div class="f"><label class="lbl" for="n-detail">What exactly caught you?</label><input class="input" id="n-detail" maxlength="200" placeholder="e.g. The finished dish came first"></div>
            <div class="f"><label class="lbl" for="n-transfer">Where else could this work?</label><input class="input" id="n-transfer" maxlength="240" placeholder="e.g. A sign-up page that shows the result first"></div>
          </div></details>
        <p class="err" id="n-err" hidden></p>
        <div class="row"><button class="btn primary grow">Save</button></div>
      </form>
      <aside id="file" style="display:grid;gap:14px"></aside>
    </div></div>`;
  const b = $('[data-back]'); if (b) b.onclick = () => go('forge');
  $('#acts').onclick = ev => { const c = ev.target.closest('[data-a]'); if (!c) return; const on = F.action !== c.dataset.a; $$('#acts .chip').forEach(x => x.setAttribute('aria-pressed', on && x === c)); F.action = on ? c.dataset.a : null; };
  $('#mechs').onclick = ev => { const c = ev.target.closest('[data-m]'); if (!c) return; const m = c.dataset.m;
    if (F.mechs.includes(m)) F.mechs = F.mechs.filter(x => x !== m); else { if (F.mechs.length >= 2) return toast('You can pick up to 2. Remove one first.'); F.mechs.push(m); }
    c.setAttribute('aria-pressed', F.mechs.includes(m));
    $('#mech-d').textContent = F.mechs.length ? F.mechs.map(x => `${x}: ${mechs.find(y => y[0] === x)[1].toLowerCase()}`).join(' · ') : 'Pick up to 2, or write your own.'; };
  $('#why').onsubmit = ev => {
    ev.preventDefault();
    const v = id => $(id).value.trim(), what = v('#n-what'), own = v('#n-own'), err = $('#n-err');
    const miss = !what ? 'Write what caught your eye.' : (!F.mechs.length && !own) ? 'Pick a reason, or write your own.' : '';
    if (miss) { err.textContent = miss; err.hidden = false; return; }
    const note = {id:uid(), date:new Date().toISOString(), what, action:F.action || '', detail:v('#n-detail'), mechs:F.mechs.slice(), own, transfer:v('#n-transfer')};
    S.notes.push(note); save(); award({insight:3}); World.spark('notes');
    if (p.back === 'forge') { forge.hook = {type:'note', id:note.id}; toast('Saved. We picked it for your idea.'); go('forge'); }
    else { toast('Saved'); go('notes'); }
  };
  const N = S.notes.slice().reverse(), counts = {};
  N.forEach(n => n.mechs.forEach(m => counts[m] = (counts[m] || 0) + 1));
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5), max = top.length ? top[0][1] : 1;
  const card = (n, ex) => `<article class="tcard"><div class="head"><span>${ex ? 'Example' : shortDate(n.date)}</span><span>${esc(n.action)}</span></div><p class="what">${esc(n.what)}</p>${n.detail ? `<p><b>What exactly:</b> ${esc(n.detail)}</p>` : ''}${n.mechs.length ? `<div class="mtags">${n.mechs.map(m => `<span>${esc(m)}</span>`).join('')}</div>` : ''}${n.own ? `<p>${esc(n.own)}</p>` : ''}${n.transfer ? `<p class="small"><b>Could work in:</b> ${esc(n.transfer)}</p>` : ''}</article>`;
  const ex = {what:'A recipe video that opened on the finished dish, then cut to "3 ingredients"', action:'Kept watching', detail:'The result first, and the tiny number in big type', mechs:['Looked easy', 'Made me curious'], own:'', transfer:'An onboarding screen that shows the finished profile before asking for details'};
  $('#file').innerHTML = `<div class="panel"><p class="eyebrow">Your collection</p><h3>${N.length ? plural(N.length, 'thing') + ' noticed' : 'Nothing yet'}</h3>
    ${top.length ? `<p class="small">What catches you most</p><div class="tally">${top.map(([m, c]) => `<div class="bar"><span>${esc(m)}</span><span class="track"><span class="fill" style="width:${c / max * 100}%"></span></span><span class="v">${c}</span></div>`).join('')}</div>` : '<p class="help">Add one whenever something grabs you, even outside the app.</p>'}</div>
    ${N.length ? N.slice(0, 8).map(n => card(n)).join('') : card(ex, true)}`;
  $('#n-what').focus({preventScroll:true});
}

/* ================= GALLERY ================= */
function scrGallery(){
  const ideas = S.ideas.slice().reverse(), weeks = {};
  ideas.forEach(i => (weeks[weekKey(i.date)] ||= []).push(i));
  const cw = weekKey(new Date()), sunday = new Date().getDay() === 0;
  ui.innerHTML = `<div class="page" style="max-width:1040px">
    <header class="d-head"><p class="eyebrow">${plural(ideas.length, 'idea')} · ${plural(S.sparks.length, 'spark')}</p><h1>Your ideas</h1><p class="help">Every idea you've created. Star your favourite each week.</p></header>
    ${sunday && weeks[cw] && !S.weekBest[cw] ? `<div class="panel"><h3>It's Sunday. Pick your favourite idea this week.</h3></div>` : ''}
    ${ideas.length ? Object.entries(weeks).map(([wk, list]) => `<section class="week"><div class="row"><h3 class="grow">Week of ${shortDate(wk + 'T12:00')}</h3>${S.weekBest[wk] ? `<span class="stat">★ ${esc((S.ideas.find(x => x.id === S.weekBest[wk]) || {}).name || '')}</span>` : ''}</div>
      <div class="cards">${list.map(i => `<div style="display:grid;gap:8px">${ideaCard(i, true)}<button class="btn sm ${S.weekBest[wk] === i.id ? 'primary' : 'ghost'}" data-best="${i.id}" data-wk="${wk}">${S.weekBest[wk] === i.id ? '★ Favourite' : '☆ Make favourite'}</button></div>`).join('')}</div></section>`).join('')
    : `<div class="panel" style="justify-items:start"><h3>No ideas yet</h3><p class="help">Play a game or two, then create your first idea. It will show up here with its own ${SKIN.artWord}.</p><button class="btn primary" id="g-go">Start today's challenge</button></div>`}
  </div>`;
  const gg = $('#g-go'); if (gg) gg.onclick = () => go('today');
  ui.onclick = ev => {
    const c = ev.target.closest('[data-idea]'); if (c) return openIdea(c.dataset.idea);
    const b = ev.target.closest('[data-best]'); if (b) { const wk = b.dataset.wk;
      if (S.weekBest[wk] === b.dataset.best) delete S.weekBest[wk]; else { S.weekBest[wk] = b.dataset.best; toast("Marked as this week's favourite"); }
      save(); World.setIdeas(S.ideas, bestIds()); scrGallery(); }
  };
  cleanups.push(() => { ui.onclick = null; });
}

/* ================= PROFILE ================= */
function scrProfile(){
  const answered = Object.values(S.days).filter(d => d.idea).length;
  const us = UNLOCKS.map(u => { const on = has(u.id), l = lvl(S.xp[u.skill]);
    return `<li class="${on ? '' : 'locked'}"><span class="ico">${on ? '✓' : '·'}</span><div class="grow"><b>${esc(u.name)}</b><p>${esc(u.desc)}</p></div><span class="stat">${on ? 'Unlocked' : `Needs ${SKILLS[u.skill].name} level ${u.lvl}${l.L === u.lvl - 1 ? ` · ${l.need - l.into} points to go` : ''}`}</span></li>`; }).join('');
  ui.innerHTML = `<div class="page">
    <header class="d-head"><p class="eyebrow">You</p><h1>Your progress</h1></header>
    <div class="statgrid"><div><b>${S.ideas.length}</b><span>ideas</span></div><div><b>${S.sparks.length}</b><span>sparks</span></div><div><b>${S.notes.length}</b><span>things noticed</span></div><div><b>${answered}</b><span>challenges done</span></div></div>
    <div class="panel"><h3>Skills</h3><p class="help">Each game grows one skill. Fill a ring to unlock new things.</p><div class="rings">${Object.keys(SKILLS).map(k => ring(k)).join('')}</div>
      <p class="small">Range: Random Words · Reuse: New Uses · Linking: Find the Link · Noticing: Noticed</p></div>
    <div class="panel"><h3>Unlocks</h3><ul class="unlocks">${us}</ul></div>
    <p class="small" id="wipe">Your progress is saved in this browser only. <button class="linkish" id="wipe-btn">Delete everything</button></p>
  </div>`;
  $('#wipe-btn').onclick = () => {
    $('#wipe').innerHTML = `Delete all your ideas, sparks and progress? You can't undo this. <button class="linkish" id="w-yes">Yes, delete</button> · <button class="linkish" id="w-no">Cancel</button>`;
    $('#w-yes').onclick = () => { S = blank(); save(); World.setIdeas([], []); World.setSparks(0); toast('Everything deleted'); go('world'); };
    $('#w-no').onclick = scrProfile;
  };
}

const SCREENS = {world:scrWorld, today:scrToday, drill:scrDrill, forge:scrForge, reveal:scrReveal, notes:scrNotes, gallery:scrGallery, profile:scrProfile, done:p => { go('world'); if (p.id) openIdea(p.id); }};

/* ================= boot ================= */
const fontsReady = document.fonts && document.fonts.load ? Promise.all(SKIN.fonts.map(f => document.fonts.load(f))).catch(() => {}) : Promise.resolve();
Promise.race([fontsReady, new Promise(r => setTimeout(r, 2500))]).then(() => {
  const ok = World.init(canvas, labels, {onPick:id => { if (current === 'world') { showPop(id); World.focus(id); } else openIdea(id); }});
  if (ok === false) canvas.insertAdjacentHTML('afterend', '');
  World.setIdeas(S.ideas, bestIds());
  World.setSparks(S.sparks.length);
  go('world');
});
};
if (document.body) sidestepApp(); else document.addEventListener('DOMContentLoaded', sidestepApp);
