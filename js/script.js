
/* ── THEME ───────────────────────────────────────────────── */
const html    = document.documentElement;
const themBtn = document.getElementById('themeToggle');
const saved   = localStorage.getItem('cfc-theme') || 'light';
html.setAttribute('data-theme', saved);

if (themBtn) {
  themBtn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('cfc-theme', next);
  });
}

/* ── CLOCK (updates every 30s) ───────────────────────────── */
function tick() {
  const now = new Date();
  const h   = String(now.getHours()).padStart(2, '0');
  const m   = String(now.getMinutes()).padStart(2, '0');
  const time = `${h}:${m}`;

  const clocks = [
    document.getElementById('liveClock'),
    document.getElementById('liveClockGreet'),
  ];
  clocks.forEach(el => { if (el) el.textContent = time; });
}
tick();
setInterval(tick, 30000);

/* ── OPEN/CLOSED STATUS ──────────────────────────────────── */
(function status() {
  const h    = new Date().getHours();
  const open = h >= 11 || h < 2;

  const badges = [
    document.getElementById('statusBadge'),
    document.getElementById('statusBadge2'),
  ];

  badges.forEach(el => {
    if (!el) return;
    if (!open) {
      el.classList.remove('open');
      el.classList.add('closed');
      const dot  = el.querySelector('.status-dot');
      const text = el.querySelector('#statusText') || el;
      if (dot) dot.style.background = '#fca5a5';
      // For the greeting badge which has direct text
      if (el.id === 'statusBadge2') {
        el.innerHTML = '<span class="status-dot"></span> Closed Now';
      }
    } else {
      el.classList.add('open');
    }
  });

  // Welcome panel status text
  const statusText = document.getElementById('statusText');
  if (statusText && !open) statusText.textContent = 'Closed Now';
})();

/* ── GREETING ────────────────────────────────────────────── */
(function greet() {
  const h = new Date().getHours();

  const map = [
    { r: [5,  12], greeting: 'Good Morning',   sub: 'Start your day right — breakfast is better fried.',         welcome: 'Good Morning' },
    { r: [12, 17], greeting: 'Good Afternoon',  sub: 'Perfect time for a satisfying lunch.',                      welcome: 'Good Afternoon' },
    { r: [17, 21], greeting: 'Good Evening',    sub: "Tonight is a great night for something crispy.",            welcome: 'Good Evening' },
    { r: [21, 24], greeting: 'Good Night',      sub: 'Late night cravings? We have got you covered.',             welcome: 'Good Night' },
    { r: [0,   5], greeting: 'Still Up?',       sub: 'We are too — come get some late night bites.',              welcome: 'Welcome Back' },
  ];

  const match = map.find(x => h >= x.r[0] && h < x.r[1]);
  if (!match) return;

  const greetLabel  = document.getElementById('greetingLabel');
  const greetSub    = document.getElementById('greetingSub');
  const welcomeHead = document.getElementById('welcomeHeading');

  if (greetLabel)  greetLabel.textContent  = match.greeting;
  if (greetSub)    greetSub.textContent    = match.sub;
  if (welcomeHead) welcomeHead.textContent = match.welcome;
})();

/* ── NAV HAMBURGER ───────────────────────────────────────── */
const hamburger = document.getElementById('navHamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.innerHTML = isOpen
      ? '<ion-icon name="close-outline"></ion-icon>'
      : '<ion-icon name="menu-outline"></ion-icon>';
  });

  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.innerHTML = '<ion-icon name="menu-outline"></ion-icon>';
    }
  });
}

/* ── NAV SCROLL SHADOW ───────────────────────────────────── */
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', () => {
    mainNav.style.boxShadow = window.scrollY > 8
      ? '0 4px 24px rgba(20,8,4,0.14)'
      : '';
  }, { passive: true });
}

/* ── COLLAPSIBLES ────────────────────────────────────────── */
document.querySelectorAll('.collapsible-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const collapsible = btn.closest('.collapsible');
    const body        = collapsible.querySelector('.collapsible-body');
    const isOpen      = body.classList.contains('open');

    // Close all
    document.querySelectorAll('.collapsible-body.open').forEach(b => {
      b.classList.remove('open');
      b.closest('.collapsible')
       .querySelector('.collapsible-trigger')
       .setAttribute('aria-expanded', 'false');
    });

    // Open clicked if it was closed
    if (!isOpen) {
      body.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── SCROLL ARROWS ───────────────────────────────────────── */
document.querySelectorAll('.scroll-arrow').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const el       = document.getElementById(targetId);
    if (!el) return;
    const dir = btn.classList.contains('left') ? -1 : 1;
    el.scrollBy({ left: dir * 320, behavior: 'smooth' });
  });
});

/* ── DRAG TO SCROLL ──────────────────────────────────────── */
document.querySelectorAll('.food-items-track, .food-carousel').forEach(el => {
  let isDown = false;
  let startX, scrollLeft;

  el.addEventListener('mousedown', e => {
    isDown    = true;
    startX    = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
    el.style.userSelect = 'none';
  });

  el.addEventListener('mouseleave', () => { isDown = false; });
  el.addEventListener('mouseup',    () => { isDown = false; el.style.userSelect = ''; });

  el.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.3;
    el.scrollLeft = scrollLeft - walk;
  });
});

/* ── GALLERY LIGHTBOX ────────────────────────────────────── */
const lightbox   = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCap = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox) {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const cap = item.querySelector('.gallery-overlay span');

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxCap) lightboxCap.textContent = cap ? cap.textContent : img.alt;

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ── ACTIVE NAV LINK ─────────────────────────────────────── */
document.querySelectorAll('.nav-link').forEach(a => {
  a.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
  });
});

/* ── TICKER PAUSE ON HOVER ───────────────────────────────── */
const ticker = document.getElementById('featuredTicker');
if (ticker) {
  ticker.addEventListener('mouseenter', () => {
    ticker.style.animationPlayState = 'paused';
  });
  ticker.addEventListener('mouseleave', () => {
    ticker.style.animationPlayState = 'running';
  });
}

/* ── INTERSECTION OBSERVER — fade in sections ────────────── */
const observerOpts = { threshold: 0.12 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll(
  '.welcome-section, .featured-banner-section, .greeting-section, .section, .stats-section, .cta-banner'
).forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(28px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  observer.observe(el);
});