/**
 * AI Finger FX Vision - Real-time Hand Tracking & Dynamic Camera FX
 * Decoupled High-Performance 60 FPS Render & AI Architecture
 */

(function () {
  'use strict';

  // --- DOM Elements ---
  const video = document.getElementById('webcamVideo');
  const canvas = document.getElementById('outputCanvas');
  const ctx = canvas.getContext('2d'); // Hardware-accelerated GPU context
  
  const fpsDisplay = document.getElementById('fpsDisplay');
  const fingerCountDisplay = document.getElementById('fingerCountDisplay');
  const confidenceDisplay = document.getElementById('confidenceDisplay');
  const aiStatusBadge = document.getElementById('aiStatusBadge');
  const aiStatusText = document.getElementById('aiStatusText');
  
  const effectBanner = document.getElementById('effectBanner');
  const fingerBadge = document.getElementById('fingerBadge');
  const effectNameTitle = document.getElementById('effectNameTitle');
  const effectSubTitle = document.getElementById('effectSubTitle');
  
  const cameraLoader = document.getElementById('cameraLoader');
  const loaderTitle = document.getElementById('loaderTitle');
  const loaderDesc = document.getElementById('loaderDesc');
  const startCamBtn = document.getElementById('startCamBtn');
  
  const toggleAudioBtn = document.getElementById('toggleAudioBtn');
  const audioIconOn = document.getElementById('audioIconOn');
  const audioIconOff = document.getElementById('audioIconOff');
  const toggleSkeletonBtn = document.getElementById('toggleSkeletonBtn');
  const flipCameraBtn = document.getElementById('flipCameraBtn');
  const stageContainer = document.getElementById('stageContainer');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const exitFullscreenBtn = document.getElementById('exitFullscreenBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconLight = document.getElementById('themeIconLight');
  const themeIconDark = document.getElementById('themeIconDark');
  const snapshotBtn = document.getElementById('snapshotBtn');
  const snapshotToast = document.getElementById('snapshotToast');
  
  const modeAutoBtn = document.getElementById('modeAutoBtn');
  const modeManualBtn = document.getElementById('modeManualBtn');
  const cameraSelect = document.getElementById('cameraSelect');
  const effectCards = document.querySelectorAll('.effect-card');
  const vhsOverlay = document.getElementById('vhsOverlay');
  const vhsTimeDisplay = document.getElementById('vhsTimeDisplay');
  
  const fingerDots = {
    thumb: document.getElementById('dot-thumb'),
    index: document.getElementById('dot-index'),
    middle: document.getElementById('dot-middle'),
    ring: document.getElementById('dot-ring'),
    pinky: document.getElementById('dot-pinky')
  };

  // --- Effects Configuration ---
  const EFFECTS = [
    {
      id: 0,
      title: 'ماتریس و خلأ دیجیتال (Matrix Void)',
      sub: 'دست مشت شده • جریان کدهای دیجیتال و خطوط اسکن',
      color: '#00ff88',
      glow: '0 0 25px rgba(0, 255, 136, 0.4)'
    },
    {
      id: 1,
      title: 'لیزر نئونی سایبرپانک (Neon Laser)',
      sub: '۱ انگشت باز • لیزر نئونی و کیوب‌های سه‌بعدی در حال سقوط',
      color: '#ff2a85',
      glow: '0 0 25px rgba(255, 42, 133, 0.4)'
    },
    {
      id: 2,
      title: 'صاعقه و منشور هولوگرام (Holo Arc)',
      sub: '۲ انگشت باز (علامت صلح) • جرقه‌های پلاسما و نور منشوری',
      color: '#00f2fe',
      glow: '0 0 25px rgba(0, 242, 254, 0.4)'
    },
    {
      id: 3,
      title: 'آتش شعله‌ور و شراره‌ها (Inferno Blaze)',
      sub: '۳ انگشت باز • زبانه‌های سوزان آتش و پرتاب ذرات گداخته',
      color: '#ff9900',
      glow: '0 0 25px rgba(255, 153, 0, 0.4)'
    },
    {
      id: 4,
      title: 'نوستالژی VHS و سینث‌ویو (Retro VHS 1984)',
      sub: '۴ انگشت باز • گلیچ آنالوگ، خطوط اسکن و رنگ‌های رترو',
      color: '#bf55ec',
      glow: '0 0 25px rgba(191, 85, 236, 0.4)'
    },
    {
      id: 5,
      title: 'سوپرنوا و گرداب کیهانی (Cosmic Supernova)',
      sub: '۵ انگشت باز (دست کامل باز) • ذرات ستاره‌ای و هاله‌های فضایی',
      color: '#4facfe',
      glow: '0 0 25px rgba(79, 172, 254, 0.4)'
    }
  ];

  // --- Application State ---
  let isAutoMode = true;
  let activeEffectIndex = 0;
  let isMirrored = true;
  let showSkeleton = true;
  let isAudioEnabled = true;
  let currentCameraStream = null;
  let mediaPipeHands = null;
  let isModelReady = false;
  let isAiInferring = false;
  
  // Performance and FPS Tracking
  let renderFrames = 0;
  let lastFpsTime = performance.now();
  let currentFps = 60;
  
  // Gesture Filtering & Smoothing
  const fingerHistory = [];
  const HISTORY_MAX = 3;
  let latestLandmarks = null;
  let currentFingerStates = { thumb: false, index: false, middle: false, ring: false, pinky: false };

  // --- Web Audio SFX Engine ---
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      if (AudioClass) audioCtx = new AudioClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playGestureSound(fingerNum) {
    if (!isAudioEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const freqs = [150, 440, 554, 659, 784, 880];
      const types = ['sine', 'sawtooth', 'triangle', 'sawtooth', 'square', 'sine'];
      
      osc.type = types[fingerNum] || 'sine';
      osc.frequency.setValueAtTime(freqs[fingerNum] || 440, now);

      if (fingerNum === 0) {
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.2);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      } else if (fingerNum === 1) {
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      } else {
        osc.frequency.exponentialRampToValueAtTime((freqs[fingerNum] || 440) * 1.5, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      }

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  // --- FX Simulation Systems ---
  const matrixCols = 32;
  const matrixDrops = new Array(matrixCols).fill(0).map(() => Math.floor(Math.random() * 40));
  const matrixChars = "0101XYZ0123456789アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロヲ".split('');

  const fireParticles = [];
  function createFireParticle(x, y) {
    return {
      x: x + (Math.random() - 0.5) * 16,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 4 - 2,
      size: Math.random() * 12 + 6,
      life: 1,
      r: 255,
      g: Math.floor(Math.random() * 160 + 70),
      b: 0
    };
  }

  const galaxyStars = [];
  for (let i = 0; i < 70; i++) {
    galaxyStars.push({
      angle: Math.random() * Math.PI * 2,
      distance: Math.random() * 150 + 25,
      speed: (Math.random() * 0.04 + 0.015) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 3 + 1,
      color: ['#00f2fe', '#4facfe', '#ffffff', '#ff2a85', '#ffd700'][Math.floor(Math.random() * 5)]
    });
  }

  const laserSparks = [];
  function addLaserSparks(x, y) {
    for (let i = 0; i < 2; i++) {
      laserSparks.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.5) * 7,
        life: 1,
        color: Math.random() > 0.5 ? '#00f2fe' : '#ff2a85'
      });
    }
  }

  const CUBE_COLORS = ['#ff2a85', '#00f2fe', '#ffd700', '#7afcff', '#bf55ec', '#00ff88'];
  const laserCubes = [];
  const cubeExplosionFragments = [];
  const MAX_LASER_CUBES = 5;
  let laserCubeSeeded = false;
  let laserCubeSpawnTimer = 0;

  function spawnLaserCube(w, startY) {
    const size = 24 + Math.random() * 16;
    return {
      x: Math.random() * (w - size * 2) + size,
      y: startY !== undefined ? startY : -size * 2,
      vy: 0.35 + Math.random() * 0.35,
      size,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      rotSpeedX: (Math.random() - 0.5) * 0.012,
      rotSpeedY: (Math.random() - 0.5) * 0.014,
      rotSpeedZ: (Math.random() - 0.5) * 0.01,
      color: CUBE_COLORS[Math.floor(Math.random() * CUBE_COLORS.length)],
      alive: true
    };
  }

  function rotatePoint3D(x, y, z, rx, ry, rz) {
    let cos = Math.cos(rx);
    let sin = Math.sin(rx);
    let y1 = y * cos - z * sin;
    let z1 = y * sin + z * cos;
    y = y1;
    z = z1;

    cos = Math.cos(ry);
    sin = Math.sin(ry);
    const x1 = x * cos + z * sin;
    z1 = -x * sin + z * cos;
    x = x1;
    z = z1;

    cos = Math.cos(rz);
    sin = Math.sin(rz);
    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos,
      z
    };
  }

  function project3D(x, y, z, focalLength) {
    const scale = focalLength / (focalLength + z);
    return { x: x * scale, y: y * scale, z, scale };
  }

  function draw3DCube(cx, cy, size, rotX, rotY, rotZ, color) {
    const half = size * 0.5;
    const verts = [
      [-half, -half, -half], [half, -half, -half], [half, half, -half], [-half, half, -half],
      [-half, -half, half], [half, -half, half], [half, half, half], [-half, half, half]
    ];
    const projected = verts.map(([vx, vy, vz]) => {
      const r = rotatePoint3D(vx, vy, vz, rotX, rotY, rotZ);
      const p = project3D(r.x, r.y, r.z, 520);
      return { x: cx + p.x, y: cy + p.y, z: p.z, scale: p.scale };
    });

    const faces = [
      { idx: [0, 1, 2, 3], shade: 0.35 },
      { idx: [4, 5, 6, 7], shade: 0.55 },
      { idx: [0, 1, 5, 4], shade: 0.45 },
      { idx: [2, 3, 7, 6], shade: 0.5 },
      { idx: [1, 2, 6, 5], shade: 0.65 },
      { idx: [0, 3, 7, 4], shade: 0.4 }
    ].map(face => ({
      ...face,
      avgZ: face.idx.reduce((sum, i) => sum + projected[i].z, 0) / 4
    })).sort((a, b) => a.avgZ - b.avgZ);

    faces.forEach(face => {
      ctx.beginPath();
      face.idx.forEach((vi, i) => {
        const p = projected[vi];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.globalAlpha = 0.55 + face.shade * 0.4;
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
      ctx.stroke();
    });

    return projected.reduce((sum, p) => sum + p.scale, 0) / projected.length;
  }

  function spawnCubeExplosion(x, y, color, size) {
    for (let i = 0; i < 10; i++) {
      cubeExplosionFragments.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 5.5,
        vy: (Math.random() - 0.5) * 5.5 - 1.2,
        size: size * (0.08 + Math.random() * 0.14),
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.18,
        life: 1,
        color
      });
    }
    for (let i = 0; i < 6; i++) {
      laserSparks.push({
        x: x + (Math.random() - 0.5) * size * 0.4,
        y: y + (Math.random() - 0.5) * size * 0.4,
        vx: (Math.random() - 0.5) * 9,
        vy: (Math.random() - 0.5) * 9,
        life: 1,
        color
      });
    }
  }

  function seedLaserCubes(w, h) {
    laserCubes.length = 0;
    for (let i = 0; i < 3; i++) {
      const cube = spawnLaserCube(w, h * (0.12 + i * 0.22));
      laserCubes.push(cube);
    }
  }

  function updateLaserCubes(w, h, beamStart, beamEnd) {
    laserCubeSpawnTimer += 1;
    if (laserCubes.length < MAX_LASER_CUBES && laserCubeSpawnTimer >= 90) {
      laserCubes.push(spawnLaserCube(w));
      laserCubeSpawnTimer = 0;
    }

    for (let i = laserCubes.length - 1; i >= 0; i--) {
      const cube = laserCubes[i];
      if (!cube.alive) {
        laserCubes.splice(i, 1);
        continue;
      }

      cube.y += cube.vy;
      cube.rotX += cube.rotSpeedX;
      cube.rotY += cube.rotSpeedY;
      cube.rotZ += cube.rotSpeedZ;

      if (beamStart && beamEnd) {
        const hitRadius = cube.size * 0.55;
        const hitDistance = distanceToSegment(
          cube.x, cube.y,
          beamStart.x, beamStart.y,
          beamEnd.x, beamEnd.y
        );
        if (hitDistance < hitRadius) {
          spawnCubeExplosion(cube.x, cube.y, cube.color, cube.size);
          laserCubes.splice(i, 1);
          continue;
        }
      }

      if (cube.y > h + cube.size * 2) {
        laserCubes.splice(i, 1);
      }
    }
  }

  function renderLaserCubes(w, h) {
    laserCubes.forEach(cube => {
      ctx.save();
      draw3DCube(cube.x, cube.y, cube.size, cube.rotX, cube.rotY, cube.rotZ, cube.color);
      ctx.restore();
    });
  }

  function renderCubeExplosionFragments() {
    for (let i = cubeExplosionFragments.length - 1; i >= 0; i--) {
      const frag = cubeExplosionFragments[i];
      frag.x += frag.vx;
      frag.y += frag.vy;
      frag.vy += 0.06;
      frag.rot += frag.rotSpeed;
      frag.life -= 0.035;

      if (frag.life <= 0) {
        cubeExplosionFragments.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(frag.x, frag.y);
      ctx.rotate(frag.rot);
      ctx.globalAlpha = frag.life;
      ctx.fillStyle = frag.color + 'aa';
      ctx.strokeStyle = frag.color;
      ctx.lineWidth = 1;
      ctx.shadowColor = frag.color;
      ctx.shadowBlur = 8;
      const s = frag.size;
      ctx.fillRect(-s * 0.5, -s * 0.5, s, s);
      ctx.strokeRect(-s * 0.5, -s * 0.5, s, s);
      ctx.restore();
    }
  }

  const hologramTiles = [];
  const hologramFragments = [];

  function spawnHologramTile(w) {
    const size = 22 + Math.random() * 40;
    return {
      x: Math.random() * (w - size * 2) + size,
      y: -size * 2,
      vy: 0.5 + Math.random() * 1.1,
      size,
      rotation: Math.random() * Math.PI,
      wobble: Math.random() * Math.PI * 2,
      glow: ['#00f2fe', '#7afcff', '#7a7dff', '#ff2a85'][Math.floor(Math.random() * 4)],
      broken: false,
      life: 1
    };
  }

  function spawnHologramFragments(x, y, color) {
    for (let i = 0; i < 12; i++) {
      hologramFragments.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 5 - 0.5,
        size: 3 + Math.random() * 6,
        life: 1,
        color,
        rotation: Math.random() * Math.PI * 2
      });
    }
  }

  function distanceToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSq = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSq));
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;
    return Math.hypot(px - closestX, py - closestY);
  }

  // --- Precision Finger Geometry Math ---
  function dist(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function analyzeHandFingers(landmarks) {
    const wrist = landmarks[0];
    const thumbIp = landmarks[3];
    const thumbTip = landmarks[4];
    const indexMcp = landmarks[5];
    const indexPip = landmarks[6];
    const indexTip = landmarks[8];
    const middleMcp = landmarks[9];
    const middlePip = landmarks[10];
    const middleTip = landmarks[12];
    const ringMcp = landmarks[13];
    const ringPip = landmarks[14];
    const ringTip = landmarks[16];
    const pinkyMcp = landmarks[17];
    const pinkyPip = landmarks[18];
    const pinkyTip = landmarks[20];

    const palmLen = dist(wrist, middleMcp) || 0.1;

    // 4 Main Fingers: Extended when Tip is farther from Wrist and MCP than PIP is
    const isIndexOpen = (
      dist(indexTip, wrist) > dist(indexPip, wrist) * 1.08 &&
      dist(indexTip, indexMcp) > dist(indexPip, indexMcp) * 1.15
    );

    const isMiddleOpen = (
      dist(middleTip, wrist) > dist(middlePip, wrist) * 1.08 &&
      dist(middleTip, middleMcp) > dist(middlePip, middleMcp) * 1.15
    );

    const isRingOpen = (
      dist(ringTip, wrist) > dist(ringPip, wrist) * 1.08 &&
      dist(ringTip, ringMcp) > dist(ringPip, ringMcp) * 1.15
    );

    const isPinkyOpen = (
      dist(pinkyTip, wrist) > dist(pinkyPip, wrist) * 1.08 &&
      dist(pinkyTip, pinkyMcp) > dist(pinkyPip, pinkyMcp) * 1.15
    );

    // Thumb: Extended when Tip is far from Pinky MCP and Index MCP
    const isThumbOpen = (
      dist(thumbTip, pinkyMcp) > dist(thumbIp, pinkyMcp) * 1.12 &&
      dist(thumbTip, indexMcp) > palmLen * 0.42 &&
      dist(thumbTip, wrist) > dist(thumbIp, wrist) * 1.05
    );

    const states = {
      thumb: isThumbOpen,
      index: isIndexOpen,
      middle: isMiddleOpen,
      ring: isRingOpen,
      pinky: isPinkyOpen
    };

    let count = 0;
    if (states.thumb) count++;
    if (states.index) count++;
    if (states.middle) count++;
    if (states.ring) count++;
    if (states.pinky) count++;

    return { count, states };
  }

  function updateGestureState(detectedCount, states) {
    fingerHistory.push(detectedCount);
    if (fingerHistory.length > HISTORY_MAX) fingerHistory.shift();

    const counts = {};
    let maxFreq = 0;
    let stableCount = detectedCount;
    for (const c of fingerHistory) {
      counts[c] = (counts[c] || 0) + 1;
      if (counts[c] > maxFreq) {
        maxFreq = counts[c];
        stableCount = c;
      }
    }

    currentFingerStates = states;
    fingerCountDisplay.textContent = stableCount;

    fingerDots.thumb.classList.toggle('open', states.thumb);
    fingerDots.index.classList.toggle('open', states.index);
    fingerDots.middle.classList.toggle('open', states.middle);
    fingerDots.ring.classList.toggle('open', states.ring);
    fingerDots.pinky.classList.toggle('open', states.pinky);

    if (isAutoMode && stableCount !== activeEffectIndex) {
      selectEffect(stableCount);
      playGestureSound(stableCount);
    }
  }

  function selectEffect(index) {
    if (index < 0 || index >= EFFECTS.length) return;
    activeEffectIndex = index;
    const effect = EFFECTS[index];

    fingerBadge.textContent = `${index} انگشت`;
    effectNameTitle.textContent = effect.title;
    effectSubTitle.textContent = effect.sub;
    effectBanner.style.borderColor = effect.color;
    effectBanner.style.boxShadow = effect.glow;

    effectCards.forEach(card => {
      const cardFingers = parseInt(card.dataset.fingers, 10);
      card.classList.toggle('active', cardFingers === index);
    });

    if (index === 4) {
      vhsOverlay.classList.remove('hidden');
    } else {
      vhsOverlay.classList.add('hidden');
    }

    if (index === 1) {
      laserCubeSeeded = false;
      laserCubeSpawnTimer = 0;
    } else {
      laserCubes.length = 0;
      cubeExplosionFragments.length = 0;
      laserCubeSeeded = false;
    }
  }

  // --- Hand Skeleton Visualizer ---
  const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [9, 10], [10, 11], [11, 12],
    [0, 13], [13, 14], [14, 15], [15, 16],
    [0, 17], [17, 18], [18, 19], [19, 20],
    [5, 9], [9, 13], [13, 17]
  ];

  function drawHandSkeleton(landmarks, w, h) {
    if (!showSkeleton || !landmarks) return;

    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 8;

    for (const [s, e] of HAND_CONNECTIONS) {
      const p1 = landmarks[s];
      const p2 = landmarks[e];
      const x1 = isMirrored ? (1 - p1.x) * w : p1.x * w;
      const y1 = p1.y * h;
      const x2 = isMirrored ? (1 - p2.x) * w : p2.x * w;
      const y2 = p2.y * h;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    landmarks.forEach((lm, idx) => {
      const x = isMirrored ? (1 - lm.x) * w : lm.x * w;
      const y = lm.y * h;
      const isTip = [4, 8, 12, 16, 20].includes(idx);

      ctx.beginPath();
      ctx.arc(x, y, isTip ? 5.5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = isTip ? '#ff2a85' : '#00f2fe';
      ctx.shadowColor = isTip ? '#ff2a85' : '#00f2fe';
      ctx.shadowBlur = isTip ? 12 : 5;
      ctx.fill();
    });

    ctx.restore();
  }

  // --- Real-time Visual Effects ---

  // Effect 0: Matrix Code Rain
  function renderMatrixEffect(w, h, landmarks) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 25, 10, 0.22)';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#00ff88';
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 6;
    ctx.font = '13px monospace';

    const colWidth = w / matrixCols;
    for (let i = 0; i < matrixCols; i++) {
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      const x = i * colWidth;
      const y = matrixDrops[i] * 18;
      ctx.fillText(char, x, y);

      if (y > h && Math.random() > 0.98) {
        matrixDrops[i] = 0;
      }
      matrixDrops[i]++;
    }

    // CRT Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 1.5);
    }

    if (landmarks && landmarks[9]) {
      const palm = landmarks[9];
      const px = (isMirrored ? 1 - palm.x : palm.x) * w;
      const py = palm.y * h;

      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.arc(px, py, 42, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = '11px monospace';
      ctx.fillStyle = '#00ff88';
      ctx.fillText('[CLOSED FIST // VOID LOCK]', px - 65, py + 62);
    }

    ctx.restore();
  }

  // Effect 1: Neon Laser Beam + Falling 3D Cubes
  function renderLaserEffect(w, h, landmarks) {
    ctx.save();
    ctx.fillStyle = 'rgba(121, 40, 202, 0.1)';
    ctx.fillRect(0, 0, w, h);

    let beamStart = null;
    let beamEnd = null;
    let tx = 0;
    let ty = 0;
    let beamEndX = 0;
    let beamEndY = 0;

    if (landmarks && landmarks[8]) {
      const tip = landmarks[8];
      const mcp = landmarks[5];
      tx = (isMirrored ? 1 - tip.x : tip.x) * w;
      ty = tip.y * h;
      const mx = (isMirrored ? 1 - mcp.x : mcp.x) * w;
      const my = mcp.y * h;

      let dx = tx - mx;
      let dy = ty - my;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      dx /= len;
      dy /= len;

      beamEndX = tx + dx * 1400;
      beamEndY = ty + dy * 1400;
      beamStart = { x: tx, y: ty };
      beamEnd = { x: beamEndX, y: beamEndY };
    }

    if (!laserCubeSeeded) {
      seedLaserCubes(w, h);
      laserCubeSeeded = true;
    }

    updateLaserCubes(w, h, beamStart, beamEnd);
    renderLaserCubes(w, h);

    if (beamStart && beamEnd) {
      // Outer laser bloom
      ctx.strokeStyle = 'rgba(255, 42, 133, 0.4)';
      ctx.lineWidth = 18;
      ctx.shadowColor = '#ff2a85';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(beamEndX, beamEndY);
      ctx.stroke();

      // Core beam
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(beamEndX, beamEndY);
      ctx.stroke();

      // Tip origin core
      ctx.beginPath();
      ctx.arc(tx, ty, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#ff2a85';
      ctx.shadowColor = '#ff2a85';
      ctx.shadowBlur = 20;
      ctx.fill();

      addLaserSparks(tx, ty);

      // Target reticle
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 8;
      const rot = performance.now() * 0.003;
      ctx.beginPath();
      ctx.arc(tx, ty, 35, rot, rot + Math.PI * 1.5);
      ctx.stroke();

      ctx.font = '10px monospace';
      ctx.fillStyle = '#00f2fe';
      ctx.fillText(`TARGET LOCK [${Math.round(tx)}, ${Math.round(ty)}]`, tx + 42, ty - 12);
      ctx.fillText(`PWR: 9800W // ACTIVE`, tx + 42, ty + 2);
    }

    renderCubeExplosionFragments();

    for (let i = laserSparks.length - 1; i >= 0; i--) {
      const s = laserSparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.05;
      if (s.life <= 0) {
        laserSparks.splice(i, 1);
        continue;
      }
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.5 * s.life, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Effect 2: Holographic Prism & Electric Arcs
  function renderHologramEffect(w, h, landmarks) {
    ctx.save();
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(0, 242, 254, 0.12)');
    grad.addColorStop(0.5, 'rgba(121, 40, 202, 0.08)');
    grad.addColorStop(1, 'rgba(255, 42, 133, 0.12)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (landmarks && landmarks[8] && landmarks[12]) {
      const x1 = (isMirrored ? 1 - landmarks[8].x : landmarks[8].x) * w;
      const y1 = landmarks[8].y * h;
      const x2 = (isMirrored ? 1 - landmarks[12].x : landmarks[12].x) * w;
      const y2 = landmarks[12].y * h;

      const ring = (Math.sin(performance.now() * 0.008) + 1) * 10 + 10;
      [[x1, y1], [x2, y2]].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, ring, 0, Math.PI * 2);
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 15;
        ctx.stroke();
      });

      // Electric arc
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      const segments = 8;
      const dx = (x2 - x1) / segments;
      const dy = (y2 - y1) / segments;
      for (let i = 1; i < segments; i++) {
        const jx = (Math.random() - 0.5) * 22;
        const jy = (Math.random() - 0.5) * 22;
        ctx.lineTo(x1 + dx * i + jx, y1 + dy * i + jy);
      }
      ctx.lineTo(x2, y2);
      ctx.stroke();

      while (hologramTiles.length < 12 && Math.random() < 0.3) {
        hologramTiles.push(spawnHologramTile(w));
      }

      for (let i = hologramTiles.length - 1; i >= 0; i--) {
        const tile = hologramTiles[i];
        if (tile.broken) {
          tile.life -= 0.04;
          if (tile.life <= 0) {
            hologramTiles.splice(i, 1);
          }
          continue;
        }

        tile.y += tile.vy;
        tile.rotation += 0.01;

        const hitDistance = distanceToSegment(tile.x, tile.y, x1, y1, x2, y2);
        if (hitDistance < tile.size * 0.9) {
          tile.broken = true;
          tile.life = 0.7;
          spawnHologramFragments(tile.x, tile.y, tile.glow);
          addLaserSparks(tile.x, tile.y);
        }

        if (tile.y > h + tile.size) {
          tile.y = -tile.size;
          tile.x = Math.random() * (w - tile.size * 2) + tile.size;
        }

        ctx.save();
        ctx.translate(tile.x, tile.y);
        ctx.rotate(tile.rotation + Math.sin((tile.y + performance.now() * 0.05) * 0.03) * 0.5);
        ctx.beginPath();
        ctx.moveTo(-tile.size * 0.4, -tile.size * 0.5);
        ctx.lineTo(tile.size * 0.7, -tile.size * 0.1);
        ctx.lineTo(tile.size * 0.25, tile.size * 0.7);
        ctx.lineTo(-tile.size * 0.75, tile.size * 0.25);
        ctx.closePath();
        ctx.fillStyle = tile.glow + '22';
        ctx.strokeStyle = tile.glow;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = tile.glow;
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      for (let i = hologramFragments.length - 1; i >= 0; i--) {
        const frag = hologramFragments[i];
        frag.x += frag.vx;
        frag.y += frag.vy;
        frag.vy += 0.04;
        frag.life -= 0.02;

        if (frag.life <= 0) {
          hologramFragments.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(frag.x, frag.y);
        ctx.rotate(frag.rotation);
        ctx.fillStyle = frag.color;
        ctx.shadowColor = frag.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(-frag.size / 2, -frag.size / 2, frag.size, frag.size * 1.2);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  // Effect 3: Inferno Fire & Embers
  function renderFireEffect(w, h, landmarks) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 69, 0, 0.12)';
    ctx.fillRect(0, 0, w, h);

    const activeTips = [];
    if (landmarks) {
      if (landmarks[8]) activeTips.push(landmarks[8]);
      if (landmarks[12]) activeTips.push(landmarks[12]);
      if (landmarks[16]) activeTips.push(landmarks[16]);
    }

    activeTips.forEach(tip => {
      const tx = (isMirrored ? 1 - tip.x : tip.x) * w;
      const ty = tip.y * h;
      for (let i = 0; i < 3; i++) {
        fireParticles.push(createFireParticle(tx, ty));
      }
    });

    ctx.globalCompositeOperation = 'lighter';
    for (let i = fireParticles.length - 1; i >= 0; i--) {
      const p = fireParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.03;
      p.size *= 0.97;

      if (p.life <= 0 || p.size <= 1) {
        fireParticles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.life})`;
      ctx.shadowColor = '#ff4500';
      ctx.shadowBlur = 10;
      ctx.fill();
    }

    if (activeTips.length >= 3) {
      const p0 = { x: (isMirrored ? 1 - activeTips[0].x : activeTips[0].x) * w, y: activeTips[0].y * h };
      const p1 = { x: (isMirrored ? 1 - activeTips[1].x : activeTips[1].x) * w, y: activeTips[1].y * h };
      const p2 = { x: (isMirrored ? 1 - activeTips[2].x : activeTips[2].x) * w, y: activeTips[2].y * h };

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 170, 0, 0.7)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ffaa00';
      ctx.shadowBlur = 14;
      ctx.stroke();
    }

    ctx.restore();
  }

  // Effect 4: Retro VHS Glitch
  function renderVhsEffect(w, h) {
    ctx.save();

    // Vintage CRT scanlines
    ctx.fillStyle = 'rgba(10, 0, 20, 0.2)';
    for (let y = 0; y < h; y += 3) {
      ctx.fillRect(0, y, w, 1);
    }

    // VHS Noise Tracking Bar
    const trackY = (performance.now() * 0.12) % (h + 60) - 30;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.fillRect(0, trackY, w, 20);

    // Vaporwave wash
    ctx.fillStyle = 'rgba(255, 0, 128, 0.08)';
    ctx.fillRect(0, 0, w, h);

    const date = new Date();
    const timeStr = `SP ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}:${Math.floor(date.getMilliseconds() / 10)}`;
    if (vhsTimeDisplay) vhsTimeDisplay.textContent = timeStr;

    ctx.restore();
  }

  // Effect 5: Cosmic Supernova & Galaxy Orbit
  function renderGalaxyEffect(w, h, landmarks) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 5, 35, 0.2)';
    ctx.fillRect(0, 0, w, h);

    let cx = w / 2;
    let cy = h / 2;

    if (landmarks && landmarks[9]) {
      cx = (isMirrored ? 1 - landmarks[9].x : landmarks[9].x) * w;
      cy = landmarks[9].y * h;
    }

    const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 120);
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    coreGrad.addColorStop(0.2, 'rgba(0, 242, 254, 0.5)');
    coreGrad.addColorStop(0.6, 'rgba(121, 40, 202, 0.25)');
    coreGrad.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(cx, cy, 120, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();

    ctx.globalCompositeOperation = 'lighter';
    galaxyStars.forEach(s => {
      s.angle += s.speed;
      const sx = cx + Math.cos(s.angle) * s.distance;
      const sy = cy + Math.sin(s.angle) * (s.distance * 0.6);

      ctx.beginPath();
      ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 8;
      ctx.fill();
    });

    if (landmarks) {
      const tips = [landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 8;

      tips.forEach(t => {
        const tx = (isMirrored ? 1 - t.x : t.x) * w;
        const ty = t.y * h;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(tx, ty, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 12;
        ctx.fill();
      });
    }

    ctx.restore();
  }

  // --- NON-BLOCKING ASYNC AI INFERENCE ---
  async function triggerAiInference() {
    if (isAiInferring || !mediaPipeHands || !isModelReady) return;
    if (video.paused || video.ended || video.readyState < 2) return;

    isAiInferring = true;
    try {
      await mediaPipeHands.send({ image: video });
    } catch (e) {
      // Ignore dropped frame
    } finally {
      isAiInferring = false;
    }
  }

  // --- 60 FPS MAIN RENDER LOOP (Decoupled, Zero-Freeze) ---
  function renderLoop() {
    if (video && !video.paused && !video.ended && video.readyState >= 2 && video.videoWidth > 0) {
      // Sync canvas dimensions
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const w = canvas.width;
      const h = canvas.height;

      // 1. Draw Raw Camera Feed (Real-time 60 FPS)
      ctx.save();
      if (isMirrored) {
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, w, h);
      ctx.restore();

      // 2. Render Active Camera Effect
      const lm = latestLandmarks ? latestLandmarks[0] : null;
      switch (activeEffectIndex) {
        case 0: renderMatrixEffect(w, h, lm); break;
        case 1: renderLaserEffect(w, h, lm); break;
        case 2: renderHologramEffect(w, h, lm); break;
        case 3: renderFireEffect(w, h, lm); break;
        case 4: renderVhsEffect(w, h); break;
        case 5: renderGalaxyEffect(w, h, lm); break;
        default: renderMatrixEffect(w, h, lm);
      }

      // 3. Render Hand Skeleton
      if (showSkeleton && lm) {
        drawHandSkeleton(lm, w, h);
      }

      // 4. Trigger AI inference non-blockingly
      triggerAiInference();

      // 5. Update Real-time FPS
      renderFrames++;
      const now = performance.now();
      if (now - lastFpsTime >= 1000) {
        currentFps = Math.round((renderFrames * 1000) / (now - lastFpsTime));
        fpsDisplay.textContent = currentFps;
        renderFrames = 0;
        lastFpsTime = now;
      }
    }

    requestAnimationFrame(renderLoop);
  }

  // --- MediaPipe Results Callback ---
  function onHandResults(results) {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      latestLandmarks = null;
      confidenceDisplay.textContent = '0%';
      aiStatusBadge.className = 'status-badge warning';
      aiStatusText.textContent = 'در انتظار ورود دست به تصویر...';
      return;
    }

    latestLandmarks = results.multiHandLandmarks;

    if (results.multiHandedness && results.multiHandedness[0]) {
      const score = Math.round((results.multiHandedness[0].score || 0.95) * 100);
      confidenceDisplay.textContent = `${score}%`;
    }

    aiStatusBadge.className = 'status-badge';
    aiStatusText.textContent = 'دست با موفقیت ردگیری شد';

    const primaryHand = results.multiHandLandmarks[0];
    const { count, states } = analyzeHandFingers(primaryHand);
    updateGestureState(count, states);
  }

  // --- Initialize MediaPipe Hands ---
  function initMediaPipe() {
    if (typeof window.Hands === 'undefined') {
      console.warn('Waiting for MediaPipe library...');
      setTimeout(initMediaPipe, 300);
      return;
    }

    try {
      mediaPipeHands = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      // modelComplexity: 0 (Lite model: ultra-fast, zero lag, smooth 60 FPS)
      mediaPipeHands.setOptions({
        maxNumHands: 2,
        modelComplexity: 0,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      mediaPipeHands.onResults(onHandResults);
      isModelReady = true;
      console.log('MediaPipe Hands Lite model ready.');
    } catch (err) {
      console.error('MediaPipe Init Error:', err);
    }
  }

  // --- Camera Streaming ---
  async function startWebcam(deviceId = null) {
    if (currentCameraStream) {
      currentCameraStream.getTracks().forEach(track => track.stop());
    }

    const constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user',
        ...(deviceId ? { deviceId: { exact: deviceId } } : {})
      },
      audio: false
    };

    try {
      loaderTitle.textContent = 'در حال اتصال به وبکم...';
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      currentCameraStream = stream;
      video.srcObject = stream;
      
      // Wait for video to have metadata and play
      await video.play();

      cameraLoader.style.opacity = '0';
      setTimeout(() => {
        cameraLoader.classList.add('hidden');
      }, 400);

      populateCameraList();
    } catch (err) {
      console.error('Webcam access error:', err);
      loaderTitle.textContent = 'خطا در دسترسی به دوربین';
      loaderDesc.textContent = `مرورگر امکان اتصال به وبکم را ندارد (${err.message || 'مجوز داده نشد'}). لطفاً اجازه دسترسی را صادر فرمایید.`;
      startCamBtn.classList.remove('hidden');
    }
  }

  async function populateCameraList() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      cameraSelect.innerHTML = '';
      videoDevices.forEach((dev, idx) => {
        const opt = document.createElement('option');
        opt.value = dev.deviceId;
        opt.textContent = dev.label || `دوربین ${idx + 1}`;
        cameraSelect.appendChild(opt);
      });
    } catch (e) {}
  }

  // --- Snapshot Photo Capture ---
  function takeSnapshot() {
    try {
      initAudio();
      playGestureSound(1);

      stageContainer.style.filter = 'brightness(2.2)';
      setTimeout(() => { stageContainer.style.filter = 'none'; }, 120);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Hand_FX_Photo_${activeEffectIndex}_Fingers.png`;
      link.href = dataUrl;
      link.click();

      snapshotToast.classList.remove('hidden');
      setTimeout(() => { snapshotToast.classList.add('hidden'); }, 3000);
    } catch (err) {
      console.error('Snapshot failed:', err);
    }
  }

  function applyTheme(theme) {
    const resolvedTheme = theme === 'light' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', resolvedTheme);
    const isLight = resolvedTheme === 'light';
    themeToggleBtn?.classList.toggle('active', isLight);
    themeToggleBtn?.setAttribute('title', isLight ? 'تغییر به حالت تاریک' : 'تغییر به حالت روشن');
    themeIconLight?.classList.toggle('hidden', isLight);
    themeIconDark?.classList.toggle('hidden', !isLight);
    localStorage.setItem('fingerfx-theme', resolvedTheme);
  }

  function isStageFullscreen() {
    const active = document.fullscreenElement || document.webkitFullscreenElement;
    return active === stageContainer;
  }

  function updateFullscreenButtonState() {
    const isFullscreen = isStageFullscreen();
    fullscreenBtn.classList.toggle('active', isFullscreen);
    fullscreenBtn.setAttribute('title', isFullscreen ? 'خروج از تمام صفحه' : 'تمام صفحه دوربین');
    stageContainer?.classList.toggle('is-fullscreen', isFullscreen);
    fullscreenBtn.disabled = !(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  }

  async function toggleFullscreen() {
    if (!stageContainer) return;

    const canFullscreen = document.fullscreenEnabled || document.webkitFullscreenEnabled;
    if (!canFullscreen) {
      console.warn('Fullscreen API is not supported or enabled in this browser.');
      return;
    }

    try {
      if (isStageFullscreen()) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      } else if (stageContainer.requestFullscreen) {
        await stageContainer.requestFullscreen();
      } else if (stageContainer.webkitRequestFullscreen) {
        stageContainer.webkitRequestFullscreen();
      }
    } catch (error) {
      console.warn('Camera fullscreen toggle failed:', error);
    }
  }

  // --- UI Event Listeners ---
  function setupEvents() {
    startCamBtn.addEventListener('click', () => {
      initAudio();
      startWebcam();
    });

    cameraSelect.addEventListener('change', (e) => {
      if (e.target.value) startWebcam(e.target.value);
    });

    flipCameraBtn.addEventListener('click', () => {
      isMirrored = !isMirrored;
      flipCameraBtn.classList.toggle('active', isMirrored);
    });

    toggleSkeletonBtn.addEventListener('click', () => {
      showSkeleton = !showSkeleton;
      toggleSkeletonBtn.classList.toggle('active', showSkeleton);
    });

    toggleAudioBtn.addEventListener('click', () => {
      isAudioEnabled = !isAudioEnabled;
      initAudio();
      audioIconOn.classList.toggle('hidden', !isAudioEnabled);
      audioIconOff.classList.toggle('hidden', isAudioEnabled);
      toggleAudioBtn.classList.toggle('active', isAudioEnabled);
    });

    fullscreenBtn.addEventListener('click', () => {
      toggleFullscreen();
    });

    exitFullscreenBtn?.addEventListener('click', () => {
      toggleFullscreen();
    });

    themeToggleBtn.addEventListener('click', () => {
      const nextTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });

    document.addEventListener('fullscreenchange', updateFullscreenButtonState);
    document.addEventListener('fullscreenerror', updateFullscreenButtonState);
    document.addEventListener('webkitfullscreenchange', updateFullscreenButtonState);
    updateFullscreenButtonState();

    snapshotBtn.addEventListener('click', takeSnapshot);

    modeAutoBtn.addEventListener('click', () => {
      isAutoMode = true;
      modeAutoBtn.classList.add('active');
      modeManualBtn.classList.remove('active');
    });

    modeManualBtn.addEventListener('click', () => {
      isAutoMode = false;
      modeManualBtn.classList.add('active');
      modeAutoBtn.classList.remove('active');
    });

    effectCards.forEach(card => {
      card.addEventListener('click', () => {
        initAudio();
        const fingers = parseInt(card.dataset.fingers, 10);
        selectEffect(fingers);
        playGestureSound(fingers);
      });
    });

    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });
  }

  // --- Init ---
  function init() {
    const savedTheme = localStorage.getItem('fingerfx-theme');
    const preferredTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    applyTheme(savedTheme || preferredTheme);

    setupEvents();
    initMediaPipe();
    selectEffect(0);
    startWebcam();
    // Launch decoupled 60 FPS render loop
    requestAnimationFrame(renderLoop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
