// Phaness front page: hero mount, header state, mobile menu, demo videos.
import { mountHero } from './hero.js';

const canvas = document.querySelector('[data-hero]');
if (canvas) mountHero(canvas);

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
  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? toggle.dataset.closeLabel : toggle.dataset.openLabel;
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  header.querySelectorAll('.ph-nav a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
  });
}

// Demo videos: play on hover (fine pointers) or on click / tap.
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.ph-work__media').forEach((media) => {
  const video = media.querySelector('video');
  const button = media.querySelector('.ph-work__play');
  if (!video || !button) return;
  const play = () => video.play().catch(() => {});
  const sync = () => {
    const playing = !video.paused;
    media.classList.toggle('is-playing', playing);
    button.setAttribute('aria-pressed', String(playing));
  };
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  button.addEventListener('click', () => (video.paused ? play() : video.pause()));
  if (canHover && !prefersReducedMotion) {
    media.addEventListener('mouseenter', play);
    media.addEventListener('mouseleave', () => video.pause());
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

// Cal.com is embedded only after a visitor activates a booking link.
const bookingLinks = document.querySelectorAll('[data-booking]');
if (bookingLinks.length && 'HTMLDialogElement' in window && HTMLDialogElement.prototype.showModal) {
  const dialog = document.createElement('dialog');
  dialog.className = 'ph-booking';
  dialog.setAttribute('aria-label', 'Prendre rendez-vous');

  const close = document.createElement('button');
  close.className = 'ph-booking__close';
  close.type = 'button';
  close.textContent = 'Fermer';
  close.addEventListener('click', () => dialog.close());

  const frame = document.createElement('iframe');
  frame.className = 'ph-booking__frame';
  frame.title = 'Prendre rendez-vous avec Phaness';
  frame.loading = 'lazy';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.allow = 'payment';

  dialog.append(close, frame);
  document.body.append(dialog);
  dialog.addEventListener('close', () => frame.removeAttribute('src'));
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  bookingLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const bookingUrl = new URL(link.href, window.location.href);
      if (bookingUrl.protocol !== 'https:') return;
      event.preventDefault();
      bookingUrl.searchParams.set('embed', 'true');
      bookingUrl.searchParams.set('layout', 'month_view');
      frame.src = bookingUrl.href;
      dialog.showModal();
    });
  });
}
