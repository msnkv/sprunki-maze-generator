import { useMazeConfig }  from './hooks/useMazeConfig.js';
import ControlPanel       from './components/ControlPanel.jsx';
import MazePreview        from './components/MazePreview.jsx';
import ExportButtons      from './components/ExportButtons.jsx';

export default function App() {
  const { config, setConfig, randomize } = useMazeConfig();

  return (
    <div style={layoutStyle}>
      <div style={sideStyle}>
        <ControlPanel config={config} setConfig={setConfig}>
          <ExportButtons config={config} onRandomize={randomize} />
        </ControlPanel>
      </div>

      <div style={previewStyle}>
        <div style={{ fontFamily: '"Fredoka One", cursive', fontSize: 16, color: '#888', marginBottom: 10, textAlign: 'center' }}>
          Превью первой страницы
        </div>
        <MazePreview config={config} />
      </div>
    </div>
  );
}

const layoutStyle = {
  display: 'flex',
  gap: 24,
  padding: 24,
  minHeight: '100vh',
  background: '#f0f0f0',
  boxSizing: 'border-box',
  alignItems: 'flex-start',
};

const sideStyle = {
  width: 340,
  flexShrink: 0,
  maxHeight: 'calc(100vh - 48px)',
  overflowY: 'auto',
  position: 'sticky',
  top: 24,
};

const previewStyle = {
  flex: 1,
  maxWidth: 500,
  margin: '0 auto',
};
