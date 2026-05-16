// ==========================================================
// CONSTANTS
// ==========================================================
const N=1, S=2, E=4, W=8;
const OPP = {1:2, 2:1, 4:8, 8:4};
const DX  = {1:0, 2:0, 4:1, 8:-1};
const DY  = {1:-1, 2:1, 4:0, 8:0};
const DIRS = [N,S,E,W];

// ==========================================================
// MAZE ALGORITHMS
// ==========================================================
function mkRng(seed) {
  let s = (seed ^ 0xdeadbeef) >>> 0;
  return () => { s^=s<<13; s^=s>>>17; s^=s<<5; return (s>>>0)/4294967296; };
}

function mazePrim(cols, rows, seed) {
  const rng = mkRng(seed);
  const g  = Array.from({length:rows}, ()=>new Uint8Array(cols));
  const IN = Array.from({length:rows}, ()=>new Uint8Array(cols));
  const frontier = [];
  function addF(x,y){
    for(const d of DIRS){
      const nx=x+DX[d],ny=y+DY[d];
      if(nx>=0&&nx<cols&&ny>=0&&ny<rows&&!IN[ny][nx]&&!frontier.some(f=>f[0]===nx&&f[1]===ny))
        frontier.push([nx,ny]);
    }
  }
  IN[0][0]=1; addF(0,0);
  while(frontier.length){
    const idx=0|rng()*frontier.length;
    const [fx,fy]=frontier[idx]; frontier.splice(idx,1);
    const nb=[];
    for(const d of DIRS){const nx=fx+DX[d],ny=fy+DY[d];if(nx>=0&&nx<cols&&ny>=0&&ny<rows&&IN[ny][nx])nb.push([nx,ny,d]);}
    if(!nb.length)continue;
    const [nx,ny,d]=nb[0|rng()*nb.length];
    g[fy][fx]|=d; g[ny][nx]|=OPP[d]; IN[fy][fx]=1; addF(fx,fy);
  }
  return g;
}

function mazeWilson(cols, rows, seed) {
  const rng = mkRng(seed + 9999);
  const g  = Array.from({length:rows}, ()=>new Uint8Array(cols));
  const IN = Array.from({length:rows}, ()=>new Uint8Array(cols));
  const walkDir = Array.from({length:rows}, ()=>new Uint8Array(cols));
  IN[0][0]=1;
  let remaining=cols*rows-1;
  while(remaining>0){
    let sx,sy;
    do { sx=0|rng()*cols; sy=0|rng()*rows; } while(IN[sy][sx]);
    let cx=sx,cy=sy;
    while(!IN[cy][cx]){
      const d=DIRS[0|rng()*4];
      const nx=cx+DX[d],ny=cy+DY[d];
      if(nx<0||nx>=cols||ny<0||ny>=rows)continue;
      walkDir[cy][cx]=d; cx=nx; cy=ny;
    }
    cx=sx; cy=sy;
    while(!IN[cy][cx]){
      const d=walkDir[cy][cx];
      const nx=cx+DX[d],ny=cy+DY[d];
      g[cy][cx]|=d; g[ny][nx]|=OPP[d];
      IN[cy][cx]=1; remaining--; cx=nx; cy=ny;
    }
  }
  return g;
}

function getAlgo(algorithm, mazeIndex) {
  if (algorithm === 'prim')   return 'prim';
  if (algorithm === 'wilson') return 'wilson';
  // mixed: alternating
  return mazeIndex % 2 === 0 ? 'prim' : 'wilson';
}

// ==========================================================
// PATH FINDING
// ==========================================================
function findPath(g, cols, rows, [sc,sr], [ec,er]) {
  const parent = Array.from({length:rows}, ()=>new Array(cols).fill(null));
  const vis    = Array.from({length:rows}, ()=>new Uint8Array(cols));
  vis[sr][sc]=1;
  const q=[[sc,sr]];
  while(q.length){
    const [cx,cy]=q.shift();
    if(cx===ec&&cy===er) break;
    for(const d of DIRS){
      if(g[cy][cx]&d){
        const nx=cx+DX[d],ny=cy+DY[d];
        if(nx>=0&&nx<cols&&ny>=0&&ny<rows&&!vis[ny][nx]){
          vis[ny][nx]=1; parent[ny][nx]=[cx,cy]; q.push([nx,ny]);
        }
      }
    }
  }
  const path=[];
  let [cx,cy]=[ec,er];
  while(!(cx===sc&&cy===sr)){
    path.unshift([cx,cy]);
    if(!parent[cy][cx]) break;
    [cx,cy]=parent[cy][cx];
  }
  path.unshift([sc,sr]);
  return path;
}

function findBombSetup(g, path, cols, rows) {
  const pathIdx = new Map();
  path.forEach(([c,r],i) => pathIdx.set(r*cols+c, i));
  for(let i=1; i<path.length-2; i++){
    const [pc,pr]=path[i];
    for(const d1 of DIRS){
      const bc=pc+DX[d1], br=pr+DY[d1];
      if(bc<0||bc>=cols||br<0||br>=rows) continue;
      if(pathIdx.has(br*cols+bc)) continue;
      for(const d2 of DIRS){
        if(d2===OPP[d1]) continue;
        const nc=bc+DX[d2], nr=br+DY[d2];
        if(nc<0||nc>=cols||nr<0||nr>=rows) continue;
        const nIdx=pathIdx.get(nr*cols+nc);
        if(nIdx!==undefined && nIdx>i+1){
          return { bombCell:[bc,br], fromPath:i, toPath:nIdx, d_from:d1, d_bomb_to:d2 };
        }
      }
    }
  }
  return null;
}

function carveBombRoute(g, path, info){
  const {bombCell:[bc,br], fromPath, toPath, d_from, d_bomb_to}=info;
  const [fc,fr]=path[fromPath];
  const [tc,tr]=path[toPath];
  g[fr][fc]|=d_from;
  g[br][bc]|=OPP[d_from];
  g[br][bc]|=d_bomb_to;
  g[tr][tc]|=OPP[d_bomb_to];
}

function findDeadEndBombs(g, path, cols, rows, seed, count) {
  const rng = mkRng(seed + 55555);
  const pathSet = new Set(path.map(([c,r]) => r*cols+c));
  const candidates = [];
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
    if(pathSet.has(r*cols+c)) continue;
    let conn=0; for(const d of DIRS) if(g[r][c]&d) conn++;
    if(conn!==1) continue;
    let nearPath=false;
    for(const d of DIRS){
      const nc=c+DX[d],nr=r+DY[d];
      if(nc>=0&&nc<cols&&nr>=0&&nr<rows&&pathSet.has(nr*cols+nc)){nearPath=true;break;}
    }
    if(nearPath) candidates.push([c,r]);
  }
  for(let i=candidates.length-1;i>0;i--){
    const j=0|rng()*(i+1); [candidates[i],candidates[j]]=[candidates[j],candidates[i]];
  }
  return candidates.slice(0, count);
}

// ==========================================================
// DRAWING HELPERS
// ==========================================================
function outlined(ctx, fillCol, fn, lw) {
  ctx.fillStyle=fillCol; ctx.beginPath(); fn(); ctx.fill();
  ctx.strokeStyle='#111'; ctx.lineWidth=lw; ctx.lineJoin='round'; ctx.beginPath(); fn(); ctx.stroke();
}

function carWheel(ctx, wx, wy, r) {
  ctx.fillStyle='#222'; ctx.beginPath(); ctx.arc(wx,wy,r,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(wx,wy,r*0.5,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#111'; ctx.lineWidth=r*0.22;
  ctx.beginPath(); ctx.arc(wx,wy,r,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth=r*0.14;
  for(let i=0;i<4;i++){ const a=i*Math.PI/2; ctx.beginPath(); ctx.moveTo(wx,wy); ctx.lineTo(wx+Math.cos(a)*r*0.48, wy+Math.sin(a)*r*0.48); ctx.stroke(); }
}

// ==========================================================
// OBJECT DRAWINGS (copied exactly from sprunki_mazes_v13.html)
// ==========================================================
function drawBed(ctx, cx, cy, s) {
  ctx.save();
  const lw=s*0.06;
  outlined(ctx,'#ccc', ()=>{ ctx.rect(cx-s*0.7, cy-s*0.1, s*1.4, s*0.55); }, lw);
  outlined(ctx,'#fff', ()=>{ ctx.rect(cx-s*0.65, cy-s*0.14, s*1.3, s*0.45); }, s*0.04);
  outlined(ctx,'#eee', ()=>{ ctx.rect(cx-s*0.58, cy-s*0.12, s*0.45, s*0.3); }, s*0.04);
  outlined(ctx,'#bbb', ()=>{ ctx.rect(cx-s*0.05, cy-s*0.12, s*0.6, s*0.3); }, s*0.04);
  ctx.strokeStyle='#999'; ctx.lineWidth=s*0.03; ctx.lineCap='round';
  for(let i=1;i<4;i++){ ctx.beginPath(); ctx.moveTo(cx+s*(-0.05+i*0.14), cy-s*0.12); ctx.lineTo(cx+s*(-0.05+i*0.14), cy+s*0.18); ctx.stroke(); }
  outlined(ctx,'#888', ()=>{ ctx.rect(cx-s*0.7, cy-s*0.52, s*0.14, s*0.44); }, lw);
  outlined(ctx,'#888', ()=>{ ctx.rect(cx+s*0.56, cy-s*0.36, s*0.14, s*0.28); }, lw);
  ctx.fillStyle='#777'; ctx.strokeStyle='#333'; ctx.lineWidth=s*0.04;
  for(const lx of [cx-s*0.6, cx+s*0.6]){
    ctx.beginPath(); ctx.rect(lx-s*0.05, cy+s*0.42, s*0.1, s*0.18); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle='#333'; ctx.font=`bold ${s*0.32}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('z z z', cx, cy-s*0.68);
  ctx.restore();
}

function drawTissue(ctx, cx, cy, s) {
  ctx.save();
  const lw=s*0.06;
  outlined(ctx,'#ddd', ()=>{ ctx.rect(cx-s*0.44, cy-s*0.28, s*0.88, s*0.62); }, lw);
  outlined(ctx,'#eee', ()=>{ ctx.rect(cx-s*0.44, cy-s*0.28, s*0.88, s*0.14); }, s*0.04);
  ctx.fillStyle='#fff'; ctx.strokeStyle='#111'; ctx.lineWidth=lw; ctx.lineJoin='round'; ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(cx-s*0.22, cy-s*0.28);
  ctx.bezierCurveTo(cx-s*0.28, cy-s*0.58, cx-s*0.1, cy-s*0.68, cx, cy-s*0.72);
  ctx.bezierCurveTo(cx+s*0.1, cy-s*0.68, cx+s*0.28, cy-s*0.58, cx+s*0.22, cy-s*0.28);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle='#ccc'; ctx.lineWidth=s*0.03;
  ctx.beginPath(); ctx.moveTo(cx-s*0.12, cy-s*0.42); ctx.bezierCurveTo(cx-s*0.06,cy-s*0.48,cx+s*0.06,cy-s*0.44,cx+s*0.12,cy-s*0.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-s*0.08, cy-s*0.54); ctx.bezierCurveTo(cx-s*0.02,cy-s*0.6,cx+s*0.04,cy-s*0.56,cx+s*0.1,cy-s*0.62); ctx.stroke();
  ctx.fillStyle='#aaa';
  for(const [dx,dy] of [[-s*0.25,s*0.08],[s*0,s*0.08],[s*0.25,s*0.08],[-s*0.12,s*0.22],[s*0.12,s*0.22]]){
    ctx.beginPath(); ctx.arc(cx+dx, cy+dy, s*0.05, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

function drawCannon(ctx, cx, cy, s) {
  ctx.save();
  for(const wx of [-s*0.45, s*0.2]) {
    ctx.fillStyle='#5d4037';
    ctx.beginPath(); ctx.arc(cx+wx, cy+s*0.55, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle='#8d6e63';
    ctx.beginPath(); ctx.arc(cx+wx, cy+s*0.55, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle='#4e342e'; ctx.lineWidth=s*0.07;
    for(let i=0;i<4;i++){
      const a=i*Math.PI/2;
      ctx.beginPath();
      ctx.moveTo(cx+wx+Math.cos(a)*s*0.08, cy+s*0.55+Math.sin(a)*s*0.08);
      ctx.lineTo(cx+wx+Math.cos(a)*s*0.28, cy+s*0.55+Math.sin(a)*s*0.28);
      ctx.stroke();
    }
  }
  ctx.fillStyle='#6d4c41';
  ctx.beginPath(); ctx.rect(cx-s*0.5, cy+s*0.3, s*0.9, s*0.14); ctx.fill();
  ctx.fillStyle='#4e342e';
  ctx.beginPath();
  ctx.moveTo(cx-s*0.52, cy+s*0.3); ctx.lineTo(cx+s*0.28, cy+s*0.3);
  ctx.lineTo(cx+s*0.28, cy+s*0.05); ctx.lineTo(cx-s*0.52, cy+s*0.05);
  ctx.closePath(); ctx.fill();
  ctx.save();
  ctx.translate(cx-s*0.05, cy+s*0.1); ctx.rotate(-0.42);
  ctx.fillStyle='#37474f';
  ctx.beginPath(); ctx.rect(-s*0.08, -s*0.18, s*0.76, s*0.36); ctx.fill();
  ctx.fillStyle='#546e7a';
  ctx.beginPath(); ctx.rect(s*0.62, -s*0.18, s*0.1, s*0.36); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.15)';
  ctx.beginPath(); ctx.rect(-s*0.06, -s*0.16, s*0.66, s*0.12); ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(cx-s*0.05, cy+s*0.1); ctx.rotate(-0.42);
  ctx.fillStyle='#1a1a1a';
  ctx.beginPath(); ctx.arc(s*0.74, 0, s*0.17, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.2)';
  ctx.beginPath(); ctx.arc(s*0.74-s*0.04, -s*0.05, s*0.06, 0, Math.PI*2); ctx.fill();
  ctx.restore();
  ctx.fillStyle='rgba(200,200,200,0.5)';
  ctx.beginPath(); ctx.arc(cx+s*0.56, cy-s*0.24, s*0.14, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+s*0.66, cy-s*0.36, s*0.1, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+s*0.74, cy-s*0.28, s*0.08, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawFire(ctx, cx, cy, s) {
  function shape(fill, stroke, lw, fn) {
    ctx.fillStyle=fill; ctx.beginPath(); fn(); ctx.fill();
    ctx.strokeStyle=stroke; ctx.lineWidth=lw; ctx.beginPath(); fn(); ctx.stroke();
  }
  ctx.save(); ctx.lineCap='round'; ctx.lineJoin='round';
  const outer = () => { ctx.moveTo(cx-s*0.32,cy+s*0.28); ctx.bezierCurveTo(cx-s*0.52,cy-s*0.15,cx-s*0.18,cy-s*0.62,cx,cy-s*0.9); ctx.bezierCurveTo(cx+s*0.18,cy-s*0.62,cx+s*0.52,cy-s*0.15,cx+s*0.32,cy+s*0.28); ctx.closePath(); };
  shape('#ccc','#111',s*0.07,outer);
  const mid = () => { ctx.moveTo(cx-s*0.2,cy+s*0.26); ctx.bezierCurveTo(cx-s*0.34,cy,cx-s*0.1,cy-s*0.46,cx,cy-s*0.64); ctx.bezierCurveTo(cx+s*0.1,cy-s*0.46,cx+s*0.34,cy,cx+s*0.2,cy+s*0.26); ctx.closePath(); };
  shape('#fff','#222',s*0.05,mid);
  const inner = () => { ctx.moveTo(cx-s*0.09,cy+s*0.22); ctx.bezierCurveTo(cx-s*0.16,cy+s*0.05,cx-s*0.04,cy-s*0.26,cx,cy-s*0.4); ctx.bezierCurveTo(cx+s*0.04,cy-s*0.26,cx+s*0.16,cy+s*0.05,cx+s*0.09,cy+s*0.22); ctx.closePath(); };
  shape('#333','#000',s*0.04,inner);
  ctx.strokeStyle='#111'; ctx.lineWidth=s*0.1;
  ctx.beginPath(); ctx.moveTo(cx-s*0.36,cy+s*0.28); ctx.lineTo(cx+s*0.36,cy+s*0.28); ctx.stroke();
  ctx.strokeStyle='#444'; ctx.lineWidth=s*0.04;
  for(const [ox,oy] of [[-s*0.06,-s*0.1],[s*0.06,-s*0.25]]){
    ctx.beginPath(); ctx.moveTo(cx+ox,cy+oy); ctx.bezierCurveTo(cx+ox-s*0.06,cy+oy-s*0.1,cx+ox+s*0.06,cy+oy-s*0.2,cx+ox,cy+oy-s*0.28); ctx.stroke();
  }
  ctx.restore();
}

function drawBomb(ctx, cx, cy, r) {
  ctx.save();
  ctx.fillStyle='rgba(0,0,0,0.18)';
  ctx.beginPath(); ctx.ellipse(cx+r*0.15, cy+r*0.3, r*0.85, r*0.28, 0, 0, Math.PI*2); ctx.fill();
  const grad = ctx.createRadialGradient(cx-r*0.3, cy-r*0.3, r*0.1, cx, cy, r);
  grad.addColorStop(0,'#4a4a4a'); grad.addColorStop(1,'#111');
  ctx.fillStyle=grad;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.22)';
  ctx.beginPath(); ctx.ellipse(cx-r*0.28, cy-r*0.28, r*0.28, r*0.18, -0.5, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle='#8d6e63';
  ctx.beginPath(); ctx.arc(cx+r*0.5, cy-r*0.72, r*0.18, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle='#795548'; ctx.lineWidth=r*0.16; ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.beginPath();
  ctx.moveTo(cx+r*0.5, cy-r*0.72);
  ctx.bezierCurveTo(cx+r*0.2, cy-r*1.1, cx+r*0.9, cy-r*1.3, cx+r*0.6, cy-r*1.65);
  ctx.stroke();
  ctx.fillStyle='rgba(255,214,0,0.4)';
  ctx.beginPath(); ctx.arc(cx+r*0.6, cy-r*1.65, r*0.38, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle='#ffd60a';
  ctx.beginPath(); ctx.arc(cx+r*0.6, cy-r*1.65, r*0.2, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle='white';
  ctx.beginPath(); ctx.arc(cx+r*0.6, cy-r*1.65, r*0.09, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle='#ffd60a'; ctx.lineWidth=r*0.1;
  for(let i=0;i<6;i++){
    const a=i*Math.PI/3;
    ctx.beginPath();
    ctx.moveTo(cx+r*0.6+Math.cos(a)*r*0.25, cy-r*1.65+Math.sin(a)*r*0.25);
    ctx.lineTo(cx+r*0.6+Math.cos(a)*r*0.42, cy-r*1.65+Math.sin(a)*r*0.42);
    ctx.stroke();
  }
  ctx.fillStyle='rgba(255,255,255,0.55)';
  ctx.font=`bold ${r*0.9}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('!', cx, cy+r*0.06);
  ctx.restore();
}

function drawKetchup(ctx, cx, cy, r) {
  ctx.save();
  ctx.fillStyle='#c0392b';
  ctx.beginPath();
  ctx.moveTo(cx, cy-r);
  ctx.bezierCurveTo(cx+r*0.8, cy-r*1.1, cx+r*1.4, cy-r*0.2, cx+r*1.1, cy+r*0.4);
  ctx.bezierCurveTo(cx+r*1.5, cy+r*0.9, cx+r*0.5, cy+r*1.3, cx, cy+r*1.0);
  ctx.bezierCurveTo(cx-r*0.6, cy+r*1.4, cx-r*1.4, cy+r*0.8, cx-r*1.2, cy+r*0.1);
  ctx.bezierCurveTo(cx-r*1.5, cy-r*0.5, cx-r*0.8, cy-r*1.1, cx, cy-r);
  ctx.closePath(); ctx.fill();
  const drops = [[cx+r*1.5,cy-r*0.3,r*0.22],[cx-r*1.5,cy+r*0.5,r*0.18],[cx+r*0.6,cy+r*1.5,r*0.16],[cx-r*0.4,cy-r*1.3,r*0.14],[cx+r*1.1,cy+r*1.1,r*0.13],[cx-r*1.0,cy-r*0.8,r*0.12]];
  ctx.fillStyle='#c0392b';
  for(const [dx,dy,dr] of drops){ ctx.beginPath(); ctx.arc(dx,dy,dr,0,Math.PI*2); ctx.fill(); }
  ctx.fillStyle='rgba(255,100,100,0.35)';
  ctx.beginPath(); ctx.ellipse(cx-r*0.2, cy-r*0.3, r*0.42, r*0.22, -0.4, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawFinishCat(ctx, cx, cy, s) {
  ctx.save();
  const col='#9e9e9e';
  ctx.fillStyle=col;
  ctx.beginPath(); ctx.ellipse(cx, cy+s*0.3, s*0.52, s*0.7, 0, 0, Math.PI*2); ctx.fill();
  for(const [ex] of [[-1],[1]]){
    ctx.fillStyle=col;
    ctx.beginPath(); ctx.moveTo(cx+ex*s*0.28,cy-s*0.62); ctx.lineTo(cx+ex*s*0.58,cy-s*0.98); ctx.lineTo(cx+ex*s*0.62,cy-s*0.54); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#f8bbd0';
    ctx.beginPath(); ctx.moveTo(cx+ex*s*0.30,cy-s*0.63); ctx.lineTo(cx+ex*s*0.54,cy-s*0.90); ctx.lineTo(cx+ex*s*0.56,cy-s*0.58); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle=col; ctx.beginPath(); ctx.arc(cx, cy-s*0.28, s*0.52, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle='#333'; ctx.lineWidth=s*0.1; ctx.lineCap='round';
  ctx.beginPath(); ctx.arc(cx-s*0.2, cy-s*0.32, s*0.12, Math.PI, 0); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx+s*0.2, cy-s*0.32, s*0.12, Math.PI, 0); ctx.stroke();
  ctx.fillStyle='#ef9a9a'; ctx.beginPath(); ctx.arc(cx, cy-s*0.16, s*0.07, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle='rgba(160,160,160,0.8)'; ctx.lineWidth=0.8;
  for(const [x1,y1,x2,y2] of [[cx-s*0.1,cy-s*0.16,cx-s*0.55,cy-s*0.22],[cx-s*0.1,cy-s*0.1,cx-s*0.55,cy-s*0.08],[cx+s*0.1,cy-s*0.16,cx+s*0.55,cy-s*0.22],[cx+s*0.1,cy-s*0.1,cx+s*0.55,cy-s*0.08]]){
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  }
  ctx.strokeStyle=col; ctx.lineWidth=s*0.18; ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(cx+s*0.52, cy+s*0.5);
  ctx.bezierCurveTo(cx+s*1.1, cy+s*0.6, cx+s*1.2, cy-s*0.1, cx+s*0.7, cy-s*0.3);
  ctx.stroke();
  ctx.restore();
}

// ==========================================================
// ANIMAL DRAWINGS (copied exactly from sprunki_mazes_v13.html)
// ==========================================================
function drawPenguin(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  outlined(ctx,'#111', ()=>ctx.ellipse(cx,cy+s*0.22,s*0.38,s*0.52,0,0,Math.PI*2), lw);
  outlined(ctx,'#fff', ()=>ctx.ellipse(cx,cy+s*0.3,s*0.22,s*0.35,0,0,Math.PI*2), lw);
  outlined(ctx,'#111', ()=>ctx.arc(cx,cy-s*0.32,s*0.34,0,Math.PI*2), lw);
  outlined(ctx,'#fff', ()=>ctx.arc(cx-s*0.12,cy-s*0.38,s*0.11,0,Math.PI*2), s*0.05);
  outlined(ctx,'#fff', ()=>ctx.arc(cx+s*0.12,cy-s*0.38,s*0.11,0,Math.PI*2), s*0.05);
  ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(cx-s*0.12,cy-s*0.37,s*0.06,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(cx+s*0.12,cy-s*0.37,s*0.06,0,Math.PI*2); ctx.fill();
  outlined(ctx,'#888', ()=>{ ctx.moveTo(cx-s*0.07,cy-s*0.26); ctx.lineTo(cx+s*0.07,cy-s*0.26); ctx.lineTo(cx,cy-s*0.17); ctx.closePath(); }, s*0.05);
  outlined(ctx,'#333', ()=>ctx.ellipse(cx-s*0.44,cy+s*0.1,s*0.12,s*0.3,-0.3,0,Math.PI*2), lw);
  outlined(ctx,'#333', ()=>ctx.ellipse(cx+s*0.44,cy+s*0.1,s*0.12,s*0.3,0.3,0,Math.PI*2), lw);
  outlined(ctx,'#777', ()=>ctx.ellipse(cx-s*0.14,cy+s*0.72,s*0.14,s*0.06,0.3,0,Math.PI*2), s*0.05);
  outlined(ctx,'#777', ()=>ctx.ellipse(cx+s*0.14,cy+s*0.72,s*0.14,s*0.06,-0.3,0,Math.PI*2), s*0.05);
  ctx.fillStyle='#000'; ctx.font=`bold ${s*0.32}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('SOS', cx, cy-s*0.76);
  ctx.restore();
}

function drawFox(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  ctx.fillStyle='#ddd'; ctx.strokeStyle='#111'; ctx.lineWidth=lw; ctx.lineJoin='round';
  ctx.beginPath(); ctx.moveTo(cx+s*0.36,cy+s*0.5); ctx.bezierCurveTo(cx+s*0.9,cy+s*0.8,cx+s*1.0,cy+s*0.1,cx+s*0.58,cy-s*0.08); ctx.bezierCurveTo(cx+s*0.38,cy+s*0.02,cx+s*0.48,cy+s*0.32,cx+s*0.36,cy+s*0.5); ctx.fill(); ctx.stroke();
  outlined(ctx,'#fff', ()=>ctx.ellipse(cx+s*0.72,cy+s*0.2,s*0.14,s*0.2,-0.35,0,Math.PI*2), s*0.04);
  outlined(ctx,'#ccc', ()=>ctx.ellipse(cx,cy+s*0.3,s*0.4,s*0.48,0,0,Math.PI*2), lw);
  ctx.save(); ctx.strokeStyle='#999'; ctx.lineWidth=s*0.04;
  ctx.beginPath(); ctx.ellipse(cx,cy+s*0.3,s*0.4,s*0.48,0,0,Math.PI*2); ctx.clip();
  for(let dx=-s;dx<s;dx+=s*0.2){ ctx.beginPath(); ctx.moveTo(cx+dx-s*0.5,cy-s*0.5); ctx.lineTo(cx+dx+s*0.5,cy+s*1.1); ctx.stroke(); }
  ctx.restore();
  outlined(ctx,'#ccc', ()=>{ ctx.moveTo(cx-s*0.28,cy-s*0.48); ctx.lineTo(cx-s*0.46,cy-s*0.88); ctx.lineTo(cx-s*0.08,cy-s*0.58); ctx.closePath(); }, lw);
  outlined(ctx,'#ccc', ()=>{ ctx.moveTo(cx+s*0.28,cy-s*0.48); ctx.lineTo(cx+s*0.46,cy-s*0.88); ctx.lineTo(cx+s*0.08,cy-s*0.58); ctx.closePath(); }, lw);
  ctx.fillStyle='#555'; ctx.beginPath(); ctx.moveTo(cx-s*0.27,cy-s*0.52); ctx.lineTo(cx-s*0.4,cy-s*0.78); ctx.lineTo(cx-s*0.12,cy-s*0.6); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#555'; ctx.beginPath(); ctx.moveTo(cx+s*0.27,cy-s*0.52); ctx.lineTo(cx+s*0.4,cy-s*0.78); ctx.lineTo(cx+s*0.12,cy-s*0.6); ctx.closePath(); ctx.fill();
  outlined(ctx,'#eee', ()=>ctx.arc(cx,cy-s*0.24,s*0.4,0,Math.PI*2), lw);
  outlined(ctx,'#fff', ()=>ctx.ellipse(cx,cy-s*0.1,s*0.22,s*0.2,0,0,Math.PI*2), s*0.05);
  outlined(ctx,'#111', ()=>ctx.arc(cx-s*0.18,cy-s*0.3,s*0.09,0,Math.PI*2), s*0.04);
  outlined(ctx,'#111', ()=>ctx.arc(cx+s*0.18,cy-s*0.3,s*0.09,0,Math.PI*2), s*0.04);
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx-s*0.15,cy-s*0.33,s*0.035,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx+s*0.21,cy-s*0.33,s*0.035,0,Math.PI*2); ctx.fill();
  outlined(ctx,'#333', ()=>ctx.ellipse(cx,cy-s*0.04,s*0.07,s*0.05,0,0,Math.PI*2), s*0.04);
  ctx.restore();
}

function drawFrog(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  outlined(ctx,'#ddd', ()=>ctx.ellipse(cx,cy+s*0.2,s*0.42,s*0.4,0,0,Math.PI*2), lw);
  ctx.save(); ctx.strokeStyle='#aaa'; ctx.lineWidth=s*0.05;
  ctx.beginPath(); ctx.ellipse(cx,cy+s*0.2,s*0.42,s*0.4,0,0,Math.PI*2); ctx.clip();
  for(let dy=-s*0.3;dy<s*0.7;dy+=s*0.18){ ctx.beginPath(); ctx.moveTo(cx-s*0.5,cy+dy); ctx.lineTo(cx+s*0.5,cy+dy); ctx.stroke(); }
  ctx.restore();
  outlined(ctx,'#ddd', ()=>ctx.ellipse(cx,cy-s*0.22,s*0.42,s*0.3,0,0,Math.PI*2), lw);
  outlined(ctx,'#ddd', ()=>ctx.arc(cx-s*0.22,cy-s*0.44,s*0.18,0,Math.PI*2), lw);
  outlined(ctx,'#ddd', ()=>ctx.arc(cx+s*0.22,cy-s*0.44,s*0.18,0,Math.PI*2), lw);
  outlined(ctx,'#fff', ()=>ctx.arc(cx-s*0.22,cy-s*0.46,s*0.12,0,Math.PI*2), s*0.04);
  outlined(ctx,'#fff', ()=>ctx.arc(cx+s*0.22,cy-s*0.46,s*0.12,0,Math.PI*2), s*0.04);
  ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(cx-s*0.22,cy-s*0.46,s*0.07,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(cx+s*0.22,cy-s*0.46,s*0.07,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx-s*0.19,cy-s*0.5,s*0.03,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx+s*0.25,cy-s*0.5,s*0.03,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#111'; ctx.lineWidth=s*0.09; ctx.lineCap='round';
  ctx.beginPath(); ctx.arc(cx,cy-s*0.06,s*0.26,0.15,Math.PI-0.15); ctx.stroke();
  outlined(ctx,'#bbb', ()=>ctx.ellipse(cx-s*0.5,cy+s*0.22,s*0.1,s*0.26,-0.4,0,Math.PI*2), s*0.05);
  outlined(ctx,'#bbb', ()=>ctx.ellipse(cx+s*0.5,cy+s*0.22,s*0.1,s*0.26,0.4,0,Math.PI*2), s*0.05);
  outlined(ctx,'#bbb', ()=>ctx.ellipse(cx-s*0.42,cy+s*0.58,s*0.2,s*0.1,0.6,0,Math.PI*2), s*0.05);
  outlined(ctx,'#bbb', ()=>ctx.ellipse(cx+s*0.42,cy+s*0.58,s*0.2,s*0.1,-0.6,0,Math.PI*2), s*0.05);
  ctx.restore();
}

function drawBunnyA(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.09;
  for(const [ex,rot] of [[-s*0.18,-0.1],[s*0.18,0.1]]){
    ctx.save(); ctx.translate(cx+ex,cy-s*0.72); ctx.rotate(rot);
    outlined(ctx,'#fff', ()=>ctx.ellipse(0,0,s*0.14,s*0.44,0,0,Math.PI*2), lw);
    outlined(ctx,'#bbb', ()=>ctx.ellipse(0,s*0.04,s*0.07,s*0.28,0,0,Math.PI*2), s*0.04);
    ctx.restore();
  }
  outlined(ctx,'#fff', ()=>ctx.ellipse(cx,cy+s*0.22,s*0.38,s*0.48,0,0,Math.PI*2), lw);
  outlined(ctx,'#fff', ()=>ctx.arc(cx,cy-s*0.24,s*0.36,0,Math.PI*2), lw);
  ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(cx-s*0.14,cy-s*0.3,s*0.09,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(cx+s*0.14,cy-s*0.3,s*0.09,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx-s*0.11,cy-s*0.34,s*0.035,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx+s*0.17,cy-s*0.34,s*0.035,0,Math.PI*2); ctx.fill();
  outlined(ctx,'#555', ()=>ctx.arc(cx,cy-s*0.15,s*0.07,0,Math.PI*2), s*0.04);
  ctx.strokeStyle='#333'; ctx.lineWidth=s*0.07; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(cx,cy-s*0.08); ctx.lineTo(cx-s*0.1,cy-s*0.02); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx,cy-s*0.08); ctx.lineTo(cx+s*0.1,cy-s*0.02); ctx.stroke();
  outlined(ctx,'#fff', ()=>ctx.ellipse(cx-s*0.46,cy+s*0.18,s*0.13,s*0.1,-0.4,0,Math.PI*2), s*0.06);
  outlined(ctx,'#fff', ()=>ctx.ellipse(cx+s*0.46,cy+s*0.18,s*0.13,s*0.1,0.4,0,Math.PI*2), s*0.06);
  ctx.restore();
}

function drawOwl(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  outlined(ctx,'#bbb', ()=>ctx.ellipse(cx,cy+s*0.22,s*0.38,s*0.52,0,0,Math.PI*2), lw);
  outlined(ctx,'#fff', ()=>ctx.ellipse(cx,cy+s*0.28,s*0.24,s*0.34,0,0,Math.PI*2), lw);
  ctx.strokeStyle='#999'; ctx.lineWidth=s*0.04; ctx.lineCap='round';
  for(let i=0;i<3;i++){ const fy=cy+s*(0.08+i*0.18); ctx.beginPath(); ctx.moveTo(cx-s*0.18,fy); ctx.lineTo(cx,fy+s*0.1); ctx.lineTo(cx+s*0.18,fy); ctx.stroke(); }
  outlined(ctx,'#bbb', ()=>ctx.arc(cx,cy-s*0.28,s*0.36,0,Math.PI*2), lw);
  ctx.fillStyle='#444'; ctx.strokeStyle='#111'; ctx.lineWidth=lw;
  ctx.beginPath(); ctx.moveTo(cx-s*0.2,cy-s*0.54); ctx.lineTo(cx-s*0.32,cy-s*0.78); ctx.lineTo(cx-s*0.06,cy-s*0.58); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+s*0.2,cy-s*0.54); ctx.lineTo(cx+s*0.32,cy-s*0.78); ctx.lineTo(cx+s*0.06,cy-s*0.58); ctx.closePath(); ctx.fill(); ctx.stroke();
  outlined(ctx,'#fff', ()=>ctx.arc(cx-s*0.15,cy-s*0.3,s*0.18,0,Math.PI*2), lw);
  outlined(ctx,'#fff', ()=>ctx.arc(cx+s*0.15,cy-s*0.3,s*0.18,0,Math.PI*2), lw);
  ctx.strokeStyle='#333'; ctx.lineWidth=s*0.05;
  ctx.beginPath(); ctx.arc(cx-s*0.15,cy-s*0.3,s*0.12,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx+s*0.15,cy-s*0.3,s*0.12,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(cx-s*0.15,cy-s*0.3,s*0.07,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(cx+s*0.15,cy-s*0.3,s*0.07,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx-s*0.12,cy-s*0.34,s*0.03,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx+s*0.18,cy-s*0.34,s*0.03,0,Math.PI*2); ctx.fill();
  outlined(ctx,'#888', ()=>{ ctx.moveTo(cx-s*0.06,cy-s*0.16); ctx.lineTo(cx+s*0.06,cy-s*0.16); ctx.lineTo(cx,cy-s*0.08); ctx.closePath(); }, s*0.05);
  outlined(ctx,'#777', ()=>ctx.ellipse(cx-s*0.44,cy+s*0.14,s*0.12,s*0.34,-0.25,0,Math.PI*2), lw);
  outlined(ctx,'#777', ()=>ctx.ellipse(cx+s*0.44,cy+s*0.14,s*0.12,s*0.34,0.25,0,Math.PI*2), lw);
  ctx.restore();
}

function drawHamster(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  outlined(ctx,'#ddd', ()=>ctx.ellipse(cx,cy+s*0.2,s*0.52,s*0.48,0,0,Math.PI*2), lw);
  outlined(ctx,'#fff', ()=>ctx.ellipse(cx,cy+s*0.28,s*0.3,s*0.3,0,0,Math.PI*2), s*0.05);
  outlined(ctx,'#bbb', ()=>ctx.ellipse(cx-s*0.42,cy-s*0.18,s*0.22,s*0.18,-0.2,0,Math.PI*2), s*0.05);
  outlined(ctx,'#bbb', ()=>ctx.ellipse(cx+s*0.42,cy-s*0.18,s*0.22,s*0.18,0.2,0,Math.PI*2), s*0.05);
  outlined(ctx,'#ddd', ()=>ctx.arc(cx-s*0.32,cy-s*0.58,s*0.17,0,Math.PI*2), lw);
  outlined(ctx,'#ddd', ()=>ctx.arc(cx+s*0.32,cy-s*0.58,s*0.17,0,Math.PI*2), lw);
  outlined(ctx,'#888', ()=>ctx.arc(cx-s*0.32,cy-s*0.58,s*0.09,0,Math.PI*2), s*0.04);
  outlined(ctx,'#888', ()=>ctx.arc(cx+s*0.32,cy-s*0.58,s*0.09,0,Math.PI*2), s*0.04);
  outlined(ctx,'#ddd', ()=>ctx.arc(cx,cy-s*0.22,s*0.46,0,Math.PI*2), lw);
  for(const ex of [-s*0.18, s*0.18]) {
    ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(cx+ex,cy-s*0.28,s*0.1,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx+ex-s*0.03,cy-s*0.31,s*0.04,0,Math.PI*2); ctx.fill();
  }
  outlined(ctx,'#555', ()=>ctx.arc(cx,cy-s*0.14,s*0.07,0,Math.PI*2), s*0.04);
  ctx.strokeStyle='#333'; ctx.lineWidth=s*0.08; ctx.lineCap='round';
  ctx.beginPath(); ctx.arc(cx,cy-s*0.06,s*0.12,0.2,Math.PI-0.2); ctx.stroke();
  outlined(ctx,'#ccc', ()=>ctx.ellipse(cx-s*0.5,cy+s*0.22,s*0.14,s*0.1,-0.5,0,Math.PI*2), s*0.05);
  outlined(ctx,'#ccc', ()=>ctx.ellipse(cx+s*0.5,cy+s*0.22,s*0.14,s*0.1,0.5,0,Math.PI*2), s*0.05);
  outlined(ctx,'#555', ()=>ctx.ellipse(cx+s*0.5,cy+s*0.14,s*0.06,s*0.1,0.3,0,Math.PI*2), s*0.04);
  ctx.restore();
}

// ==========================================================
// CAR DRAWINGS (copied exactly from sprunki_mazes_v13.html)
// ==========================================================
function drawCar1(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  outlined(ctx,'#eee', ()=>{ ctx.rect(cx-s*0.85, cy-s*0.15, s*1.7, s*0.45); }, lw);
  outlined(ctx,'#fff', ()=>{
    ctx.moveTo(cx-s*0.45, cy-s*0.15); ctx.lineTo(cx-s*0.55, cy-s*0.58);
    ctx.lineTo(cx+s*0.42, cy-s*0.58); ctx.lineTo(cx+s*0.55, cy-s*0.15); ctx.closePath();
  }, lw);
  outlined(ctx,'#ccc', ()=>{ ctx.rect(cx-s*0.44, cy-s*0.54, s*0.38, s*0.3); }, s*0.04);
  outlined(ctx,'#ccc', ()=>{ ctx.rect(cx+s*0.06, cy-s*0.54, s*0.38, s*0.3); }, s*0.04);
  outlined(ctx,'#ddd', ()=>{ ctx.ellipse(cx+s*0.78, cy+s*0.04, s*0.1, s*0.08, 0, 0, Math.PI*2); }, s*0.04);
  outlined(ctx,'#aaa', ()=>{ ctx.ellipse(cx-s*0.78, cy+s*0.04, s*0.08, s*0.07, 0, 0, Math.PI*2); }, s*0.04);
  carWheel(ctx, cx-s*0.52, cy+s*0.32, s*0.22);
  carWheel(ctx, cx+s*0.52, cy+s*0.32, s*0.22);
  ctx.restore();
}

function drawCar2(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  outlined(ctx,'#eee', ()=>{ ctx.rect(cx-s*0.88, cy-s*0.55, s*1.76, s*0.82); }, lw);
  outlined(ctx,'#ccc', ()=>{ ctx.rect(cx+s*0.2, cy-s*0.5, s*0.52, s*0.38); }, s*0.04);
  outlined(ctx,'#ccc', ()=>{ ctx.rect(cx-s*0.56, cy-s*0.5, s*0.66, s*0.38); }, s*0.04);
  ctx.strokeStyle='#333'; ctx.lineWidth=lw;
  ctx.beginPath(); ctx.moveTo(cx-s*0.1, cy-s*0.5); ctx.lineTo(cx-s*0.1, cy-s*0.12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-s*0.85, cy-s*0.55); ctx.lineTo(cx+s*0.88, cy-s*0.55); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-s*0.6, cy-s*0.62); ctx.lineTo(cx+s*0.6, cy-s*0.62); ctx.stroke();
  for(const rx of [-s*0.4, s*0, s*0.4]){ ctx.beginPath(); ctx.moveTo(cx+rx, cy-s*0.62); ctx.lineTo(cx+rx, cy-s*0.55); ctx.stroke(); }
  outlined(ctx,'#ddd', ()=>{ ctx.ellipse(cx+s*0.8, cy-s*0.12, s*0.1, s*0.12, 0, 0, Math.PI*2); }, s*0.04);
  ctx.strokeStyle='#555'; ctx.lineWidth=s*0.04;
  for(let i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(cx+s*0.74, cy-s*(0.32-i*0.12)); ctx.lineTo(cx+s*0.92, cy-s*(0.32-i*0.12)); ctx.stroke(); }
  carWheel(ctx, cx-s*0.52, cy+s*0.3, s*0.24);
  carWheel(ctx, cx+s*0.52, cy+s*0.3, s*0.24);
  ctx.restore();
}

function drawCar3(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  outlined(ctx,'#eee', ()=>{
    ctx.moveTo(cx-s*0.9, cy+s*0.1); ctx.lineTo(cx-s*0.9, cy-s*0.06);
    ctx.lineTo(cx-s*0.58, cy-s*0.06); ctx.lineTo(cx-s*0.38, cy-s*0.44);
    ctx.lineTo(cx+s*0.42, cy-s*0.44); ctx.lineTo(cx+s*0.72, cy-s*0.06);
    ctx.lineTo(cx+s*0.9, cy-s*0.06); ctx.lineTo(cx+s*0.9, cy+s*0.1); ctx.closePath();
  }, lw);
  outlined(ctx,'#ccc', ()=>{ ctx.ellipse(cx-s*0.0, cy-s*0.42, s*0.3, s*0.18, 0, 0, Math.PI*2); }, s*0.04);
  ctx.strokeStyle='#111'; ctx.lineWidth=lw;
  ctx.beginPath(); ctx.moveTo(cx-s*0.62, cy-s*0.06); ctx.lineTo(cx-s*0.62, cy-s*0.38); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-s*0.82, cy-s*0.38); ctx.lineTo(cx-s*0.42, cy-s*0.38); ctx.stroke();
  ctx.fillStyle='#111'; ctx.font=`bold ${s*0.28}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('7', cx+s*0.22, cy-s*0.22);
  outlined(ctx,'#999', ()=>{ ctx.rect(cx+s*0.84, cy-s*0.04, s*0.18, s*0.07); }, s*0.03);
  outlined(ctx,'#999', ()=>{ ctx.rect(cx+s*0.84, cy+s*0.04, s*0.18, s*0.07); }, s*0.03);
  carWheel(ctx, cx-s*0.56, cy+s*0.14, s*0.2);
  carWheel(ctx, cx+s*0.56, cy+s*0.14, s*0.2);
  ctx.restore();
}

function drawCar4(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  outlined(ctx,'#eee', ()=>{
    ctx.moveTo(cx-s*0.8, cy+s*0.12); ctx.lineTo(cx-s*0.82, cy-s*0.08);
    ctx.bezierCurveTo(cx-s*0.82, cy-s*0.3, cx-s*0.58, cy-s*0.55, cx-s*0.28, cy-s*0.55);
    ctx.lineTo(cx+s*0.32, cy-s*0.55);
    ctx.bezierCurveTo(cx+s*0.66, cy-s*0.55, cx+s*0.82, cy-s*0.3, cx+s*0.82, cy-s*0.08);
    ctx.lineTo(cx+s*0.8, cy+s*0.12); ctx.closePath();
  }, lw);
  outlined(ctx,'#ccc', ()=>{ ctx.ellipse(cx-s*0.28, cy-s*0.36, s*0.26, s*0.18, 0, 0, Math.PI*2); }, s*0.04);
  outlined(ctx,'#ccc', ()=>{ ctx.ellipse(cx+s*0.24, cy-s*0.36, s*0.26, s*0.18, 0, 0, Math.PI*2); }, s*0.04);
  ctx.strokeStyle='#333'; ctx.lineWidth=s*0.04;
  ctx.beginPath(); ctx.moveTo(cx+s*0.1, cy-s*0.55); ctx.lineTo(cx+s*0.2, cy-s*0.75); ctx.stroke();
  outlined(ctx,'#ddd', ()=>{ ctx.ellipse(cx+s*0.72, cy, s*0.1, s*0.07, 0, 0, Math.PI*2); }, s*0.04);
  outlined(ctx,'#aaa', ()=>{ ctx.ellipse(cx-s*0.72, cy, s*0.08, s*0.07, 0, 0, Math.PI*2); }, s*0.04);
  carWheel(ctx, cx-s*0.48, cy+s*0.3, s*0.21);
  carWheel(ctx, cx+s*0.48, cy+s*0.3, s*0.21);
  ctx.restore();
}

function drawCar5(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  carWheel(ctx, cx-s*0.52, cy+s*0.22, s*0.32);
  carWheel(ctx, cx+s*0.52, cy+s*0.22, s*0.32);
  outlined(ctx,'#eee', ()=>{ ctx.rect(cx-s*0.62, cy-s*0.5, s*1.24, s*0.5); }, lw);
  outlined(ctx,'#fff', ()=>{ ctx.rect(cx-s*0.42, cy-s*0.88, s*0.84, s*0.4); }, lw);
  outlined(ctx,'#ccc', ()=>{ ctx.rect(cx-s*0.36, cy-s*0.84, s*0.72, s*0.3); }, s*0.04);
  outlined(ctx,'#ddd', ()=>{ ctx.arc(cx+s*0.5, cy-s*0.25, s*0.1, 0, Math.PI*2); }, s*0.04);
  outlined(ctx,'#ddd', ()=>{ ctx.arc(cx-s*0.5, cy-s*0.25, s*0.1, 0, Math.PI*2); }, s*0.04);
  outlined(ctx,'#888', ()=>{ ctx.rect(cx+s*0.54, cy-s*0.88, s*0.08, s*0.3); }, s*0.04);
  ctx.fillStyle='#bbb';
  ctx.beginPath(); ctx.arc(cx+s*0.58, cy-s*0.98, s*0.07, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+s*0.64, cy-s*1.06, s*0.05, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

// ==========================================================
// VEHICLES
// ==========================================================
function drawFiretruck(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  carWheel(ctx, cx-s*0.55, cy+s*0.28, s*0.26);
  carWheel(ctx, cx+s*0.35, cy+s*0.28, s*0.26);
  carWheel(ctx, cx+s*0.62, cy+s*0.28, s*0.2);
  outlined(ctx,'#e53935',()=>{ ctx.rect(cx-s*0.7,cy-s*0.55,s*1.4,s*0.6); },lw);
  outlined(ctx,'#ef9a9a',()=>{ ctx.rect(cx+s*0.22,cy-s*0.88,s*0.4,s*0.38); },lw);
  outlined(ctx,'#bbdefb',()=>{ ctx.rect(cx+s*0.28,cy-s*0.82,s*0.28,s*0.26); },s*0.04);
  ctx.strokeStyle='#8d6e63'; ctx.lineWidth=s*0.06;
  ctx.beginPath(); ctx.moveTo(cx-s*0.6,cy-s*0.68); ctx.lineTo(cx+s*0.15,cy-s*0.68); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-s*0.6,cy-s*0.8); ctx.lineTo(cx+s*0.15,cy-s*0.8); ctx.stroke();
  for(let i=0;i<4;i++){const lx=cx-s*0.55+i*s*0.23;ctx.beginPath();ctx.moveTo(lx,cy-s*0.68);ctx.lineTo(lx,cy-s*0.8);ctx.stroke();}
  ctx.fillStyle='#ffee58'; ctx.beginPath();ctx.arc(cx-s*0.1,cy-s*0.62,s*0.09,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawPolice(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  carWheel(ctx, cx-s*0.45, cy+s*0.28, s*0.25);
  carWheel(ctx, cx+s*0.45, cy+s*0.28, s*0.25);
  outlined(ctx,'#1565c0',()=>{ ctx.rect(cx-s*0.6,cy-s*0.5,s*1.2,s*0.56); },lw);
  ctx.fillStyle='#fff'; ctx.fillRect(cx-s*0.55,cy-s*0.22,s*1.1,s*0.1);
  outlined(ctx,'#1976d2',()=>{ ctx.rect(cx-s*0.36,cy-s*0.88,s*0.72,s*0.42); },lw);
  outlined(ctx,'#bbdefb',()=>{ ctx.rect(cx-s*0.28,cy-s*0.82,s*0.56,s*0.3); },s*0.04);
  ctx.fillStyle='#e53935'; ctx.beginPath();ctx.arc(cx-s*0.1,cy-s*0.96,s*0.09,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#1565c0'; ctx.beginPath();ctx.arc(cx+s*0.1,cy-s*0.96,s*0.09,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawAmbulance(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  carWheel(ctx, cx-s*0.45, cy+s*0.28, s*0.25);
  carWheel(ctx, cx+s*0.45, cy+s*0.28, s*0.25);
  outlined(ctx,'#fff',()=>{ ctx.rect(cx-s*0.62,cy-s*0.82,s*1.24,s*0.9); },lw);
  ctx.fillStyle='#e53935';
  ctx.fillRect(cx-s*0.07,cy-s*0.65,s*0.14,s*0.38);
  ctx.fillRect(cx-s*0.2,cy-s*0.52,s*0.4,s*0.14);
  outlined(ctx,'#bbdefb',()=>{ ctx.rect(cx+s*0.22,cy-s*0.76,s*0.3,s*0.28); },s*0.04);
  ctx.fillStyle='#ffee58'; ctx.beginPath();ctx.arc(cx,cy-s*0.9,s*0.1,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawCrane(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  carWheel(ctx, cx-s*0.45, cy+s*0.28, s*0.25);
  carWheel(ctx, cx+s*0.45, cy+s*0.28, s*0.25);
  outlined(ctx,'#fbc02d',()=>{ ctx.rect(cx-s*0.6,cy-s*0.48,s*1.2,s*0.52); },lw);
  outlined(ctx,'#f57f17',()=>{ ctx.rect(cx+s*0.18,cy-s*0.82,s*0.36,s*0.38); },lw);
  outlined(ctx,'#bbdefb',()=>{ ctx.rect(cx+s*0.24,cy-s*0.76,s*0.24,s*0.24); },s*0.04);
  ctx.strokeStyle='#f57f17'; ctx.lineWidth=s*0.08;
  ctx.beginPath();ctx.moveTo(cx-s*0.2,cy-s*0.48);ctx.lineTo(cx-s*0.5,cy-s*1.0);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-s*0.5,cy-s*1.0);ctx.lineTo(cx+s*0.1,cy-s*1.0);ctx.stroke();
  ctx.strokeStyle='#888'; ctx.lineWidth=s*0.05;
  ctx.beginPath();ctx.moveTo(cx+s*0.1,cy-s*1.0);ctx.lineTo(cx+s*0.1,cy-s*0.75);ctx.stroke();
  ctx.beginPath();ctx.arc(cx+s*0.1,cy-s*0.68,s*0.09,0,Math.PI);ctx.stroke();
  ctx.restore();
}

function drawTractor(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  carWheel(ctx, cx-s*0.28, cy+s*0.2, s*0.38);
  carWheel(ctx, cx+s*0.5, cy+s*0.28, s*0.22);
  outlined(ctx,'#388e3c',()=>{ ctx.rect(cx-s*0.55,cy-s*0.44,s*0.9,s*0.5); },lw);
  outlined(ctx,'#43a047',()=>{ ctx.rect(cx-s*0.12,cy-s*0.82,s*0.44,s*0.42); },lw);
  outlined(ctx,'#bbdefb',()=>{ ctx.rect(cx-s*0.06,cy-s*0.76,s*0.32,s*0.28); },s*0.04);
  ctx.fillStyle='#555'; ctx.fillRect(cx+s*0.28,cy-s*0.96,s*0.07,s*0.2);
  ctx.restore();
}

function drawTank(ctx, cx, cy, s) {
  ctx.save(); const lw=s*0.07;
  outlined(ctx,'#546e7a',()=>{ ctx.rect(cx-s*0.65,cy-s*0.1,s*1.3,s*0.38); },lw*0.5);
  ctx.strokeStyle='#37474f'; ctx.lineWidth=s*0.04;
  for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(cx+i*s*0.2,cy-s*0.1);ctx.lineTo(cx+i*s*0.2,cy+s*0.28);ctx.stroke();}
  outlined(ctx,'#78909c',()=>{ ctx.rect(cx-s*0.52,cy-s*0.42,s*1.04,s*0.32); },lw);
  outlined(ctx,'#607d8b',()=>{ ctx.arc(cx-s*0.1,cy-s*0.42,s*0.3,Math.PI,0); },lw);
  ctx.strokeStyle='#455a64'; ctx.lineWidth=s*0.1;
  ctx.beginPath();ctx.moveTo(cx-s*0.1,cy-s*0.55);ctx.lineTo(cx+s*0.55,cy-s*0.55);ctx.stroke();
  ctx.restore();
}

// ==========================================================
// FRUITS & VEGETABLES
// ==========================================================
function drawApple(ctx, cx, cy, s) {
  ctx.save();
  outlined(ctx,'#e53935',()=>{ ctx.arc(cx,cy+s*0.08,s*0.52,0,Math.PI*2); },s*0.07);
  ctx.strokeStyle='#5d4037'; ctx.lineWidth=s*0.08;
  ctx.beginPath();ctx.moveTo(cx,cy-s*0.44);ctx.lineTo(cx,cy-s*0.64);ctx.stroke();
  ctx.fillStyle='#43a047';
  ctx.beginPath();ctx.ellipse(cx+s*0.18,cy-s*0.6,s*0.18,s*0.09,-0.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.32)';
  ctx.beginPath();ctx.ellipse(cx-s*0.14,cy-s*0.08,s*0.16,s*0.09,-0.5,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawBanana(ctx, cx, cy, s) {
  ctx.save();
  ctx.strokeStyle='#f9a825'; ctx.lineWidth=s*0.28; ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(cx-s*0.38,cy+s*0.3);ctx.quadraticCurveTo(cx-s*0.1,cy-s*0.65,cx+s*0.42,cy-s*0.38);ctx.stroke();
  ctx.strokeStyle='#fdd835'; ctx.lineWidth=s*0.18;
  ctx.beginPath();ctx.moveTo(cx-s*0.38,cy+s*0.3);ctx.quadraticCurveTo(cx-s*0.1,cy-s*0.65,cx+s*0.42,cy-s*0.38);ctx.stroke();
  ctx.fillStyle='#795548';
  ctx.beginPath();ctx.arc(cx-s*0.38,cy+s*0.3,s*0.08,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(cx+s*0.42,cy-s*0.38,s*0.08,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawCarrot(ctx, cx, cy, s) {
  ctx.save();
  ctx.fillStyle='#ff7043'; ctx.strokeStyle='#e64a19'; ctx.lineWidth=s*0.06;
  ctx.beginPath();ctx.moveTo(cx,cy+s*0.58);ctx.lineTo(cx-s*0.27,cy-s*0.3);ctx.lineTo(cx+s*0.27,cy-s*0.3);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.lineWidth=s*0.04;
  ctx.beginPath();ctx.moveTo(cx-s*0.16,cy-s*0.08);ctx.lineTo(cx+s*0.16,cy-s*0.08);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-s*0.09,cy+s*0.18);ctx.lineTo(cx+s*0.09,cy+s*0.18);ctx.stroke();
  ctx.strokeStyle='#43a047'; ctx.lineWidth=s*0.07;
  for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(cx+i*s*0.14,cy-s*0.3);ctx.quadraticCurveTo(cx+i*s*0.24,cy-s*0.7,cx+i*s*0.08,cy-s*0.88);ctx.stroke();}
  ctx.restore();
}

function drawStrawberry(ctx, cx, cy, s) {
  ctx.save();
  outlined(ctx,'#e53935',()=>{
    ctx.moveTo(cx,cy+s*0.58);ctx.quadraticCurveTo(cx-s*0.52,cy+s*0.1,cx-s*0.36,cy-s*0.24);
    ctx.quadraticCurveTo(cx-s*0.14,cy-s*0.44,cx,cy-s*0.34);ctx.quadraticCurveTo(cx+s*0.14,cy-s*0.44,cx+s*0.36,cy-s*0.24);
    ctx.quadraticCurveTo(cx+s*0.52,cy+s*0.1,cx,cy+s*0.58);
  },s*0.07);
  ctx.fillStyle='#ffcdd2';
  for(const[dx,dy]of[[-0.14,-0.12],[0.16,-0.04],[-0.04,0.14],[0.18,0.2],[-0.16,0.26],[0.04,0.36]]){
    ctx.beginPath();ctx.arc(cx+dx*s,cy+dy*s,s*0.05,0,Math.PI*2);ctx.fill();
  }
  ctx.fillStyle='#43a047';
  for(let i=-1;i<=1;i++){ctx.beginPath();ctx.ellipse(cx+i*s*0.2,cy-s*0.36,s*0.15,s*0.08,i*0.5,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

function drawPear(ctx, cx, cy, s) {
  ctx.save();
  outlined(ctx,'#c5e1a5',()=>{ ctx.arc(cx,cy+s*0.2,s*0.4,0,Math.PI*2); },s*0.07);
  outlined(ctx,'#aed581',()=>{ ctx.arc(cx,cy-s*0.22,s*0.25,0,Math.PI*2); },s*0.07);
  ctx.strokeStyle='#5d4037'; ctx.lineWidth=s*0.07;
  ctx.beginPath();ctx.moveTo(cx,cy-s*0.47);ctx.lineTo(cx+s*0.1,cy-s*0.7);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.28)';
  ctx.beginPath();ctx.ellipse(cx-s*0.1,cy+s*0.08,s*0.13,s*0.08,-0.4,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawWatermelon(ctx, cx, cy, s) {
  ctx.save();
  ctx.fillStyle='#388e3c'; ctx.strokeStyle='#2e7d32'; ctx.lineWidth=s*0.06;
  ctx.beginPath();ctx.arc(cx,cy+s*0.1,s*0.58,Math.PI,0);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#f1f8e9';ctx.beginPath();ctx.arc(cx,cy+s*0.1,s*0.5,Math.PI,0);ctx.closePath();ctx.fill();
  ctx.fillStyle='#e53935';ctx.beginPath();ctx.arc(cx,cy+s*0.1,s*0.42,Math.PI,0);ctx.closePath();ctx.fill();
  ctx.fillStyle='#1b2a1b';
  for(const[dx,dy]of[[-0.24,-0.06],[-0.05,-0.17],[0.19,-0.08],[0.04,0.06],[-0.14,0.11]]){
    ctx.save();ctx.translate(cx+dx*s,cy+s*0.1+dy*s);ctx.rotate(-0.3);
    ctx.beginPath();ctx.ellipse(0,0,s*0.04,s*0.07,0,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  ctx.restore();
}

// ==========================================================
// TRAPS
// ==========================================================
function drawBearTrap(ctx, cx, cy, s) {
  ctx.save();
  ctx.strokeStyle='#9e9e9e'; ctx.lineWidth=s*0.06;
  ctx.beginPath();ctx.moveTo(cx,cy+s*0.48);ctx.lineTo(cx,cy+s*0.16);ctx.stroke();
  ctx.fillStyle='#78909c';ctx.beginPath();ctx.rect(cx-s*0.12,cy+s*0.08,s*0.24,s*0.1);ctx.fill();
  ctx.strokeStyle='#546e7a'; ctx.lineWidth=s*0.09;
  ctx.beginPath();ctx.moveTo(cx,cy+s*0.1);ctx.lineTo(cx-s*0.44,cy-s*0.28);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,cy+s*0.1);ctx.lineTo(cx+s*0.44,cy-s*0.28);ctx.stroke();
  ctx.strokeStyle='#37474f'; ctx.lineWidth=s*0.05;
  const perpLen=s*0.1, jawX=s*0.44, jawY=s*0.38;
  const jLen=Math.sqrt(jawX*jawX+jawY*jawY);
  const px=-jawY/jLen*perpLen, py=jawX/jLen*perpLen;
  for(let i=1;i<=3;i++){
    const tx=cx-jawX*i/4,ty=cy+s*0.1-jawY*i/4;
    ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx+px,ty+py);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx+jawX*i/4,ty);ctx.lineTo(cx+jawX*i/4-px,ty+py);ctx.stroke();
  }
  ctx.restore();
}

function drawCage(ctx, cx, cy, s) {
  ctx.save();
  ctx.strokeStyle='#8d6e63'; ctx.lineWidth=s*0.07;
  for(let i=0;i<=4;i++){
    ctx.beginPath();ctx.moveTo(cx-s*0.44+i*s*0.22,cy-s*0.5);ctx.lineTo(cx-s*0.44+i*s*0.22,cy+s*0.5);ctx.stroke();
  }
  ctx.lineWidth=s*0.1;
  ctx.beginPath();ctx.moveTo(cx-s*0.5,cy-s*0.5);ctx.lineTo(cx+s*0.5,cy-s*0.5);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-s*0.5,cy+s*0.5);ctx.lineTo(cx+s*0.5,cy+s*0.5);ctx.stroke();
  ctx.lineWidth=s*0.07;
  ctx.beginPath();ctx.moveTo(cx-s*0.5,cy);ctx.lineTo(cx+s*0.5,cy);ctx.stroke();
  ctx.restore();
}

function drawNet(ctx, cx, cy, s) {
  ctx.save();
  ctx.save();
  ctx.beginPath();ctx.ellipse(cx,cy,s*0.52,s*0.52,0,0,Math.PI*2);ctx.clip();
  ctx.strokeStyle='#90a4ae'; ctx.lineWidth=s*0.05;
  const step=s*0.24;
  for(let i=-5;i<=5;i++){
    ctx.beginPath();ctx.moveTo(cx-s*0.6+i*step,cy-s*0.6);ctx.lineTo(cx+i*step,cy+s*0.6);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx+s*0.6-i*step,cy-s*0.6);ctx.lineTo(cx-i*step,cy+s*0.6);ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle='#607d8b'; ctx.lineWidth=s*0.08;
  ctx.beginPath();ctx.ellipse(cx,cy,s*0.52,s*0.52,0,0,Math.PI*2);ctx.stroke();
  ctx.lineWidth=s*0.1;
  ctx.beginPath();ctx.moveTo(cx,cy-s*0.52);ctx.lineTo(cx+s*0.24,cy-s*0.82);ctx.stroke();
  ctx.restore();
}

// ==========================================================
// MAZE RENDERER (internal)
// ==========================================================
function renderMazeOnBounds(ctx, x, y, w, h, mc) {
  const {
    cols, rows, seed, wallColor, accentColor,
    wallThickness = 3, algo, exitPos: exitPos_raw,
    bombs = 1, cannons = 1, fire = 0, beds = 1, tissues = 1,
    animals = 1, animalTypes = [],
    vehicles = 0, vehicleTypes = [],
    fruits = 0, fruitTypes = [],
    traps = 0,
    carStyle = 'random', showFinishCat = true, showKetchup = true,
  } = mc;
  const exitPos = exitPos_raw === 'random' ? ['BR','TR','BL'][(seed||1)%3] : exitPos_raw;

  const g = algo === 'wilson' ? mazeWilson(cols, rows, seed) : mazePrim(cols, rows, seed);

  let endCell;
  if (exitPos === 'BR') endCell = [cols-1, rows-1];
  else if (exitPos === 'TR') endCell = [cols-1, 0];
  else endCell = [0, rows-1];

  const path = findPath(g, cols, rows, [0,0], endCell);

  let bombInfo = null;
  if (bombs >= 1) {
    bombInfo = findBombSetup(g, path, cols, rows);
    if (bombInfo) carveBombRoute(g, path, bombInfo);
  }

  // Scale from original 420×420 reference
  const scl = h / 420;
  const PAD = 18 * (w / 420);
  const LABH_TOP = ((exitPos === 'TR') ? 75 : 42) * scl;
  const LABH_BOT = ((exitPos === 'TR') ? 42 : 78) * scl;
  const mazeW = w - PAD * 2;
  const mazeH = h - LABH_TOP - LABH_BOT;
  const ox = x + PAD, oy = y + LABH_TOP;
  const cw = mazeW / cols, ch = mazeH / rows;

  // Background dots
  ctx.fillStyle = '#ececec';
  for (let r=0; r<=rows; r++) for (let c=0; c<=cols; c++) {
    ctx.beginPath(); ctx.arc(ox+c*cw, oy+r*ch, 1.2, 0, Math.PI*2); ctx.fill();
  }

  const baseWall = Math.max(1, wallThickness * scl * 0.8);
  ctx.strokeStyle = wallColor;
  ctx.lineWidth = baseWall * 1.17;
  ctx.lineCap = 'butt';

  // Outer border with gaps for start and exit
  if (exitPos === 'TR') {
    ctx.beginPath(); ctx.moveTo(ox+cw, oy); ctx.lineTo(ox+(cols-1)*cw, oy); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(ox+cw, oy); ctx.lineTo(ox+cols*cw, oy); ctx.stroke();
  }
  if (exitPos === 'BR') {
    ctx.beginPath(); ctx.moveTo(ox, oy+mazeH); ctx.lineTo(ox+(cols-1)*cw, oy+mazeH); ctx.stroke();
  } else if (exitPos === 'BL') {
    ctx.beginPath(); ctx.moveTo(ox+cw, oy+mazeH); ctx.lineTo(ox+cols*cw, oy+mazeH); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(ox, oy+mazeH); ctx.lineTo(ox+cols*cw, oy+mazeH); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy+mazeH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox+cols*cw, oy); ctx.lineTo(ox+cols*cw, oy+mazeH); ctx.stroke();

  // Interior walls
  ctx.lineWidth = baseWall;
  for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
    const wx = ox+c*cw, wy = oy+r*ch;
    if (!(g[r][c] & S)) {
      const isExit = (exitPos==='BR'&&r===rows-1&&c===cols-1)||(exitPos==='BL'&&r===rows-1&&c===0);
      if (!isExit) { ctx.beginPath(); ctx.moveTo(wx,wy+ch); ctx.lineTo(wx+cw,wy+ch); ctx.stroke(); }
    }
    if (!(g[r][c] & E)) {
      ctx.beginPath(); ctx.moveTo(wx+cw,wy); ctx.lineTo(wx+cw,wy+ch); ctx.stroke();
    }
  }

  const usedKeys = new Set();

  // Route bomb
  if (bombInfo) {
    const [bx,by] = bombInfo.bombCell;
    const r = Math.min(cw,ch)*0.28;
    ctx.save(); ctx.beginPath(); ctx.rect(ox+bx*cw+1, oy+by*ch+1, cw-2, ch-2); ctx.clip();
    drawBomb(ctx, ox+bx*cw+cw*0.5, oy+by*ch+ch*0.5, r);
    ctx.restore();
    usedKeys.add(by*cols+bx);
  }

  // Extra dead-end bombs
  const extraBombs = Math.max(0, bombs - 1);
  if (extraBombs > 0) {
    const cells = findDeadEndBombs(g, path, cols, rows, seed, extraBombs + 3);
    let placed = 0;
    for (const [bx,by] of cells) {
      if (placed >= extraBombs) break;
      const key = by*cols+bx;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key); placed++;
      const r = Math.min(cw,ch)*0.28;
      ctx.save(); ctx.beginPath(); ctx.rect(ox+bx*cw+1, oy+by*ch+1, cw-2, ch-2); ctx.clip();
      drawBomb(ctx, ox+bx*cw+cw*0.5, oy+by*ch+ch*0.5, r);
      ctx.restore();
    }
  }

  // Cannons
  if (cannons > 0) {
    const cells = findDeadEndBombs(g, path, cols, rows, seed+11111, cannons+4);
    let placed = 0;
    for (const [bx,by] of cells) {
      if (placed >= cannons) break;
      const key = by*cols+bx;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key); placed++;
      const sz = Math.min(cw,ch)*0.36;
      ctx.save(); ctx.beginPath(); ctx.rect(ox+bx*cw+1, oy+by*ch+1, cw-2, ch-2); ctx.clip();
      drawCannon(ctx, ox+bx*cw+cw*0.5, oy+by*ch+ch*0.5, sz);
      ctx.restore();
    }
  }

  // Fire
  if (fire > 0) {
    const cells = findDeadEndBombs(g, path, cols, rows, seed+77777, fire+4);
    let placed = 0;
    for (const [bx,by] of cells) {
      if (placed >= fire) break;
      const key = by*cols+bx;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key); placed++;
      const sz = Math.min(cw,ch)*0.34;
      ctx.save(); ctx.beginPath(); ctx.rect(ox+bx*cw+1, oy+by*ch+1, cw-2, ch-2); ctx.clip();
      drawFire(ctx, ox+bx*cw+cw*0.5, oy+by*ch+ch*0.5, sz);
      ctx.restore();
    }
  }

  // Beds
  if (beds > 0) {
    const cells = findDeadEndBombs(g, path, cols, rows, seed+22222, beds+4);
    let placed = 0;
    for (const [bx,by] of cells) {
      if (placed >= beds) break;
      const key = by*cols+bx;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key); placed++;
      const sz = Math.min(cw,ch)*0.38;
      ctx.save(); ctx.beginPath(); ctx.rect(ox+bx*cw+1, oy+by*ch+1, cw-2, ch-2); ctx.clip();
      drawBed(ctx, ox+bx*cw+cw*0.5, oy+by*ch+ch*0.5, sz);
      ctx.restore();
    }
  }

  // Tissues
  if (tissues > 0) {
    const cells = findDeadEndBombs(g, path, cols, rows, seed+44444, tissues+4);
    let placed = 0;
    for (const [bx,by] of cells) {
      if (placed >= tissues) break;
      const key = by*cols+bx;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key); placed++;
      const sz = Math.min(cw,ch)*0.36;
      ctx.save(); ctx.beginPath(); ctx.rect(ox+bx*cw+1, oy+by*ch+1, cw-2, ch-2); ctx.clip();
      drawTissue(ctx, ox+bx*cw+cw*0.5, oy+by*ch+ch*0.5, sz);
      ctx.restore();
    }
  }

  // Traps (dead ends)
  if (traps > 0) {
    const trapFns = [drawBearTrap, drawCage, drawNet];
    const cells = findDeadEndBombs(g, path, cols, rows, seed+99999, traps+4);
    let placed = 0;
    for (const [tx,ty] of cells) {
      if (placed >= traps) break;
      const key = ty*cols+tx;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key); placed++;
      const sz = Math.min(cw,ch)*0.36;
      const trapFn = trapFns[(seed+placed) % trapFns.length];
      ctx.save(); ctx.beginPath(); ctx.rect(ox+tx*cw+1, oy+ty*ch+1, cw-2, ch-2); ctx.clip();
      trapFn(ctx, ox+tx*cw+cw*0.5, oy+ty*ch+ch*0.5, sz);
      ctx.restore();
    }
  }

  // Animals along path
  const ANIMAL_MAP = { hamster: drawHamster, penguin: drawPenguin, fox: drawFox, frog: drawFrog, bunny: drawBunnyA, owl: drawOwl };
  const pool = (animalTypes && animalTypes.length > 0)
    ? animalTypes.map(t => ANIMAL_MAP[t]).filter(Boolean)
    : Object.values(ANIMAL_MAP);

  if (animals > 0 && pool.length > 0) {
    const rngA = mkRng(seed + 33333);
    const shuffled = [...pool];
    for (let i=shuffled.length-1; i>0; i--) {
      const j=0|rngA()*(i+1); [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];
    }
    const step = Math.max(1, Math.floor((path.length - 2) / (animals + 1)));
    let placed = 0;
    for (let k=0; k<animals && placed<animals; k++) {
      const idx = step * (k + 1);
      const [ax,ay] = path[Math.min(idx, path.length-2)];
      const key = ay*cols+ax;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key); placed++;
      const animalScale = cols >= 12 ? 0.52 : cols >= 10 ? 0.46 : 0.34;
      const sz = Math.min(cw,ch) * animalScale;
      ctx.save(); ctx.beginPath(); ctx.rect(ox+ax*cw+1, oy+ay*ch+1, cw-2, ch-2); ctx.clip();
      shuffled[k % shuffled.length](ctx, ox+ax*cw+cw*0.5, oy+ay*ch+ch*0.5, sz);
      ctx.restore();
    }
  }

  // Vehicles along path
  const VEHICLE_MAP = { firetruck: drawFiretruck, police: drawPolice, ambulance: drawAmbulance, crane: drawCrane, tractor: drawTractor, tank: drawTank };
  const vPool = (vehicleTypes && vehicleTypes.length > 0)
    ? vehicleTypes.map(t => VEHICLE_MAP[t]).filter(Boolean)
    : Object.values(VEHICLE_MAP);
  if (vehicles > 0 && vPool.length > 0) {
    const rngV = mkRng(seed + 55555);
    const vShuffled = [...vPool];
    for (let i=vShuffled.length-1; i>0; i--) {
      const j=0|rngV()*(i+1); [vShuffled[i],vShuffled[j]]=[vShuffled[j],vShuffled[i]];
    }
    const vStep = Math.max(1, Math.floor((path.length - 2) / (vehicles + animals + 1)));
    let vPlaced = 0;
    for (let k=0; k<vehicles && vPlaced<vehicles; k++) {
      const idx = vStep * (k + 1 + animals);
      const [vx,vy] = path[Math.min(idx, path.length-2)];
      const key = vy*cols+vx;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key); vPlaced++;
      const sz = Math.min(cw,ch) * (cols >= 12 ? 0.52 : cols >= 10 ? 0.46 : 0.38);
      ctx.save(); ctx.beginPath(); ctx.rect(ox+vx*cw+1, oy+vy*ch+1, cw-2, ch-2); ctx.clip();
      vShuffled[k % vShuffled.length](ctx, ox+vx*cw+cw*0.5, oy+vy*ch+ch*0.5, sz);
      ctx.restore();
    }
  }

  // Fruits along path
  const FRUIT_MAP = { apple: drawApple, banana: drawBanana, carrot: drawCarrot, strawberry: drawStrawberry, pear: drawPear, watermelon: drawWatermelon };
  const fPool = (fruitTypes && fruitTypes.length > 0)
    ? fruitTypes.map(t => FRUIT_MAP[t]).filter(Boolean)
    : Object.values(FRUIT_MAP);
  if (fruits > 0 && fPool.length > 0) {
    const rngF = mkRng(seed + 66666);
    const fShuffled = [...fPool];
    for (let i=fShuffled.length-1; i>0; i--) {
      const j=0|rngF()*(i+1); [fShuffled[i],fShuffled[j]]=[fShuffled[j],fShuffled[i]];
    }
    const fStep = Math.max(1, Math.floor((path.length - 2) / (fruits + animals + vehicles + 1)));
    let fPlaced = 0;
    for (let k=0; k<fruits && fPlaced<fruits; k++) {
      const idx = fStep * (k + 1 + animals + vehicles);
      const [fx,fy] = path[Math.min(idx, path.length-2)];
      const key = fy*cols+fx;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key); fPlaced++;
      const sz = Math.min(cw,ch)*0.38;
      ctx.save(); ctx.beginPath(); ctx.rect(ox+fx*cw+1, oy+fy*ch+1, cw-2, ch-2); ctx.clip();
      fShuffled[k % fShuffled.length](ctx, ox+fx*cw+cw*0.5, oy+fy*ch+ch*0.5, sz);
      ctx.restore();
    }
  }

  // Car at start
  const carDrawers = [drawCar1, drawCar2, drawCar3, drawCar4, drawCar5];
  const carFn = carStyle === 'random'
    ? carDrawers[seed % 5]
    : carDrawers[Math.max(0, (Number(carStyle)-1)) % 5];
  const startX = ox + cw * 0.5;
  carFn(ctx, startX, oy - LABH_TOP * 0.55, LABH_TOP * 0.36);

  // START label + arrow
  ctx.save();
  ctx.fillStyle = accentColor;
  ctx.font = `bold ${Math.max(8, LABH_TOP * 0.26)}px "Fredoka One", cursive`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('СТАРТ', startX, oy - 10*scl);
  ctx.beginPath();
  ctx.moveTo(startX-7*scl, oy-3*scl);
  ctx.lineTo(startX+7*scl, oy-3*scl);
  ctx.lineTo(startX, oy);
  ctx.closePath(); ctx.fill();
  ctx.restore();

  // FINISH label + arrow + cat + ketchup
  let finX, finArrowDir, finLabelY, finCatY;
  if (exitPos === 'BR') {
    finX = ox+(cols-0.5)*cw; finArrowDir='down';
    finLabelY = oy+mazeH+18*scl; finCatY = oy+mazeH+38*scl;
  } else if (exitPos === 'TR') {
    finX = ox+(cols-0.5)*cw; finArrowDir='up';
    finLabelY = oy-28*scl; finCatY = oy-50*scl;
  } else {
    finX = ox+cw*0.5; finArrowDir='down';
    finLabelY = oy+mazeH+18*scl; finCatY = oy+mazeH+38*scl;
  }

  ctx.save();
  ctx.fillStyle = '#ff8c00';
  ctx.font = `bold ${Math.max(8, 13*scl)}px "Fredoka One", cursive`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (finArrowDir === 'down') {
    ctx.beginPath();
    ctx.moveTo(finX-8*scl, oy+mazeH+1*scl); ctx.lineTo(finX+8*scl, oy+mazeH+1*scl); ctx.lineTo(finX, oy+mazeH+9*scl);
    ctx.closePath(); ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(finX-8*scl, oy-1*scl); ctx.lineTo(finX+8*scl, oy-1*scl); ctx.lineTo(finX, oy-9*scl);
    ctx.closePath(); ctx.fill();
  }
  ctx.fillText('ФИНИШ', finX, finLabelY);
  ctx.restore();

  if (showKetchup) drawKetchup(ctx, finX, finCatY + 10*scl, 11*scl);
  if (showFinishCat) drawFinishCat(ctx, finX, finCatY, 13*scl);
}

// ==========================================================
// LEVEL STARS
// ==========================================================
function levelStars(cols, rows) {
  const d = Math.max(cols, rows);
  if (d <= 8)  return '⭐⭐';
  if (d <= 10) return '⭐⭐⭐';
  if (d <= 12) return '⭐⭐⭐⭐';
  return '⭐⭐⭐⭐⭐';
}

// ==========================================================
// PAGE RENDERER (exported)
// ==========================================================
export function renderPage(ctx, config, pageIndex) {
  const {
    cols = 9, rows = 9, algorithm = 'prim', exitPos = 'BR',
    seed: baseSeed = 1, wallColor = '#1565c0', accentColor = '#1e88e5',
    wallThickness = 3, bombs = 1, cannons = 1, fire = 0,
    beds = 1, tissues = 1, animals = 1, animalTypes = [],
    vehicles = 0, vehicleTypes = [],
    fruits = 0, fruitTypes = [],
    traps = 0,
    carStyle = 'random', showFinishCat = true, showKetchup = true,
    mazePerPage = 2, pageTitle = 'Лабиринты', levelStartNumber = 1,
    pages = 1,
  } = config;

  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const mm = H / 297;
  const pt = mm * 0.353;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);

  const padTop  = 9 * mm;
  const padSide = 10 * mm;
  const padBot  = 7 * mm;
  const cntW    = W - 2 * padSide;

  let curY = padTop;

  // Title
  if (pageTitle) {
    const titleSz = 20 * pt;
    ctx.fillStyle = accentColor;
    ctx.font = `bold ${titleSz}px "Fredoka One", cursive`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(pageTitle, W/2, curY);
    curY += titleSz * 1.2 + 1 * mm;
  }

  // Hint
  const hintSz = 7.5 * pt;
  ctx.fillStyle = '#aaa';
  ctx.font = `${hintSz}px "Nunito", sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('🚗 Выбери машинку! Спаси животное 🐾 Берегись бомб и пушек! Найди безопасный маршрут до финиша.', W/2, curY);
  curY += hintSz + 3 * mm;

  // Top divider
  const drawDivider = (yPos, alpha = '99') => {
    const grad = ctx.createLinearGradient(padSide, 0, W-padSide, 0);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, accentColor + alpha);
    grad.addColorStop(1, 'transparent');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(padSide*0.5, yPos); ctx.lineTo(W-padSide*0.5, yPos); ctx.stroke();
  };
  drawDivider(curY);
  curY += 4 * mm;

  // Calculate maze areas
  const labelH   = 8 * mm;
  const midDivH  = mazePerPage > 1 ? 5 * mm : 0;
  const footerH  = 5 * mm;
  const totalMazeH = H - padBot - footerH - curY - labelH * mazePerPage - midDivH * (mazePerPage - 1);
  const eachMazeH  = totalMazeH / mazePerPage;

  for (let i = 0; i < mazePerPage; i++) {
    const globalIdx = pageIndex * mazePerPage + i;
    const mazeSeed  = (baseSeed || 1) + globalIdx;
    const algo      = getAlgo(algorithm, globalIdx);
    const levelNum  = levelStartNumber + globalIdx;
    const stars     = levelStars(cols, rows);

    // Level label
    const lblSz = 11 * pt;
    ctx.fillStyle = accentColor;
    ctx.font = `bold ${lblSz}px "Fredoka One", cursive`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(`${stars} Уровень ${levelNum}`, W/2, curY);
    curY += labelH;

    renderMazeOnBounds(ctx, padSide, curY, cntW, eachMazeH, {
      cols, rows, seed: mazeSeed, wallColor, accentColor, wallThickness,
      algo, exitPos, bombs, cannons, fire, beds, tissues,
      animals, animalTypes, vehicles, vehicleTypes, fruits, fruitTypes, traps,
      carStyle, showFinishCat, showKetchup,
    });

    curY += eachMazeH;

    if (i < mazePerPage - 1) {
      curY += 1 * mm;
      drawDivider(curY, '44');
      curY += midDivH - 1 * mm;
    }
  }

  // Footer
  const footSz = 7.5 * pt;
  const footY = H - padBot - footerH + mm;
  ctx.fillStyle = '#bbb';
  ctx.font = `${footSz}px "Fredoka One", cursive`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(`✦ Sprunki Mazes — Страница ${pageIndex+1} из ${pages} ✦`, W/2, footY);
}

// ==========================================================
// RENDER ALL PAGES (for print HTML — called as inline script)
// ==========================================================
export function renderAllPages(config) {
  const { pages: pageCount = 1 } = config;
  // A4 at 150dpi: 1240×1754 px
  const PW = 1240, PH = 1754;

  for (let i = 0; i < pageCount; i++) {
    const canvas = document.createElement('canvas');
    canvas.width  = PW;
    canvas.height = PH;
    canvas.style.cssText = `display:block;width:210mm;height:297mm;page-break-after:always;`;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    renderPage(ctx, config, i);
  }
}
