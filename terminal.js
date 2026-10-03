// Interactive Cyber CLI Terminal for Abhisar Kumar's Portfolio
// Shortcuts: Ctrl+K or Cmd+K or clicking the floating HUD button

(function() {
  'use strict';

  const COMMANDS = {
    help: `Available commands:
  - <b>skills</b>      : Display combat & tech proficiency matrix
  - <b>hackathons</b>  : View SIH Top 100 & IIT Bhubaneswar round 1 status
  - <b>stats</b>       : View LeetCode, internships & academic stats
  - <b>projects</b>    : Quick briefing on Orbis, life.rgb & Club platform
  - <b>resume</b>      : Open verified ATS resume sheet
  - <b>contact</b>     : Direct channels (Email, Phone, LinkedIn, GitHub)
  - <b>hire</b>        : Trigger mission recruitment protocol & celebration
  - <b>matrix</b>      : Run golden anime digital rain
  - <b>clear</b>       : Wipe terminal screen`,

    skills: `⚔️ [TECHNICAL MASTERY MATRIX]
--------------------------------------------------
[S-TIER] TypeScript, JavaScript (ES6+), React.js, Node.js
[A-TIER] Python, Scikit-Learn, Supervised ML, C/C++, Java
[TOOLS]  Git/GitHub, Express.js, Tailwind CSS, REST APIs, Linux
[THEORY] Data Structures & Algorithms, System Architecture`,

    hackathons: `🏆 [NATIONAL HACKATHON & RECOGNITION REPORT]
--------------------------------------------------
★ <b>SMART INDIA HACKATHON (SIH) INTERNAL</b>
  Rank: TOP 100 TEAMS across university selection.
  Scope: Real-world problem statement pitch & rapid architecture.

★ <b>IIT BHUBANESWAR HACKATHON 2026</b>
  Status: ROUND 1 CRACKED & ADVANCED to subsequent stages.
  Scope: Competing against premier collegiate engineering teams.

★ <b>LEETCODE DSA MILESTONE</b>
  Status: 100+ Problems Cleared (Arrays, Strings, Recursion, Two Pointers).`,

    stats: `📊 [PLAYER ATTRIBUTES & CREDENTIALS]
--------------------------------------------------
- Class       : BCA (AI & ML Specialization), Invertis University
- EXP Level   : 2026 Graduating Cohort (88% to Mastery)
- Internships : 2 Active (Zetheta Algorithms & InternCareerPath)
- DSA Score   : 100+ LeetCode Solutions
- Certs       : 7 Verified Technical Certifications
- Location    : Bareilly, UP & Remote Ready`,

    projects: `🚀 [ARSENAL OF FEATURED MISSIONS]
--------------------------------------------------
1. <b>Orbis</b> (Scalable Web Platform)
   TypeScript • Strict Type-Safety • 20+ Reusable Components
   Repo: https://github.com/abhisar-dev

2. <b>life.rgb</b> (Interactive Color-Space Tool)
   Pure JavaScript • 60 FPS Algorithmic Rendering • Zero Dependencies
   Repo: https://github.com/abhisar-dev

3. <b>College Club Platform</b>
   Responsive Event Management • Dynamic Announcements • Vanilla Stack`,

    contact: `📡 [DIRECT TRANSMISSION CHANNELS]
--------------------------------------------------
- Email    : <a href="mailto:abhisarkumar70@gmail.com" target="_blank" style="color:#facc15;">abhisarkumar70@gmail.com</a>
- Phone    : <a href="tel:+917488036476" style="color:#facc15;">+91-7488036476</a>
- GitHub   : <a href="https://github.com/abhisar-dev" target="_blank" style="color:#facc15;">github.com/abhisar-dev</a>
- LinkedIn : <a href="https://www.linkedin.com/in/abhisar-kumar-89a2872a0" target="_blank" style="color:#facc15;">linkedin.com/in/abhisar-kumar-89a2872a0</a>`,

    resume: `📄 Opening ATS-friendly Resume sheet...
<script>window.open('resume.html', '_blank');</script>
Resume available at <a href="resume.html" target="_blank" style="color:#facc15;">resume.html</a> or direct download <a href="resume.pdf" download style="color:#facc15;">resume.pdf</a>.`
  };

  let terminalEl = null;
  let isOpen = false;
  let commandHistory = [];
  let historyIndex = -1;

  function createTerminalDOM() {
    if (document.getElementById('akTerminalModal')) return;

    const overlay = document.createElement('div');
    overlay.id = 'akTerminalModal';
    overlay.className = 'ak-terminal-modal';
    overlay.innerHTML = `
      <div class="ak-terminal-backdrop" id="akTerminalBackdrop"></div>
      <div class="ak-terminal-box">
        <div class="ak-terminal-titlebar">
          <div class="titlebar-left">
            <span class="term-dot dot-red" id="termCloseBtn"></span>
            <span class="term-dot dot-yellow"></span>
            <span class="term-dot dot-green"></span>
            <span class="term-title">⚡ ABHISAR_OS // DEV_CONSOLE [v2.6.0]</span>
          </div>
          <div class="titlebar-right">
            <span class="term-badge">ESC to Exit</span>
          </div>
        </div>
        
        <div class="ak-terminal-quick-chips">
          <button class="term-chip" data-cmd="help">help</button>
          <button class="term-chip" data-cmd="skills">skills</button>
          <button class="term-chip" data-cmd="hackathons">hackathons</button>
          <button class="term-chip" data-cmd="stats">stats</button>
          <button class="term-chip" data-cmd="projects">projects</button>
          <button class="term-chip" data-cmd="hire">hire</button>
          <button class="term-chip" data-cmd="clear">clear</button>
        </div>

        <div class="ak-terminal-output" id="akTerminalOutput">
          <div class="term-line welcome-line">
            <b>⚡ ABHISAR KUMAR &bull; NEURAL COMMAND CLI INITIALIZED</b><br>
            Type <span class="term-hl">help</span> or tap any quick-action chip above to inspect stats, hackathons, and missions.
          </div>
        </div>

        <form class="ak-terminal-form" id="akTerminalForm">
          <span class="term-prompt">guest@abhisar-dev:~$</span>
          <input type="text" class="term-input" id="akTerminalInput" placeholder="type a command..." autocomplete="off" spellcheck="false">
          <button type="submit" class="term-send-btn">&#10148;</button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    // Floating Launch Button at bottom right
    const triggerBtn = document.createElement('button');
    triggerBtn.id = 'akTerminalTrigger';
    triggerBtn.className = 'floating-terminal-trigger';
    triggerBtn.innerHTML = `<span>⚡</span> <b>CLI</b> <kbd>Ctrl+K</kbd>`;
    triggerBtn.title = "Open Interactive Developer Terminal (Ctrl+K)";
    document.body.appendChild(triggerBtn);

    // Events
    triggerBtn.addEventListener('click', toggleTerminal);
    document.getElementById('termCloseBtn').addEventListener('click', closeTerminal);
    document.getElementById('akTerminalBackdrop').addEventListener('click', closeTerminal);

    const form = document.getElementById('akTerminalForm');
    const input = document.getElementById('akTerminalInput');
    const output = document.getElementById('akTerminalOutput');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = input.value.trim();
      if (!raw) return;
      handleCommand(raw);
      input.value = '';
    });

    // Quick chips
    document.querySelectorAll('.term-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        handleCommand(cmd);
        input.focus();
      });
    });

    // History and Keyboard navigation
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
          historyIndex++;
          input.value = commandHistory[commandHistory.length - 1 - historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[commandHistory.length - 1 - historyIndex];
        } else if (historyIndex === 0) {
          historyIndex = -1;
          input.value = '';
        }
      }
    });

    // Global Shortcut Ctrl+K or Cmd+K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleTerminal();
      } else if (e.key === 'Escape' && isOpen) {
        closeTerminal();
      }
    });
  }

  function toggleTerminal() {
    if (isOpen) {
      closeTerminal();
    } else {
      openTerminal();
    }
  }

  function openTerminal() {
    const modal = document.getElementById('akTerminalModal');
    if (!modal) return;
    modal.classList.add('term-active');
    isOpen = true;
    if (window.AK_SFX) window.AK_SFX.playTerminalOpen();
    setTimeout(() => {
      const input = document.getElementById('akTerminalInput');
      if (input) input.focus();
    }, 150);
  }

  function closeTerminal() {
    const modal = document.getElementById('akTerminalModal');
    if (!modal) return;
    modal.classList.remove('term-active');
    isOpen = false;
  }

  function handleCommand(cmdRaw) {
    const output = document.getElementById('akTerminalOutput');
    const input = document.getElementById('akTerminalInput');
    const cmd = cmdRaw.toLowerCase().trim();

    commandHistory.push(cmdRaw);
    historyIndex = -1;

    // Log the user's input line
    const userLine = document.createElement('div');
    userLine.className = 'term-line user-echo';
    userLine.innerHTML = `<span class="term-prompt">guest@abhisar-dev:~$</span> ${escapeHTML(cmdRaw)}`;
    output.appendChild(userLine);

    if (window.AK_SFX) window.AK_SFX.playBlip(750, 0.05);

    // Response
    const responseLine = document.createElement('div');
    responseLine.className = 'term-line term-response';

    if (cmd === 'clear') {
      output.innerHTML = '';
      return;
    } else if (cmd === 'hire') {
      triggerHireProtocol(responseLine);
    } else if (cmd === 'matrix') {
      triggerMatrixRain(responseLine);
    } else if (COMMANDS[cmd]) {
      responseLine.innerHTML = COMMANDS[cmd];
    } else if (cmd.startsWith('sudo')) {
      responseLine.innerHTML = `<span style="color:#ef4444;">⚠️ [PERMISSION_GRANTED] Welcome, Commander. S-Tier access authorized!</span>`;
      if (window.AK_SFX) window.AK_SFX.playPowerUp();
    } else {
      responseLine.innerHTML = `<span style="color:#ef4444;">Command not recognized: "${escapeHTML(cmd)}"</span>. Type <span class="term-hl">help</span> to view available instructions.`;
    }

    output.appendChild(responseLine);
    output.scrollTop = output.scrollHeight;
  }

  function triggerHireProtocol(container) {
    container.innerHTML = `
      <div style="padding: 0.5rem 0; color: #facc15; font-weight: bold;">
        🎉 [MISSION RECRUITMENT PROTOCOL INITIALIZED]
      </div>
      <div>Thank you for considering Abhisar Kumar for your squad!</div>
      <div style="margin-top: 0.5rem;">
        ⚡ Ready for Full-Time / S-Rank Internship opportunities.<br>
        📧 Email: <a href="mailto:abhisarkumar70@gmail.com" target="_blank" style="color:#fde047; text-decoration:underline;">abhisarkumar70@gmail.com</a><br>
        📞 Direct Call: <a href="tel:+917488036476" style="color:#fde047; text-decoration:underline;">+91-7488036476</a>
      </div>
    `;
    if (window.AK_SFX) window.AK_SFX.playPowerUp();
    triggerAnimeConfetti();
  }

  function triggerMatrixRain(container) {
    container.innerHTML = `<span style="color:#22c55e;">[WAKE UP, NEO... THE GOLDEN MATRIX HAS YOU]</span><br>01000001 01001011 00100000 01010011 00101101 01010100 01001001 01000101 01010010`;
    if (window.AK_SFX) window.AK_SFX.playBlip(900, 0.2);
  }

  function triggerAnimeConfetti() {
    // Generate mini golden anime sparks
    for (let i = 0; i < 30; i++) {
      const spark = document.createElement('div');
      spark.className = 'anime-confetti-spark';
      spark.style.left = (Math.random() * 80 + 10) + 'vw';
      spark.style.top = (Math.random() * 40 + 20) + 'vh';
      spark.style.animationDelay = (Math.random() * 0.4) + 's';
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 1200);
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  window.addEventListener('DOMContentLoaded', () => {
    createTerminalDOM();
  });
})();
