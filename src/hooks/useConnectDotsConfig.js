import { useState, useEffect } from 'react';
const STORAGE_KEY = 'connectDotsConfig_v1';
const ALL_SHAPES = ['bunny','cat','dog','bear','frog','duck','elephant','owl','fish','turtle','hedgehog','penguin','butterfly','mushroom','balloon','flower','house','tree','star','heart','car','rocket','snowman','sun','robot','sprunkiOrange','sprunkiRed','sprunkiSilver','sprunkiGreen','sprunkiPurple','sprunkiPinki','sprunkiBlack'];
const DEFAULT_CONFIG = { shapesPerPage:2, dotsCount:12, showFaintOutline:false, selectedShapes:[...ALL_SHAPES], pageTitle:'Соедини точки', accentColor:'#e91e63', seed:0, pages:1 };
function load() { try { const r=localStorage.getItem(STORAGE_KEY); if(r) return {...DEFAULT_CONFIG,...JSON.parse(r)}; } catch{} return DEFAULT_CONFIG; }
export function useConnectDotsConfig() {
  const [config, setRaw] = useState(load);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch{} }, [config]);
  function setConfig(patch) { setRaw(prev=>({...prev,...(typeof patch==='function'?patch(prev):patch)})); }
  return { config, setConfig };
}
