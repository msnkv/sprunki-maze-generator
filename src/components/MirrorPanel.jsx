const SHAPES = [
  { key: 'bunny',     label: '🐰 Зайка' },
  { key: 'cat',       label: '🐱 Кошка' },
  { key: 'house',     label: '🏠 Домик' },
  { key: 'tree',      label: '🌲 Ёлочка' },
  { key: 'butterfly', label: '🦋 Бабочка' },
  { key: 'star',      label: '⭐ Звёздочка' },
  { key: 'heart',     label: '❤️ Сердечко' },
  { key: 'sprunki',   label: '🎵 Спрунки' },
  { key: 'blippi',    label: '🧡 Блиппи' },
  { key: 'spongebob', label: '🧽 СпанчБоб' },
  { key: 'patrick',   label: '⭐ Патрик' },
  { key: 'omnom',     label: '🟢 Ам Ням' },
  { key: 'booba',     label: '💙 Буба' },
  { key: 'minion',   label: '💛 Миньон' },
  { key: 'pikachu',  label: '⚡ Пикачу' },
  { key: 'alien',    label: '👽 Пришелец' },
  { key: 'robot',    label: '🤖 Робот' },
  { key: 'snowman',  label: '⛄ Снеговик' },
  { key: 'sun',      label: '☀️ Солнышко' },
  { key: 'octopus',  label: '🐙 Осьминог' },
  { key: 'turtle',   label: '🐢 Черепаха' },
  { key: 'hedgehog', label: '🦔 Ёжик' },
  { key: 'penguin',  label: '🐧 Пингвин' },
];

export default function MirrorPanel({ config, setConfig, children }) {
  return (
    <div style={panelStyle}>
      <h2 style={titleStyle}>🪞 Зеркало</h2>

      <Section title="1. Рисунок">
        <Label>Персонаж</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {SHAPES.map(s => (
            <button key={s.key} onClick={() => setConfig({ shape: s.key })}
              style={chipBtn(config.shape === s.key)}>
              {s.label}
            </button>
          ))}
        </div>

        <SliderField
          label={`Толщина линии-подсказки: ${config.guideDots}`}
          value={config.guideDots} min={3} max={20}
          onChange={v => setConfig({ guideDots: v })}
        />
        <div style={{ fontSize: 11, color: '#888', marginTop: -4, marginBottom: 8 }}>
          3 = тонкая (сложнее), 20 = толстая (легче)
        </div>

        <ToggleRow label="💬 Подсказка снизу" checked={config.showHint} onChange={() => setConfig({ showHint: !config.showHint })} />
        <ToggleRow label="🔲 Сетка точек (правая сторона)" checked={config.showGrid} onChange={() => setConfig({ showGrid: !config.showGrid })} />
      </Section>

      <Section title="2. Страница">
        <SliderField label={`Страниц: ${config.pages}`} value={config.pages} min={1} max={10}
          onChange={v => setConfig({ pages: v })} />

        <Label>Заголовок</Label>
        <input type="text" value={config.pageTitle}
          onChange={e => setConfig({ pageTitle: e.target.value })}
          style={{ ...inputStyle, width: '100%', marginBottom: 8 }} />

        <Label>Акцентный цвет</Label>
        <input type="color" value={config.accentColor}
          onChange={e => setConfig({ accentColor: e.target.value })}
          style={{ width: '100%', height: 36, cursor: 'pointer', border: 'none', borderRadius: 6, marginBottom: 4 }} />
      </Section>

      <Section title="3. Экспорт">
        {children}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, paddingBottom: 4, borderBottom: '1px solid #e0e0e0' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontSize: 13, color: '#444', marginBottom: 4, marginTop: 8 }}>{children}</div>;
}

function SliderField({ label, value, min, max, onChange }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <Label>{label}</Label>
      <input type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', cursor: 'pointer', marginBottom: 2 }} />
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontSize: 13 }}>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: 18, height: 18, cursor: 'pointer' }} />
    </div>
  );
}

const panelStyle = {
  padding: '16px 18px', background: '#fafafa',
  borderRadius: 12, border: '1px solid #e0e0e0',
  overflowY: 'auto', fontFamily: 'system-ui, sans-serif',
};

const titleStyle = {
  fontFamily: '"Fredoka One", cursive', fontSize: 22, marginBottom: 16, color: '#333',
};

const inputStyle = {
  padding: '6px 8px', borderRadius: 6, border: '1px solid #ccc', fontSize: 13, flex: 1,
};

function chipBtn(active) {
  return {
    padding: '4px 10px', borderRadius: 20,
    border: `1px solid ${active ? '#9c27b0' : '#ccc'}`,
    background: active ? '#9c27b0' : '#fff',
    color: active ? '#fff' : '#333',
    fontSize: 12, cursor: 'pointer',
  };
}
