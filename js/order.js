
const EMAILJS_SERVICE_ID  = 'service_7d9mo9d';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_161lubv';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'RV6ly1-QS908iTEo-';   // e.g. 'abcDEFghiJKL'

/* ── DELIVERY FEES (USD) ] */
const DELIVERY_FEES = {
  '':         0,
  'local':    2.50,
  'regional': 5.00,
  'distant':  10.00,
  'overseas': 18.00,
};

/*COOLING SURCHARGE*/
const COOLING_FEE = 2.00; // applied once per order if any cooling item exists

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

/* 
   NAV*/
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

const mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', () => {
    mainNav.style.boxShadow = window.scrollY > 8
      ? '0 4px 24px rgba(20,8,4,0.14)'
      : '';
  }, { passive: true });
}

/* CART STATE*/
let cart = []; // [{ id, name, price, qty, cooling }]

function cartFind(id) { return cart.find(i => i.id === id); }

function cartAdd(itemEl) {
  const { id, name, price, cooling } = itemEl.dataset;
  const existing = cartFind(id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price: parseFloat(price), qty: 1, cooling: cooling === 'true' });
  }
  renderCart();
  animateBadge();
}

function cartChangeQty(id, delta) {
  const item = cartFind(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  renderCart();
}

/* PRICING */
function calcSubtotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}
function hasCooling() {
  return cart.some(i => i.cooling);
}
function getDeliveryFee() {
  const mode = getCurrentMode();
  if (mode !== 'delivery') return 0;
  const zone = document.getElementById('deliveryZone').value;
  return DELIVERY_FEES[zone] || 0;
}
function calcGrand() {
  let g = calcSubtotal();
  if (hasCooling() && getCurrentMode() === 'delivery') g += COOLING_FEE;
  g += getDeliveryFee();
  return g;
}
function fmt(n) { return '$' + n.toFixed(2); }

/*
   RENDER CART (sidebar)*/
function renderCart() {
  const itemsEl   = document.getElementById('cartItems');
  const emptyEl   = document.getElementById('cartEmpty');
  const countEl   = document.getElementById('cartCount');
  const hCountEl  = document.getElementById('cartHeaderCount');
  const totalsEl  = document.getElementById('cartTotals');

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  // count badges
  if (countEl)  countEl.textContent  = totalItems;
  if (hCountEl) hCountEl.textContent = totalItems === 1 ? '1 item' : `${totalItems} items`;

  // empty state
  if (cart.length === 0) {
    emptyEl.style.display  = '';
    totalsEl.style.display = 'none';
    // clear lines
    itemsEl.querySelectorAll('.cart-line').forEach(el => el.remove());
    updateMobileBar();
    return;
  }

  emptyEl.style.display  = 'none';
  totalsEl.style.display = '';

  // rebuild lines
  itemsEl.querySelectorAll('.cart-line').forEach(el => el.remove());

  cart.forEach(item => {
    const line = document.createElement('div');
    line.className = 'cart-line';
    line.dataset.id = item.id;
    line.innerHTML = `
      <div class="cart-line-name">
        ${escHtml(item.name)}
        <span>${fmt(item.price)} each</span>
      </div>
      <div class="cart-qty">
        <button class="qty-btn qty-minus" data-id="${item.id}" aria-label="Remove one">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn qty-plus"  data-id="${item.id}" aria-label="Add one">+</button>
      </div>
      <div class="cart-line-price">${fmt(item.price * item.qty)}</div>
    `;
    itemsEl.insertBefore(line, emptyEl);
  });

  // bind qty buttons
  itemsEl.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => cartChangeQty(btn.dataset.id, -1));
  });
  itemsEl.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => cartChangeQty(btn.dataset.id, +1));
  });

  // totals
  const sub      = calcSubtotal();
  const cooling  = hasCooling() && getCurrentMode() === 'delivery';
  const dFee     = getDeliveryFee();
  const grand    = sub + (cooling ? COOLING_FEE : 0) + dFee;

  document.getElementById('subtotalVal').textContent = fmt(sub);

  const coolingRow = document.getElementById('coolingRow');
  coolingRow.style.display = cooling ? '' : 'none';
  document.getElementById('coolingVal').textContent = fmt(COOLING_FEE);

  const deliveryRow = document.getElementById('deliveryRow');
  deliveryRow.style.display = dFee > 0 ? '' : 'none';
  document.getElementById('deliveryVal').textContent = fmt(dFee);

  document.getElementById('grandTotal').textContent = fmt(grand);

  updateMobileBar();
}

/*MOBILE BAR */
function updateMobileBar() {
  const bar = document.getElementById('mobileCartBar');
  if (!bar) return;
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('mcbCount').textContent = total === 1 ? '1 item' : `${total} items`;
  document.getElementById('mcbTotal').textContent = fmt(calcGrand());
}

/* BADGE ANIMATION*/
function animateBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  badge.style.transform = 'scale(1.5)';
  setTimeout(() => { badge.style.transform = ''; }, 250);
}

/*ESCAPE HTML*/
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ADD TO CART BUTTONS*/
document.querySelectorAll('.menu-item').forEach(item => {
  const btn = item.querySelector('.add-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    cartAdd(item);
    btn.classList.add('added');
    const original = btn.innerHTML;
    btn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = original;
    }, 900);
  });
});

/*FULFILLMENT TABS*/
function getCurrentMode() {
  const active = document.querySelector('.fulfillment-tab.active');
  return active ? active.dataset.mode : 'delivery';
}

document.querySelectorAll('.fulfillment-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.fulfillment-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const isDelivery = tab.dataset.mode === 'delivery';
    document.getElementById('deliveryOptions').style.display = isDelivery ? '' : 'none';
    document.getElementById('pickupInfo').classList.toggle('hidden', isDelivery);
    renderCart(); // recalc fees
  });
});

document.getElementById('deliveryZone').addEventListener('change', renderCart);

/*FILTER CHIPS*/
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const filter = chip.dataset.filter;
    document.querySelectorAll('.menu-section').forEach(section => {
      if (filter === 'all' || section.dataset.section === filter) {
        section.classList.remove('filtered-out');
      } else {
        section.classList.add('filtered-out');
      }
    });
  });
});

/*CHECKOUT MODAL*/
const overlay      = document.getElementById('checkoutModal');
const modalClose   = document.getElementById('modalClose');
const step1El      = document.getElementById('step1');
const step2El      = document.getElementById('step2');
const step3El      = document.getElementById('step3');
const stepDots     = document.querySelectorAll('.modal-step');

function openModal() {
  if (cart.length === 0) return;
  buildModalReview();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  showStep(1);
}

function closeModal() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function showStep(n) {
  [step1El, step2El, step3El].forEach((el, i) => {
    el.classList.toggle('hidden', i + 1 !== n);
  });
  stepDots.forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 === n)  dot.classList.add('active');
    if (i + 1 < n)    dot.classList.add('done');
  });
}

function buildModalReview() {
  // order list
  const listEl = document.getElementById('modalOrderList');
  listEl.innerHTML = '';
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'modal-order-line';
    row.innerHTML = `
      <span><strong>${escHtml(item.name)}</strong> &times; ${item.qty}</span>
      <span class="mol-price">${fmt(item.price * item.qty)}</span>
    `;
    listEl.appendChild(row);
  });

  // totals
  const totEl = document.getElementById('modalTotals');
  totEl.innerHTML = '';
  const sub     = calcSubtotal();
  const cooling = hasCooling() && getCurrentMode() === 'delivery';
  const dFee    = getDeliveryFee();
  const grand   = sub + (cooling ? COOLING_FEE : 0) + dFee;

  const rows = [
    ['Subtotal', fmt(sub)],
  ];
  if (cooling) rows.push(['Cooling surcharge', fmt(COOLING_FEE)]);
  if (dFee > 0) rows.push([`Delivery (${document.getElementById('deliveryZone').options[document.getElementById('deliveryZone').selectedIndex].text.split('—')[0].trim()})`, fmt(dFee)]);
  rows.push(['Total', fmt(grand)]);

  rows.forEach(([label, val]) => {
    const row = document.createElement('div');
    row.className = 'modal-total-row';
    row.innerHTML = `<span>${label}</span><span>${val}</span>`;
    totEl.appendChild(row);
  });
}

document.getElementById('checkoutBtn').addEventListener('click', openModal);
if (modalClose) modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* STEP 1 → 2 */
document.getElementById('goToPayment').addEventListener('click', () => {
  const email = document.getElementById('customerEmail').value.trim();
  const name  = document.getElementById('customerName').value.trim();
  if (!email || !email.includes('@')) {
    document.getElementById('customerEmail').focus();
    document.getElementById('customerEmail').style.borderColor = 'var(--red)';
    return;
  }
  if (!name) {
    document.getElementById('customerName').focus();
    return;
  }
  document.getElementById('customerEmail').style.borderColor = '';
  showStep(2);
});

/* PAYMENT METHOD SWITCH */
document.querySelectorAll('input[name="payMethod"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.getElementById('cardFields').classList.add('hidden');
    document.getElementById('paypalFields').classList.add('hidden');
    document.getElementById('cashappFields').classList.add('hidden');
    document.getElementById('cashFields').classList.add('hidden');

    const map = { card: 'cardFields', paypal: 'paypalFields', cashapp: 'cashappFields', cash: 'cashFields' };
    const target = map[radio.value];
    if (target) document.getElementById(target).classList.remove('hidden');
  });
});

/* BACK */
document.getElementById('backToReview').addEventListener('click', () => showStep(1));

/* PLACE ORDER */
document.getElementById('placeOrder').addEventListener('click', placeOrder);

async function placeOrder() {
  const email   = document.getElementById('customerEmail').value.trim();
  const name    = document.getElementById('customerName').value.trim();
  const method  = document.querySelector('input[name="payMethod"]:checked')?.value || 'card';
  const notes   = document.getElementById('orderNotes')?.value.trim() || '';
  const mode    = getCurrentMode();

  // Build readable cart
  const itemsList = cart.map(i => `${i.name} x${i.qty} — ${fmt(i.price * i.qty)}`).join('\n');
  const sub       = calcSubtotal();
  const cooling   = hasCooling() && mode === 'delivery';
  const dFee      = getDeliveryFee();
  const grand     = sub + (cooling ? COOLING_FEE : 0) + dFee;
  const orderId   = 'CFC-' + Date.now().toString(36).toUpperCase();
  const zoneEl    = document.getElementById('deliveryZone');
  const zoneName  = mode === 'delivery' ? zoneEl.options[zoneEl.selectedIndex]?.text || '' : 'Pickup';
  const address   = mode === 'delivery' ? (document.getElementById('deliveryAddress')?.value.trim() || 'Not provided') : '123 Flavor St, Party City';

  const payMethodLabel = {
    card:    'Credit / Debit Card',
    paypal:  'PayPal',
    cashapp: 'Cash App Pay',
    cash:    'Cash on Delivery / Pickup',
  }[method] || method;

  // Build cancellation link (simple mailto fallback — swap for a real endpoint)
  const cancelSubject = encodeURIComponent(`Cancel Order ${orderId}`);
  const cancelBody    = encodeURIComponent(`Please cancel my order:\n\nOrder ID: ${orderId}\nName: ${name}\nEmail: ${email}`);
  const cancelLink    = `mailto:crispyfriedchken@gmail.com?subject=${cancelSubject}&body=${cancelBody}`;

  const placeBtn = document.getElementById('placeOrder');
  placeBtn.disabled = true;
  placeBtn.textContent = 'Sending...';

  // ── EmailJS send ───────────────────────────────────────────
  try {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:      email,
      to_name:       name,
      order_id:      orderId,
      order_items:   itemsList,
      subtotal:      fmt(sub),
      cooling_fee:   cooling ? fmt(COOLING_FEE) : 'N/A',
      delivery_fee:  fmt(dFee),
      grand_total:   fmt(grand),
      payment_method: payMethodLabel,
      order_mode:    mode === 'delivery' ? 'Delivery' : 'Pickup',
      zone:          zoneName,
      address:       address,
      notes:         notes || 'None',
      cancel_link:   cancelLink,
    });
  } catch (err) {
    // In demo mode, EmailJS is not configured — we still show confirmation.
    console.warn('EmailJS not configured — order confirmation email was not sent.', err);
  }

  //Show confirmation
  document.getElementById('confirmEmail').textContent   = email;
  document.getElementById('confirmOrderId').textContent = orderId;
  showStep(3);

  placeBtn.disabled    = false;
  placeBtn.textContent = 'Place Order';

  // Reset cart after short delay so user can see confirmation
  setTimeout(() => { cart = []; renderCart(); }, 800);
}

/* CLOSE CONFIRMATION */
document.getElementById('closeConfirm').addEventListener('click', closeModal);

/*MOBILE CART DRAWER */
const cartDrawer  = document.getElementById('cartDrawer');
const drawerOverlay = document.getElementById('cartDrawerOverlay');

function openDrawer() {
  cartDrawer.classList.add('open');
  drawerOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderDrawer();
}
function closeDrawer() {
  cartDrawer.classList.remove('open');
  drawerOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('mcbBtn').addEventListener('click', openDrawer);
document.getElementById('cartBtn').addEventListener('click', () => {
  if (window.innerWidth <= 860) openDrawer();
});
document.getElementById('cartDrawerClose').addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

function renderDrawer() {
  const body = document.getElementById('cartDrawerBody');
  body.innerHTML = '';

  if (cart.length === 0) {
    body.innerHTML = `<div class="cart-empty"><ion-icon name="bag-outline"></ion-icon><p>Your cart is empty.</p><span>Add items from the menu.</span></div>`;
    return;
  }

  // lines
  cart.forEach(item => {
    const line = document.createElement('div');
    line.className = 'cart-line';
    line.innerHTML = `
      <div class="cart-line-name">${escHtml(item.name)}<span>${fmt(item.price)} each</span></div>
      <div class="cart-qty">
        <button class="qty-btn qty-minus" data-id="${item.id}">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn qty-plus"  data-id="${item.id}">+</button>
      </div>
      <div class="cart-line-price">${fmt(item.price * item.qty)}</div>
    `;
    body.appendChild(line);
  });

  // totals summary
  const sub   = calcSubtotal();
  const cool  = hasCooling() && getCurrentMode() === 'delivery';
  const dFee  = getDeliveryFee();
  const grand = sub + (cool ? COOLING_FEE : 0) + dFee;

  const totDiv = document.createElement('div');
  totDiv.className = 'cart-totals';
  totDiv.style.margin = '8px 16px 0';
  totDiv.innerHTML = `
    <div class="total-row"><span>Subtotal</span><span>${fmt(sub)}</span></div>
    ${cool ? `<div class="total-row"><span>Cooling</span><span>${fmt(COOLING_FEE)}</span></div>` : ''}
    ${dFee > 0 ? `<div class="total-row"><span>Delivery</span><span>${fmt(dFee)}</span></div>` : ''}
    <div class="total-row total-row--grand"><span>Total</span><span>${fmt(grand)}</span></div>
  `;
  body.appendChild(totDiv);

  // checkout btn
  const checkBtn = document.createElement('button');
  checkBtn.className = 'btn-checkout';
  checkBtn.style.margin = '14px 18px 0';
  checkBtn.style.width = 'calc(100% - 36px)';
  checkBtn.innerHTML = 'Proceed to Checkout <ion-icon name="arrow-forward-outline"></ion-icon>';
  checkBtn.addEventListener('click', () => { closeDrawer(); openModal(); });
  body.appendChild(checkBtn);

  // bind qty buttons
  body.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => { cartChangeQty(btn.dataset.id, -1); renderDrawer(); });
  });
  body.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => { cartChangeQty(btn.dataset.id, +1); renderDrawer(); });
  });
}

renderCart();

/* INTERSECTION OBSERVER — fade sections in*/
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.menu-section, .fulfillment-section').forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(22px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
