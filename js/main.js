/* ============================================================
   UTTKARSH GAUTAM — PORTFOLIO  ·  main.js
   Vanilla JS · no dependencies
   ============================================================ */
(function () {
  'use strict';

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from((ctx || document).querySelectorAll(s));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ---------- Preloader ---------- */
  window.addEventListener('load', () => {
    const pre = $('#preloader');
    if (pre) setTimeout(() => pre.classList.add('hidden'), 500);
  });

  /* ---------- Year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (persisted) ---------- */
  const root = document.documentElement;
  const themeToggle = $('#themeToggle');
  const savedTheme = localStorage.getItem('ug-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('ug-theme', next);
    });
  }

  /* ---------- Navbar: scrolled state + scroll progress ---------- */
  const navbar = $('#navbar');
  const progress = $('#scrollProgress');
  const backToTop = $('#backToTop');

  function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 30);
    if (backToTop) backToTop.classList.toggle('show', y > 500);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile navigation ---------- */
  const navToggle = $('#navToggle');
  const navMenu = $('#navMenu');
  function closeMenu() {
    navToggle && navToggle.classList.remove('active');
    navMenu && navMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
    navToggle && navToggle.setAttribute('aria-expanded', 'false');
  }
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active', open);
      document.body.classList.toggle('menu-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    $$('.nav__link', navMenu).forEach(l => l.addEventListener('click', closeMenu));
  }

  /* ---------- Scrollspy (active nav link) ---------- */
  const navLinks = $$('.nav__link');
  const sections = navLinks
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = '#' + e.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => spy.observe(s));

  /* ---------- Smooth anchor scroll (offset for navbar) ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Typed roles effect ---------- */
  const typedEl = $('#typed');
  if (typedEl) {
    const roles = [
      'Information Technology Student',
      'Future Software Engineer',
      'Web Developer',
      'Problem Solver',
      'Tech Enthusiast'
    ];
    let r = 0, c = 0, deleting = false;
    function tick() {
      const word = roles[r];
      typedEl.textContent = word.slice(0, c);
      if (!deleting) {
        if (c < word.length) { c++; setTimeout(tick, 70); }
        else { deleting = true; setTimeout(tick, 1500); }
      } else {
        if (c > 0) { c--; setTimeout(tick, 35); }
        else { deleting = false; r = (r + 1) % roles.length; setTimeout(tick, 350); }
      }
    }
    if (prefersReduced) { typedEl.textContent = roles[0]; } else { tick(); }
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const revObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => revObs.observe(el));
  }

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const dur = 1600;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = decimals ? val.toFixed(decimals) : Math.floor(val).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = decimals ? target.toFixed(decimals) : Math.floor(target).toLocaleString();
    }
    requestAnimationFrame(step);
  }
  const counterObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  $$('.counter').forEach(el => counterObs.observe(el));

  /* ---------- Skill bars ---------- */
  const skillObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target;
        fill.style.width = (fill.dataset.level || 0) + '%';
        obs.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });
  $$('.skillbar__fill').forEach(el => skillObs.observe(el));

  /* ---------- Circular rings ---------- */
  const CIRC = 2 * Math.PI * 52; // ~326.7
  const ringObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const ring = e.target;
      const pct = parseInt(ring.dataset.percent || '0', 10);
      const fg = $('.ring__fg', ring);
      const num = $('.ring__num', ring);
      if (fg) fg.style.strokeDashoffset = String(CIRC * (1 - pct / 100));
      if (num) {
        const start = performance.now();
        (function run(now) {
          const p = Math.min((now - start) / 1500, 1);
          num.textContent = Math.round(pct * (1 - Math.pow(1 - p, 3))) + '%';
          if (p < 1) requestAnimationFrame(run);
        })(start);
      }
      obs.unobserve(ring);
    });
  }, { threshold: 0.5 });
  $$('.ring').forEach(el => ringObs.observe(el));

  /* ---------- Project filtering ---------- */
  const filterBtns = $$('#projectFilters .filter-btn');
  const projectCards = $$('#projectsGrid .project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = f === 'all' || card.dataset.category === f;
        card.classList.toggle('is-hidden', !match);
        if (match) {
          card.classList.remove('is-anim');
          void card.offsetWidth; // reflow to restart animation
          card.classList.add('is-anim');
        }
      });
    });
  });

  /* ---------- Generic carousel factory ---------- */
  function makeCarousel({ track, prev, next, dots, perView = () => 1, autoMs = 0 }) {
    if (!track) return;
    const items = Array.from(track.children);
    let index = 0;
    let timer = null;

    function maxIndex() { return Math.max(0, items.length - perView()); }

    function render() {
      index = Math.min(index, maxIndex());
      const pv = perView();
      const step = 100 / pv;
      track.style.transform = `translateX(-${index * step}%)`;
      if (dots) {
        $$('button', dots).forEach((d, i) => d.classList.toggle('active', i === index));
      }
    }

    function buildDots() {
      if (!dots) return;
      dots.innerHTML = '';
      const count = maxIndex() + 1;
      for (let i = 0; i < count; i++) {
        const b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        b.addEventListener('click', () => { index = i; render(); restart(); });
        dots.appendChild(b);
      }
    }

    function go(dir) { index = (index + dir + (maxIndex() + 1)) % (maxIndex() + 1); render(); }
    function restart() { if (autoMs && timer) { clearInterval(timer); timer = setInterval(() => go(1), autoMs); } }

    prev && prev.addEventListener('click', () => { go(-1); restart(); });
    next && next.addEventListener('click', () => { go(1); restart(); });

    let resizeRAF;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeRAF);
      resizeRAF = requestAnimationFrame(() => { buildDots(); render(); });
    });

    buildDots();
    render();
    if (autoMs && !prefersReduced) timer = setInterval(() => go(1), autoMs);
    return { go, render };
  }

  /* ---------- Certifications carousel (responsive perView) ---------- */
  makeCarousel({
    track: $('#certTrack'),
    prev: $('#certPrev'),
    next: $('#certNext'),
    dots: $('#certDots'),
    perView: () => (window.innerWidth <= 640 ? 1 : window.innerWidth <= 1024 ? 2 : 3),
    autoMs: 5000
  });

  /* ---------- Testimonials carousel ---------- */
  makeCarousel({
    track: $('#testimonialTrack'),
    prev: $('#tPrev'),
    next: $('#tNext'),
    dots: $('#tDots'),
    perView: () => 1,
    autoMs: 6000
  });

  /* ---------- 3D tilt on cards ---------- */
  if (!isTouch && !prefersReduced) {
    $$('[data-tilt]').forEach(card => {
      const MAX = 8;
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${-py * MAX}deg) rotateY(${px * MAX}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!isTouch && !prefersReduced) {
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- Custom cursor ---------- */
  if (!isTouch && !prefersReduced) {
    const dot = $('#cursorDot');
    const ring = $('#cursorRing');
    if (dot && ring) {
      document.body.classList.add('cursor-ready');
      let mx = 0, my = 0, rx = 0, ry = 0;
      window.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      });
      (function loop() {
        rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(loop);
      })();
      $$('a, button, [data-tilt], input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
      });
    }
  }

  /* ---------- Particle background ---------- */
  (function particles() {
    const canvas = $('#particleCanvas');
    if (!canvas || prefersReduced) return;
    const ctx = canvas.getContext('2d');
    let w, h, pts = [];
    const COUNT = window.innerWidth < 768 ? 36 : 70;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function init() {
      pts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.6
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      const light = root.getAttribute('data-theme') === 'light';
      const col = light ? '15,23,42' : '160,180,255';
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${light ? 0.35 : 0.6})`;
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${col},${(1 - dist / 120) * (light ? 0.12 : 0.22)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    resize(); init(); draw();
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); init(); }, 200); });
  })();

  /* ---------- Floating chips subtle parallax (hero) ---------- */
  if (!isTouch && !prefersReduced) {
    const chips = $$('.float-chip');
    const hero = $('#home');
    if (hero && chips.length) {
      hero.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
        chips.forEach(ch => {
          const f = parseFloat(ch.dataset.float || '1');
          ch.style.marginLeft = (dx * f * 8) + 'px';
          ch.style.marginTop = (dy * f * 8) + 'px';
        });
      });
    }
  }

  /* ---------- Contact form validation ---------- */
  const form = $('#contactForm');
  if (form) {
    const success = $('#formSuccess');
    const fields = {
      name: { el: $('#name'), test: v => v.trim().length >= 2, msg: 'Please enter your name.' },
      email: { el: $('#email'), test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Enter a valid email address.' },
      phone: { el: $('#phone'), test: v => v.trim() === '' || /^[\d+\-\s()]{7,}$/.test(v.trim()), msg: 'Enter a valid phone number.' },
      subject: { el: $('#subject'), test: v => v.trim().length >= 3, msg: 'Subject is too short.' },
      message: { el: $('#message'), test: v => v.trim().length >= 10, msg: 'Message should be at least 10 characters.' }
    };

    function validateField(key) {
      const f = fields[key];
      if (!f || !f.el) return true;
      const ok = f.test(f.el.value);
      const wrap = f.el.closest('.field');
      const err = wrap ? $('.field__error', wrap) : null;
      if (wrap) wrap.classList.toggle('invalid', !ok);
      if (err) err.textContent = ok ? '' : f.msg;
      return ok;
    }

    Object.keys(fields).forEach(key => {
      const f = fields[key];
      f.el && f.el.addEventListener('blur', () => validateField(key));
      f.el && f.el.addEventListener('input', () => {
        const wrap = f.el.closest('.field');
        if (wrap && wrap.classList.contains('invalid')) validateField(key);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const allOk = Object.keys(fields).map(validateField).every(Boolean);
      if (!allOk) {
        const firstInvalid = $('.field.invalid input, .field.invalid textarea');
        firstInvalid && firstInvalid.focus();
        return;
      }
      const btn = $('#submitBtn');
      btn && btn.classList.add('is-loading');
      // Simulated send (no backend). Replace with real endpoint / Formspree when ready.
      setTimeout(() => {
        btn && btn.classList.remove('is-loading');
        if (success) { success.hidden = false; }
        form.reset();
        $$('.field').forEach(w => w.classList.remove('invalid'));
        setTimeout(() => { if (success) success.hidden = true; }, 6000);
      }, 1200);
    });
  }

  /* ---------- Visitor counter (localStorage demo) ---------- */
  const vc = $('#visitorCount');
  if (vc) {
    let n = parseInt(localStorage.getItem('ug-visits') || '0', 10);
    n += 1;
    localStorage.setItem('ug-visits', String(n));
    const base = 1240; // friendly starting number
    const total = base + n;
    let cur = Math.max(0, total - 40);
    const t = setInterval(() => {
      cur += Math.ceil((total - cur) / 8);
      if (cur >= total) { cur = total; clearInterval(t); }
      vc.textContent = cur.toLocaleString();
    }, 40);
  }
})();
