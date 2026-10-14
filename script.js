const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const touchDevice = window.matchMedia('(hover: none)').matches;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a, b, amount) => a + (b - a) * amount;

$('#year').textContent = new Date().getFullYear();
const progressBar = $('.page-progress span');
const hero = $('.hero'); const heroCopy = $('.hero-copy'); const heroVisual = $('.hero-visual');
const about = $('.about-section'); const journey = $('.journey-section'); const drives = $('[data-motion="drives"]');
const toolkit = $('.stack-section'); const thinking = $('.thinking-section'); const aiLayer = $('.ai-layer-section');
const explore = $('.explore-section'); const statement = $('.statement-section');

// Lightweight entrances remain limited to utility labels and contact content. The main sections below have their own timelines.
const entranceObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('is-visible'); entranceObserver.unobserve(entry.target); }
}), { threshold: .12, rootMargin: '0px 0px -8% 0px' });
if (reducedMotion) $$('.reveal').forEach((item) => item.classList.add('is-visible'));
else $$('.reveal').forEach((item, index) => { item.style.setProperty('--delay', `${Math.min(index % 4, 3) * 80}ms`); entranceObserver.observe(item); });

function sectionProgress(section, lead = .84, tail = .2) {
  const rect = section.getBoundingClientRect();
  return clamp((window.innerHeight * lead - rect.top) / Math.max(rect.height - window.innerHeight * tail, 1));
}

let scrollY = window.scrollY; let scrollTick = false;
function updateScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${maxScroll > 0 ? scrollY / maxScroll : 0})`;
  if (!reducedMotion) {
    const heroProgress = clamp(scrollY / Math.max(hero.offsetHeight, 1));
    heroCopy.style.transform = `translate3d(0,${heroProgress * -78}px,0) scale(${1 - heroProgress * .08})`;
    heroCopy.style.opacity = `${1 - heroProgress * .92}`;
    heroVisual.style.setProperty('--scroll-depth', `${heroProgress}`);
    heroVisual.style.transform = `translate3d(0,${heroProgress * -80}px,0) scale(${1 + heroProgress * .12})`;
    $('.scroll-cue').style.opacity = `${1 - heroProgress * 3}`;
  }
  updateStoryTimelines(); scrollTick = false;
}
function requestScrollUpdate() { scrollY = window.scrollY; if (!scrollTick) { requestAnimationFrame(updateScroll); scrollTick = true; } }
window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate, { passive: true });

function updateStoryTimelines() {
  if (reducedMotion) return;
  const aboutP = sectionProgress(about, .72, .18);
  $('.about-title').style.transform = `translate3d(0,${(aboutP - .5) * -44}px,0) scale(${1 + aboutP * .045})`;
  $$('.about-step').forEach((step, index) => { const local = clamp((aboutP - index * .2) / .25); step.style.opacity = .12 + local * .88; step.style.transform = `translate3d(${(1 - local) * (index === 1 ? -28 : 28)}px,${(1 - local) * 20}px,0)`; });

  const journeyP = sectionProgress(journey, .86, .12); $('.journey-path').classList.toggle('journey-active', journeyP > .02);
  $$('.journey-node').forEach((node, index) => { const local = clamp((journeyP - index * .12) / .27); node.classList.toggle('journey-visible', local > .08); node.style.opacity = .15 + local * .85; });

  const driveP = sectionProgress(drives, .9, .14);
  $$('.drive-item').forEach((item, index) => { const local = clamp((driveP - index * .09) / .25); const direction = index === 0 ? -1 : index === 3 ? 1 : 0; item.style.opacity = .1 + local * .9; item.style.transform = `translate3d(${direction * (1 - local) * 75}px,${(1 - local) * 28}px,${index === 2 ? (1 - local) * -90 : 0}px) scale(${.95 + local * .05})`; if (index === 1) item.classList.toggle('drive-active', local > .35); });

  const toolkitP = sectionProgress(toolkit, .9, .2); $('.stack-display').style.setProperty('--stack-progress', toolkitP);
  $$('.stack-tab').forEach((tab, index) => { const local = clamp((toolkitP - index * .12) / .3); tab.style.opacity = .35 + local * .65; tab.style.transform = `translateX(${(1 - local) * -28}px)`; });

  const aiP = sectionProgress(aiLayer, .85, .18); $('.ai-pipeline').style.setProperty('--ai-progress', aiP); $$('.pipeline-node').forEach((node, index) => { const local = clamp((aiP - index * .1) / .3); node.style.opacity = .15 + local * .85; node.style.transform = `translate3d(${(1 - local) * -26}px,0,0) scale(${.94 + local * .06})`; }); $('.pipeline-line span').style.transform = `scaleX(${clamp(aiP * 1.35)})`;

  const thinkP = sectionProgress(thinking, .75, .1); const thinkLines = $$('.thinking-list p');
  thinkLines.forEach((line, index) => { const local = clamp((thinkP - index * .14) / .24); line.style.opacity = .17 + local * .83; line.style.transform = `translate3d(0,${(1 - local) * 55}px,0) scale(${.95 + local * .05})`; line.classList.toggle('think-active', local > .45); });

  const exploreP = sectionProgress(explore, .9, .16); $$('.explore-list span').forEach((item, index) => { const local = clamp((exploreP - index * .07) / .3); item.style.opacity = .2 + local * .8; item.style.transform = `translate3d(${(index % 2 ? 1 : -1) * (1 - local) * 32}px,0,0)`; });

  const statementP = sectionProgress(statement, .8, .2); const lineP = clamp(statementP / .5);
  $$('.statement-line > *').forEach((line, index) => { const local = clamp((lineP - index * .17) / .55); line.style.opacity = local; line.style.transform = `translate3d(0,${(1 - local) * 110}%,0)`; });
  const eyebrowP = clamp((statementP - .06) / .27); const copyP = clamp((statementP - .3) / .4); const statementEyebrow = $('.statement-eyebrow'); const statementCopy = $('.statement-copy');
  statementEyebrow.style.opacity = eyebrowP; statementEyebrow.style.transform = `translateY(${(1 - eyebrowP) * 24}px)`; statementCopy.style.opacity = copyP; statementCopy.style.transform = `translateY(${(1 - copyP) * 26}px)`;
  $('.statement-grid').style.transform = `perspective(500px) rotateX(60deg) translateY(calc(20% + ${statementP * -55}px)) scale(${1 + statementP * .1})`; $('.statement-glow').style.transform = `translate(-50%,calc(-50% + ${statementP * -28}px)) scale(${1 + statementP * .22})`;
}

// Shared neural space: one persistent depth field carries the page between sections.
function createNeuralSpace(canvas) {
  const ctx = canvas.getContext('2d'); let width = 0; let height = 0; let pointerX = 0; let pointerY = 0; let pageProgress = 0; let active = true;
  const stars = Array.from({ length: 180 }, (_, index) => ({ x: Math.sin(index * 9.13) * 4.5, y: Math.cos(index * 4.71) * 3.2, z: (index % 23) / 23 * 10 + .8, size: index % 9 === 0 ? 1.5 : .45 + (index % 4) * .2 }));
  const nodes = Array.from({ length: 28 }, (_, index) => ({ x: Math.sin(index * 2.17) * 3.6, y: Math.cos(index * 1.41) * 2.5, z: (index % 7) * .65 + 2.2, phase: index * .71 }));
  const links = [];
  nodes.forEach((node, index) => { const nearest = nodes.map((other, otherIndex) => ({ other, otherIndex, distance: Math.hypot(node.x - other.x, node.y - other.y, node.z - other.z) })).filter((item) => item.otherIndex !== index).sort((a, b) => a.distance - b.distance).slice(0, 2); nearest.forEach((item) => { if (item.otherIndex > index) links.push([index, item.otherIndex]); }); });
  function resize() { const scale = Math.min(devicePixelRatio || 1, 2); width = innerWidth; height = innerHeight; canvas.width = width * scale; canvas.height = height * scale; ctx.setTransform(scale, 0, 0, scale, 0, 0); }
  function project(point, layer = 1) { const focal = Math.min(width, height) * .8; const cameraZ = -pageProgress * 2.8; const z = point.z - cameraZ; const x = point.x + pointerX * .12 * layer + pageProgress * (point.z - 5) * .22; const y = point.y + pointerY * .1 * layer + Math.sin(pageProgress * Math.PI + point.z) * .06; const scale = focal / (z + 5); return { x: width * .53 + x * scale, y: height * .5 + y * scale, scale, z }; }
  function draw(time = 0) { if (!active) return; ctx.clearRect(0, 0, width, height); const atmosphere = ctx.createRadialGradient(width*.52,height*.48,0,width*.52,height*.48,width*.72); atmosphere.addColorStop(0,'rgba(48,79,112,.11)'); atmosphere.addColorStop(.5,'rgba(18,28,40,.06)'); atmosphere.addColorStop(1,'rgba(5,7,10,0)'); ctx.fillStyle=atmosphere; ctx.fillRect(0,0,width,height);
    stars.forEach((star,index) => { const drift = reducedMotion ? 0 : Math.sin(time * .00005 + index) * .025; const p = project({x:star.x + drift,y:star.y,z:star.z}, star.z / 8); const alpha = clamp(.82 - star.z / 13) * (.48 + pageProgress * .28); if (p.x < -5 || p.x > width + 5 || p.y < -5 || p.y > height + 5) return; ctx.beginPath(); ctx.arc(p.x,p.y,star.size * Math.max(.35,p.scale / 60),0,Math.PI*2); ctx.fillStyle=`rgba(205,220,230,${alpha})`; ctx.fill(); });
    links.forEach(([start,end], index) => { const a = project(nodes[start], 1.2); const b = project(nodes[end], .7); const focus = clamp((pageProgress * 1.35 + index * .017) % 1); ctx.beginPath(); ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(128,171,210,${.1 + pageProgress * .16})`;ctx.lineWidth=.45 + pageProgress*.25;ctx.stroke(); const travel = (time * .00008 + index * .11) % 1; const lx=lerp(a.x,b.x,travel);const ly=lerp(a.y,b.y,travel);ctx.beginPath();ctx.arc(lx,ly,1.2 + focus * 1.5,0,Math.PI*2);ctx.fillStyle=`rgba(175,214,242,${.3 + focus * .55})`;ctx.shadowBlur=10;ctx.shadowColor='rgba(153,188,233,.7)';ctx.fill();ctx.shadowBlur=0; });
    nodes.forEach((node,index) => { const p=project({x:node.x + Math.sin(time*.00018+node.phase)*.08,y:node.y + Math.cos(time*.00015+node.phase)*.06,z:node.z},1.1);const glow=.18 + clamp(pageProgress*1.1)*.32;ctx.beginPath();ctx.arc(p.x,p.y,2.1 + (index%3)*.45,0,Math.PI*2);ctx.fillStyle=`rgba(174,211,237,${glow+.35})`;ctx.shadowBlur=14;ctx.shadowColor='rgba(112,168,216,.6)';ctx.fill();ctx.shadowBlur=0; });
    if (!reducedMotion) requestAnimationFrame(draw); }
  function update() { const max = document.documentElement.scrollHeight - innerHeight; pageProgress = max > 0 ? scrollY / max : 0; }
  resize(); update(); draw(); window.addEventListener('resize', resize, { passive:true }); window.addEventListener('scroll', update, { passive:true }); document.addEventListener('visibilitychange',()=>{active=!document.hidden;if(active&&!reducedMotion)requestAnimationFrame(draw)});
  if (!reducedMotion && !touchDevice) window.addEventListener('pointermove',(event)=>{pointerX=(event.clientX/innerWidth-.5);pointerY=(event.clientY/innerHeight-.5)},{passive:true});
}

// A projected 3D environment: points, orbital paths, and a metallic computational form use depth instead of a flat ring animation.
function createHeroScene(canvas, visual) {
  const ctx = canvas.getContext('2d'); let width = 0; let height = 0; let pointerX = 0; let pointerY = 0; let active = true;
  const particles = Array.from({ length: 90 }, (_, index) => ({ x: Math.sin(index * 12.71) * 2.9, y: Math.cos(index * 7.31) * 1.9, z: (index % 17) / 17 * 5 + 1, size: index % 4 === 0 ? 1.6 : .7 }));
  const vertices = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],[0,-1.55,0],[0,1.55,0]];
  const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7],[8,0],[8,1],[8,4],[8,5],[9,2],[9,3],[9,6],[9,7]];
  function resize() { const scale = Math.min(devicePixelRatio || 1, 2); const box = visual.getBoundingClientRect(); width = box.width; height = box.height; canvas.width = width * scale; canvas.height = height * scale; ctx.setTransform(scale,0,0,scale,0,0); }
  function project(point, rx, ry, depth = 1) { let [x,y,z] = point; const cy = Math.cos(ry); const sy = Math.sin(ry); const cx = Math.cos(rx); const sx = Math.sin(rx); const x1 = x * cy - z * sy; const z1 = x * sy + z * cy; const y1 = y * cx - z1 * sx; const z2 = y * sx + z1 * cx + 5.2; const scale = 145 * depth / z2; return { x: width * .56 + x1 * scale + pointerX * 25, y: height * .5 + y1 * scale + pointerY * 20, z: z2, scale }; }
  function draw(time = 0) {
    if (!active) return; ctx.clearRect(0,0,width,height); const scrollDepth = Number(visual.style.getPropertyValue('--scroll-depth')) || 0; const rx = .12 + pointerY * .13 + scrollDepth * .22; const ry = time * .00022 + pointerX * .22 + scrollDepth * 1.05; const bg = ctx.createRadialGradient(width*.56,height*.48,5,width*.56,height*.48,width*.72); bg.addColorStop(0,'rgba(91,126,163,.19)'); bg.addColorStop(.46,'rgba(26,39,53,.12)'); bg.addColorStop(1,'rgba(10,11,13,0)'); ctx.fillStyle=bg; ctx.fillRect(0,0,width,height);
    particles.forEach((particle,index) => { const drift = (time * .00006 * (index % 2 ? 1 : -1)) % 1; const p = project([particle.x,particle.y,particle.z - drift * 2],rx,ry,.7); const alpha = clamp(1 - p.z / 8) * .8; ctx.beginPath(); ctx.arc(p.x,p.y,particle.size * (.6 + alpha),0,Math.PI*2); ctx.fillStyle=`rgba(153,188,233,${alpha})`; ctx.fill(); });
    [1.55,2.1,2.7].forEach((radius,index) => { ctx.beginPath(); ctx.ellipse(width*.56,height*.5,radius*75,radius*31,ry*.3 + index*.45,0,Math.PI*2); ctx.strokeStyle=`rgba(153,188,233,${.12 + index*.05})`; ctx.lineWidth=index===1?1.1:.55; ctx.stroke(); });
    const projected = vertices.map((vertex) => project(vertex,rx,ry,1.1)); edges.forEach(([a,b],index) => { ctx.beginPath();ctx.moveTo(projected[a].x,projected[a].y);ctx.lineTo(projected[b].x,projected[b].y);ctx.strokeStyle=index%3===0?'rgba(225,233,235,.64)':'rgba(153,188,233,.3)';ctx.lineWidth=index%3===0?1.3:.7;ctx.stroke(); });
    projected.forEach((point,index) => { ctx.beginPath();ctx.arc(point.x,point.y,index>7?3.2:2,0,Math.PI*2);ctx.fillStyle=index%3===0?'rgba(241,244,239,.95)':'rgba(153,188,233,.78)';ctx.shadowBlur=12;ctx.shadowColor='rgba(153,188,233,.55)';ctx.fill();ctx.shadowBlur=0; });
    if (!reducedMotion) requestAnimationFrame(draw);
  }
  const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; if (active && !reducedMotion) requestAnimationFrame(draw); }, { threshold: .02 }); observer.observe(visual); resize(); draw(); window.addEventListener('resize', resize, { passive:true });
  if (!reducedMotion && !touchDevice) visual.addEventListener('pointermove',(event)=>{const rect=visual.getBoundingClientRect();pointerX=(event.clientX-rect.left)/rect.width-.5;pointerY=(event.clientY-rect.top)/rect.height-.5;});
  visual.addEventListener('pointerleave',()=>{pointerX*=.2;pointerY*=.2;});
}

createNeuralSpace($('#space-canvas')); createHeroScene($('#hero-canvas'), heroVisual);
$$('.stack-tab').forEach((tab) => tab.addEventListener('click', () => { const domain = tab.dataset.domain; $$('.stack-tab').forEach((item) => { const selected = item === tab; item.classList.toggle('is-selected', selected); item.setAttribute('aria-selected', selected); }); $$('.stack-panel').forEach((panel) => panel.classList.toggle('is-visible', panel.dataset.panel === domain)); }));
$$('.pipeline-node').forEach((node) => node.addEventListener('click', () => { $$('.pipeline-node').forEach((item) => item.classList.toggle('is-active', item === node)); $('.pipeline-note').textContent = node.querySelector('small').textContent + ' — a conceptual part of the intelligence layer.'; }));
updateScroll();
