import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { renderMissingPage } from '../missingRenderer.js';
import missingSrc from '../missingRenderer.js?raw';

const A4_W = 210, A4_H = 297;

function buildHTML(config) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>${config.pageTitle || 'Чего не хватает?'}</title>
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
${missingSrc}
document.fonts.ready.then(() => renderMissingAllPages(${JSON.stringify(config)}));
<\/script>
</body>
</html>`;
}

async function doPDF(config, setStatus) {
  setStatus('generating');
  try {
    const scale = 3;
    const pw = Math.round(A4_W * 3.7795 * scale);
    const ph = Math.round(A4_H * 3.7795 * scale);
    const pdf = new jsPDF({ format: 'a4', unit: 'mm', orientation: 'portrait' });
    await document.fonts.ready;
    const shapes = config.shapes && config.shapes.length ? config.shapes : [config.shape || 'bunny'];
    for (let i = 0; i < (config.pages || 1); i++) {
      const canvas = document.createElement('canvas');
      canvas.width = pw; canvas.height = ph;
      const cfg = { ...config, shape: shapes[i % shapes.length] };
      renderMissingPage(canvas.getContext('2d'), cfg, i);
      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, A4_W, A4_H);
    }
    pdf.save(`missing-part.pdf`);
  } finally {
    setStatus('idle');
  }
}

function doPrint(config) {
  const win = window.open(URL.createObjectURL(new Blob([buildHTML(config)], { type: 'text/html' })), '_blank');
  if (win) win.onload = () => { win.focus(); win.print(); };
}

function doSave(config) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([buildHTML(config)], { type: 'text/html' }));
  a.download = `missing-part.html`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function MissingExportButtons({ config, setConfig }) {
  const [pdfStatus, setPdfStatus] = useState('idle');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button onClick={() => setConfig({ seed: (config.seed || 0) + 1 })} style={btn('#388e3c')}>
        🎲 Следующий персонаж
      </button>
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
