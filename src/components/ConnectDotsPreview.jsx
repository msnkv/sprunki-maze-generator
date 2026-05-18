import { useEffect, useRef, useState } from 'react';
import { renderConnectDotsPage } from '../connectDotsRenderer.js';

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

export default function ConnectDotsPreview({ config }) {
  const canvasRef = useRef(null);
  const [sprunkiImages, setSprunkiImages] = useState({});

  useEffect(() => {
    loadSprunkiImages().then(setSprunkiImages);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    document.fonts.ready.then(() =>
      renderConnectDotsPage(canvas.getContext('2d'), { ...config, sprunkiImages }, 0)
    );
  }, [config, sprunkiImages]);

  return (
    <canvas
      ref={canvasRef}
      width={794}
      height={1123}
      style={{
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: 8,
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        background: '#fff',
      }}
    />
  );
}
