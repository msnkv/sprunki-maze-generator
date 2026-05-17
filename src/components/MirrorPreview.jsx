import { useEffect, useRef } from 'react';
import { renderMirrorPage } from '../mirrorRenderer.js';

export default function MirrorPreview({ config }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    document.fonts.ready.then(() => renderMirrorPage(ctx, config, 0));
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
