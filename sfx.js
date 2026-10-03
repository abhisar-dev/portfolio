// SFX Engine using Web Audio API for Abhisar Kumar's Anime Portfolio
// Zero external files, zero network lag, synthesized retro-cyber anime sounds

(function() {
  'use strict';

  let audioCtx = null;
  let sfxEnabled = true;

  try {
    const saved = localStorage.getItem('abhisar_sfx_enabled');
    if (saved !== null) {
      sfxEnabled = (saved === 'true');
    }
  } catch (e) {}

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Sound: Futuristic UI Blip (Hover)
  function playBlip(freq = 600, duration = 0.04) {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  // Sound: Power Up / Rank Up (Hero HUD / S-Tier Badge)
  function playPowerUp() {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const freqs = [330, 440, 554, 659, 880];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + idx * 0.05;
        const dur = 0.12;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0.06, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + dur);
      });
    } catch (e) {}
  }

  // Sound: Cyber Laser / Terminal Open
  function playTerminalOpen() {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }

  // Sound: Toast Success / Copy
  function playSuccess() {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + (idx * 0.06);
        const dur = 0.15;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.05, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + dur);
      });
    } catch (e) {}
  }

  // Expose Global SFX API
  window.AK_SFX = {
    playBlip,
    playPowerUp,
    playTerminalOpen,
    playSuccess,
    toggleSFX: function() {
      sfxEnabled = !sfxEnabled;
      try {
        localStorage.setItem('abhisar_sfx_enabled', sfxEnabled);
      } catch (e) {}
      if (sfxEnabled) playSuccess();
      updateToggleUI();
      return sfxEnabled;
    },
    isEnabled: () => sfxEnabled
  };

  function updateToggleUI() {
    const btn = document.getElementById('sfxToggleBtn');
    if (btn) {
      btn.innerHTML = sfxEnabled ? '⚡ <span>SFX: ON</span>' : '🔇 <span>SFX: OFF</span>';
      btn.classList.toggle('sfx-muted', !sfxEnabled);
    }
  }

  // Attach interactive sounds on page load
  window.addEventListener('DOMContentLoaded', () => {
    updateToggleUI();

    const sfxBtn = document.getElementById('sfxToggleBtn');
    if (sfxBtn) {
      sfxBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.AK_SFX.toggleSFX();
      });
    }

    // Attach blip to all buttons & interactive cards
    const interactiveElements = document.querySelectorAll(
      '.btn, .nav-links a, .profile-pill-link, .trophy-card, .project-card, .character-hud'
    );
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => playBlip(550, 0.03));
    });

    // Special power-up sound on character HUD / rank click
    const hud = document.querySelector('.character-hud');
    if (hud) {
      hud.addEventListener('click', () => {
        playPowerUp();
        hud.classList.add('hud-surge');
        setTimeout(() => hud.classList.remove('hud-surge'), 600);
      });
    }

    // Unlock Audio Context on first interaction
    const unlockAudio = () => {
      getAudioContext();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
  });
})();
