'use strict';

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
const quickNav = document.getElementById('quickNav');
const topBtn = document.getElementById('topBtn');

function onScroll() {
  const y = window.scrollY;
  // 헤더 scrolled
  header.classList.toggle('scrolled', y > 60);
  // 퀵 네비 다크모드
  quickNav.classList.toggle('dark', y > window.innerHeight * 0.8);
  // 탑 버튼
  topBtn.classList.toggle('show', y > 400);
}
window.addEventListener('scroll', onScroll, { passive: true });
// 초기 실행 (페이지 로드 시 스크롤 위치 반영)
onScroll();

// ===== TOP BUTTON =====
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// 오버레이 동적 생성
const overlay = document.createElement('div');
overlay.className = 'mobile-overlay';
document.body.appendChild(overlay);

function toggleMenu(open) {
  hamburger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  overlay.classList.toggle('show', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
overlay.addEventListener('click', () => toggleMenu(false));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

// ===== HERO SLIDER =====
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let sliderTimer = null;

function goToSlide(idx) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (idx + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function startAutoSlide() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

document.getElementById('sliderNext').addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoSlide(); });
document.getElementById('sliderPrev').addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoSlide(); });
dots.forEach(dot => dot.addEventListener('click', () => { goToSlide(+dot.dataset.idx); startAutoSlide(); }));
startAutoSlide();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ===== ACTIVE SECTION (quick nav) =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.quick-nav li');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(li => li.classList.remove('active'));
      const match = document.querySelector(`.quick-nav a[data-section="${id}"]`);
      if (match) match.parentElement.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

// ===== SCROLL REVEAL =====
const revealTargets = document.querySelectorAll(
  '.about-card, .feature-card, .visiting-card, .rehab-type, .news-card, .stat-item'
);

revealTargets.forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-delay-1');
  if (i % 3 === 2) el.classList.add('reveal-delay-2');
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ===== REHAB TYPE TOGGLE =====
document.querySelectorAll('.rehab-type').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.rehab-type').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const privacy = document.getElementById('privacyCheck');
    if (!privacy.checked) { alert('개인정보 수집·이용에 동의해 주세요.'); return; }
    submitBtn.textContent = '신청 완료 ✓';
    submitBtn.classList.add('success');
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.textContent = '상담 신청하기';
      submitBtn.classList.remove('success');
      submitBtn.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}
