import { useState, useEffect } from 'react';
const STORAGE_KEY = 'missingConfig_v1';
const ALL_SHAPES = ['bunny','cat','dog','bear','frog','duck','elephant','owl','fish','turtle','hedgehog','penguin','butterfly','mushroom','flower','house','star','heart','snowman','sun','robot','penguin','sprunkiOrange','sprunkiRed','sprunkiFunBot','sprunkiGreen','sprunkiPurple','sprunkiPinki','sprunkiBlack','sprunkiTan','sprunkiYellow'];
const DEFAULT_CONFIG = { shape:'bunny', shapes:[...ALL_SHAPES], showHint:true, pageTitle:'Чего не хватает?', accentColor:'#ff9800', seed:0, pages:1 };
function load() { try { const r=localStorage.getItem(STORAGE_KEY); if(r) return {...DEFAULT_CONFIG,...JSON.parse(r)}; } catch{} return DEFAULT_CONFIG; }
export function useMissingConfig() {
  const [config, setRaw] = useState(load);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch{} }, [config]);
  function setConfig(patch) { setRaw(prev=>({...prev,...(typeof patch==='function'?patch(prev):patch)})); }
  return { config, setConfig };
}
