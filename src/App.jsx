import { useState } from 'react';
import { useMazeConfig }    from './hooks/useMazeConfig.js';
import { useMirrorConfig }  from './hooks/useMirrorConfig.js';
import { useFindConfig }    from './hooks/useFindConfig.js';
import ControlPanel         from './components/ControlPanel.jsx';
import MazePreview          from './components/MazePreview.jsx';
import ExportButtons        from './components/ExportButtons.jsx';
import MirrorPanel          from './components/MirrorPanel.jsx';
import MirrorPreview        from './components/MirrorPreview.jsx';
import MirrorExportButtons  from './components/MirrorExportButtons.jsx';
import FindPanel            from './components/FindPanel.jsx';
import FindPreview          from './components/FindPreview.jsx';
import FindExportButtons    from './components/FindExportButtons.jsx';

export default function App() {
  const [tab, setTab] = useState('maze');
  const maze   = useMazeConfig();
  const mirror = useMirrorConfig();
  const find   = useFindConfig();

  return (
    <div>
      <div style={tabBar}>
        <button onClick={() => setTab('maze')}   style={tabBtn(tab === 'maze')}>🌀 Лабиринты</button>
        <button onClick={() => setTab('mirror')} style={tabBtn(tab === 'mirror')}>🪞 Зеркальный художник</button>
        <button onClick={() => setTab('find')}   style={tabBtn(tab === 'find')}>🔍 Спаси друга</button>
      </div>

      {tab === 'maze' && (
        <div style={layout}>
          <div style={side}>
            <ControlPanel config={maze.config} setConfig={maze.setConfig}>
              <ExportButtons config={maze.config} onRandomize={maze.randomize} />
            </ControlPanel>
          </div>
          <div style={preview}>
            <div style={previewLabel}>Превью первой страницы</div>
            <MazePreview config={maze.config} />
          </div>
        </div>
      )}

      {tab === 'mirror' && (
        <div style={layout}>
          <div style={side}>
            <MirrorPanel config={mirror.config} setConfig={mirror.setConfig}>
              <MirrorExportButtons config={mirror.config} />
            </MirrorPanel>
          </div>
          <div style={preview}>
            <div style={previewLabel}>Превью первой страницы</div>
            <MirrorPreview config={mirror.config} />
          </div>
        </div>
      )}

      {tab === 'find' && (
        <div style={layout}>
          <div style={side}>
            <FindPanel config={find.config} setConfig={find.setConfig}>
              <FindExportButtons config={find.config} />
            </FindPanel>
          </div>
          <div style={preview}>
            <div style={previewLabel}>Превью первой страницы</div>
            <FindPreview config={find.config} />
          </div>
        </div>
      )}
    </div>
  );
}

const tabBar = {
  display: 'flex', gap: 8, padding: '12px 24px',
  background: '#e8e8e8', borderBottom: '2px solid #ddd',
};

function tabBtn(active) {
  return {
    padding: '8px 20px',
    background: active ? '#1565c0' : '#fff',
    color: active ? '#fff' : '#333',
    border: `1px solid ${active ? '#1565c0' : '#ccc'}`,
    borderRadius: 8,
    fontFamily: '"Fredoka One", cursive',
    fontSize: 15, cursor: 'pointer',
  };
}

const layout = {
  display: 'flex', gap: 24, padding: 24,
  minHeight: 'calc(100vh - 56px)',
  background: '#f0f0f0', boxSizing: 'border-box',
  alignItems: 'flex-start',
};

const side = {
  width: 340, flexShrink: 0,
  maxHeight: 'calc(100vh - 104px)',
  overflowY: 'auto', position: 'sticky', top: 24,
};

const preview = { flex: 1, maxWidth: 500, margin: '0 auto' };

const previewLabel = {
  fontFamily: '"Fredoka One", cursive', fontSize: 16,
  color: '#888', marginBottom: 10, textAlign: 'center',
};
