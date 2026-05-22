
/*THEME TOGGLE*/
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
/*NAV HAMBURGER*/
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

/* COLLAPSIBLES (FAQ & ACTIVITIES)*/
document.querySelectorAll('.collapsible-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const collapsible = btn.closest('.collapsible');
    const body        = collapsible.querySelector('.collapsible-body');
    const isOpen      = body.classList.contains('open');

    // Optional: Close all others when one opens
    // Paricia Remove this if you want multiple FAQs open at once 
    document.querySelectorAll('.collapsible-body.open').forEach(b => {
      b.classList.remove('open');
      b.closest('.collapsible')
       .querySelector('.collapsible-trigger')
       .setAttribute('aria-expanded', 'false');
    });

    // Toggle current
    if (!isOpen) {
      body.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});