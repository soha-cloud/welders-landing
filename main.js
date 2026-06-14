'use strict';

// ===== FULLPAGE SCROLL ENGINE =====
const sections = Array.from(document.querySelectorAll('.fp-section'));
const navItems = Array.from(document.querySelectorAll('.quick-nav li'));
const footer = document.getElementById('footer');
const header = document.getElementById('header');
const quickNav = document.getElementById('quickNav');

let current = 0;
let isAnimating = false;
const TOTAL = sections.length;

function goTo(idx) {
  if (isAnimating || idx === current || idx < 0 || idx >= TOTAL) return;
  isAnimating = true;

  const prev = current;
  current = idx;

  // position all sections
  sections.forEach((sec, i) => {
    sec.classList.remove('active', 'above');
    if (i < current) sec.classList.add('above');
    else if (i === current) sec.classList.add('active');
    // else: default = below (translateY 100%)
  });

  // header style
  header.classList.toggle('scrolled', current > 0);

  // quick nav
  navItems.forEach((li, i) => li.classList.toggle('active', i === current));

  // quick nav text color (light/dark sections)
  const lightSections = [2, 3, 5]; // visiting, rehab, cases have light overlays
  quickNav.classList.toggle('dark', lightSections.includes(current));

  // footer: show on last section
  footer.classList.toggle('show', current === TOTAL - 1);

  setTimeout(() => { isAnimating = false; }, 900);
}

// ===== SCROLL EVENT =====
let wheelLock = false;
window.addEventListener('wheel', (e) => {
  if (wheelLock || isAnimating) return;
  wheelLock = true;
  setTimeout(() => { wheelLock = false; }, 1000);
  if (e.deltaY > 0) goTo(current + 1);
  else goTo(current - 1);
}, { passive: true });

// ===== TOUCH SUPPORT =====
let touchStartY = 0;
window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchend', (e) => {
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) > 50) {
    if (diff > 0) goTo(current + 1);
    else goTo(current - 1);
  }
}, { passive: true });

// ===== KEYBOARD =====
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') goTo(current + 1);
  if (e.key === 'ArrowUp' || e.key === 'PageUp') goTo(current - 1);
});

// ===== SCROLL INDICATORS =====
document.querySelectorAll('.scroll-indicator').forEach(el => {
  el.addEventListener('click', () => {
    const idx = parseInt(el.dataset.goto);
    if (!isNaN(idx)) goTo(idx);
  });
});

// ===== QUICK NAV CLICKS =====
navItems.forEach((li, i) => {
  li.addEventListener('click', (e) => {
    e.preventDefault();
    goTo(i);
  });
});

// ===== SERVICE CARD LINKS =====
document.querySelectorAll('[data-goto]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const idx = parseInt(el.dataset.goto);
    if (!isNaN(idx)) goTo(idx);
  });
});

// ===== GNB MEGA MENU HOVER =====
const megaMenu = document.getElementById('megaMenu');
const gnbEl = document.getElementById('gnb');

gnbEl.addEventListener('mouseenter', () => megaMenu.classList.add('show'));
gnbEl.addEventListener('mouseleave', () => megaMenu.classList.remove('show'));
megaMenu.addEventListener('mouseenter', () => megaMenu.classList.add('show'));
megaMenu.addEventListener('mouseleave', () => megaMenu.classList.remove('show'));

// ===== CASE TABS =====
document.querySelectorAll('.case-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.case-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ===== COUNTER ANIMATION =====
// Animate stat numbers when section 1 (daycare) is first visited
const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;
  statNums.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const step = target / (duration / 16);
    let val = 0;
    const timer = setInterval(() => {
      val = Math.min(val + step, target);
      el.textContent = Math.floor(val) + (val >= target ? suffix : '');
      if (val >= target) clearInterval(timer);
    }, 16);
  });
}

// ===== INIT =====
function init() {
  // Set initial state: section 0 active, rest below
  sections.forEach((sec, i) => {
    if (i === 0) sec.classList.add('active');
    // others have no class → default CSS makes them translateY(100%)
  });
  navItems[0].classList.add('active');
}

init();
