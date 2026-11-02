// Phaness front page: header state, mobile menu, demo videos and booking.

// Header: transparent over the hero, frosted once the hero scrolls away.
const header = document.querySelector('[data-header]');
const hero = document.querySelector('.ph-hero');
if (header && hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting);
  }, { rootMargin: '-80px 0px 0px 0px' }).observe(hero.querySelector('.ph-hero__content') || hero);
}

// Mobile menu.
const toggle = document.querySelector('.ph-menu-toggle');
if (toggle && header) {
  const label = toggle.querySelector('.ph-menu-toggle__label');
  const nav = header.querySelector('.ph-nav');
  const mobile = matchMedia('(max-width: 1023px)');
  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? toggle.dataset.closeLabel : toggle.dataset.openLabel;
    if (nav) nav.inert = mobile.matches && !open;
  };
  setOpen(false);
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  header.querySelectorAll('.ph-nav a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  header.addEventListener('focusout', (event) => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });
  mobile.addEventListener('change', () => {
    const focusWasInNav = nav?.contains(document.activeElement);
    setOpen(false);
    if (mobile.matches && focusWasInNav) toggle.focus();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
  });
}

// Videos: native player, started by resting the pointer on them. One plays at a time; the others stop where they were.
// They keep playing after the pointer leaves and pause off screen.
const startsOnHover = matchMedia('(hover: hover) and (pointer: fine)').matches
  && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const videos = [...document.querySelectorAll('.ph-presentation__video, .ph-work__video')];
const pausedBySite = new WeakSet();
const pausedByVisitor = new WeakSet(); // A visitor's pause wins over hover until they press play again.
const pauseQuietly = (video) => {
  if (video.paused) return;
  pausedBySite.add(video);
  video.pause();
};
videos.forEach((video) => {
  video.addEventListener('play', () => {
    pausedByVisitor.delete(video);
    videos.filter((other) => other !== video).forEach(pauseQuietly);
  });
  video.addEventListener('pause', () => {
    if (!pausedBySite.delete(video) && !video.ended) pausedByVisitor.add(video);
  });
  if (startsOnHover) {
    video.addEventListener('mouseenter', () => {
      if (!pausedByVisitor.has(video)) video.play().catch(() => {});
    });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && document.fullscreenElement !== video) pauseQuietly(video);
    }).observe(video);
  }
});

// Sector tabs: the selected tab is the only tab in the normal tab sequence.
document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const activate = (tab, moveFocus = false) => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });
    if (moveFocus) tab.focus();
  };

  tablist.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab && tabs.includes(tab)) activate(tab);
  });
  tablist.addEventListener('keydown', (event) => {
    const current = tabs.indexOf(event.target.closest('[role="tab"]'));
    if (current < 0) return;
    let next = current;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % tabs.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    activate(tabs[next], true);
  });
});

// Reveal content as it enters the viewport. Without IntersectionObserver, everything stays visible.
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealItems = document.querySelectorAll(
    '.ph-section .ph-head, .ph-pillar, .ph-offer, .ph-step, .ph-point, .ph-work, .ph-why__visual, .ph-contact__details'
  );
  if (revealItems.length) {
    document.documentElement.classList.add('ph-reveal-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach((item, index) => {
      item.classList.add('ph-reveal');
      item.style.setProperty('--ph-reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
      observer.observe(item);
    });
  }
}

// Calendly is embedded only after a visitor activates a booking link.
const bookingLinks = document.querySelectorAll('[data-booking]');
if (bookingLinks.length && 'HTMLDialogElement' in window && HTMLDialogElement.prototype.showModal) {
  const dialog = document.createElement('dialog');
  dialog.className = 'ph-booking';
  dialog.setAttribute('aria-label', 'Prendre rendez-vous');

  const close = document.createElement('button');
  close.className = 'ph-booking__close';
  close.type = 'button';
  close.autofocus = true;
  close.textContent = 'Fermer';
  close.addEventListener('click', () => dialog.close());

  const external = document.createElement('a');
  external.className = 'ph-booking__external';
  external.textContent = 'Ouvrir Calendly';
  external.target = '_blank';
  external.rel = 'noopener noreferrer';
  external.href = bookingLinks[0].href;

  const frame = document.createElement('iframe');
  frame.className = 'ph-booking__frame';
  frame.title = 'Prendre rendez-vous avec Phaness';
  frame.loading = 'lazy';
  frame.referrerPolicy = 'no-referrer';
  frame.hidden = true;

  // Explain the third-party connection before assigning any iframe URL.
  const notice = document.createElement('div');
  notice.className = 'ph-booking__notice';
  const title = document.createElement('h2');
  title.textContent = 'Réserver avec Calendly';
  const details = document.createElement('p');
  details.textContent = 'En affichant les créneaux, vous vous connectez à Calendly. Ce service reçoit votre adresse IP et des informations sur votre navigateur, et peut traiter des données aux États-Unis. Ses choix de cookies restent disponibles dans le module.';
  const privacy = document.createElement('a');
  privacy.href = document.querySelector('a[href*="/politique-de-confidentialite/"]')?.href || new URL('/politique-de-confidentialite/', window.location.origin).href;
  privacy.textContent = 'Lire notre politique de confidentialité';
  const load = document.createElement('button');
  load.type = 'button';
  load.className = 'ph-btn ph-btn--primary';
  load.textContent = 'Afficher les créneaux';
  const alternative = document.createElement('p');
  alternative.append('Vous pouvez aussi nous écrire à ');
  // Reuse the configured contact address instead of maintaining a second setting.
  const email = document.querySelector('.ph-contact a[href^="mailto:"]');
  if (email) alternative.append(email.cloneNode(true));
  else alternative.append('l’adresse email indiquée dans la rubrique Contact.');
  notice.append(title, details, privacy, load, alternative);
  dialog.append(external, close, notice, frame);
  document.body.append(dialog);
  let opener;
  let destination;
  load.addEventListener('click', () => {
    if (!dialog.open || !destination) return;
    notice.hidden = true;
    frame.hidden = false;
    frame.src = destination;
    close.focus();
  });
  dialog.addEventListener('close', () => {
    frame.removeAttribute('src');
    frame.hidden = true;
    notice.hidden = false;
    destination = null;
    if (opener?.getClientRects().length && !opener.closest('[inert]')) opener.focus();
    else if (toggle?.getClientRects().length) toggle.focus();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  bookingLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const bookingUrl = new URL(link.href, window.location.href);
      if (bookingUrl.origin !== 'https://calendly.com' || bookingUrl.username || bookingUrl.password) return;
      event.preventDefault();
      opener = link;
      external.href = bookingUrl.href;
      destination = bookingUrl.href;
      dialog.showModal();
    });
  });
}
