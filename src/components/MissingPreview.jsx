import { useEffect, useRef } from 'react';
import { renderMissingPage } from '../missingRenderer.js';

export default function MissingPreview({ config }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    document.fonts.ready.then(() => renderMissingPage(canvas.getContext('2d'), config, 0));
  }, [config]);

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
