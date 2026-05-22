
/*THEME */
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

/*NAV HAMBURGER :) */
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

/* NAV SCROLL SHADOW stop removing the last } bro*/
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', () => {
    mainNav.style.boxShadow = window.scrollY > 8
      ? '0 4px 24px rgba(20,8,4,0.14)'
      : '';
  }, { passive: true });
}

/*ACTIVE NAV LINK */
document.querySelectorAll('.nav-link').forEach(a => {
  a.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
  });
});

/*HERO SCROLL HINT (click to scroll past hero) */
const heroScroll = document.querySelector('.about-hero-scroll');
if (heroScroll) {
  heroScroll.addEventListener('click', () => {
    const target = document.querySelector('.about-intro');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}

/*SECTION FADE-IN (sections as a whole)*/
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10 });

document.querySelectorAll(
  '.about-intro, .about-stats, .about-history, .about-mission, .about-team, .cta-banner'
).forEach(el => sectionObserver.observe(el));

/*TIMELINE STAGGERED SLIDE-IN*/
const timelineObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.timeline-item').forEach((el, i) => {
  el.style.transition =
    `opacity 0.48s ease ${i * 0.10}s, transform 0.48s ease ${i * 0.10}s`;
  timelineObserver.observe(el);
});

/* Shared .visible state for timeline items */
const timelineStyle = document.createElement('style');
timelineStyle.textContent = `
  .timeline-item.visible { opacity: 1 !important; transform: translateX(0) !important; }
`;
document.head.appendChild(timelineStyle);

/*VALUE & TEAM CARD STAGGERED POP-UP*/
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

/* Value cards */
document.querySelectorAll('.value-card').forEach((el, i) => {
  el.style.transition =
    `opacity 0.42s ease ${i * 0.08}s, transform 0.42s ease ${i * 0.08}s,
     box-shadow var(--t) var(--ease), border-color var(--t) var(--ease)`;
  cardObserver.observe(el);
});

/* Team cards */
document.querySelectorAll('.team-card').forEach((el, i) => {
  el.style.transition =
    `opacity 0.42s ease ${i * 0.10}s, transform 0.42s ease ${i * 0.10}s,
     box-shadow var(--t) var(--ease), border-color var(--t) var(--ease)`;
  cardObserver.observe(el);
});

/* Shared .visible state for cards */
const cardStyle = document.createElement('style');
cardStyle.textContent = `
  .value-card.visible,
  .team-card.visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(cardStyle);

/*STATS COUNTER ANIMATION*/
function animateCounter(el, target, suffix, duration) {
  duration = duration || 1400;
  const start = performance.now();

  (function step(now) {
    const pct     = Math.min((now - start) / duration, 1);
    const eased   = 1 - Math.pow(1 - pct, 4); // ease-out use the yt link and change if its too fast
    const current = eased * target;

    // For values >= 1000 show with K abbreviation while counting
    el.textContent = (target % 1 === 0)
      ? Math.floor(current) + suffix
      : current.toFixed(1) + suffix;

    if (pct < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  })(start);
}

let statsAnimated = false;
const statsSection = document.querySelector('.about-stats');

if (statsSection) {
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;

        document.querySelectorAll('.about-stat-num').forEach(el => {
          const raw    = el.textContent.trim();           // e.g. "200K+", "15+" count up vales on banner section
          const suffix = raw.replace(/[\d.]/g, '');       // "+", "K+", etc.
          const numStr = raw.replace(/[^0-9.]/g, '');     // "200", "15"
          const value  = parseFloat(numStr);

          if (!isNaN(value)) {
            el.textContent = '0' + suffix;
            animateCounter(el, value, suffix);
          }
        });

        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.30 });

  statsObserver.observe(statsSection);
}