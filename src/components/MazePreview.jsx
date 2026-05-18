import { useEffect, useRef, useState } from 'react';
import { renderPage } from '../mazeRenderer.js';

const PREVIEW_W = 794;
const PREVIEW_H = 1123;

const SPRUNKI_CHARS = [
  'OrenNormal','RaddyNormal','ClukrNormal','FunbotNormal',
  'VineriaNormal','GrayNormal','BrudNormal','GarnoldNormal',
  'OwakcxNormal','SkyNormal','MrSunNormal','DurpleNormal',
  'MrTreeNormal','SimonNormal','TunnerNormal','MrFunComputerNormal',
  'WendaNormal','PinkiNormal','JevinNormal','BlackNormal',
];

function loadSprunkiImages() {
  const imgs = {};
  let pending = SPRUNKI_CHARS.length;
  return new Promise(res => {
    SPRUNKI_CHARS.forEach(name => {
      const img = new Image();
      img.onload = () => { imgs[name] = img; if (--pending === 0) res(imgs); };
      img.onerror = () => { if (--pending === 0) res(imgs); };
      img.src = `/sprunki/${name}.svg`;
    });
  });
}

export default function MazePreview({ config }) {
  const canvasRef = useRef(null);
  const [sprunkiImages, setSprunkiImages] = useState({});

  useEffect(() => {
    loadSprunkiImages().then(setSprunkiImages);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = PREVIEW_W;
    canvas.height = PREVIEW_H;
    const ctx = canvas.getContext('2d');
    const effectiveSeed = config.seed || Math.floor(Math.random() * 99999) + 1;
    document.fonts.ready.then(() => {
      renderPage(ctx, { ...config, seed: effectiveSeed, pages: config.pages || 1, sprunkiImages }, 0);
    });
  }, [config, sprunkiImages]);

  return (
    <div style={{ width: '100%', aspectRatio: '210/297', background: '#e0e0e0', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.18)' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
