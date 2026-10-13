(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle ---------- */
  var themeToggle = document.querySelector('.theme-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0b0d12' : '#f7f7fb');
  }

  applyTheme(root.getAttribute('data-theme') || 'dark');

  themeToggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- Header shadow + mobile nav ---------- */
  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setNav(open) {
    header.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  navToggle.addEventListener('click', function () {
    setNav(!header.classList.contains('nav-open'));
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) {
      setNav(false);
      navToggle.focus();
    }
  });

  /* ---------- Scroll spy ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list a'));
  var linkById = {};
  navLinks.forEach(function (link) {
    linkById[link.getAttribute('href').slice(1)] = link;
  });

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        var link = linkById[entry.target.id];
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Stagger: grid children reveal one after another ---------- */
  document.querySelectorAll('.stagger').forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (el) { el.classList.add('reveal'); });
  });

  ['.stagger', '.project-grid', '.skill-groups', '.edu-grid', '.cert-list'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (list) {
      Array.prototype.forEach.call(list.children, function (el, i) {
        el.style.setProperty('--i', i % 6);
      });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealEls.forEach(function (el) { revealer.observe(el); });
  }

  /* ---------- Scroll progress + timeline line ---------- */
  var timeline = document.querySelector('.timeline');
  var ticking = false;

  function updateScrollEffects() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    root.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : 0);

    if (timeline) {
      var rect = timeline.getBoundingClientRect();
      var drawn = (window.innerHeight * 0.75 - rect.top) / rect.height;
      timeline.style.setProperty('--tl', Math.min(1, Math.max(0, drawn)).toFixed(4));
    }
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScrollEffects);
    }
  }, { passive: true });
  window.addEventListener('resize', updateScrollEffects);
  updateScrollEffects();

  /* ---------- Typing role rotator ---------- */
  var typed = document.querySelector('.typed');

  if (typed && !reduceMotion) {
    var words = typed.getAttribute('data-words').split('|');
    var wordIndex = 0;
    var charIndex = words[0].length;
    var deleting = false;

    var tick = function () {
      var word = words[wordIndex];
      if (deleting) {
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      } else {
        charIndex++;
      }
      typed.textContent = words[wordIndex].slice(0, charIndex);

      var delay = deleting ? 35 : 70;
      if (!deleting && charIndex === words[wordIndex].length) {
        deleting = true;
        delay = 2200;
      } else if (!deleting && charIndex === 0) {
        delay = 300;
      }
      setTimeout(tick, delay);
    };

    // Hold the first title before starting to cycle
    setTimeout(function () { deleting = true; tick(); }, 3000);
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll('[data-count]');

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var start = null;
    var duration = 1400;
    var step = function (ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var counterObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) {
      el.textContent = '0';
      counterObs.observe(el);
    });
  }

  /* ---------- Cursor spotlight on cards ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.project, .skill-group, .timeline-card, .core-skills li, .card').forEach(function (card) {
      card.classList.add('spotlight');
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Project filters ---------- */
  var projects = Array.prototype.slice.call(document.querySelectorAll('.project'));
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.chip-btn[data-filter]'));

  filterBtns.forEach(function (btn) {
    var filter = btn.getAttribute('data-filter');
    var count = filter === 'all'
      ? projects.length
      : projects.filter(function (p) { return p.getAttribute('data-category') === filter; }).length;
    btn.querySelector('.count').textContent = count;

    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      projects.forEach(function (p) {
        var match = filter === 'all' || p.getAttribute('data-category') === filter;
        p.hidden = !match;
        if (match) p.classList.add('is-visible');
      });
    });
  });

  /* ---------- Project modal ---------- */
  var modal = document.getElementById('project-modal');
  var modalMedia = modal.querySelector('.modal-media');
  var modalLabel = document.getElementById('modal-label');
  var modalTitle = document.getElementById('modal-title');
  var modalDesc = document.getElementById('modal-desc');
  var modalStack = document.getElementById('modal-stack');
  var modalLink = document.getElementById('modal-link');
  var lastTrigger = null;

  function openProject(card, trigger) {
    var d = card.dataset;
    lastTrigger = trigger;

    modalMedia.innerHTML = '';
    if (d.image) {
      var img = document.createElement('img');
      img.src = d.image;
      img.alt = d.title + ' screenshot';
      modalMedia.appendChild(img);
    } else {
      var ph = card.querySelector('.project-placeholder');
      if (ph) modalMedia.appendChild(ph.cloneNode(true));
    }

    modalLabel.textContent = d.label || '';
    modalTitle.textContent = d.title;
    modalDesc.textContent = d.desc;
    modalStack.textContent = d.stack;
    modalStack.parentElement.hidden = !d.stack;
    modalLink.hidden = !d.url;
    if (d.url) modalLink.href = d.url;

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
  }

  function closeModal() {
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
  }

  document.querySelectorAll('.project-media').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openProject(btn.closest('.project'), btn);
    });
  });

  modal.querySelector('.modal-close').addEventListener('click', closeModal);

  // Close when clicking the backdrop (outside the dialog box)
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  modal.addEventListener('close', function () {
    if (lastTrigger) lastTrigger.focus();
  });

  /* ---------- Back to top ---------- */
  document.querySelector('.back-top').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    // Move keyboard focus back to the start of the page without jumping
    document.querySelector('.brand').focus({ preventScroll: true });
    history.replaceState(null, '', location.pathname + location.search);
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
