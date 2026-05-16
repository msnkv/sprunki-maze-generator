import { useEffect, useRef } from 'react';
import { renderPage } from '../mazeRenderer.js';

// A4 aspect ratio preview canvas
const PREVIEW_W = 794;
const PREVIEW_H = 1123;

export default function MazePreview({ config }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = PREVIEW_W;
    canvas.height = PREVIEW_H;
    const ctx = canvas.getContext('2d');

    const effectiveSeed = config.seed || Math.floor(Math.random() * 99999) + 1;

    document.fonts.ready.then(() => {
      renderPage(ctx, { ...config, seed: effectiveSeed, pages: config.pages || 1 }, 0);
    });
  }, [config]);

  return (
    <div style={{ width: '100%', aspectRatio: '210/297', background: '#e0e0e0', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.18)' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
