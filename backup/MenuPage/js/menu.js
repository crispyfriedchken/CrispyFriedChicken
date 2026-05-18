/* js/menu.js */

/* ── THEME ───────────────────────────────────────────────── */
const html    = document.documentElement;
const themBtn = document.getElementById('themeToggle');
const saved   = localStorage.getItem('cfc-theme') || 'light';
html.setAttribute('data-theme', saved);

themBtn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('cfc-theme', next);
});

/* ── NAV HAMBURGER ───────────────────────────────────────── */
const hamburger = document.getElementById('navHamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.innerHTML = open
        ? '<ion-icon name="close-outline"></ion-icon>'
        : '<ion-icon name="menu-outline"></ion-icon>';
});

document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.innerHTML = '<ion-icon name="menu-outline"></ion-icon>';
    }
});

/* ── NAV SCROLL SHADOW ───────────────────────────────────── */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    mainNav.style.boxShadow = window.scrollY > 8
        ? '0 4px 24px rgba(20,8,4,0.15)'
        : '';
}, { passive: true });

/* ── CATEGORY TABS ───────────────────────────────────────── */
const tabs     = document.querySelectorAll('.mtab');
const sections = document.querySelectorAll('.menu-section');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const cat = tab.dataset.cat;

        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Show/hide sections
        sections.forEach(sec => {
            if (cat === 'all' || sec.dataset.section === cat) {
                sec.classList.remove('hidden');
            } else {
                sec.classList.add('hidden');
            }
        });

        // Reset dietary filter
        document.querySelectorAll('.dfilt').forEach(f => f.classList.remove('active'));
        document.querySelector('.dfilt[data-diet="all"]').classList.add('active');

        // Clear search
        document.getElementById('menuSearch').value = '';

        checkEmpty();
    });
});

/* ── DIETARY FILTERS ─────────────────────────────────────── */
const dfilts = document.querySelectorAll('.dfilt');

dfilts.forEach(btn => {
    btn.addEventListener('click', () => {
        const diet = btn.dataset.diet;

        dfilts.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        filterCards(diet, document.getElementById('menuSearch').value.trim().toLowerCase());
    });
});

/* ── SEARCH ──────────────────────────────────────────────── */
const searchInput = document.getElementById('menuSearch');

searchInput.addEventListener('input', () => {
    const q    = searchInput.value.trim().toLowerCase();
    const diet = document.querySelector('.dfilt.active')?.dataset.diet || 'all';
    filterCards(diet, q);
});

/* ── FILTER LOGIC ────────────────────────────────────────── */
function filterCards(diet, query) {
    const allCards = document.querySelectorAll('.menu-card, .side-card, .drink-card');
    let visibleCount = 0;

    allCards.forEach(card => {
        const cardCat   = card.dataset.cat   || '';
        const cardTags  = card.dataset.tags  || '';
        const cardText  = card.innerText.toLowerCase();

        const activeCat  = document.querySelector('.mtab.active').dataset.cat;
        const catMatch   = activeCat === 'all' || cardCat === activeCat;
        const dietMatch  = diet === 'all' || cardTags.includes(diet);
        const queryMatch = !query || cardText.includes(query);

        if (catMatch && dietMatch && queryMatch) {
            card.classList.remove('hidden');
            // Make sure parent section is visible
            const sec = card.closest('.menu-section');
            if (sec) sec.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    // Hide sections where all cards are hidden
    sections.forEach(sec => {
        const visible = sec.querySelectorAll('.menu-card:not(.hidden), .side-card:not(.hidden), .drink-card:not(.hidden)');
        if (visible.length === 0) {
            sec.classList.add('hidden');
        }
    });

    checkEmpty();
}

function checkEmpty() {
    const emptyEl  = document.getElementById('menuEmpty');
    const anyShown = [...document.querySelectorAll('.menu-section')].some(s => !s.classList.contains('hidden'));
    emptyEl.classList.toggle('hidden', anyShown);
}

/* ── CLEAR FILTERS ───────────────────────────────────────── */
document.getElementById('clearFilters').addEventListener('click', () => {
    searchInput.value = '';
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector('.mtab[data-cat="all"]').classList.add('active');
    dfilts.forEach(f => f.classList.remove('active'));
    document.querySelector('.dfilt[data-diet="all"]').classList.add('active');

    sections.forEach(s => s.classList.remove('hidden'));
    document.querySelectorAll('.menu-card, .side-card, .drink-card').forEach(c => c.classList.remove('hidden'));
    checkEmpty();
});

/* ── ADD TO ORDER FEEDBACK ───────────────────────────────── */
document.querySelectorAll('.mc-add').forEach(btn => {
    btn.addEventListener('click', () => {
        const orig = btn.innerHTML;
        btn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
        btn.classList.add('confirmed');

        setTimeout(() => {
            btn.innerHTML = orig;
            btn.classList.remove('confirmed');
        }, 1200);
    });
});

/* ── SIZE SELECTOR ───────────────────────────────────────── */
document.querySelectorAll('.sz').forEach(sz => {
    sz.addEventListener('click', () => {
        const siblings = sz.closest('.side-sizes')?.querySelectorAll('.sz');
        siblings?.forEach(s => s.classList.remove('active'));
        sz.classList.add('active');
    });
});