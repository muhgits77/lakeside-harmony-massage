/* js/main.js
   Premium interactions for Lakeside Harmony — Bluegrass Digital Forge portfolio
   - Mobile-first, buttery interactions, perfect touch targets
   - Enhanced mobile menu
   - Scroll-reveal + subtle micro animations
   - Testimonials carousel (auto, touch friendly)
   - Data-driven service & gallery + improved lightbox (arrows + keyboard nav)
   - Modal focus trap + keyboard
   - Booking form: premium fake success UX + loading states
   - Strong PWA + offline ready
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
  let currentLightboxIndex = 0;
  let scrollLockCount = 0;

  function lockBodyScroll() {
    scrollLockCount++;
    if (scrollLockCount === 1) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
  }

  function unlockBodyScroll() {
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }

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
    lockBodyScroll();

    const first = serviceModal.querySelector('button');
    if (first) first.focus();
    untrap = trapFocus(serviceModal);
    log('Service modal opened:', s.name);
  };

  window.closeServiceModal = function () {
    if (!serviceModal) return;
    serviceModal.classList.add('hidden');
    serviceModal.setAttribute('aria-hidden', 'true');
    unlockBodyScroll();
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
    lockBodyScroll();
    const firstField = bookingModal.querySelector('input, select');
    if (firstField) setTimeout(() => firstField.focus(), 60);
    untrap = trapFocus(bookingModal);
  };

  window.closeBookingModal = function () {
    if (!bookingModal) return;
    bookingModal.classList.add('hidden');
    bookingModal.setAttribute('aria-hidden', 'true');
    unlockBodyScroll();
    if (untrap) { untrap(); untrap = null; }
    if (lastFocused) lastFocused.focus();
  };

  // =====================
  // LIGHTBOX
  // =====================
  const galleryImages = [
    { src: 'images/5.jpg', webp: 'images/5-1024w.webp', alt: 'Realistic interior of peaceful massage therapy studio overlooking Lake Cumberland — treatment table with white linens, warm wood tones, soft lighting' },
    { src: 'images/4.jpg', webp: 'images/4-1024w.webp', alt: 'Close-up hot stone therapy with Lake Cumberland river stones' },
    { src: 'images/3.jpg', webp: 'images/3-1024w.webp', alt: 'Tranquil Lake Cumberland dock at golden hour' },
    { src: 'images/7.jpg', webp: 'images/7-1024w.webp', alt: 'Couples massage experience in serene lakeside studio' },
    { src: 'images/8.jpg', webp: 'images/8-1024w.webp', alt: 'Aromatherapy ritual with Kentucky botanicals and river stones' },
    { src: 'images/6.jpg', webp: 'images/6-1024w.webp', alt: 'Client in deep relaxation with lake view' },
    { src: 'images/1.jpg', webp: 'images/1-1024w.webp', alt: 'Serene sunrise on Lake Cumberland from the studio' },
    { src: 'images/2.jpg', webp: 'images/2-640w.webp', alt: 'Sarah \'Sage\' Thompson, LMT — warm professional portrait with Lake Cumberland in background' }
  ];

  const testimonials = [
    { quote: "Sage is truly gifted. My lower back pain from years on the water is finally manageable. I drive from Somerset just for her sessions.", name: "— Michael R.", detail: "Lake Cumberland fisherman" },
    { quote: "My prenatal sessions with Sage were the highlight of my pregnancy. So gentle and intuitive. She used the most beautiful local oils.", name: "— Laura & Thomas P.", detail: "Jamestown" },
    { quote: "Best deep tissue I’ve ever had. The hot stone massage with the river stones is next-level. I feel brand new every time.", name: "— Jenna T.", detail: "Russell Springs" },
    { quote: "The couples retreat was magical. We left feeling completely restored. The lake view and attention to every detail made it unforgettable.", name: "— David & Mia S.", detail: "Lexington, KY" }
  ];

  window.openLightbox = function (idx) {
    const item = galleryImages[idx] || galleryImages[0];
    if (!lightboxImg || !lightbox) return;
    lightboxImg.src = item.webp || item.src;
    lightboxImg.alt = item.alt;
    if (lightboxCaption) lightboxCaption.textContent = item.alt || '';
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    currentLightboxIndex = idx;
    lastFocused = document.activeElement;
    lockBodyScroll();
    const closeBtn = lightbox.querySelector('button');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 30);
    untrap = trapFocus(lightbox);
  };

  window.closeLightbox = function () {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.add('hidden');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    unlockBodyScroll();
    if (untrap) { untrap(); untrap = null; }
    if (lastFocused) lastFocused.focus();
  };

  // Lightbox arrow nav helpers
  function lightboxNext() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    const item = galleryImages[currentLightboxIndex];
    if (lightboxImg) lightboxImg.src = item.webp || item.src;
    if (lightboxCaption) lightboxCaption.textContent = item.alt || '';
  }
  function lightboxPrev() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    const item = galleryImages[currentLightboxIndex];
    if (lightboxImg) lightboxImg.src = item.webp || item.src;
    if (lightboxCaption) lightboxCaption.textContent = item.alt || '';
  }

  // Keyboard nav for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.classList.contains('hidden')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); lightboxNext(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); lightboxPrev(); }
  });

  function enhanceLightbox() {
    if (!lightbox) return;
    const container = lightbox.querySelector('.max-w-\\[1100px\\]');
    if (!container) return;
    container.style.position = 'relative';

    const prev = document.createElement('button');
    prev.setAttribute('aria-label', 'Previous image');
    prev.className = 'hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 items-center justify-center bg-white/90 hover:bg-white active:bg-white text-[#1E3F47] w-10 h-10 rounded-2xl shadow-lg z-10';
    prev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prev.onclick = (ev) => { ev.stopImmediatePropagation(); lightboxPrev(); };

    const next = document.createElement('button');
    next.setAttribute('aria-label', 'Next image');
    next.className = 'hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center bg-white/90 hover:bg-white active:bg-white text-[#1E3F47] w-10 h-10 rounded-2xl shadow-lg z-10';
    next.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    next.onclick = (ev) => { ev.stopImmediatePropagation(); lightboxNext(); };

    container.appendChild(prev);
    container.appendChild(next);
  }

  // =====================
  // FORMS + PREMIUM FAKE SUCCESS FLOW (conversion focused UX)
  // =====================
  function showToast(message = 'Request received — we will be in touch!') {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      toast.classList.add('hidden');
      toast.setAttribute('aria-hidden', 'true');
    }, 4800);
  }

  // Premium success UX: elegant toast + success banner + auto close
  function showBookingSuccess(formEl) {
    // Show gorgeous toast first
    showToast('Thank you. Your booking request was received. Confirmation sent.');

    // Add a beautiful temporary success banner above form
    const banner = document.createElement('div');
    banner.className = 'mb-5 p-4 rounded-3xl bg-[#E8F4F0] border border-[#B8D3C8] flex gap-3 items-start text-sm';
    banner.innerHTML = `
      <div class="mt-0.5"><i class="fa-solid fa-check-circle text-[#2A5F6E] text-xl"></i></div>
      <div>
        <div class="font-semibold text-[#1E3F47]">Request confirmed</div>
        <div class="text-[#475569]">We sent a confirmation to your email. We will reach out within 2 hours.</div>
        <div class="font-mono text-[10px] mt-1 text-[#5C7C5D]">LH-${Date.now().toString().slice(-9)}</div>
      </div>`;
    const parent = formEl.parentNode;
    parent.insertBefore(banner, formEl);

    setTimeout(() => {
      closeBookingModal();
      setTimeout(() => banner.remove(), 240);
    }, 1850);
  }

  window.handleBookingSubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    // Fake loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="opacity-75">SENDING REQUEST...</span>';
    }
    form.reset();
    setTimeout(() => {
      showBookingSuccess(form);
    }, 680);
  };

  window.handleQuickBooking = function (e) {
    e.preventDefault();
    const form = e.target;
    const btns = form.querySelectorAll('button');
    btns.forEach(b => { b.disabled = true; });
    form.reset();
    setTimeout(() => {
      showBookingSuccess(form);
    }, 620);
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
  // TESTIMONIALS CAROUSEL — Subtle, calming, auto + manual
  // =====================
  let carouselTimer = null;
  let currentSlide = 0;

  function initTestimonialsCarousel() {
    const track = document.getElementById('testimonial-track');
    const dotsContainer = document.getElementById('testimonial-dots');
    const carousel = document.getElementById('testimonial-carousel');
    if (!track || !dotsContainer || !carousel) return;

    // Build slides
    track.innerHTML = testimonials.map((t, i) => `
      <div class="min-w-full px-6 py-6 text-sm" data-slide="${i}">
        <div class="flex gap-1 text-amber-400 mb-3">★★★★★</div>
        <p class="italic leading-snug text-[#475569]">"${t.quote}"</p>
        <div class="flex items-center gap-3 mt-4">
          <div class="font-semibold text-[#1E3F47]">${t.name}</div>
          <div class="text-xs px-2 py-px bg-white border border-[#EDE7DB] rounded-full text-[#64748B]">${t.detail}</div>
        </div>
      </div>
    `).join('');

    // Build dots
    dotsContainer.innerHTML = testimonials.map((_, i) => 
      `<button class="w-2 h-2 rounded-full transition-all ${i===0 ? 'bg-[#5C7C5D] w-5' : 'bg-[#C9C1AF]'}" data-dot="${i}" aria-label="Go to testimonial ${i+1}"></button>`
    ).join('');

    const slides = track.children;
    const dots = dotsContainer.querySelectorAll('button');

    function goToSlide(idx) {
      currentSlide = idx;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, i) => {
        if (i === idx) {
          d.classList.add('bg-[#5C7C5D]', 'w-5');
          d.classList.remove('bg-[#C9C1AF]', 'w-2');
        } else {
          d.classList.remove('bg-[#5C7C5D]', 'w-5');
          d.classList.add('bg-[#C9C1AF]', 'w-2');
        }
      });
    }

    function nextSlide() {
      goToSlide( (currentSlide + 1) % testimonials.length );
    }

    // Click dots
    dots.forEach((dot, i) => dot.addEventListener('click', () => {
      goToSlide(i);
      resetAuto();
    }));

    // Buttons
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide( (currentSlide - 1 + testimonials.length) % testimonials.length ); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAuto(); });

    // Auto-advance (serene, slow)
    function startAuto() {
      stopAuto();
      carouselTimer = setInterval(nextSlide, 5200);
    }
    function stopAuto() { if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; } }
    function resetAuto() { stopAuto(); startAuto(); }

    // Pause on interaction
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('touchstart', stopAuto, { passive: true });
    carousel.addEventListener('touchend', () => setTimeout(startAuto, 1800), { passive: true });

    // Keyboard arrows when carousel focused
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { nextSlide(); resetAuto(); }
      if (e.key === 'ArrowLeft') { goToSlide((currentSlide-1+testimonials.length)%testimonials.length); resetAuto(); }
    });

    // Touch swipe support (light)
    let startX = 0;
    carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, {passive:true});
    carousel.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) {
        if (dx < 0) nextSlide(); else goToSlide((currentSlide-1+testimonials.length)%testimonials.length);
        resetAuto();
      }
    }, {passive:true});

    // Init
    goToSlide(0);
    startAuto();
    log('Testimonials carousel initialized');
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

    // Testimonials carousel
    initTestimonialsCarousel();

    // Enhance lightbox with arrow nav
    enhanceLightbox();

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

    // Expose helpers
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
