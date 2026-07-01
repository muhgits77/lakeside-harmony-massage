/* js/main.js
   Handles mobile menu, modals, lightbox, forms, navbar scroll, smooth scrolling,
   accessibility focus management, and registers a simple service worker.
*/

(function () {
  'use strict';

  // Utilities
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Environment
  const isDev = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const log = (...args) => { if (isDev) console.log('[main.js]', ...args); };

  // Elements
  const nav = $('#nav');
  const mobileBtn = $('#mobile-menu-btn');
  const mobileMenu = $('#mobile-menu');
  const serviceModal = $('#service-modal');
  const bookingModal = $('#booking-modal');
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightbox-img');
  const lightboxCaption = $('#lightbox-caption');
  const serviceNameEl = $('#modal-service-name');
  const servicePriceEl = $('#modal-service-price');
  const serviceDescEl = $('#modal-service-desc');
  const serviceBenefitsEl = $('#modal-service-benefits');
  const toast = $('#success-toast');
  const toastMessage = $('#toast-message');

  // Keep track of last focused element for modals
  let lastFocused = null;

  // Services data used to populate service modal
  const services = [
    { name: 'Swedish Relaxation', price: '60 / 90 min — $95 / $135', icon: '🕊️', desc: 'Classic full-body therapeutic massage.', benefits: ['Long, flowing strokes', 'Deep calm', 'Lake lavender infusion'] },
    { name: 'Deep Tissue Therapy', price: '60 / 90 min — $110 / $155', icon: '💪', desc: 'Targeted relief for chronic tension.', benefits: ['Myofascial release', 'Chronic pain relief', 'Posture & injury recovery'] },
    { name: 'Prenatal Massage', price: '60 / 75 min — $100 / $130', icon: '🤰', desc: 'Gentle, supportive care for moms-to-be.', benefits: ['Side-lying techniques', 'Swelling relief', 'Certified prenatal care'] },
    { name: 'Sports & Recovery', price: '60 / 90 min — $105 / $150', icon: '🏃‍♂️', desc: 'Performance & active lifestyle recovery.', benefits: ['Range of motion', 'Injury prevention', 'Performance tuning'] },
    { name: 'Hot Stone Therapy', price: '75 min — $125', icon: '🔥', desc: 'Heated river stones for deep warming.', benefits: ['Deep penetrating warmth', 'Muscle release', 'Restorative heat'] },
    { name: 'Couples Retreat', price: '60 / 90 min — $190 / $270', icon: '❤️', desc: 'Side-by-side massage experience.', benefits: ['Shared studio', 'Champagne', 'Lake view'] },
    { name: 'Aromatherapy Ritual', price: '60 / 90 min — $100 / $145', icon: '🌿', desc: 'Custom botanical blends.', benefits: ['Wild mint', 'Cedar & lavender', 'Personalized blends'] }
  ];

  // MOBILE MENU
  function toggleMobileMenu() {
    const isOpen = !mobileMenu.classList.contains('hidden');
    if (isOpen) closeMobileMenu(); else openMobileMenu();
  }

  function openMobileMenu() {
    lastFocused = document.activeElement;
    mobileMenu.classList.remove('hidden');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('role', 'menu');
    // focus first link
    const first = mobileMenu.querySelector('a, button');
    if (first) first.focus();
  }

  function closeMobileMenu() {
    mobileMenu.classList.add('hidden');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileBtn.setAttribute('aria-expanded', 'false');
    if (lastFocused) lastFocused.focus();
  }

  window.closeMobileMenu = closeMobileMenu;

  // NAVBAR SCROLL EFFECT
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('nav-scrolled'); else nav.classList.remove('nav-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // SMOOTH SCROLL for anchor links
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === '#' || href === '#!') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile menu if open
      if (!mobileMenu.classList.contains('hidden')) closeMobileMenu();
    }
  });

  // MODAL FOCUS MANAGEMENT
  function trapFocus(modal) {
    const focusable = $$('a[href], button, textarea, input, select', modal).filter(n => !n.hasAttribute('disabled'));
    if (!focusable.length) return () => {};
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function onKey(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      } else if (e.key === 'Escape') {
        // close whichever modal is open
        try {
          if (!serviceModal.classList.contains('hidden')) closeServiceModal();
          if (!bookingModal.classList.contains('hidden')) closeBookingModal();
          if (!lightbox.classList.contains('hidden')) closeLightbox();
        } catch (err) { log('Error closing modal via Escape', err); }
      }
    }

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }

  // SERVICE MODAL
  window.showServiceModal = function (idx) {
    const s = services[idx] || services[0];
    serviceNameEl.textContent = s.name;
    servicePriceEl.textContent = s.price;
    serviceDescEl.textContent = s.desc;
    serviceBenefitsEl.innerHTML = s.benefits.map(b => `<div>• ${b}</div>`).join('');
    serviceModal.classList.remove('hidden');
    serviceModal.setAttribute('aria-hidden', 'false');
    serviceModal.setAttribute('role', 'dialog');
    serviceModal.setAttribute('aria-modal', 'true');
    lastFocused = document.activeElement;
    serviceModal.querySelector('button, [tabindex] , input, select')?.focus();
    window._untrap = trapFocus(serviceModal);
    log('Opened service modal', s.name);
  };

  window.closeServiceModal = function () {
    serviceModal.classList.add('hidden');
    serviceModal.setAttribute('aria-hidden', 'true');
    serviceModal.removeAttribute('role');
    serviceModal.removeAttribute('aria-modal');
    if (window._untrap) window._untrap();
    if (lastFocused) lastFocused.focus();
    log('Closed service modal');
  };

  // BOOKING MODAL
  window.openBookingModal = function () {
    bookingModal.classList.remove('hidden');
    bookingModal.setAttribute('aria-hidden', 'false');
    bookingModal.setAttribute('role', 'dialog');
    bookingModal.setAttribute('aria-modal', 'true');
    lastFocused = document.activeElement;
    bookingModal.querySelector('input, select, button')?.focus();
    window._untrap = trapFocus(bookingModal);
    log('Opened booking modal');
  };

  window.closeBookingModal = function () {
    bookingModal.classList.add('hidden');
    bookingModal.setAttribute('aria-hidden', 'true');
    bookingModal.removeAttribute('role');
    bookingModal.removeAttribute('aria-modal');
    if (window._untrap) window._untrap();
    if (lastFocused) lastFocused.focus();
    log('Closed booking modal');
  };

  // BOOK FROM SERVICE MODAL (populate booking form)
  window.bookFromServiceModal = function () {
    const name = serviceNameEl.textContent || '';
    const select = document.getElementById('service');
    if (select) {
      // try to select the first option that contains the service name
      const opt = Array.from(select.options).find(o => o.text.includes(name));
      if (opt) select.value = opt.value;
    }
    closeServiceModal();
    openBookingModal();
  };

  // LIGHTBOX
  const galleryImages = $$('img.gallery-img').map(img => ({ src: img.getAttribute('src'), alt: img.getAttribute('alt') }));

  window.openLightbox = function (idx) {
    const item = galleryImages[idx] || galleryImages[0] || { src: '', alt: '' };
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt || 'Gallery image';
    lightboxCaption.textContent = item.alt || '';
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lastFocused = document.activeElement;
    lightbox.querySelector('button')?.focus();
    window._untrap = trapFocus(lightbox);
    log('Opened lightbox', item.src);
  };

  window.closeLightbox = function () {
    lightbox.classList.add('hidden');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    lightbox.removeAttribute('role');
    lightbox.removeAttribute('aria-modal');
    if (window._untrap) window._untrap();
    if (lastFocused) lastFocused.focus();
    log('Closed lightbox');
  };

  // FORMS: show toast on success
  function showToast(message = 'Request received — we will be in touch!') {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      toast.classList.add('hidden');
      toast.setAttribute('aria-hidden', 'true');
    }, 4500);
  }

  window.handleBookingSubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    // pretend to submit; in production integrate with server or form service
    showToast('Thanks — your booking request was sent. We’ll confirm shortly.');
    form.reset();
    closeBookingModal();
  };

  window.handleQuickBooking = function (e) {
    e.preventDefault();
    const form = e.target;
    showToast('Quick booking request sent — thank you!');
    form.reset();
    closeBookingModal();
  };

  // Wire up gallery images to openLightbox by index
  try {
    const galleryImgs = $$('img.gallery-img');
    galleryImgs.forEach((img, i) => {
      let parent = img.closest('[role="button"]');
      if (!parent) parent = img.parentElement;
      // remove inline onclick to avoid duplicates
      try { img.removeAttribute('onclick'); } catch (e) {}
      img.setAttribute('data-gallery-index', String(i));
      // click on image
      img.addEventListener('click', (ev) => { ev.preventDefault(); openLightbox(i); });
      img.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') openLightbox(i); });
      // if parent should act as button, wire it too
      if (parent && parent !== img) {
        parent.setAttribute('role', 'button');
        parent.setAttribute('tabindex', '0');
        parent.addEventListener('click', (ev) => { ev.preventDefault(); openLightbox(i); });
        parent.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') openLightbox(i); });
      }
    });
    log('Gallery wired:', galleryImgs.length, 'items');
  } catch (err) { log('Error wiring gallery images', err); }

  // Wire service cards to open service modal with correct index
  try {
    const cards = $$('.service-card');
    cards.forEach((card, idx) => {
      // remove inline onclick if present
      try { card.removeAttribute('onclick'); } catch (e) {}
      card.setAttribute('data-service-index', String(idx));
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => { e.preventDefault(); showServiceModal(idx); });
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter') showServiceModal(idx); });
    });
    log('Service cards wired:', cards.length, 'items');
  } catch (err) { log('Error wiring service cards', err); }

  // Ensure booking forms use our handlers (in case inline attributes are removed)
  try {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.removeEventListener('submit', window.handleBookingSubmit);
      bookingForm.addEventListener('submit', window.handleBookingSubmit);
    }
    const quickForm = document.getElementById('quick-booking-form');
    if (quickForm) {
      quickForm.removeEventListener('submit', window.handleQuickBooking);
      quickForm.addEventListener('submit', window.handleQuickBooking);
    }
    log('Booking forms wired');
  } catch (err) { log('Error wiring booking forms', err); }

  // Global Escape: close any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      try {
        if (!serviceModal.classList.contains('hidden')) closeServiceModal();
        if (!bookingModal.classList.contains('hidden')) closeBookingModal();
        if (!lightbox.classList.contains('hidden')) closeLightbox();
      } catch (err) { log('Error in global Escape handler', err); }
    }
  });

  // set footer year
  (function setYear() {
    const y = new Date().getFullYear();
    const el = document.getElementById('year');
    if (el) el.textContent = y;
  })();

  // Mobile menu button
  if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu || !mobileBtn) return;
    if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // register simple service worker for offline + asset caching
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  }

  // expose toggle for debugging
  window.toggleMobileMenu = toggleMobileMenu;

})();
