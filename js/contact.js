
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

/* ── CONTACT FORM (EMAILJS) ──────────────────────────────── */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const btn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('form-status');
    const originalBtnText = btn.innerHTML;

    // 1. UI: Loading State
    btn.disabled = true;
    btn.classList.add('loading');
    btn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon><span>Sending...</span>';
    statusDiv.style.display = 'none';

    // 2. CONFIG: UPDATE THESE WITH YOUR EMAILJS DETAILS
    const SERVICE_ID = 'service_7oqbqab';     // e.g., 'service_xyz123'
    const TEMPLATE_ID = 'template_w24olxd';   // e.g., 'template_abc456'
    // Public Key is already initialized in the HTML <head>

    // 3. SEND EMAIL
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this)
      .then(() => {
        // Success
        btn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon><span>Sent!</span>';
        btn.style.backgroundColor = '#16a34a'; // Green
        btn.style.borderColor = '#16a34a';
        
        statusDiv.className = 'form-status success';
        statusDiv.innerHTML = '<ion-icon name="checkmark-circle"></ion-icon> Message sent successfully! We will reply soon.';
        statusDiv.style.display = 'flex';
        
        contactForm.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
          btn.disabled = false;
          btn.classList.remove('loading');
          btn.innerHTML = originalBtnText;
          btn.style.backgroundColor = ''; 
          btn.style.borderColor = '';
          statusDiv.style.display = 'none';
        }, 5000);

      }, (error) => {
        // Error
        console.error('FAILED...', error);
        btn.disabled = false;
        btn.classList.remove('loading');
        btn.innerHTML = originalBtnText;

        statusDiv.className = 'form-status error';
        statusDiv.innerHTML = '<ion-icon name="alert-circle"></ion-icon> Failed to send. Please try again or call us.';
        statusDiv.style.display = 'flex';
      });
  });
}

/* ── CLOCK (updates every 30s) ───────────────────────────── */
function tick() {
  const now = new Date();
  const h   = String(now.getHours()).padStart(2, '0');
  const m   = String(now.getMinutes()).padStart(2, '0');
  const time = `${h}:${m}`;
  const clocks = [document.getElementById('liveClock'), document.getElementById('liveClockGreet')];
  clocks.forEach(el => { if (el) el.textContent = time; });
}
tick();
setInterval(tick, 30000);


/* ── OPEN/CLOSED STATUS ──────────────────────────────────── */
(function status() {
  const h    = new Date().getHours();
  const open = h >= 11 || h < 2;
  const badges = [document.getElementById('statusBadge'), document.getElementById('statusBadge2')];
  badges.forEach(el => {
    if (!el) return;
    if (!open) {
      el.classList.remove('open');
      el.classList.add('closed');
      const dot  = el.querySelector('.status-dot');
      if (dot) dot.style.background = '#fca5a5';
      if (el.id === 'statusBadge2') el.innerHTML = '<span class="status-dot"></span> Closed Now';
    } else {
      el.classList.add('open');
    }
  });
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