import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mazeConfig_v1';

const DEFAULT_CONFIG = {
  cols: 9,
  rows: 9,
  algorithm: 'prim',
  exitPos: 'BR',
  seed: 0,
  bombs: 1,
  cannons: 1,
  fire: 0,
  beds: 1,
  tissues: 1,
  animals: 1,
  animalTypes: ['hamster', 'penguin', 'fox', 'frog', 'bunny', 'owl'],
  vehicles: 0,
  vehicleTypes: ['firetruck', 'police', 'ambulance', 'crane', 'tractor', 'tank'],
  fruits: 0,
  fruitTypes: ['apple', 'banana', 'carrot', 'strawberry', 'pear', 'watermelon'],
  traps: 0,
  carStyle: 'random',
  showFinishCat: true,
  showKetchup: true,
  pages: 1,
  mazePerPage: 2,
  pageTitle: 'Лабиринты Sprunki',
  levelStartNumber: 1,
  wallColor: '#1565c0',
  wallThickness: 3,
  accentColor: '#1e88e5',
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_CONFIG;
}

export function useMazeConfig() {
  const [config, setConfigRaw] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch {}
  }, [config]);

  function setConfig(patch) {
    setConfigRaw(prev => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }

  function randomize() {
    setConfig({ seed: Math.floor(Math.random() * 99999) + 1 });
  }

  return { config, setConfig, randomize };
}
