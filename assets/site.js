(function () {
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktop = function () { return matchMedia('(min-width: 900px)').matches; };
  var hasGsap = window.gsap && window.ScrollTrigger;

  var lenis = null;
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: 0 }); }
      });
    });
  }
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) lenis.on('scroll', ScrollTrigger.update);
  }

  requestAnimationFrame(function () { document.querySelectorAll('.lines.now').forEach(function (h) { h.classList.add('in'); }); });
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }); }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  document.querySelectorAll('.reveal, .lines:not(.now)').forEach(function (el) { io.observe(el); });

  var tio = new IntersectionObserver(function (es) { es.forEach(function (e) {
    if (e.isIntersecting) document.body.classList.toggle('on-dark', e.target.dataset.theme === 'dark');
  }); }, { rootMargin: '-8% 0px -88% 0px' });
  document.querySelectorAll('[data-theme]').forEach(function (s) { tio.observe(s); });
  addEventListener('scroll', function () { document.body.classList.toggle('scrolled', scrollY > 40); }, { passive: true });

  if (!hasGsap || reduced) return;

  if (document.querySelector('.hero') && desktop()) {
    gsap.set('.hero-tag', { opacity: 0, y: 40 });
    gsap.set('.proof', { opacity: 0, y: 50 });
    var tl = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
    tl.to('.hero-copy', { y: -160, opacity: 0, ease: 'none' }, 0)
      .to('.hero-cut .cut', { scale: 1.32, x: '-18vw', ease: 'none' }, 0)
      .to('.hero-ring', { rotate: 35, scale: 1.25, ease: 'none' }, 0)
      .to('.hero-bg', { backgroundPosition: '40% 70%', ease: 'none' }, 0)
      .to('.t1, .t3, .t5', { x: -220, opacity: 0, ease: 'none' }, 0)
      .to('.t2, .t4, .t6', { x: 220, opacity: 0, ease: 'none' }, 0)
      .fromTo('.hero-tag', { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'none' }, 0.35)
      .fromTo('.proof', { opacity: 0, y: 50 }, { opacity: 1, y: 0, ease: 'none' }, 0.55);
  }

  function stepper(sel, count, onStep) {
    var el = document.querySelector(sel);
    if (!el || !desktop()) return;
    ScrollTrigger.create({
      trigger: sel, start: 'top top', end: 'bottom bottom',
      onUpdate: function (s) { onStep(Math.min(count - 1, Math.floor(s.progress * count))); }
    });
  }
  stepper('.shift', 3, function (i) {
    document.querySelectorAll('.shift .pair').forEach(function (p, k) { p.classList.toggle('active', k === i); });
    var b = document.querySelector('.shift-index b'); if (b) b.textContent = '0' + (i + 1);
  });
  stepper('.process', 4, function (i) {
    document.querySelectorAll('.process .step').forEach(function (p, k) { p.classList.toggle('active', k === i); });
    document.querySelectorAll('.proc-dots i').forEach(function (d, k) { d.classList.toggle('on', k <= i); });
  });

  if (desktop()) {
    gsap.utils.toArray('[data-speed]').forEach(function (el) {
      gsap.to(el, { y: function () { return -parseFloat(el.dataset.speed) * 140; }, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }
})();