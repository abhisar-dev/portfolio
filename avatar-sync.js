// Avatar sync and photo customization logic for Abhisar Kumar Portfolio
(function() {
  function syncAvatar() {
    const saved = localStorage.getItem('abhisar_custom_avatar');
    if (saved) {
      document.querySelectorAll('.profile-img').forEach(img => {
        img.src = saved;
      });
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    syncAvatar();

    const trigger = document.getElementById('avatarEditTrigger');
    const fileInput = document.getElementById('avatarFileInput');

    if (trigger && fileInput) {
      trigger.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            const dataUrl = event.target.result;
            localStorage.setItem('abhisar_custom_avatar', dataUrl);
            syncAvatar();
            
            // Visual feedback
            const frame = document.querySelector('.anime-avatar-frame');
            if (frame) {
              frame.style.transform = 'scale(1.08)';
              frame.style.boxShadow = '0 0 35px #facc15';
              setTimeout(() => {
                frame.style.transform = '';
                frame.style.boxShadow = '';
              }, 400);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });

  window.resetAvatar = function() {
    localStorage.removeItem('abhisar_custom_avatar');
    location.reload();
  };
})();
