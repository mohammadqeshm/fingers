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
  const faceEffectCards = document.querySelectorAll('.face-effect-card');
  const vhsOverlay = document.getElementById('vhsOverlay');
  const vhsTimeDisplay = document.getElementById('vhsTimeDisplay');

  const switchHandPageBtn = document.getElementById('switchHandPageBtn');
  const switchFacePageBtn = document.getElementById('switchFacePageBtn');
  const brandTitle = document.getElementById('brandTitle');
  const brandSubtext = document.getElementById('brandSubtext');
  const primaryMetricLabel = document.getElementById('primaryMetricLabel');
  const skeletonBtnLabel = document.getElementById('skeletonBtnLabel');
  const gestureIndicator = document.getElementById('gestureIndicator');
  const faceTelemetryHud = document.getElementById('faceTelemetryHud');
  const handDockTitle = document.getElementById('handDockTitle');
  const faceDockTitle = document.getElementById('faceDockTitle');
  const handEffectsGrid = document.getElementById('handEffectsGrid');
  const faceEffectsGrid = document.getElementById('faceEffectsGrid');
  const prevFaceFxBtn = document.getElementById('prevFaceFxBtn');
  const nextFaceFxBtn = document.getElementById('nextFaceFxBtn');
  const randomFaceFxBtn = document.getElementById('randomFaceFxBtn');

  // --- Draw Page DOM refs ---
  const switchDrawPageBtn = document.getElementById('switchDrawPageBtn');
  const drawTelemetryHud = document.getElementById('drawTelemetryHud');
  const drawStatusPill = document.getElementById('drawStatusPill');
  const drawStatusText = document.getElementById('drawStatusText');
  const hudColorSwatch = document.getElementById('hudColorSwatch');
  const hudSizeText = document.getElementById('hudSizeText');
  const hudStrokesCount = document.getElementById('hudStrokesCount');
  const drawDockTitle = document.getElementById('drawDockTitle');
  const drawToolsGrid = document.getElementById('drawToolsGrid');
  const toolPenBtn = document.getElementById('toolPenBtn');
  const toolEraserBtn = document.getElementById('toolEraserBtn');
  const brushSizeBadge = document.getElementById('brushSizeBadge');
  const drawSizeSlider = document.getElementById('drawSizeSlider');
  const drawCustomColor = document.getElementById('drawCustomColor');
  const undoStrokeBtn = document.getElementById('undoStrokeBtn');
  const clearDrawBtn = document.getElementById('clearDrawBtn');
  const saveDrawBtn = document.getElementById('saveDrawBtn');

  const tagEyes = document.getElementById('tag-eyes');
  const tagEars = document.getElementById('tag-ears');
  const tagLips = document.getElementById('tag-lips');
  const tagNose = document.getElementById('tag-nose');
  const mouthStatText = document.getElementById('mouthStatText');
  const eyeStatText = document.getElementById('eyeStatText');
  
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

  // --- 10 Interactive Face FX Configuration ---
  const FACE_EFFECTS = [
    {
      id: 0,
      badge: 'افکت ۰۱ • چشم و گوش',
      title: 'ویزور سایبرپانک نئونی (Cyberpunk AR Visor)',
      sub: 'عینک آینده‌نگرانه روی چشم‌ها، هدفون نئونی روی گوش‌ها و اسکن بیومتریک لب',
      color: '#00f2fe',
      glow: '0 0 25px rgba(0, 242, 254, 0.45)'
    },
    {
      id: 1,
      badge: 'افکت ۰۲ • چشم و ابرو',
      title: 'چشمان لیزری و صاعقه (Super Saiyan Laser Eyes)',
      sub: 'شلیک پرتوهای پرقدرت پلاسما از مردمک هر دو چشم همراه با جرقه‌های الکتریکی',
      color: '#ff2a85',
      glow: '0 0 25px rgba(255, 42, 133, 0.45)'
    },
    {
      id: 2,
      badge: 'افکت ۰۳ • پیشانی و گوش‌ها',
      title: 'تاج سلطنتی و گوشواره جواهر (Royal Crown & Jewels)',
      sub: 'تاج طلایی جواهرنشان روی پیشانی و گوشواره‌های یاقوت آویزان از لاله گوش‌ها',
      color: '#ffd700',
      glow: '0 0 25px rgba(255, 215, 0, 0.45)'
    },
    {
      id: 3,
      badge: 'افکت ۰۴ • لب و دهان (تعاملی)',
      title: 'نفس اژدها و دهان آتشین (Dragon Fire Breath)',
      sub: 'دهان خود را باز کنید تا شعله‌های آتش از لب‌ها به بیرون فوران کند و شاخ‌های اژدها بدرخشند!',
      color: '#ff5500',
      glow: '0 0 25px rgba(255, 85, 0, 0.45)'
    },
    {
      id: 4,
      badge: 'افکت ۰۵ • گوش، بینی و گونه',
      title: 'ببر نئونی و گوش‌های فانتزی (Neon Cat & Whiskers)',
      sub: 'گوش‌های گربه‌ای سه‌بعدی، بینی فانتزی روی نوک بینی و سیبیل‌های نئونی روی گونه‌ها',
      color: '#ff66cc',
      glow: '0 0 25px rgba(255, 102, 204, 0.45)'
    },
    {
      id: 5,
      badge: 'افکت ۰۶ • مش ۴۶۸ نقطه‌ای چهره',
      title: 'ماسک سایبورگ ترمیناتور (Terminator Cyborg HUD)',
      sub: 'شبکه هندسی تیتانیومی چهره، چشم اسکنر قرمز T-800 و نمایشگر تله‌متری فک و گوش',
      color: '#ff003c',
      glow: '0 0 25px rgba(255, 0, 60, 0.45)'
    },
    {
      id: 6,
      badge: 'افکت ۰۷ • لب، چشم و گونه',
      title: 'عینک قلبی و بوسه عشق (Heart Pop & Kisses)',
      sub: 'عینک قلبی روی چشم‌ها، رژ لب درخشان و پرواز قلب‌های شناور هنگام باز کردن لب‌ها',
      color: '#ff1493',
      glow: '0 0 25px rgba(255, 20, 147, 0.45)'
    },
    {
      id: 7,
      badge: 'افکت ۰۸ • گوش‌ها و لب (اکولایزر)',
      title: 'دی‌جی ست و هدفون استودیویی (Bass Equalizer DJ)',
      sub: 'هدفون حرفه‌ای متصل به گوش‌ها و اکولایزر نئونی دور سر که با باز شدن لب‌ها می‌رقصد',
      color: '#00ff88',
      glow: '0 0 25px rgba(0, 255, 136, 0.45)'
    },
    {
      id: 8,
      badge: 'افکت ۰۹ • چشم‌ها و پیشانی',
      title: 'شارینگان و چاکرای انیمه (Anime Sharingan Aura)',
      sub: 'چشمان شارینگان چرخان روی مردمک‌ها، هدبند نینجا روی پیشانی و خطوط سرعت مانگا',
      color: '#ff3300',
      glow: '0 0 25px rgba(255, 51, 0, 0.45)'
    },
    {
      id: 9,
      badge: 'افکت ۱۰ • کل صورت و کهکشان',
      title: 'آواتار کیهانی و چشم سوم (Cosmic Astral Avatar)',
      sub: 'چشم سوم نورانی، اتصال ستاره‌ای بین چشم و گوش و لب، و اشک‌های کهکشانی',
      color: '#a855f7',
      glow: '0 0 25px rgba(168, 85, 247, 0.45)'
    }
  ];

  // --- Application State ---
  let currentPage = 'hand'; // 'hand' | 'face' | 'draw'
  let isAutoMode = true;
  let activeEffectIndex = 0;
  let activeFaceEffectIndex = 0;
  let isMirrored = true;
  let showSkeleton = true;
  let isAudioEnabled = true;
  let currentCameraStream = null;
  let mediaPipeHands = null;
  let mediaPipeFaceMesh = null;
  let isModelReady = false;
  let isFaceModelReady = false;
  let isAiInferring = false;
  let latestFaceLandmarks = null;
  let faceMetrics = { mouthOpenRatio: 0, isMouthOpen: false, leftEyeOpen: true, rightEyeOpen: true, headRoll: 0 };
  
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

  // --- FACE FX ENGINE & LANDMARK DETECTION (Eyes, Ears, Lips, Nose, Forehead) ---
  const faceFireParticles = [];
  const faceHearts = [];
  const faceCosmicTears = [];

  function pt(landmarks, idx, w, h) {
    const lm = landmarks[idx] || { x: 0.5, y: 0.5, z: 0 };
    return {
      x: (isMirrored ? 1 - lm.x : lm.x) * w,
      y: lm.y * h,
      z: lm.z || 0
    };
  }

  function analyzeFaceLandmarks(landmarks, w, h) {
    // Key anatomical landmarks in MediaPipe Face Mesh (468 / 478 points)
    const upperLip = pt(landmarks, 13, w, h);
    const lowerLip = pt(landmarks, 14, w, h);
    const mouthLeft = pt(landmarks, 61, w, h);
    const mouthRight = pt(landmarks, 291, w, h);
    const forehead = pt(landmarks, 10, w, h);
    const chin = pt(landmarks, 152, w, h);
    const leftEar = pt(landmarks, 234, w, h);
    const rightEar = pt(landmarks, 454, w, h);
    const leftEyeTop = pt(landmarks, 159, w, h);
    const leftEyeBot = pt(landmarks, 145, w, h);
    const rightEyeTop = pt(landmarks, 386, w, h);
    const rightEyeBot = pt(landmarks, 374, w, h);

    const faceHeight = Math.hypot(chin.x - forehead.x, chin.y - forehead.y) || 100;
    const faceWidth = Math.hypot(rightEar.x - leftEar.x, rightEar.y - leftEar.y) || 100;
    const mouthGap = Math.hypot(lowerLip.x - upperLip.x, lowerLip.y - upperLip.y);
    const mouthOpenRatio = Math.min(1, Math.max(0, mouthGap / (faceHeight * 0.22)));
    const isMouthOpen = mouthOpenRatio > 0.22;

    const leftEyeGap = Math.hypot(leftEyeBot.x - leftEyeTop.x, leftEyeBot.y - leftEyeTop.y);
    const rightEyeGap = Math.hypot(rightEyeBot.x - rightEyeTop.x, rightEyeBot.y - rightEyeTop.y);
    const leftEyeOpen = leftEyeGap / faceHeight > 0.018;
    const rightEyeOpen = rightEyeGap / faceHeight > 0.018;

    const headRoll = Math.atan2(rightEar.y - leftEar.y, rightEar.x - leftEar.x);

    return {
      mouthOpenRatio,
      isMouthOpen,
      leftEyeOpen,
      rightEyeOpen,
      headRoll,
      faceHeight,
      faceWidth,
      upperLip,
      lowerLip,
      mouthLeft,
      mouthRight,
      mouthCenter: { x: (upperLip.x + lowerLip.x) / 2, y: (upperLip.y + lowerLip.y) / 2 },
      forehead,
      chin,
      leftEar,
      rightEar,
      noseTip: pt(landmarks, 1, w, h),
      noseBridge: pt(landmarks, 168, w, h),
      leftEyeCenter: landmarks[468] ? pt(landmarks, 468, w, h) : { x: (pt(landmarks, 33, w, h).x + pt(landmarks, 133, w, h).x) / 2, y: (pt(landmarks, 159, w, h).y + pt(landmarks, 145, w, h).y) / 2 },
      rightEyeCenter: landmarks[473] ? pt(landmarks, 473, w, h) : { x: (pt(landmarks, 362, w, h).x + pt(landmarks, 263, w, h).x) / 2, y: (pt(landmarks, 386, w, h).y + pt(landmarks, 374, w, h).y) / 2 },
      leftCheek: pt(landmarks, 205, w, h),
      rightCheek: pt(landmarks, 425, w, h),
      leftBrow: pt(landmarks, 105, w, h),
      rightBrow: pt(landmarks, 334, w, h)
    };
  }

  const LIP_OUTER_INDICES = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185];
  const LEFT_EYE_INDICES = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
  const RIGHT_EYE_INDICES = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
  const FACE_OVAL_INDICES = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

  function drawLandmarkPath(landmarks, indices, w, h, close = true) {
    ctx.beginPath();
    indices.forEach((idx, i) => {
      const p = pt(landmarks, idx, w, h);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    if (close) ctx.closePath();
  }

  // Draws key detected facial positions (Eyes, Ears, Lips, Nose) when Skeleton/Points button is active
  function drawFaceKeyPositionsOverlay(landmarks, fm, w, h) {
    if (!showSkeleton || !landmarks) return;
    ctx.save();

    // 1. Face Contour
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.32)';
    ctx.lineWidth = 1.5;
    drawLandmarkPath(landmarks, FACE_OVAL_INDICES, w, h, true);
    ctx.stroke();

    // 2. Eyes Contour + Iris Lock
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 8;
    drawLandmarkPath(landmarks, LEFT_EYE_INDICES, w, h, true);
    ctx.stroke();
    drawLandmarkPath(landmarks, RIGHT_EYE_INDICES, w, h, true);
    ctx.stroke();

    // 3. Lips Contour
    ctx.strokeStyle = '#ff2a85';
    ctx.shadowColor = '#ff2a85';
    drawLandmarkPath(landmarks, LIP_OUTER_INDICES, w, h, true);
    ctx.stroke();

    // 4. Ears, Eyes, Lips, Nose Callout Reticles
    const keySpots = [
      { p: fm.leftEyeCenter, label: 'EYE_L', color: '#00f2fe' },
      { p: fm.rightEyeCenter, label: 'EYE_R', color: '#00f2fe' },
      { p: fm.leftEar, label: 'EAR_L', color: '#00ff88' },
      { p: fm.rightEar, label: 'EAR_R', color: '#00ff88' },
      { p: fm.mouthCenter, label: 'LIPS', color: '#ff2a85' },
      { p: fm.noseTip, label: 'NOSE', color: '#ffd700' }
    ];

    ctx.font = 'bold 10px Outfit, monospace';
    keySpots.forEach(spot => {
      ctx.beginPath();
      ctx.arc(spot.p.x, spot.p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = spot.color;
      ctx.shadowColor = spot.color;
      ctx.shadowBlur = 10;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(spot.p.x, spot.p.y, 11, 0, Math.PI * 2);
      ctx.strokeStyle = spot.color;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = spot.color;
      ctx.fillText(spot.label, spot.p.x + 14, spot.p.y + 3);
    });

    ctx.restore();
  }

  // Face FX 0: Cyberpunk Neon Visor & Ear Pods
  function renderFaceCyberVisor(w, h, landmarks, fm) {
    ctx.save();
    const eyeMidX = (fm.leftEyeCenter.x + fm.rightEyeCenter.x) / 2;
    const eyeMidY = (fm.leftEyeCenter.y + fm.rightEyeCenter.y) / 2;
    const eyeDist = Math.hypot(fm.rightEyeCenter.x - fm.leftEyeCenter.x, fm.rightEyeCenter.y - fm.leftEyeCenter.y);
    const angle = Math.atan2(fm.rightEyeCenter.y - fm.leftEyeCenter.y, fm.rightEyeCenter.x - fm.leftEyeCenter.x);

    // Glowing Ear Cyber-Pods on Left & Right Ears
    [fm.leftEar, fm.rightEar].forEach(ear => {
      ctx.beginPath();
      ctx.arc(ear.x, ear.y, fm.faceWidth * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 242, 254, 0.25)';
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.stroke();
    });

    // Futuristic Cyclops / Cyberpunk Visor across Eyes
    ctx.save();
    ctx.translate(eyeMidX, eyeMidY);
    ctx.rotate(angle);
    const vw = eyeDist * 2.15;
    const vh = eyeDist * 0.58;

    const visorGrad = ctx.createLinearGradient(-vw / 2, 0, vw / 2, 0);
    visorGrad.addColorStop(0, 'rgba(255, 42, 133, 0.78)');
    visorGrad.addColorStop(0.5, 'rgba(0, 242, 254, 0.85)');
    visorGrad.addColorStop(1, 'rgba(255, 42, 133, 0.78)');

    ctx.beginPath();
    ctx.moveTo(-vw * 0.5, -vh * 0.45);
    ctx.lineTo(vw * 0.5, -vh * 0.45);
    ctx.lineTo(vw * 0.42, vh * 0.55);
    ctx.lineTo(vw * 0.08, vh * 0.25);
    ctx.lineTo(-vw * 0.08, vh * 0.25);
    ctx.lineTo(-vw * 0.42, vh * 0.55);
    ctx.closePath();

    ctx.fillStyle = visorGrad;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 25;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Scanning light bar inside visor
    const scanX = Math.sin(performance.now() * 0.005) * (vw * 0.38);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(scanX - 12, -vh * 0.35, 24, vh * 0.7);
    ctx.restore();

    // Neon Cyber Lip Wireframe
    ctx.strokeStyle = '#ff2a85';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ff2a85';
    ctx.shadowBlur = 12;
    drawLandmarkPath(landmarks, LIP_OUTER_INDICES, w, h, true);
    ctx.stroke();

    ctx.restore();
  }

  // Face FX 1: Super Saiyan Laser Eyes & Lightning
  function renderFaceLaserEyes(w, h, landmarks, fm) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 0, 85, 0.08)';
    ctx.fillRect(0, 0, w, h);

    const eyes = [fm.leftEyeCenter, fm.rightEyeCenter];
    const targetY = h * 0.95;

    eyes.forEach((eye, idx) => {
      const spreadX = (idx === 0 ? -1 : 1) * w * 0.22;
      const endX = eye.x + spreadX + Math.sin(performance.now() * 0.008 + idx) * 60;
      const endY = targetY;

      // Outer plasma beam
      ctx.beginPath();
      ctx.moveTo(eye.x, eye.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = 'rgba(255, 42, 133, 0.55)';
      ctx.lineWidth = 22;
      ctx.shadowColor = '#ff2a85';
      ctx.shadowBlur = 30;
      ctx.stroke();

      // Inner white-hot core
      ctx.beginPath();
      ctx.moveTo(eye.x, eye.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 15;
      ctx.stroke();

      // Eye flare orb
      ctx.beginPath();
      ctx.arc(eye.x, eye.y, 16 + Math.sin(performance.now() * 0.02) * 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ff2a85';
      ctx.shadowBlur = 28;
      ctx.fill();
    });

    // Electric arc between eyebrows/forehead
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(fm.leftEar.x, fm.leftEar.y);
    for (let i = 1; i <= 6; i++) {
      const t = i / 6;
      const lx = fm.leftEar.x + (fm.rightEar.x - fm.leftEar.x) * t + (Math.random() - 0.5) * 18;
      const ly = fm.forehead.y - 25 + (Math.random() - 0.5) * 20;
      ctx.lineTo(lx, ly);
    }
    ctx.stroke();

    ctx.restore();
  }

  // Face FX 2: Royal Golden Crown & Ruby Ear Jewels
  function renderFaceRoyalCrown(w, h, landmarks, fm) {
    ctx.save();
    const angle = Math.atan2(fm.rightEyeCenter.y - fm.leftEyeCenter.y, fm.rightEyeCenter.x - fm.leftEyeCenter.x);
    const crownW = fm.faceWidth * 0.95;
    const crownH = fm.faceHeight * 0.42;

    // 1. Crown on Forehead
    ctx.save();
    ctx.translate(fm.forehead.x, fm.forehead.y - crownH * 0.25);
    ctx.rotate(angle);

    const goldGrad = ctx.createLinearGradient(-crownW / 2, -crownH, crownW / 2, 0);
    goldGrad.addColorStop(0, '#ffd700');
    goldGrad.addColorStop(0.5, '#fff6a9');
    goldGrad.addColorStop(1, '#ff9900');

    ctx.beginPath();
    ctx.moveTo(-crownW * 0.45, 0);
    ctx.lineTo(-crownW * 0.5, -crownH * 0.65);
    ctx.lineTo(-crownW * 0.25, -crownH * 0.3);
    ctx.lineTo(0, -crownH * 0.95);
    ctx.lineTo(crownW * 0.25, -crownH * 0.3);
    ctx.lineTo(crownW * 0.5, -crownH * 0.65);
    ctx.lineTo(crownW * 0.45, 0);
    ctx.closePath();

    ctx.fillStyle = goldGrad;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 22;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Crown Gems
    const gems = [
      { x: 0, y: -crownH * 0.42, c: '#ff0055', r: 8 },
      { x: -crownW * 0.25, y: -crownH * 0.16, c: '#00f2fe', r: 6 },
      { x: crownW * 0.25, y: -crownH * 0.16, c: '#00f2fe', r: 6 }
    ];
    gems.forEach(g => {
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
      ctx.fillStyle = g.c;
      ctx.shadowColor = g.c;
      ctx.shadowBlur = 12;
      ctx.fill();
    });
    ctx.restore();

    // 2. Hanging Earrings on Both Ears
    [fm.leftEar, fm.rightEar].forEach(ear => {
      const swing = Math.sin(performance.now() * 0.004) * 5;
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ear.x, ear.y + 8);
      ctx.lineTo(ear.x + swing, ear.y + 38);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(ear.x + swing, ear.y + 34);
      ctx.lineTo(ear.x + swing + 9, ear.y + 48);
      ctx.lineTo(ear.x + swing, ear.y + 62);
      ctx.lineTo(ear.x + swing - 9, ear.y + 48);
      ctx.closePath();
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.strokeStyle = '#ffd700';
      ctx.stroke();
    });

    ctx.restore();
  }

  // Face FX 3: Dragon Fire Breath (Interactive Mouth Open!)
  function renderFaceDragonFire(w, h, landmarks, fm) {
    ctx.save();

    // Dragon Horns on Forehead
    [[-1, fm.leftBrow], [1, fm.rightBrow]].forEach(([dir, brow]) => {
      ctx.beginPath();
      ctx.moveTo(brow.x - dir * 14, fm.forehead.y);
      ctx.quadraticCurveTo(brow.x + dir * 35, fm.forehead.y - 60, brow.x + dir * 55, fm.forehead.y - 105);
      ctx.quadraticCurveTo(brow.x + dir * 15, fm.forehead.y - 50, brow.x + dir * 14, fm.forehead.y);
      ctx.fillStyle = '#ff3300';
      ctx.shadowColor = '#ff5500';
      ctx.shadowBlur = 18;
      ctx.fill();
    });

    // Glowing Dragon Eyes
    [fm.leftEyeCenter, fm.rightEyeCenter].forEach(eye => {
      ctx.beginPath();
      ctx.arc(eye.x, eye.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#ffaa00';
      ctx.shadowColor = '#ff3300';
      ctx.shadowBlur = 16;
      ctx.fill();
    });

    // Spawn fire particles from Mouth when Mouth is Open (or idle embers when closed)
    const spawnCount = fm.isMouthOpen ? Math.floor(8 + fm.mouthOpenRatio * 14) : 2;
    for (let i = 0; i < spawnCount; i++) {
      faceFireParticles.push({
        x: fm.mouthCenter.x + (Math.random() - 0.5) * (fm.isMouthOpen ? 28 : 10),
        y: fm.mouthCenter.y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * (fm.isMouthOpen ? 7 : 2),
        vy: fm.isMouthOpen ? (Math.random() * 6 + 3.5) : (-Math.random() * 2 - 0.5),
        size: fm.isMouthOpen ? (Math.random() * 22 + 10) : (Math.random() * 7 + 4),
        life: 1,
        g: Math.floor(Math.random() * 180 + 40)
      });
    }

    ctx.globalCompositeOperation = 'lighter';
    for (let i = faceFireParticles.length - 1; i >= 0; i--) {
      const p = faceFireParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.032;
      p.size *= 0.97;
      if (p.life <= 0) {
        faceFireParticles.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, ${p.g}, 0, ${p.life})`;
      ctx.shadowColor = '#ff4500';
      ctx.shadowBlur = 14;
      ctx.fill();
    }

    ctx.restore();
  }

  // Face FX 4: Neon Cat Ears, Whiskers & Cute Nose
  function renderFaceNeonCat(w, h, landmarks, fm) {
    ctx.save();
    const angle = Math.atan2(fm.rightEyeCenter.y - fm.leftEyeCenter.y, fm.rightEyeCenter.x - fm.leftEyeCenter.x);
    const earSize = fm.faceWidth * 0.36;

    // 1. Cat Ears above Left/Right Forehead-Temple
    ctx.save();
    ctx.translate(fm.forehead.x, fm.forehead.y);
    ctx.rotate(angle);

    [-1, 1].forEach(dir => {
      const baseX = dir * fm.faceWidth * 0.32;
      // Outer Neon Ear
      ctx.beginPath();
      ctx.moveTo(baseX - dir * earSize * 0.45, -10);
      ctx.lineTo(baseX + dir * earSize * 0.35, -earSize * 1.15);
      ctx.lineTo(baseX + dir * earSize * 0.55, 15);
      ctx.closePath();
      ctx.fillStyle = 'rgba(20, 10, 35, 0.85)';
      ctx.strokeStyle = '#ff66cc';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#ff66cc';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.stroke();

      // Inner Pink Triangle
      ctx.beginPath();
      ctx.moveTo(baseX - dir * earSize * 0.25, -5);
      ctx.lineTo(baseX + dir * earSize * 0.28, -earSize * 0.82);
      ctx.lineTo(baseX + dir * earSize * 0.38, 8);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 102, 204, 0.55)';
      ctx.fill();
    });
    ctx.restore();

    // 2. Cute Pink Nose Triangle on Nose Tip
    const nx = fm.noseTip.x;
    const ny = fm.noseTip.y;
    ctx.beginPath();
    ctx.moveTo(nx - 12, ny - 6);
    ctx.lineTo(nx + 12, ny - 6);
    ctx.lineTo(nx, ny + 8);
    ctx.closePath();
    ctx.fillStyle = '#ff2a85';
    ctx.shadowColor = '#ff2a85';
    ctx.shadowBlur = 12;
    ctx.fill();

    // 3. Whiskers on Left and Right Cheeks
    const whiskerW = fm.faceWidth * 0.34;
    const wiggle = Math.sin(performance.now() * 0.008) * 4;
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 12;

    [-1, 0, 1].forEach(row => {
      // Left Cheek
      ctx.beginPath();
      ctx.moveTo(fm.leftCheek.x, fm.leftCheek.y + row * 10);
      ctx.lineTo(fm.leftCheek.x - whiskerW, fm.leftCheek.y + row * 18 + wiggle);
      ctx.stroke();

      // Right Cheek
      ctx.beginPath();
      ctx.moveTo(fm.rightCheek.x, fm.rightCheek.y + row * 10);
      ctx.lineTo(fm.rightCheek.x + whiskerW, fm.rightCheek.y + row * 18 + wiggle);
      ctx.stroke();
    });

    ctx.restore();
  }

  // Face FX 5: Terminator Cyborg Mesh & Red Scanner Eye
  function renderFaceCyborgHud(w, h, landmarks, fm) {
    ctx.save();

    // Geometric wireframe connecting face landmarks
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.38)';
    ctx.lineWidth = 1;
    drawLandmarkPath(landmarks, FACE_OVAL_INDICES, w, h, true);
    ctx.stroke();

    // Symmetrical cyber circuit lines across cheeks, nose, ears, lips
    const circuits = [
      [10, 168, 1, 13, 152],
      [234, 205, 1, 425, 454],
      [234, 33, 168, 263, 454],
      [61, 205, 33, 10, 263, 425, 291]
    ];
    ctx.strokeStyle = 'rgba(255, 0, 60, 0.55)';
    ctx.lineWidth = 1.4;
    circuits.forEach(path => {
      drawLandmarkPath(landmarks, path, w, h, false);
      ctx.stroke();
    });

    // T-800 Glowing Red Cyborg Eye on Right Eye + Rotating Target HUD on Left Eye
    const rEye = fm.rightEyeCenter;
    ctx.beginPath();
    ctx.arc(rEye.x, rEye.y, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#ff003c';
    ctx.shadowColor = '#ff003c';
    ctx.shadowBlur = 25;
    ctx.fill();

    const lEye = fm.leftEyeCenter;
    const rot = performance.now() * 0.003;
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(lEye.x, lEye.y, 28, rot, rot + Math.PI * 1.4);
    ctx.stroke();

    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#ff003c';
    ctx.fillText(`CYBORG_LOCK // MOUTH: ${Math.round(fm.mouthOpenRatio * 100)}%`, fm.chin.x - 85, fm.chin.y + 30);

    ctx.restore();
  }

  // Face FX 6: Heart Shades & Floating Kiss Hearts
  function renderFaceHeartPop(w, h, landmarks, fm) {
    ctx.save();

    function drawHeart(cx, cy, size, color, fill = true) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.beginPath();
      ctx.moveTo(0, size * 0.3);
      ctx.bezierCurveTo(-size, -size * 0.4, -size * 0.5, -size * 0.95, 0, -size * 0.35);
      ctx.bezierCurveTo(size * 0.5, -size * 0.95, size, -size * 0.4, 0, size * 0.3);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 16;
      if (fill) ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    const heartSize = fm.faceWidth * 0.22;
    drawHeart(fm.leftEyeCenter.x, fm.leftEyeCenter.y + 4, heartSize, 'rgba(255, 20, 147, 0.78)');
    drawHeart(fm.rightEyeCenter.x, fm.rightEyeCenter.y + 4, heartSize, 'rgba(255, 20, 147, 0.78)');

    // Bridge between heart glasses
    ctx.beginPath();
    ctx.moveTo(fm.leftEyeCenter.x + heartSize * 0.4, fm.leftEyeCenter.y - 4);
    ctx.lineTo(fm.rightEyeCenter.x - heartSize * 0.4, fm.rightEyeCenter.y - 4);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Glowing Pink Lips
    ctx.fillStyle = 'rgba(255, 20, 147, 0.55)';
    ctx.strokeStyle = '#ff1493';
    ctx.lineWidth = 2;
    drawLandmarkPath(landmarks, LIP_OUTER_INDICES, w, h, true);
    ctx.fill();
    ctx.stroke();

    // Spawn floating hearts from lips (faster when mouth opens!)
    if (Math.random() < (fm.isMouthOpen ? 0.55 : 0.12)) {
      faceHearts.push({
        x: fm.mouthCenter.x + (Math.random() - 0.5) * 30,
        y: fm.mouthCenter.y,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -Math.random() * 3 - 1.5,
        size: 12 + Math.random() * 14,
        life: 1,
        color: Math.random() > 0.5 ? '#ff1493' : '#ff66cc'
      });
    }

    for (let i = faceHearts.length - 1; i >= 0; i--) {
      const ht = faceHearts[i];
      ht.x += ht.vx;
      ht.y += ht.vy;
      ht.life -= 0.02;
      if (ht.life <= 0) {
        faceHearts.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = ht.life;
      drawHeart(ht.x, ht.y, ht.size, ht.color);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // Face FX 7: DJ Studio Headphones on Ears & Mouth-Reactive Equalizer
  function renderFaceDjEqualizer(w, h, landmarks, fm) {
    ctx.save();

    // Headband Arc connecting Left Ear -> Forehead -> Right Ear
    ctx.beginPath();
    ctx.moveTo(fm.leftEar.x, fm.leftEar.y);
    ctx.quadraticCurveTo(fm.forehead.x, fm.forehead.y - fm.faceHeight * 0.55, fm.rightEar.x, fm.rightEar.y);
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 8;
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 20;
    ctx.stroke();

    // Studio Ear Cups on Both Ears
    const cupR = fm.faceWidth * 0.13;
    [fm.leftEar, fm.rightEar].forEach(ear => {
      ctx.beginPath();
      ctx.ellipse(ear.x, ear.y, cupR * 0.75, cupR * 1.15, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0b1325';
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.stroke();
    });

    // Equalizer Bars around Mouth / Jaw reactive to Lip movement
    const bars = 16;
    const barSpacing = (fm.faceWidth * 0.7) / bars;
    const startX = fm.mouthCenter.x - (fm.faceWidth * 0.35);
    const baseY = fm.chin.y + 28;

    for (let i = 0; i < bars; i++) {
      const wave = Math.abs(Math.sin(performance.now() * 0.01 + i * 0.5));
      const boost = 1 + fm.mouthOpenRatio * 2.8;
      const bh = (8 + wave * 24) * boost;
      const bx = startX + i * barSpacing;

      ctx.fillStyle = i % 2 === 0 ? '#00ff88' : '#00f2fe';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 10;
      ctx.fillRect(bx, baseY - bh / 2, barSpacing * 0.65, bh);
    }

    ctx.restore();
  }

  // Face FX 8: Anime Sharingan Eyes & Chakra Aura
  function renderFaceAnimeSharingan(w, h, landmarks, fm) {
    ctx.save();
    const rot = performance.now() * 0.005;

    // Anime Speed Lines around viewport edge
    const cx = fm.noseBridge.x;
    const cy = fm.noseBridge.y;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const r1 = Math.max(w, h) * 0.34;
      const r2 = Math.max(w, h) * 0.75;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
      ctx.stroke();
    }

    // Sharingan on Both Eyes
    const eyeR = fm.faceWidth * 0.065;
    [fm.leftEyeCenter, fm.rightEyeCenter].forEach(eye => {
      ctx.save();
      ctx.translate(eye.x, eye.y);
      ctx.rotate(rot);

      ctx.beginPath();
      ctx.arc(0, 0, eyeR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(230, 0, 18, 0.85)';
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      // Inner ring + pupil
      ctx.beginPath();
      ctx.arc(0, 0, eyeR * 0.58, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,0,0,0.7)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, eyeR * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();

      // 3 Tomoe dots
      for (let t = 0; t < 3; t++) {
        const ta = (t * Math.PI * 2) / 3;
        ctx.beginPath();
        ctx.arc(Math.cos(ta) * eyeR * 0.58, Math.sin(ta) * eyeR * 0.58, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
      }
      ctx.restore();
    });

    // Ninja Headband Plate on Forehead
    const angle = Math.atan2(fm.rightEyeCenter.y - fm.leftEyeCenter.y, fm.rightEyeCenter.x - fm.leftEyeCenter.x);
    ctx.save();
    ctx.translate(fm.forehead.x, fm.forehead.y - 10);
    ctx.rotate(angle);
    const bw = fm.faceWidth * 0.55;
    const bh = fm.faceHeight * 0.14;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
    ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);
    ctx.restore();

    ctx.restore();
  }

  // Face FX 9: Cosmic Astral Avatar, Third Eye & Constellation
  function renderFaceCosmicAvatar(w, h, landmarks, fm) {
    ctx.save();
    ctx.fillStyle = 'rgba(20, 5, 45, 0.18)';
    ctx.fillRect(0, 0, w, h);

    // Glowing Third Eye on Forehead/Glabella
    const tx = (fm.forehead.x + fm.noseBridge.x) / 2;
    const ty = (fm.forehead.y + fm.noseBridge.y) / 2;
    ctx.beginPath();
    ctx.ellipse(tx, ty, 18, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#a855f7';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 22;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(tx, ty, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Star Constellation connecting Ears, Eyes, Nose, Lips, Forehead
    const stars = [fm.leftEar, fm.leftEyeCenter, fm.forehead, fm.rightEyeCenter, fm.rightEar, fm.rightCheek, fm.mouthCenter, fm.leftCheek, fm.noseTip];
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.55)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    stars.forEach((s, i) => {
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.closePath();
    ctx.stroke();

    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 12;
      ctx.fill();
    });

    // Cosmic Stardust Tears from Both Eyes
    if (Math.random() < 0.35) {
      [fm.leftEyeCenter, fm.rightEyeCenter].forEach(eye => {
        faceCosmicTears.push({
          x: eye.x + (Math.random() - 0.5) * 14,
          y: eye.y + 8,
          vy: 1.5 + Math.random() * 2,
          life: 1,
          color: Math.random() > 0.5 ? '#00f2fe' : '#a855f7'
        });
      });
    }

    for (let i = faceCosmicTears.length - 1; i >= 0; i--) {
      const tear = faceCosmicTears[i];
      tear.y += tear.vy;
      tear.life -= 0.025;
      if (tear.life <= 0) {
        faceCosmicTears.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(tear.x, tear.y, 3 * tear.life, 0, Math.PI * 2);
      ctx.fillStyle = tear.color;
      ctx.shadowColor = tear.color;
      ctx.shadowBlur = 10;
      ctx.fill();
    }

    ctx.restore();
  }

  function selectFaceEffect(index) {
    if (index < 0) index = FACE_EFFECTS.length - 1;
    if (index >= FACE_EFFECTS.length) index = 0;
    activeFaceEffectIndex = index;
    const fx = FACE_EFFECTS[index];

    if (currentPage === 'face') {
      fingerBadge.textContent = fx.badge;
      effectNameTitle.textContent = fx.title;
      effectSubTitle.textContent = fx.sub;
      effectBanner.style.borderColor = fx.color;
      effectBanner.style.boxShadow = fx.glow;
      vhsOverlay.classList.add('hidden');
    }

    faceEffectCards.forEach(card => {
      const cardIdx = parseInt(card.dataset.faceFx, 10);
      card.classList.toggle('active', cardIdx === index);
    });
  }

  // =====================================================
  //  AIR DRAWING ENGINE — Finger Painting Studio
  // =====================================================

  // Dedicated offscreen canvas for persistent drawing
  const drawCanvas = document.createElement('canvas');
  drawCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:5;';
  const dCtx = drawCanvas.getContext('2d');

  // Drawing State
  let drawTool = 'pen';         // 'pen' | 'eraser'
  let drawBrushStyle = 'neon';  // 'neon' | 'ink' | 'rainbow' | 'laser'
  let drawColor = '#00f2fe';
  let drawSize = 10;
  let isDrawing = false;        // true when index finger down
  let drawLastX = null;
  let drawLastY = null;
  let rainbowHue = 0;
  let drawStrokeHistory = [];   // array of ImageData snapshots for undo
  let drawStrokesCount = 0;
  let drawPrevFingerCount = -1;
  let drawPrevIndexTip = null;

  // Cursor indicator dot on canvas
  const drawCursorEl = document.createElement('div');
  drawCursorEl.style.cssText = 'position:absolute;width:16px;height:16px;border-radius:50%;border:2px solid #00ff88;pointer-events:none;transform:translate(-50%,-50%);transition:width 0.1s,height 0.1s;z-index:20;display:none;';
  document.getElementById('stageContainer')?.appendChild(drawCursorEl);
  document.getElementById('stageContainer')?.appendChild(drawCanvas);

  function initDrawCanvas(w, h) {
    if (drawCanvas.width !== w || drawCanvas.height !== h) {
      // Preserve current drawing
      const tempImg = dCtx.getImageData(0, 0, drawCanvas.width || w, drawCanvas.height || h);
      drawCanvas.width = w;
      drawCanvas.height = h;
      try { dCtx.putImageData(tempImg, 0, 0); } catch(e) {}
    }
  }

  function saveDrawUndo() {
    const snap = dCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
    drawStrokeHistory.push(snap);
    if (drawStrokeHistory.length > 40) drawStrokeHistory.shift(); // max 40 undo levels
  }

  function undoLastStroke() {
    if (drawStrokeHistory.length === 0) return;
    const snap = drawStrokeHistory.pop();
    dCtx.putImageData(snap, 0, 0);
    drawStrokesCount = Math.max(0, drawStrokesCount - 1);
    updateDrawHud();
  }

  function clearDrawCanvas() {
    saveDrawUndo();
    dCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    drawStrokesCount = 0;
    drawLastX = null;
    drawLastY = null;
    updateDrawHud();
  }

  function saveDrawArt() {
    // Composite: camera frame + drawing
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const eCtx = exportCanvas.getContext('2d');
    eCtx.drawImage(canvas, 0, 0);
    eCtx.drawImage(drawCanvas, 0, 0);
    const link = document.createElement('a');
    link.download = `Air_Drawing_${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
    snapshotToast.classList.remove('hidden');
    setTimeout(() => snapshotToast.classList.add('hidden'), 3000);
  }

  function updateDrawHud() {
    if (hudColorSwatch) hudColorSwatch.style.background = drawColor;
    if (hudSizeText) hudSizeText.textContent = `${drawSize}px`;
    if (hudStrokesCount) hudStrokesCount.textContent = drawStrokesCount;
    if (brushSizeBadge) brushSizeBadge.textContent = `${drawSize}px`;
    if (drawSizeSlider) drawSizeSlider.value = drawSize;
  }

  function setDrawStatus(state) {
    // state: 'idle' | 'hovering' | 'writing' | 'erasing'
    if (!drawStatusPill || !drawStatusText) return;
    const labels = {
      idle: 'در انتظار دست...',
      hovering: 'حالت هاور — ✌️ بدون نوشتن',
      writing: '✍️ در حال نوشتن...',
      erasing: '🧹 در حال پاک کردن...'
    };
    drawStatusPill.className = `draw-status-pill${state === 'writing' ? ' writing' : state === 'erasing' ? ' erasing' : state === 'hovering' ? ' hovering' : ''}`;
    drawStatusText.textContent = labels[state] || labels.idle;
  }

  function applyDrawStroke(x1, y1, x2, y2) {
    if (drawTool === 'eraser') {
      dCtx.globalCompositeOperation = 'destination-out';
      dCtx.lineWidth = drawSize * 3.5;
      dCtx.lineCap = 'round';
      dCtx.lineJoin = 'round';
      dCtx.beginPath();
      dCtx.moveTo(x1, y1);
      dCtx.lineTo(x2, y2);
      dCtx.stroke();
      dCtx.globalCompositeOperation = 'source-over';
      return;
    }

    dCtx.globalCompositeOperation = 'source-over';
    dCtx.lineCap = 'round';
    dCtx.lineJoin = 'round';

    if (drawBrushStyle === 'neon') {
      // Glow outer
      dCtx.save();
      dCtx.lineWidth = drawSize * 3;
      dCtx.strokeStyle = drawColor + '55';
      dCtx.shadowColor = drawColor;
      dCtx.shadowBlur = 20;
      dCtx.beginPath();
      dCtx.moveTo(x1, y1);
      dCtx.lineTo(x2, y2);
      dCtx.stroke();
      // Core
      dCtx.lineWidth = drawSize * 0.8;
      dCtx.strokeStyle = '#ffffff';
      dCtx.shadowColor = drawColor;
      dCtx.shadowBlur = 10;
      dCtx.beginPath();
      dCtx.moveTo(x1, y1);
      dCtx.lineTo(x2, y2);
      dCtx.stroke();
      dCtx.restore();

    } else if (drawBrushStyle === 'ink') {
      dCtx.save();
      dCtx.lineWidth = drawSize;
      dCtx.strokeStyle = drawColor;
      dCtx.shadowBlur = 0;
      dCtx.globalAlpha = 0.88;
      dCtx.beginPath();
      dCtx.moveTo(x1, y1);
      dCtx.lineTo(x2, y2);
      dCtx.stroke();
      dCtx.restore();

    } else if (drawBrushStyle === 'rainbow') {
      rainbowHue = (rainbowHue + 2) % 360;
      const hsl = `hsl(${rainbowHue}, 100%, 60%)`;
      dCtx.save();
      dCtx.lineWidth = drawSize * 2.5;
      dCtx.strokeStyle = hsl + '66';
      dCtx.shadowColor = hsl;
      dCtx.shadowBlur = 18;
      dCtx.beginPath();
      dCtx.moveTo(x1, y1);
      dCtx.lineTo(x2, y2);
      dCtx.stroke();
      dCtx.lineWidth = drawSize * 0.7;
      dCtx.strokeStyle = '#ffffff';
      dCtx.shadowBlur = 5;
      dCtx.beginPath();
      dCtx.moveTo(x1, y1);
      dCtx.lineTo(x2, y2);
      dCtx.stroke();
      dCtx.restore();

    } else if (drawBrushStyle === 'laser') {
      dCtx.save();
      dCtx.lineWidth = drawSize * 0.5;
      dCtx.strokeStyle = drawColor;
      dCtx.shadowColor = drawColor;
      dCtx.shadowBlur = 30;
      dCtx.beginPath();
      dCtx.moveTo(x1, y1);
      dCtx.lineTo(x2, y2);
      dCtx.stroke();
      dCtx.lineWidth = 1;
      dCtx.strokeStyle = '#fff';
      dCtx.shadowBlur = 5;
      dCtx.beginPath();
      dCtx.moveTo(x1, y1);
      dCtx.lineTo(x2, y2);
      dCtx.stroke();
      dCtx.restore();
    }
  }

  function processDrawGesture(landmarks, w, h) {
    if (!landmarks) {
      isDrawing = false;
      drawLastX = null;
      drawLastY = null;
      drawPrevFingerCount = -1;
      setDrawStatus('idle');
      drawCursorEl.style.display = 'none';
      return;
    }

    const { count } = analyzeHandFingers(landmarks);
    const indexTip = landmarks[8];
    const fingerX = (isMirrored ? 1 - indexTip.x : indexTip.x) * w;
    const fingerY = indexTip.y * h;

    // Map finger position to canvas element coords for CSS cursor
    const stageEl = document.getElementById('stageContainer');
    if (stageEl) {
      const rect = stageEl.getBoundingClientRect();
      const ratioX = rect.width / w;
      const ratioY = rect.height / h;
      drawCursorEl.style.display = 'block';
      drawCursorEl.style.left = (fingerX * ratioX) + 'px';
      drawCursorEl.style.top = (fingerY * ratioY) + 'px';
      const toolColor = drawTool === 'eraser' ? '#ff5555' : drawColor;
      const toolSize = drawTool === 'eraser' ? Math.max(16, drawSize * 2.5) : Math.max(12, drawSize);
      drawCursorEl.style.width = toolSize + 'px';
      drawCursorEl.style.height = toolSize + 'px';
      drawCursorEl.style.borderColor = toolColor;
      drawCursorEl.style.boxShadow = `0 0 10px ${toolColor}`;
    }

    if (count === 0) {
      // Fist: lift pen
      if (isDrawing) {
        drawStrokesCount++;
        updateDrawHud();
      }
      isDrawing = false;
      drawLastX = null;
      drawLastY = null;
      setDrawStatus('idle');

    } else if (count >= 2) {
      // 2+ fingers: hover, no drawing
      if (isDrawing) {
        drawStrokesCount++;
        updateDrawHud();
      }
      isDrawing = false;
      drawLastX = null;
      drawLastY = null;
      setDrawStatus('hovering');

    } else {
      // Exactly 1 finger: draw!
      if (count !== drawPrevFingerCount) {
        // Freshly entering draw mode — save undo snapshot
        saveDrawUndo();
      }
      if (isDrawing && drawLastX !== null) {
        applyDrawStroke(drawLastX, drawLastY, fingerX, fingerY);
      }
      isDrawing = true;
      setDrawStatus(drawTool === 'eraser' ? 'erasing' : 'writing');
    }

    drawLastX = fingerX;
    drawLastY = fingerY;
    drawPrevFingerCount = count;
  }

  // =====================================================
  // END AIR DRAWING ENGINE
  // =====================================================

  function switchPage(page) {
    currentPage = (page === 'face' || page === 'draw') ? page : 'hand';
    const isFace = currentPage === 'face';
    const isDraw = currentPage === 'draw';
    const isHand = currentPage === 'hand';

    switchHandPageBtn?.classList.toggle('active', isHand);
    switchFacePageBtn?.classList.toggle('active', isFace);
    switchDrawPageBtn?.classList.toggle('active', isDraw);

    gestureIndicator?.classList.toggle('hidden', !isHand);
    faceTelemetryHud?.classList.toggle('hidden', !isFace);
    drawTelemetryHud?.classList.toggle('hidden', !isDraw);

    handDockTitle?.classList.toggle('hidden', !isHand);
    faceDockTitle?.classList.toggle('hidden', !isFace);
    drawDockTitle?.classList.toggle('hidden', !isDraw);

    handEffectsGrid?.classList.toggle('hidden', !isHand);
    faceEffectsGrid?.classList.toggle('hidden', !isFace);
    drawToolsGrid?.classList.toggle('hidden', !isDraw);

    // Show/hide drawing layer
    drawCanvas.style.display = isDraw ? 'block' : 'none';
    drawCursorEl.style.display = isDraw ? 'block' : 'none';

    if (isFace) {
      brandTitle.textContent = 'AI Face FX Studio';
      brandSubtext.textContent = 'تشخیص هوشمند چشم، گوش، لب و بینی + ۱۰ افکت زنده چهره';
      primaryMetricLabel.textContent = 'نقاط چهره';
      fingerCountDisplay.textContent = latestFaceLandmarks ? '468' : '0';
      skeletonBtnLabel.textContent = 'نقاط کلیدی صورت';
      selectFaceEffect(activeFaceEffectIndex);

    } else if (isDraw) {
      brandTitle.textContent = 'AI Air Canvas ✍️';
      brandSubtext.textContent = 'نقاشی و نوشتن هوایی با انگشت اشاره — بدون لمس';
      primaryMetricLabel.textContent = 'انگشتان فعال';
      fingerCountDisplay.textContent = '0';
      skeletonBtnLabel.textContent = 'اسکلت دست';
      effectNameTitle.textContent = 'استودیوی نقاشی هوایی (Air Canvas)';
      effectSubTitle.textContent = '☝️ ۱ انگشت = رسم • ✌️ ۲ انگشت = هاور • ✊ مشت = توقف';
      fingerBadge.textContent = 'Air Draw';
      effectBanner.style.borderColor = '#00ff88';
      effectBanner.style.boxShadow = '0 0 25px rgba(0,255,136,0.4)';
      vhsOverlay.classList.add('hidden');
      updateDrawHud();
      setDrawStatus('idle');

    } else {
      brandTitle.textContent = 'AI Finger FX Vision';
      brandSubtext.textContent = 'شناسایی هوشمند حرکات دست و افکت‌های آنی';
      primaryMetricLabel.textContent = 'تعداد انگشت';
      skeletonBtnLabel.textContent = 'اسکلت دست';
      selectEffect(activeEffectIndex);
    }
  }

  // --- NON-BLOCKING ASYNC AI INFERENCE ---
  async function triggerAiInference() {
    if (isAiInferring) return;
    if (video.paused || video.ended || video.readyState < 2) return;

    if (currentPage === 'face') {
      if (!mediaPipeFaceMesh || !isFaceModelReady) return;
      isAiInferring = true;
      try {
        await mediaPipeFaceMesh.send({ image: video });
      } catch (e) {
      } finally {
        isAiInferring = false;
      }
    } else {
      // Both 'hand' and 'draw' pages use Hands model
      if (!mediaPipeHands || !isModelReady) return;
      isAiInferring = true;
      try {
        await mediaPipeHands.send({ image: video });
      } catch (e) {
      } finally {
        isAiInferring = false;
      }
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

      // 2. Render Active Page Effect
      if (currentPage === 'face') {
        const flm = latestFaceLandmarks ? latestFaceLandmarks[0] : null;
        if (flm) {
          const fm = analyzeFaceLandmarks(flm, w, h);
          faceMetrics = fm;

          switch (activeFaceEffectIndex) {
            case 0: renderFaceCyberVisor(w, h, flm, fm); break;
            case 1: renderFaceLaserEyes(w, h, flm, fm); break;
            case 2: renderFaceRoyalCrown(w, h, flm, fm); break;
            case 3: renderFaceDragonFire(w, h, flm, fm); break;
            case 4: renderFaceNeonCat(w, h, flm, fm); break;
            case 5: renderFaceCyborgHud(w, h, flm, fm); break;
            case 6: renderFaceHeartPop(w, h, flm, fm); break;
            case 7: renderFaceDjEqualizer(w, h, flm, fm); break;
            case 8: renderFaceAnimeSharingan(w, h, flm, fm); break;
            case 9: renderFaceCosmicAvatar(w, h, flm, fm); break;
            default: renderFaceCyberVisor(w, h, flm, fm); break;
          }

          if (showSkeleton) {
            drawFaceKeyPositionsOverlay(flm, fm, w, h);
          }
        }

      } else if (currentPage === 'draw') {
        // --- DRAW PAGE: no hand effects, only air drawing ---
        const lm = latestLandmarks ? latestLandmarks[0] : null;
        initDrawCanvas(w, h);
        processDrawGesture(lm, w, h);

        // Composite persistent drawing on top of live camera
        ctx.drawImage(drawCanvas, 0, 0);

        // Show live fingertip aiming dot on output canvas
        if (lm && drawLastX !== null) {
          const dotColor = drawTool === 'eraser' ? '#ff5555' : drawColor;
          ctx.save();
          ctx.beginPath();
          ctx.arc(drawLastX, drawLastY, Math.max(6, drawSize * 0.8), 0, Math.PI * 2);
          ctx.fillStyle = dotColor + '44';
          ctx.shadowColor = dotColor;
          ctx.shadowBlur = 25;
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        }

        if (showSkeleton && lm) {
          drawHandSkeleton(lm, w, h);
        }

        fingerCountDisplay.textContent = lm ? analyzeHandFingers(lm).count : '0';

      } else {
        // --- HAND PAGE ---
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

        // Render Hand Skeleton
        if (showSkeleton && lm) {
          drawHandSkeleton(lm, w, h);
        }
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
    if (currentPage !== 'hand') return;
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

  function onFaceResults(results) {
    if (currentPage !== 'face') return;
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      latestFaceLandmarks = null;
      confidenceDisplay.textContent = '0%';
      fingerCountDisplay.textContent = '0';
      aiStatusBadge.className = 'status-badge warning';
      aiStatusText.textContent = 'در انتظار قرارگیری صورت مقابل دوربین...';
      [tagEyes, tagEars, tagLips, tagNose].forEach(el => el?.classList.remove('detected'));
      return;
    }

    latestFaceLandmarks = results.multiFaceLandmarks;
    const ptsCount = results.multiFaceLandmarks[0].length || 468;
    fingerCountDisplay.textContent = ptsCount;
    confidenceDisplay.textContent = '98%';
    aiStatusBadge.className = 'status-badge';
    aiStatusText.textContent = 'چشم، گوش و لب ردگیری شد';

    [tagEyes, tagEars, tagLips, tagNose].forEach(el => el?.classList.add('detected'));
    if (mouthStatText) {
      mouthStatText.textContent = faceMetrics.isMouthOpen ? 'وضعیت دهان: باز (فعال 🔥)' : 'وضعیت دهان: بسته';
    }
    if (eyeStatText) {
      const eyesOpen = faceMetrics.leftEyeOpen && faceMetrics.rightEyeOpen;
      eyeStatText.textContent = eyesOpen ? 'چشم‌ها: باز' : 'چشم‌ها: پلک زدن 😉';
    }
  }

  // --- Initialize MediaPipe Hands & FaceMesh ---
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

    initFaceMesh();
  }

  function initFaceMesh() {
    if (typeof window.FaceMesh === 'undefined') {
      setTimeout(initFaceMesh, 300);
      return;
    }

    try {
      mediaPipeFaceMesh = new window.FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      mediaPipeFaceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      mediaPipeFaceMesh.onResults(onFaceResults);
      isFaceModelReady = true;
      console.log('MediaPipe FaceMesh model ready.');
    } catch (err) {
      console.error('MediaPipe FaceMesh Init Error:', err);
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
      link.download = currentPage === 'face'
        ? `Face_FX_Photo_${activeFaceEffectIndex + 1}.png`
        : `Hand_FX_Photo_${activeEffectIndex}_Fingers.png`;
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

    switchHandPageBtn?.addEventListener('click', () => {
      initAudio();
      playGestureSound(2);
      switchPage('hand');
    });

    switchFacePageBtn?.addEventListener('click', () => {
      initAudio();
      playGestureSound(4);
      switchPage('face');
    });

    faceEffectCards.forEach(card => {
      card.addEventListener('click', () => {
        initAudio();
        const fxIdx = parseInt(card.dataset.faceFx, 10);
        selectFaceEffect(fxIdx);
        playGestureSound((fxIdx % 5) + 1);
      });
    });

    prevFaceFxBtn?.addEventListener('click', () => {
      initAudio();
      selectFaceEffect(activeFaceEffectIndex - 1);
      playGestureSound(2);
    });

    nextFaceFxBtn?.addEventListener('click', () => {
      initAudio();
      selectFaceEffect(activeFaceEffectIndex + 1);
      playGestureSound(3);
    });

    randomFaceFxBtn?.addEventListener('click', () => {
      initAudio();
      let nextIdx = Math.floor(Math.random() * FACE_EFFECTS.length);
      if (nextIdx === activeFaceEffectIndex) nextIdx = (nextIdx + 1) % FACE_EFFECTS.length;
      selectFaceEffect(nextIdx);
      playGestureSound(5);
    });

    // Draw Page button
    switchDrawPageBtn?.addEventListener('click', () => {
      initAudio();
      switchPage('draw');
    });

    // Draw Toolbar: Pen / Eraser
    toolPenBtn?.addEventListener('click', () => {
      drawTool = 'pen';
      toolPenBtn.classList.add('active');
      toolEraserBtn?.classList.remove('active');
    });
    toolEraserBtn?.addEventListener('click', () => {
      drawTool = 'eraser';
      toolEraserBtn.classList.add('active');
      toolPenBtn?.classList.remove('active');
    });

    // Brush Styles
    document.querySelectorAll('.style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        drawBrushStyle = btn.dataset.style;
        document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Color Circles
    document.querySelectorAll('.color-circle').forEach(el => {
      el.addEventListener('click', () => {
        drawColor = el.dataset.color;
        document.querySelectorAll('.color-circle').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        if (drawCustomColor) drawCustomColor.value = drawColor;
        updateDrawHud();
      });
    });

    // Custom color picker
    drawCustomColor?.addEventListener('input', (e) => {
      drawColor = e.target.value;
      document.querySelectorAll('.color-circle').forEach(c => c.classList.remove('active'));
      updateDrawHud();
    });

    // Size presets
    document.querySelectorAll('.size-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        drawSize = parseInt(btn.dataset.size, 10);
        document.querySelectorAll('.size-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateDrawHud();
      });
    });

    // Size slider
    drawSizeSlider?.addEventListener('input', (e) => {
      drawSize = parseInt(e.target.value, 10);
      document.querySelectorAll('.size-preset-btn').forEach(b => b.classList.remove('active'));
      updateDrawHud();
    });

    // Undo / Clear / Save
    undoStrokeBtn?.addEventListener('click', undoLastStroke);
    clearDrawBtn?.addEventListener('click', clearDrawCanvas);
    saveDrawBtn?.addEventListener('click', saveDrawArt);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (currentPage !== 'draw') return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undoLastStroke();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement === document.body) clearDrawCanvas();
      }
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
