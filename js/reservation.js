
/* ============================================================
   CRISPY FRIED CHICKEN — reservation.js
   ============================================================
   SETUP INSTRUCTIONS (EmailJS):
   1. Go to https://emailjs.com and create a free account.
   2. Add an Email Service (Gmail, Outlook, etc.) → copy the Service ID.
   3. Create an Email Template:
      - Use ONLY these variables: {{to_name}}, {{to_email}}, {{first_name}}, 
        {{last_name}}, {{phone}}, {{res_type}}, {{res_date}}, {{res_time}}, 
        {{guests}}, {{seating}}, {{special_requests}}, {{dietary}}, 
        {{birthday_name}}, {{event_name}}, {{av_reqs}}, {{occasion}}, 
        {{confirmation_code}}, {{heard_from}}
      -  DO NOT use {{message_body}}, {{params}}, {{cfg}}, or {{anything.object}}
      - Set "To Email" to: {{to_email}}
      - Copy the Template ID.
   4. In your EmailJS dashboard, go to Account → API Keys → copy your Public Key.
   5. Replace the three placeholder strings below with your real IDs.
   ============================================================ */

const EMAILJS_PUBLIC_KEY  = 'u0SjY75BD6MDTY717';      // ← replace
const EMAILJS_SERVICE_ID  = 'service_7oqbqab';      // ← replace
const EMAILJS_TEMPLATE_ID = 'template_29qh54e';     // ← replace

/*INIT EMAILJS*/
(function () {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
})();

/*THEME TOGGLE */
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

/*NAV HAMBURGER */
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

/*RESERVATION TYPE CONFIG */
const TYPE_CONFIG = {
  dining: {
    label:       'Standard Dining',
    icon:        'restaurant-outline',
    greeting:    'Your table is waiting.',
    description: 'We\'ve reserved a table for your group and can\'t wait to have you.',
    tagline:     'Fine dining, fried perfection.',
    notes:       'Our full menu will be available. Tables are held for 15 minutes after the reservation time.',
    conditionals: [],
  },
  birthday: {
    label:       'Birthday Celebration',
    icon:        'gift-outline',
    greeting:    'Let\'s celebrate in style! ',
    description: 'We\'ve reserved a special spot for the birthday celebration — complete with decorations and a complimentary dessert waiting on the table.',
    tagline:     'Every birthday deserves something crispy.',
    notes:       'Your server will be personally assigned. Please arrive 10 minutes early so we can have everything set up perfectly. Don\'t forget to tell us any song preferences for the birthday moment!',
    conditionals: ['field-birthdayName'],
  },
  private: {
    label:       'Private Event',
    icon:        'shield-checkmark-outline',
    greeting:    'Your private experience awaits.',
    description: 'Your exclusive booking of our private dining room is confirmed. A dedicated event host will be in touch within 24 hours to finalize the details.',
    tagline:     'Exclusive. Refined. Unforgettable.',
    notes:       'Kindly note that a deposit is required for private room bookings over 20 guests. Our team will reach out via the phone number provided to arrange this.',
    conditionals: ['field-eventName'],
  },
  brunch: {
    label:       'Weekend Brunch',
    icon:        'sunny-outline',
    greeting:    'Sunday funday starts here. ',
    description: 'Your weekend brunch reservation is confirmed. Get ready for bottomless mimosas, legendary brunch platters, and the full CFC vibe.',
    tagline:     'Wake up. Brunch hard. Repeat.',
    notes:       'Brunch runs from 11am to 4pm on Saturdays and Sundays. The live DJ starts at 1pm on Sundays. Bottomless mimosas are available for an add-on charge — ask your server on arrival.',
    conditionals: [],
  },
  latenight: {
    label:       'Late Night Lounge',
    icon:        'moon-outline',
    greeting:    'The night is young — and so is our menu. ',
    description: 'Your VIP lounge section is secured. After 10pm the energy shifts, the kitchen fires up the late-night menu, and the night truly begins.',
    tagline:     'Late nights, crispy bites.',
    notes:       'Please note: Late Night Lounge reservations are only valid after 10pm. Smart-casual dress code applies. We recommend arriving on time as VIP sections may be released after 20 minutes.',
    conditionals: [],
  },
  corporate: {
    label:       'Corporate Dining',
    icon:        'briefcase-outline',
    greeting:    'Business dining, elevated.',
    description: 'Your corporate dining reservation has been confirmed. We\'ve set aside a professional space tailored for your team or client meeting.',
    tagline:     'Close deals. Crispy meals.',
    notes:       'Invoice billing is available — please request this at the host stand on arrival. AV equipment must be confirmed at least 48 hours in advance. Our event coordinator will reach out shortly.',
    conditionals: ['field-eventName', 'field-avReqs'],
  },
};
/* DEV AUTO-FILL (Press 0 three times: 000)*/
let zeroPressCount = 0;
let zeroPressTimer = null;

document.addEventListener('keydown', (e) => {
  // Only trigger on input/textarea fields to avoid accidental activation
  if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
  
  if (e.key === '0') {
    zeroPressCount++;
    
    // Reset timer
    if (zeroPressTimer) clearTimeout(zeroPressTimer);
    
    // Check if 3 zeros pressed
    if (zeroPressCount === 3) {
      e.preventDefault();
      autoFillForm();
      zeroPressCount = 0;
      console.log('Auto-fill activated');
    } else {
      // Reset after 1 second if not completed
      zeroPressTimer = setTimeout(() => {
        zeroPressCount = 0;
      }, 1000);
    }
  } else {
    // Reset if any other key is pressed
    zeroPressCount = 0;
    if (zeroPressTimer) clearTimeout(zeroPressTimer);
  }
});

function autoFillForm() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (date) => date.toISOString().split('T')[0];
  const formatTime = (date) => date.toTimeString().slice(0, 5);

  // Fill basic fields
  document.getElementById('firstName').value = 'John';
  document.getElementById('lastName').value = 'Doe';
  document.getElementById('email').value = 'kayotojay@gmail.com';
  document.getElementById('phone').value = '5551234567';
  document.getElementById('resDate').value = formatDate(tomorrow);
  document.getElementById('resTime').value = '19:00';
  document.getElementById('guests').value = '4';
  document.getElementById('occasion').value = 'Date Night';
  document.getElementById('specialRequests').value = 'Window seat preferred';
  document.getElementById('heardFrom').value = 'Google';

  // Fill dietary checkboxes
  document.querySelectorAll('input[name="dietary"]').forEach(cb => {
    cb.checked = false;
  });
  const vegCheckbox = document.querySelector('input[name="dietary"][value="Vegetarian"]');
  if (vegCheckbox) vegCheckbox.checked = true;

  // Fill seating radio
  const indoorSeating = document.querySelector('input[name="seating"][value="Indoor"]');
  if (indoorSeating) indoorSeating.checked = true;

  // Clear conditional fields first
  document.getElementById('birthdayName').value = '';
  document.getElementById('eventName').value = '';
  document.getElementById('avReqs').value = '';

  // Select "Birthday Celebration" type (triggers conditional fields)
  const birthdayCard = document.querySelector('.res-type-card[data-type="birthday"]');
  if (birthdayCard) birthdayCard.click();

  // Wait for conditional field to appear, then fill it
  setTimeout(() => {
    document.getElementById('birthdayName').value = 'Jane Doe';
  }, 100);

  // Visual feedback
  document.body.style.outline = '3px solid #C8102E';
  setTimeout(() => {
    document.body.style.outline = '';
  }, 300);

  console.log(' Form auto-filled with test data');
}
/*STATE*/
let selectedType = null;

/*TYPE CARD SELECTION*/
const typeCards   = document.querySelectorAll('.res-type-card');
const typeBanner  = document.getElementById('selectedTypeBanner');
const typeLabel   = document.getElementById('selectedTypeLabel');

typeCards.forEach(card => {
  card.addEventListener('click', () => {
    const type = card.dataset.type;

    // Toggle
    if (selectedType === type) {
      selectedType = null;
      card.setAttribute('aria-pressed', 'false');
      typeBanner.classList.remove('has-type');
      typeLabel.textContent = 'No experience selected yet — choose one above.';
      hideAllConditionals();
      return;
    }

    selectedType = type;

    // Update cards
    typeCards.forEach(c => c.setAttribute('aria-pressed', 'false'));
    card.setAttribute('aria-pressed', 'true');

    // Update banner
    const cfg = TYPE_CONFIG[type];
    typeBanner.classList.add('has-type');
    typeLabel.textContent = `✦  ${cfg.label} — selected`;

    // Show/hide conditional fields
    hideAllConditionals();
    cfg.conditionals.forEach(id => showField(id));
  });
});

function hideAllConditionals() {
  document.querySelectorAll('.conditional-field').forEach(el => {
    el.style.display = 'none';
    el.querySelectorAll('input').forEach(i => i.removeAttribute('required'));
  });
}

function showField(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = '';
  el.querySelectorAll('input').forEach(i => i.setAttribute('required', ''));
}

/* ── VALIDATION ──────────────────────────────────────────────── */
function validateForm() {
  let valid = true;

  function check(id, msg) {
    const input = document.getElementById(id);
    const err   = document.getElementById(`err-${id}`);
    const group = input ? input.closest('.form-group') : null;
    if (!input) return;
    const empty = !input.value.trim();
    if (err) err.textContent = empty ? msg : '';
    if (group) group.classList.toggle('has-error', empty);
    if (empty) valid = false;
  }

  function checkEmail(id) {
    const input = document.getElementById(id);
    const err   = document.getElementById(`err-${id}`);
    const group = input ? input.closest('.form-group') : null;
    if (!input) return;
    const bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    if (err) err.textContent = bad ? 'Please enter a valid email address.' : '';
    if (group) group.classList.toggle('has-error', bad);
    if (bad) valid = false;
  }

  check('firstName',  'First name is required.');
  check('lastName',   'Last name is required.');
  checkEmail('email');
  check('phone',      'Phone number is required.');
  check('resDate',    'Please select a date.');
  check('resTime',    'Please select a time.');
  check('guests',     'Please select number of guests.');

  if (!selectedType) {
    typeBanner.classList.add('has-type');
    typeBanner.style.borderColor = '#e74c3c';
    typeLabel.textContent = '⚠  Please select a reservation type above.';
    valid = false;
  }

  return valid;
}

/* ── GENERATE CONFIRMATION CODE ──────────────────────────────── */
function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CFC-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

/* ── FORM SUBMIT ─────────────────────────────────────────────── */
const form       = document.getElementById('reservationForm');
const submitBtn  = document.getElementById('submitBtn');
const submitInner = document.getElementById('submitBtnInner');

form.addEventListener('submit', async e => {
  e.preventDefault();

  if (!validateForm()) {
    const firstErr = document.querySelector('.has-error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Helper: Safely get string value from element by ID
  const getStr = (id) => {
    const el = document.getElementById(id);
    if (!el) return '';
    const val = el.value;
    if (val === undefined || val === null) return '';
    if (typeof val === 'object') {
      console.error('Object found in field:', id, val);
      return '';
    }
    return String(val).trim();
  };

  // Gather dietary
  const checkedDietary = [...document.querySelectorAll('input[name="dietary"]:checked')]
    .map(cb => cb.value).join(', ') || 'None specified';

  // Gather seating
  const seatingEl = document.querySelector('input[name="seating"]:checked');
  const seating   = seatingEl ? seatingEl.value : 'No Preference';

  const confirmationCode = genCode();
  
  // Safety check
  if (!selectedType || !TYPE_CONFIG[selectedType]) {
    alert('Please select a reservation type.');
    return;
  }
  
  const cfg = TYPE_CONFIG[selectedType];

  // Build payload - EVERY value is explicitly converted to string
  const payload = {
    to_name:           `${getStr('firstName')} ${getStr('lastName')}`,
    to_email:          getStr('email'),
    first_name:        getStr('firstName'),
    last_name:         getStr('lastName'),
    phone:             getStr('phone'),
    res_type:          cfg.label || '',
    res_date:          getStr('resDate'),
    res_time:          getStr('resTime'),
    guests:            getStr('guests'),
    seating:           String(seating).trim(),
    special_requests:  getStr('specialRequests') || 'None',
    dietary:           String(checkedDietary).trim(),
    birthday_name:     getStr('birthdayName'),
    event_name:        getStr('eventName'),
    av_reqs:           getStr('avReqs'),
    occasion:          getStr('occasion'),
    confirmation_code: String(confirmationCode).trim(),
    heard_from:        getStr('heardFrom'),
    // IMPORTANT: Do NOT include message_body here
  };

  // DEBUG: Verify no objects are being sent
  console.log('Sending to EmailJS:', payload);
  
  for (const [key, val] of Object.entries(payload)) {
    if (typeof val !== 'string') {
      console.error(` ERROR: ${key} is not a string! Type: ${typeof val}`, val);
      alert(`Error: ${key} is not a valid string. Check console.`);
      submitBtn.disabled = false;
      submitInner.innerHTML = '<ion-icon name="calendar-outline"></ion-icon> Confirm Reservation';
      return;
    }
  }

  // Show loading state
  submitBtn.disabled = true;
  submitInner.innerHTML = '<span class="spinner"></span> Sending confirmation...';

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload);
    
    showSuccessModal({
      firstName: payload.first_name,
      lastName: payload.last_name,
      email: payload.to_email,
      resDate: payload.res_date,
      resTime: payload.res_time,
      guests: payload.guests,
      seating: payload.seating,
      confirmationCode: payload.confirmation_code,
    }, cfg);
  } catch (err) {
    console.error('EmailJS error:', err);
    submitBtn.disabled = false;
    submitInner.innerHTML = '<ion-icon name="calendar-outline"></ion-icon> Confirm Reservation';
    alert(
      `Your reservation has been noted! However, the confirmation email could not be sent automatically.\n\n` +
      `Please call us at (555) 123-4567 or email crispyfriedchken@gmail.com to confirm.\n\n` +
      `Your confirmation code is: ${confirmationCode}`
    );
  }
});

/*SUCCESS MODAL*/
function showSuccessModal(params, cfg) {
  const modal = document.getElementById('successModal');
  const modalBody = document.getElementById('modalBody');
  const modalDetails = document.getElementById('modalDetails');

  const formattedDate = new Date(params.resDate + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  modalBody.textContent =
    `A confirmation email has been sent to ${params.email}. ` +
    `We look forward to welcoming you to Crispy Fried Chicken!`;

  modalDetails.innerHTML = `
    <div class="modal-detail-row">
      <ion-icon name="barcode-outline"></ion-icon>
      <span>Code: <strong>${params.confirmationCode}</strong></span>
    </div>
    <div class="modal-detail-row">
      <ion-icon name="restaurant-outline"></ion-icon>
      <span>Type: <strong>${cfg.label}</strong></span>
    </div>
    <div class="modal-detail-row">
      <ion-icon name="calendar-outline"></ion-icon>
      <span>${formattedDate} at ${params.resTime}</span>
    </div>
    <div class="modal-detail-row">
      <ion-icon name="people-outline"></ion-icon>
      <span><strong>${params.guests}</strong> guest${params.guests === '1' ? '' : 's'} · ${params.seating}</span>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/*CLOSE MODAL*/
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('successModal').classList.remove('active');
  document.body.style.overflow = '';
  form.reset();
  submitBtn.disabled = false;
  submitInner.innerHTML = '<ion-icon name="calendar-outline"></ion-icon> Confirm Reservation';
  selectedType = null;
  typeCards.forEach(c => c.setAttribute('aria-pressed', 'false'));
  typeBanner.classList.remove('has-type');
  typeLabel.textContent = 'No experience selected yet — choose one above.';
  hideAllConditionals();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/*SET DATE MIN (today)*/
const dateInput = document.getElementById('resDate');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

/*FADE IN ON SCROLL*/
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.res-step, .res-hero-inner').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  observer.observe(el);
});
