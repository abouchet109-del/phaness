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
  if (canHover) {
    media.addEventListener('mouseenter', play);
    media.addEventListener('mouseleave', () => video.pause());
  }
});
