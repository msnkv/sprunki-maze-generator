import { useState, useEffect } from 'react';

const STORAGE_KEY = 'findConfig_v1';

const ALL_SHAPES = [
  'bunny','cat','house','tree','butterfly','star','heart',
  'snowman','sun','penguin','robot','alien','turtle','hedgehog',
  'octopus','minion','pikachu',
];

const DEFAULT_CONFIG = {
  hiddenCount: 3,
  difficulty: 2,
  showHint: true,
  availableShapes: [...ALL_SHAPES],
  pages: 1,
  pageTitle: 'Спаси друга',
  accentColor: '#e53935',
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_CONFIG;
}

export function useFindConfig() {
  const [config, setConfigRaw] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch {}
  }, [config]);

  function setConfig(patch) {
    setConfigRaw(prev => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }

  return { config, setConfig };
}
