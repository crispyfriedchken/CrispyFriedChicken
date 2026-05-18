const GALLERY_DATA = {
  "featured": [
    {
      "id": "feat-1",
      "src": "media/food/menu_items/signatures/PartyPlatter.jpg",
      "alt": "The Signature Crown Platter",
      "caption": "The Signature Crown Platter",
      "category": "food",
      "size": "main"
    },
    {
      "id": "feat-2",
      "src": "media/events/AfterParty.webp",
      "alt": "The Dining Room at Night",
      "caption": "The Dining Room at Night",
      "category": "atmosphere",
      "size": "side"
    },
    {
      "id": "feat-3",
      "src": "media/events/club.jpg",
      "alt": "Friday Night Energy",
      "caption": "Friday Night Energy",
      "category": "nightlife",
      "size": "side"
    }
  ],
  "items": [
    { "id": "g-1",  "src": "media/events/BestFriends.webp",  "alt": "Best Friends Hour ",       "caption": "Friends",      "category": "atmosphere", "size": "tall",   "date": "2025" },
    { "id": "g-2",  "src": "media/events/19thBirthday.jpg",      "alt": "Birthday Celebration Setup",  "caption": "Birthday Celebration Setup", "category": "events",     "size": "normal", "date": "2025" },
    { "id": "g-4",  "src": "media/events/SaturdayNight.jpg",      "alt": "Saturday Night Live",        "caption": "Saturday Night Live",       "category": "nightlife",  "size": "wide",   "date": "2025" },
    { "id": "g-5",  "src": "media/events/LiveFryStation.jpg",      "alt": "Live Fry Station",           "caption": "Live Fry Station",          "category": "kitchen",    "size": "normal", "date": "2025" },
    { "id": "g-7",  "src": "media/events/ChefAtWork.jpg",      "alt": "Chef at Work",               "caption": "Chef at Work",              "category": "people",     "size": "tall",   "date": "2025" },
    { "id": "g-8",  "src": "media/events/TheDanceFloor.jpg",      "alt": "The Dance Floor",            "caption": "The Dance Floor",           "category": "nightlife",  "size": "normal", "date": "2025" },
    { "id": "g-9",  "src": "media/events/FamilyGathering.jpg",      "alt": "Private Dining Room",        "caption": "Private Dining Room",       "category": "events",     "size": "normal", "date": "2025" },
    { "id": "g-10", "src": "media/events/AfterParty.webp",  "alt": "The Bar at Midnight",        "caption": "The Bar at Midnight",       "category": "atmosphere", "size": "wide",   "date": "2025" },
    { "id": "g-12", "src": "media/food/menu_items/signatures/CrispyPopcornChicken.jpg",      "alt": "Seasoning Session",          "caption": "Seasoning Session",         "category": "kitchen",    "size": "normal", "date": "2025" },
    { "id": "g-13", "src": "media/events/club1.jpg",      "alt": "Guests Enjoying the Night",  "caption": "Guests Enjoying the Night", "category": "people",     "size": "normal", "date": "2025" },
    { "id": "g-14", "src": "media/food/combos/DuoClassicCombo.jpg",      "alt": "Classic Combo Plated",       "caption": "Classic Combo Plated",      "category": "food",       "size": "tall",   "date": "2025" },
    { "id": "g-15", "src": "media/events/CorporateEventNight.webp",      "alt": "Corporate Event Night",      "caption": "Corporate Event Night",     "category": "events",     "size": "normal", "date": "2025" },
    { "id": "g-16", "src": "media/events/YouCookIt.jpg",      "alt": "You Cook It Experience",     "caption": "You Cook It Experience",    "category": "people",     "size": "wide",   "date": "2025" },
    { "id": "g-17", "src": "media/events/CandleLit.webp",   "alt": "Candlelit Tables",           "caption": "Candlelit Tables",          "category": "atmosphere", "size": "normal", "date": "2025" },
    { "id": "g-19", "src": "media/events/VIPLounge.webp",       "alt": "VIP Lounge",                 "caption": "VIP Lounge",                "category": "nightlife",  "size": "normal", "date": "2025" },
    { "id": "g-20", "src": "media/events/AnniversaryDinner.jpg",  "alt": "Anniversary Dinner",         "caption": "Anniversary Dinner",        "category": "events",     "size": "tall",   "date": "2025" },
  ]
};

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

/* ── NAV ─────────────────────────────────────────────────── */
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
      hamburger.innerHTML = '<ion-icon name="menu-outline"></ion-icon>';
    }
  });
}

const mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', () => {
    mainNav.style.boxShadow = window.scrollY > 8
      ? '0 4px 24px rgba(20,8,4,0.14)' : '';
  }, { passive: true });
}

/* CATEGORY META  */
/*
  Defines the display label and ionicon for each category key.
  Add a new entry here whenever you add a new category to the data.
*/
const CATEGORY_META = {
  all:        { label: 'All',        icon: 'grid-outline'          },
  food:       { label: 'Food',       icon: 'restaurant-outline'    },
  atmosphere: { label: 'Atmosphere', icon: 'sparkles-outline'      },
  events:     { label: 'Events',     icon: 'balloon-outline'       },
  kitchen:    { label: 'Kitchen',    icon: 'flame-outline'         },
  nightlife:  { label: 'Nightlife',  icon: 'musical-notes-outline' },
  people:     { label: 'People',     icon: 'people-outline'        },
};

/* STATE  */
let ALL_ITEMS     = [];   // full flat array from data (grid items only)
let activeFilter  = 'all';
let activeSort    = 'default';
let visibleCount  = 12;
const PAGE_SIZE   = 12;

/* DOM REFS  */
const filterBar    = document.getElementById('filterBar');
const galleryGrid  = document.getElementById('galleryGrid');
const featuredGrid = document.getElementById('featuredGrid');
const countEl      = document.getElementById('galleryCount');
const noResults    = document.getElementById('noResults');
const loadMoreWrap = document.getElementById('loadMoreWrap');
const loadMoreBtn  = document.getElementById('loadMoreBtn');
const sortSelect   = document.getElementById('gallerySort');
const heroPhotoCount = document.getElementById('heroPhotoCount');
const heroCatCount   = document.getElementById('heroCatCount');

/* HELPERS  */

/** Capitalise first letter of a string */
function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Build a single gallery item element from a data object */
function buildItem(item) {
  const el = document.createElement('div');
  el.className = 'gallery-item';

  // size classes only for grid items (featured handled separately)
  if (item.size === 'wide')  el.classList.add('wide');
  if (item.size === 'tall')  el.classList.add('tall');

  // Store the exact category from data on the element
  el.dataset.category = item.category;
  el.dataset.id       = item.id;

  const catLabel = CATEGORY_META[item.category]
    ? CATEGORY_META[item.category].label
    : cap(item.category);

  el.innerHTML = `
    <img src="${item.src}" alt="${item.alt}" loading="lazy">
    <div class="gi-overlay">
      <div class="gi-overlay-top">
        <span class="gi-cat-tag">${catLabel}</span>
      </div>
      <div class="gi-overlay-bottom">
        <span class="gi-caption">${item.caption}</span>
        <button class="gi-expand" aria-label="View full size">
          <ion-icon name="expand-outline"></ion-icon>
        </button>
      </div>
    </div>
  `;
  return el;
}

/* BUILD FILTER BUTTONS  */
function buildFilterBar(categories) {
  if (!filterBar) return;
  filterBar.innerHTML = '';

  // Always start with "All"
  const allBtn = document.createElement('button');
  allBtn.className      = 'filter-btn active';
  allBtn.dataset.filter = 'all';
  allBtn.innerHTML = `
    <ion-icon name="${CATEGORY_META.all.icon}"></ion-icon>
    ${CATEGORY_META.all.label}
  `;
  filterBar.appendChild(allBtn);

  // One button per unique category found in the data
  categories.forEach(cat => {
    const meta = CATEGORY_META[cat] || { label: cap(cat), icon: 'pricetag-outline' };
    const btn  = document.createElement('button');
    btn.className      = 'filter-btn';
    btn.dataset.filter = cat;
    btn.innerHTML      = `
      <ion-icon name="${meta.icon}"></ion-icon>
      ${meta.label}
    `;
    filterBar.appendChild(btn);
  });

  // Attach click handlers
  filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter  = btn.dataset.filter;
      visibleCount  = PAGE_SIZE;
      renderGrid();
    });
  });
}

/*BUILD FEATURED ROW*/
function buildFeatured(featured) {
  if (!featuredGrid) return;
  featuredGrid.innerHTML = '';

  // Expect exactly: 1 main + up to 2 side items
  const mainItem  = featured.find(f => f.size === 'main');
  const sideItems = featured.filter(f => f.size === 'side');

  if (mainItem) {
    const el = buildItem(mainItem);
    el.classList.add('featured-main');
    // Remove size classes that aren't relevant to featured layout
    el.classList.remove('wide', 'tall', 'normal');
    featuredGrid.appendChild(el);
  }

  if (sideItems.length) {
    const stack = document.createElement('div');
    stack.className = 'featured-side-stack';
    sideItems.forEach(item => {
      const el = buildItem(item);
      el.classList.remove('wide', 'tall', 'normal');
      stack.appendChild(el);
    });
    featuredGrid.appendChild(stack);
  }
}

/*GET FILTERED + SORTED ITEMS */
function getFilteredItems() {
  // Step 1 — filter strictly by category key
  let result = activeFilter === 'all'
    ? [...ALL_ITEMS]
    : ALL_ITEMS.filter(item => item.category === activeFilter);

  // Step 2 — sort
  if (activeSort === 'az') {
    result.sort((a, b) => a.caption.localeCompare(b.caption));
  } else if (activeSort === 'za') {
    result.sort((a, b) => b.caption.localeCompare(a.caption));
  }
  // 'default' keeps original order

  return result;
}

/*RENDER GRID */
function renderGrid() {
  if (!galleryGrid) return;

  const filtered = getFilteredItems();
  const toShow   = filtered.slice(0, visibleCount);

  // Clear and rebuild — guarantees no stale items with wrong categories
  galleryGrid.innerHTML = '';

  toShow.forEach((item, i) => {
    const el = buildItem(item);
    // Staggered fade-in
    el.style.animationDelay = `${i * 35}ms`;
    el.classList.add('animate-in');
    galleryGrid.appendChild(el);
  });

  // Count label
  const total = filtered.length;
  if (countEl) {
    countEl.textContent = total === 0
      ? 'No photos found'
      : `Showing ${Math.min(visibleCount, total)} of ${total} photo${total !== 1 ? 's' : ''}`;
  }

  // No results
  if (noResults) {
    noResults.style.display = total === 0 ? 'flex' : 'none';
  }

  // Load more
  if (loadMoreWrap) {
    loadMoreWrap.style.display = total > visibleCount ? 'block' : 'none';
  }

  // Rebuild lightbox index from current visible DOM items
  buildVisibleList();
}

/*LOAD MORE*/
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    const prevCount = visibleCount;
    visibleCount += PAGE_SIZE;
    renderGrid();
    // Scroll to first newly revealed item
    const allVisible = galleryGrid.querySelectorAll('.gallery-item');
    if (allVisible[prevCount]) {
      allVisible[prevCount].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/*SORT */
if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    activeSort   = sortSelect.value;
    visibleCount = PAGE_SIZE;
    renderGrid();
  });
}

/*NO RESULTS RESET*/
const noResultsReset = document.getElementById('noResultsReset');
if (noResultsReset) {
  noResultsReset.addEventListener('click', () => {
    activeFilter = 'all';
    visibleCount = PAGE_SIZE;
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const allBtn = filterBar.querySelector('[data-filter="all"]');
    if (allBtn) allBtn.classList.add('active');
    renderGrid();
  });
}

/*VIEW TOGGLE*/
const viewGridBtn    = document.getElementById('viewGrid');
const viewMasonryBtn = document.getElementById('viewMasonry');

if (viewGridBtn && viewMasonryBtn) {
  viewGridBtn.addEventListener('click', () => {
    galleryGrid.classList.remove('masonry-view');
    galleryGrid.classList.add('grid-view');
    viewGridBtn.classList.add('active');
    viewMasonryBtn.classList.remove('active');
  });
  viewMasonryBtn.addEventListener('click', () => {
    galleryGrid.classList.remove('grid-view');
    galleryGrid.classList.add('masonry-view');
    viewMasonryBtn.classList.add('active');
    viewGridBtn.classList.remove('active');
  });
}

/* ── LIGHTBOX ────────────────────────────────────────────── */
let visibleItems = [];
let currentIndex = 0;

function buildVisibleList() {
  // Only items currently rendered in the main grid (not featured)
  visibleItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
}

const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxCat   = document.getElementById('lightboxCat');
const lightboxCap   = document.getElementById('lightboxCaption');
const lightboxCount = document.getElementById('lightboxCounter');
const lbClose       = document.getElementById('lightboxClose');
const lbPrev        = document.getElementById('lightboxPrev');
const lbNext        = document.getElementById('lightboxNext');
const lbBackdrop    = document.getElementById('lightboxBackdrop');

function openLightbox(clickedEl) {
  // Find the item in visibleItems first (grid)
  let idx = visibleItems.indexOf(clickedEl);

  if (idx === -1) {
    // It's a featured item — build a temporary list with featured + grid items
    const featuredItems = Array.from(
      document.querySelectorAll('#featuredGrid .gallery-item')
    );
    const combined = [...featuredItems, ...visibleItems];
    idx = combined.indexOf(clickedEl);
    if (idx === -1) return;
    visibleItems = combined;
  }

  currentIndex = idx;
  renderLightbox();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderLightbox() {
  const item = visibleItems[currentIndex];
  if (!item) return;

  const img    = item.querySelector('img');
  const capEl  = item.querySelector('.gi-caption');
  const catEl  = item.querySelector('.gi-cat-tag');

  lightboxImg.style.opacity   = '0';
  lightboxImg.style.transform = 'scale(0.97)';

  setTimeout(() => {
    lightboxImg.src             = img.src;
    lightboxImg.alt             = img.alt;
    lightboxImg.style.opacity   = '1';
    lightboxImg.style.transform = 'scale(1)';
  }, 110);

  if (lightboxCat)   lightboxCat.textContent   = catEl ? catEl.textContent.trim() : '';
  if (lightboxCap)   lightboxCap.textContent   = capEl ? capEl.textContent.trim() : img.alt;
  if (lightboxCount) lightboxCount.textContent = `${currentIndex + 1} / ${visibleItems.length}`;

  if (lbPrev) lbPrev.style.opacity = currentIndex === 0 ? '0.3' : '1';
  if (lbNext) lbNext.style.opacity = currentIndex === visibleItems.length - 1 ? '0.3' : '1';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  // Rebuild clean list without any featured items merged in
  buildVisibleList();
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

function prevImage() {
  if (currentIndex > 0) { currentIndex--; renderLightbox(); }
}

function nextImage() {
  if (currentIndex < visibleItems.length - 1) { currentIndex++; renderLightbox(); }
}

// Click handler — works for both grid and featured items
document.addEventListener('click', e => {
  if (lightbox.classList.contains('active')) return;
  const item = e.target.closest('.gallery-item');
  if (item) openLightbox(item);
});

if (lbClose)    lbClose.addEventListener('click', closeLightbox);
if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
if (lbPrev)     lbPrev.addEventListener('click', prevImage);
if (lbNext)     lbNext.addEventListener('click', nextImage);

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  prevImage();
  if (e.key === 'ArrowRight') nextImage();
});

// Touch swipe
let touchStartX = 0;
if (lightbox) {
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage(); else prevImage();
    }
  }, { passive: true });
}

/* ── SCROLL FADE-IN ──────────────────────────────────────── */
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.10 });

document.querySelectorAll(
  '.filter-bar-wrap, .featured-banner, .gallery-cta-strip'
).forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(22px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  io.observe(el);
});

/* ── BOOTSTRAP — use GALLERY_DATA (loaded via <script>) ─── */
(function init() {
  const data = GALLERY_DATA;  // defined in js/data/gallery-data.js

  ALL_ITEMS = data.items || [];

  // Derive unique categories in the order they first appear in the data
  const seen       = new Set();
  const categories = [];
  ALL_ITEMS.forEach(item => {
    if (!seen.has(item.category)) {
      seen.add(item.category);
      categories.push(item.category);
    }
  });

  // Update hero stats
  if (heroPhotoCount) heroPhotoCount.textContent = ALL_ITEMS.length + '+';
  if (heroCatCount)   heroCatCount.textContent   = categories.length;

  // Build UI
  buildFilterBar(categories);
  buildFeatured(data.featured || []);
  renderGrid();
})();