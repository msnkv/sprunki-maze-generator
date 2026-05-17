// ==========================================================
// "WHAT'S MISSING?" RENDERER
// ==========================================================

// ── Full shape draws (simple, clean fills) ──────────────────

function drawBunny(ctx, cx, cy, sz) {
  ctx.fillStyle = '#ffccee'; ctx.strokeStyle = '#cc6688'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.1, sz*0.28, sz*0.32, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.24, sz*0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffaacc';
  ctx.beginPath(); ctx.ellipse(cx-sz*0.07, cy-sz*0.58, sz*0.07, sz*0.2, -0.12, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx+sz*0.07, cy-sz*0.58, sz*0.07, sz*0.2, 0.12, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#333'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx-sz*0.07, cy-sz*0.26, sz*0.03, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+sz*0.07, cy-sz*0.26, sz*0.03, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ff88aa';
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.18, sz*0.045, 0, Math.PI*2); ctx.fill();
}

function drawCat(ctx, cx, cy, sz) {
  ctx.fillStyle = '#ffbb88'; ctx.strokeStyle = '#994422'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.12, sz*0.28, sz*0.34, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.22, sz*0.24, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffbb88';
  ctx.beginPath(); ctx.moveTo(cx-sz*0.24, cy-sz*0.44); ctx.lineTo(cx-sz*0.34, cy-sz*0.64); ctx.lineTo(cx-sz*0.08, cy-sz*0.44); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+sz*0.08, cy-sz*0.44); ctx.lineTo(cx+sz*0.34, cy-sz*0.64); ctx.lineTo(cx+sz*0.24, cy-sz*0.44); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#333'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx-sz*0.09, cy-sz*0.24, sz*0.03, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+sz*0.09, cy-sz*0.24, sz*0.03, 0, Math.PI*2); ctx.fill();
}

function drawDog(ctx, cx, cy, sz) {
  ctx.fillStyle = '#d4a060'; ctx.strokeStyle = '#884422'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.14, sz*0.28, sz*0.32, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.3, sz*0.26, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#c49050';
  ctx.beginPath(); ctx.ellipse(cx-sz*0.2, cy-sz*0.54, sz*0.1, sz*0.16, 0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx+sz*0.2, cy-sz*0.54, sz*0.1, sz*0.16, -0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#333'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx-sz*0.1, cy-sz*0.34, sz*0.035, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+sz*0.1, cy-sz*0.34, sz*0.035, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.22, sz*0.055, 0, Math.PI*2); ctx.fill();
}

function drawFrog(ctx, cx, cy, sz) {
  ctx.fillStyle = '#66cc44'; ctx.strokeStyle = '#337722'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.06, sz*0.32, sz*0.26, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.22, sz*0.26, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#77dd55';
  ctx.beginPath(); ctx.ellipse(cx-sz*0.18, cy-sz*0.44, sz*0.1, sz*0.1, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx+sz*0.18, cy-sz*0.44, sz*0.1, sz*0.1, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#111'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx-sz*0.18, cy-sz*0.44, sz*0.05, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+sz*0.18, cy-sz*0.44, sz*0.05, 0, Math.PI*2); ctx.fill();
}

function drawFish(ctx, cx, cy, sz) {
  ctx.fillStyle = '#44aaff'; ctx.strokeStyle = '#1166cc'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.ellipse(cx-sz*0.06, cy, sz*0.38, sz*0.2, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#66bbff';
  ctx.beginPath(); ctx.moveTo(cx+sz*0.32, cy); ctx.lineTo(cx+sz*0.55, cy-sz*0.22); ctx.lineTo(cx+sz*0.55, cy+sz*0.22); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#111'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx-sz*0.28, cy-sz*0.06, sz*0.04, 0, Math.PI*2); ctx.fill();
}

function drawDuck(ctx, cx, cy, sz) {
  ctx.fillStyle = '#FFD700'; ctx.strokeStyle = '#aa8800'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.1, sz*0.28, sz*0.26, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.26, sz*0.18, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ff8800';
  ctx.beginPath(); ctx.moveTo(cx+sz*0.18, cy-sz*0.24); ctx.lineTo(cx+sz*0.4, cy-sz*0.2); ctx.lineTo(cx+sz*0.18, cy-sz*0.16); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#111'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx+sz*0.06, cy-sz*0.32, sz*0.035, 0, Math.PI*2); ctx.fill();
}

function drawElephant(ctx, cx, cy, sz) {
  ctx.fillStyle = '#aabbcc'; ctx.strokeStyle = '#556677'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.1, sz*0.34, sz*0.3, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx-sz*0.06, cy-sz*0.22, sz*0.26, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ccddee';
  ctx.beginPath(); ctx.ellipse(cx+sz*0.32, cy-sz*0.32, sz*0.14, sz*0.2, 0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#111'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx+sz*0.06, cy-sz*0.28, sz*0.035, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#556677'; ctx.lineWidth = sz*0.05;
  ctx.beginPath(); ctx.moveTo(cx-sz*0.28, cy-sz*0.14); ctx.quadraticCurveTo(cx-sz*0.46, cy+sz*0.1, cx-sz*0.34, cy+sz*0.3); ctx.stroke();
}

function drawBear(ctx, cx, cy, sz) {
  ctx.fillStyle = '#8B6040'; ctx.strokeStyle = '#4a2a0a'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.12, sz*0.3, sz*0.34, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.28, sz*0.26, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx-sz*0.23, cy-sz*0.54, sz*0.12, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx+sz*0.23, cy-sz*0.54, sz*0.12, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#c49060';
  ctx.beginPath(); ctx.ellipse(cx, cy-sz*0.18, sz*0.12, sz*0.09, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#333'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx-sz*0.09, cy-sz*0.3, sz*0.035, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+sz*0.09, cy-sz*0.3, sz*0.035, 0, Math.PI*2); ctx.fill();
}

function drawOwl(ctx, cx, cy, sz) {
  ctx.fillStyle = '#8B6914'; ctx.strokeStyle = '#4a3800'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.12, sz*0.26, sz*0.36, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.22, sz*0.24, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#c8a040';
  ctx.beginPath(); ctx.moveTo(cx-sz*0.16, cy-sz*0.42); ctx.lineTo(cx-sz*0.26, cy-sz*0.62); ctx.lineTo(cx-sz*0.06, cy-sz*0.42); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+sz*0.06, cy-sz*0.42); ctx.lineTo(cx+sz*0.26, cy-sz*0.62); ctx.lineTo(cx+sz*0.16, cy-sz*0.42); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.lineWidth = sz*0.025;
  ctx.beginPath(); ctx.arc(cx-sz*0.1, cy-sz*0.22, sz*0.09, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx+sz*0.1, cy-sz*0.22, sz*0.09, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#111'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx-sz*0.1, cy-sz*0.22, sz*0.05, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+sz*0.1, cy-sz*0.22, sz*0.05, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#8B6914'; ctx.strokeStyle = '#4a3800'; ctx.lineWidth = sz*0.03;
  ctx.beginPath(); ctx.ellipse(cx+sz*0.38, cy+sz*0.06, sz*0.12, sz*0.28, -0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx-sz*0.38, cy+sz*0.06, sz*0.12, sz*0.28, 0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
}

function drawHouse(ctx, cx, cy, sz) {
  ctx.fillStyle = '#ffddaa'; ctx.strokeStyle = '#885522'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.rect(cx-sz*0.38, cy-sz*0.08, sz*0.76, sz*0.53); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ee6644';
  ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.5); ctx.lineTo(cx+sz*0.44, cy-sz*0.06); ctx.lineTo(cx-sz*0.44, cy-sz*0.06); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#8B6914';
  ctx.beginPath(); ctx.rect(cx-sz*0.12, cy+sz*0.22, sz*0.24, sz*0.23); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#88ccff'; ctx.strokeStyle = '#4488cc'; ctx.lineWidth = sz*0.025;
  ctx.beginPath(); ctx.rect(cx-sz*0.32, cy-sz*0.04, sz*0.14, sz*0.14); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.rect(cx+sz*0.18, cy-sz*0.04, sz*0.14, sz*0.14); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#884400'; ctx.lineWidth = sz*0.025;
  ctx.beginPath(); ctx.arc(cx+sz*0.08, cy+sz*0.33, sz*0.03, 0, Math.PI*2); ctx.fill();
}

function drawTree(ctx, cx, cy, sz) {
  ctx.fillStyle = '#228b22'; ctx.strokeStyle = '#145214'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.54); ctx.lineTo(cx+sz*0.36, cy-sz*0.08); ctx.lineTo(cx-sz*0.36, cy-sz*0.08); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.3); ctx.lineTo(cx+sz*0.46, cy+sz*0.2); ctx.lineTo(cx-sz*0.46, cy+sz*0.2); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#8B4513'; ctx.strokeStyle = '#5a2a00';
  ctx.beginPath(); ctx.rect(cx-sz*0.1, cy+sz*0.2, sz*0.2, sz*0.3); ctx.fill(); ctx.stroke();
}

function drawFlower(ctx, cx, cy, sz) {
  ctx.fillStyle = '#44aa00'; ctx.strokeStyle = '#226600'; ctx.lineWidth = sz*0.04;
  ctx.beginPath(); ctx.moveTo(cx, cy+sz*0.1); ctx.lineTo(cx, cy+sz*0.62); ctx.stroke();
  ctx.fillStyle = '#ff69b4'; ctx.strokeStyle = '#cc3366'; ctx.lineWidth = sz*0.025;
  for (let i = 0; i < 6; i++) {
    const a = i*Math.PI/3;
    ctx.beginPath(); ctx.ellipse(cx+Math.cos(a)*sz*0.22, cy-sz*0.06+Math.sin(a)*sz*0.22, sz*0.12, sz*0.2, a, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = '#FFD700'; ctx.strokeStyle = '#cc8800'; ctx.lineWidth = sz*0.025;
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.06, sz*0.14, 0, Math.PI*2); ctx.fill(); ctx.stroke();
}

function drawMushroom(ctx, cx, cy, sz) {
  ctx.fillStyle = '#f5f0e8'; ctx.strokeStyle = '#5a2200'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.38, sz*0.22, sz*0.26, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#dd2200';
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.08, sz*0.38, Math.PI, 0); ctx.lineTo(cx+sz*0.38, cy+sz*0.06); ctx.bezierCurveTo(cx+sz*0.38, cy+sz*0.18, cx-sz*0.38, cy+sz*0.18, cx-sz*0.38, cy+sz*0.06); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#ddd'; ctx.lineWidth = sz*0.02;
  ctx.beginPath(); ctx.arc(cx-sz*0.16, cy-sz*0.18, sz*0.08, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx+sz*0.2, cy-sz*0.06, sz*0.07, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx-sz*0.04, cy+sz*0.04, sz*0.05, 0, Math.PI*2); ctx.fill(); ctx.stroke();
}

function drawStar(ctx, cx, cy, sz) {
  ctx.fillStyle = '#FFD700'; ctx.strokeStyle = '#cc8800'; ctx.lineWidth = sz*0.038;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = i*Math.PI/5 - Math.PI/2;
    const r = i%2===0 ? sz*0.44 : sz*0.2;
    if (i===0) ctx.moveTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r);
    else ctx.lineTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
}

function drawHeart(ctx, cx, cy, sz) {
  ctx.fillStyle = '#ff4466'; ctx.strokeStyle = '#cc0033'; ctx.lineWidth = sz*0.038;
  ctx.beginPath();
  ctx.moveTo(cx, cy+sz*0.46);
  ctx.bezierCurveTo(cx-sz*0.6, cy+sz*0.1, cx-sz*0.6, cy-sz*0.38, cx-sz*0.2, cy-sz*0.38);
  ctx.bezierCurveTo(cx, cy-sz*0.38, cx, cy-sz*0.18, cx, cy-sz*0.18);
  ctx.bezierCurveTo(cx, cy-sz*0.18, cx, cy-sz*0.38, cx+sz*0.2, cy-sz*0.38);
  ctx.bezierCurveTo(cx+sz*0.6, cy-sz*0.38, cx+sz*0.6, cy+sz*0.1, cx, cy+sz*0.46);
  ctx.closePath(); ctx.fill(); ctx.stroke();
}

function drawSnowman(ctx, cx, cy, sz) {
  ctx.fillStyle = '#f0f8ff'; ctx.strokeStyle = '#88aacc'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.arc(cx, cy+sz*0.3, sz*0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.08, sz*0.22, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.4, sz*0.16, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#222'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx-sz*0.06, cy-sz*0.43, sz*0.025, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+sz*0.06, cy-sz*0.43, sz*0.025, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ff6600';
  ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.38); ctx.lineTo(cx+sz*0.1, cy-sz*0.38); ctx.lineTo(cx, cy-sz*0.34); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1a1a88'; ctx.strokeStyle = '#1a1a88'; ctx.lineWidth = sz*0.025;
  ctx.beginPath(); ctx.rect(cx-sz*0.16, cy-sz*0.56, sz*0.32, sz*0.18); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx, cy-sz*0.58, sz*0.2, sz*0.05, 0, 0, Math.PI*2); ctx.fill();
}

function drawSun(ctx, cx, cy, sz) {
  ctx.fillStyle = '#FFD700'; ctx.strokeStyle = '#cc8800'; ctx.lineWidth = sz*0.038;
  for (let i = 0; i < 8; i++) {
    const a = i*Math.PI/4;
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(a-0.2)*sz*0.24, cy+Math.sin(a-0.2)*sz*0.24); ctx.lineTo(cx+Math.cos(a)*sz*0.52, cy+Math.sin(a)*sz*0.52); ctx.lineTo(cx+Math.cos(a+0.2)*sz*0.24, cy+Math.sin(a+0.2)*sz*0.24); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = '#FFE44d'; ctx.strokeStyle = '#cc8800';
  ctx.beginPath(); ctx.arc(cx, cy, sz*0.26, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#333'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx-sz*0.09, cy-sz*0.06, sz*0.04, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+sz*0.09, cy-sz*0.06, sz*0.04, 0, Math.PI*2); ctx.fill();
}

function drawRobot(ctx, cx, cy, sz) {
  ctx.fillStyle = '#88aacc'; ctx.strokeStyle = '#446688'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(cx-sz*0.28, cy-sz*0.54, sz*0.56, sz*0.34, sz*0.04); else ctx.rect(cx-sz*0.28, cy-sz*0.54, sz*0.56, sz*0.34); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#aaccee';
  ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(cx-sz*0.34, cy-sz*0.06, sz*0.68, sz*0.42, sz*0.04); else ctx.rect(cx-sz*0.34, cy-sz*0.06, sz*0.68, sz*0.42); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.lineWidth = sz*0.025;
  ctx.beginPath(); ctx.arc(cx-sz*0.12, cy-sz*0.38, sz*0.09, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx+sz*0.12, cy-sz*0.38, sz*0.09, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#2244aa'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx-sz*0.12, cy-sz*0.38, sz*0.05, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+sz*0.12, cy-sz*0.38, sz*0.05, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#888'; ctx.lineWidth = sz*0.025;
  ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.54); ctx.lineTo(cx, cy-sz*0.7); ctx.stroke();
  ctx.fillStyle = '#FFD700'; ctx.strokeStyle = '#cc8800'; ctx.lineWidth = sz*0.02;
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.7, sz*0.04, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#88aacc'; ctx.strokeStyle = '#446688'; ctx.lineWidth = sz*0.03;
  ctx.beginPath(); ctx.rect(cx-sz*0.22, cy+sz*0.36, sz*0.18, sz*0.14); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.rect(cx+sz*0.04, cy+sz*0.36, sz*0.18, sz*0.14); ctx.fill(); ctx.stroke();
}

function drawPenguin(ctx, cx, cy, sz) {
  ctx.fillStyle = '#222'; ctx.strokeStyle = '#111'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.1, sz*0.26, sz*0.38, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f0f0ee'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.12, sz*0.14, sz*0.28, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#222'; ctx.strokeStyle = '#111'; ctx.lineWidth = sz*0.035;
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.28, sz*0.18, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.lineWidth = sz*0.025;
  ctx.beginPath(); ctx.arc(cx-sz*0.06, cy-sz*0.28, sz*0.09, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx+sz*0.06, cy-sz*0.28, sz*0.09, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#111'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx-sz*0.05, cy-sz*0.28, sz*0.04, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+sz*0.07, cy-sz*0.28, sz*0.04, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ff8800';
  ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.2); ctx.lineTo(cx-sz*0.06, cy-sz*0.14); ctx.lineTo(cx+sz*0.06, cy-sz*0.14); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#222'; ctx.strokeStyle = '#111'; ctx.lineWidth = sz*0.03;
  ctx.beginPath(); ctx.ellipse(cx+sz*0.34, cy+sz*0.1, sz*0.1, sz*0.26, 0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx-sz*0.34, cy+sz*0.1, sz*0.1, sz*0.26, -0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
}

function drawButterfly(ctx, cx, cy, sz) {
  ctx.fillStyle = '#ff8844'; ctx.strokeStyle = '#aa4400'; ctx.lineWidth = sz*0.035;
  ctx.beginPath(); ctx.ellipse(cx-sz*0.28, cy-sz*0.14, sz*0.3, sz*0.22, 0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx+sz*0.28, cy-sz*0.14, sz*0.3, sz*0.22, -0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffbb44';
  ctx.beginPath(); ctx.ellipse(cx-sz*0.2, cy+sz*0.16, sz*0.2, sz*0.16, 0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx+sz*0.2, cy+sz*0.16, sz*0.2, sz*0.16, -0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#333'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.ellipse(cx, cy, sz*0.04, sz*0.38, 0, 0, Math.PI*2); ctx.fill();
}

function drawTurtle(ctx, cx, cy, sz) {
  ctx.fillStyle = '#44aa44'; ctx.strokeStyle = '#226622'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.ellipse(cx, cy, sz*0.36, sz*0.26, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#338833'; ctx.lineWidth = sz*0.025;
  for (let i = 0; i < 5; i++) { const a=i*Math.PI*2/5, r=sz*0.15; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r, cy+Math.sin(a)*r*0.72, sz*0.1, 0, Math.PI*2); ctx.fill(); }
  ctx.strokeStyle = '#226622'; ctx.lineWidth = sz*0.025;
  ctx.beginPath(); ctx.arc(cx, cy, sz*0.16, 0, Math.PI*2); ctx.stroke();
  ctx.fillStyle = '#66aa44'; ctx.strokeStyle = '#226622'; ctx.lineWidth = sz*0.03;
  ctx.beginPath(); ctx.ellipse(cx+sz*0.48, cy-sz*0.1, sz*0.12, sz*0.08, -0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx-sz*0.48, cy+sz*0.08, sz*0.12, sz*0.08, 0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx+sz*0.36, cy+sz*0.24, sz*0.1, sz*0.07, 0.6, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx-sz*0.36, cy-sz*0.22, sz*0.1, sz*0.07, -0.6, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#558833';
  ctx.beginPath(); ctx.ellipse(cx+sz*0.52, cy-sz*0.22, sz*0.1, sz*0.07, 0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#333'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx+sz*0.54, cy-sz*0.26, sz*0.025, 0, Math.PI*2); ctx.fill();
}

function drawHedgehog(ctx, cx, cy, sz) {
  ctx.strokeStyle = '#444422'; ctx.lineWidth = sz*0.025;
  ctx.fillStyle = '#888866';
  for (let a = Math.PI/6; a < Math.PI; a += Math.PI/10) {
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*sz*0.36, cy+Math.sin(a)*sz*0.26); ctx.lineTo(cx+Math.cos(a)*sz*0.54, cy+Math.sin(a)*sz*0.42); ctx.stroke();
  }
  ctx.fillStyle = '#cc9944'; ctx.strokeStyle = '#885522'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.arc(cx, cy, sz*0.36, Math.PI*0.1, Math.PI*1.9); ctx.lineTo(cx+sz*0.36, cy); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx+sz*0.26, cy-sz*0.06, sz*0.22, sz*0.2, -0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#111'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx+sz*0.38, cy-sz*0.18, sz*0.035, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(cx+sz*0.44, cy-sz*0.06, sz*0.04, 0, Math.PI*2); ctx.fill();
}

function drawOctopus(ctx, cx, cy, sz) {
  ctx.fillStyle = '#cc44aa'; ctx.strokeStyle = '#881166'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.1, sz*0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = Math.PI/8 + i*Math.PI/4;
    const x1=cx+Math.cos(a)*sz*0.28, y1=cy-sz*0.1+Math.sin(a)*sz*0.28;
    const x2=cx+Math.cos(a)*sz*0.52, y2=cy-sz*0.1+Math.sin(a)*sz*0.52;
    ctx.strokeStyle='#881166'; ctx.lineWidth=sz*0.07;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.quadraticCurveTo(x2+Math.cos(a+1)*sz*0.08, y2+Math.sin(a+1)*sz*0.08, x2,y2); ctx.stroke();
  }
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#881166'; ctx.lineWidth = sz*0.025;
  ctx.beginPath(); ctx.arc(cx-sz*0.1, cy-sz*0.12, sz*0.08, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx+sz*0.1, cy-sz*0.12, sz*0.08, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#111'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx-sz*0.1, cy-sz*0.12, sz*0.04, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+sz*0.1, cy-sz*0.12, sz*0.04, 0, Math.PI*2); ctx.fill();
}

function drawMinion(ctx, cx, cy, sz) {
  ctx.fillStyle = '#FFD700'; ctx.strokeStyle = '#886600'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.08, sz*0.3, sz*0.38, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.28, sz*0.28, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#6699cc'; ctx.strokeStyle = '#3366aa'; ctx.lineWidth = sz*0.03;
  ctx.beginPath(); ctx.ellipse(cx, cy-sz*0.28, sz*0.16, sz*0.22, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.lineWidth = sz*0.025;
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.28, sz*0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#111'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.28, sz*0.05, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#222'; ctx.strokeStyle = '#111'; ctx.lineWidth = sz*0.025;
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.1, sz*0.1, 0, Math.PI); ctx.fill();
}

function drawPikachu(ctx, cx, cy, sz) {
  ctx.fillStyle = '#FFD700'; ctx.strokeStyle = '#886600'; ctx.lineWidth = sz*0.038;
  ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.08, sz*0.28, sz*0.3, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.28, sz*0.24, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FFD700';
  ctx.beginPath(); ctx.ellipse(cx-sz*0.1, cy-sz*0.56, sz*0.09, sz*0.26, -0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.ellipse(cx-sz*0.1, cy-sz*0.72, sz*0.07, sz*0.08, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#FFD700';
  ctx.beginPath(); ctx.ellipse(cx+sz*0.1, cy-sz*0.56, sz*0.09, sz*0.26, 0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.ellipse(cx+sz*0.1, cy-sz*0.72, sz*0.07, sz*0.08, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ff4444';
  ctx.beginPath(); ctx.arc(cx-sz*0.18, cy-sz*0.2, sz*0.08, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+sz*0.18, cy-sz*0.2, sz*0.08, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#111'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx-sz*0.09, cy-sz*0.3, sz*0.04, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+sz*0.09, cy-sz*0.3, sz*0.04, 0, Math.PI*2); ctx.fill();
}

// Sprunki helper for missing renderer
function drawSprunkiSimple(ctx, cx, cy, sz, color, headColor, bodyShape) {
  const hc = headColor || color;
  const bw = bodyShape === 'narrow' ? sz*0.18 : bodyShape === 'round' ? sz*0.32 : sz*0.27;
  ctx.fillStyle = color; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = sz*0.035;
  ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.16, bw, sz*0.32, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = hc;
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.14, sz*0.24, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#111'; ctx.lineWidth = 0;
  ctx.beginPath(); ctx.arc(cx-sz*0.09, cy-sz*0.165, sz*0.024, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+sz*0.09, cy-sz*0.165, sz*0.024, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = sz*0.025;
  ctx.beginPath(); ctx.arc(cx, cy-sz*0.14+sz*0.24*0.3, sz*0.24*0.2, 0.2, Math.PI-0.2); ctx.stroke();
}

// ── Shape + missing part definitions ────────────────────────

const MISSING_DEFS = {
  bunny: {
    label: 'Зайка', hint: 'Дорисуй правое ушко!',
    draw: drawBunny,
    missing: { type: 'ellipse', x: (cx,cy,sz) => cx+sz*0.07, y: (cx,cy,sz) => cy-sz*0.58, rx: (sz) => sz*0.12, ry: (sz) => sz*0.26, angle: 0.12,
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.ellipse(cx+sz*0.07, cy-sz*0.58, sz*0.07, sz*0.2, 0.12, 0, Math.PI*2);
      }
    }
  },
  cat: {
    label: 'Кошка', hint: 'Дорисуй правое ушко!',
    draw: drawCat,
    missing: { type: 'triangle',
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.moveTo(cx+sz*0.08, cy-sz*0.44); ctx.lineTo(cx+sz*0.34, cy-sz*0.64); ctx.lineTo(cx+sz*0.24, cy-sz*0.44); ctx.closePath();
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.04, cy-sz*0.68, sz*0.36, sz*0.28]
    }
  },
  dog: {
    label: 'Собачка', hint: 'Дорисуй правое ушко!',
    draw: drawDog,
    missing: { type: 'ellipse',
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.ellipse(cx+sz*0.2, cy-sz*0.54, sz*0.12, sz*0.18, -0.2, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.06, cy-sz*0.76, sz*0.28, sz*0.3]
    }
  },
  frog: {
    label: 'Лягушка', hint: 'Дорисуй правый глазик!',
    draw: drawFrog,
    missing: { type: 'circle',
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.arc(cx+sz*0.18, cy-sz*0.44, sz*0.12, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.04, cy-sz*0.58, sz*0.28, sz*0.28]
    }
  },
  fish: {
    label: 'Рыбка', hint: 'Дорисуй хвостик!',
    draw: drawFish,
    missing: { type: 'triangle',
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.moveTo(cx+sz*0.32, cy); ctx.lineTo(cx+sz*0.55, cy-sz*0.22); ctx.lineTo(cx+sz*0.55, cy+sz*0.22); ctx.closePath();
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.28, cy-sz*0.26, sz*0.32, sz*0.52]
    }
  },
  duck: {
    label: 'Утёнок', hint: 'Дорисуй клювик!',
    draw: drawDuck,
    missing: { type: 'triangle',
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.moveTo(cx+sz*0.18, cy-sz*0.24); ctx.lineTo(cx+sz*0.4, cy-sz*0.2); ctx.lineTo(cx+sz*0.18, cy-sz*0.16); ctx.closePath();
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.15, cy-sz*0.28, sz*0.3, sz*0.2]
    }
  },
  elephant: {
    label: 'Слоник', hint: 'Дорисуй хоботок!',
    draw: drawElephant,
    missing: {
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.moveTo(cx-sz*0.28, cy-sz*0.15); ctx.quadraticCurveTo(cx-sz*0.46, cy+sz*0.1, cx-sz*0.34, cy+sz*0.3);
      },
      eraseRect: (cx,cy,sz) => [cx-sz*0.52, cy-sz*0.18, sz*0.28, sz*0.54]
    }
  },
  bear: {
    label: 'Мишка', hint: 'Дорисуй правое ушко!',
    draw: drawBear,
    missing: { type: 'circle',
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.arc(cx+sz*0.23, cy-sz*0.54, sz*0.14, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.06, cy-sz*0.7, sz*0.32, sz*0.32]
    }
  },
  owl: {
    label: 'Совёнок', hint: 'Дорисуй правое крылышко!',
    draw: drawOwl,
    missing: { type: 'ellipse',
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.ellipse(cx+sz*0.38, cy+sz*0.06, sz*0.14, sz*0.3, -0.4, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.2, cy-sz*0.28, sz*0.36, sz*0.68]
    }
  },
  house: {
    label: 'Домик', hint: 'Дорисуй трубу!',
    draw: drawHouse,
    missing: {
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.rect(cx+sz*0.2, cy-sz*0.54, sz*0.12, sz*0.2);
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.18, cy-sz*0.56, sz*0.16, sz*0.24]
    }
  },
  tree: {
    label: 'Ёлочка', hint: 'Дорисуй ствол!',
    draw: drawTree,
    missing: {
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.rect(cx-sz*0.1, cy+sz*0.2, sz*0.2, sz*0.3);
      },
      eraseRect: (cx,cy,sz) => [cx-sz*0.12, cy+sz*0.18, sz*0.24, sz*0.34]
    }
  },
  flower: {
    label: 'Цветочек', hint: 'Дорисуй правый лепесток!',
    draw: drawFlower,
    missing: { type: 'ellipse',
      outline(ctx, cx, cy, sz) {
        const a = Math.PI/3;
        ctx.beginPath(); ctx.ellipse(cx+Math.cos(a)*sz*0.22, cy-sz*0.06+Math.sin(a)*sz*0.22, sz*0.12, sz*0.2, a, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.1, cy-sz*0.36, sz*0.34, sz*0.42]
    }
  },
  mushroom: {
    label: 'Грибочек', hint: 'Дорисуй белую точку!',
    draw: drawMushroom,
    missing: { type: 'circle',
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.arc(cx+sz*0.2, cy-sz*0.06, sz*0.09, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.08, cy-sz*0.18, sz*0.24, sz*0.24]
    }
  },
  star: {
    label: 'Звёздочка', hint: 'Дорисуй правый луч!',
    draw: drawStar,
    missing: {
      outline(ctx, cx, cy, sz) {
        // right bottom point
        const a1 = (2*2)*Math.PI/5 - Math.PI/2, a2 = (2*2+1)*Math.PI/5 - Math.PI/2, a3 = (2*2+2)*Math.PI/5 - Math.PI/2;
        ctx.beginPath();
        ctx.moveTo(cx+Math.cos(a2)*sz*0.2, cy+Math.sin(a2)*sz*0.2);
        ctx.lineTo(cx+Math.cos(a1)*sz*0.44, cy+Math.sin(a1)*sz*0.44);
        ctx.lineTo(cx+Math.cos(a3-0.05)*sz*0.2, cy+Math.sin(a3-0.05)*sz*0.2);
        ctx.closePath();
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.2, cy+sz*0.02, sz*0.34, sz*0.42]
    }
  },
  heart: {
    label: 'Сердечко', hint: 'Дорисуй правую половину!',
    draw: drawHeart,
    missing: {
      outline(ctx, cx, cy, sz) {
        ctx.beginPath();
        ctx.moveTo(cx, cy-sz*0.18);
        ctx.bezierCurveTo(cx, cy-sz*0.38, cx+sz*0.2, cy-sz*0.38, cx+sz*0.2, cy-sz*0.38);
        ctx.bezierCurveTo(cx+sz*0.6, cy-sz*0.38, cx+sz*0.6, cy+sz*0.1, cx, cy+sz*0.46);
        ctx.closePath();
      },
      eraseRect: (cx,cy,sz) => [cx, cy-sz*0.42, sz*0.66, sz*0.92]
    }
  },
  butterfly: {
    label: 'Бабочка', hint: 'Дорисуй правое верхнее крылышко!',
    draw: drawButterfly,
    missing: { type: 'ellipse',
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.ellipse(cx+sz*0.28, cy-sz*0.14, sz*0.3, sz*0.22, -0.3, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx, cy-sz*0.4, sz*0.62, sz*0.52]
    }
  },
  robot: {
    label: 'Робот', hint: 'Дорисуй антенну!',
    draw: drawRobot,
    missing: {
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.54); ctx.lineTo(cx, cy-sz*0.7);
        ctx.arc(cx, cy-sz*0.7, sz*0.05, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx-sz*0.08, cy-sz*0.76, sz*0.16, sz*0.24]
    }
  },
  penguin: {
    label: 'Пингвин', hint: 'Дорисуй правое крылышко!',
    draw: drawPenguin,
    missing: { type: 'ellipse',
      outline(ctx, cx, cy, sz) {
        ctx.beginPath(); ctx.ellipse(cx+sz*0.34, cy+sz*0.1, sz*0.12, sz*0.28, 0.4, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.18, cy-sz*0.22, sz*0.32, sz*0.66]
    }
  },
  snowman: {
    label: 'Снеговик', hint: 'Дорисуй шляпу!',
    draw: drawSnowman,
    missing: {
      outline(ctx, cx, cy, sz) {
        ctx.beginPath();
        ctx.rect(cx-sz*0.16, cy-sz*0.56, sz*0.32, sz*0.18);
      },
      eraseRect: (cx,cy,sz) => [cx-sz*0.22, cy-sz*0.65, sz*0.44, sz*0.22]
    }
  },
  sun: {
    label: 'Солнышко', hint: 'Дорисуй правые лучики!',
    draw: drawSun,
    missing: {
      outline(ctx, cx, cy, sz) {
        // Draw 2 right rays as guide
        ctx.beginPath();
        for (const i of [0, 1]) {
          const a = i*Math.PI/4;
          ctx.moveTo(cx+Math.cos(a-0.2)*sz*0.26, cy+Math.sin(a-0.2)*sz*0.26);
          ctx.lineTo(cx+Math.cos(a)*sz*0.52, cy+Math.sin(a)*sz*0.52);
          ctx.lineTo(cx+Math.cos(a+0.2)*sz*0.26, cy+Math.sin(a+0.2)*sz*0.26);
          ctx.closePath();
        }
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.2, cy-sz*0.56, sz*0.4, sz*0.56]
    }
  },
  // Sprunki shapes
  sprunkiOrange: {
    label: 'Орен (Спрунки)', hint: 'Дорисуй наушник!',
    draw(ctx, cx, cy, sz) { drawSprunkiSimple(ctx, cx, cy, sz, '#ff7700'); },
    missing: {
      outline(ctx, cx, cy, sz) {
        const hr=sz*0.24, hy=cy-sz*0.14;
        ctx.beginPath(); ctx.arc(cx, hy, hr+sz*0.04, Math.PI*1.08, Math.PI*1.92);
        ctx.arc(cx+hr+sz*0.04, hy, sz*0.055, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.2, cy-sz*0.32, sz*0.22, sz*0.4]
    }
  },
  sprunkiRed: {
    label: 'Рэдди (Спрунки)', hint: 'Дорисуй шипы!',
    draw(ctx, cx, cy, sz) { drawSprunkiSimple(ctx, cx, cy, sz, '#cc1111'); },
    missing: {
      outline(ctx, cx, cy, sz) {
        const hr=sz*0.24, hy=cy-sz*0.14, n=4;
        ctx.beginPath();
        for (let i=0; i<n; i++) {
          const a=-Math.PI/2+(i-(n-1)/2)*(Math.PI*0.65/Math.max(n-1,1));
          if(Math.cos(a)>=0) {
            const bx2=cx+Math.cos(a)*hr*0.88, by2=hy+Math.sin(a)*hr*0.88;
            const tx=cx+Math.cos(a)*(hr+sz*0.21), ty=hy+Math.sin(a)*(hr+sz*0.21);
            const perp=a+Math.PI/2;
            ctx.moveTo(bx2+Math.cos(perp)*sz*0.055, by2+Math.sin(perp)*sz*0.055);
            ctx.lineTo(tx,ty);
            ctx.lineTo(bx2-Math.cos(perp)*sz*0.055, by2-Math.sin(perp)*sz*0.055);
            ctx.closePath();
          }
        }
      },
      eraseRect: (cx,cy,sz) => [cx-sz*0.04, cy-sz*0.54, sz*0.44, sz*0.44]
    }
  },
  sprunkiFunBot: {
    label: 'ФанБот (Спрунки)', hint: 'Дорисуй антенну!',
    draw(ctx, cx, cy, sz) { drawSprunkiSimple(ctx, cx, cy, sz, '#777777'); },
    missing: {
      outline(ctx, cx, cy, sz) {
        const hy=cy-sz*0.14, hr=sz*0.24;
        ctx.beginPath(); ctx.moveTo(cx, hy-hr); ctx.lineTo(cx, hy-hr-sz*0.24);
        ctx.arc(cx, hy-hr-sz*0.24, sz*0.04, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx-sz*0.08, cy-sz*0.54, sz*0.16, sz*0.32]
    }
  },
  sprunkiGreen: {
    label: 'Винерия (Спрунки)', hint: 'Дорисуй цветочки!',
    draw(ctx, cx, cy, sz) { drawSprunkiSimple(ctx, cx, cy, sz, '#228b22'); },
    missing: {
      outline(ctx, cx, cy, sz) {
        const hr=sz*0.24, hy=cy-sz*0.14, n=4;
        ctx.beginPath();
        for(let i=0;i<n;i++){
          const ang=-Math.PI/2+(i-(n-1)/2)*(Math.PI*0.55/Math.max(n-1,1));
          const fx=cx+Math.cos(ang)*hr*0.65, fy=hy+Math.sin(ang)*hr*0.65-hr*0.88;
          for(let p=0;p<5;p++){const pa=p*Math.PI*2/5;ctx.moveTo(fx+Math.cos(pa)*sz*0.06,fy+Math.sin(pa)*sz*0.06);ctx.arc(fx+Math.cos(pa)*sz*0.05,fy+Math.sin(pa)*sz*0.05,sz*0.04,0,Math.PI*2);}
        }
      },
      eraseRect: (cx,cy,sz) => [cx-sz*0.4, cy-sz*0.6, sz*0.8, sz*0.26]
    }
  },
  sprunkiPurple: {
    label: 'Дурпл (Спрунки)', hint: 'Дорисуй ушко!',
    draw(ctx, cx, cy, sz) { drawSprunkiSimple(ctx, cx, cy, sz, '#8822cc'); },
    missing: {
      outline(ctx, cx, cy, sz) {
        const hr=sz*0.24, hy=cy-sz*0.14;
        ctx.beginPath(); ctx.moveTo(cx+hr*0.42, hy-hr*0.68); ctx.lineTo(cx+hr*0.8, hy-hr*1.38); ctx.lineTo(cx+hr*0.1, hy-hr*0.9); ctx.closePath();
      },
      eraseRect: (cx,cy,sz) => [cx, cy-sz*0.54, sz*0.32, sz*0.3]
    }
  },
  sprunkiPinki: {
    label: 'Пинки (Спрунки)', hint: 'Дорисуй ушко!',
    draw(ctx, cx, cy, sz) { drawSprunkiSimple(ctx, cx, cy, sz, '#ff88bb'); },
    missing: {
      outline(ctx, cx, cy, sz) {
        const hr=sz*0.24, hy=cy-sz*0.14;
        ctx.beginPath(); ctx.ellipse(cx+hr*0.28, hy-hr*1.55, hr*0.14, hr*0.46, 0.1, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.04, cy-sz*0.6, sz*0.2, sz*0.32]
    }
  },
  sprunkiBlack: {
    label: 'Блэк (Спрунки)', hint: 'Дорисуй цилиндр!',
    draw(ctx, cx, cy, sz) { drawSprunkiSimple(ctx, cx, cy, sz, '#111111', '#222222'); },
    missing: {
      outline(ctx, cx, cy, sz) {
        const hr=sz*0.24, hy=cy-sz*0.14;
        ctx.beginPath(); ctx.ellipse(cx, hy-hr, hr*1.18, hr*0.2, 0, 0, Math.PI*2);
        ctx.rect(cx-hr*0.64, hy-hr-sz*0.28, hr*1.28, sz*0.28);
      },
      eraseRect: (cx,cy,sz) => [cx-sz*0.35, cy-sz*0.68, sz*0.7, sz*0.34]
    }
  },
  sprunkiGray: {
    label: 'Грэй (Спрунки)', hint: 'Дорисуй очки!',
    draw(ctx, cx, cy, sz) { drawSprunkiSimple(ctx, cx, cy, sz, '#888888'); },
    missing: {
      outline(ctx, cx, cy, sz) {
        const hr=sz*0.24, hy=cy-sz*0.14;
        ctx.beginPath(); ctx.ellipse(cx+hr*0.3, hy-hr*0.08, hr*0.2, hr*0.18, 0, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.04, cy-sz*0.3, sz*0.22, sz*0.2]
    }
  },
  sprunkiBrown: {
    label: 'Бруд (Спрунки)', hint: 'Дорисуй шапку!',
    draw(ctx, cx, cy, sz) { drawSprunkiSimple(ctx, cx, cy, sz, '#7b4a1e'); },
    missing: {
      outline(ctx, cx, cy, sz) {
        const hr=sz*0.24, hy=cy-sz*0.14;
        const btop=hy-hr*0.25;
        ctx.beginPath(); ctx.arc(cx, btop, hr*1.08, Math.PI, 0); ctx.lineTo(cx+hr*0.78, btop-sz*0.3); ctx.lineTo(cx-hr*0.78, btop-sz*0.3); ctx.closePath();
      },
      eraseRect: (cx,cy,sz) => [cx-sz*0.34, cy-sz*0.62, sz*0.68, sz*0.4]
    }
  },
  sprunkiGold: {
    label: 'Гарнольд (Спрунки)', hint: 'Дорисуй визор!',
    draw(ctx, cx, cy, sz) { drawSprunkiSimple(ctx, cx, cy, sz, '#c8960a'); },
    missing: {
      outline(ctx, cx, cy, sz) {
        const hr=sz*0.24, hy=cy-sz*0.14;
        ctx.beginPath(); ctx.ellipse(cx, hy, hr*0.84, hr*0.54, 0, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx-sz*0.22, cy-sz*0.28, sz*0.44, sz*0.28]
    }
  },
  sprunkiLime: {
    label: 'Облакс (Спрунки)', hint: 'Дорисуй корону!',
    draw(ctx, cx, cy, sz) { drawSprunkiSimple(ctx, cx, cy, sz, '#88dd00'); },
    missing: {
      outline(ctx, cx, cy, sz) {
        const hr=sz*0.24, hy=cy-sz*0.14, cw=hr*1.08, ch=sz*0.22;
        ctx.beginPath();
        ctx.moveTo(cx-cw, hy-hr); ctx.lineTo(cx-cw, hy-hr-ch);
        ctx.lineTo(cx-cw*0.38, hy-hr-ch*0.48); ctx.lineTo(cx, hy-hr-ch);
        ctx.lineTo(cx+cw*0.38, hy-hr-ch*0.48); ctx.lineTo(cx+cw, hy-hr-ch);
        ctx.lineTo(cx+cw, hy-hr); ctx.closePath();
      },
      eraseRect: (cx,cy,sz) => [cx-sz*0.32, cy-sz*0.62, sz*0.64, sz*0.3]
    }
  },
  sprunkiTan: {
    label: 'Танер (Спрунки)', hint: 'Дорисуй шляпу!',
    draw(ctx, cx, cy, sz) { drawSprunkiSimple(ctx, cx, cy, sz, '#c8a06a'); },
    missing: {
      outline(ctx, cx, cy, sz) {
        const hr=sz*0.24, hy=cy-sz*0.14;
        ctx.beginPath(); ctx.ellipse(cx, hy-hr, hr*1.42, hr*0.24, 0, 0, Math.PI*2);
        ctx.moveTo(cx-hr*0.7, hy-hr); ctx.quadraticCurveTo(cx, hy-hr-sz*0.28, cx+hr*0.7, hy-hr); ctx.closePath();
      },
      eraseRect: (cx,cy,sz) => [cx-sz*0.36, cy-sz*0.64, sz*0.72, sz*0.36]
    }
  },
  sprunkiYellow: {
    label: 'Саймон (Спрунки)', hint: 'Дорисуй ушко!',
    draw(ctx, cx, cy, sz) { drawSprunkiSimple(ctx, cx, cy, sz, '#ffdd00'); },
    missing: {
      outline(ctx, cx, cy, sz) {
        const hr=sz*0.24, hy=cy-sz*0.14;
        ctx.beginPath(); ctx.arc(cx+hr*1.24, hy, hr*0.42, 0, Math.PI*2);
      },
      eraseRect: (cx,cy,sz) => [cx+sz*0.18, cy-sz*0.28, sz*0.32, sz*0.28]
    }
  },
};

// ── Drawing helpers ─────────────────────────────────────────

function drawDottedOutline(ctx, missingDef, cx, cy, sz, accentColor) {
  ctx.save();
  ctx.setLineDash([6, 7]);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2.5;
  ctx.fillStyle = 'transparent';
  missingDef.outline(ctx, cx, cy, sz);
  ctx.stroke();
  ctx.restore();
}

function eraseRegion(ctx, missingDef, cx, cy, sz) {
  if (missingDef.eraseRect) {
    const [ex, ey, ew, eh] = missingDef.eraseRect(cx, cy, sz);
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillRect(ex, ey, ew, eh);
    ctx.restore();
    // Re-fill white
    ctx.fillStyle = '#fff';
    ctx.fillRect(ex, ey, ew, eh);
  }
}

// ── Page header ─────────────────────────────────────────────

function drawMissingHeader(ctx, config, canvasW) {
  const title = config.pageTitle || 'Чего не хватает?';
  ctx.fillStyle = config.accentColor || '#ff9800';
  ctx.fillRect(0, 0, canvasW, 52);
  ctx.fillStyle = '#fff';
  ctx.font = `bold 26px "Fredoka One", cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, canvasW / 2, 26);
}

// ── Render one page ─────────────────────────────────────────

export function renderMissingPage(ctx, config, pageIndex) {
  const canvas = ctx.canvas;
  const W = canvas.width;
  const H = canvas.height;
  const scale = W / 794;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);
  drawMissingHeader(ctx, config, W);

  const shapes = config.shapes && config.shapes.length
    ? config.shapes
    : Object.keys(MISSING_DEFS);
  const shape = config.shape || shapes[pageIndex % shapes.length];
  const shapeDef = MISSING_DEFS[shape] || MISSING_DEFS.bunny;

  const headerH = 60 * scale;
  const margin = 40 * scale;
  const cx = W / 2;
  const cy = headerH + margin + (H - headerH - margin * 2) * 0.44;
  const sz = Math.min(W, H - headerH - margin * 2) * 0.28;

  // Draw full shape
  shapeDef.draw(ctx, cx, cy, sz);

  // Erase the missing part region
  eraseRegion(ctx, shapeDef.missing, cx, cy, sz);

  // Draw dotted outline of missing part
  drawDottedOutline(ctx, shapeDef.missing, cx, cy, sz, config.accentColor || '#ff9800');

  // Hint text
  if (config.showHint !== false) {
    const hintY = headerH + margin + (H - headerH - margin * 2) * 0.88;
    ctx.fillStyle = config.accentColor || '#ff9800';
    ctx.font = `bold ${Math.round(18 * scale)}px "Fredoka One", cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(shapeDef.hint, cx, hintY);
  }

  // Shape label
  const labelY = headerH + margin + (H - headerH - margin * 2) * 0.76;
  ctx.fillStyle = '#555';
  ctx.font = `bold ${Math.round(22 * scale)}px "Fredoka One", cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(shapeDef.label, cx, labelY);

  // Page number
  if ((config.pages || 1) > 1) {
    ctx.fillStyle = '#aaa';
    ctx.font = `${Math.round(12 * scale)}px sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`Стр. ${pageIndex + 1} / ${config.pages}`, W - 16 * scale, H - 8 * scale);
  }
}

// ── Render all pages ─────────────────────────────────────────

export function renderMissingAllPages(config) {
  const pages = config.pages || 1;
  const shapes = config.shapes && config.shapes.length
    ? config.shapes
    : Object.keys(MISSING_DEFS);
  for (let i = 0; i < pages; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = 794; canvas.height = 1123;
    document.body.appendChild(canvas);
    const cfg = { ...config, shape: shapes[i % shapes.length] };
    renderMissingPage(canvas.getContext('2d'), cfg, i);
  }
}
