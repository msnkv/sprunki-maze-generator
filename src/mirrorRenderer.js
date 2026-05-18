// ==========================================================
// HELPERS
// ==========================================================
function drawStar5pt(ctx, cx, cy, r) {
  const r2 = r * 0.4, n = 5;
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const a = (i * Math.PI / n) - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r2;
    if (i === 0) ctx.moveTo(cx + Math.cos(a)*rr, cy + Math.sin(a)*rr);
    else ctx.lineTo(cx + Math.cos(a)*rr, cy + Math.sin(a)*rr);
  }
  ctx.closePath();
}

function samplePts(arr, n) {
  if (n <= 0 || arr.length === 0) return [];
  if (n >= arr.length) return arr.slice();
  const out = [];
  for (let i = 0; i < n; i++) out.push(arr[Math.round(i * (arr.length - 1) / (n - 1))]);
  return out;
}

// ==========================================================
// SHAPE DEFINITIONS
// ==========================================================
const SHAPE_DEFS = {
  bunny: {
    label: 'Зайка',
    hint: '🐰 Чего не хватает Зайке? Дорисуй второе ушко!',
    draw(ctx, cx, cy, sz) {
      const lw = sz * 0.045;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      for (const ex of [-0.18, 0.18]) {
        ctx.fillStyle = '#f5f5f5';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy-sz*0.85, sz*0.1, sz*0.28, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffcdd2';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy-sz*0.85, sz*0.055, sz*0.2, 0, 0, Math.PI*2); ctx.fill();
      }
      ctx.fillStyle = '#f5f5f5'; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.4, sz*0.32, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.arc(cx-sz*0.11, cy-sz*0.46, sz*0.04, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.11, cy-sz*0.46, sz*0.04, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#f48fb1';
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.33, sz*0.03, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#f5f5f5'; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.22, sz*0.28, sz*0.38, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      for (const [px, ang] of [[-0.3, -0.3], [0.3, 0.3]]) {
        ctx.fillStyle = '#f5f5f5';
        ctx.beginPath(); ctx.ellipse(cx+px*sz, cy+sz*0.5, sz*0.13, sz*0.07, ang, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx+sz*0.3, cy+sz*0.08, sz*0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      for (let a = 0; a < Math.PI*2; a += Math.PI/10) {
        const px = cx+sz*0.18+Math.cos(a)*sz*0.1, py = cy-sz*0.85+Math.sin(a)*sz*0.28;
        if (px >= cx) pts.push([px, py]);
      }
      for (let a = -Math.PI/2; a <= Math.PI/2; a += Math.PI/10)
        pts.push([cx+Math.cos(a)*sz*0.32, cy-sz*0.4+Math.sin(a)*sz*0.32]);
      pts.push([cx+sz*0.11, cy-sz*0.46]);
      for (let a = -Math.PI/2; a <= Math.PI/2; a += Math.PI/10)
        pts.push([cx+Math.cos(a)*sz*0.28, cy+sz*0.22+Math.sin(a)*sz*0.38]);
      for (let a = 0; a < Math.PI*2; a += Math.PI/4) {
        const px = cx+sz*0.3+Math.cos(a+0.3)*sz*0.13, py = cy+sz*0.5+Math.sin(a+0.3)*sz*0.07;
        if (px >= cx) pts.push([px, py]);
      }
      for (let a = 0; a < Math.PI*2; a += Math.PI/4)
        pts.push([cx+sz*0.3+Math.cos(a)*sz*0.1, cy+sz*0.08+Math.sin(a)*sz*0.1]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  cat: {
    label: 'Кошка',
    hint: '🐱 Дорисуй правое ушко кошки!',
    draw(ctx, cx, cy, sz) {
      const lw = sz * 0.045;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.fillStyle = '#fff9c4';
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.28, sz*0.35, sz*0.42, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.38, sz*0.32, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      for (const [sx, dir] of [[-1, 1], [1, -1]]) {
        ctx.fillStyle = '#fff9c4';
        ctx.beginPath(); ctx.moveTo(cx+sx*sz*0.14, cy-sz*0.66); ctx.lineTo(cx+sx*sz*0.36, cy-sz*0.98); ctx.lineTo(cx+sx*sz*0.01, cy-sz*0.68); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffcdd2';
        ctx.beginPath(); ctx.moveTo(cx+sx*sz*0.16, cy-sz*0.69); ctx.lineTo(cx+sx*sz*0.31, cy-sz*0.93); ctx.lineTo(cx+sx*sz*0.05, cy-sz*0.7); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = '#4caf50';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.12, cy-sz*0.42, sz*0.07, sz*0.09, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.12, cy-sz*0.42, sz*0.07, sz*0.09, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.12, cy-sz*0.42, sz*0.03, sz*0.07, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.12, cy-sz*0.42, sz*0.03, sz*0.07, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#f48fb1';
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.28, sz*0.04, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#aaa'; ctx.lineWidth = sz*0.025;
      for (const [wx, wy] of [[-0.32,-0.28],[-0.32,-0.22],[-0.32,-0.16],[0.32,-0.28],[0.32,-0.22],[0.32,-0.16]]) {
        const dir = wx < 0 ? -1 : 1;
        ctx.beginPath(); ctx.moveTo(cx+wx*sz, cy+wy*sz); ctx.lineTo(cx+wx*sz+dir*sz*0.2, cy+wy*sz); ctx.stroke();
      }
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      pts.push([cx+sz*0.14, cy-sz*0.66], [cx+sz*0.36, cy-sz*0.98], [cx+sz*0.01, cy-sz*0.68]);
      for (let a = -Math.PI/2; a <= Math.PI/2; a += Math.PI/10)
        pts.push([cx+Math.cos(a)*sz*0.32, cy-sz*0.38+Math.sin(a)*sz*0.32]);
      for (let a = 0; a < Math.PI*2; a += Math.PI/4) {
        const px = cx+sz*0.12+Math.cos(a)*sz*0.07, py = cy-sz*0.42+Math.sin(a)*sz*0.09;
        if (px >= cx) pts.push([px, py]);
      }
      for (let a = -Math.PI/2; a <= Math.PI/2; a += Math.PI/10)
        pts.push([cx+Math.cos(a)*sz*0.35, cy+sz*0.28+Math.sin(a)*sz*0.42]);
      pts.push([cx+sz*0.52, cy-sz*0.28], [cx+sz*0.52, cy-sz*0.22], [cx+sz*0.52, cy-sz*0.16]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  house: {
    label: 'Домик',
    hint: '🏠 Дорисуй правую половину домика!',
    draw(ctx, cx, cy, sz) {
      const lw = sz * 0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      ctx.fillStyle = '#fff9c4';
      ctx.beginPath(); ctx.rect(cx-sz*0.52, cy-sz*0.12, sz*1.04, sz*0.88); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ef9a9a';
      ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.82); ctx.lineTo(cx-sz*0.65, cy-sz*0.12); ctx.lineTo(cx+sz*0.65, cy-sz*0.12); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#8d6e63';
      ctx.beginPath(); ctx.rect(cx-sz*0.11, cy+sz*0.28, sz*0.22, sz*0.48); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#bbdefb';
      ctx.beginPath(); ctx.rect(cx-sz*0.42, cy+sz*0.04, sz*0.22, sz*0.22); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(cx+sz*0.2, cy+sz*0.04, sz*0.22, sz*0.22); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ef9a9a';
      ctx.beginPath(); ctx.rect(cx-sz*0.38, cy-sz*0.96, sz*0.14, sz*0.34); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(cx+sz*0.24, cy-sz*0.96, sz*0.14, sz*0.34); ctx.fill(); ctx.stroke();
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      for (let i = 0; i <= 8; i++) { const t = i/8; pts.push([cx+t*sz*0.65, cy-sz*0.82+t*sz*0.7]); }
      pts.push([cx+sz*0.65, cy-sz*0.12]);
      for (let i = 0; i <= 4; i++) pts.push([cx+sz*0.52, cy-sz*0.12+i*sz*0.22]);
      pts.push([cx+sz*0.52, cy+sz*0.76]);
      pts.push([cx+sz*0.2, cy+sz*0.04], [cx+sz*0.42, cy+sz*0.04], [cx+sz*0.42, cy+sz*0.26], [cx+sz*0.2, cy+sz*0.26]);
      pts.push([cx+sz*0.11, cy+sz*0.28], [cx+sz*0.11, cy+sz*0.76]);
      pts.push([cx+sz*0.24, cy-sz*0.96], [cx+sz*0.38, cy-sz*0.96], [cx+sz*0.38, cy-sz*0.62], [cx+sz*0.24, cy-sz*0.62]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  tree: {
    label: 'Ёлочка',
    hint: '🌲 Дорисуй правую половину ёлочки!',
    draw(ctx, cx, cy, sz) {
      const lw = sz * 0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      const tiers = [[cy-sz*1.0, sz*0.22, sz*0.3],[cy-sz*0.62, sz*0.4, sz*0.34],[cy-sz*0.18, sz*0.58, sz*0.36]];
      ctx.fillStyle = '#388e3c';
      for (const [ty, tw, th] of tiers) {
        ctx.beginPath(); ctx.moveTo(cx, ty-th); ctx.lineTo(cx-tw, ty); ctx.lineTo(cx+tw, ty); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = '#8d6e63';
      ctx.beginPath(); ctx.rect(cx-sz*0.1, cy+sz*0.18, sz*0.2, sz*0.28); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fdd835'; ctx.strokeStyle = '#222'; ctx.lineWidth = sz*0.03;
      drawStar5pt(ctx, cx, cy-sz*1.32, sz*0.14); ctx.fill(); ctx.stroke();
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      const tiers = [[cy-sz*1.0, sz*0.22, sz*0.3],[cy-sz*0.62, sz*0.4, sz*0.34],[cy-sz*0.18, sz*0.58, sz*0.36]];
      for (const [ty, tw, th] of tiers) {
        for (let i = 0; i <= 6; i++) { const t = i/6; pts.push([cx+t*tw, ty-th+t*th]); }
        pts.push([cx+tw, ty]);
      }
      pts.push([cx+sz*0.1, cy+sz*0.18], [cx+sz*0.1, cy+sz*0.46]);
      const sr = sz*0.14;
      for (let i = 0; i < 5; i++) {
        const a = (i*2*Math.PI/5)-Math.PI/2;
        const px = cx+Math.cos(a)*sr, py = cy-sz*1.32+Math.sin(a)*sr;
        if (px >= cx) pts.push([px, py]);
      }
      return pts.filter(([px]) => px >= cx);
    }
  },

  butterfly: {
    label: 'Бабочка',
    hint: '🦋 Дорисуй второе крылышко бабочки!',
    draw(ctx, cx, cy, sz) {
      const lw = sz * 0.045;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      ctx.fillStyle = '#ce93d8';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.44, cy-sz*0.28, sz*0.42, sz*0.3, -0.35, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.44, cy-sz*0.28, sz*0.42, sz*0.3, 0.35, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f48fb1';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.34, cy+sz*0.3, sz*0.3, sz*0.22, 0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.34, cy+sz*0.3, sz*0.3, sz*0.22, -0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff9c4';
      ctx.beginPath(); ctx.arc(cx-sz*0.44, cy-sz*0.28, sz*0.12, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.44, cy-sz*0.28, sz*0.12, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#5d4037';
      ctx.beginPath(); ctx.ellipse(cx, cy, sz*0.055, sz*0.52, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.52); ctx.quadraticCurveTo(cx-sz*0.18, cy-sz*0.8, cx-sz*0.24, cy-sz*0.92); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.52); ctx.quadraticCurveTo(cx+sz*0.18, cy-sz*0.8, cx+sz*0.24, cy-sz*0.92); ctx.stroke();
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.arc(cx-sz*0.24, cy-sz*0.92, sz*0.04, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.24, cy-sz*0.92, sz*0.04, 0, Math.PI*2); ctx.fill();
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      for (let a = 0; a < Math.PI*2; a += Math.PI/10) {
        const px = cx+sz*0.44+Math.cos(a+0.35)*sz*0.42, py = cy-sz*0.28+Math.sin(a+0.35)*sz*0.3;
        if (px >= cx) pts.push([px, py]);
      }
      for (let a = 0; a < Math.PI*2; a += Math.PI/8) {
        const px = cx+sz*0.34+Math.cos(a-0.4)*sz*0.3, py = cy+sz*0.3+Math.sin(a-0.4)*sz*0.22;
        if (px >= cx) pts.push([px, py]);
      }
      for (let a = 0; a < Math.PI*2; a += Math.PI/4) {
        const px = cx+sz*0.44+Math.cos(a)*sz*0.12, py = cy-sz*0.28+Math.sin(a)*sz*0.12;
        if (px >= cx) pts.push([px, py]);
      }
      pts.push([cx+sz*0.24, cy-sz*0.92]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  star: {
    label: 'Звёздочка',
    hint: '⭐ Дорисуй правую половину звёздочки!',
    draw(ctx, cx, cy, sz) {
      ctx.lineWidth = sz*0.05; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      ctx.fillStyle = '#fdd835';
      drawStar5pt(ctx, cx, cy, sz*0.82); ctx.fill(); ctx.stroke();
    },
    keyPoints(cx, cy, sz) {
      const r = sz*0.82, r2 = r*0.4, pts = [];
      for (let i = 0; i < 10; i++) {
        const a = (i*Math.PI/5)-Math.PI/2, rr = i%2===0 ? r : r2;
        const px = cx+Math.cos(a)*rr, py = cy+Math.sin(a)*rr;
        if (px >= cx-1) pts.push([px, py]);
      }
      return pts;
    }
  },

  heart: {
    label: 'Сердечко',
    hint: '❤️ Дорисуй правую половину сердечка!',
    draw(ctx, cx, cy, sz) {
      ctx.lineWidth = sz*0.05; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      ctx.fillStyle = '#ef9a9a';
      ctx.beginPath();
      ctx.moveTo(cx, cy+sz*0.65);
      ctx.bezierCurveTo(cx-sz*0.9, cy, cx-sz*0.9, cy-sz*0.7, cx, cy-sz*0.28);
      ctx.bezierCurveTo(cx+sz*0.9, cy-sz*0.7, cx+sz*0.9, cy, cx, cy+sz*0.65);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      for (let i = 0; i <= 24; i++) {
        const t = i/24, mt = 1-t;
        const px = mt**3*cx + 3*mt**2*t*(cx+sz*0.9) + 3*mt*t**2*(cx+sz*0.9) + t**3*cx;
        const py = mt**3*(cy-sz*0.28) + 3*mt**2*t*(cy-sz*0.7) + 3*mt*t**2*cy + t**3*(cy+sz*0.65);
        if (px >= cx) pts.push([px, py]);
      }
      return pts;
    }
  },

  spongebob: {
    label: 'СпанчБоб',
    hint: '🧽 Дорисуй правую половину СпанчБоба!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.045;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      // Тело (квадратная губка)
      ctx.fillStyle = '#fdd835';
      ctx.beginPath(); ctx.rect(cx-sz*0.42, cy-sz*0.32, sz*0.84, sz*0.82); ctx.fill(); ctx.stroke();
      // Дырки в губке
      ctx.fillStyle = '#f9a825';
      for (const [dx,dy,r] of [[-0.22,-0.18,0.08],[-0.05,0.02,0.07],[0.2,-0.08,0.07],[-0.18,0.2,0.06],[0.18,0.22,0.08],[0.02,0.32,0.06]]) {
        ctx.beginPath(); ctx.arc(cx+dx*sz, cy+dy*sz, r*sz, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Штаны (коричневые)
      ctx.fillStyle = '#6d4c41';
      ctx.beginPath(); ctx.rect(cx-sz*0.42, cy+sz*0.28, sz*0.84, sz*0.34); ctx.fill(); ctx.stroke();
      // Пояс
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.rect(cx-sz*0.42, cy+sz*0.26, sz*0.84, sz*0.06); ctx.fill();
      // Галстук (красный, по центру)
      ctx.fillStyle = '#e53935';
      ctx.beginPath(); ctx.moveTo(cx-sz*0.05, cy-sz*0.34); ctx.lineTo(cx+sz*0.05, cy-sz*0.34); ctx.lineTo(cx+sz*0.08, cy-sz*0.12); ctx.lineTo(cx, cy-sz*0.04); ctx.lineTo(cx-sz*0.08, cy-sz*0.12); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Ноги и туфли (симметричные)
      for (const ex of [-0.22, 0.22]) {
        ctx.fillStyle = '#fff9c4';
        ctx.beginPath(); ctx.rect(cx+ex*sz-sz*0.08, cy+sz*0.62, sz*0.16, sz*0.22); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*0.92, sz*0.17, sz*0.09, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Руки (симметричные)
      for (const ex of [-0.42, 0.42]) {
        ctx.fillStyle = '#fdd835';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy, sz*0.09, sz*0.22, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Глаза на стебельках (симметричные)
      for (const ex of [-0.18, 0.18]) {
        ctx.fillStyle = '#fdd835';
        ctx.beginPath(); ctx.rect(cx+ex*sz-sz*0.04, cy-sz*0.7, sz*0.08, sz*0.2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(cx+ex*sz, cy-sz*0.78, sz*0.16, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#1565c0';
        ctx.beginPath(); ctx.arc(cx+ex*sz, cy-sz*0.78, sz*0.1, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(cx+ex*sz+sz*0.04, cy-sz*0.8, sz*0.04, 0, Math.PI*2); ctx.fill();
      }
      // Зубы (центральные)
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.rect(cx-sz*0.14, cy-sz*0.34, sz*0.28, sz*0.14); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#ccc'; ctx.lineWidth = sz*0.02;
      ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.34); ctx.lineTo(cx, cy-sz*0.2); ctx.stroke();
      // Нос (центральный)
      ctx.fillStyle = '#fbc02d'; ctx.strokeStyle = '#222'; ctx.lineWidth = lw*0.7;
      ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.42); ctx.lineTo(cx-sz*0.06, cy-sz*0.28); ctx.lineTo(cx+sz*0.06, cy-sz*0.28); ctx.closePath(); ctx.fill(); ctx.stroke();
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      // Правая сторона тела
      for (let i=0; i<=8; i++) pts.push([cx+sz*0.42, cy-sz*0.32+i*sz*0.115]);
      // Правая рука
      for (let a=0; a<Math.PI*2; a+=Math.PI/4) { const px=cx+sz*0.42+Math.cos(a)*sz*0.09, py=cy+Math.sin(a)*sz*0.22; if(px>=cx) pts.push([px,py]); }
      // Правая нога
      pts.push([cx+sz*0.3, cy+sz*0.62], [cx+sz*0.3, cy+sz*0.84]);
      // Правый туфель
      for (let a=-Math.PI; a<=0; a+=Math.PI/4) pts.push([cx+sz*0.22+Math.cos(a)*sz*0.17, cy+sz*0.92+Math.sin(a)*sz*0.09]);
      // Правый глаз на стебельке
      pts.push([cx+sz*0.22, cy-sz*0.7], [cx+sz*0.22, cy-sz*0.62]);
      for (let a=0; a<Math.PI*2; a+=Math.PI/6) { const px=cx+sz*0.18+Math.cos(a)*sz*0.16, py=cy-sz*0.78+Math.sin(a)*sz*0.16; if(px>=cx) pts.push([px,py]); }
      // Правая половина штанов
      pts.push([cx+sz*0.42, cy+sz*0.28], [cx+sz*0.42, cy+sz*0.62]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  patrick: {
    label: 'Патрик',
    hint: '⭐ Дорисуй вторую половину Патрика!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.045;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      // Тело (звезда/капля, розовая)
      ctx.fillStyle = '#f48fb1';
      ctx.beginPath();
      ctx.moveTo(cx, cy-sz*0.9);
      ctx.bezierCurveTo(cx+sz*0.5, cy-sz*0.6, cx+sz*0.75, cy-sz*0.1, cx+sz*0.65, cy+sz*0.4);
      ctx.bezierCurveTo(cx+sz*0.4, cy+sz*0.85, cx-sz*0.4, cy+sz*0.85, cx-sz*0.65, cy+sz*0.4);
      ctx.bezierCurveTo(cx-sz*0.75, cy-sz*0.1, cx-sz*0.5, cy-sz*0.6, cx, cy-sz*0.9);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Шорты (зелёные с цветами)
      ctx.fillStyle = '#388e3c';
      ctx.beginPath();
      ctx.moveTo(cx-sz*0.6, cy+sz*0.3);
      ctx.bezierCurveTo(cx-sz*0.4, cy+sz*0.88, cx+sz*0.4, cy+sz*0.88, cx+sz*0.6, cy+sz*0.3);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Цветы на шортах (симметричные)
      for (const ex of [-0.25, 0.25]) {
        ctx.fillStyle = '#fdd835';
        ctx.beginPath(); ctx.arc(cx+ex*sz, cy+sz*0.58, sz*0.1, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#e65100';
        ctx.beginPath(); ctx.arc(cx+ex*sz, cy+sz*0.58, sz*0.05, 0, Math.PI*2); ctx.fill();
      }
      // Глаза (симметричные)
      for (const ex of [-0.2, 0.2]) {
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy-sz*0.2, sz*0.14, sz*0.12, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(cx+ex*sz+sz*0.04, cy-sz*0.2, sz*0.05, 0, Math.PI*2); ctx.fill();
      }
      // Рот (дуга)
      ctx.strokeStyle = '#222'; ctx.lineWidth = sz*0.04;
      ctx.beginPath(); ctx.arc(cx, cy+sz*0.02, sz*0.2, 0.2, Math.PI-0.2); ctx.stroke();
      // Брови (симметричные)
      ctx.lineWidth = sz*0.045;
      for (const ex of [-0.2, 0.2]) {
        ctx.beginPath(); ctx.moveTo(cx+ex*sz-sz*0.12, cy-sz*0.35); ctx.lineTo(cx+ex*sz+sz*0.12, cy-sz*0.32); ctx.stroke();
      }
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      // Правая сторона тела (безье)
      for (let t=0; t<=1; t+=0.05) {
        const mt=1-t;
        const px = mt**3*cx + 3*mt**2*t*(cx+sz*0.5) + 3*mt*t**2*(cx+sz*0.75) + t**3*(cx+sz*0.65);
        const py = mt**3*(cy-sz*0.9) + 3*mt**2*t*(cy-sz*0.6) + 3*mt*t**2*(cy-sz*0.1) + t**3*(cy+sz*0.4);
        if (px >= cx) pts.push([px, py]);
      }
      for (let t=0; t<=1; t+=0.05) {
        const mt=1-t;
        const px = mt**3*(cx+sz*0.65) + 3*mt**2*t*(cx+sz*0.4) + 3*mt*t**2*cx + t**3*cx;
        const py = mt**3*(cy+sz*0.4) + 3*mt**2*t*(cy+sz*0.85) + 3*mt*t**2*(cy+sz*0.85) + t**3*(cy+sz*0.85);
        if (px >= cx) pts.push([px, py]);
      }
      // Правый глаз
      for (let a=0; a<Math.PI*2; a+=Math.PI/4) { const px=cx+sz*0.2+Math.cos(a)*sz*0.14, py=cy-sz*0.2+Math.sin(a)*sz*0.12; if(px>=cx) pts.push([px,py]); }
      // Правый цветок
      pts.push([cx+sz*0.25, cy+sz*0.48], [cx+sz*0.35, cy+sz*0.58], [cx+sz*0.25, cy+sz*0.68]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  omnom: {
    label: 'Ам Ням',
    hint: '🟢 Дорисуй вторую половину Ам Няма!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      // Тело (круглое, зелёное)
      ctx.fillStyle = '#66bb6a';
      ctx.beginPath(); ctx.arc(cx, cy, sz*0.72, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Живот (светлее)
      ctx.fillStyle = '#a5d6a7';
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.1, sz*0.42, sz*0.48, 0, 0, Math.PI*2); ctx.fill();
      // Глаза (большие, жёлтые, симметричные)
      for (const ex of [-0.26, 0.26]) {
        ctx.fillStyle = '#fff9c4';
        ctx.beginPath(); ctx.arc(cx+ex*sz, cy-sz*0.22, sz*0.26, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.arc(cx+ex*sz+sz*0.06, cy-sz*0.24, sz*0.12, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(cx+ex*sz+sz*0.1, cy-sz*0.3, sz*0.05, 0, Math.PI*2); ctx.fill();
      }
      // Рот (широкий, с зубами)
      ctx.fillStyle = '#1b5e20';
      ctx.beginPath(); ctx.arc(cx, cy+sz*0.26, sz*0.44, 0.1, Math.PI-0.1); ctx.fill();
      ctx.fillStyle = '#fff';
      for (const [dx, w] of [[-0.22, 0.14], [-0.06, 0.12], [0.06, 0.12], [0.22, 0.14]]) {
        ctx.beginPath(); ctx.rect(cx+dx*sz-w/2*sz, cy+sz*0.12, w*sz, sz*0.16); ctx.fill(); ctx.stroke();
      }
      // Ушки/рожки (симметричные)
      for (const ex of [-0.42, 0.42]) {
        ctx.fillStyle = '#388e3c';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy-sz*0.62, sz*0.1, sz*0.18, ex>0?0.4:-0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Ручки (симметричные)
      for (const ex of [-0.72, 0.72]) {
        ctx.fillStyle = '#66bb6a';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*0.12, sz*0.13, sz*0.22, ex>0?0.4:-0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.72, cy+Math.sin(a)*sz*0.72]);
      for (let a=0; a<Math.PI*2; a+=Math.PI/6) { const px=cx+sz*0.26+Math.cos(a)*sz*0.26, py=cy-sz*0.22+Math.sin(a)*sz*0.26; if(px>=cx) pts.push([px,py]); }
      for (let a=0; a<Math.PI*2; a+=Math.PI/4) { const px=cx+sz*0.42+Math.cos(a+0.4)*sz*0.1, py=cy-sz*0.62+Math.sin(a+0.4)*sz*0.18; if(px>=cx) pts.push([px,py]); }
      for (let a=0; a<Math.PI*2; a+=Math.PI/4) { const px=cx+sz*0.72+Math.cos(a+0.4)*sz*0.13, py=cy+sz*0.12+Math.sin(a+0.4)*sz*0.22; if(px>=cx) pts.push([px,py]); }
      pts.push([cx+sz*0.22, cy+sz*0.12], [cx+sz*0.34, cy+sz*0.12], [cx+sz*0.34, cy+sz*0.28]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  blippi: {
    label: 'Блиппи',
    hint: '🧡 Дорисуй вторую половину Блиппи!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.045;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      // Тело (комбинезон синий)
      ctx.fillStyle = '#1565c0';
      ctx.beginPath(); ctx.rect(cx-sz*0.38, cy+sz*0.04, sz*0.76, sz*0.72); ctx.fill(); ctx.stroke();
      // Подтяжки (оранжевые, симметричные)
      ctx.fillStyle = '#ff8f00';
      for (const ex of [-0.18, 0.18]) {
        ctx.beginPath(); ctx.rect(cx+ex*sz-sz*0.04, cy-sz*0.3, sz*0.08, sz*0.36); ctx.fill(); ctx.stroke();
      }
      // Голова
      ctx.fillStyle = '#ffcc80';
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.38, sz*0.34, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Шапка (синяя основа + оранжевая полоска)
      ctx.fillStyle = '#1565c0';
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.62, sz*0.34, Math.PI, 0); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(cx-sz*0.36, cy-sz*0.62, sz*0.72, sz*0.09); ctx.fill();
      ctx.fillStyle = '#ff8f00';
      ctx.beginPath(); ctx.rect(cx-sz*0.36, cy-sz*0.64, sz*0.72, sz*0.09); ctx.fill(); ctx.stroke();
      // Козырёк шапки
      ctx.fillStyle = '#1565c0';
      ctx.beginPath(); ctx.ellipse(cx, cy-sz*0.62, sz*0.42, sz*0.1, 0, 0, Math.PI); ctx.fill(); ctx.stroke();
      // Глаза (симметричные, круглые)
      for (const ex of [-0.14, 0.14]) {
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(cx+ex*sz, cy-sz*0.4, sz*0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(cx+ex*sz+sz*0.03, cy-sz*0.42, sz*0.05, 0, Math.PI*2); ctx.fill();
      }
      // Нос (круглый, по центру)
      ctx.fillStyle = '#ff8a65';
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.32, sz*0.05, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Улыбка
      ctx.strokeStyle = '#222'; ctx.lineWidth = sz*0.04;
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.24, sz*0.16, 0.2, Math.PI-0.2); ctx.stroke();
      // Руки (симметричные)
      for (const ex of [-0.38, 0.38]) {
        ctx.fillStyle = '#ffcc80';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*0.28, sz*0.1, sz*0.24, ex>0?0.3:-0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Ноги (симметричные)
      for (const ex of [-0.2, 0.2]) {
        ctx.fillStyle = '#1565c0';
        ctx.beginPath(); ctx.rect(cx+ex*sz-sz*0.1, cy+sz*0.76, sz*0.2, sz*0.26); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ff8f00';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*1.08, sz*0.18, sz*0.09, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.34, cy-sz*0.38+Math.sin(a)*sz*0.34]);
      for (let a=0; a<=Math.PI; a+=Math.PI/8) pts.push([cx+Math.cos(a)*sz*0.42, cy-sz*0.62+Math.sin(a)*sz*0.1]);
      for (let a=0; a<Math.PI*2; a+=Math.PI/4) { const px=cx+sz*0.14+Math.cos(a)*sz*0.1, py=cy-sz*0.4+Math.sin(a)*sz*0.1; if(px>=cx) pts.push([px,py]); }
      pts.push([cx+sz*0.38, cy+sz*0.04], [cx+sz*0.38, cy+sz*0.76]);
      for (let a=0; a<Math.PI*2; a+=Math.PI/4) { const px=cx+sz*0.38+Math.cos(a-0.3)*sz*0.1, py=cy+sz*0.28+Math.sin(a-0.3)*sz*0.24; if(px>=cx) pts.push([px,py]); }
      pts.push([cx+sz*0.3, cy+sz*0.76], [cx+sz*0.3, cy+sz*1.02]);
      for (let a=-Math.PI; a<=0; a+=Math.PI/4) pts.push([cx+sz*0.2+Math.cos(a)*sz*0.18, cy+sz*1.08+Math.sin(a)*sz*0.09]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  booba: {
    label: 'Буба',
    hint: '💙 Дорисуй вторую половину Бубы!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      // Тело (синяя капля)
      ctx.fillStyle = '#42a5f5';
      ctx.beginPath();
      ctx.moveTo(cx, cy+sz*0.82);
      ctx.bezierCurveTo(cx-sz*0.62, cy+sz*0.82, cx-sz*0.72, cy+sz*0.1, cx-sz*0.66, cy-sz*0.18);
      ctx.bezierCurveTo(cx-sz*0.56, cy-sz*0.58, cx-sz*0.2, cy-sz*0.82, cx, cy-sz*0.82);
      ctx.bezierCurveTo(cx+sz*0.2, cy-sz*0.82, cx+sz*0.56, cy-sz*0.58, cx+sz*0.66, cy-sz*0.18);
      ctx.bezierCurveTo(cx+sz*0.72, cy+sz*0.1, cx+sz*0.62, cy+sz*0.82, cx, cy+sz*0.82);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Живот (светлее)
      ctx.fillStyle = '#90caf9';
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.2, sz*0.36, sz*0.48, 0, 0, Math.PI*2); ctx.fill();
      // Ушки (симметричные, маленькие круглые)
      for (const ex of [-0.48, 0.48]) {
        ctx.fillStyle = '#42a5f5';
        ctx.beginPath(); ctx.arc(cx+ex*sz, cy-sz*0.72, sz*0.14, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Глаза (большие, симметричные)
      for (const ex of [-0.22, 0.22]) {
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(cx+ex*sz, cy-sz*0.28, sz*0.22, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#1a237e';
        ctx.beginPath(); ctx.arc(cx+ex*sz+sz*0.05, cy-sz*0.3, sz*0.13, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(cx+ex*sz+sz*0.1, cy-sz*0.38, sz*0.05, 0, Math.PI*2); ctx.fill();
      }
      // Нос (маленький круглый, по центру)
      ctx.fillStyle = '#1e88e5';
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.12, sz*0.06, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Рот (улыбка)
      ctx.strokeStyle = '#222'; ctx.lineWidth = sz*0.04;
      ctx.beginPath(); ctx.arc(cx, cy, sz*0.18, 0.2, Math.PI-0.2); ctx.stroke();
      // Ножки (симметричные, маленькие)
      for (const ex of [-0.26, 0.26]) {
        ctx.fillStyle = '#42a5f5';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*0.92, sz*0.14, sz*0.16, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Ручки (симметричные)
      for (const ex of [-0.72, 0.72]) {
        ctx.fillStyle = '#42a5f5';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*0.08, sz*0.13, sz*0.22, ex>0?0.5:-0.5, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      for (let t=0; t<=1; t+=0.05) {
        const mt=1-t;
        const px = mt**3*cx + 3*mt**2*t*(cx+sz*0.2) + 3*mt*t**2*(cx+sz*0.56) + t**3*(cx+sz*0.66);
        const py = mt**3*(cy-sz*0.82) + 3*mt**2*t*(cy-sz*0.82) + 3*mt*t**2*(cy-sz*0.58) + t**3*(cy-sz*0.18);
        if(px>=cx) pts.push([px,py]);
      }
      for (let t=0; t<=1; t+=0.05) {
        const mt=1-t;
        const px = mt**3*(cx+sz*0.66) + 3*mt**2*t*(cx+sz*0.72) + 3*mt*t**2*(cx+sz*0.62) + t**3*cx;
        const py = mt**3*(cy-sz*0.18) + 3*mt**2*t*(cy+sz*0.1) + 3*mt*t**2*(cy+sz*0.82) + t**3*(cy+sz*0.82);
        if(px>=cx) pts.push([px,py]);
      }
      for (let a=0; a<Math.PI*2; a+=Math.PI/4) { const px=cx+sz*0.48+Math.cos(a)*sz*0.14, py=cy-sz*0.72+Math.sin(a)*sz*0.14; if(px>=cx) pts.push([px,py]); }
      for (let a=0; a<Math.PI*2; a+=Math.PI/6) { const px=cx+sz*0.22+Math.cos(a)*sz*0.22, py=cy-sz*0.28+Math.sin(a)*sz*0.22; if(px>=cx) pts.push([px,py]); }
      for (let a=0; a<Math.PI*2; a+=Math.PI/4) { const px=cx+sz*0.72+Math.cos(a+0.5)*sz*0.13, py=cy+sz*0.08+Math.sin(a+0.5)*sz*0.22; if(px>=cx) pts.push([px,py]); }
      for (let a=-Math.PI; a<=0; a+=Math.PI/4) pts.push([cx+sz*0.26+Math.cos(a)*sz*0.14, cy+sz*0.92+Math.sin(a)*sz*0.16]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  minion: {
    label: 'Миньон',
    hint: '💛 Дорисуй вторую половину Миньона!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      ctx.fillStyle = '#fdd835';
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.08, sz*0.44, sz*0.68, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Комбинезон
      ctx.fillStyle = '#1565c0';
      ctx.beginPath(); ctx.rect(cx-sz*0.44, cy+sz*0.2, sz*0.88, sz*0.56); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.76, sz*0.44, sz*0.12, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(cx-sz*0.44, cy+sz*0.2, sz*0.88, sz*0.56); ctx.fill(); ctx.stroke();
      // Лямки (симметричные)
      for (const ex of [-0.17, 0.17]) {
        ctx.fillStyle = '#1565c0';
        ctx.beginPath(); ctx.rect(cx+ex*sz-sz*0.055, cy-sz*0.18, sz*0.11, sz*0.4); ctx.fill(); ctx.stroke();
      }
      // Карман по центру
      ctx.fillStyle = '#1976d2';
      ctx.beginPath(); ctx.rect(cx-sz*0.11, cy+sz*0.32, sz*0.22, sz*0.16); ctx.fill(); ctx.stroke();
      // Полоска очков
      ctx.fillStyle = '#9e9e9e';
      ctx.beginPath(); ctx.rect(cx-sz*0.46, cy-sz*0.5, sz*0.92, sz*0.2); ctx.fill(); ctx.stroke();
      // Очки (симметричные)
      for (const ex of [-0.2, 0.2]) {
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(cx+ex*sz, cy-sz*0.38, sz*0.19, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#6d4c41';
        ctx.beginPath(); ctx.arc(cx+ex*sz, cy-sz*0.38, sz*0.12, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(cx+ex*sz+sz*0.04, cy-sz*0.42, sz*0.055, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(cx+ex*sz+sz*0.08, cy-sz*0.46, sz*0.028, 0, Math.PI*2); ctx.fill();
      }
      // Рот
      ctx.strokeStyle = '#222'; ctx.lineWidth = sz*0.04;
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.13, sz*0.14, 0.25, Math.PI-0.25); ctx.stroke();
      // Волосы (3 штуки)
      ctx.strokeStyle = '#333'; ctx.lineWidth = sz*0.045; ctx.lineCap = 'round';
      for (const ex of [-0.12, 0, 0.12]) ctx.beginPath(), ctx.moveTo(cx+ex*sz, cy-sz*0.72), ctx.quadraticCurveTo(cx+ex*sz*1.2, cy-sz*0.95, cx+ex*sz*1.4, cy-sz*1.04), ctx.stroke();
      // Ботинки
      for (const ex of [-0.22, 0.22]) {
        ctx.fillStyle = '#1565c0'; ctx.strokeStyle = '#222'; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*0.88, sz*0.17, sz*0.1, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.44, cy+sz*0.08+Math.sin(a)*sz*0.68]);
      for (let a=0; a<Math.PI*2; a+=Math.PI/6) { const px=cx+sz*0.2+Math.cos(a)*sz*0.19, py=cy-sz*0.38+Math.sin(a)*sz*0.19; if(px>=cx) pts.push([px,py]); }
      pts.push([cx+sz*0.46, cy-sz*0.5],[cx+sz*0.46, cy-sz*0.3]);
      pts.push([cx+sz*0.44, cy+sz*0.2],[cx+sz*0.44, cy+sz*0.76]);
      for (let a=-Math.PI; a<=0; a+=Math.PI/4) pts.push([cx+sz*0.22+Math.cos(a)*sz*0.17, cy+sz*0.88+Math.sin(a)*sz*0.1]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  pikachu: {
    label: 'Пикачу',
    hint: '⚡ Дорисуй второе ушко Пикачу!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      // Уши (чёрные кончики)
      for (const ex of [-0.28, 0.28]) {
        ctx.fillStyle = '#fdd835';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy-sz*0.78, sz*0.12, sz*0.3, ex>0?0.25:-0.25, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy-sz*0.98, sz*0.08, sz*0.14, ex>0?0.25:-0.25, 0, Math.PI*2); ctx.fill();
      }
      // Голова
      ctx.fillStyle = '#fdd835';
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.38, sz*0.38, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Тело
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.26, sz*0.38, sz*0.44, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Коричневые полоски на спине (симметричные)
      ctx.strokeStyle = '#795548'; ctx.lineWidth = sz*0.06;
      for (const ex of [-0.18, 0.18]) {
        ctx.beginPath(); ctx.moveTo(cx+ex*sz, cy+sz*0.06); ctx.lineTo(cx+ex*sz, cy+sz*0.42); ctx.stroke();
      }
      // Красные щёчки (симметричные)
      ctx.fillStyle = '#e53935';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.28, cy-sz*0.3, sz*0.12, sz*0.09, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.28, cy-sz*0.3, sz*0.12, sz*0.09, 0, 0, Math.PI*2); ctx.fill();
      // Глаза
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(cx-sz*0.14, cy-sz*0.44, sz*0.07, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.14, cy-sz*0.44, sz*0.07, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx-sz*0.11, cy-sz*0.48, sz*0.03, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.11, cy-sz*0.48, sz*0.03, 0, Math.PI*2); ctx.fill();
      // Нос
      ctx.fillStyle = '#333'; ctx.strokeStyle = '#222'; ctx.lineWidth = lw*0.6;
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.35, sz*0.04, 0, Math.PI*2); ctx.fill();
      // Улыбка
      ctx.strokeStyle = '#222'; ctx.lineWidth = sz*0.04;
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.25, sz*0.16, 0.2, Math.PI-0.2); ctx.stroke();
      // Ручки
      for (const ex of [-0.38, 0.38]) {
        ctx.fillStyle = '#fdd835'; ctx.strokeStyle = '#222'; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*0.18, sz*0.1, sz*0.22, ex>0?0.4:-0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Ножки
      for (const ex of [-0.2, 0.2]) {
        ctx.fillStyle = '#fdd835';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*0.78, sz*0.16, sz*0.12, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      for (let a=0; a<Math.PI*2; a+=Math.PI/8) { const px=cx+sz*0.28+Math.cos(a+0.25)*sz*0.12, py=cy-sz*0.78+Math.sin(a+0.25)*sz*0.3; if(px>=cx) pts.push([px,py]); }
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.38, cy-sz*0.38+Math.sin(a)*sz*0.38]);
      pts.push([cx+sz*0.28, cy-sz*0.3]);
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.38, cy+sz*0.26+Math.sin(a)*sz*0.44]);
      for (let a=0; a<Math.PI*2; a+=Math.PI/4) { const px=cx+sz*0.38+Math.cos(a+0.4)*sz*0.1, py=cy+sz*0.18+Math.sin(a+0.4)*sz*0.22; if(px>=cx) pts.push([px,py]); }
      for (let a=-Math.PI; a<=0; a+=Math.PI/4) pts.push([cx+sz*0.2+Math.cos(a)*sz*0.16, cy+sz*0.78+Math.sin(a)*sz*0.12]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  alien: {
    label: 'Пришелец',
    hint: '👽 Дорисуй вторую половину пришельца!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      // Антенны
      ctx.strokeStyle = '#222'; ctx.lineWidth = sz*0.04; ctx.lineCap = 'round';
      for (const ex of [-0.22, 0.22]) {
        ctx.beginPath(); ctx.moveTo(cx+ex*sz, cy-sz*0.72); ctx.quadraticCurveTo(cx+ex*sz*1.8, cy-sz*1.0, cx+ex*sz*2.0, cy-sz*1.14); ctx.stroke();
        ctx.fillStyle = '#a5d6a7'; ctx.strokeStyle = '#222'; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.arc(cx+ex*sz*2.0, cy-sz*1.14, sz*0.08, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Голова (большой яйцевидный купол)
      ctx.fillStyle = '#a5d6a7';
      ctx.beginPath(); ctx.ellipse(cx, cy-sz*0.3, sz*0.5, sz*0.58, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Тело (маленькое)
      ctx.fillStyle = '#c8e6c9';
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.42, sz*0.28, sz*0.32, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Глаза (огромные, миндалевидные, симметричные)
      for (const ex of [-0.2, 0.2]) {
        ctx.fillStyle = '#111';
        ctx.save(); ctx.translate(cx+ex*sz, cy-sz*0.28); ctx.rotate(ex>0?-0.35:0.35);
        ctx.beginPath(); ctx.ellipse(0, 0, sz*0.2, sz*0.14, 0, 0, Math.PI*2); ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#1a237e';
        ctx.save(); ctx.translate(cx+ex*sz+ex*sz*0.02, cy-sz*0.3); ctx.rotate(ex>0?-0.35:0.35);
        ctx.beginPath(); ctx.ellipse(0, 0, sz*0.14, sz*0.1, 0, 0, Math.PI*2); ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(cx+ex*sz+ex*sz*0.06, cy-sz*0.36, sz*0.05, 0, Math.PI*2); ctx.fill();
      }
      // Рот (тонкая линия)
      ctx.strokeStyle = '#555'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.08, sz*0.12, 0.4, Math.PI-0.4); ctx.stroke();
      // Ноздри
      ctx.fillStyle = '#7cb87e';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.06, cy-sz*0.14, sz*0.03, sz*0.04, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.06, cy-sz*0.14, sz*0.03, sz*0.04, 0, 0, Math.PI*2); ctx.fill();
      // Длинные тонкие ручки
      for (const ex of [-0.28, 0.28]) {
        ctx.fillStyle = '#a5d6a7'; ctx.strokeStyle = '#222'; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*0.38, sz*0.08, sz*0.28, ex>0?0.5:-0.5, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx+ex*sz+(ex>0?sz*0.1:-sz*0.1), cy+sz*0.62, sz*0.12, sz*0.06, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Ножки
      for (const ex of [-0.12, 0.12]) {
        ctx.fillStyle = '#a5d6a7';
        ctx.beginPath(); ctx.rect(cx+ex*sz-sz*0.06, cy+sz*0.74, sz*0.12, sz*0.22); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*0.96, sz*0.1, sz*0.07, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      pts.push([cx+sz*0.22*2.0, cy-sz*1.14]);
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.5, cy-sz*0.3+Math.sin(a)*sz*0.58]);
      pts.push([cx+sz*0.2+sz*0.06, cy-sz*0.36]);
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.28, cy+sz*0.42+Math.sin(a)*sz*0.32]);
      for (let a=0; a<Math.PI*2; a+=Math.PI/4) { const px=cx+sz*0.28+Math.cos(a+0.5)*sz*0.08, py=cy+sz*0.38+Math.sin(a+0.5)*sz*0.28; if(px>=cx) pts.push([px,py]); }
      pts.push([cx+sz*0.12, cy+sz*0.74],[cx+sz*0.12, cy+sz*0.96],[cx+sz*0.22, cy+sz*0.96]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  robot: {
    label: 'Робот',
    hint: '🤖 Дорисуй вторую половину робота!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      // Антенна
      ctx.fillStyle = '#90a4ae';
      ctx.beginPath(); ctx.rect(cx-sz*0.04, cy-sz*1.06, sz*0.08, sz*0.22); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ef5350';
      ctx.beginPath(); ctx.arc(cx, cy-sz*1.1, sz*0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Голова (квадратная)
      ctx.fillStyle = '#90a4ae';
      ctx.beginPath(); ctx.rect(cx-sz*0.42, cy-sz*0.84, sz*0.84, sz*0.66); ctx.fill(); ctx.stroke();
      // Глаза (квадратные светящиеся, симметричные)
      for (const ex of [-0.2, 0.2]) {
        ctx.fillStyle = '#29b6f6';
        ctx.beginPath(); ctx.rect(cx+ex*sz-sz*0.1, cy-sz*0.72, sz*0.2, sz*0.18); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(cx+ex*sz+sz*0.06, cy-sz*0.67, sz*0.04, 0, Math.PI*2); ctx.fill();
      }
      // Рот (прямоугольный, с зубами)
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.rect(cx-sz*0.22, cy-sz*0.36, sz*0.44, sz*0.14); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#29b6f6';
      for (let i=0; i<4; i++) ctx.beginPath(), ctx.rect(cx-sz*0.2+i*sz*0.12, cy-sz*0.36, sz*0.09, sz*0.14), ctx.fill();
      // Уши/динамики (симметричные)
      for (const ex of [-0.42, 0.42]) {
        ctx.fillStyle = '#607d8b';
        ctx.beginPath(); ctx.rect(cx+ex*sz-(ex>0?0:sz*0.12), cy-sz*0.64, sz*0.12, sz*0.28); ctx.fill(); ctx.stroke();
      }
      // Тело (прямоугольное)
      ctx.fillStyle = '#78909c';
      ctx.beginPath(); ctx.rect(cx-sz*0.38, cy-sz*0.18, sz*0.76, sz*0.72); ctx.fill(); ctx.stroke();
      // Кнопки на теле (симметричные)
      for (const [dx,dy,col] of [[-0.2,-0.04,'#ef5350'],[-0.2,0.12,'#66bb6a'],[0.2,-0.04,'#ef5350'],[0.2,0.12,'#66bb6a']]) {
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(cx+dx*sz, cy+dy*sz, sz*0.06, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Полоска по центру
      ctx.fillStyle = '#546e7a';
      ctx.beginPath(); ctx.rect(cx-sz*0.04, cy-sz*0.18, sz*0.08, sz*0.72); ctx.fill();
      // Руки (прямоугольные, симметричные)
      for (const ex of [-0.38, 0.38]) {
        ctx.fillStyle = '#90a4ae';
        ctx.beginPath(); ctx.rect(cx+ex*sz-(ex>0?0:sz*0.16), cy-sz*0.14, sz*0.16, sz*0.48); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.rect(cx+ex*sz-(ex>0?0:sz*0.2), cy+sz*0.34, sz*0.2, sz*0.14); ctx.fill(); ctx.stroke();
      }
      // Ноги
      for (const ex of [-0.2, 0.2]) {
        ctx.fillStyle = '#607d8b';
        ctx.beginPath(); ctx.rect(cx+ex*sz-sz*0.1, cy+sz*0.54, sz*0.2, sz*0.36); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.rect(cx+ex*sz-sz*0.14, cy+sz*0.9, sz*0.28, sz*0.12); ctx.fill(); ctx.stroke();
      }
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      pts.push([cx, cy-sz*1.1],[cx, cy-sz*0.84]);
      pts.push([cx+sz*0.42, cy-sz*0.84],[cx+sz*0.42, cy-sz*0.18]);
      for (let a=0; a<Math.PI*2; a+=Math.PI/4) { const px=cx+sz*0.2+Math.cos(a)*sz*0.1, py=cy-sz*0.63+Math.sin(a)*sz*0.09; if(px>=cx) pts.push([px,py]); }
      pts.push([cx+sz*0.54, cy-sz*0.64],[cx+sz*0.54, cy-sz*0.36]);
      pts.push([cx+sz*0.38, cy-sz*0.18],[cx+sz*0.38, cy+sz*0.54]);
      pts.push([cx+sz*0.54, cy-sz*0.14],[cx+sz*0.54, cy+sz*0.48]);
      pts.push([cx+sz*0.3, cy+sz*0.54],[cx+sz*0.3, cy+sz*0.9],[cx+sz*0.34, cy+sz*1.02]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  snowman: {
    label: 'Снеговик',
    hint: '⛄ Дорисуй вторую половину снеговика!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      // Нижний шар
      ctx.fillStyle = '#e3f2fd';
      ctx.beginPath(); ctx.arc(cx, cy+sz*0.54, sz*0.42, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Средний шар
      ctx.fillStyle = '#e3f2fd';
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.04, sz*0.32, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Голова
      ctx.fillStyle = '#e3f2fd';
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.56, sz*0.24, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Шапка
      ctx.fillStyle = '#222';
      ctx.beginPath(); ctx.rect(cx-sz*0.28, cy-sz*0.82, sz*0.56, sz*0.08); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(cx-sz*0.18, cy-sz*1.08, sz*0.36, sz*0.28); ctx.fill(); ctx.stroke();
      // Шарф (оранжевый)
      ctx.fillStyle = '#ff7043';
      ctx.beginPath(); ctx.ellipse(cx, cy-sz*0.3, sz*0.33, sz*0.08, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Глаза (симметричные)
      ctx.fillStyle = '#222';
      ctx.beginPath(); ctx.arc(cx-sz*0.1, cy-sz*0.62, sz*0.05, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.1, cy-sz*0.62, sz*0.05, 0, Math.PI*2); ctx.fill();
      // Нос (морковка, по центру)
      ctx.fillStyle = '#ff7043';
      ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.56); ctx.lineTo(cx-sz*0.04, cy-sz*0.5); ctx.lineTo(cx+sz*0.04, cy-sz*0.5); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Пуговицы (по центру)
      ctx.fillStyle = '#222';
      for (const dy of [-0.06, 0.08, 0.22]) { ctx.beginPath(); ctx.arc(cx, cy+dy*sz, sz*0.04, 0, Math.PI*2); ctx.fill(); }
      // Ветки-руки (симметричные)
      ctx.strokeStyle = '#5d4037'; ctx.lineWidth = sz*0.06; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx-sz*0.32, cy-sz*0.06); ctx.lineTo(cx-sz*0.68, cy-sz*0.24); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+sz*0.32, cy-sz*0.06); ctx.lineTo(cx+sz*0.68, cy-sz*0.24); ctx.stroke();
      // Пальцы веток
      ctx.lineWidth = sz*0.04;
      ctx.beginPath(); ctx.moveTo(cx+sz*0.56, cy-sz*0.18); ctx.lineTo(cx+sz*0.68, cy-sz*0.1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+sz*0.56, cy-sz*0.18); ctx.lineTo(cx+sz*0.7, cy-sz*0.28); ctx.stroke();
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.42, cy+sz*0.54+Math.sin(a)*sz*0.42]);
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.32, cy-sz*0.04+Math.sin(a)*sz*0.32]);
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.24, cy-sz*0.56+Math.sin(a)*sz*0.24]);
      pts.push([cx+sz*0.28, cy-sz*0.82],[cx+sz*0.18, cy-sz*1.08],[cx+sz*0.18, cy-sz*0.8]);
      pts.push([cx+sz*0.68, cy-sz*0.24],[cx+sz*0.68, cy-sz*0.1],[cx+sz*0.7, cy-sz*0.28]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  sun: {
    label: 'Солнышко',
    hint: '☀️ Дорисуй правые лучики солнышка!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      // Лучи (симметричные)
      ctx.strokeStyle = '#f9a825'; ctx.lineWidth = sz*0.08; ctx.lineCap = 'round';
      const rays = 8;
      for (let i=0; i<rays; i++) {
        const a = (i/rays)*Math.PI*2;
        ctx.beginPath();
        ctx.moveTo(cx+Math.cos(a)*sz*0.46, cy+Math.sin(a)*sz*0.46);
        ctx.lineTo(cx+Math.cos(a)*sz*0.78, cy+Math.sin(a)*sz*0.78);
        ctx.stroke();
      }
      // Основной круг
      ctx.fillStyle = '#fdd835'; ctx.strokeStyle = '#222'; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.arc(cx, cy, sz*0.44, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Глаза
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.arc(cx-sz*0.14, cy-sz*0.1, sz*0.07, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.14, cy-sz*0.1, sz*0.07, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx-sz*0.11, cy-sz*0.14, sz*0.03, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.11, cy-sz*0.14, sz*0.03, 0, Math.PI*2); ctx.fill();
      // Улыбка
      ctx.strokeStyle = '#e65100'; ctx.lineWidth = sz*0.05;
      ctx.beginPath(); ctx.arc(cx, cy+sz*0.08, sz*0.2, 0.2, Math.PI-0.2); ctx.stroke();
      // Румянец
      ctx.fillStyle = 'rgba(255,152,0,0.4)';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.28, cy+sz*0.05, sz*0.1, sz*0.07, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.28, cy+sz*0.05, sz*0.1, sz*0.07, 0, 0, Math.PI*2); ctx.fill();
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      const rays = 8;
      for (let i=0; i<rays; i++) {
        const a = (i/rays)*Math.PI*2;
        const px = cx+Math.cos(a)*sz*0.78;
        if (px >= cx) pts.push([px, cy+Math.sin(a)*sz*0.78]);
      }
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.44, cy+Math.sin(a)*sz*0.44]);
      pts.push([cx+sz*0.14, cy-sz*0.1]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  octopus: {
    label: 'Осьминог',
    hint: '🐙 Дорисуй правые щупальца осьминога!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      // Щупальца (4 пары, симметричные)
      const tentacles = [[-0.62, 0.2, -0.88, 0.72], [-0.38, 0.4, -0.52, 0.9], [-0.16, 0.42, -0.18, 0.92], [0.16, 0.42, 0.18, 0.92], [0.38, 0.4, 0.52, 0.9], [0.62, 0.2, 0.88, 0.72]];
      ctx.strokeStyle = '#f48fb1'; ctx.lineWidth = sz*0.1;
      for (const [sx1, sy1, sx2, sy2] of tentacles) {
        ctx.beginPath(); ctx.moveTo(cx+sx1*sz, cy+sy1*sz); ctx.quadraticCurveTo(cx+sx1*sz*1.2, cy+(sy1+sy2)/2*sz*1.1, cx+sx2*sz, cy+sy2*sz); ctx.stroke();
      }
      // Присоски на кончиках
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#f48fb1'; ctx.lineWidth = sz*0.04;
      for (const [,, sx2, sy2] of tentacles) { ctx.beginPath(); ctx.arc(cx+sx2*sz, cy+sy2*sz, sz*0.06, 0, Math.PI*2); ctx.fill(); ctx.stroke(); }
      // Голова/тело (купол)
      ctx.fillStyle = '#f06292'; ctx.strokeStyle = '#222'; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.ellipse(cx, cy-sz*0.04, sz*0.56, sz*0.62, 0, Math.PI, 0); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.2, sz*0.56, sz*0.28, 0, 0, Math.PI); ctx.fill(); ctx.stroke();
      // Пятнышко на теле
      ctx.fillStyle = '#f8bbd0';
      ctx.beginPath(); ctx.ellipse(cx, cy-sz*0.1, sz*0.3, sz*0.36, 0, 0, Math.PI*2); ctx.fill();
      // Глаза (большие, симметричные)
      for (const ex of [-0.22, 0.22]) {
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#222'; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.arc(cx+ex*sz, cy-sz*0.2, sz*0.18, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.arc(cx+ex*sz+sz*0.04, cy-sz*0.22, sz*0.09, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(cx+ex*sz+sz*0.08, cy-sz*0.27, sz*0.04, 0, Math.PI*2); ctx.fill();
      }
      // Улыбка
      ctx.strokeStyle = '#ad1457'; ctx.lineWidth = sz*0.04;
      ctx.beginPath(); ctx.arc(cx, cy+sz*0.06, sz*0.16, 0.3, Math.PI-0.3); ctx.stroke();
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      const rightTentacles = [[0.16, 0.42, 0.18, 0.92], [0.38, 0.4, 0.52, 0.9], [0.62, 0.2, 0.88, 0.72]];
      for (const [sx1,sy1,sx2,sy2] of rightTentacles) {
        pts.push([cx+sx1*sz, cy+sy1*sz],[cx+sx2*sz, cy+sy2*sz]);
        for (let t=0.25; t<1; t+=0.25) { pts.push([cx+(sx1+t*(sx2*1.2-sx1))*sz, cy+(sy1+t*((sy1+sy2)/2*1.1-sy1))*sz]); }
      }
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.56, cy-sz*0.04+Math.sin(a)*sz*0.62]);
      for (let a=0; a<Math.PI*2; a+=Math.PI/6) { const px=cx+sz*0.22+Math.cos(a)*sz*0.18, py=cy-sz*0.2+Math.sin(a)*sz*0.18; if(px>=cx) pts.push([px,py]); }
      return pts.filter(([px]) => px >= cx);
    }
  },

  turtle: {
    label: 'Черепаха',
    hint: '🐢 Дорисуй правую половину черепахи!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      // Лапки (4 штуки, симметричные)
      for (const [ex, ey, ang] of [[-0.5, -0.22, -0.5], [0.5, -0.22, 0.5], [-0.42, 0.38, 0.5], [0.42, 0.38, -0.5]]) {
        ctx.fillStyle = '#66bb6a';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+ey*sz, sz*0.18, sz*0.12, ang, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Хвост
      ctx.fillStyle = '#66bb6a';
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.5, sz*0.08, sz*0.14, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Панцирь (большой овал)
      ctx.fillStyle = '#388e3c';
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.04, sz*0.52, sz*0.46, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Узор панциря (гексагональный, симметричный)
      ctx.strokeStyle = '#1b5e20'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.arc(cx, cy, sz*0.22, 0, Math.PI*2); ctx.stroke();
      for (let a=0; a<Math.PI*2; a+=Math.PI/3) {
        ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*sz*0.22, cy+Math.sin(a)*sz*0.22);
        ctx.lineTo(cx+Math.cos(a)*sz*0.48, cy+Math.sin(a)*sz*0.44); ctx.stroke();
      }
      // Голова
      ctx.fillStyle = '#66bb6a'; ctx.strokeStyle = '#222'; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.52, sz*0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Шея
      ctx.fillStyle = '#66bb6a';
      ctx.beginPath(); ctx.rect(cx-sz*0.1, cy-sz*0.52, sz*0.2, sz*0.16); ctx.fill();
      // Глаза
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(cx-sz*0.09, cy-sz*0.58, sz*0.05, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.09, cy-sz*0.58, sz*0.05, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx-sz*0.07, cy-sz*0.61, sz*0.02, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.07, cy-sz*0.61, sz*0.02, 0, Math.PI*2); ctx.fill();
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.52, cy+sz*0.04+Math.sin(a)*sz*0.46]);
      for (const [ex,ey,ang] of [[0.5,-0.22,-0.5],[0.42,0.38,0.5]]) {
        for (let a=0; a<Math.PI*2; a+=Math.PI/4) { const px=cx+ex*sz+Math.cos(a+ang)*sz*0.18, py=cy+ey*sz+Math.sin(a+ang)*sz*0.12; if(px>=cx) pts.push([px,py]); }
      }
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/6) pts.push([cx+Math.cos(a)*sz*0.2, cy-sz*0.52+Math.sin(a)*sz*0.2]);
      pts.push([cx+sz*0.09, cy-sz*0.58]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  hedgehog: {
    label: 'Ёжик',
    hint: '🦔 Дорисуй правую половину ёжика!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      // Иголки (симметричные веером)
      ctx.strokeStyle = '#5d4037'; ctx.lineWidth = sz*0.04;
      const spineBase = [[0,-0.82],[0.22,-0.76],[0.4,-0.62],[0.52,-0.44],[0.58,-0.22],[0.56,0.0],[0.5,0.2]];
      for (const [sdx, sdy] of spineBase) {
        const baseX = cx+sdx*sz, baseY = cy+sdy*sz;
        const ang = Math.atan2(sdy, sdx+0.01);
        ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.lineTo(baseX+Math.cos(ang)*sz*0.22, baseY+Math.sin(ang)*sz*0.22); ctx.stroke();
        if (sdx > 0) { ctx.beginPath(); ctx.moveTo(cx-sdx*sz, baseY); ctx.lineTo(cx-sdx*sz-Math.cos(ang)*sz*0.22, baseY+Math.sin(ang)*sz*0.22); ctx.stroke(); }
      }
      // Тело (коричневый полукруг + голова)
      ctx.fillStyle = '#8d6e63'; ctx.strokeStyle = '#222'; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.ellipse(cx+sz*0.06, cy+sz*0.08, sz*0.54, sz*0.5, 0.15, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Живот (светлый)
      ctx.fillStyle = '#d7ccc8';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.04, cy+sz*0.14, sz*0.26, sz*0.34, -0.1, 0, Math.PI*2); ctx.fill();
      // Голова
      ctx.fillStyle = '#8d6e63';
      ctx.beginPath(); ctx.arc(cx-sz*0.32, cy-sz*0.28, sz*0.28, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Нос (чёрный)
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(cx-sz*0.54, cy-sz*0.26, sz*0.07, 0, Math.PI*2); ctx.fill();
      // Глаз (один, на левой стороне)
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(cx-sz*0.38, cy-sz*0.38, sz*0.06, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx-sz*0.35, cy-sz*0.41, sz*0.025, 0, Math.PI*2); ctx.fill();
      // Ушко (одно, на голове слева)
      ctx.fillStyle = '#8d6e63';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.22, cy-sz*0.54, sz*0.08, sz*0.14, -0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffcdd2';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.22, cy-sz*0.54, sz*0.04, sz*0.09, -0.4, 0, Math.PI*2); ctx.fill();
      // Ножки
      for (const ex of [-0.18, 0.18]) {
        ctx.fillStyle = '#6d4c41';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*0.54, sz*0.12, sz*0.09, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      const spineBase = [[0.22,-0.76],[0.4,-0.62],[0.52,-0.44],[0.58,-0.22],[0.56,0.0],[0.5,0.2]];
      for (const [sdx, sdy] of spineBase) {
        const ang = Math.atan2(sdy, sdx);
        pts.push([cx+sdx*sz+Math.cos(ang)*sz*0.22, cy+sdy*sz+Math.sin(ang)*sz*0.22]);
        pts.push([cx+sdx*sz, cy+sdy*sz]);
      }
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/8) pts.push([cx+sz*0.06+Math.cos(a)*sz*0.54, cy+sz*0.08+Math.sin(a+0.15)*sz*0.5]);
      for (let a=-Math.PI; a<=0; a+=Math.PI/4) pts.push([cx+sz*0.18+Math.cos(a)*sz*0.12, cy+sz*0.54+Math.sin(a)*sz*0.09]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  penguin: {
    label: 'Пингвин',
    hint: '🐧 Дорисуй вторую половину пингвина!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      // Тело (чёрное, овальное)
      ctx.fillStyle = '#212121';
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.18, sz*0.44, sz*0.62, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Белый живот
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.24, sz*0.26, sz*0.46, 0, 0, Math.PI*2); ctx.fill();
      // Голова (чёрная)
      ctx.fillStyle = '#212121';
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.46, sz*0.32, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Белые пятна вокруг глаз
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.14, cy-sz*0.52, sz*0.13, sz*0.11, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.14, cy-sz*0.52, sz*0.13, sz*0.11, 0, 0, Math.PI*2); ctx.fill();
      // Глаза
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(cx-sz*0.14, cy-sz*0.54, sz*0.07, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.14, cy-sz*0.54, sz*0.07, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx-sz*0.11, cy-sz*0.58, sz*0.03, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.11, cy-sz*0.58, sz*0.03, 0, Math.PI*2); ctx.fill();
      // Клюв
      ctx.fillStyle = '#ff8f00';
      ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.36); ctx.lineTo(cx-sz*0.1, cy-sz*0.28); ctx.lineTo(cx+sz*0.1, cy-sz*0.28); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Крылья (симметричные, как лопатки)
      for (const ex of [-0.44, 0.44]) {
        ctx.fillStyle = '#212121';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*0.18, sz*0.11, sz*0.36, ex>0?0.35:-0.35, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Ножки и лапки
      for (const ex of [-0.18, 0.18]) {
        ctx.fillStyle = '#ff8f00';
        ctx.beginPath(); ctx.rect(cx+ex*sz-sz*0.07, cy+sz*0.78, sz*0.14, sz*0.16); ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx+ex*sz-sz*0.18, cy+sz*0.94); ctx.lineTo(cx+ex*sz+sz*0.18, cy+sz*0.94);
        ctx.lineTo(cx+ex*sz+sz*0.1, cy+sz*1.04); ctx.lineTo(cx+ex*sz-sz*0.1, cy+sz*1.04);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.44, cy+sz*0.18+Math.sin(a)*sz*0.62]);
      for (let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*sz*0.32, cy-sz*0.46+Math.sin(a)*sz*0.32]);
      for (let a=0; a<Math.PI*2; a+=Math.PI/4) { const px=cx+sz*0.44+Math.cos(a+0.35)*sz*0.11, py=cy+sz*0.18+Math.sin(a+0.35)*sz*0.36; if(px>=cx) pts.push([px,py]); }
      pts.push([cx+sz*0.14, cy-sz*0.52],[cx+sz*0.27, cy-sz*0.52]);
      pts.push([cx+sz*0.25, cy+sz*0.78],[cx+sz*0.25, cy+sz*0.94],[cx+sz*0.28, cy+sz*1.04]);
      return pts.filter(([px]) => px >= cx);
    }
  },

  sprunki: {
    label: 'Спрунки',
    hint: '🎵 Дорисуй вторую половину Спрунки!',
    draw(ctx, cx, cy, sz) {
      const lw = sz*0.05;
      ctx.lineWidth = lw; ctx.strokeStyle = '#222'; ctx.lineJoin = 'round';
      // Тело (округлый блоб, фиолетовый)
      ctx.fillStyle = '#ab47bc';
      ctx.beginPath();
      ctx.moveTo(cx, cy+sz*0.78);
      ctx.bezierCurveTo(cx-sz*0.55, cy+sz*0.78, cx-sz*0.65, cy+sz*0.32, cx-sz*0.6, cy-sz*0.08);
      ctx.bezierCurveTo(cx-sz*0.52, cy-sz*0.5, cx-sz*0.22, cy-sz*0.72, cx, cy-sz*0.72);
      ctx.bezierCurveTo(cx+sz*0.22, cy-sz*0.72, cx+sz*0.52, cy-sz*0.5, cx+sz*0.6, cy-sz*0.08);
      ctx.bezierCurveTo(cx+sz*0.65, cy+sz*0.32, cx+sz*0.55, cy+sz*0.78, cx, cy+sz*0.78);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Полоска на теле (светлее)
      ctx.fillStyle = '#ce93d8';
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.16, sz*0.32, sz*0.46, 0, 0, Math.PI*2); ctx.fill();
      // Антенны (симметричные)
      ctx.lineWidth = sz*0.04;
      for (const [ex, ang] of [[-0.18, -0.6], [0.18, 0.6]]) {
        ctx.beginPath(); ctx.moveTo(cx+ex*sz, cy-sz*0.72); ctx.quadraticCurveTo(cx+ex*sz*1.6, cy-sz*1.0, cx+ex*sz*1.8, cy-sz*1.18); ctx.stroke();
        ctx.fillStyle = '#fdd835';
        ctx.beginPath(); ctx.arc(cx+ex*sz*1.8, cy-sz*1.18, sz*0.08, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Глаза (большие круглые, симметричные)
      for (const ex of [-0.2, 0.2]) {
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(cx+ex*sz, cy-sz*0.26, sz*0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#4a148c';
        ctx.beginPath(); ctx.arc(cx+ex*sz+sz*0.05, cy-sz*0.28, sz*0.11, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(cx+ex*sz+sz*0.1, cy-sz*0.34, sz*0.045, 0, Math.PI*2); ctx.fill();
      }
      // Рот (нота ♪ — дуга)
      ctx.strokeStyle = '#222'; ctx.lineWidth = sz*0.04;
      ctx.beginPath(); ctx.arc(cx, cy+sz*0.06, sz*0.2, 0.3, Math.PI-0.3); ctx.stroke();
      // Нотки по бокам (симметричные)
      for (const ex of [-0.52, 0.52]) {
        ctx.fillStyle = '#fdd835'; ctx.strokeStyle = '#222'; ctx.lineWidth = sz*0.03;
        ctx.beginPath(); ctx.arc(cx+ex*sz, cy-sz*0.04, sz*0.07, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx+ex*sz+(ex>0?sz*0.07:-sz*0.07), cy-sz*0.04); ctx.lineTo(cx+ex*sz+(ex>0?sz*0.07:-sz*0.07), cy-sz*0.26); ctx.stroke();
      }
      // Ручки (симметричные)
      ctx.lineWidth = lw;
      for (const ex of [-0.6, 0.6]) {
        ctx.fillStyle = '#ab47bc';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*0.18, sz*0.12, sz*0.24, ex>0?0.5:-0.5, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Ножки (симметричные)
      for (const ex of [-0.22, 0.22]) {
        ctx.fillStyle = '#7b1fa2';
        ctx.beginPath(); ctx.ellipse(cx+ex*sz, cy+sz*0.9, sz*0.13, sz*0.18, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
    },
    keyPoints(cx, cy, sz) {
      const pts = [];
      for (let t=0; t<=1; t+=0.05) {
        const mt=1-t;
        const px = mt**3*cx + 3*mt**2*t*(cx+sz*0.22) + 3*mt*t**2*(cx+sz*0.52) + t**3*(cx+sz*0.6);
        const py = mt**3*(cy-sz*0.72) + 3*mt**2*t*(cy-sz*0.72) + 3*mt*t**2*(cy-sz*0.5) + t**3*(cy-sz*0.08);
        if(px>=cx) pts.push([px,py]);
      }
      for (let t=0; t<=1; t+=0.05) {
        const mt=1-t;
        const px = mt**3*(cx+sz*0.6) + 3*mt**2*t*(cx+sz*0.65) + 3*mt*t**2*(cx+sz*0.55) + t**3*cx;
        const py = mt**3*(cy-sz*0.08) + 3*mt**2*t*(cy+sz*0.32) + 3*mt*t**2*(cy+sz*0.78) + t**3*(cy+sz*0.78);
        if(px>=cx) pts.push([px,py]);
      }
      pts.push([cx+sz*0.18*1.8, cy-sz*1.18]);
      for (let a=0; a<Math.PI*2; a+=Math.PI/6) { const px=cx+sz*0.2+Math.cos(a)*sz*0.2, py=cy-sz*0.26+Math.sin(a)*sz*0.2; if(px>=cx) pts.push([px,py]); }
      for (let a=0; a<Math.PI*2; a+=Math.PI/4) { const px=cx+sz*0.6+Math.cos(a+0.5)*sz*0.12, py=cy+sz*0.18+Math.sin(a+0.5)*sz*0.24; if(px>=cx) pts.push([px,py]); }
      pts.push([cx+sz*0.52, cy-sz*0.04], [cx+sz*0.52, cy-sz*0.26]);
      for (let a=-Math.PI; a<=0; a+=Math.PI/4) pts.push([cx+sz*0.22+Math.cos(a)*sz*0.13, cy+sz*0.9+Math.sin(a)*sz*0.18]);
      return pts.filter(([px]) => px >= cx);
    }
  }
};

// ==========================================================
// SPRUNKI HELPER
// ==========================================================
function drawSprunki(ctx, cx, cy, sz, opts) {
  const {
    color = '#ff7700', headColor,
    bodyShape = 'oval',
    headTop = null,
    eyeStyle = 'dots',
    faceMask = null,
    bodyDecor = null,
  } = opts;
  const hc = headColor || color;
  const lw = sz * 0.038;
  ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = '#1a1a1a';

  // Body — narrow rounded-rect like paint-stroke (matches Sprunki reference style)
  const bw = bodyShape === 'narrow' ? sz * 0.14 : bodyShape === 'round' ? sz * 0.33 : sz * 0.21;
  const bh = bodyShape === 'round' ? sz * 0.33 : sz * 0.36;
  const by = cy + sz * 0.24;
  ctx.fillStyle = color;
  if (bodyShape === 'round') {
    ctx.beginPath(); ctx.ellipse(cx, by, bw, bh, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  } else {
    const rad = bw * 0.55;
    ctx.beginPath(); ctx.roundRect(cx - bw, by - bh, bw*2, bh*2, rad); ctx.fill(); ctx.stroke();
  }

  // Head — larger, sits right on top of body
  const hr = sz * 0.27;
  const hy = cy - sz * 0.12;
  ctx.fillStyle = hc;
  ctx.beginPath(); ctx.arc(cx, hy, hr, 0, Math.PI*2); ctx.fill(); ctx.stroke();

  // Face mask (drawn before eyes)
  if (faceMask === 'visor') {
    ctx.fillStyle = '#b8900a';
    ctx.beginPath(); ctx.ellipse(cx, hy, hr*0.84, hr*0.54, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,230,100,0.4)';
    ctx.beginPath(); ctx.ellipse(cx - hr*0.22, hy - hr*0.1, hr*0.18, hr*0.1, -0.4, 0, Math.PI*2); ctx.fill();
  } else if (faceMask === 'robotscreen') {
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.roundRect(cx - hr*0.7, hy - hr*0.55, hr*1.4, hr*1.0, hr*0.15); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#00cc44';
    ctx.fillRect(cx - hr*0.4, hy - hr*0.28, hr*0.28, hr*0.22);
    ctx.fillRect(cx + hr*0.12, hy - hr*0.28, hr*0.28, hr*0.22);
    ctx.fillStyle = '#0af';
    ctx.fillRect(cx - hr*0.3, hy + hr*0.12, hr*0.6, hr*0.1);
  }

  // Eyes
  if (!faceMask || faceMask === 'goggles') {
    if (eyeStyle === 'dots') {
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(cx - hr*0.36, hy - hr*0.08, hr*0.1, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + hr*0.36, hy - hr*0.08, hr*0.1, 0, Math.PI*2); ctx.fill();
    } else if (eyeStyle === 'big') {
      ctx.fillStyle = '#fff'; ctx.lineWidth = lw*0.6;
      ctx.beginPath(); ctx.ellipse(cx - hr*0.3, hy, hr*0.18, hr*0.2, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx + hr*0.3, hy, hr*0.18, hr*0.2, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(cx - hr*0.3, hy, hr*0.1, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + hr*0.3, hy, hr*0.1, 0, Math.PI*2); ctx.fill();
      ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
    } else if (eyeStyle === 'cat') {
      ctx.fillStyle = '#2a2a00';
      ctx.beginPath(); ctx.ellipse(cx - hr*0.32, hy - hr*0.05, hr*0.08, hr*0.18, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + hr*0.32, hy - hr*0.05, hr*0.08, hr*0.18, 0, 0, Math.PI*2); ctx.fill();
    }
    if (faceMask !== 'goggles') {
      ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = lw * 0.65;
      ctx.beginPath(); ctx.arc(cx, hy + hr*0.3, hr*0.2, 0.2, Math.PI - 0.2); ctx.stroke();
      ctx.lineWidth = lw;
    }
  }

  if (faceMask === 'goggles') {
    ctx.fillStyle = '#111'; ctx.lineWidth = lw * 0.7;
    ctx.beginPath(); ctx.ellipse(cx - hr*0.3, hy - hr*0.08, hr*0.2, hr*0.18, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx + hr*0.3, hy - hr*0.08, hr*0.2, hr*0.18, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#555'; ctx.lineWidth = lw*0.4;
    ctx.beginPath(); ctx.moveTo(cx - hr*0.1, hy - hr*0.08); ctx.lineTo(cx + hr*0.1, hy - hr*0.08); ctx.stroke();
    ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = lw * 0.65;
    ctx.beginPath(); ctx.arc(cx, hy + hr*0.3, hr*0.2, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.lineWidth = lw;
  }

  // Body decoration
  if (bodyDecor === 'shirt') {
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#ccc'; ctx.lineWidth = lw*0.5;
    ctx.beginPath(); ctx.ellipse(cx, by, bw*0.5, bh*0.55, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
  } else if (bodyDecor === 'speaker') {
    ctx.fillStyle = '#555'; ctx.strokeStyle = '#333'; ctx.lineWidth = lw*0.6;
    ctx.beginPath(); ctx.arc(cx, by, bw*0.35, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    for (let r = bw*0.08; r <= bw*0.28; r += bw*0.1) {
      ctx.beginPath(); ctx.arc(cx, by, r, 0, Math.PI*2); ctx.stroke();
    }
    ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
  }

  // Head accessories
  if (!headTop) return;
  const { type, color: ac = color } = headTop;

  if (type === 'headphones') {
    ctx.strokeStyle = ac; ctx.lineWidth = lw * 1.3;
    ctx.beginPath(); ctx.arc(cx, hy, hr + lw*1.8, Math.PI*1.08, Math.PI*1.92); ctx.stroke();
    ctx.fillStyle = ac;
    ctx.beginPath(); ctx.arc(cx - hr - lw*1.8, hy, lw*2.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + hr + lw*1.8, hy, lw*2.4, 0, Math.PI*2); ctx.fill();
    ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
  }
  if (type === 'spikes') {
    const n = headTop.count || 3;
    ctx.fillStyle = ac; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = lw*0.8;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI/2 + (i-(n-1)/2)*(Math.PI*0.65/Math.max(n-1,1));
      const bx2=cx+Math.cos(a)*hr*0.88, by2=hy+Math.sin(a)*hr*0.88;
      const tx=cx+Math.cos(a)*(hr+sz*0.21), ty=hy+Math.sin(a)*(hr+sz*0.21);
      const perp=a+Math.PI/2;
      ctx.beginPath();
      ctx.moveTo(bx2+Math.cos(perp)*sz*0.055, by2+Math.sin(perp)*sz*0.055);
      ctx.lineTo(tx,ty);
      ctx.lineTo(bx2-Math.cos(perp)*sz*0.055, by2-Math.sin(perp)*sz*0.055);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
  }
  if (type === 'catears') {
    ctx.fillStyle = ac; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = lw*0.8;
    for (const dx of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx+dx*hr*0.42, hy-hr*0.68);
      ctx.lineTo(cx+dx*hr*0.8, hy-hr*1.38);
      ctx.lineTo(cx+dx*hr*0.1, hy-hr*0.9);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
  }
  if (type === 'bunnyears') {
    ctx.fillStyle = ac; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = lw*0.8;
    ctx.beginPath(); ctx.ellipse(cx-hr*0.28, hy-hr*1.55, hr*0.14, hr*0.46, -0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx+hr*0.28, hy-hr*1.55, hr*0.14, hr*0.46, 0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffb6c1'; ctx.lineWidth = 0;
    ctx.beginPath(); ctx.ellipse(cx-hr*0.28, hy-hr*1.55, hr*0.07, hr*0.32, -0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx+hr*0.28, hy-hr*1.55, hr*0.07, hr*0.32, 0.1, 0, Math.PI*2); ctx.fill();
    ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
  }
  if (type === 'tophat') {
    ctx.fillStyle = ac; ctx.strokeStyle = '#1a1a1a';
    ctx.beginPath(); ctx.ellipse(cx, hy-hr, hr*1.18, hr*0.2, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillRect(cx-hr*0.64, hy-hr-sz*0.28, hr*1.28, sz*0.28);
    ctx.strokeRect(cx-hr*0.64, hy-hr-sz*0.28, hr*1.28, sz*0.28);
    if (ac === '#111' || ac === '#222' || ac === '#000') {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(cx, hy-hr-sz*0.005, hr*1.05, hr*0.18, 0, 0, Math.PI*2); ctx.fill();
    }
  }
  if (type === 'fedora') {
    ctx.fillStyle = ac; ctx.strokeStyle = '#1a1a1a';
    ctx.beginPath(); ctx.ellipse(cx, hy-hr, hr*1.42, hr*0.24, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-hr*0.7, hy-hr); ctx.quadraticCurveTo(cx, hy-hr-sz*0.28, cx+hr*0.7, hy-hr); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = lw*0.45;
    ctx.beginPath(); ctx.moveTo(cx-hr*0.68, hy-hr-sz*0.04); ctx.lineTo(cx+hr*0.68, hy-hr-sz*0.04); ctx.stroke();
    ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
  }
  if (type === 'antenna') {
    ctx.strokeStyle = '#999'; ctx.lineWidth = lw*0.7;
    ctx.beginPath(); ctx.moveTo(cx, hy-hr); ctx.lineTo(cx, hy-hr-sz*0.24); ctx.stroke();
    ctx.fillStyle = ac;
    ctx.beginPath(); ctx.arc(cx, hy-hr-sz*0.24, lw*1.9, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
  }
  if (type === 'flowers') {
    const n = headTop.count || 3;
    for (let i = 0; i < n; i++) {
      const ang = -Math.PI/2 + (i-(n-1)/2)*(Math.PI*0.55/Math.max(n-1,1));
      const fx = cx+Math.cos(ang)*hr*0.65, fy = hy+Math.sin(ang)*hr*0.65-hr*0.88;
      ctx.fillStyle = ac;
      for (let p = 0; p < 5; p++) {
        const pa = p*Math.PI*2/5;
        ctx.beginPath(); ctx.arc(fx+Math.cos(pa)*sz*0.05, fy+Math.sin(pa)*sz*0.05, sz*0.04, 0, Math.PI*2); ctx.fill();
      }
      ctx.fillStyle = '#FFD700';
      ctx.beginPath(); ctx.arc(fx, fy, sz*0.033, 0, Math.PI*2); ctx.fill();
    }
  }
  if (type === 'treeTop') {
    ctx.fillStyle = ac; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = lw*0.8;
    ctx.beginPath(); ctx.moveTo(cx, hy-hr-sz*0.38); ctx.lineTo(cx+hr*1.05, hy-hr+sz*0.05); ctx.lineTo(cx-hr*1.05, hy-hr+sz*0.05); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, hy-hr-sz*0.2); ctx.lineTo(cx+hr*0.8, hy-hr+sz*0.12); ctx.lineTo(cx-hr*0.8, hy-hr+sz*0.12); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
  }
  if (type === 'crown') {
    ctx.fillStyle = ac; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = lw*0.8;
    const cw=hr*1.08, ch=sz*0.22;
    ctx.beginPath();
    ctx.moveTo(cx-cw, hy-hr); ctx.lineTo(cx-cw, hy-hr-ch);
    ctx.lineTo(cx-cw*0.38, hy-hr-ch*0.48); ctx.lineTo(cx, hy-hr-ch);
    ctx.lineTo(cx+cw*0.38, hy-hr-ch*0.48); ctx.lineTo(cx+cw, hy-hr-ch);
    ctx.lineTo(cx+cw, hy-hr); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
  }
  if (type === 'bigears') {
    ctx.fillStyle = ac; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = lw*0.8;
    ctx.beginPath(); ctx.arc(cx-hr*1.24, hy, hr*0.42, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx+hr*1.24, hy, hr*0.42, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
  }
  if (type === 'sunrays') {
    ctx.strokeStyle = ac; ctx.lineWidth = lw*1.2;
    for (let i = 0; i < 8; i++) {
      const a = i*Math.PI/4 - Math.PI/2;
      ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*(hr+lw), hy+Math.sin(a)*(hr+lw));
      ctx.lineTo(cx+Math.cos(a)*(hr+sz*0.22), hy+Math.sin(a)*(hr+sz*0.22)); ctx.stroke();
    }
    ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
  }
  if (type === 'bucket') {
    ctx.fillStyle = ac; ctx.strokeStyle = '#1a1a1a';
    const btop = hy - hr*0.25;
    ctx.beginPath();
    ctx.arc(cx, btop, hr*1.08, Math.PI, 0);
    ctx.lineTo(cx+hr*0.78, btop-sz*0.3); ctx.lineTo(cx-hr*0.78, btop-sz*0.3); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, btop, hr*1.1, hr*0.2, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  }
  if (type === 'whiskers') {
    ctx.strokeStyle = '#666'; ctx.lineWidth = lw*0.5;
    for (const [dx, dy, da] of [[-1,-0.08,-0.15],[-1,0.08,0.1],[1,-0.08,0.15],[1,0.08,-0.1]]) {
      ctx.beginPath();
      ctx.moveTo(cx+dx*hr*0.15, hy+dy*hr);
      ctx.lineTo(cx+dx*hr*(0.15+0.65), hy+(dy+Math.tan(da)*0.65)*hr);
      ctx.stroke();
    }
    ctx.lineWidth = lw; ctx.strokeStyle = '#1a1a1a';
  }
}

function sprunkiKP(cx, cy, sz, extra) {
  const hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
  const pts=[];
  for(let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
  for(let a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/10) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
  if(extra) extra.forEach(p=>pts.push(p));
  return pts.filter(([px])=>px>=cx);
}

// ── Sprunki Characters ─────────────────────────────────────────────────────

const SHAPE_DEFS_SPRUNKI = {
  sprunkiOrange: {
    label: 'Орен (Спрунки)', hint: '🎵 Дорисуй наушник Орена!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#ff7700',headTop:{type:'headphones',color:'#ff5500'}}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz,[[cx+sz*0.24+sz*0.095,cy-sz*0.14]]); }
  },
  sprunkiRed: {
    label: 'Рэдди (Спрунки)', hint: '🎵 Дорисуй шипы Рэдди!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#cc1111',headTop:{type:'spikes',count:4,color:'#cc1111'}}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz); }
  },
  sprunkiSilver: {
    label: 'Кликр (Спрунки)', hint: '🎵 Дорисуй правую сторону Кликра!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#aaaaaa',bodyShape:'narrow',eyeStyle:'dots'}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz); }
  },
  sprunkiFunBot: {
    label: 'Весёлый Робот (Спрунки)', hint: '🎵 Дорисуй антенну Весёлого Робота!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#777777',faceMask:'robotscreen',headTop:{type:'antenna',color:'#ffdd00'}}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz,[[cx,cy-sz*0.14-sz*0.24-sz*0.24]]); }
  },
  sprunkiGreen: {
    label: 'Винерия (Спрунки)', hint: '🎵 Дорисуй цветочки Винерии!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#228b22',headTop:{type:'flowers',count:4,color:'#ff69b4'}}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz); }
  },
  sprunkiGray: {
    label: 'Грэй (Спрунки)', hint: '🎵 Дорисуй очки Грэя!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#888888',faceMask:'goggles'}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz); }
  },
  sprunkiBrown: {
    label: 'Бруд (Спрунки)', hint: '🎵 Дорисуй шапку Бруда!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#7b4a1e',headTop:{type:'bucket',color:'#5a3510'}}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz); }
  },
  sprunkiGold: {
    label: 'Гарнольд (Спрунки)', hint: '🎵 Дорисуй визор Гарнольда!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#c8960a',faceMask:'visor'}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz); }
  },
  sprunkiLime: {
    label: 'Облакс (Спрунки)', hint: '🎵 Дорисуй корону Облакса!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#88dd00',headTop:{type:'crown',color:'#66bb00'}}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz); }
  },
  sprunkiSky: {
    label: 'Скай (Спрунки)', hint: '🎵 Дорисуй правую половину Скай!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#44ccff',eyeStyle:'big'}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz); }
  },
  sprunkiPurple: {
    label: 'Дурпл (Спрунки)', hint: '🎵 Дорисуй ушко Дурпла!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#8822cc',eyeStyle:'cat',headTop:{type:'catears',color:'#8822cc'}}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz,[[cx+sz*0.24*0.75,cy-sz*0.14-sz*0.24*1.38]]); }
  },
  sprunkiMrTree: {
    label: 'Мистер Дерево (Спрунки)', hint: '🎵 Дорисуй крону Мистера Дерева!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#1a5c1a',headTop:{type:'treeTop',color:'#1a7a1a'}}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz,[[cx+sz*0.24*1.05,cy-sz*0.14-sz*0.24+sz*0.05]]); }
  },
  sprunkiYellow: {
    label: 'Саймон (Спрунки)', hint: '🎵 Дорисуй ушко Саймона!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#ffdd00',headTop:{type:'bigears',color:'#ffdd00'},antenna:true}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz,[[cx+sz*0.24*1.24+sz*0.24*0.42,cy-sz*0.14]]); }
  },
  sprunkiTan: {
    label: 'Танер (Спрунки)', hint: '🎵 Дорисуй шляпу Танера!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#c8a06a',headTop:{type:'fedora',color:'#8B6914'}}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz); }
  },
  sprunkiWenda: {
    label: 'Венда (Спрунки)', hint: '🎵 Дорисуй усики Венды!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#f0f0f0',eyeStyle:'cat',headTop:{type:'catears',color:'#e0e0e0'}}); const hr=sz*0.24,hy=cy-sz*0.14,lw=sz*0.038; ctx.strokeStyle='#888'; ctx.lineWidth=lw*0.45; for(const [dx,dy,da] of [[-1,-0.08,-0.15],[-1,0.08,0.1],[1,-0.08,0.15],[1,0.08,-0.1]]){ctx.beginPath();ctx.moveTo(cx+dx*hr*0.15,hy+dy*hr);ctx.lineTo(cx+dx*(hr*0.15+hr*0.65),hy+(dy+Math.tan(da)*0.65)*hr);ctx.stroke();} ctx.strokeStyle='#1a1a1a'; },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz); }
  },
  sprunkiPinki: {
    label: 'Пинки (Спрунки)', hint: '🎵 Дорисуй ушко Пинки!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#ff88bb',headTop:{type:'bunnyears',color:'#ffaad4'}}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz,[[cx+sz*0.24*0.28+sz*0.24*0.14,cy-sz*0.14-sz*0.24*1.55]]); }
  },
  sprunkiJevin: {
    label: 'Джевин (Спрунки)', hint: '🎵 Дорисуй правую половину Джевина!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#1144cc',bodyShape:'round',bodyDecor:'speaker'}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz); }
  },
  sprunkiBlack: {
    label: 'Блэк (Спрунки)', hint: '🎵 Дорисуй цилиндр Блэка!',
    draw(ctx,cx,cy,sz){ drawSprunki(ctx,cx,cy,sz,{color:'#111111',headColor:'#222222',bodyDecor:'shirt',headTop:{type:'tophat',color:'#111111'}}); },
    keyPoints(cx,cy,sz){ return sprunkiKP(cx,cy,sz); }
  },

  dog: {
    label: 'Собачка', hint: '🐶 Дорисуй правое ушко собачки!',
    draw(ctx,cx,cy,sz){
      const lw=sz*0.042; ctx.lineWidth=lw; ctx.lineJoin='round'; ctx.lineCap='round'; ctx.strokeStyle='#333';
      ctx.fillStyle='#d4994a';
      ctx.beginPath(); ctx.ellipse(cx,cy+sz*0.12,sz*0.3,sz*0.38,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.32,sz*0.28,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#c4893a';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.22,cy-sz*0.52,sz*0.1,sz*0.16,0.2,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.22,cy-sz*0.52,sz*0.1,sz*0.16,-0.2,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#333';
      ctx.beginPath(); ctx.arc(cx-sz*0.1,cy-sz*0.36,sz*0.04,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.1,cy-sz*0.36,sz*0.04,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#222'; ctx.beginPath(); ctx.arc(cx,cy-sz*0.24,sz*0.06,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle='#333'; ctx.lineWidth=lw*0.7;
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.18,sz*0.12,0.2,Math.PI-0.2); ctx.stroke();
      ctx.lineWidth=lw; ctx.strokeStyle='#333';
      ctx.fillStyle='#d4994a';
      ctx.beginPath(); ctx.ellipse(cx+sz*0.35,cy+sz*0.22,sz*0.09,sz*0.06,0.4,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx-sz*0.35,cy+sz*0.22,sz*0.09,sz*0.06,-0.4,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.bezierCurveTo(cx+sz*0.3,cy+sz*0.42,cx+sz*0.52,cy+sz*0.28,cx+sz*0.38,cy+sz*0.5); ctx.moveTo(cx+sz*0.3,cy+sz*0.42); ctx.stroke();
    },
    keyPoints(cx,cy,sz){ const p=[]; for(let a=-Math.PI/2;a<=Math.PI/2;a+=Math.PI/10) p.push([cx+Math.cos(a)*sz*0.28,cy-sz*0.32+Math.sin(a)*sz*0.28]); for(let a=-Math.PI/2;a<=Math.PI/2;a+=Math.PI/10) p.push([cx+Math.cos(a)*sz*0.3,cy+sz*0.12+Math.sin(a)*sz*0.38]); return p.filter(([px])=>px>=cx); }
  },

  frog: {
    label: 'Лягушка', hint: '🐸 Дорисуй правый глазик лягушки!',
    draw(ctx,cx,cy,sz){
      const lw=sz*0.04; ctx.lineWidth=lw; ctx.lineJoin='round'; ctx.lineCap='round'; ctx.strokeStyle='#1a4a1a';
      ctx.fillStyle='#44bb44';
      ctx.beginPath(); ctx.ellipse(cx,cy+sz*0.06,sz*0.34,sz*0.3,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.22,sz*0.26,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#55cc55';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.18,cy-sz*0.44,sz*0.1,sz*0.1,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.18,cy-sz*0.44,sz*0.1,sz*0.1,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#111';
      ctx.beginPath(); ctx.arc(cx-sz*0.18,cy-sz*0.44,sz*0.055,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.18,cy-sz*0.44,sz*0.055,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#1a4a1a'; ctx.lineWidth=lw*0.7;
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.14,sz*0.14,0.2,Math.PI-0.2); ctx.stroke();
      ctx.lineWidth=lw;
      ctx.fillStyle='#44bb44';
      for(const [lx,ly,la] of [[cx-sz*0.38,cy+sz*0.22,-0.5],[cx+sz*0.38,cy+sz*0.22,0.5]]) {
        ctx.beginPath(); ctx.ellipse(lx,ly,sz*0.12,sz*0.08,la,0,Math.PI*2); ctx.fill(); ctx.stroke();
      }
    },
    keyPoints(cx,cy,sz){ const p=[]; for(let a=0;a<Math.PI*2;a+=Math.PI/6){const px=cx+sz*0.18+Math.cos(a)*sz*0.1,py=cy-sz*0.44+Math.sin(a)*sz*0.1;if(px>=cx)p.push([px,py]);} for(let a=-Math.PI/2;a<=Math.PI/2;a+=Math.PI/10) p.push([cx+Math.cos(a)*sz*0.26,cy-sz*0.22+Math.sin(a)*sz*0.26]); for(let a=-Math.PI/2;a<=Math.PI/2;a+=Math.PI/10) p.push([cx+Math.cos(a)*sz*0.34,cy+sz*0.06+Math.sin(a)*sz*0.3]); return p.filter(([px])=>px>=cx); }
  },

  fish: {
    label: 'Рыбка', hint: '🐟 Дорисуй хвостик рыбки!',
    draw(ctx,cx,cy,sz){
      const lw=sz*0.04; ctx.lineWidth=lw; ctx.lineJoin='round'; ctx.lineCap='round'; ctx.strokeStyle='#1155aa';
      ctx.fillStyle='#2288ff';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.06,cy,sz*0.4,sz*0.22,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#44aaff';
      ctx.beginPath(); ctx.moveTo(cx+sz*0.34,cy); ctx.lineTo(cx+sz*0.55,cy-sz*0.22); ctx.lineTo(cx+sz*0.55,cy+sz*0.22); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#111';
      ctx.beginPath(); ctx.arc(cx-sz*0.3,cy-sz*0.06,sz*0.05,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.35)';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.18,cy-sz*0.06,sz*0.12,sz*0.08,0.4,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#1155aa'; ctx.lineWidth=lw*0.5;
      for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(cx-sz*0.06+i*sz*0.14,cy,sz*(0.14+i*0.08),Math.PI*0.7,Math.PI*1.3);ctx.stroke();}
      ctx.lineWidth=lw;
    },
    keyPoints(cx,cy,sz){ const p=[]; for(let a=0;a<Math.PI*2;a+=Math.PI/10){const px=cx-sz*0.06+Math.cos(a)*sz*0.4,py=cy+Math.sin(a)*sz*0.22;if(px>=cx-sz*0.06)p.push([px,py]);} p.push([cx+sz*0.55,cy-sz*0.22],[cx+sz*0.55,cy+sz*0.22]); return p.filter(([px])=>px>=cx); }
  },

  duck: {
    label: 'Утёнок', hint: '🐥 Дорисуй клювик утёнка!',
    draw(ctx,cx,cy,sz){
      const lw=sz*0.04; ctx.lineWidth=lw; ctx.lineJoin='round'; ctx.lineCap='round'; ctx.strokeStyle='#aa7700';
      ctx.fillStyle='#FFD700';
      ctx.beginPath(); ctx.ellipse(cx,cy+sz*0.1,sz*0.3,sz*0.28,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.24,sz*0.22,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#ff8800';
      ctx.beginPath(); ctx.moveTo(cx+sz*0.22,cy-sz*0.22); ctx.lineTo(cx+sz*0.44,cy-sz*0.18); ctx.lineTo(cx+sz*0.22,cy-sz*0.14); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(cx+sz*0.08,cy-sz*0.3,sz*0.04,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#FFD700';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.32,cy+sz*0.22,sz*0.1,sz*0.06,0.3,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.32,cy+sz*0.22,sz*0.1,sz*0.06,-0.3,0,Math.PI*2); ctx.fill(); ctx.stroke();
    },
    keyPoints(cx,cy,sz){ const p=[]; for(let a=-Math.PI/2;a<=Math.PI/2;a+=Math.PI/10) p.push([cx+Math.cos(a)*sz*0.22,cy-sz*0.24+Math.sin(a)*sz*0.22]); p.push([cx+sz*0.44,cy-sz*0.18]); for(let a=-Math.PI/2;a<=Math.PI/2;a+=Math.PI/10) p.push([cx+Math.cos(a)*sz*0.3,cy+sz*0.1+Math.sin(a)*sz*0.28]); return p.filter(([px])=>px>=cx); }
  },

  elephant: {
    label: 'Слоник', hint: '🐘 Дорисуй хоботок слоника!',
    draw(ctx,cx,cy,sz){
      const lw=sz*0.04; ctx.lineWidth=lw; ctx.lineJoin='round'; ctx.lineCap='round'; ctx.strokeStyle='#444';
      ctx.fillStyle='#aaaacc';
      ctx.beginPath(); ctx.ellipse(cx,cy+sz*0.1,sz*0.36,sz*0.32,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx-sz*0.06,cy-sz*0.22,sz*0.28,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#ccccee';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.44,cy-sz*0.35,sz*0.15,sz*0.22,-0.3,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.32,cy-sz*0.35,sz*0.15,sz*0.22,0.3,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(cx+sz*0.06,cy-sz*0.28,sz*0.04,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#aaaacc';
      ctx.beginPath(); ctx.moveTo(cx-sz*0.28,cy-sz*0.15); ctx.quadraticCurveTo(cx-sz*0.46,cy+sz*0.1,cx-sz*0.36,cy+sz*0.3); ctx.lineWidth=lw*2; ctx.stroke(); ctx.lineWidth=lw;
    },
    keyPoints(cx,cy,sz){ const p=[]; for(let a=0;a<Math.PI*2;a+=Math.PI/8){const px=cx+sz*0.32+Math.cos(a+0.3)*sz*0.15,py=cy-sz*0.35+Math.sin(a+0.3)*sz*0.22;if(px>=cx)p.push([px,py]);} for(let a=-Math.PI/2;a<=Math.PI/2;a+=Math.PI/10) p.push([cx+Math.cos(a)*sz*0.36,cy+sz*0.1+Math.sin(a)*sz*0.32]); return p.filter(([px])=>px>=cx); }
  },

  bear: {
    label: 'Мишка', hint: '🐻 Дорисуй правое ушко мишки!',
    draw(ctx,cx,cy,sz){
      const lw=sz*0.042; ctx.lineWidth=lw; ctx.lineJoin='round'; ctx.lineCap='round'; ctx.strokeStyle='#4a2a0a';
      ctx.fillStyle='#8B4513';
      ctx.beginPath(); ctx.ellipse(cx,cy+sz*0.1,sz*0.32,sz*0.35,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.3,sz*0.28,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx-sz*0.23,cy-sz*0.54,sz*0.12,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+sz*0.23,cy-sz*0.54,sz*0.12,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#a0522d';
      ctx.beginPath(); ctx.arc(cx-sz*0.23,cy-sz*0.54,sz*0.07,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.23,cy-sz*0.54,sz*0.07,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#c4936a'; ctx.beginPath(); ctx.ellipse(cx,cy-sz*0.2,sz*0.14,sz*0.1,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(cx-sz*0.1,cy-sz*0.33,sz*0.04,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.1,cy-sz*0.33,sz*0.04,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#222'; ctx.beginPath(); ctx.arc(cx,cy-sz*0.22,sz*0.04,0,Math.PI*2); ctx.fill();
    },
    keyPoints(cx,cy,sz){ const p=[]; for(let a=0;a<Math.PI*2;a+=Math.PI/6){const px=cx+sz*0.23+Math.cos(a)*sz*0.12,py=cy-sz*0.54+Math.sin(a)*sz*0.12;if(px>=cx)p.push([px,py]);} for(let a=-Math.PI/2;a<=Math.PI/2;a+=Math.PI/10) p.push([cx+Math.cos(a)*sz*0.28,cy-sz*0.3+Math.sin(a)*sz*0.28]); for(let a=-Math.PI/2;a<=Math.PI/2;a+=Math.PI/10) p.push([cx+Math.cos(a)*sz*0.32,cy+sz*0.1+Math.sin(a)*sz*0.35]); return p.filter(([px])=>px>=cx); }
  },

  owl: {
    label: 'Совёнок', hint: '🦉 Дорисуй правое крылышко совёнка!',
    draw(ctx,cx,cy,sz){
      const lw=sz*0.04; ctx.lineWidth=lw; ctx.lineJoin='round'; ctx.lineCap='round'; ctx.strokeStyle='#3a2800';
      ctx.fillStyle='#8B6914';
      ctx.beginPath(); ctx.ellipse(cx,cy+sz*0.12,sz*0.28,sz*0.4,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.22,sz*0.26,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#c8a040';
      ctx.beginPath(); ctx.moveTo(cx-sz*0.16,cy-sz*0.42); ctx.lineTo(cx-sz*0.26,cy-sz*0.6); ctx.lineTo(cx-sz*0.06,cy-sz*0.44); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+sz*0.16,cy-sz*0.42); ctx.lineTo(cx+sz*0.26,cy-sz*0.6); ctx.lineTo(cx+sz*0.06,cy-sz*0.44); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#fff'; ctx.lineWidth=lw*0.6;
      ctx.beginPath(); ctx.arc(cx-sz*0.12,cy-sz*0.22,sz*0.1,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+sz*0.12,cy-sz*0.22,sz*0.1,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#111';
      ctx.beginPath(); ctx.arc(cx-sz*0.12,cy-sz*0.22,sz*0.055,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.12,cy-sz*0.22,sz*0.055,0,Math.PI*2); ctx.fill();
      ctx.lineWidth=lw; ctx.strokeStyle='#3a2800';
      ctx.fillStyle='#ff9900'; ctx.beginPath(); ctx.moveTo(cx,cy-sz*0.14); ctx.lineTo(cx-sz*0.06,cy-sz*0.08); ctx.lineTo(cx+sz*0.06,cy-sz*0.08); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#8B6914';
      ctx.beginPath(); ctx.ellipse(cx+sz*0.38,cy+sz*0.06,sz*0.12,sz*0.28,-0.4,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx-sz*0.38,cy+sz*0.06,sz*0.12,sz*0.28,0.4,0,Math.PI*2); ctx.fill(); ctx.stroke();
    },
    keyPoints(cx,cy,sz){ const p=[]; for(let a=0;a<Math.PI*2;a+=Math.PI/6){const px=cx+sz*0.12+Math.cos(a)*sz*0.1,py=cy-sz*0.22+Math.sin(a)*sz*0.1;if(px>=cx)p.push([px,py]);} for(let a=-Math.PI/2;a<=Math.PI/2;a+=Math.PI/10) p.push([cx+Math.cos(a)*sz*0.28,cy+sz*0.12+Math.sin(a)*sz*0.4]); for(let a=0;a<Math.PI*2;a+=Math.PI/4){const px=cx+sz*0.38+Math.cos(a-0.4)*sz*0.12,py=cy+sz*0.06+Math.sin(a-0.4)*sz*0.28;if(px>=cx)p.push([px,py]);} return p.filter(([px])=>px>=cx); }
  },

  flower: {
    label: 'Цветочек', hint: '🌸 Дорисуй правый лепесток!',
    draw(ctx,cx,cy,sz){
      const lw=sz*0.04; ctx.lineWidth=lw; ctx.lineJoin='round'; ctx.lineCap='round'; ctx.strokeStyle='#226600';
      ctx.fillStyle='#44aa00';
      ctx.beginPath(); ctx.moveTo(cx,cy+sz*0.1); ctx.lineTo(cx,cy+sz*0.62); ctx.lineWidth=lw*1.8; ctx.stroke(); ctx.lineWidth=lw;
      ctx.beginPath(); ctx.ellipse(cx+sz*0.14,cy+sz*0.35,sz*0.14,sz*0.07,-0.5,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#ff69b4';
      for(let i=0;i<6;i++){
        const a=i*Math.PI/3;
        ctx.beginPath(); ctx.ellipse(cx+Math.cos(a)*sz*0.22,cy-sz*0.06+Math.sin(a)*sz*0.22,sz*0.12,sz*0.2,a,0,Math.PI*2); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle='#FFD700';
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.06,sz*0.14,0,Math.PI*2); ctx.fill(); ctx.stroke();
    },
    keyPoints(cx,cy,sz){ const p=[]; for(let i=0;i<6;i++){const a=i*Math.PI/3;const cpx=cx+Math.cos(a)*sz*0.22,cpy=cy-sz*0.06+Math.sin(a)*sz*0.22;for(let t=0;t<Math.PI*2;t+=Math.PI/4){const px=cpx+Math.cos(t+a)*sz*0.12,py=cpy+Math.sin(t+a)*sz*0.2;if(px>=cx)p.push([px,py]);}} return p; }
  },

  mushroom: {
    label: 'Грибочек', hint: '🍄 Дорисуй правую точечку!',
    draw(ctx,cx,cy,sz){
      const lw=sz*0.04; ctx.lineWidth=lw; ctx.lineJoin='round'; ctx.lineCap='round'; ctx.strokeStyle='#5a2200';
      ctx.fillStyle='#f5f0e8';
      ctx.beginPath(); ctx.ellipse(cx,cy+sz*0.38,sz*0.22,sz*0.26,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#dd2200';
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.08,sz*0.38,Math.PI,0); ctx.lineTo(cx+sz*0.38,cy+sz*0.06); ctx.bezierCurveTo(cx+sz*0.38,cy+sz*0.18,cx-sz*0.38,cy+sz*0.18,cx-sz*0.38,cy+sz*0.06); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#fff';
      ctx.beginPath(); ctx.arc(cx-sz*0.16,cy-sz*0.18,sz*0.08,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+sz*0.2,cy-sz*0.06,sz*0.07,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx-sz*0.04,cy+sz*0.04,sz*0.05,0,Math.PI*2); ctx.fill(); ctx.stroke();
    },
    keyPoints(cx,cy,sz){ const p=[]; for(let a=0;a<=Math.PI;a+=Math.PI/10) p.push([cx+Math.cos(a)*sz*0.38,cy-sz*0.08+Math.sin(a)*sz*0.38]); for(let a=-Math.PI/2;a<=Math.PI/2;a+=Math.PI/10) p.push([cx+Math.cos(a)*sz*0.22,cy+sz*0.38+Math.sin(a)*sz*0.26]); for(const c of [[cx+sz*0.2,cy-sz*0.06,sz*0.07],[cx-sz*0.04,cy+sz*0.04,sz*0.05]]){for(let a=0;a<Math.PI*2;a+=Math.PI/3){const px=c[0]+Math.cos(a)*c[2],py=c[1]+Math.sin(a)*c[2];if(px>=cx)p.push([px,py]);}} return p.filter(([px])=>px>=cx); }
  },

  balloon: {
    label: 'Шарик', hint: '🎈 Дорисуй правую половину шарика!',
    draw(ctx,cx,cy,sz){
      const lw=sz*0.04; ctx.lineWidth=lw; ctx.lineJoin='round'; ctx.lineCap='round'; ctx.strokeStyle='#aa0000';
      ctx.fillStyle='#ff3333';
      ctx.beginPath(); ctx.ellipse(cx,cy-sz*0.14,sz*0.34,sz*0.42,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.38)';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.1,cy-sz*0.34,sz*0.1,sz*0.15,-0.4,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#aa0000'; ctx.lineWidth=lw;
      ctx.fillStyle='#cc2200';
      ctx.beginPath(); ctx.moveTo(cx-sz*0.06,cy+sz*0.28); ctx.lineTo(cx,cy+sz*0.34); ctx.lineTo(cx+sz*0.06,cy+sz*0.28); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle='#886600'; ctx.lineWidth=lw*0.7;
      ctx.beginPath(); ctx.moveTo(cx,cy+sz*0.34); ctx.quadraticCurveTo(cx+sz*0.1,cy+sz*0.5,cx+sz*0.04,cy+sz*0.7); ctx.stroke();
      ctx.lineWidth=lw;
    },
    keyPoints(cx,cy,sz){ const p=[]; for(let a=-Math.PI/2;a<=Math.PI/2;a+=Math.PI/10) p.push([cx+Math.cos(a)*sz*0.34,cy-sz*0.14+Math.sin(a)*sz*0.42]); return p; }
  },
};

// Merge sprunki and animal shapes into SHAPE_DEFS
Object.assign(SHAPE_DEFS, SHAPE_DEFS_SPRUNKI);

// ==========================================================
// EXERCISE RENDERER
// ==========================================================
function renderMirrorExercise(ctx, x, y, w, h, config) {
  const { shape = 'bunny', guideDots = 10, showHint = true, showGrid = true, accentColor = '#9c27b0' } = config;
  const shapeDef = SHAPE_DEFS[shape] || SHAPE_DEFS.bunny;
  const cx = x + w / 2;
  const hintH = showHint ? Math.min(h * 0.1, 50) : 0;
  const drawH = h - hintH;
  const cy = y + drawH * 0.5;
  const sz = Math.min(w / 2, drawH) * 0.74;

  ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, h);

  if (showGrid) {
    const step = Math.max(16, sz * 0.12);
    ctx.fillStyle = '#e0e0e0';
    for (let gx = cx + step/2; gx < x + w - 6; gx += step)
      for (let gy = y + step/2; gy < y + drawH - 6; gy += step) {
        ctx.beginPath(); ctx.arc(gx, gy, 1.5, 0, Math.PI*2); ctx.fill();
      }
  }

  // Left half: full colored shape
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w / 2, h); ctx.clip();
  shapeDef.draw(ctx, cx, cy, sz);
  ctx.restore();

  // Center divider
  ctx.save();
  ctx.strokeStyle = '#bbb'; ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 6]);
  ctx.beginPath(); ctx.moveTo(cx, y + 6); ctx.lineTo(cx, y + drawH - 6); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Right half: dashed outline guide via Proxy
  // guideDots 3-20: thin→thick dash, easy to control difficulty
  const t = (guideDots - 3) / 17; // 0..1
  const guideLineWidth = 1.2 + t * 5.8;   // 1.2 → 7 px
  const dashLen        = 5  + t * 18;      // 5  → 23 px
  const gapLen         = 22 - t * 15;      // 22 → 7  px
  const guideColor     = accentColor + 'bb'; // accent semi-transparent

  ctx.save();
  ctx.beginPath(); ctx.rect(cx, y, w / 2, h); ctx.clip();
  ctx.setLineDash([dashLen, gapLen]);

  const proxyCtx = new Proxy(ctx, {
    set(target, prop, value) {
      if (prop === 'fillStyle')   return true;            // suppress fills
      if (prop === 'strokeStyle') { target[prop] = guideColor;     return true; }
      if (prop === 'lineWidth')   { target[prop] = guideLineWidth; return true; }
      target[prop] = value; return true;
    },
    get(target, prop) {
      if (prop === 'fill' || prop === 'fillRect' || prop === 'fillText') return () => {};
      const val = target[prop];
      return typeof val === 'function' ? val.bind(target) : val;
    },
  });

  shapeDef.draw(proxyCtx, cx, cy, sz);
  ctx.restore(); // clears clip + dash pattern

  if (showHint && shapeDef.hint) {
    ctx.save();
    const hintSz = Math.max(13, hintH * 0.48);
    ctx.fillStyle = '#555';
    ctx.font = `bold ${hintSz}px "Nunito", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(shapeDef.hint, cx, y + drawH + hintH * 0.5);
    ctx.restore();
  }
}

// ==========================================================
// PAGE RENDERER (exported)
// ==========================================================
export function renderMirrorPage(ctx, config, pageIndex) {
  const {
    shape = 'bunny', guideDots = 10, showHint = true, showGrid = true,
    pageTitle = 'Зеркальный художник', accentColor = '#9c27b0', pages = 1,
  } = config;

  const W = ctx.canvas.width, H = ctx.canvas.height;
  const mm = H / 297, pt = mm * 0.353;

  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  const padTop = 9*mm, padSide = 10*mm, padBot = 7*mm;
  let curY = padTop;

  if (pageTitle) {
    const titleSz = 20 * pt;
    ctx.fillStyle = accentColor;
    ctx.font = `bold ${titleSz}px "Fredoka One", cursive`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(pageTitle, W/2, curY);
    curY += titleSz * 1.2 + 2*mm;
  }

  const footerH = 5*mm;
  renderMirrorExercise(ctx, padSide, curY, W - 2*padSide, H - curY - padBot - footerH, {
    shape, guideDots, showHint, showGrid, accentColor
  });

  ctx.fillStyle = '#bbb';
  ctx.font = `${7.5*pt}px "Fredoka One", cursive`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(`✦ Зеркальный художник — стр. ${pageIndex+1} из ${pages} ✦`, W/2, H - padBot - footerH + mm);
}

// ==========================================================
// RENDER ALL PAGES (for print HTML)
// ==========================================================
export function renderMirrorAllPages(config) {
  const { pages: pageCount = 1 } = config;
  for (let i = 0; i < pageCount; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = 1240; canvas.height = 1754;
    canvas.style.cssText = 'display:block;width:210mm;height:297mm;page-break-after:always;';
    document.body.appendChild(canvas);
    renderMirrorPage(canvas.getContext('2d'), config, i);
  }
}
