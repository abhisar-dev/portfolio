// Interactive Motion, Scroll Reveal & Typewriter for Abhisar Kumar's Portfolio
(function() {
  // 1. Scroll Reveal Intersection Observer
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          // Trigger counter if present
          const counter = entry.target.querySelector('[data-counter]');
          if (counter && !counter.dataset.counted) {
            animateCounter(counter);
          }
          
          // Optional: keep observing or unobserve once revealed
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // 2. Animated Number Counter
  function animateCounter(el) {
    el.dataset.counted = "true";
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1200;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(ease * target);
      el.textContent = `${prefix}${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    }
    requestAnimationFrame(update);
  }

  // 3. Dynamic Typewriter Effect
  function initTypewriter() {
    const el = document.getElementById('typewriterText');
    if (!el) return;

    const phrases = [
      "Full-Stack Web Architect",
      "AI & Machine Learning Developer",
      "SIH Top 100 & IIT BBS Finalist",
      "TypeScript & Python Builder",
      "100+ LeetCode DSA Problem Solver"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 100;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        el.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        delay = 45;
      } else {
        el.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        delay = 95;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        delay = 1800; // Pause at full phrase
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400; // Pause before next phrase
      }

      setTimeout(type, delay);
    }

    type();
  }

  // 4. Character HUD Progress Fill
  function initHudBar() {
    const fill = document.getElementById('hudExpFill');
    if (fill) {
      setTimeout(() => {
        fill.style.width = '88%';
      }, 300);
    }
  }

  // Initialize on DOM load
  window.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initTypewriter();
    initHudBar();
  });
})();
