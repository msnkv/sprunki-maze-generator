// ==========================================================
// CONNECT THE DOTS RENDERER
// ==========================================================

// ── RNG ────────────────────────────────────────────────────
function seededRng(seed) {
  let s = seed ^ 0xdeadbeef;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

// ── Shape library ──────────────────────────────────────────
// Each shape has dotPath(cx,cy,sz) returning ordered [[x,y],...] and draw(ctx,cx,cy,sz)

const CD_SHAPES = {
  bunny: {
    label: 'Зайка',
    dotPath(cx, cy, sz) {
      const pts = [];
      // body
      for (let a = Math.PI/2; a <= Math.PI*1.5; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.28, cy + sz*0.1 + Math.sin(a)*sz*0.32]);
      for (let a = -Math.PI/2; a <= Math.PI/2; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.28, cy + sz*0.1 + Math.sin(a)*sz*0.32]);
      // head
      for (let a = Math.PI/2; a <= Math.PI*2.5; a += Math.PI/5) pts.push([cx + Math.cos(a)*sz*0.2, cy - sz*0.24 + Math.sin(a)*sz*0.2]);
      // left ear
      pts.push([cx - sz*0.08, cy - sz*0.44], [cx - sz*0.12, cy - sz*0.74], [cx - sz*0.02, cy - sz*0.44]);
      // right ear
      pts.push([cx + sz*0.02, cy - sz*0.44], [cx + sz*0.12, cy - sz*0.74], [cx + sz*0.08, cy - sz*0.44]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#ffccee'; ctx.strokeStyle = '#cc6688'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.1, sz*0.28, sz*0.32, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.24, sz*0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffaacc';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.06, cy-sz*0.59, sz*0.06, sz*0.18, -0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.06, cy-sz*0.59, sz*0.06, sz*0.18, 0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.arc(cx-sz*0.07, cy-sz*0.26, sz*0.03, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.07, cy-sz*0.26, sz*0.03, 0, Math.PI*2); ctx.fill();
    }
  },
  cat: {
    label: 'Кошка',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let a = Math.PI/2; a <= Math.PI*2.5; a += Math.PI/5) pts.push([cx + Math.cos(a)*sz*0.22, cy - sz*0.22 + Math.sin(a)*sz*0.22]);
      // ears
      pts.push([cx - sz*0.22, cy - sz*0.44], [cx - sz*0.3, cy - sz*0.62], [cx - sz*0.08, cy - sz*0.44]);
      pts.push([cx + sz*0.08, cy - sz*0.44], [cx + sz*0.3, cy - sz*0.62], [cx + sz*0.22, cy - sz*0.44]);
      // body
      for (let a = Math.PI/2; a <= Math.PI*1.5; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.26, cy + sz*0.12 + Math.sin(a)*sz*0.34]);
      for (let a = -Math.PI/2; a <= Math.PI/2; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.26, cy + sz*0.12 + Math.sin(a)*sz*0.34]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#ffbb88'; ctx.strokeStyle = '#994422'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.12, sz*0.26, sz*0.34, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.22, sz*0.22, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-sz*0.22, cy-sz*0.44); ctx.lineTo(cx-sz*0.3, cy-sz*0.62); ctx.lineTo(cx-sz*0.08, cy-sz*0.44); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+sz*0.08, cy-sz*0.44); ctx.lineTo(cx+sz*0.3, cy-sz*0.62); ctx.lineTo(cx+sz*0.22, cy-sz*0.44); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.arc(cx-sz*0.08, cy-sz*0.24, sz*0.03, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.08, cy-sz*0.24, sz*0.03, 0, Math.PI*2); ctx.fill();
    }
  },
  house: {
    label: 'Домик',
    dotPath(cx, cy, sz) {
      return [
        [cx, cy - sz*0.5],        // roof peak
        [cx + sz*0.38, cy - sz*0.08], // roof right
        [cx + sz*0.38, cy + sz*0.45], // bottom right
        [cx + sz*0.14, cy + sz*0.45], // door right
        [cx + sz*0.14, cy + sz*0.22], // door top right
        [cx - sz*0.14, cy + sz*0.22], // door top left
        [cx - sz*0.14, cy + sz*0.45], // door left
        [cx - sz*0.38, cy + sz*0.45], // bottom left
        [cx - sz*0.38, cy - sz*0.08], // roof left
      ];
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#ffddaa'; ctx.strokeStyle = '#885522'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.rect(cx - sz*0.38, cy - sz*0.08, sz*0.76, sz*0.53); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ee6644';
      ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.5); ctx.lineTo(cx+sz*0.44, cy-sz*0.06); ctx.lineTo(cx-sz*0.44, cy-sz*0.06); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#8B6914';
      ctx.beginPath(); ctx.rect(cx-sz*0.14, cy+sz*0.22, sz*0.28, sz*0.23); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#88ccff';
      ctx.beginPath(); ctx.rect(cx-sz*0.3, cy-sz*0.05, sz*0.14, sz*0.14); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(cx+sz*0.16, cy-sz*0.05, sz*0.14, sz*0.14); ctx.fill(); ctx.stroke();
    }
  },
  star: {
    label: 'Звёздочка',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = i * Math.PI / 5 - Math.PI/2;
        const r = i % 2 === 0 ? sz*0.44 : sz*0.2;
        pts.push([cx + Math.cos(a)*r, cy + Math.sin(a)*r]);
      }
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#FFD700'; ctx.strokeStyle = '#cc8800'; ctx.lineWidth = sz*0.03;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = i * Math.PI / 5 - Math.PI/2;
        const r = i % 2 === 0 ? sz*0.44 : sz*0.2;
        if (i === 0) ctx.moveTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r);
        else ctx.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  },
  heart: {
    label: 'Сердечко',
    dotPath(cx, cy, sz) {
      const pts = [];
      // left arc
      for (let a = Math.PI; a >= 0; a -= Math.PI/5) pts.push([cx - sz*0.2 + Math.cos(a)*sz*0.22, cy - sz*0.16 + Math.sin(a)*sz*0.22]);
      // right arc
      for (let a = Math.PI; a <= Math.PI*2; a += Math.PI/5) pts.push([cx + sz*0.2 + Math.cos(a)*sz*0.22, cy - sz*0.16 + Math.sin(a)*sz*0.22]);
      // bottom point
      pts.push([cx, cy + sz*0.46]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#ff4466'; ctx.strokeStyle = '#cc0033'; ctx.lineWidth = sz*0.03;
      ctx.beginPath();
      ctx.moveTo(cx, cy + sz*0.46);
      ctx.bezierCurveTo(cx - sz*0.6, cy + sz*0.1, cx - sz*0.6, cy - sz*0.38, cx - sz*0.2, cy - sz*0.38);
      ctx.bezierCurveTo(cx, cy - sz*0.38, cx, cy - sz*0.18, cx, cy - sz*0.18);
      ctx.bezierCurveTo(cx, cy - sz*0.18, cx, cy - sz*0.38, cx + sz*0.2, cy - sz*0.38);
      ctx.bezierCurveTo(cx + sz*0.6, cy - sz*0.38, cx + sz*0.6, cy + sz*0.1, cx, cy + sz*0.46);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  },
  tree: {
    label: 'Ёлочка',
    dotPath(cx, cy, sz) {
      return [
        [cx, cy - sz*0.54],           // top
        [cx + sz*0.2, cy - sz*0.28],
        [cx + sz*0.36, cy - sz*0.08],
        [cx + sz*0.24, cy - sz*0.08],
        [cx + sz*0.46, cy + sz*0.2],
        [cx + sz*0.14, cy + sz*0.2],
        [cx + sz*0.14, cy + sz*0.5],  // trunk right
        [cx - sz*0.14, cy + sz*0.5],  // trunk left
        [cx - sz*0.14, cy + sz*0.2],
        [cx - sz*0.46, cy + sz*0.2],
        [cx - sz*0.24, cy - sz*0.08],
        [cx - sz*0.36, cy - sz*0.08],
        [cx - sz*0.2, cy - sz*0.28],
      ];
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#228b22'; ctx.strokeStyle = '#145214'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.54); ctx.lineTo(cx+sz*0.36, cy-sz*0.08); ctx.lineTo(cx-sz*0.36, cy-sz*0.08); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.3); ctx.lineTo(cx+sz*0.46, cy+sz*0.2); ctx.lineTo(cx-sz*0.46, cy+sz*0.2); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#8B4513';
      ctx.beginPath(); ctx.rect(cx-sz*0.1, cy+sz*0.2, sz*0.2, sz*0.3); ctx.fill(); ctx.stroke();
    }
  },
  car: {
    label: 'Машинка',
    dotPath(cx, cy, sz) {
      return [
        [cx - sz*0.44, cy + sz*0.1],   // body left bottom
        [cx - sz*0.44, cy - sz*0.08],  // body left top
        [cx - sz*0.22, cy - sz*0.08],  // roof base left
        [cx - sz*0.12, cy - sz*0.32],  // roof left
        [cx + sz*0.18, cy - sz*0.32],  // roof right
        [cx + sz*0.32, cy - sz*0.08],  // roof base right
        [cx + sz*0.44, cy - sz*0.08],  // body right top
        [cx + sz*0.44, cy + sz*0.1],   // body right bottom
        [cx + sz*0.3, cy + sz*0.1],    // before wheel right
        [cx + sz*0.2, cy + sz*0.26],   // wheel right bottom
        [cx + sz*0.1, cy + sz*0.1],    // after wheel right
        [cx - sz*0.1, cy + sz*0.1],    // before wheel left
        [cx - sz*0.2, cy + sz*0.26],   // wheel left bottom
        [cx - sz*0.3, cy + sz*0.1],    // after wheel left
      ];
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#ff4444'; ctx.strokeStyle = '#aa0000'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.rect(cx-sz*0.44, cy-sz*0.08, sz*0.88, sz*0.18); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-sz*0.22, cy-sz*0.08); ctx.lineTo(cx-sz*0.12, cy-sz*0.32); ctx.lineTo(cx+sz*0.18, cy-sz*0.32); ctx.lineTo(cx+sz*0.32, cy-sz*0.08); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#88ccff';
      ctx.beginPath(); ctx.rect(cx-sz*0.18, cy-sz*0.28, sz*0.14, sz*0.18); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(cx+sz*0.06, cy-sz*0.28, sz*0.14, sz*0.18); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#333'; ctx.strokeStyle = '#333';
      ctx.beginPath(); ctx.arc(cx-sz*0.22, cy+sz*0.14, sz*0.14, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+sz*0.22, cy+sz*0.14, sz*0.14, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#777';
      ctx.beginPath(); ctx.arc(cx-sz*0.22, cy+sz*0.14, sz*0.07, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.22, cy+sz*0.14, sz*0.07, 0, Math.PI*2); ctx.fill();
    }
  },
  rocket: {
    label: 'Ракета',
    dotPath(cx, cy, sz) {
      return [
        [cx, cy - sz*0.56],           // nose
        [cx + sz*0.18, cy - sz*0.2],  // body right start
        [cx + sz*0.18, cy + sz*0.22], // body right bottom
        [cx + sz*0.38, cy + sz*0.5],  // fin right
        [cx, cy + sz*0.32],           // bottom center
        [cx - sz*0.38, cy + sz*0.5],  // fin left
        [cx - sz*0.18, cy + sz*0.22], // body left bottom
        [cx - sz*0.18, cy - sz*0.2],  // body left start
      ];
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#cc3366'; ctx.strokeStyle = '#881144'; ctx.lineWidth = sz*0.03;
      ctx.beginPath();
      ctx.moveTo(cx, cy-sz*0.56);
      ctx.lineTo(cx+sz*0.18, cy-sz*0.2);
      ctx.lineTo(cx+sz*0.18, cy+sz*0.22);
      ctx.lineTo(cx-sz*0.18, cy+sz*0.22);
      ctx.lineTo(cx-sz*0.18, cy-sz*0.2);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff6644';
      ctx.beginPath(); ctx.moveTo(cx+sz*0.18, cy+sz*0.22); ctx.lineTo(cx+sz*0.38, cy+sz*0.5); ctx.lineTo(cx, cy+sz*0.32); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-sz*0.18, cy+sz*0.22); ctx.lineTo(cx-sz*0.38, cy+sz*0.5); ctx.lineTo(cx, cy+sz*0.32); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#88ccff'; ctx.strokeStyle = '#4488cc';
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.1, sz*0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  fish: {
    label: 'Рыбка',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let a = Math.PI/2; a <= Math.PI*1.5; a += Math.PI/6) pts.push([cx - sz*0.06 + Math.cos(a)*sz*0.38, cy + Math.sin(a)*sz*0.2]);
      pts.push([cx + sz*0.5, cy - sz*0.22], [cx + sz*0.32, cy], [cx + sz*0.5, cy + sz*0.22]);
      for (let a = -Math.PI/2; a <= Math.PI/2; a += Math.PI/6) pts.push([cx - sz*0.06 + Math.cos(a)*sz*0.38, cy + Math.sin(a)*sz*0.2]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#44aaff'; ctx.strokeStyle = '#1166cc'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.ellipse(cx-sz*0.06, cy, sz*0.38, sz*0.2, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#66bbff';
      ctx.beginPath(); ctx.moveTo(cx+sz*0.32, cy); ctx.lineTo(cx+sz*0.5, cy-sz*0.22); ctx.lineTo(cx+sz*0.5, cy+sz*0.22); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(cx-sz*0.28, cy-sz*0.06, sz*0.04, 0, Math.PI*2); ctx.fill();
    }
  },
  flower: {
    label: 'Цветочек',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3 - Math.PI/6;
        pts.push([cx + Math.cos(a)*sz*0.34, cy + Math.sin(a)*sz*0.34]);
        pts.push([cx + Math.cos(a + Math.PI/6)*sz*0.14, cy + Math.sin(a + Math.PI/6)*sz*0.14]);
      }
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#ff88cc'; ctx.strokeStyle = '#cc3366'; ctx.lineWidth = sz*0.03;
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        ctx.beginPath(); ctx.ellipse(cx + Math.cos(a)*sz*0.24, cy + Math.sin(a)*sz*0.24, sz*0.14, sz*0.22, a, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = '#FFD700'; ctx.strokeStyle = '#cc8800';
      ctx.beginPath(); ctx.arc(cx, cy, sz*0.16, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#44aa00'; ctx.strokeStyle = '#226600';
      ctx.lineWidth = sz*0.04;
      ctx.beginPath(); ctx.moveTo(cx, cy+sz*0.16); ctx.lineTo(cx, cy+sz*0.6); ctx.stroke();
    }
  },
  frog: {
    label: 'Лягушка',
    dotPath(cx, cy, sz) {
      const pts = [];
      // body
      for (let a = Math.PI/2; a <= Math.PI*2.5; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.32, cy + sz*0.06 + Math.sin(a)*sz*0.26]);
      // eye bulges
      pts.push([cx - sz*0.18, cy - sz*0.48], [cx - sz*0.26, cy - sz*0.42], [cx - sz*0.1, cy - sz*0.42]);
      pts.push([cx + sz*0.1, cy - sz*0.42], [cx + sz*0.26, cy - sz*0.42], [cx + sz*0.18, cy - sz*0.48]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#66cc44'; ctx.strokeStyle = '#337722'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.06, sz*0.32, sz*0.26, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx-sz*0.18, cy-sz*0.44, sz*0.1, sz*0.1, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.18, cy-sz*0.44, sz*0.1, sz*0.1, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(cx-sz*0.18, cy-sz*0.44, sz*0.05, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.18, cy-sz*0.44, sz*0.05, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#337722'; ctx.lineWidth = sz*0.025;
      ctx.beginPath(); ctx.arc(cx, cy+sz*0.06, sz*0.14, 0.2, Math.PI-0.2); ctx.stroke();
    }
  },
  duck: {
    label: 'Утёнок',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let a = Math.PI/2; a <= Math.PI*2.5; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.28, cy + sz*0.1 + Math.sin(a)*sz*0.26]);
      for (let a = Math.PI/2; a <= Math.PI*2.5; a += Math.PI/5) pts.push([cx + Math.cos(a)*sz*0.18, cy - sz*0.26 + Math.sin(a)*sz*0.18]);
      pts.push([cx + sz*0.18, cy - sz*0.24], [cx + sz*0.4, cy - sz*0.2], [cx + sz*0.18, cy - sz*0.16]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#FFD700'; ctx.strokeStyle = '#aa8800'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.1, sz*0.28, sz*0.26, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.26, sz*0.18, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff8800';
      ctx.beginPath(); ctx.moveTo(cx+sz*0.18, cy-sz*0.24); ctx.lineTo(cx+sz*0.4, cy-sz*0.2); ctx.lineTo(cx+sz*0.18, cy-sz*0.16); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(cx+sz*0.06, cy-sz*0.32, sz*0.035, 0, Math.PI*2); ctx.fill();
    }
  },
  elephant: {
    label: 'Слоник',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let a = Math.PI/2; a <= Math.PI*2.5; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.34, cy + sz*0.1 + Math.sin(a)*sz*0.3]);
      pts.push([cx-sz*0.06+Math.cos(-Math.PI/4)*sz*0.26, cy-sz*0.22+Math.sin(-Math.PI/4)*sz*0.26]);
      pts.push([cx + sz*0.28, cy - sz*0.4], [cx + sz*0.4, cy - sz*0.24]);
      pts.push([cx - sz*0.34, cy - sz*0.08], [cx - sz*0.44, cy + sz*0.14], [cx - sz*0.34, cy + sz*0.34]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#aabbcc'; ctx.strokeStyle = '#556677'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.1, sz*0.34, sz*0.3, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx-sz*0.06, cy-sz*0.22, sz*0.26, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ccddee';
      ctx.beginPath(); ctx.ellipse(cx+sz*0.32, cy-sz*0.32, sz*0.14, sz*0.2, 0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(cx+sz*0.06, cy-sz*0.28, sz*0.035, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#556677'; ctx.lineWidth = sz*0.05;
      ctx.beginPath(); ctx.moveTo(cx-sz*0.28, cy-sz*0.14); ctx.quadraticCurveTo(cx-sz*0.46, cy+sz*0.1, cx-sz*0.34, cy+sz*0.3); ctx.stroke();
    }
  },
  dog: {
    label: 'Собачка',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let a = Math.PI/2; a <= Math.PI*2.5; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.28, cy - sz*0.3 + Math.sin(a)*sz*0.26]);
      pts.push([cx - sz*0.22, cy - sz*0.56], [cx - sz*0.3, cy - sz*0.7], [cx - sz*0.1, cy - sz*0.54]);
      pts.push([cx + sz*0.1, cy - sz*0.54], [cx + sz*0.3, cy - sz*0.7], [cx + sz*0.22, cy - sz*0.56]);
      for (let a = Math.PI/2; a <= Math.PI*2.5; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.28, cy + sz*0.14 + Math.sin(a)*sz*0.32]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#d4a060'; ctx.strokeStyle = '#884422'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.14, sz*0.28, sz*0.32, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.3, sz*0.26, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#c49050';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.2, cy-sz*0.56, sz*0.1, sz*0.16, 0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.2, cy-sz*0.56, sz*0.1, sz*0.16, -0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.arc(cx-sz*0.1, cy-sz*0.34, sz*0.035, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.1, cy-sz*0.34, sz*0.035, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#222';
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.22, sz*0.055, 0, Math.PI*2); ctx.fill();
    }
  },
  bear: {
    label: 'Мишка',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let a = Math.PI/2; a <= Math.PI*2.5; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.28, cy - sz*0.28 + Math.sin(a)*sz*0.26]);
      pts.push([cx-sz*0.23, cy-sz*0.54-sz*0.12], [cx-sz*0.23, cy-sz*0.54+sz*0.12]);
      pts.push([cx+sz*0.23, cy-sz*0.54-sz*0.12], [cx+sz*0.23, cy-sz*0.54+sz*0.12]);
      for (let a = Math.PI/2; a <= Math.PI*2.5; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.3, cy + sz*0.12 + Math.sin(a)*sz*0.34]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#8B6040'; ctx.strokeStyle = '#4a2a0a'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.12, sz*0.3, sz*0.34, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.28, sz*0.26, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx-sz*0.23, cy-sz*0.54, sz*0.12, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+sz*0.23, cy-sz*0.54, sz*0.12, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#c49060';
      ctx.beginPath(); ctx.ellipse(cx, cy-sz*0.18, sz*0.12, sz*0.09, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.arc(cx-sz*0.09, cy-sz*0.3, sz*0.035, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.09, cy-sz*0.3, sz*0.035, 0, Math.PI*2); ctx.fill();
    }
  },
  owl: {
    label: 'Совёнок',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let a = Math.PI/2; a <= Math.PI*2.5; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.26, cy + sz*0.12 + Math.sin(a)*sz*0.36]);
      for (let a = Math.PI/2; a <= Math.PI*2.5; a += Math.PI/5) pts.push([cx + Math.cos(a)*sz*0.24, cy - sz*0.22 + Math.sin(a)*sz*0.24]);
      pts.push([cx-sz*0.16, cy-sz*0.46], [cx-sz*0.26, cy-sz*0.62], [cx-sz*0.06, cy-sz*0.46]);
      pts.push([cx+sz*0.06, cy-sz*0.46], [cx+sz*0.26, cy-sz*0.62], [cx+sz*0.16, cy-sz*0.46]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#8B6914'; ctx.strokeStyle = '#4a3800'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.12, sz*0.26, sz*0.36, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.22, sz*0.24, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#c8a040';
      ctx.beginPath(); ctx.moveTo(cx-sz*0.16, cy-sz*0.46); ctx.lineTo(cx-sz*0.26, cy-sz*0.62); ctx.lineTo(cx-sz*0.06, cy-sz*0.46); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+sz*0.06, cy-sz*0.46); ctx.lineTo(cx+sz*0.26, cy-sz*0.62); ctx.lineTo(cx+sz*0.16, cy-sz*0.46); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.lineWidth = sz*0.02;
      ctx.beginPath(); ctx.arc(cx-sz*0.1, cy-sz*0.22, sz*0.09, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+sz*0.1, cy-sz*0.22, sz*0.09, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(cx-sz*0.1, cy-sz*0.22, sz*0.05, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.1, cy-sz*0.22, sz*0.05, 0, Math.PI*2); ctx.fill();
    }
  },
  butterfly: {
    label: 'Бабочка',
    dotPath(cx, cy, sz) {
      const pts = [];
      // top wings
      for (let a = 0; a <= Math.PI; a += Math.PI/6) pts.push([cx - sz*0.06 + Math.cos(Math.PI - a)*sz*0.36, cy - sz*0.14 + Math.sin(Math.PI - a)*sz*0.3]);
      for (let a = 0; a <= Math.PI; a += Math.PI/6) pts.push([cx + sz*0.06 + Math.cos(a)*sz*0.36, cy - sz*0.14 + Math.sin(a)*sz*0.3]);
      // bottom wings
      for (let a = 0; a <= Math.PI; a += Math.PI/6) pts.push([cx - sz*0.04 + Math.cos(Math.PI - a)*sz*0.24, cy + sz*0.14 + Math.sin(Math.PI - a)*sz*0.22]);
      for (let a = 0; a <= Math.PI; a += Math.PI/6) pts.push([cx + sz*0.04 + Math.cos(a)*sz*0.24, cy + sz*0.14 + Math.sin(a)*sz*0.22]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#ff8844'; ctx.strokeStyle = '#aa4400'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.ellipse(cx-sz*0.28, cy-sz*0.14, sz*0.3, sz*0.22, 0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.28, cy-sz*0.14, sz*0.3, sz*0.22, -0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffbb44';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.2, cy+sz*0.16, sz*0.2, sz*0.16, 0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.2, cy+sz*0.16, sz*0.2, sz*0.16, -0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#333'; ctx.lineWidth = sz*0.025;
      ctx.beginPath(); ctx.ellipse(cx, cy, sz*0.04, sz*0.38, 0, 0, Math.PI*2); ctx.fill();
    }
  },
  mushroom: {
    label: 'Грибочек',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let a = Math.PI; a <= Math.PI*2; a += Math.PI/8) pts.push([cx + Math.cos(a)*sz*0.38, cy - sz*0.06 + Math.sin(a)*sz*0.36]);
      pts.push([cx + sz*0.38, cy + sz*0.06], [cx + sz*0.22, cy + sz*0.06]);
      for (let a = -Math.PI/2; a <= Math.PI/2; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.22, cy + sz*0.4 + Math.sin(a)*sz*0.24]);
      for (let a = Math.PI/2; a <= Math.PI*1.5; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.22, cy + sz*0.4 + Math.sin(a)*sz*0.24]);
      pts.push([cx - sz*0.22, cy + sz*0.06], [cx - sz*0.38, cy + sz*0.06]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#f0ece0'; ctx.strokeStyle = '#664400'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.38, sz*0.22, sz*0.24, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ee2200';
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.06, sz*0.38, Math.PI, 0); ctx.lineTo(cx+sz*0.38, cy+sz*0.06); ctx.bezierCurveTo(cx+sz*0.38, cy+sz*0.16, cx-sz*0.38, cy+sz*0.16, cx-sz*0.38, cy+sz*0.06); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.lineWidth = sz*0.02;
      ctx.beginPath(); ctx.arc(cx-sz*0.14, cy-sz*0.2, sz*0.08, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+sz*0.18, cy-sz*0.08, sz*0.07, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  snowman: {
    label: 'Снеговик',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let a = 0; a < Math.PI*2; a += Math.PI/5) pts.push([cx + Math.cos(a)*sz*0.16, cy - sz*0.4 + Math.sin(a)*sz*0.16]);
      for (let a = 0; a < Math.PI*2; a += Math.PI/5) pts.push([cx + Math.cos(a)*sz*0.22, cy - sz*0.08 + Math.sin(a)*sz*0.22]);
      for (let a = 0; a < Math.PI*2; a += Math.PI/5) pts.push([cx + Math.cos(a)*sz*0.3, cy + sz*0.3 + Math.sin(a)*sz*0.3]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#f0f8ff'; ctx.strokeStyle = '#88aacc'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.arc(cx, cy+sz*0.3, sz*0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.08, sz*0.22, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.4, sz*0.16, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.arc(cx-sz*0.06, cy-sz*0.42, sz*0.025, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.06, cy-sz*0.42, sz*0.025, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ff6600';
      ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.38); ctx.lineTo(cx+sz*0.1, cy-sz*0.38); ctx.lineTo(cx, cy-sz*0.34); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#222';
      ctx.beginPath(); ctx.rect(cx-sz*0.16, cy-sz*0.56, sz*0.32, sz*0.18); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx, cy-sz*0.58, sz*0.2, sz*0.05, 0, 0, Math.PI*2); ctx.fill();
    }
  },
  penguin: {
    label: 'Пингвин',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let a = Math.PI/2; a <= Math.PI*2.5; a += Math.PI/6) pts.push([cx + Math.cos(a)*sz*0.26, cy + sz*0.1 + Math.sin(a)*sz*0.38]);
      for (let a = Math.PI/2; a <= Math.PI*2.5; a += Math.PI/5) pts.push([cx + Math.cos(a)*sz*0.18, cy - sz*0.28 + Math.sin(a)*sz*0.18]);
      pts.push([cx+sz*0.26, cy-sz*0.08], [cx+sz*0.4, cy+sz*0.1], [cx+sz*0.26, cy+sz*0.28]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#222'; ctx.strokeStyle = '#111'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.1, sz*0.26, sz*0.38, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f0f0ee';
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.12, sz*0.14, sz*0.28, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#222';
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.28, sz*0.18, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx-sz*0.06, cy-sz*0.28, sz*0.09, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.06, cy-sz*0.28, sz*0.09, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(cx-sz*0.05, cy-sz*0.28, sz*0.04, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.07, cy-sz*0.28, sz*0.04, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ff8800';
      ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.2); ctx.lineTo(cx-sz*0.06, cy-sz*0.14); ctx.lineTo(cx+sz*0.06, cy-sz*0.14); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#222'; ctx.strokeStyle = '#111';
      ctx.beginPath(); ctx.ellipse(cx+sz*0.34, cy+sz*0.1, sz*0.1, sz*0.26, 0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx-sz*0.34, cy+sz*0.1, sz*0.1, sz*0.26, -0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  sun: {
    label: 'Солнышко',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        pts.push([cx + Math.cos(a)*sz*0.26, cy + Math.sin(a)*sz*0.26]);
        pts.push([cx + Math.cos(a + Math.PI/8)*sz*0.44, cy + Math.sin(a + Math.PI/8)*sz*0.44]);
      }
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#FFD700'; ctx.strokeStyle = '#cc8800'; ctx.lineWidth = sz*0.03;
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(a - 0.2)*sz*0.24, cy + Math.sin(a - 0.2)*sz*0.24);
        ctx.lineTo(cx + Math.cos(a)*sz*0.52, cy + Math.sin(a)*sz*0.52);
        ctx.lineTo(cx + Math.cos(a + 0.2)*sz*0.24, cy + Math.sin(a + 0.2)*sz*0.24);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = '#FFE44d'; ctx.strokeStyle = '#cc8800';
      ctx.beginPath(); ctx.arc(cx, cy, sz*0.26, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.arc(cx-sz*0.09, cy-sz*0.06, sz*0.04, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.09, cy-sz*0.06, sz*0.04, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#333'; ctx.lineWidth = sz*0.025;
      ctx.beginPath(); ctx.arc(cx, cy+sz*0.04, sz*0.08, 0.1, Math.PI-0.1); ctx.stroke();
    }
  },
  robot: {
    label: 'Робот',
    dotPath(cx, cy, sz) {
      return [
        [cx - sz*0.28, cy - sz*0.54], [cx + sz*0.28, cy - sz*0.54], // head top
        [cx + sz*0.28, cy - sz*0.2],  [cx - sz*0.28, cy - sz*0.2],  // head bottom
        [cx - sz*0.34, cy - sz*0.06], [cx + sz*0.34, cy - sz*0.06], // body top
        [cx + sz*0.34, cy + sz*0.36], [cx - sz*0.34, cy + sz*0.36], // body bottom
        [cx - sz*0.22, cy + sz*0.5],  [cx + sz*0.22, cy + sz*0.5],  // legs bottom
        [cx, cy - sz*0.54], [cx, cy - sz*0.7],                      // antenna
      ];
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#88aacc'; ctx.strokeStyle = '#446688'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.28, cy-sz*0.54, sz*0.56, sz*0.34, sz*0.04); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#aaccee';
      ctx.beginPath(); ctx.roundRect(cx-sz*0.34, cy-sz*0.06, sz*0.68, sz*0.42, sz*0.04); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.lineWidth = sz*0.02;
      ctx.beginPath(); ctx.arc(cx-sz*0.12, cy-sz*0.38, sz*0.09, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+sz*0.12, cy-sz*0.38, sz*0.09, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#2244aa';
      ctx.beginPath(); ctx.arc(cx-sz*0.12, cy-sz*0.38, sz*0.05, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.12, cy-sz*0.38, sz*0.05, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ff4400'; ctx.strokeStyle = '#aa2200'; ctx.lineWidth = sz*0.025;
      ctx.beginPath(); ctx.rect(cx-sz*0.12, cy-sz*0.28, sz*0.24, sz*0.05); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#446688'; ctx.lineWidth = sz*0.03;
      ctx.fillStyle = '#88aacc';
      ctx.beginPath(); ctx.rect(cx-sz*0.22, cy+sz*0.36, sz*0.18, sz*0.14); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(cx+sz*0.04, cy+sz*0.36, sz*0.18, sz*0.14); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#888'; ctx.lineWidth = sz*0.025;
      ctx.beginPath(); ctx.moveTo(cx, cy-sz*0.54); ctx.lineTo(cx, cy-sz*0.7); ctx.stroke();
      ctx.fillStyle = '#FFD700'; ctx.strokeStyle = '#cc8800'; ctx.lineWidth = sz*0.02;
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.7, sz*0.04, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  balloon: {
    label: 'Шарик',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let a = 0; a < Math.PI*2; a += Math.PI/7) pts.push([cx + Math.cos(a)*sz*0.34, cy - sz*0.12 + Math.sin(a)*sz*0.42]);
      pts.push([cx, cy + sz*0.3], [cx, cy + sz*0.6]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#ff4444'; ctx.strokeStyle = '#aa0000'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.ellipse(cx, cy-sz*0.12, sz*0.34, sz*0.42, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath(); ctx.ellipse(cx-sz*0.1, cy-sz*0.3, sz*0.09, sz*0.14, -0.4, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#886600'; ctx.lineWidth = sz*0.02;
      ctx.beginPath(); ctx.moveTo(cx, cy+sz*0.3); ctx.quadraticCurveTo(cx+sz*0.1, cy+sz*0.48, cx+sz*0.04, cy+sz*0.6); ctx.stroke();
    }
  },
  turtle: {
    label: 'Черепаха',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let a = 0; a < Math.PI*2; a += Math.PI/8) pts.push([cx + Math.cos(a)*sz*0.36, cy + Math.sin(a)*sz*0.26]);
      pts.push([cx+sz*0.36, cy-sz*0.1], [cx+sz*0.5, cy-sz*0.22], [cx+sz*0.56, cy]);
      pts.push([cx-sz*0.56, cy], [cx-sz*0.5, cy+sz*0.22], [cx-sz*0.36, cy+sz*0.1]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#44aa44'; ctx.strokeStyle = '#226622'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.ellipse(cx, cy, sz*0.36, sz*0.26, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#338833';
      for (let i = 0; i < 5; i++) {
        const a = i * Math.PI*2/5, r = sz*0.15;
        ctx.beginPath(); ctx.arc(cx + Math.cos(a)*r, cy + Math.sin(a)*r*0.72, sz*0.1, 0, Math.PI*2); ctx.fill();
      }
      ctx.strokeStyle = '#226622';
      ctx.beginPath(); ctx.arc(cx, cy, sz*0.16, 0, Math.PI*2); ctx.stroke();
      ctx.fillStyle = '#66aa44';
      ctx.beginPath(); ctx.ellipse(cx+sz*0.48, cy-sz*0.1, sz*0.12, sz*0.08, -0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx-sz*0.48, cy+sz*0.08, sz*0.12, sz*0.08, 0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx+sz*0.36, cy+sz*0.24, sz*0.1, sz*0.07, 0.6, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx-sz*0.36, cy-sz*0.22, sz*0.1, sz*0.07, -0.6, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#558833';
      ctx.beginPath(); ctx.ellipse(cx+sz*0.52, cy-sz*0.22, sz*0.1, sz*0.07, 0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#333'; ctx.lineWidth = sz*0.02;
      ctx.beginPath(); ctx.arc(cx+sz*0.54, cy-sz*0.26, sz*0.025, 0, Math.PI*2); ctx.fill();
    }
  },
  hedgehog: {
    label: 'Ёжик',
    dotPath(cx, cy, sz) {
      const pts = [];
      for (let a = Math.PI/6; a < Math.PI; a += Math.PI/8) {
        pts.push([cx + Math.cos(a)*sz*0.38, cy + Math.sin(a)*sz*0.28]);
        pts.push([cx + Math.cos(a + Math.PI/16)*sz*0.52, cy + Math.sin(a + Math.PI/16)*sz*0.4]);
      }
      for (let a = Math.PI; a <= Math.PI*1.8; a += Math.PI/8) pts.push([cx + Math.cos(a)*sz*0.34, cy + Math.sin(a)*sz*0.24]);
      for (let a = -Math.PI/2; a <= Math.PI/6; a += Math.PI/8) pts.push([cx + Math.cos(a)*sz*0.28, cy - sz*0.06 + Math.sin(a)*sz*0.22]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#888866'; ctx.strokeStyle = '#444422'; ctx.lineWidth = sz*0.025;
      for (let a = Math.PI/6; a < Math.PI; a += Math.PI/10) {
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(a)*sz*0.36, cy + Math.sin(a)*sz*0.26); ctx.lineTo(cx + Math.cos(a)*sz*0.54, cy + Math.sin(a)*sz*0.42); ctx.stroke();
      }
      ctx.fillStyle = '#cc9944'; ctx.strokeStyle = '#885522'; ctx.lineWidth = sz*0.03;
      ctx.beginPath();
      ctx.arc(cx, cy, sz*0.36, Math.PI*0.1, Math.PI*1.9); ctx.lineTo(cx + sz*0.36, cy);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx+sz*0.26, cy-sz*0.06, sz*0.22, sz*0.2, -0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(cx+sz*0.38, cy-sz*0.18, sz*0.035, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.arc(cx+sz*0.44, cy-sz*0.06, sz*0.04, 0, Math.PI*2); ctx.fill();
    }
  },
  sprunkiOrange: {
    label: 'Орен (Спрунки)', svgKey: 'OrenNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      pts.push([cx+hr+sz*0.04, hy]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      pts.push([cx-hr-sz*0.04, hy]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      const { drawSprunki: _ } = { drawSprunki: null };
      ctx.fillStyle = '#ff7700'; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21, cy+sz*0.24-sz*0.36, sz*0.42, sz*0.72, sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.12, sz*0.27, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#ff5500'; ctx.lineWidth = sz*0.04;
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.14, sz*0.24 + sz*0.04, Math.PI*1.08, Math.PI*1.92); ctx.stroke();
      ctx.fillStyle = '#ff5500'; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = sz*0.025;
      ctx.beginPath(); ctx.arc(cx - sz*0.24 - sz*0.04, cy-sz*0.14, sz*0.055, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + sz*0.24 + sz*0.04, cy-sz*0.14, sz*0.055, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111'; ctx.lineWidth = 0;
      ctx.beginPath(); ctx.arc(cx-sz*0.09, cy-sz*0.165, sz*0.024, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.09, cy-sz*0.165, sz*0.024, 0, Math.PI*2); ctx.fill();
    }
  },
  sprunkiRed: {
    label: 'Рэдди (Спрунки)', svgKey: 'RaddyNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      const n=4;
      for (let i=0;i<n;i++){const a=-Math.PI/2+(i-(n-1)/2)*(Math.PI*0.65/Math.max(n-1,1));pts.push([cx+Math.cos(a)*(hr+sz*0.21),hy+Math.sin(a)*(hr+sz*0.21)]);}
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#cc1111'; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21, cy+sz*0.24-sz*0.36, sz*0.42, sz*0.72, sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.12, sz*0.27, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      const hr=sz*0.27, hy=cy-sz*0.12, n=4;
      for (let i=0; i<n; i++) {
        const a=-Math.PI/2+(i-(n-1)/2)*(Math.PI*0.65/Math.max(n-1,1));
        const bx2=cx+Math.cos(a)*hr*0.88, by2=hy+Math.sin(a)*hr*0.88;
        const tx=cx+Math.cos(a)*(hr+sz*0.21), ty=hy+Math.sin(a)*(hr+sz*0.21);
        const perp=a+Math.PI/2;
        ctx.beginPath(); ctx.moveTo(bx2+Math.cos(perp)*sz*0.055, by2+Math.sin(perp)*sz*0.055); ctx.lineTo(tx,ty); ctx.lineTo(bx2-Math.cos(perp)*sz*0.055, by2-Math.sin(perp)*sz*0.055); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = '#111'; ctx.lineWidth = 0;
      ctx.beginPath(); ctx.arc(cx-sz*0.09, cy-sz*0.165, sz*0.024, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.09, cy-sz*0.165, sz*0.024, 0, Math.PI*2); ctx.fill();
    }
  },
  sprunkiSilver: {
    label: 'Кликр (Спрунки)', svgKey: 'ClukrNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.14, bh=sz*0.36, by=cy+sz*0.24;
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#aaaaaa'; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.14, cy+sz*0.24-sz*0.36, sz*0.28, sz*0.72, sz*0.1); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.12, sz*0.27, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111'; ctx.lineWidth = 0;
      ctx.beginPath(); ctx.arc(cx-sz*0.09, cy-sz*0.165, sz*0.024, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.09, cy-sz*0.165, sz*0.024, 0, Math.PI*2); ctx.fill();
    }
  },
  sprunkiGreen: {
    label: 'Винерия (Спрунки)', svgKey: 'VineriaNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#228b22'; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21, cy+sz*0.24-sz*0.36, sz*0.42, sz*0.72, sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.12, sz*0.27, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      const hr=sz*0.27, hy=cy-sz*0.12, n=4;
      for (let i=0; i<n; i++) {
        const ang=-Math.PI/2+(i-(n-1)/2)*(Math.PI*0.55/Math.max(n-1,1));
        const fx=cx+Math.cos(ang)*hr*0.65, fy=hy+Math.sin(ang)*hr*0.65-hr*0.88;
        ctx.fillStyle='#ff69b4';
        for (let p=0;p<5;p++){const pa=p*Math.PI*2/5;ctx.beginPath();ctx.arc(fx+Math.cos(pa)*sz*0.05,fy+Math.sin(pa)*sz*0.05,sz*0.04,0,Math.PI*2);ctx.fill();}
        ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(fx,fy,sz*0.033,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle = '#111'; ctx.lineWidth = 0;
      ctx.beginPath(); ctx.arc(cx-sz*0.09, cy-sz*0.165, sz*0.024, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.09, cy-sz*0.165, sz*0.024, 0, Math.PI*2); ctx.fill();
    }
  },
  sprunkiPurple: {
    label: 'Дурпл (Спрунки)', svgKey: 'DurpleNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      pts.push([cx+hr*0.8, hy-hr*1.38], [cx+hr*0.42, hy-hr*0.68]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      pts.push([cx-hr*0.42, hy-hr*0.68], [cx-hr*0.8, hy-hr*1.38]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#8822cc'; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21, cy+sz*0.24-sz*0.36, sz*0.42, sz*0.72, sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.12, sz*0.27, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      const hr=sz*0.27, hy=cy-sz*0.12;
      ctx.beginPath(); ctx.moveTo(cx+hr*0.42, hy-hr*0.68); ctx.lineTo(cx+hr*0.8, hy-hr*1.38); ctx.lineTo(cx+hr*0.1, hy-hr*0.9); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#2a2a00'; ctx.lineWidth = 0;
      ctx.beginPath(); ctx.ellipse(cx-hr*0.32, hy-hr*0.05, hr*0.08, hr*0.18, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+hr*0.32, hy-hr*0.05, hr*0.08, hr*0.18, 0, 0, Math.PI*2); ctx.fill();
    }
  },
  sprunkiPinki: {
    label: 'Пинки (Спрунки)', svgKey: 'PinkiNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      pts.push([cx+hr*0.28, hy-hr*2.0], [cx+hr*0.28, hy-hr*1.1], [cx-hr*0.28, hy-hr*1.1], [cx-hr*0.28, hy-hr*2.0]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#ff88bb'; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21, cy+sz*0.24-sz*0.36, sz*0.42, sz*0.72, sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.12, sz*0.27, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      const hr=sz*0.27, hy=cy-sz*0.12;
      ctx.fillStyle='#ffaad4';
      ctx.beginPath(); ctx.ellipse(cx-hr*0.28, hy-hr*1.55, hr*0.14, hr*0.46, -0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx+hr*0.28, hy-hr*1.55, hr*0.14, hr*0.46, 0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111'; ctx.lineWidth = 0;
      ctx.beginPath(); ctx.arc(cx-sz*0.09, cy-sz*0.165, sz*0.024, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.09, cy-sz*0.165, sz*0.024, 0, Math.PI*2); ctx.fill();
    }
  },
  sprunkiFunBot: {
    label: 'ФанБот (Спрунки)', svgKey: 'FunbotNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      pts.push([cx, hy-hr-sz*0.3]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle='#777'; ctx.strokeStyle='#333'; ctx.lineWidth=sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21,cy+sz*0.24-sz*0.36,sz*0.42,sz*0.72,sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.12,sz*0.27,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  sprunkiGray: {
    label: 'Грэй (Спрунки)', svgKey: 'GrayNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle='#888'; ctx.strokeStyle='#333'; ctx.lineWidth=sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21,cy+sz*0.24-sz*0.36,sz*0.42,sz*0.72,sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.12,sz*0.27,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  sprunkiBrown: {
    label: 'Бруд (Спрунки)', svgKey: 'BrudNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle='#7b4a1e'; ctx.strokeStyle='#333'; ctx.lineWidth=sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21,cy+sz*0.24-sz*0.36,sz*0.42,sz*0.72,sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.12,sz*0.27,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  sprunkiGold: {
    label: 'Гарнольд (Спрунки)', svgKey: 'GarnoldNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle='#c8960a'; ctx.strokeStyle='#333'; ctx.lineWidth=sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21,cy+sz*0.24-sz*0.36,sz*0.42,sz*0.72,sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.12,sz*0.27,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  sprunkiLime: {
    label: 'Облакс (Спрунки)', svgKey: 'OwakcxNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle='#88dd00'; ctx.strokeStyle='#333'; ctx.lineWidth=sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21,cy+sz*0.24-sz*0.36,sz*0.42,sz*0.72,sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.12,sz*0.27,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  sprunkiSky: {
    label: 'Скай (Спрунки)', svgKey: 'SkyNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle='#44ccff'; ctx.strokeStyle='#333'; ctx.lineWidth=sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21,cy+sz*0.24-sz*0.36,sz*0.42,sz*0.72,sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.12,sz*0.27,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  sprunkiMrTree: {
    label: 'МрДерево (Спрунки)', svgKey: 'MrTreeNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*(hr+sz*0.15), hy-sz*0.15+Math.sin(a)*(hr+sz*0.15)]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle='#1a5c1a'; ctx.strokeStyle='#333'; ctx.lineWidth=sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21,cy+sz*0.24-sz*0.36,sz*0.42,sz*0.72,sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.12,sz*0.27,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  sprunkiYellow: {
    label: 'Саймон (Спрунки)', svgKey: 'SimonNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      pts.push([cx+hr*1.24+hr*0.42, hy]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle='#ffdd00'; ctx.strokeStyle='#333'; ctx.lineWidth=sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21,cy+sz*0.24-sz*0.36,sz*0.42,sz*0.72,sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.12,sz*0.27,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  sprunkiTan: {
    label: 'Танер (Спрунки)', svgKey: 'TunnerNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle='#c8a06a'; ctx.strokeStyle='#333'; ctx.lineWidth=sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21,cy+sz*0.24-sz*0.36,sz*0.42,sz*0.72,sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.12,sz*0.27,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  sprunkiWenda: {
    label: 'Венда (Спрунки)', svgKey: 'WendaNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle='#f0f0f0'; ctx.strokeStyle='#333'; ctx.lineWidth=sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21,cy+sz*0.24-sz*0.36,sz*0.42,sz*0.72,sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.12,sz*0.27,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  sprunkiJevin: {
    label: 'Джевин (Спрунки)', svgKey: 'JevinNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.33, bh=sz*0.33, by=cy+sz*0.24;
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle='#1144cc'; ctx.strokeStyle='#333'; ctx.lineWidth=sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.33,cy+sz*0.24-sz*0.33,sz*0.66,sz*0.66,sz*0.15); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.12,sz*0.27,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  sprunkiMrSun: {
    label: 'МрСан (Спрунки)', svgKey: 'MrSunNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/6) pts.push([cx+Math.cos(a)*(hr+sz*0.12), hy+Math.sin(a)*(hr+sz*0.12)]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle='#ffcc00'; ctx.strokeStyle='#333'; ctx.lineWidth=sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21,cy+sz*0.24-sz*0.36,sz*0.42,sz*0.72,sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.12,sz*0.27,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  sprunkiMrFunComp: {
    label: 'МрКомп (Спрунки)', svgKey: 'MrFunComputerNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle='#4488cc'; ctx.strokeStyle='#333'; ctx.lineWidth=sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21,cy+sz*0.24-sz*0.36,sz*0.42,sz*0.72,sz*0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy-sz*0.12,sz*0.27,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
  },
  sprunkiBlack: {
    label: 'Блэк (Спрунки)', svgKey: 'BlackNormal',
    dotPath(cx, cy, sz) {
      const pts = [], hr=sz*0.27, hy=cy-sz*0.12, bw=sz*0.21, bh=sz*0.36, by=cy+sz*0.24;
      pts.push([cx-hr*0.64, hy-hr], [cx-hr*0.64, hy-hr-sz*0.28], [cx+hr*0.64, hy-hr-sz*0.28], [cx+hr*0.64, hy-hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*hr, hy+Math.sin(a)*hr]);
      for (let a=-Math.PI/2; a<Math.PI*1.5; a+=Math.PI/7) pts.push([cx+Math.cos(a)*bw, by+Math.sin(a)*bh]);
      return pts;
    },
    draw(ctx, cx, cy, sz) {
      ctx.fillStyle = '#111111'; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.roundRect(cx-sz*0.21, cy+sz*0.24-sz*0.36, sz*0.42, sz*0.72, sz*0.12); ctx.fill(); ctx.stroke();
      // white shirt
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#ccc'; ctx.lineWidth = sz*0.015;
      ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.16, sz*0.27*0.5, sz*0.32*0.55, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#222222'; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = sz*0.03;
      ctx.beginPath(); ctx.arc(cx, cy-sz*0.12, sz*0.27, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      const hr=sz*0.27, hy=cy-sz*0.12;
      ctx.fillStyle='#111111';
      ctx.beginPath(); ctx.ellipse(cx, hy-hr, hr*1.18, hr*0.2, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillRect(cx-hr*0.64, hy-hr-sz*0.28, hr*1.28, sz*0.28);
      ctx.strokeRect(cx-hr*0.64, hy-hr-sz*0.28, hr*1.28, sz*0.28);
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(cx, hy-hr-sz*0.005, hr*1.05, hr*0.18, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#aaa'; ctx.lineWidth = 0;
      ctx.beginPath(); ctx.arc(cx-sz*0.09, cy-sz*0.165, sz*0.024, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+sz*0.09, cy-sz*0.165, sz*0.024, 0, Math.PI*2); ctx.fill();
    }
  },
};

// ── Grid layout helpers ─────────────────────────────────────
function getCells(config, canvasW, canvasH) {
  const spp = config.shapesPerPage || 2;
  const headerH = 60;
  const margin = 20;
  const usableW = canvasW - margin * 2;
  const usableH = canvasH - headerH - margin * 2;

  if (spp === 1) {
    return [{ x: margin + usableW*0.1, y: headerH + margin, w: usableW*0.8, h: usableH }];
  } else if (spp === 2) {
    const cellH = (usableH - 16) / 2;
    return [
      { x: margin, y: headerH + margin, w: usableW, h: cellH },
      { x: margin, y: headerH + margin + cellH + 16, w: usableW, h: cellH },
    ];
  } else {
    // 4: 2x2
    const cellW = (usableW - 16) / 2;
    const cellH = (usableH - 16) / 2;
    return [
      { x: margin, y: headerH + margin, w: cellW, h: cellH },
      { x: margin + cellW + 16, y: headerH + margin, w: cellW, h: cellH },
      { x: margin, y: headerH + margin + cellH + 16, w: cellW, h: cellH },
      { x: margin + cellW + 16, y: headerH + margin + cellH + 16, w: cellW, h: cellH },
    ];
  }
}

// ── Draw numbered dots ──────────────────────────────────────
function drawNumberedDots(ctx, pts, n, accentColor, canvasScale) {
  const dotR = Math.max(9, 11 * canvasScale);
  const fontSize = Math.max(10, 12 * canvasScale);

  for (let i = 0; i < pts.length; i++) {
    const [x, y] = pts[i];
    ctx.beginPath();
    ctx.arc(x, y, dotR, 0, Math.PI*2);
    ctx.fillStyle = accentColor;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = dotR * 0.3;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), x, y);
  }
}

// ── Draw faint outline ──────────────────────────────────────
function drawFaintOutline(ctx, pts) {
  if (pts.length < 2) return;
  ctx.save();
  ctx.setLineDash([6, 8]);
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

// ── Render one shape cell ───────────────────────────────────
function renderDotCell(ctx, cell, shapeDef, config, showFaintOutline, canvasScale) {
  const { x, y, w, h } = cell;
  const labelH = Math.max(24, 28 * canvasScale);
  const drawH = h - labelH;
  const cx = x + w / 2;
  const cy = y + drawH * 0.5;
  const sz = Math.min(w, drawH) * 0.38;

  ctx.fillStyle = '#f9f9f9';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  const rawPts = shapeDef.dotPath(cx, cy, sz);
  const n = Math.min(rawPts.length, config.dotsCount || 12);
  const step = rawPts.length > n ? rawPts.length / n : 1;
  const pts = [];
  for (let i = 0; i < n; i++) pts.push(rawPts[Math.min(Math.round(i * step), rawPts.length - 1)]);

  if (showFaintOutline) {
    const svgImg = shapeDef.svgKey ? (config.sprunkiImages || {})[shapeDef.svgKey] : null;
    if (svgImg && svgImg.complete && svgImg.naturalWidth > 0) {
      const ar = svgImg.naturalWidth / svgImg.naturalHeight;
      let ih = drawH * 0.72; let iw = ih * ar;
      if (iw > w * 0.85) { iw = w * 0.85; ih = iw / ar; }
      ctx.save();
      ctx.globalAlpha = 0.13;
      ctx.drawImage(svgImg, cx - iw / 2, cy - ih / 2, iw, ih);
      ctx.globalAlpha = 1;
      ctx.restore();
    } else {
      drawFaintOutline(ctx, pts);
    }
  }
  drawNumberedDots(ctx, pts, n, config.accentColor || '#e91e63', canvasScale);

  // Label
  ctx.fillStyle = '#555';
  ctx.font = `bold ${Math.max(12, 14 * canvasScale)}px "Nunito", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Кто это?', cx, y + drawH + labelH / 2);
}

// ── Page header ─────────────────────────────────────────────
function drawHeader(ctx, config, canvasW) {
  const title = config.pageTitle || 'Соедини точки';
  ctx.fillStyle = config.accentColor || '#e91e63';
  ctx.fillRect(0, 0, canvasW, 52);
  ctx.fillStyle = '#fff';
  ctx.font = `bold 26px "Fredoka One", cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, canvasW / 2, 26);
}

// ── Shape selection ─────────────────────────────────────────
function pickShapes(config, pageIndex) {
  const all = Object.keys(CD_SHAPES);
  const selected = (config.selectedShapes || all).filter(k => CD_SHAPES[k]);
  const spp = config.shapesPerPage || 2;
  const rng = seededRng((config.seed || 0) * 100 + pageIndex * 17);
  const out = [];
  const pool = selected.length ? [...selected] : [...all];
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  for (let i = 0; i < spp; i++) out.push(CD_SHAPES[pool[i % pool.length]]);
  return out;
}

// ── Main export: render one page ────────────────────────────
export function renderConnectDotsPage(ctx, config, pageIndex) {
  const canvas = ctx.canvas;
  const W = canvas.width;
  const H = canvas.height;
  const scale = W / 794;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);

  drawHeader(ctx, config, W);

  const cells = getCells(config, W, H);
  const shapes = pickShapes(config, pageIndex);
  const showFaint = config.showFaintOutline || false;

  for (let i = 0; i < cells.length; i++) {
    const shapeDef = shapes[i] || shapes[0];
    renderDotCell(ctx, cells[i], shapeDef, config, showFaint, scale);
  }

  // Page number
  if ((config.pages || 1) > 1) {
    ctx.fillStyle = '#aaa';
    ctx.font = `${Math.round(12 * scale)}px sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`Стр. ${pageIndex + 1} / ${config.pages}`, W - 16 * scale, H - 8 * scale);
  }
}

// ── Render all pages into document body ─────────────────────
export function renderConnectDotsAllPages(config) {
  const pages = config.pages || 1;
  for (let i = 0; i < pages; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = 794; canvas.height = 1123;
    document.body.appendChild(canvas);
    renderConnectDotsPage(canvas.getContext('2d'), config, i);
  }
}
