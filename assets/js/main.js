/* ==========================================================================
   Estética Thais Tutuy — interações e animações
   GSAP 3 + ScrollTrigger + ScrollSmoother + SplitText (carregados via CDN)
   Regras de movimento: design.md › seção 4
   ========================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP =
    typeof window.gsap !== 'undefined' &&
    typeof window.ScrollTrigger !== 'undefined' &&
    typeof window.ScrollSmoother !== 'undefined' &&
    typeof window.SplitText !== 'undefined';
  const animate = hasGSAP && !reduceMotion;

  const state = { smoother: null, menuOpen: false };

  /* ------------------------------------------------------------------------
     Funcionalidades que funcionam com ou sem GSAP
     ------------------------------------------------------------------------ */
  initYear();
  initHeader();
  initMenu();
  initAnchors();
  initFaq();

  if (!animate) {
    // Sem animação: mostra tudo no estado final
    root.classList.remove('js');
    return;
  }

  /* ------------------------------------------------------------------------
     Animações
     ------------------------------------------------------------------------ */
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });

  state.smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.2,
    effects: true,
    smoothTouch: 0.1,
  });

  // O preloader roda primeiro; a entrada do hero começa quando ele sai
  preloader(heroIntro);
  heroScroll();
  splitTitles();
  reveals();
  clipReveals();
  parallaxImages();
  moments();
  treatments();
  gallery();
  ebook();
  art();
  counters();

  // Recalcula posições quando tudo (imagens e fontes) terminar de carregar
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    if (location.hash) scrollToTarget($(location.hash), false);
  });

  /* ======================================================================== */

  function initYear() {
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  /* Header: esconde ao descer, volta ao subir; muda de estilo fora do topo */
  function initHeader() {
    const header = $('[data-header]');
    if (!header) return;
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 80);
      const goingDown = y > lastY;
      header.classList.toggle('is-hidden', goingDown && y > window.innerHeight * 0.6 && !state.menuOpen);
      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  /* Menu mobile (tela cheia) */
  function initMenu() {
    const toggle = $('[data-menu-toggle]');
    const menu = $('[data-menu]');
    const page = $('#smooth-wrapper');
    if (!toggle || !menu) return;
    const label = $('.sr-only', toggle);

    const open = () => {
      state.menuOpen = true;
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      label.textContent = 'Fechar menu';
      page.inert = true;
      document.body.style.overflow = 'hidden';
      state.smoother?.paused(true);

      if (animate) {
        gsap.fromTo(menu, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.9, ease: 'expo.inOut' });
        gsap.from($$('li, .btn', menu), { y: 40, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: 'expo.out', delay: 0.25 });
      }
      $('a', menu)?.focus();
    };

    const close = () => {
      if (!state.menuOpen) return;
      state.menuOpen = false;
      toggle.setAttribute('aria-expanded', 'false');
      label.textContent = 'Abrir menu';
      page.inert = false;
      document.body.style.overflow = '';
      state.smoother?.paused(false);

      if (animate) {
        gsap.to(menu, {
          clipPath: 'circle(0% at 100% 0%)', duration: 0.6, ease: 'expo.inOut',
          onComplete: () => { menu.hidden = true; gsap.set(menu, { clearProps: 'clipPath' }); },
        });
      } else {
        menu.hidden = true;
      }
    };

    state.closeMenu = close;
    toggle.addEventListener('click', () => (state.menuOpen ? close() : open()));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.menuOpen) { close(); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) close(); });
  }

  /* Links internos: rolagem suave compatível com o ScrollSmoother */
  function initAnchors() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;

      e.preventDefault();
      state.closeMenu?.();
      scrollToTarget(target, true);
      history.replaceState(null, '', id);
      if (target.id === 'conteudo') target.focus({ preventScroll: true });
    });
  }

  function scrollToTarget(target, smooth) {
    if (!target) return;
    const isTop = target.id === 'inicio' || target.id === 'conteudo';
    if (state.smoother) {
      state.smoother.scrollTo(target, smooth, isTop ? 'top top' : 'top 110px');
    } else {
      target.scrollIntoView({ behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
    }
  }

  /* FAQ em acordeão (um aberto por vez) */
  function initFaq() {
    const list = $('[data-faq]');
    if (!list) return;
    list.classList.add('faq-ready');
    const triggers = $$('.faq__trigger', list);

    const refresh = () => window.ScrollTrigger?.refresh();

    const setOpen = (btn, open) => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(open));

      if (open) {
        panel.classList.add('is-open');
        if (animate) {
          gsap.fromTo(panel, { height: 0, autoAlpha: 0 }, { height: 'auto', autoAlpha: 1, duration: 0.6, ease: 'power3.out', onComplete: refresh });
        } else refresh();
      } else if (animate) {
        gsap.to(panel, {
          height: 0, autoAlpha: 0, duration: 0.45, ease: 'power3.inOut',
          onComplete: () => { panel.classList.remove('is-open'); gsap.set(panel, { clearProps: 'height,opacity,visibility' }); refresh(); },
        });
      } else {
        panel.classList.remove('is-open');
        refresh();
      }
    };

    triggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        triggers.forEach((other) => {
          if (other !== btn && other.getAttribute('aria-expanded') === 'true') setOpen(other, false);
        });
        setOpen(btn, !isOpen);
      });
    });
  }

  /* --------------------------- Preloader ------------------------------- */
  /* Desenha o contorno da estrela, preenche com o degradê e sobe como cortina */
  function preloader(onDone) {
    const el = $('#preloader');
    if (!el) { onDone(); return; }

    const star = $('.preloader__star', el);
    const stroke = $('.preloader__stroke', el);
    const fill = $('.preloader__fill', el);
    const length = stroke.getTotalLength();

    gsap.set(el, { animation: 'none' }); // desliga o "sumir sozinho" do CSS
    gsap.set(stroke, { strokeDasharray: length, strokeDashoffset: length });
    state.smoother.paused(true);

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      state.smoother.paused(false);
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(onDone);
    };

    gsap.timeline({ delay: 0.2 })
      .fromTo(star, { scale: 0.8, rotate: -45 }, { scale: 1, rotate: 0, duration: 1.8, ease: 'power3.out' }, 0)
      .to(stroke, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0)
      .to(fill, { opacity: 1, duration: 0.7, ease: 'power1.out' }, '-=0.3')
      .to(stroke, { opacity: 0, duration: 0.4 }, '<0.3')
      .to(star, { scale: 1.12, duration: 0.5, ease: 'power2.inOut' }, '-=0.1')
      .to(el, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1,
        ease: 'expo.inOut',
        onStart: () => gsap.delayedCall(0.25, start),
        onComplete: () => el.remove(),
      }, '-=0.15')
      .to(star, { yPercent: -60, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, '<');

    // Garantia: se algo travar, a página aparece mesmo assim
    setTimeout(() => {
      if (started) return;
      el.remove();
      start();
    }, 6000);
  }

  /* ---------------------------- Hero ----------------------------------- */
  function heroIntro() {
    const title = $('.hero__title');
    const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'split-line' });

    gsap.set('[data-hero-intro]', { visibility: 'visible' });

    gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.4 } })
      .from('[data-hero-card]', { scale: 0.94, duration: 1.8 }, 0)
      .from('[data-hero-photo]', { scale: 1.12, yPercent: 6, autoAlpha: 0, duration: 2 }, 0.1)
      .from('.hero .eyebrow', { y: 20, autoAlpha: 0, duration: 1 }, 0.4)
      .from(split.lines, { yPercent: 110, stagger: 0.12 }, 0.45)
      .from('.hero__lead', { y: 24, autoAlpha: 0, duration: 1.2 }, 0.75)
      .from('.hero__actions > *', { y: 20, autoAlpha: 0, stagger: 0.1, duration: 1 }, 0.9)
      .from('.hero__address', { y: 16, autoAlpha: 0, duration: 1 }, 1.05)
      .from('[data-hero-signature]', { yPercent: 60, autoAlpha: 0, duration: 1.8 }, 0.7)
      .from('.site-header > *', { y: -24, autoAlpha: 0, stagger: 0.08, duration: 1, clearProps: 'transform,opacity,visibility' }, 0.5);
  }

  function heroScroll() {
    const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero__photo-wrap', { yPercent: 12, ease: 'none', scrollTrigger: st });
    gsap.to('[data-hero-signature]', { xPercent: -14, ease: 'none', scrollTrigger: { ...st } });
    // Valores iniciais explícitos: este efeito é criado enquanto o hero ainda está
    // escondido pelo preloader, então não pode "ler" o estado atual do texto.
    gsap.fromTo('.hero__content',
      { yPercent: 0, opacity: 1 },
      { yPercent: -8, opacity: 0.35, ease: 'none', immediateRender: false, scrollTrigger: { ...st, start: 'center center' } });
  }

  /* ----------------------- Títulos linha a linha ----------------------- */
  function splitTitles() {
    $$('[data-split]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
      });
    });
  }

  /* -------------------- Fade-up em cascata ----------------------------- */
  function reveals() {
    const items = $$('[data-reveal]');
    gsap.set(items, { y: 48, autoAlpha: 0 });
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => gsap.to(batch, {
        y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.12, ease: 'power3.out', overwrite: true,
      }),
    });
  }

  /* -------------------- Revelação de fotos por máscara ----------------- */
  function clipReveals() {
    $$('[data-clip]').forEach((el) => {
      gsap.fromTo(el,
        { clipPath: 'inset(12% 8% 12% 8% round 60px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          duration: 1.6,
          ease: 'expo.out',
          clearProps: 'clipPath',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
    });
  }

  function parallaxImages() {
    $$('[data-parallax-img]').forEach((img) => {
      gsap.fromTo(img, { yPercent: -8 }, {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  /* ------------------------- Seções ------------------------------------ */
  function moments() {
    $$('.moment-card__img').forEach((img) => {
      gsap.fromTo(img, { yPercent: 8 }, {
        yPercent: -2,
        ease: 'none',
        scrollTrigger: { trigger: img.closest('.moment-card'), start: 'top bottom', end: 'bottom 30%', scrub: true },
      });
    });
  }

  function treatments() {
    const mm = gsap.matchMedia();

    // Desktop: coluna da esquerda fica fixa enquanto os cards passam
    mm.add('(min-width: 1200px)', () => {
      const intro = $('[data-treatments-intro]');
      const list = $('[data-treatments-list]');
      const offset = 140;
      ScrollTrigger.create({
        trigger: list,
        start: `top ${offset}px`,
        end: () => `bottom ${offset + intro.offsetHeight}px`,
        pin: intro,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
    });

    $$('[data-treat-card]').forEach((card) => {
      gsap.from(card, {
        y: 80, scale: 0.95, autoAlpha: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 92%', once: true },
      });
      gsap.fromTo($('[data-treat-figure]', card), { yPercent: 10 }, {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'center center', scrub: true },
      });
    });
  }

  function gallery() {
    const track = $('[data-gallery]');
    if (!track) return;
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: { trigger: track, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
  }

  function ebook() {
    const st = { trigger: '[data-ebook]', start: 'top bottom', end: 'bottom top', scrub: true };
    gsap.fromTo('[data-ebook-mockup]', { yPercent: 8, rotate: -2 }, { yPercent: -6, rotate: 1, ease: 'none', scrollTrigger: st });
    gsap.fromTo('.ebook__shadow', { scaleX: 1 }, { scaleX: 0.82, autoAlpha: 0.6, ease: 'none', scrollTrigger: { ...st } });
  }

  function art() {
    gsap.from('[data-art-title] span', {
      yPercent: 60, autoAlpha: 0, duration: 1.3, stagger: 0.15, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-art-title]', start: 'top 85%', once: true },
    });

    gsap.from('[data-bubble]', {
      scale: 0, duration: 1.2, stagger: 0.2, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '.art__headline', start: 'top 80%', once: true },
    });

    const st = { trigger: '.art__headline', start: 'top bottom', end: 'bottom top', scrub: true };
    gsap.fromTo('[data-bubble="1"]', { y: 50, rotate: -8 }, { y: -50, rotate: 6, ease: 'none', scrollTrigger: st });
    gsap.fromTo('[data-bubble="2"]', { y: -30, rotate: 8 }, { y: 60, rotate: -6, ease: 'none', scrollTrigger: { ...st } });
  }

  function counters() {
    $$('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count);
      const counter = { value: 0 };
      el.textContent = '0';
      gsap.to(counter, {
        value: end,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.textContent = Math.round(counter.value); },
      });
    });
  }
})();
