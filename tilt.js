// 3D Card Tilt and Comic Toast notifications for Abhisar Kumar's Portfolio
(function() {
  'use strict';

  // 3D Tilt Effect on cards
  function initTilt() {
    const cards = document.querySelectorAll('.anime-avatar-frame, .trophy-card, .project-card, .exp-box, .combat-panel');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Toast Notification System
  function showToast(message, icon = '⚡') {
    let toast = document.getElementById('akMangaToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'akMangaToast';
      toast.className = 'ak-manga-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-msg">${message}</span>`;
    toast.classList.add('toast-show');

    if (window.AK_SFX) window.AK_SFX.playSuccess();

    setTimeout(() => {
      toast.classList.remove('toast-show');
    }, 2500);
  }

  // Copy to clipboard helper
  function setupCopyTriggers() {
    document.querySelectorAll('[data-copy]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const text = el.getAttribute('data-copy');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            showToast(`COPIED: ${text}`, '📋');
          });
        } else {
          // Fallback
          const temp = document.createElement('input');
          temp.value = text;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          temp.remove();
          showToast(`COPIED: ${text}`, '📋');
        }
      });
    });
  }

  window.AK_TOAST = { show: showToast };

  window.addEventListener('DOMContentLoaded', () => {
    initTilt();
    setupCopyTriggers();
  });
})();
