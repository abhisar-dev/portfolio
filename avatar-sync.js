// Abhisar Kumar Official Portfolio - Profile Protection & System Enforcement
(function() {
  'use strict';

  // Clear any visitor-uploaded avatar cached from previous sessions
  try {
    if (localStorage.getItem('abhisar_custom_avatar')) {
      localStorage.removeItem('abhisar_custom_avatar');
    }
  } catch (e) {
    // LocalStorage might be restricted
  }

  // Enforce official avatar
  function enforceOfficialAvatar() {
    const officialSrc = 'images/profile.jpg';
    document.querySelectorAll('.profile-img').forEach(img => {
      if (img.getAttribute('src') !== officialSrc) {
        img.src = officialSrc;
      }
    });

    // Remove any leftover file inputs or edit buttons if cached in DOM
    const oldTrigger = document.getElementById('avatarEditTrigger');
    if (oldTrigger) oldTrigger.remove();
    const oldInput = document.getElementById('avatarFileInput');
    if (oldInput) oldInput.remove();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enforceOfficialAvatar);
  } else {
    enforceOfficialAvatar();
  }
})();
