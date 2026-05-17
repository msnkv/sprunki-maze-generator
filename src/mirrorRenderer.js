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
// EXERCISE RENDERER
// ==========================================================
function renderMirrorExercise(ctx, x, y, w, h, config) {
  const { shape = 'bunny', guideDots = 10, showHint = true, showGrid = true } = config;
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

  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w / 2, h); ctx.clip();
  shapeDef.draw(ctx, cx, cy, sz);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = '#bbb'; ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 6]);
  ctx.beginPath(); ctx.moveTo(cx, y + 6); ctx.lineTo(cx, y + drawH - 6); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  const allPts = shapeDef.keyPoints(cx, cy, sz);
  const shown = samplePts(allPts, Math.min(guideDots, allPts.length));
  for (const [px, py] of shown) {
    ctx.save();
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI*2);
    ctx.fillStyle = '#333'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
  }

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
