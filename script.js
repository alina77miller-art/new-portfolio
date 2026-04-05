// ============================================================
// 1. DEEP SPACE STARFIELD — Three.js
// ============================================================
(function initSpace() {
  const canvas = document.getElementById('threeCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 1;

  // ── Star layers (3 depths for parallax) ──
  function makeStarLayer(count, spread, size, opacity, color) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color, size, transparent: true, opacity, sizeAttenuation: true
    });
    return new THREE.Points(geo, mat);
  }

  // Far stars — tiny, dense, barely moving
  const far   = makeStarLayer(3500, 1800, 0.6,  0.55, 0xffd97a);
  // Mid stars — medium
  const mid   = makeStarLayer(1200, 900,  1.0,  0.70, 0xffe8a0);
  // Near stars — large, bright, slow drift
  const near  = makeStarLayer(300,  400,  1.8,  0.90, 0xfff4cc);

  scene.add(far, mid, near);

  // ── Nebula dust (soft golden cloud) ──
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(600 * 3);
  for (let i = 0; i < 600; i++) {
    const r = 300 + Math.random() * 500;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    dustPos[i*3]   = r * Math.sin(p) * Math.cos(t);
    dustPos[i*3+1] = r * Math.sin(p) * Math.sin(t) * 0.4;
    dustPos[i*3+2] = r * Math.cos(p);
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: 0xd4a017, size: 3.5, transparent: true, opacity: 0.12, sizeAttenuation: true
  });
  scene.add(new THREE.Points(dustGeo, dustMat));

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.6;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.6;
  });

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  function animate(t) {
    requestAnimationFrame(animate);
    const time = t * 0.0001;

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.03;
    targetY += (mouseY - targetY) * 0.03;

    // Parallax layers — each moves at different speed
    far.rotation.y  = time * 0.008 + targetX * 0.08;
    far.rotation.x  = targetY * 0.06;
    mid.rotation.y  = time * 0.015 + targetX * 0.18;
    mid.rotation.x  = targetY * 0.12;
    near.rotation.y = time * 0.025 + targetX * 0.32;
    near.rotation.x = targetY * 0.22;

    renderer.render(scene, camera);
  }
  animate(0);
})();

// ============================================================
// 2. HERO VISUAL — Elegant rotating gold orb
// ============================================================
(function initHeroOrb() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(420, 420);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 4.5;

  const group = new THREE.Group();
  scene.add(group);

  // Outer wireframe sphere — very subtle
  const outerGeo = new THREE.SphereGeometry(1.6, 28, 28);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0xd4a017, wireframe: true, transparent: true, opacity: 0.07
  });
  group.add(new THREE.Mesh(outerGeo, outerMat));

  // Inner sphere
  const innerGeo = new THREE.SphereGeometry(1.2, 20, 20);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0xffd97a, wireframe: true, transparent: true, opacity: 0.05
  });
  group.add(new THREE.Mesh(innerGeo, innerMat));

  // Orbital rings
  function addRing(radius, rotX, rotZ, color, opacity) {
    const geo = new THREE.TorusGeometry(radius, 0.005, 6, 180);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = rotX;
    mesh.rotation.z = rotZ;
    group.add(mesh);
    return mesh;
  }

  const ring1 = addRing(1.85, Math.PI / 2.2, 0,            0xd4a017, 0.35);
  const ring2 = addRing(1.65, Math.PI / 3.5, Math.PI / 4,  0xffd97a, 0.22);
  const ring3 = addRing(2.05, Math.PI / 1.6, -Math.PI / 6, 0xb8860b, 0.15);

  // Scattered gold particles around orb
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(200 * 3);
  for (let i = 0; i < 200; i++) {
    const r = 1.4 + Math.random() * 0.8;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    pPos[i*3]   = r * Math.sin(p) * Math.cos(t);
    pPos[i*3+1] = r * Math.sin(p) * Math.sin(t);
    pPos[i*3+2] = r * Math.cos(p);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  group.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0xffd97a, size: 0.04, transparent: true, opacity: 0.7, sizeAttenuation: true
  })));

  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 1.5;
    my = (e.clientY / window.innerHeight - 0.5) * 1.5;
  });

  function animate(t) {
    requestAnimationFrame(animate);
    const time = t * 0.001;
    group.rotation.y = time * 0.18 + mx * 0.25;
    group.rotation.x = time * 0.07 + my * 0.15;
    ring1.rotation.z = time * 0.22;
    ring2.rotation.y = -time * 0.18;
    ring3.rotation.x = time * 0.14;
    renderer.render(scene, camera);
  }
  animate(0);
})();

// ============================================================
// 3. GOLD DUST CURSOR TRAIL — 2D canvas
// ============================================================
(function initTrail() {
  const canvas = document.getElementById('starCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  let particles = [];

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', e => {
    for (let i = 0; i < 5; i++) {
      const big = Math.random() > 0.75;
      const colors = ['#f0d060','#d4af37','#fff8dc','#d4a017','#b8860b'];
      particles.push({
        x: e.clientX + (Math.random() - 0.5) * 6,
        y: e.clientY + (Math.random() - 0.5) * 6,
        r: big ? Math.random() * 2.2 + 1.0 : Math.random() * 1.0 + 0.3,
        alpha: big ? 0.9 : 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 - 0.4,
        decay: big ? 0.018 : 0.028,
        glow: big,
      });
    }
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles = particles.filter(p => p.alpha > 0.01);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      if (p.glow) { ctx.shadowBlur = 10; ctx.shadowColor = '#d4a017'; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.025;
      p.r  *= 0.97;
      p.alpha -= p.decay;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ============================================================
// 4. CUSTOM CURSOR
// ============================================================
const cursorGlow = document.getElementById('cursorGlow');
const cursorDot  = document.getElementById('cursorDot');
let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
let glowX = cx, glowY = cy;

window.addEventListener('mousemove', e => {
  cx = e.clientX; cy = e.clientY;
  cursorDot.style.left = cx + 'px';
  cursorDot.style.top  = cy + 'px';
});
(function animateCursor() {
  glowX += (cx - glowX) * 0.07;
  glowY += (cy - glowY) * 0.07;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, .tag, .skill-card, .timeline-card, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.width  = '20px';
    cursorDot.style.height = '20px';
    cursorDot.style.opacity = '0.7';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.width  = '10px';
    cursorDot.style.height = '10px';
    cursorDot.style.opacity = '1';
  });
});

// ============================================================
// 5. 3D CARD TILT
// ============================================================
document.querySelectorAll('.glass-card').forEach(card => {
  card.classList.add('tilt-card');
  const shine = document.createElement('div');
  shine.className = 'tilt-shine';
  card.appendChild(shine);

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(6px)`;
    shine.style.background = `radial-gradient(circle at ${(x+0.5)*100}% ${(y+0.5)*100}%, rgba(212,160,23,0.10) 0%, transparent 65%)`;
    shine.style.opacity = '1';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
    card.style.transition = 'transform 0.6s ease';
    shine.style.opacity = '0';
  });
  card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
});

// ============================================================
// 6. NAV / SCROLL / ANIMATIONS / FORM
// ============================================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 20 ? '0 4px 40px rgba(0,0,0,0.6)' : 'none';
});

const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(l => { l.style.color = l.getAttribute('href') === `#${current}` ? 'var(--gold)' : ''; });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.timeline-card,.skill-card,.about-card,.about-text,.project-card,.contact-form,.contact-info-card').forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 4) * 90}ms`;
  observer.observe(el);
});

const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"] span');
  btn.textContent = 'Sending...';
  setTimeout(() => {
    btn.textContent = 'Send Message';
    success.classList.add('show');
    form.reset();
    setTimeout(() => success.classList.remove('show'), 4000);
  }, 1200);
});
