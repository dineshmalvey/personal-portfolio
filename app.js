/**
 * DINESH MALVEY - FUTURISTIC INTERACTIVE PORTFOLIO & RESUME
 * Core Logic: Canvas Particle Engine, Cyber Audio Synthesizer,
 * CLI Terminal, Matcher Simulator, Theme Engine & Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleBackground();
  initAudioSynthesizer();
  initTextScramble();
  initTypingEffect();
  initStatCounters();
  initInnovationTabs();
  initMatcherSimulator();
  initKpiSimulator();
  initSkillsFilter();
  initCyberTerminal();
  initThemeEngine();
  initCopyTriggers();
  initLiveClock();
  initPrintHandler();
  initMobileNav();
});

/* =====================================================================
   1. MOVING BACKGROUND: INTERACTIVE NEURAL PARTICLE CANVAS
   ===================================================================== */
let particleThemeColors = {
  primary: 'rgba(0, 240, 255, ',
  secondary: 'rgba(112, 0, 255, '
};

function initParticleBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  const mouse = {
    x: width / 2,
    y: height / 2,
    radius: 140,
    active: false
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.9;
      this.vy = (Math.random() - 0.5) * 0.9;
      this.radius = Math.random() * 2 + 1;
      this.baseRadius = this.radius;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.depth = Math.random() * 0.5 + 0.5;
    }

    update() {
      this.x += this.vx * this.depth;
      this.y += this.vy * this.depth;

      // Wrap boundaries
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse interactivity (gentle gravity / repulsive wave)
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2.5;
          this.y -= Math.sin(angle) * force * 2.5;
          this.radius = this.baseRadius + force * 2.5;
        } else {
          this.radius = this.baseRadius;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${particleThemeColors.primary}${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `${particleThemeColors.primary}0.8)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  let particles = [];
  function initParticles() {
    particles = [];
    const count = Math.floor((width * height) / 12000);
    const cappedCount = Math.min(Math.max(count, 45), 110);
    for (let i = 0; i < cappedCount; i++) {
      particles.push(new Particle());
    }
  }

  initParticles();

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `${particleThemeColors.primary}${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect to mouse cursor
      if (mouse.active) {
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          const mAlpha = (1 - mdist / 140) * 0.45;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `${particleThemeColors.secondary}${mAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* =====================================================================
   2. SCI-FI AUDIO SYNTHESIZER (WEB AUDIO API - ZERO EXTERNAL ASSETS)
   ===================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioSynthesizer() {
  const audioBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Play synthetic Sci-Fi tone
  window.playCyberTone = (type = 'click') => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(780, now + 0.08);
        osc.frequency.setValueAtTime(1040, now + 0.16);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'terminal') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch (e) {
      // Audio playback silently gracefully ignored
    }
  };

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        audioIcon.className = 'fa-solid fa-volume-high';
        window.playCyberTone('success');
        showToast('SCI-FI AUDIO FX: ACTIVE');
      } else {
        audioIcon.className = 'fa-solid fa-volume-xmark';
        showToast('SCI-FI AUDIO FX: MUTED');
      }
    });
  }

  // Attach hover sounds to interactive elements
  document.querySelectorAll('button, a, .chip-btn, .inno-tab, .t-chip').forEach((el) => {
    el.addEventListener('mouseenter', () => window.playCyberTone('hover'));
    el.addEventListener('click', () => window.playCyberTone('click'));
  });
}

/* =====================================================================
   3. TEXT SCRAMBLE / DECODER EFFECT
   ===================================================================== */
function initTextScramble() {
  const el = document.getElementById('scrambleName');
  if (!el) return;

  const chars = '!<>-_\\/[]{}—=+*^?#________0123456789ABCDEF';
  const originalText = el.getAttribute('data-value') || el.innerText;
  let iteration = 0;
  let interval = null;

  function scramble() {
    iteration = 0;
    clearInterval(interval);
    interval = setInterval(() => {
      el.innerText = originalText
        .split('')
        .map((letter, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 30);
  }

  scramble();
  el.addEventListener('mouseenter', scramble);
}

/* =====================================================================
   4. TYPING ROLE SUBTITLE EFFECT
   ===================================================================== */
function initTypingEffect() {
  const typingEl = document.getElementById('typingRole');
  if (!typingEl) return;

  const roles = [
    'Senior Data Analyst',
    'Business Intelligence Specialist',
    'Process & ETL Automation Engineer',
    'Applied ML & Fuzzy Matching Builder',
    'Salesforce Data Quality Expert'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typingEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      typingEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 2200; // Pause on complete
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 500; // Pause before next role
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* =====================================================================
   5. STATS ANIMATED COUNTERS
   ===================================================================== */
function initStatCounters() {
  const statCards = document.querySelectorAll('.stat-number[data-target]');
  if (!statCards.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          statCards.forEach((card) => {
            const target = parseInt(card.getAttribute('data-target'), 10);
            const span = card.querySelector('span') ? card.querySelector('span').outerHTML : '';
            let count = 0;
            const step = Math.max(Math.ceil(target / 40), 1);
            const timer = setInterval(() => {
              count += step;
              if (count >= target) {
                count = target;
                clearInterval(timer);
              }
              card.innerHTML = `${count}${span}`;
            }, 30);
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  const heroSection = document.getElementById('hero');
  if (heroSection) observer.observe(heroSection);
}

/* =====================================================================
   6. INNOVATION LAB TABS
   ===================================================================== */
function initInnovationTabs() {
  const tabs = document.querySelectorAll('.inno-tab');
  const contents = document.querySelectorAll('.inno-tab-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');

      tabs.forEach((t) => t.classList.remove('active'));
      contents.forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}

/* =====================================================================
   7. INTERACTIVE MATCHER SIMULATOR (RAPIDFUZZ + ML EMBEDDINGS)
   ===================================================================== */
function initMatcherSimulator() {
  const input = document.getElementById('matcherInput');
  const evalBtn = document.getElementById('runMatchBtn');
  const masterResult = document.getElementById('masterResult');
  const tokenScore = document.getElementById('tokenScore');
  const embedScore = document.getElementById('embedScore');
  const decisionBadge = document.getElementById('finalDecision');
  const barFill = document.getElementById('simConfidenceBar');
  const sampleChips = document.querySelectorAll('#matcherSamples .chip-btn');

  // Simulated Knowledge Base of Master Accounts
  const masterDatabase = [
    { name: 'Phreesia Inc.', keys: ['phreesia', 'healthcare', 'patient'] },
    { name: 'Rayden Design Studio Pvt Ltd', keys: ['rayden', 'design', 'studio'] },
    { name: 'WNS Global Services', keys: ['wns', 'global', 'services'] },
    { name: 'Capita Business Services', keys: ['capita', 'services', 'ops'] },
    { name: 'Salesforce CRM Systems', keys: ['salesforce', 'crm', 'cloud'] }
  ];

  function evaluateMatch(inputVal) {
    if (!inputVal.trim()) return;

    // Normalization & Token Set Simulation
    const clean = inputVal.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    let bestMaster = masterDatabase[0];
    let highestTokenScore = 55;

    masterDatabase.forEach((item) => {
      let matches = 0;
      item.keys.forEach((k) => {
        if (clean.includes(k)) matches++;
      });
      const score = 65 + matches * 12;
      if (score > highestTokenScore) {
        highestTokenScore = Math.min(score, 96);
        bestMaster = item;
      }
    });

    // Embedding Distance calculation (simulated cosine similarity)
    const cosineSim = (0.84 + Math.random() * 0.14).toFixed(3);
    const confidencePct = (highestTokenScore * 0.5 + parseFloat(cosineSim) * 50).toFixed(1);

    // Update UI with simulated calculation
    masterResult.innerText = bestMaster.name;
    tokenScore.innerText = `${highestTokenScore}%`;
    embedScore.innerText = `${cosineSim} cos(θ)`;
    barFill.style.width = `${confidencePct}%`;

    if (confidencePct >= 75) {
      decisionBadge.className = 'v badge-match';
      decisionBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> HIGH CONFIDENCE MATCH (${confidencePct}%)`;
    } else {
      decisionBadge.className = 'v badge-match review';
      decisionBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> MANUAL REVIEW QUEUE (${confidencePct}%)`;
    }

    if (window.playCyberTone) window.playCyberTone('success');
  }

  if (evalBtn && input) {
    evalBtn.addEventListener('click', () => evaluateMatch(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') evaluateMatch(input.value);
    });
  }

  sampleChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const sampleText = chip.getAttribute('data-input');
      if (input) {
        input.value = sampleText;
        evaluateMatch(sampleText);
      }
    });
  });
}

/* =====================================================================
   8. KPI METRIC INTERACTIVE SIMULATOR
   ===================================================================== */
function initKpiSimulator() {
  const buttons = document.querySelectorAll('#kpiButtons .kpi-btn');
  const kpiValue = document.getElementById('kpiValue');
  const kpiTrend = document.getElementById('kpiTrend');
  const kpiExpl = document.getElementById('kpiExpl');

  const metricsData = {
    roi: {
      val: '4.8x ROI',
      trend: '<i class="fa-solid fa-arrow-trend-up"></i> +34% YoY Attribution',
      positive: true,
      expl: 'Comprehensive multi-touch attribution model connecting Marketo nurture streams, Salesforce campaigns, and closed-won contract value.'
    },
    cpl: {
      val: '$142.50',
      trend: '<i class="fa-solid fa-arrow-trend-down"></i> -22% Cost Reduction',
      positive: true,
      expl: 'Optimized Paid Search and Content Syndication attribution pipelines, dropping cost-per-qualified-lead substantially.'
    },
    cac: {
      val: '$3,820',
      trend: '<i class="fa-solid fa-arrow-trend-down"></i> -18% Customer Acquisition Cost',
      positive: true,
      expl: 'Data-driven sales cadence restructuring with Groove intelligence lowered average account touchpoints to acquisition.'
    },
    tradeshow: {
      val: '280% Recovery',
      trend: '<i class="fa-solid fa-arrow-trend-up"></i> +$1.4M Pipeline Value',
      positive: true,
      expl: 'Post-event lead enrichment automation captured pipeline opportunities within 48 hours of booth badge scans.'
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const metricKey = btn.getAttribute('data-metric');
      const data = metricsData[metricKey];
      if (!data) return;

      kpiValue.style.opacity = 0;
      setTimeout(() => {
        kpiValue.innerText = data.val;
        kpiTrend.innerHTML = data.trend;
        kpiTrend.className = `kpi-trend ${data.positive ? 'positive' : 'negative'}`;
        kpiExpl.innerText = data.expl;
        kpiValue.style.opacity = 1;
      }, 150);
    });
  });
}

/* =====================================================================
   9. SKILLS MATRIX FILTER
   ===================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      skillCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* =====================================================================
   10. INTERACTIVE CYBER TERMINAL CLI
   ===================================================================== */
function initCyberTerminal() {
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const quickChips = document.querySelectorAll('.t-chip');

  if (!terminalForm || !terminalInput || !terminalOutput) return;

  const commandResponses = {
    help: `Available Command Packets:
• <span class="highlight-cmd">summary</span>     - Display executive biography & background
• <span class="highlight-cmd">skills</span>      - List core competencies & technical arsenal
• <span class="highlight-cmd">experience</span>  - View chronological career timeline & companies
• <span class="highlight-cmd">innovations</span> - Inspect custom tools (Matcher App, AI enrichment)
• <span class="highlight-cmd">impact</span>      - Quantitative operational metrics & wins
• <span class="highlight-cmd">education</span>   - Academic credentials & university
• <span class="highlight-cmd">languages</span>   - Multilingual communication capabilities
• <span class="highlight-cmd">contact</span>     - Direct electronic mail, cellular & LinkedIn
• <span class="highlight-cmd">theme &lt;name&gt;</span> - Set theme accent (cyan | purple | emerald)
• <span class="highlight-cmd">matrix</span>      - Trigger Matrix digital cascade
• <span class="highlight-cmd">clear</span>       - Wipe terminal buffer`,

    summary: `EXECUTIVE SUMMARY:
Senior Data Analyst with 9+ years experience in Business Intelligence, data analytics, CRM quality, and reporting automation (including 4+ years US healthcare-tech SaaS). Replaced legacy manual workflows with custom Python apps and automated reporting pipelines, eliminating 85% manual reporting effort and saving 4–5 days per data-matching cycle.`,

    skills: `TECHNICAL ARSENAL:
[1] Programming: Python (Pandas, PySide6, RapidFuzz, Streamlit), SQL, Power Automate, ETL
[2] BI & Viz: Power BI, Advanced DAX, Power Query (M), Qlik, Executive Dashboards
[3] CRM & Data: Salesforce CRM (Deduplication, Hierarchy, Enrichment), RevOps, Governance
[4] Applied ML: Fuzzy Matching, Gradient Boosting, Sentence-Transformers, LLM APIs (OpenAI, Claude)
[5] Sales & Market: Marketo, Qualtrics, Groove, ZoomInfo API, TAM Analysis
[6] Cloud: Microsoft Azure`,

    experience: `CAREER TIMELINE:
[2024 - Present] Senior Analyst – Marketing Analytics | Phreesia India (Pune – Remote)
[2022 - 2024]    Sr. Analyst – Sales Enablement | Rayden Design Studio (Phreesia Partner)
[2017 - 2022]    Lead Associate – Quality (5+ Yrs) | WNS Global Services, Pune
[2014 - 2016]    Senior Associate – Operations | Capita, Pune`,

    innovations: `ENGINEERED SOLUTIONS:
1. Account Matcher / Duplicate Finder: Python/PySide6 + RapidFuzz + ML Embeddings (70%+ accuracy)
2. 500k+ Contact Search Engine: Sub-5 min queries vs 2 hrs legacy
3. Autonomous Salesforce Enrichment: ZoomInfo API + LLMs for 300+ accounts/month
4. 20+ Enterprise Power BI Dashboards: ROI, CPL, CAC, funnel velocity`,

    impact: `QUANTITATIVE TELEMETRY:
• 85% Manual Reporting Effort Eliminated
• 70%+ Match Accuracy from 5–10% base
• 4–5 Days Saved Per 1,500 Accounts Cycle
• 500,000+ Salesforce Records Queried in < 5 Mins
• 40% Reporting Efficiency Boost across onshore/offshore teams
• 20+ Enterprise Power BI Dashboards Built`,

    education: `ACADEMIC CREDENTIALS:
Bachelor of Commerce (B.Com) [2013 – 2015]
Mahatma Gandhi University
Foundation in quantitative economics, commercial statistics, and accounting.`,

    languages: `SPOKEN & PROFESSIONAL LANGUAGES:
• English: Full Professional & Business Working Proficiency
• Hindi:   Native / Bilingual Fluency
• Marathi: Professional Working Proficiency`,

    contact: `TRANSMISSION CHANNELS:
• Electronic Mail: dinesh.malvey@hotmail.com
• Phone / Mobile:  +91 8055111164
• LinkedIn:        https://linkedin.com/in/dineshmalvey
• Base Location:   Rajsamand, Rajasthan, India`
  };

  function appendTerminal(lineHtml, isEcho = false) {
    const div = document.createElement('div');
    div.className = isEcho ? 'term-line term-cmd-echo' : 'term-line';
    div.innerHTML = lineHtml;
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function handleCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (window.playCyberTone) window.playCyberTone('terminal');
    appendTerminal(`user@antigravity:~$ ${rawCmd}`, true);

    if (cmd === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    if (cmd.startsWith('theme ')) {
      const themeName = cmd.split(' ')[1];
      if (['cyan', 'purple', 'emerald'].includes(themeName)) {
        setCyberTheme(themeName);
        appendTerminal(`SYSTEM: Theme switched to '${themeName.toUpperCase()}'.`);
      } else {
        appendTerminal(`ERROR: Unknown theme '${themeName}'. Valid options: cyan, purple, emerald.`);
      }
      return;
    }

    if (cmd === 'matrix') {
      appendTerminal(`<span style="color:#00ff9d;">[WAKE UP, NEO... THE MATRIX HAS YOU]</span>`);
      setCyberTheme('emerald');
      return;
    }

    if (commandResponses[cmd]) {
      appendTerminal(commandResponses[cmd].replace(/\n/g, '<br>'));
    } else {
      appendTerminal(`Command not recognized: '${cmd}'. Type <span class="highlight-cmd">help</span> for known directives.`);
    }
  }

  terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleCommand(terminalInput.value);
    terminalInput.value = '';
  });

  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      handleCommand(cmd);
    });
  });
}

/* =====================================================================
   11. THEME ENGINE & SWITCHER
   ===================================================================== */
function initThemeEngine() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeMenu = document.getElementById('themeMenu');
  const themeOpts = document.querySelectorAll('.theme-opt');

  if (themeBtn && themeMenu) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      themeMenu.classList.remove('show');
    });
  }

  themeOpts.forEach((opt) => {
    opt.addEventListener('click', () => {
      const theme = opt.getAttribute('data-set-theme');
      setCyberTheme(theme);
      themeOpts.forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });
}

function setCyberTheme(theme) {
  document.body.setAttribute('data-theme', theme);

  if (theme === 'cyan') {
    particleThemeColors.primary = 'rgba(0, 240, 255, ';
    particleThemeColors.secondary = 'rgba(112, 0, 255, ';
  } else if (theme === 'purple') {
    particleThemeColors.primary = 'rgba(217, 70, 239, ';
    particleThemeColors.secondary = 'rgba(59, 130, 246, ';
  } else if (theme === 'emerald') {
    particleThemeColors.primary = 'rgba(0, 255, 157, ';
    particleThemeColors.secondary = 'rgba(14, 165, 233, ';
  }

  showToast(`THEME APPLIED: ${theme.toUpperCase()}`);
}

/* =====================================================================
   12. CLIPBOARD COPY TRIGGERS & TOAST NOTIFICATION
   ===================================================================== */
function initCopyTriggers() {
  const triggers = document.querySelectorAll('.copy-trigger');
  triggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`COPIED: ${textToCopy}`);
          if (window.playCyberTone) window.playCyberTone('success');
        });
      }
    });
  });

  // Transmission Contact Form
  const transmissionForm = document.getElementById('transmissionForm');
  if (transmissionForm) {
    transmissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const subject = document.getElementById('msgSubject').value;
      const body = document.getElementById('msgBody').value;

      const mailtoLink = `mailto:dinesh.malvey@hotmail.com?subject=${encodeURIComponent(
        `[PORTFOLIO TRANSMISSION] ${subject}`
      )}&body=${encodeURIComponent(`Sender: ${name} (${email})\n\n${body}`)}`;

      window.location.href = mailtoLink;
      showToast('DISPATCHING EMAIL PACKET...');
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('cyberToast');
  if (!toast) return;
  const msgEl = toast.querySelector('.toast-msg');
  if (msgEl) msgEl.innerText = message;

  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/* =====================================================================
   13. LIVE TELEMETRY CLOCK (INDIA STANDARD TIME)
   ===================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    // Format in IST / UTC+05:30
    const timeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    clockEl.innerText = `IST (UTC+05:30) // ${timeStr}`;
  }

  update();
  setInterval(update, 1000);
}

/* =====================================================================
   14. PRINT / PDF EXPORT HANDLER
   ===================================================================== */
function initPrintHandler() {
  const printBtn = document.getElementById('printResumeBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      showToast('PREPARING CLEAN RESUME DOSSIER...');
      setTimeout(() => {
        window.print();
      }, 350);
    });
  }
}

/* =====================================================================
   15. MOBILE NAVIGATION TOGGLE
   ===================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('hudNav');

  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
      });
    });
  }
}
