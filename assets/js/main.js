/* ---------- Language ---------- */
(function () {
  var saved = null;
  try { saved = localStorage.getItem('bb-lang'); } catch (e) {}
  var lang = saved || (navigator.language && navigator.language.toLowerCase().indexOf('bg') === 0 ? 'bg' : 'bg');
  // Bulgarian is the default per brief
  setLang(lang);

  function setLang(l) {
    document.documentElement.setAttribute('lang', l);
    try { localStorage.setItem('bb-lang', l); } catch (e) {}
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-set-lang') === l);
    });
    // update elements carrying data-en / data-bg text attributes (for attributes like alt/title)
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var t = el.getAttribute('data-' + l);
      if (t !== null) el.textContent = t;
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-set-lang]');
    if (btn) { setLang(btn.getAttribute('data-set-lang')); }
  });

  window.__setLang = setLang;
})();

/* ---------- Nav scroll + burger ---------- */
(function () {
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 20); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  var burger = document.querySelector('.burger');
  var links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', function () { links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }
})();

/* ---------- Lightbox ---------- */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item[data-full]'));
  if (!items.length) return;
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML =
    '<button class="lightbox__close" aria-label="Close">&times;</button>' +
    '<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous">&#8249;</button>' +
    '<img alt="">' +
    '<button class="lightbox__nav lightbox__nav--next" aria-label="Next">&#8250;</button>';
  document.body.appendChild(box);
  var img = box.querySelector('img');
  var idx = 0;

  function open(i) { idx = i; img.src = items[idx].getAttribute('data-full'); box.classList.add('open'); }
  function close() { box.classList.remove('open'); img.src = ''; }
  function next(d) { idx = (idx + d + items.length) % items.length; img.src = items[idx].getAttribute('data-full'); }

  items.forEach(function (it, i) { it.addEventListener('click', function () { open(i); }); });
  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.querySelector('.lightbox__nav--prev').addEventListener('click', function (e) { e.stopPropagation(); next(-1); });
  box.querySelector('.lightbox__nav--next').addEventListener('click', function (e) { e.stopPropagation(); next(1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next(1);
    if (e.key === 'ArrowLeft') next(-1);
  });
})();

/* ---------- Audio players ---------- */
(function () {
  var tracks = Array.prototype.slice.call(document.querySelectorAll('.track[data-src]'));
  if (!tracks.length) return;

  var audio = new Audio();
  var current = null; // currently bound track element

  function fmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function timeText(el) {
    return el.querySelector('.track__time');
  }

  tracks.forEach(function (el) {
    var btn = el.querySelector('.track__play');
    var bar = el.querySelector('.track__bar');

    btn.addEventListener('click', function () {
      if (current === el && !audio.paused) {
        audio.pause();
        return;
      }
      if (current !== el) {
        // switch source
        if (current) current.classList.remove('playing');
        current = el;
        audio.src = el.getAttribute('data-src');
      }
      audio.play();
    });

    // seek by clicking the bar
    bar.addEventListener('click', function (e) {
      if (current !== el || !audio.duration) return;
      var r = bar.getBoundingClientRect();
      var ratio = (e.clientX - r.left) / r.width;
      audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
    });
  });

  audio.addEventListener('play', function () {
    if (current) current.classList.add('playing');
  });
  audio.addEventListener('pause', function () {
    if (current) current.classList.remove('playing');
  });
  audio.addEventListener('ended', function () {
    if (current) {
      current.classList.remove('playing');
      var f = current.querySelector('.track__fill');
      if (f) f.style.width = '0%';
    }
  });
  audio.addEventListener('timeupdate', function () {
    if (!current) return;
    var f = current.querySelector('.track__fill');
    var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    if (f) f.style.width = pct + '%';
    var t = timeText(current);
    if (t) t.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
  });
  audio.addEventListener('loadedmetadata', function () {
    if (!current) return;
    var t = timeText(current);
    if (t) t.textContent = '0:00 / ' + fmt(audio.duration);
  });
})();

/* ---------- Reveal on scroll ---------- */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('[data-reveal]');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.style.opacity = 1; en.target.style.transform = 'none'; io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) {
    el.style.opacity = 0; el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    io.observe(el);
  });
})();
