
/*THEME*/
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

/*CLOCK (updates every 30s) */
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

/*OPEN/CLOSED STATUS*/
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

/*GREETING*/
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

/* NAV HAMBURGER*/
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

/*NAV SCROLL SHADOW*/
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', () => {
    mainNav.style.boxShadow = window.scrollY > 8
      ? '0 4px 24px rgba(20,8,4,0.14)'
      : '';
  }, { passive: true });
}

/*COLLAPSIBLES*/
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

/*SCROLL ARROWS*/
document.querySelectorAll('.scroll-arrow').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const el       = document.getElementById(targetId);
    if (!el) return;
    const dir = btn.classList.contains('left') ? -1 : 1;
    el.scrollBy({ left: dir * 320, behavior: 'smooth' });
  });
});

/*DRAG TO SCROLL*/
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

/* GALLERY LIGHTBOX */
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

/*ACTIVE NAV LINK*/
document.querySelectorAll('.nav-link').forEach(a => {
  a.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
  });
});

/* TICKER PAUSE ON HOVER  */
const ticker = document.getElementById('featuredTicker');
if (ticker) {
  ticker.addEventListener('mouseenter', () => {
    ticker.style.animationPlayState = 'paused';
  });
  ticker.addEventListener('mouseleave', () => {
    ticker.style.animationPlayState = 'running';
  });
}

/*INTERSECTION OBSERVER — fade in sections  */
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

/* STAR RATING 
   - Click once  → full star (and all before it)
   - Click again on same full star → half star
   - Click again on same half star → clear (back to 0)
   - Half only applies to the last star in the selection
    */
(function initRating() {
  const starsGroup  = document.getElementById('ratingStars');
  if (!starsGroup) return;

  const starBtns    = Array.from(starsGroup.querySelectorAll('.star-btn'));
  const ratingLabel = document.getElementById('ratingLabel');
  const formWrap    = document.getElementById('ratingFormWrap');
  const textarea    = document.getElementById('ratingText');
  const charCount   = document.getElementById('ratingCharCount');
  const submitBtn   = document.getElementById('ratingSubmit');
  const toast       = document.getElementById('ratingToast');
  const toastTitle  = document.getElementById('ratingToastTitle');
  const toastSub    = document.getElementById('ratingToastSub');
  const toastClose  = document.getElementById('ratingToastClose');

  // State: null = nothing set, X = full X, X.5 = half X
  let currentRating = null;
  let toastTimer    = null;

const labels = {
  0.5: 'Room to grow.',
  1:   'We hear you.',
  1.5: 'We can do better.',
  2:   'We can do better.',
  2.5: 'Getting there.',
  3:   'Not bad at all.',
  3.5: 'Pretty good!',
  4:   'Almost perfect.',
  4.5: 'So close!',
  5:   'You made our night!',
};

  function renderStars(hoverIndex, hoverHalf) {
    // hoverIndex: 1-5 or null, hoverHalf: bool
    const display = hoverIndex !== null
      ? (hoverHalf ? hoverIndex - 0.5 : hoverIndex)
      : currentRating;

    starBtns.forEach((btn, i) => {
      const pos = i + 1; // 1-based
      btn.classList.remove('state-full', 'state-half', 'is-hovered');

      if (display === null) return;

      if (pos < Math.ceil(display)) {
        btn.classList.add('state-full');
      } else if (pos === Math.ceil(display)) {
        if (display % 1 === 0.5) {
          btn.classList.add('state-half');
        } else {
          btn.classList.add('state-full');
        }
      }

      if (hoverIndex !== null && pos <= hoverIndex) {
        btn.classList.add('is-hovered');
      }
    });
  }

  function updateLabel(rating) {
    if (rating === null) {
      ratingLabel.textContent = 'Tap a star to rate';
      ratingLabel.classList.remove('has-value');
    } else {
      ratingLabel.textContent = labels[rating] || `${rating} stars`;
      ratingLabel.classList.add('has-value');
    }
  }

  // Hover handling
  starsGroup.addEventListener('mousemove', e => {
    const btn = e.target.closest('.star-btn');
    if (!btn) return;
    const idx  = parseInt(btn.dataset.index, 10);
    const rect = btn.getBoundingClientRect();
    const half = (e.clientX - rect.left) < rect.width / 2;
    renderStars(idx, half);

    const hovered = half ? idx - 0.5 : idx;
    updateLabel(hovered);
  });

  starsGroup.addEventListener('mouseleave', () => {
    renderStars(null, false);
    updateLabel(currentRating);
  });

  // Click handling
  starsGroup.addEventListener('click', e => {
    const btn = e.target.closest('.star-btn');
    if (!btn) return;
    const idx  = parseInt(btn.dataset.index, 10);
    const rect = btn.getBoundingClientRect();
    const half = (e.clientX - rect.left) < rect.width / 2;
    const clicked = half ? idx - 0.5 : idx;

    // Toggle logic
    if (currentRating === clicked) {
      // Same full → half, same half → clear
      if (clicked % 1 === 0) {
        currentRating = clicked - 0.5;
      } else {
        currentRating = null;
      }
    } else {
      currentRating = clicked;
    }

    renderStars(null, false);
    updateLabel(currentRating);

    // Pop animation on the target star
    btn.classList.remove('pop');
    void btn.offsetWidth; // reflow
    btn.classList.add('pop');
    btn.addEventListener('animationend', () => btn.classList.remove('pop'), { once: true });

    // Burst
    const burst = document.createElement('span');
    burst.className = 'star-burst';
    btn.style.position = 'relative';
    btn.appendChild(burst);
    burst.addEventListener('animationend', () => burst.remove());

    // Show / hide form
    if (currentRating !== null) {
      formWrap.classList.add('visible');
    } else {
      formWrap.classList.remove('visible');
    }
  });

  // Char count
  if (textarea) {
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      charCount.textContent = `${len} / 500`;
      charCount.classList.toggle('near-limit', len >= 450);
    });
  }

  // Submit
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (currentRating === null) return;

      const name   = document.getElementById('ratingName')?.value.trim();
      const review = textarea?.value.trim();

      // Build toast message
      const who    = name || 'Anonymous';
      const stars  = currentRating === 1 ? '1 star' : `${currentRating} stars`;
      toastTitle.textContent = `${who} — ${stars}`;
      toastSub.textContent   = review
        ? `"${review.slice(0, 80)}${review.length > 80 ? '…' : ''}"`
        : 'Your rating has been noted. Thank you!';

      showToast();

      // Reset
      currentRating = null;
      renderStars(null, false);
      updateLabel(null);
      if (textarea)   textarea.value = '';
      if (charCount)  charCount.textContent = '0 / 500';
      charCount?.classList.remove('near-limit');
      document.getElementById('ratingName').value = '';
      formWrap.classList.remove('visible');
    });
  }

  // Toast
  function showToast() {
    clearTimeout(toastTimer);
    toast.classList.add('show');
    toastTimer = setTimeout(hideToast, 5500);
  }

  function hideToast() {
    toast.classList.remove('show');
  }

  if (toastClose) {
    toastClose.addEventListener('click', hideToast);
  }
})();

