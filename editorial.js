/**
 * EDITORIAL BRUTALIST PORTFOLIO INTERACTION ENGINE
 * Powers dynamic name personalization, drawer navigation, and tactile interactions
 */

(function initEditorialPortfolio() {
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Personalization: {{ first name }} Interactive Slot
    const nameSlotBtn = document.getElementById('hero-name-slot-btn');
    const nameModal = document.getElementById('name-modal-overlay');
    const nameInput = document.getElementById('name-input-field');
    const nameForm = document.getElementById('name-modal-form');
    const nameDisplay = document.getElementById('hero-name-display');

    // Load saved visitor name from localStorage
    const savedName = localStorage.getItem('srinz_visitor_name');
    if (savedName && nameDisplay) {
      nameDisplay.textContent = savedName;
    }

    function openNameModal() {
      if (!nameModal) return;
      nameModal.classList.add('is-open');
      if (nameInput) {
        nameInput.value = savedName || '';
        setTimeout(() => nameInput.focus(), 100);
      }
    }

    function closeNameModal() {
      if (!nameModal) return;
      nameModal.classList.remove('is-open');
    }

    if (nameSlotBtn) {
      nameSlotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openNameModal();
      });
    }

    if (nameModal) {
      nameModal.addEventListener('click', (e) => {
        if (e.target === nameModal) {
          closeNameModal();
        }
      });
    }

    if (nameForm) {
      nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredName = nameInput.value.trim();
        if (enteredName) {
          localStorage.setItem('srinz_visitor_name', enteredName);
          if (nameDisplay) {
            nameDisplay.textContent = enteredName;
          }
        }
        closeNameModal();
      });
    }

    // 2. Fullscreen Drawer Navigation Takeover
    const burgerBtn = document.getElementById('nav-burger-btn');
    const drawer = document.getElementById('nav-drawer');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
      if (drawer) {
        drawer.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeDrawer() {
      if (drawer) {
        drawer.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    }

    if (burgerBtn) burgerBtn.addEventListener('click', openDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);

    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeNameModal();
        closeDrawer();
      }
    });

    // 3. Tactile Card Hover Rotations (Smooth Micro-Tilt Recovery)
    const cards = document.querySelectorAll('.work-tile-card');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.zIndex = '30';
      });
      card.addEventListener('mouseleave', () => {
        card.style.zIndex = '';
      });
    });

    console.log('✨ Editorial Portfolio Engine Initialized');
  });
})();
