import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { renderPage } from '../mazeRenderer.js';
import rendererSrc from '../mazeRenderer.js?raw';

const A4_W_MM = 210, A4_H_MM = 297;
const MM_TO_PX_96DPI = 3.7795;

function buildPrintHTML(config) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>${config.pageTitle || 'Лабиринты'}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;900&display=swap">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#ccc; }
  canvas { display:block; width:210mm; height:297mm; page-break-after:always; margin:12px auto; box-shadow:0 4px 20px rgba(0,0,0,0.2); background:white; }
  @media print {
    body { background:white; }
    canvas { margin:0; box-shadow:none; page-break-after:always; }
  }
</style>
</head>
<body>
<script type="module">
${rendererSrc}
document.fonts.ready.then(() => renderAllPages(${JSON.stringify(config)}));
<\/script>
</body>
</html>`;
}

async function doPDF(config, setStatus) {
  setStatus('generating');
  try {
    const seed = config.seed || (Math.floor(Math.random() * 99999) + 1);
    const cfg  = { ...config, seed };

    const scale = 3;
    const pw = Math.round(A4_W_MM * MM_TO_PX_96DPI * scale);
    const ph = Math.round(A4_H_MM * MM_TO_PX_96DPI * scale);

    const pdf = new jsPDF({ format: 'a4', unit: 'mm', orientation: 'portrait' });

    await document.fonts.ready;

    for (let i = 0; i < (config.pages || 1); i++) {
      const canvas = document.createElement('canvas');
      canvas.width  = pw;
      canvas.height = ph;
      const ctx = canvas.getContext('2d');
      // No ctx.scale() — renderPage uses canvas.width/height directly.
      // Larger canvas = higher DPI output, renderer adapts automatically.
      renderPage(ctx, { ...cfg, pages: config.pages || 1 }, i);

      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, A4_W_MM, A4_H_MM);
    }

    pdf.save(`mazes-${seed}.pdf`);
  } finally {
    setStatus('idle');
  }
}

function doSaveHTML(config) {
  const seed = config.seed || (Math.floor(Math.random() * 99999) + 1);
  const html = buildPrintHTML({ ...config, seed });
  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mazes-${seed}.html`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function doPrintHTML(config) {
  const seed = config.seed || (Math.floor(Math.random() * 99999) + 1);
  const html = buildPrintHTML({ ...config, seed });
  const blob = new Blob([html], { type: 'text/html' });
  const win = window.open(URL.createObjectURL(blob), '_blank');
  if (win) win.onload = () => { win.focus(); win.print(); };
}

export default function ExportButtons({ config, onRandomize }) {
  const [pdfStatus, setPdfStatus] = useState('idle');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button
        onClick={onRandomize}
        style={btnStyle('#4caf50')}
      >
        ♻️ Перегенерировать
      </button>

      <button
        onClick={() => doPDF(config, setPdfStatus)}
        disabled={pdfStatus === 'generating'}
        style={btnStyle('#1565c0', pdfStatus === 'generating')}
      >
        {pdfStatus === 'generating' ? '⏳ Генерация PDF...' : '📄 Скачать PDF'}
      </button>

      <button
        onClick={() => doPrintHTML(config)}
        style={btnStyle('#7b1fa2')}
      >
        🖨️ Открыть для печати
      </button>

      <button
        onClick={() => doSaveHTML(config)}
        style={btnStyle('#e65100')}
      >
        🌐 Сохранить HTML
      </button>
    </div>
  );
}

function btnStyle(color, disabled = false) {
  return {
    padding: '10px 16px',
    background: disabled ? '#ccc' : color,
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontFamily: '"Fredoka One", cursive',
    fontSize: 15,
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: '100%',
    transition: 'opacity 0.15s',
    opacity: disabled ? 0.6 : 1,
  };
}
