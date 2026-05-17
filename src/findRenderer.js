// findRenderer.js — "Спаси друга" visual search puzzle

function mkRng(seed) {
  let s = ((seed ^ 0x9e3779b9) >>> 0) || 1;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0x100000000; };
}

// ─── Shape outline functions ─────────────────────────────────────────────────
// Each function draws and strokes one shape at (cx, cy) with size ~sz px.
// Caller must set ctx.strokeStyle / lineWidth / lineCap before calling.

function oStar(ctx, cx, cy, sz) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? sz * 0.5 : sz * 0.22;
    const a = (i * Math.PI / 5) - Math.PI / 2;
    i === 0 ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
            : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  ctx.closePath(); ctx.stroke();
}

function oHeart(ctx, cx, cy, sz) {
  const s = sz * 0.44;
  ctx.beginPath();
  ctx.moveTo(cx, cy + s);
  ctx.bezierCurveTo(cx - s * 1.6, cy + s * 0.3, cx - s * 1.6, cy - s * 0.9, cx, cy - s * 0.15);
  ctx.bezierCurveTo(cx + s * 1.6, cy - s * 0.9, cx + s * 1.6, cy + s * 0.3, cx, cy + s);
  ctx.stroke();
}

function oHouse(ctx, cx, cy, sz) {
  const w = sz * 0.85, h = sz * 0.62, rh = sz * 0.44;
  const bx = cx - w / 2, by = cy - h / 2 + rh * 0.3;
  ctx.beginPath();
  ctx.moveTo(bx, by + h); ctx.lineTo(bx, by);
  ctx.lineTo(cx, by - rh); ctx.lineTo(bx + w, by);
  ctx.lineTo(bx + w, by + h); ctx.closePath();
  ctx.moveTo(cx - sz * 0.14, by + h);
  ctx.lineTo(cx - sz * 0.14, by + h * 0.48);
  ctx.arc(cx, by + h * 0.48, sz * 0.14, Math.PI, 0);
  ctx.lineTo(cx + sz * 0.14, by + h);
  ctx.stroke();
}

function oTree(ctx, cx, cy, sz) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - sz * 0.52);
  ctx.lineTo(cx + sz * 0.48, cy + sz * 0.05);
  ctx.lineTo(cx + sz * 0.3, cy + sz * 0.05);
  ctx.lineTo(cx + sz * 0.42, cy + sz * 0.35);
  ctx.lineTo(cx + sz * 0.18, cy + sz * 0.2);
  ctx.lineTo(cx + sz * 0.09, cy + sz * 0.52);
  ctx.lineTo(cx - sz * 0.09, cy + sz * 0.52);
  ctx.lineTo(cx - sz * 0.18, cy + sz * 0.2);
  ctx.lineTo(cx - sz * 0.42, cy + sz * 0.35);
  ctx.lineTo(cx - sz * 0.3, cy + sz * 0.05);
  ctx.lineTo(cx - sz * 0.48, cy + sz * 0.05);
  ctx.closePath();
  ctx.moveTo(cx - sz * 0.09, cy + sz * 0.52); ctx.lineTo(cx - sz * 0.09, cy + sz * 0.7);
  ctx.lineTo(cx + sz * 0.09, cy + sz * 0.7); ctx.lineTo(cx + sz * 0.09, cy + sz * 0.52);
  ctx.stroke();
}

function oBunny(ctx, cx, cy, sz) {
  ctx.beginPath(); ctx.arc(cx, cy + sz * 0.08, sz * 0.38, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx - sz * 0.22, cy - sz * 0.58, sz * 0.1, sz * 0.28, -0.18, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx + sz * 0.22, cy - sz * 0.58, sz * 0.1, sz * 0.28, 0.18, 0, Math.PI * 2); ctx.stroke();
}

function oCat(ctx, cx, cy, sz) {
  ctx.beginPath(); ctx.arc(cx, cy + sz * 0.05, sz * 0.38, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - sz * 0.3, cy - sz * 0.28); ctx.lineTo(cx - sz * 0.16, cy - sz * 0.62); ctx.lineTo(cx - sz * 0.02, cy - sz * 0.3);
  ctx.moveTo(cx + sz * 0.3, cy - sz * 0.28); ctx.lineTo(cx + sz * 0.16, cy - sz * 0.62); ctx.lineTo(cx + sz * 0.02, cy - sz * 0.3);
  ctx.stroke();
}

function oButterfly(ctx, cx, cy, sz) {
  ctx.beginPath(); ctx.ellipse(cx - sz * 0.3, cy - sz * 0.14, sz * 0.28, sz * 0.38, -0.5, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx + sz * 0.3, cy - sz * 0.14, sz * 0.28, sz * 0.38, 0.5, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx - sz * 0.22, cy + sz * 0.22, sz * 0.2, sz * 0.28, 0.5, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx + sz * 0.22, cy + sz * 0.22, sz * 0.2, sz * 0.28, -0.5, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - sz * 0.38); ctx.bezierCurveTo(cx - sz * 0.06, cy, cx + sz * 0.06, cy, cx, cy + sz * 0.38); ctx.stroke();
}

function oSnowman(ctx, cx, cy, sz) {
  ctx.beginPath(); ctx.arc(cx, cy + sz * 0.28, sz * 0.32, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy - sz * 0.18, sz * 0.22, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - sz * 0.28, cy - sz * 0.4); ctx.lineTo(cx + sz * 0.28, cy - sz * 0.4);
  ctx.moveTo(cx - sz * 0.18, cy - sz * 0.4); ctx.lineTo(cx - sz * 0.18, cy - sz * 0.68);
  ctx.lineTo(cx + sz * 0.18, cy - sz * 0.68); ctx.lineTo(cx + sz * 0.18, cy - sz * 0.4);
  ctx.stroke();
}

function oSun(ctx, cx, cy, sz) {
  ctx.beginPath(); ctx.arc(cx, cy, sz * 0.32, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    ctx.moveTo(cx + Math.cos(a) * sz * 0.38, cy + Math.sin(a) * sz * 0.38);
    ctx.lineTo(cx + Math.cos(a) * sz * 0.54, cy + Math.sin(a) * sz * 0.54);
  }
  ctx.stroke();
}

function oPenguin(ctx, cx, cy, sz) {
  ctx.beginPath(); ctx.ellipse(cx, cy + sz * 0.15, sz * 0.3, sz * 0.42, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy - sz * 0.3, sz * 0.2, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - sz * 0.3, cy); ctx.bezierCurveTo(cx - sz * 0.55, cy - sz * 0.08, cx - sz * 0.55, cy + sz * 0.3, cx - sz * 0.3, cy + sz * 0.36);
  ctx.moveTo(cx + sz * 0.3, cy); ctx.bezierCurveTo(cx + sz * 0.55, cy - sz * 0.08, cx + sz * 0.55, cy + sz * 0.3, cx + sz * 0.3, cy + sz * 0.36);
  ctx.stroke();
}

function oRobot(ctx, cx, cy, sz) {
  ctx.beginPath(); ctx.rect(cx - sz * 0.32, cy - sz * 0.05, sz * 0.64, sz * 0.55); ctx.stroke();
  ctx.beginPath(); ctx.rect(cx - sz * 0.24, cy - sz * 0.52, sz * 0.48, sz * 0.45); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - sz * 0.52); ctx.lineTo(cx, cy - sz * 0.65);
  ctx.arc(cx, cy - sz * 0.68, sz * 0.06, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath(); ctx.arc(cx - sz * 0.1, cy - sz * 0.33, sz * 0.07, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx + sz * 0.1, cy - sz * 0.33, sz * 0.07, 0, Math.PI * 2); ctx.stroke();
}

function oAlien(ctx, cx, cy, sz) {
  ctx.beginPath(); ctx.ellipse(cx, cy, sz * 0.38, sz * 0.5, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx - sz * 0.17, cy - sz * 0.1, sz * 0.1, sz * 0.15, -0.3, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx + sz * 0.17, cy - sz * 0.1, sz * 0.1, sz * 0.15, 0.3, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - sz * 0.14, cy - sz * 0.5); ctx.lineTo(cx - sz * 0.22, cy - sz * 0.7);
  ctx.arc(cx - sz * 0.22, cy - sz * 0.73, sz * 0.06, 0, Math.PI * 2);
  ctx.moveTo(cx + sz * 0.14, cy - sz * 0.5); ctx.lineTo(cx + sz * 0.22, cy - sz * 0.7);
  ctx.arc(cx + sz * 0.22, cy - sz * 0.73, sz * 0.06, 0, Math.PI * 2);
  ctx.stroke();
}

function oTurtle(ctx, cx, cy, sz) {
  ctx.beginPath(); ctx.ellipse(cx, cy, sz * 0.38, sz * 0.28, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx + sz * 0.46, cy - sz * 0.08, sz * 0.12, 0, Math.PI * 2); ctx.stroke();
  [[-0.25, 0.22], [0.25, 0.22], [-0.25, -0.22], [0.25, -0.22]].forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.ellipse(cx + sz * (dx > 0 ? dx + 0.15 : dx - 0.15), cy + sz * (dy > 0 ? dy + 0.1 : dy - 0.1),
      sz * 0.1, sz * 0.08, dx > 0 ? 0.5 : -0.5, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function oHedgehog(ctx, cx, cy, sz) {
  ctx.beginPath();
  ctx.arc(cx - sz * 0.05, cy + sz * 0.05, sz * 0.35, Math.PI * 0.18, Math.PI, false);
  ctx.lineTo(cx - sz * 0.4, cy + sz * 0.1); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx + sz * 0.3, cy + sz * 0.15, sz * 0.15, Math.PI * 0.65, Math.PI * 2.35, false); ctx.stroke();
  for (let i = 0; i < 7; i++) {
    const a = Math.PI * 0.18 + i * Math.PI * 0.82 / 6;
    ctx.beginPath();
    ctx.moveTo(cx - sz * 0.05 + Math.cos(a) * sz * 0.35, cy + sz * 0.05 + Math.sin(a) * sz * 0.35);
    ctx.lineTo(cx - sz * 0.05 + Math.cos(a) * sz * 0.54, cy + sz * 0.05 + Math.sin(a) * sz * 0.54);
    ctx.stroke();
  }
}

function oOctopus(ctx, cx, cy, sz) {
  ctx.beginPath(); ctx.arc(cx, cy - sz * 0.1, sz * 0.3, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const x0 = cx + (i - 1.5) * sz * 0.18;
    const flip = i < 2 ? -1 : 1;
    ctx.beginPath(); ctx.moveTo(x0, cy + sz * 0.2);
    ctx.bezierCurveTo(x0 + flip * sz * 0.2, cy + sz * 0.5, x0 - flip * sz * 0.12, cy + sz * 0.68, x0 + flip * sz * 0.06, cy + sz * 0.76);
    ctx.stroke();
  }
}

function oMinion(ctx, cx, cy, sz) {
  ctx.beginPath(); ctx.ellipse(cx, cy + sz * 0.05, sz * 0.3, sz * 0.48, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy - sz * 0.18, sz * 0.2, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy - sz * 0.18, sz * 0.1, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - sz * 0.12, cy - sz * 0.05); ctx.lineTo(cx - sz * 0.12, cy + sz * 0.1);
  ctx.moveTo(cx + sz * 0.12, cy - sz * 0.05); ctx.lineTo(cx + sz * 0.12, cy + sz * 0.1);
  ctx.stroke();
}

function oPikachu(ctx, cx, cy, sz) {
  ctx.beginPath(); ctx.arc(cx, cy, sz * 0.38, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - sz * 0.2, cy - sz * 0.32); ctx.lineTo(cx - sz * 0.32, cy - sz * 0.72); ctx.lineTo(cx - sz * 0.08, cy - sz * 0.32);
  ctx.moveTo(cx + sz * 0.2, cy - sz * 0.32); ctx.lineTo(cx + sz * 0.32, cy - sz * 0.72); ctx.lineTo(cx + sz * 0.08, cy - sz * 0.32);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + sz * 0.35, cy + sz * 0.22);
  ctx.bezierCurveTo(cx + sz * 0.58, cy + sz * 0.05, cx + sz * 0.68, cy - sz * 0.18, cx + sz * 0.52, cy - sz * 0.28);
  ctx.stroke();
}

const OUTLINES = {
  star: oStar, heart: oHeart, house: oHouse, tree: oTree,
  bunny: oBunny, cat: oCat, butterfly: oButterfly,
  snowman: oSnowman, sun: oSun, penguin: oPenguin,
  robot: oRobot, alien: oAlien, turtle: oTurtle,
  hedgehog: oHedgehog, octopus: oOctopus,
  minion: oMinion, pikachu: oPikachu,
};

const LABELS = {
  star: 'Звёздочка', heart: 'Сердечко', house: 'Домик', tree: 'Ёлочка',
  bunny: 'Зайка', cat: 'Кошка', butterfly: 'Бабочка',
  snowman: 'Снеговик', sun: 'Солнышко', penguin: 'Пингвин',
  robot: 'Робот', alien: 'Пришелец', turtle: 'Черепаха',
  hedgehog: 'Ёжик', octopus: 'Осьминог',
  minion: 'Миньон', pikachu: 'Пикачу',
};

// ─── Background noise ───────────────────────────────────────────────────────

function drawNoise(ctx, rx, ry, rw, rh, density, seed) {
  const rng = mkRng(seed);
  const sc = rw / 750;
  ctx.save();
  ctx.strokeStyle = '#aaa';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 1.3 * sc;

  // Long wavy lines spanning full width
  const lineCount = Math.round(18 + density * 22);
  for (let i = 0; i < lineCount; i++) {
    const startY = ry + rng() * rh;
    ctx.beginPath();
    ctx.moveTo(rx - rw * 0.06, startY);
    const segs = 5 + Math.floor(rng() * 7);
    const segW = rw * 1.12 / segs;
    let curY = startY;
    for (let s = 0; s < segs; s++) {
      const cpx = rx - rw * 0.06 + segW * (s + 0.4 + rng() * 0.2);
      const cpy = curY + (rng() - 0.5) * rh * 0.25;
      const ex  = rx - rw * 0.06 + segW * (s + 1);
      const ey  = curY + (rng() - 0.5) * rh * 0.18;
      ctx.quadraticCurveTo(cpx, cpy, ex, ey);
      curY = ey;
    }
    ctx.stroke();
  }

  // Circles and ovals
  const circCount = Math.round(10 + density * 12);
  for (let i = 0; i < circCount; i++) {
    const cx = rx + rng() * rw, cy = ry + rng() * rh;
    const rxr = (12 + rng() * 48) * sc;
    const ryr = rxr * (0.55 + rng() * 0.9);
    ctx.beginPath();
    ctx.ellipse(cx, cy, rxr, ryr, rng() * Math.PI, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Random zigzag segments
  const zigCount = Math.round(7 + density * 9);
  for (let i = 0; i < zigCount; i++) {
    const zx = rx + rng() * rw, zy = ry + rng() * rh;
    ctx.beginPath();
    ctx.moveTo(zx, zy);
    const pts = 3 + Math.floor(rng() * 5);
    for (let p = 0; p < pts; p++) {
      ctx.lineTo(zx + (rng() - 0.5) * rw * 0.55, zy + (rng() - 0.5) * rh * 0.45);
    }
    ctx.stroke();
  }

  // Small geometric polygons
  const geoCount = Math.round(5 + density * 7);
  for (let i = 0; i < geoCount; i++) {
    const gx = rx + rng() * rw, gy = ry + rng() * rh;
    const gr = (9 + rng() * 22) * sc;
    const sides = 3 + Math.floor(rng() * 3);
    const baseA = rng() * Math.PI;
    ctx.beginPath();
    for (let s = 0; s <= sides; s++) {
      const a = baseA + s * Math.PI * 2 / sides;
      s === 0 ? ctx.moveTo(gx + Math.cos(a) * gr, gy + Math.sin(a) * gr)
              : ctx.lineTo(gx + Math.cos(a) * gr, gy + Math.sin(a) * gr);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Looping spiral-ish curves
  const loopCount = Math.round(4 + density * 5);
  for (let i = 0; i < loopCount; i++) {
    const lx = rx + rng() * rw, ly = ry + rng() * rh;
    const lr = (20 + rng() * 40) * sc;
    ctx.beginPath();
    ctx.moveTo(lx + lr, ly);
    for (let a = 0; a <= Math.PI * 4; a += 0.3) {
      const r = lr * (1 - a / (Math.PI * 5));
      ctx.lineTo(lx + Math.cos(a) * r, ly + Math.sin(a) * r);
    }
    ctx.stroke();
  }

  ctx.restore();
}

// ─── Shape placement ────────────────────────────────────────────────────────

function placeShapes(count, rx, ry, rw, rh, sz, seed) {
  const rng = mkRng(seed + 77777);
  const margin = sz * 0.78;
  const placed = [];

  for (let n = 0; n < count; n++) {
    let pos = null;
    for (let attempt = 0; attempt < 400 && !pos; attempt++) {
      const px = rx + margin + rng() * (rw - margin * 2);
      const py = ry + margin + rng() * (rh - margin * 2);
      const ok = placed.every(p => Math.hypot(p.cx - px, p.cy - py) > sz * 2.0);
      if (ok) pos = { cx: px, cy: py };
    }
    if (!pos) {
      const cols = Math.ceil(Math.sqrt(count));
      const rows = Math.ceil(count / cols);
      pos = {
        cx: rx + margin + (rw - margin * 2) * (n % cols + 0.5) / cols,
        cy: ry + margin + (rh - margin * 2) * (Math.floor(n / cols) + 0.5) / rows,
      };
    }
    placed.push(pos);
  }
  return placed;
}

// ─── Main render ─────────────────────────────────────────────────────────────

export function renderFindPage(ctx, config, pageIndex) {
  const {
    hiddenCount   = 3,
    difficulty    = 2,
    showHint      = true,
    availableShapes = Object.keys(OUTLINES),
    pageTitle     = 'Спаси друга',
    accentColor   = '#e53935',
  } = config;

  const W = ctx.canvas.width, H = ctx.canvas.height;
  const pxmm = W / 210;
  const pad  = 8 * pxmm;

  const seed = (pageIndex + 1) * 7919 + 42;
  const rng  = mkRng(seed);

  // Background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);

  // Border
  ctx.save();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(pad * 0.5, pad * 0.5, W - pad, H - pad);
  ctx.restore();

  // Title
  const titleH = 12 * pxmm;
  ctx.save();
  ctx.fillStyle = accentColor;
  ctx.font = `bold ${Math.round(titleH)}px "Fredoka One", cursive`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(pageTitle, W / 2, pad + titleH / 2 + 2 * pxmm);
  ctx.restore();

  // Subtitle
  ctx.save();
  ctx.fillStyle = '#666';
  ctx.font = `${Math.round(5.5 * pxmm)}px "Nunito", sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('Найди и обведи всех спрятанных друзей!', W / 2, pad + titleH + 6 * pxmm);
  ctx.restore();

  // Layout
  const contentTop    = pad + titleH + 11 * pxmm;
  const hintH         = showHint ? 33 * pxmm : 0;
  const contentBottom = H - pad - hintH - 2 * pxmm;
  const contentX      = pad;
  const contentW      = W - 2 * pad;
  const contentH      = contentBottom - contentTop;

  // Shape size by difficulty (radius in px)
  const szPx = [82, 60, 44][difficulty - 1] * (W / 794);

  // Pick hidden shapes
  const avail    = availableShapes.filter(k => OUTLINES[k]);
  const shuffled = [...avail].sort(() => rng() - 0.5);
  const keys     = shuffled.slice(0, Math.min(hiddenCount, avail.length));

  // Positions
  const positions = placeShapes(keys.length, contentX, contentTop, contentW, contentH, szPx, seed);

  // Noise density
  const density = [1.0, 1.85, 2.9][difficulty - 1];

  // ── Clip to content zone
  ctx.save();
  ctx.beginPath();
  ctx.rect(contentX, contentTop, contentW, contentH);
  ctx.clip();

  // Layer 1: noise behind shapes (60%)
  drawNoise(ctx, contentX, contentTop, contentW, contentH, density * 0.6, seed + 10);

  // Hidden shapes (slightly darker than noise, same weight → "hidden in plain sight")
  ctx.save();
  ctx.strokeStyle = '#686868';
  ctx.lineWidth   = 2.5 * (W / 794);
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  for (let i = 0; i < keys.length; i++) {
    const fn = OUTLINES[keys[i]];
    if (fn) fn(ctx, positions[i].cx, positions[i].cy, szPx);
  }
  ctx.restore();

  // Layer 2: noise on top of shapes (40%) — lines "pass through" characters
  drawNoise(ctx, contentX, contentTop, contentW, contentH, density * 0.4, seed + 20);

  ctx.restore(); // end clip

  // ── Hint strip
  if (showHint && hintH > 0) {
    const sepY = contentBottom + 2 * pxmm;

    ctx.save();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(pad, sepY); ctx.lineTo(W - pad, sepY);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();

    const hy = sepY + 3 * pxmm;

    ctx.save();
    ctx.fillStyle = '#555';
    ctx.font = `bold ${Math.round(5 * pxmm)}px "Nunito", sans-serif`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('Кого найти:', pad, hy + hintH * 0.18);
    ctx.restore();

    const thumbSz   = Math.min(hintH * 0.48, 16 * pxmm);
    const labelPad  = 24 * pxmm;
    const thumbArea = contentW - labelPad;
    const spacing   = thumbArea / keys.length;

    for (let i = 0; i < keys.length; i++) {
      const tx = pad + labelPad + spacing * (i + 0.5);
      const ty = hy + hintH * 0.38;

      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth   = 2.2 * (W / 794);
      ctx.lineCap     = 'round'; ctx.lineJoin = 'round';
      const fn = OUTLINES[keys[i]];
      if (fn) fn(ctx, tx, ty, thumbSz);
      ctx.restore();

      ctx.save();
      ctx.fillStyle = '#444';
      ctx.font = `${Math.round(4 * pxmm)}px "Nunito", sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(LABELS[keys[i]] || keys[i], tx, ty + thumbSz * 0.72);
      ctx.restore();
    }
  }
}

// ─── All pages (for print HTML) ──────────────────────────────────────────────

export function renderFindAllPages(config) {
  const pages = config.pages || 1;
  for (let i = 0; i < pages; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = 794; canvas.height = 1123;
    document.body.appendChild(canvas);
    renderFindPage(canvas.getContext('2d'), config, i);
  }
}
