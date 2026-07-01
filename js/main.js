/* js/main.js
   Premium interactions for Lakeside Harmony — Bluegrass Digital Forge portfolio
   - Enhanced mobile menu with icon transition
   - Scroll-reveal animations (IntersectionObserver)
   - Reliable data-driven service & gallery wiring (no inline onclick dependency)
   - Modal focus trap + keyboard
   - Forms & toast
   - Strong PWA + SW registration
*/

(function () {
  'use strict';

  // Utilities
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const isDev = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const log = (...args) => { if (isDev) console.log('[Lakeside]', ...args); };

  // Elements
  const nav = $('#nav');
  const mobileBtn = $('#mobile-menu-btn');
  const mobileMenu = $('#mobile-menu');
  const mobileIcon = $('#mobile-icon');
  const serviceModal = $('#service-modal');
  const bookingModal = $('#booking-modal');
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightbox-img');
  const lightboxCaption = $('#lightbox-caption');
  const serviceNameEl = $('#modal-service-name');
  const servicePriceEl = $('#modal-service-price');
  const serviceDescEl = $('#modal-service-desc');
  const serviceBenefitsEl = $('#modal-service-benefits');
  const serviceIconEl = $('#modal-service-icon');
  const toast = $('#success-toast');
  const toastMessage = $('#toast-message');

  let lastFocused = null;
  let untrap = null;

  // Services (matches cards)
  const services = [
    { name: 'Swedish Relaxation', price: '60 / 90 min — $95 / $135', icon: '🕊️', desc: 'Classic full-body therapeutic massage using long, flowing strokes and Lake Cumberland lavender infusion.', benefits: ['Long, flowing strokes', 'Deep calm', 'Lake lavender infusion'] },
    { name: 'Deep Tissue Therapy', price: '60 / 90 min — $110 / $155', icon: '💪', desc: 'Targeted relief for chronic tension and postural issues with myofascial release.', benefits: ['Myofascial release', 'Chronic pain relief', 'Posture & injury recovery'] },
    { name: 'Prenatal Massage', price: '60 / 75 min — $100 / $130', icon: '🤰', desc: 'Gentle, supportive care for expectant mothers with certified prenatal techniques.', benefits: ['Side-lying techniques', 'Swelling relief', 'Certified prenatal care'] },
    { name: 'Sports & Recovery', price: '60 / 90 min — $105 / $150', icon: '🏃‍♂️', desc: 'Performance-focused recovery massage for active lifestyles and lake sports.', benefits: ['Range of motion', 'Injury prevention', 'Performance tuning'] },
    { name: 'Hot Stone Therapy', price: '75 min — $125', icon: '🔥', desc: 'Heated Cumberland river stones for deep penetrating warmth and muscle release.', benefits: ['Deep penetrating warmth', 'Muscle release', 'Restorative heat'] },
    { name: 'Couples Retreat', price: '60 / 90 min — $190 / $270', icon: '❤️', desc: 'Side-by-side experience in our lakeside studio with post-treatment champagne.', benefits: ['Shared studio', 'Champagne', 'Lake view'] },
    { name: 'Aromatherapy Ritual', price: '60 / 90 min — $100 / $145', icon: '🌿', desc: 'Custom botanical blends using native Kentucky wild mint, cedar & lavender.', benefits: ['Wild mint', 'Cedar & lavender', 'Personalized blends'] }
  ];

  // =====================
  // MOBILE MENU (Premium)
  // =====================
  function toggleMobileMenu() {
    const isOpen = !mobileMenu.classList.contains('hidden');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    lastFocused = document.activeElement;
    mobileMenu.classList.remove('hidden');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'true');
    if (mobileIcon) {
      mobileIcon.classList.remove('fa-bars');
      mobileIcon.classList.add('fa-times');
    }
    // focus first
    const first = mobileMenu.querySelector('a, button');
    if (first) setTimeout(() => first.focus(), 40);
  }

  function closeMobileMenu() {
    mobileMenu.classList.add('hidden');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
    if (mobileIcon) {
      mobileIcon.classList.remove('fa-times');
      mobileIcon.classList.add('fa-bars');
    }
    if (lastFocused) lastFocused.focus();
  }

  window.closeMobileMenu = closeMobileMenu;

  if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileMenu);

  // Close on outside click + escape handled globally
  document.addEventListener('click', (e) => {
    if (!mobileMenu || !mobileBtn || mobileMenu.classList.contains('hidden')) return;
    if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // =====================
  // NAVBAR SCROLL
  // =====================
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 38) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // =====================
  // SMOOTH SCROLL + AUTO CLOSE MOBILE
  // =====================
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || href === '#!') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) closeMobileMenu();
    }
  });

  // =====================
  // FOCUS TRAP
  // =====================
  function trapFocus(modalEl) {
    const focusable = $$('a[href], button:not([disabled]), textarea, input:not([disabled]), select', modalEl);
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
        closeAnyOpenModal();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }

  function closeAnyOpenModal() {
    if (serviceModal && !serviceModal.classList.contains('hidden')) closeServiceModal();
    if (bookingModal && !bookingModal.classList.contains('hidden')) closeBookingModal();
    if (lightbox && !lightbox.classList.contains('hidden')) closeLightbox();
  }

  // =====================
  // SERVICE MODAL
  // =====================
  window.showServiceModal = function (idx) {
    const s = services[idx] || services[0];
    if (serviceNameEl) serviceNameEl.textContent = s.name;
    if (servicePriceEl) servicePriceEl.textContent = s.price;
    if (serviceDescEl) serviceDescEl.textContent = s.desc;
    if (serviceBenefitsEl) {
      serviceBenefitsEl.innerHTML = s.benefits.map(b => `<div class="flex items-center gap-2"><span class="text-[#B87C5C]">•</span> ${b}</div>`).join('');
    }
    if (serviceIconEl) serviceIconEl.textContent = s.icon || '🌿';

    serviceModal.classList.remove('hidden');
    serviceModal.setAttribute('aria-hidden', 'false');
    lastFocused = document.activeElement;

    const first = serviceModal.querySelector('button');
    if (first) first.focus();
    untrap = trapFocus(serviceModal);
    log('Service modal opened:', s.name);
  };

  window.closeServiceModal = function () {
    if (!serviceModal) return;
    serviceModal.classList.add('hidden');
    serviceModal.setAttribute('aria-hidden', 'true');
    if (untrap) { untrap(); untrap = null; }
    if (lastFocused) lastFocused.focus();
  };

  window.bookFromServiceModal = function () {
    const name = serviceNameEl ? serviceNameEl.textContent : '';
    closeServiceModal();
    // Open booking and preselect
    setTimeout(() => {
      openBookingModal();
      const select = document.getElementById('service') || document.getElementById('q-service');
      if (select) {
        const match = Array.from(select.options).find(o => o.text.includes(name.split(' ')[0]));
        if (match) select.value = match.value;
      }
    }, 160);
  };

  // =====================
  // BOOKING MODALS
  // =====================
  window.openBookingModal = function () {
    if (!bookingModal) return;
    bookingModal.classList.remove('hidden');
    bookingModal.setAttribute('aria-hidden', 'false');
    lastFocused = document.activeElement;
    const firstField = bookingModal.querySelector('input, select');
    if (firstField) setTimeout(() => firstField.focus(), 30);
    untrap = trapFocus(bookingModal);
  };

  window.closeBookingModal = function () {
    if (!bookingModal) return;
    bookingModal.classList.add('hidden');
    bookingModal.setAttribute('aria-hidden', 'true');
    if (untrap) { untrap(); untrap = null; }
    if (lastFocused) lastFocused.focus();
  };

  // =====================
  // LIGHTBOX
  // =====================
  const galleryImages = [
    { src: 'images/5.jpg', alt: 'Peaceful interior of Lakeside Harmony massage studio overlooking Lake Cumberland' },
    { src: 'images/4.jpg', alt: 'Close-up hot stone therapy with Lake Cumberland river stones' },
    { src: 'images/3.jpg', alt: 'Tranquil Lake Cumberland dock at golden hour' },
    { src: 'images/7.jpg', alt: 'Couples massage experience in serene lakeside studio' },
    { src: 'images/8.jpg', alt: 'Aromatherapy ritual with Kentucky botanicals and river stones' },
    { src: 'images/6.jpg', alt: 'Client in deep relaxation with lake view' },
    { src: 'images/1.jpg', alt: 'Serene sunrise on Lake Cumberland from the studio' },
    { src: 'images/2.jpg', alt: 'Sarah Sage Thompson, LMT — owner and lead therapist' }
  ];

  window.openLightbox = function (idx) {
    const item = galleryImages[idx] || galleryImages[0];
    if (!lightboxImg || !lightbox) return;
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    if (lightboxCaption) lightboxCaption.textContent = item.alt || '';
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    lastFocused = document.activeElement;
    const closeBtn = lightbox.querySelector('button');
    if (closeBtn) closeBtn.focus();
    untrap = trapFocus(lightbox);
  };

  window.closeLightbox = function () {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.add('hidden');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    if (untrap) { untrap(); untrap = null; }
    if (lastFocused) lastFocused.focus();
  };

  // =====================
  // FORMS + TOAST
  // =====================
  function showToast(message = 'Request received — we will be in touch!') {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      toast.classList.add('hidden');
      toast.setAttribute('aria-hidden', 'true');
    }, 4600);
  }

  window.handleBookingSubmit = function (e) {
    e.preventDefault();
    showToast('Thanks — your booking request was sent. We’ll confirm shortly.');
    const form = e.target;
    form.reset();
    closeBookingModal();
  };

  window.handleQuickBooking = function (e) {
    e.preventDefault();
    showToast('Quick booking request sent — thank you!');
    e.target.reset();
    closeBookingModal();
  };

  // =====================
  // WIRING: DATA-DRIVEN (ROBUST)
  // =====================
  function wireServiceCards() {
    const cards = $$('.service-card');
    cards.forEach((card) => {
      const idx = parseInt(card.getAttribute('data-service-index') || '0', 10);
      // Remove old inline handlers if any
      card.onclick = null;
      card.addEventListener('click', (e) => {
        e.preventDefault();
        showServiceModal(idx);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showServiceModal(idx);
        }
      });
      // Accessibility
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      if (!card.hasAttribute('role')) card.setAttribute('role', 'button');
      if (!card.hasAttribute('aria-label')) {
        const title = card.querySelector('h3');
        if (title) card.setAttribute('aria-label', 'View details for ' + title.textContent);
      }
    });
    log('Wired', cards.length, 'service cards');
  }

  function wireGallery() {
    const items = $$('[data-gallery-index]');
    items.forEach((el) => {
      const idx = parseInt(el.getAttribute('data-gallery-index'), 10);
      el.onclick = null;
      el.addEventListener('click', (ev) => {
        ev.preventDefault();
        openLightbox(idx);
      });
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') openLightbox(idx);
      });
      if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    });
    log('Wired', items.length, 'gallery items');
  }

  function wireForms() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.onsubmit = null;
      bookingForm.addEventListener('submit', window.handleBookingSubmit);
    }
    const quickForm = document.getElementById('quick-booking-form');
    if (quickForm) {
      quickForm.onsubmit = null;
      quickForm.addEventListener('submit', window.handleQuickBooking);
    }
    log('Forms wired');
  }

  // =====================
  // SCROLL REVEAL (Premium subtle animations)
  // =====================
  function initScrollReveals() {
    const reveals = $$('.reveal, .reveal-stagger');
    if (!('IntersectionObserver' in window) || reveals.length === 0) {
      // Fallback: show everything
      reveals.forEach(r => r.classList.add('visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => io.observe(el));
    log('Scroll reveals initialized');
  }

  // =====================
  // GLOBAL KEYBOARD
  // =====================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAnyOpenModal();
  });

  // =====================
  // YEAR + INIT
  // =====================
  (function setYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  })();

  function initAll() {
    // Wire interactive elements safely (data attrs)
    wireServiceCards();
    wireGallery();
    wireForms();

    // Scroll animations
    initScrollReveals();

    // PWA — robust service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => log('SW registered:', reg.scope))
        .catch(err => log('SW registration skipped:', err));
    }

    // Optional: close mobile on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && mobileMenu && !mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
      }
    }, { passive: true });

    // Expose a couple of helpers for console/demo
    window.Lakeside = { showServiceModal, openBookingModal, openLightbox };

    log('Lakeside Harmony premium demo initialized — Bluegrass Digital Forge');
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
