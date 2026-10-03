// Main Interactive Engine for Abhisar Kumar Portfolio
(function() {
  'use strict';

  /* ==========================================================================
     1. THEME ENGINE - LIGHT YELLOW ANIME (OFFICIAL REQUESTED THEME)
     ========================================================================== */
  const THEME_KEY = 'abhisar_theme_preference';
  
  function initTheme() {
    // Default to the user's signature Light Yellow Anime theme
    const saved = localStorage.getItem(THEME_KEY);
    const initial = saved || 'light';
    setTheme(initial);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
        showToast(`Theme: ${next === 'dark' ? 'Cyber Obsidian' : 'Golden Anime'} ⚡`);
      });
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'dark' ? '☀️ <span>Day</span>' : '🌙 <span>Night</span>';
      toggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Golden Anime' : 'Cyber Night'} Mode`);
    }
  }

  /* ==========================================================================
     2. PROJECT FILTER TABS
     ========================================================================== */
  function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category.includes(filter)) {
            card.style.display = 'flex';
            card.classList.add('fade-in');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     3. TIMELINE & EXPERIENCE TABS
     ========================================================================== */
  function initTimelineTabs() {
    const tabBtns = document.querySelectorAll('.timeline-tab-btn');
    const panels = document.querySelectorAll('.timeline-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  /* ==========================================================================
     4. SPOTLIGHT COMMAND PALETTE (Ctrl+K / Cmd+K)
     ========================================================================== */
  function initCommandPalette() {
    const modal = document.getElementById('spotlightModal');
    const openBtn = document.getElementById('spotlightOpenBtn');
    const closeBtn = document.getElementById('spotlightCloseBtn');
    const input = document.getElementById('spotlightInput');
    const items = document.querySelectorAll('.spotlight-item');

    if (!modal) return;

    function openModal() {
      modal.classList.add('active');
      if (input) {
        input.value = '';
        input.focus();
        filterItems('');
      }
    }

    function closeModal() {
      modal.classList.remove('active');
    }

    function filterItems(query) {
      const q = query.toLowerCase().trim();
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = (q === '' || text.includes(q)) ? 'flex' : 'none';
      });
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (input) {
      input.addEventListener('input', (e) => filterItems(e.target.value));
    }

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal.classList.contains('active')) closeModal();
        else openModal();
      } else if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    // Handle item clicks in spotlight
    items.forEach(item => {
      item.addEventListener('click', () => {
        closeModal();
        const action = item.getAttribute('data-action');
        if (action === 'copy-email') {
          copyToClipboard('abhisarkumar70@gmail.com', 'Email copied to clipboard!');
        } else if (action === 'copy-phone') {
          copyToClipboard('+917488036476', 'Phone number copied!');
        } else if (action === 'toggle-theme') {
          const current = document.documentElement.getAttribute('data-theme') || 'light';
          setTheme(current === 'dark' ? 'light' : 'dark');
        } else if (action === 'open-resume') {
          window.open('resume.html', '_blank');
        }
      });
    });
  }

  /* ==========================================================================
     5. TOAST NOTIFICATIONS & COPY TRIGGERS
     ========================================================================== */
  function showToast(message) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'global-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`⚡ ${successMsg}`);
      });
    } else {
      const temp = document.createElement('input');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      temp.remove();
      showToast(`⚡ ${successMsg}`);
    }
  }

  function initCopyTriggers() {
    document.querySelectorAll('[data-copy]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const text = el.getAttribute('data-copy');
        copyToClipboard(text, `COPIED: ${text}`);
      });
    });
  }

  /* ==========================================================================
     6. INITIALIZATION ON DOM READY
     ========================================================================== */
  window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initProjectFilters();
    initTimelineTabs();
    initCommandPalette();
    initCopyTriggers();

    // Mobile nav toggle
    const toggle = document.getElementById('menuToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
      toggle.addEventListener('click', () => links.classList.toggle('nav-open'));
    }

    // EXP Bar animation
    const expFill = document.getElementById('hudExpFill');
    if (expFill) {
      setTimeout(() => expFill.style.width = '88%', 400);
    }
  });

  window.AK_APP = {
    showToast,
    copyToClipboard,
    setTheme
  };
})();
