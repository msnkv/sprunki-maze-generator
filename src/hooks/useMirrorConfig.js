import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mirrorConfig_v1';

const DEFAULT_CONFIG = {
  shape: 'bunny',
  guideDots: 10,
  showHint: true,
  showGrid: true,
  pages: 1,
  pageTitle: 'Зеркальный художник',
  accentColor: '#9c27b0',
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_CONFIG;
}

export function useMirrorConfig() {
  const [config, setConfigRaw] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch {}
  }, [config]);

  function setConfig(patch) {
    setConfigRaw(prev => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }

  return { config, setConfig };
}
