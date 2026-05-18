import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { renderMirrorPage } from '../mirrorRenderer.js';
import mirrorSrc from '../mirrorRenderer.js?raw';

const A4_W = 210, A4_H = 297, MM_PX = 3.7795;

const SPRUNKI_CHARS = [
  'OrenNormal','RaddyNormal','ClukrNormal','FunbotNormal',
  'VineriaNormal','GrayNormal','BrudNormal','GarnoldNormal',
  'OwakcxNormal','SkyNormal','MrSunNormal','DurpleNormal',
  'MrTreeNormal','SimonNormal','TunnerNormal','MrFunComputerNormal',
  'WendaNormal','PinkiNormal','JevinNormal','BlackNormal',
];

async function fetchSprunkiDataURIs() {
  const data = {};
  await Promise.all(SPRUNKI_CHARS.map(async name => {
    try {
      const resp = await fetch(`/sprunki/${name}.svg`);
      const text = await resp.text();
      data[name] = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(text)));
    } catch (e) {}
  }));
  return data;
}

async function loadSprunkiImages() {
  const imgs = {};
  await Promise.all(SPRUNKI_CHARS.map(name => new Promise(res => {
    const img = new Image();
    img.onload = () => { imgs[name] = img; res(); };
    img.onerror = res;
    img.src = `/sprunki/${name}.svg`;
  })));
  return imgs;
}

async function buildHTML(config) {
  const sprunkiData = await fetchSprunkiDataURIs();
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>${config.pageTitle || 'Зеркальный художник'}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;900&display=swap">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#ccc; }
  canvas { display:block; width:210mm; height:297mm; page-break-after:always; margin:12px auto; box-shadow:0 4px 20px rgba(0,0,0,0.2); background:white; }
  @media print { body { background:white; } canvas { margin:0; box-shadow:none; } }
</style>
</head>
<body>
<script type="module">
${mirrorSrc}
const SPRUNKI_DATA = ${JSON.stringify(sprunkiData)};
function loadSprunki() {
  const imgs = {}, entries = Object.entries(SPRUNKI_DATA);
  if (!entries.length) return Promise.resolve(imgs);
  let pending = entries.length;
  return new Promise(res => {
    entries.forEach(([name, src]) => {
      const img = new Image();
      img.onload = () => { imgs[name] = img; if (--pending === 0) res(imgs); };
      img.onerror = () => { if (--pending === 0) res(imgs); };
      img.src = src;
    });
  });
}
document.fonts.ready.then(async () => {
  const sprunkiImages = await loadSprunki();
  renderMirrorAllPages({...${JSON.stringify(config)}, sprunkiImages});
});
<\/script>
</body>
</html>`;
}

async function doPDF(config, setStatus) {
  setStatus('generating');
  try {
    const scale = 3;
    const pw = Math.round(A4_W * MM_PX * scale);
    const ph = Math.round(A4_H * MM_PX * scale);
    const pdf = new jsPDF({ format: 'a4', unit: 'mm', orientation: 'portrait' });
    await document.fonts.ready;
    const sprunkiImages = await loadSprunkiImages();
    for (let i = 0; i < (config.pages || 1); i++) {
      const canvas = document.createElement('canvas');
      canvas.width = pw; canvas.height = ph;
      renderMirrorPage(canvas.getContext('2d'), { ...config, sprunkiImages }, i);
      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, A4_W, A4_H);
    }
    pdf.save(`mirror-${config.shape || 'art'}.pdf`);
  } finally {
    setStatus('idle');
  }
}

async function doPrint(config) {
  const html = await buildHTML(config);
  const win = window.open(URL.createObjectURL(new Blob([html], { type: 'text/html' })), '_blank');
  if (win) win.onload = () => { win.focus(); win.print(); };
}

async function doSave(config) {
  const html = await buildHTML(config);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  a.download = `mirror-${config.shape || 'art'}.html`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function MirrorExportButtons({ config }) {
  const [pdfStatus, setPdfStatus] = useState('idle');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button onClick={() => doPDF(config, setPdfStatus)} disabled={pdfStatus === 'generating'}
        style={btn('#1565c0', pdfStatus === 'generating')}>
        {pdfStatus === 'generating' ? '⏳ Генерация PDF...' : '📄 Скачать PDF'}
      </button>
      <button onClick={() => doPrint(config)} style={btn('#7b1fa2')}>🖨️ Открыть для печати</button>
      <button onClick={() => doSave(config)} style={btn('#e65100')}>🌐 Сохранить HTML</button>
    </div>
  );
}

function btn(color, disabled = false) {
  return {
    padding: '10px 16px', background: disabled ? '#ccc' : color,
    color: 'white', border: 'none', borderRadius: 8,
    fontFamily: '"Fredoka One", cursive', fontSize: 15,
    cursor: disabled ? 'not-allowed' : 'pointer', width: '100%',
    opacity: disabled ? 0.6 : 1,
  };
}
