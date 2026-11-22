/**
 * DINESH MALVEY - LUSION-INSPIRED 3D INTERACTIVE PORTFOLIO & RESUME
 * Core Systems:
 * 1. Full-screen WebGL 3D Particle Fluid Wave Simulation (Three.js)
 * 2. 3D Interactive Holographic Neural Core (Drag-to-Orbit Three.js Canvas)
 * 3. Fluid Magnetic Dual-Ring Cursor with Spring Damping
 * 4. 3D Perspective Tilt Physics & Mouse Spotlights on Cards
 * 5. Web Audio API Sci-Fi Synthesizer
 * 6. CLI Terminal, Interactive Matcher Simulator & KPI Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initThreeJsWaveBackground();
  init3DHologramCore();
  initCard3DTiltAndSpotlights();
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
  initResumeDownloadHandler();
  initMobileNav();
});

/* =====================================================================
   1. THREE.JS 3D PARTICLE FLUID WAVE BACKGROUND (LUSION-STYLE)
   ===================================================================== */
let globalThreeTheme = {
  primaryHex: 0x00f0ff,
  secondaryHex: 0x7000ff
};

let bgWaveParticles = null;
let bgScene = null;

function initThreeJsWaveBackground() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  bgScene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(0, 320, 520);
  camera.lookAt(0, 0, 0);

  // Responsive resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Particle Wave Grid Geometry
  const SEPARATION_X = 28;
  const SEPARATION_Y = 28;
  const AMOUNT_X = 65;
  const AMOUNT_Y = 65;
  const numParticles = AMOUNT_X * AMOUNT_Y;

  const positions = new Float32Array(numParticles * 3);
  const scales = new Float32Array(numParticles);

  let i = 0;
  for (let ix = 0; ix < AMOUNT_X; ix++) {
    for (let iy = 0; iy < AMOUNT_Y; iy++) {
      positions[i] = ix * SEPARATION_X - (AMOUNT_X * SEPARATION_X) / 2; // x
      positions[i + 1] = 0; // y (will be animated)
      positions[i + 2] = iy * SEPARATION_Y - (AMOUNT_Y * SEPARATION_Y) / 2; // z
      scales[i / 3] = 1.0;
      i += 3;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  // Custom Shader Material for Glowing 3D Particles
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(globalThreeTheme.primaryHex) }
    },
    vertexShader: `
      attribute float scale;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = scale * ( 240.0 / - mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      void main() {
        float r = length(gl_PointCoord - vec2(0.5));
        if (r > 0.5) discard;
        float alpha = smoothstep(0.5, 0.05, r);
        gl_FragColor = vec4( color, alpha * 0.75 );
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false
  });

  bgWaveParticles = new THREE.Points(geometry, particleMaterial);
  bgScene.add(bgWaveParticles);

  // Mouse reaction coordinates
  const mouse = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX - window.innerWidth / 2) * 0.45;
    mouse.targetY = (e.clientY - window.innerHeight / 2) * 0.35;
  });

  let count = 0;

  function animate() {
    requestAnimationFrame(animate);

    // Smooth camera inertia
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;
    camera.position.x = mouse.x;
    camera.position.y = 320 - mouse.y;
    camera.lookAt(0, 0, 0);

    // Animate fluid wave elevation
    const positionAttr = geometry.attributes.position;
    const array = positionAttr.array;
    count += 0.04;

    let idx = 0;
    for (let ix = 0; ix < AMOUNT_X; ix++) {
      for (let iy = 0; iy < AMOUNT_Y; iy++) {
        // Multi-layered sine wave for organic fluid motion
        const elevation =
          Math.sin((ix + count) * 0.3) * 36 +
          Math.sin((iy + count) * 0.4) * 36 +
          Math.sin((ix + iy + count) * 0.2) * 20;

        array[idx + 1] = elevation;
        idx += 3;
      }
    }

    positionAttr.needsUpdate = true;
    renderer.render(bgScene, camera);
  }

  animate();
}

/* =====================================================================
   2. 3D INTERACTIVE HOLOGRAPHIC NEURAL CORE (HERO THREE.JS CANVAS)
   ===================================================================== */
function init3DHologramCore() {
  const container = document.getElementById('hologramContainer');
  const canvas = document.getElementById('hologramCanvas');
  if (!container || !canvas || typeof THREE === 'undefined') return;

  const width = 220;
  const height = 220;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 5.2;

  // Central Hologram: Wireframe Torus Knot
  const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.38, 100, 16);
  const knotMat = new THREE.MeshBasicMaterial({
    color: globalThreeTheme.primaryHex,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  });
  const knotMesh = new THREE.Mesh(knotGeo, knotMat);
  scene.add(knotMesh);

  // Outer orbital rings
  const ringGeo = new THREE.RingGeometry(2.1, 2.14, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: globalThreeTheme.secondaryHex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6
  });
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI / 3;
  scene.add(ring1);

  const ring2 = new THREE.Mesh(ringGeo, ringMat);
  ring2.rotation.y = Math.PI / 2.5;
  scene.add(ring2);

  // Particle aura inside the core
  const auraCount = 140;
  const auraGeo = new THREE.BufferGeometry();
  const auraPos = new Float32Array(auraCount * 3);
  for (let i = 0; i < auraCount * 3; i += 3) {
    auraPos[i] = (Math.random() - 0.5) * 3.5;
    auraPos[i + 1] = (Math.random() - 0.5) * 3.5;
    auraPos[i + 2] = (Math.random() - 0.5) * 3.5;
  }
  auraGeo.setAttribute('position', new THREE.BufferAttribute(auraPos, 3));
  const auraMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.7
  });
  const auraPoints = new THREE.Points(auraGeo, auraMat);
  scene.add(auraPoints);

  // Interactive Orbit Drag Controls
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let momentum = { x: 0.006, y: 0.009 };

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    knotMesh.rotation.y += deltaX * 0.015;
    knotMesh.rotation.x += deltaY * 0.015;
    ring1.rotation.z += deltaX * 0.01;
    ring2.rotation.z += deltaY * 0.01;

    momentum = { x: deltaY * 0.002, y: deltaX * 0.002 };
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Touch support for mobile
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    knotMesh.rotation.y += deltaX * 0.015;
    knotMesh.rotation.x += deltaY * 0.015;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });

  function renderHologram() {
    requestAnimationFrame(renderHologram);

    if (!isDragging) {
      // Natural ambient rotation with residual momentum
      knotMesh.rotation.y += momentum.y;
      knotMesh.rotation.x += momentum.x;
      momentum.x *= 0.985;
      momentum.y *= 0.985;

      // Keep minimum idle spin
      if (Math.abs(momentum.x) < 0.003) momentum.x = 0.003;
      if (Math.abs(momentum.y) < 0.005) momentum.y = 0.005;

      ring1.rotation.z += 0.004;
      ring2.rotation.z -= 0.006;
      auraPoints.rotation.y += 0.002;
    }

    renderer.render(scene, camera);
  }

  renderHologram();

  // Expose color updater for theme switches
  window.updateHologramTheme = (hexPrimary, hexSecondary) => {
    knotMat.color.setHex(hexPrimary);
    ringMat.color.setHex(hexSecondary);
  };
}

/* =====================================================================
   3. 3D PERSPECTIVE TILT PHYSICS & DYNAMIC MOUSE SPOTLIGHTS
   ===================================================================== */
function initCard3DTiltAndSpotlights() {
  const cards = document.querySelectorAll('.spotlight-card, [data-tilt]');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update mouse spotlight position variables
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D Perspective Tilt computation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6; // Max 6deg
      const rotateY = ((x - centerX) / centerX) * 6;  // Max 6deg

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* =====================================================================
   5. SCI-FI AUDIO SYNTHESIZER (WEB AUDIO API - ZERO EXTERNAL ASSETS)
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
        osc.frequency.setValueAtTime(820, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.04);
        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(780, now + 0.08);
        osc.frequency.setValueAtTime(1040, now + 0.16);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'terminal') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);
        gain.gain.setValueAtTime(0.045, now);
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
   6. TEXT SCRAMBLE / DECODER EFFECT
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
    }, 28);
  }

  scramble();
  el.addEventListener('mouseenter', scramble);
}

/* =====================================================================
   7. TYPING ROLE SUBTITLE EFFECT
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
   8. STATS ANIMATED COUNTERS
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
   9. INNOVATION LAB TABS
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
   10. INTERACTIVE MATCHER SIMULATOR (RAPIDFUZZ + ML EMBEDDINGS)
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

  const masterDatabase = [
    { name: 'Phreesia Inc.', keys: ['phreesia', 'healthcare', 'patient'] },
    { name: 'Rayden Design Studio Pvt Ltd', keys: ['rayden', 'design', 'studio'] },
    { name: 'WNS Global Services', keys: ['wns', 'global', 'services'] },
    { name: 'Capita Business Services', keys: ['capita', 'services', 'ops'] },
    { name: 'Salesforce CRM Systems', keys: ['salesforce', 'crm', 'cloud'] }
  ];

  function evaluateMatch(inputVal) {
    if (!inputVal.trim()) return;

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

    const cosineSim = (0.84 + Math.random() * 0.14).toFixed(3);
    const confidencePct = (highestTokenScore * 0.5 + parseFloat(cosineSim) * 50).toFixed(1);

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
   11. KPI METRIC INTERACTIVE SIMULATOR
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
   12. SKILLS MATRIX FILTER
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
   13. INTERACTIVE CYBER TERMINAL CLI
   ===================================================================== */
function initCyberTerminal() {
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const quickChips = document.querySelectorAll('.t-chip');

  if (!terminalForm || !terminalInput || !terminalOutput) return;

  const commandResponses = {
    help: `Available Command Packets:
• <span class="highlight-cmd">download</span>   - Download official resume PDF (DineshMalvey_SeniorAnalyst.pdf)
• <span class="highlight-cmd">summary</span>    - Display executive biography & background
• <span class="highlight-cmd">skills</span>     - List core competencies & technical arsenal
• <span class="highlight-cmd">experience</span> - View chronological career timeline & companies
• <span class="highlight-cmd">innovations</span>- Inspect custom tools (Matcher App, AI enrichment)
• <span class="highlight-cmd">impact</span>     - Quantitative operational metrics & wins
• <span class="highlight-cmd">education</span>  - Academic credentials & university
• <span class="highlight-cmd">languages</span>  - Multilingual communication capabilities
• <span class="highlight-cmd">contact</span>    - Direct electronic mail, cellular & LinkedIn
• <span class="highlight-cmd">theme &lt;name&gt;</span>- Set theme accent (cyan | purple | emerald)
• <span class="highlight-cmd">matrix</span>     - Trigger Matrix digital cascade
• <span class="highlight-cmd">clear</span>      - Wipe terminal buffer`,

    download: `DISPATCHING DOSSIER PACKET:
Fetching DineshMalvey_SeniorAnalyst.pdf... Download initiated successfully!`,

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

    if (cmd === 'download' || cmd === 'resume' || cmd === 'pdf') {
      appendTerminal(`SYSTEM: Initiating secure transmission for <span class="highlight-cmd">DineshMalvey_SeniorAnalyst.pdf</span>...`);
      const link = document.createElement('a');
      link.href = 'DineshMalvey_SeniorAnalyst.pdf';
      link.download = 'DineshMalvey_SeniorAnalyst.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('DOWNLOADING: DineshMalvey_SeniorAnalyst.pdf');
      if (window.playCyberTone) window.playCyberTone('success');
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
   14. THEME ENGINE & SWITCHER (SYNCS THREE.JS COLORS)
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
    globalThreeTheme.primaryHex = 0x00f0ff;
    globalThreeTheme.secondaryHex = 0x7000ff;
  } else if (theme === 'purple') {
    globalThreeTheme.primaryHex = 0xd946ef;
    globalThreeTheme.secondaryHex = 0x3b82f6;
  } else if (theme === 'emerald') {
    globalThreeTheme.primaryHex = 0x00ff9d;
    globalThreeTheme.secondaryHex = 0x0ea5e9;
  }

  // Update Three.js Wave Shader Uniform
  if (bgWaveParticles && bgWaveParticles.material.uniforms) {
    bgWaveParticles.material.uniforms.color.value.setHex(globalThreeTheme.primaryHex);
  }

  // Update 3D Hologram Core colors
  if (window.updateHologramTheme) {
    window.updateHologramTheme(globalThreeTheme.primaryHex, globalThreeTheme.secondaryHex);
  }

  showToast(`THEME APPLIED: ${theme.toUpperCase()}`);
}

/* =====================================================================
   15. CLIPBOARD COPY TRIGGERS & TOAST NOTIFICATION
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
   16. LIVE TELEMETRY CLOCK (INDIA STANDARD TIME)
   ===================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
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
   17. RESUME PDF DOWNLOAD HANDLER
   ===================================================================== */
function initResumeDownloadHandler() {
  const downloadBtns = [
    document.getElementById('exportResumeBtn'),
    document.getElementById('heroDownloadBtn')
  ];

  downloadBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        showToast('DOWNLOADING: DineshMalvey_SeniorAnalyst.pdf');
        if (window.playCyberTone) window.playCyberTone('success');
      });
    }
  });
}

/* =====================================================================
   18. MOBILE NAVIGATION TOGGLE
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
