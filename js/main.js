/* ══════════════════════════════════════════
   SENTINEL — Main JavaScript
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Disclaimer Modal ──
  const modal = document.getElementById('disclaimerModal');
  const modalBtn = document.getElementById('disclaimerAccept');

  if (modal && modalBtn) {
    const dismissed = sessionStorage.getItem('sentinel_disclaimer_dismissed');
    if (dismissed) {
      modal.classList.add('hidden');
    }
    modalBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      sessionStorage.setItem('sentinel_disclaimer_dismissed', 'true');
    });
  }

  // ── Cookie Banner ──
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieManage = document.getElementById('cookieManage');

  if (cookieBanner) {
    const cookieChoice = localStorage.getItem('sentinel_cookies');
    if (cookieChoice) {
      cookieBanner.classList.add('hidden');
    }
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('sentinel_cookies', 'accepted');
      cookieBanner.classList.add('hidden');
    });
  }

  if (cookieManage) {
    cookieManage.addEventListener('click', () => {
      localStorage.setItem('sentinel_cookies', 'minimal');
      cookieBanner.classList.add('hidden');
    });
  }

  // ── Mobile Menu Toggle ──
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // ── Header Shrink on Scroll ──
  const header = document.querySelector('.header');
  if (header) {
    const scrollThreshold = 50;
    window.addEventListener('scroll', () => {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    });
  }

  // ── Active Nav Link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header__nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
