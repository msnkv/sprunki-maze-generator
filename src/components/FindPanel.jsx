const ALL_SHAPES = [
  { key: 'bunny',     label: '🐰 Зайка' },
  { key: 'cat',       label: '🐱 Кошка' },
  { key: 'house',     label: '🏠 Домик' },
  { key: 'tree',      label: '🌲 Ёлочка' },
  { key: 'butterfly', label: '🦋 Бабочка' },
  { key: 'star',      label: '⭐ Звёздочка' },
  { key: 'heart',     label: '❤️ Сердечко' },
  { key: 'snowman',   label: '⛄ Снеговик' },
  { key: 'sun',       label: '☀️ Солнышко' },
  { key: 'penguin',   label: '🐧 Пингвин' },
  { key: 'robot',     label: '🤖 Робот' },
  { key: 'alien',     label: '👽 Пришелец' },
  { key: 'turtle',    label: '🐢 Черепаха' },
  { key: 'hedgehog',  label: '🦔 Ёжик' },
  { key: 'octopus',   label: '🐙 Осьминог' },
  { key: 'minion',    label: '💛 Миньон' },
  { key: 'pikachu',   label: '⚡ Пикачу' },
];

const DIFFICULTIES = [
  { value: 1, label: '😊 Легко',  desc: 'большие фигуры, мало шума' },
  { value: 2, label: '🤔 Средне', desc: 'средние фигуры' },
  { value: 3, label: '😤 Сложно', desc: 'маленькие, много шума' },
];

export default function FindPanel({ config, setConfig, children }) {
  function toggleShape(key) {
    const cur = config.availableShapes || [];
    const next = cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key];
    if (next.length > 0) setConfig({ availableShapes: next });
  }

  return (
    <div style={panelStyle}>
      <h2 style={titleStyle}>🔍 Спаси друга</h2>

      <Section title="1. Игра">
        <SliderField
          label={`Спрятано персонажей: ${config.hiddenCount}`}
          value={config.hiddenCount} min={2} max={6}
          onChange={v => setConfig({ hiddenCount: v })}
        />

        <Label>Сложность</Label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {DIFFICULTIES.map(d => (
            <button key={d.value} onClick={() => setConfig({ difficulty: d.value })}
              style={diffBtn(config.difficulty === d.value, d.value)}>
              {d.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#888', marginTop: -4, marginBottom: 8 }}>
          {DIFFICULTIES.find(d => d.value === config.difficulty)?.desc}
        </div>

        <ToggleRow label="💡 Подсказка (кого искать)" checked={config.showHint}
          onChange={() => setConfig({ showHint: !config.showHint })} />
      </Section>

      <Section title="2. Персонажи">
        <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>
          Отмеченные могут появиться на странице
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {ALL_SHAPES.map(s => {
            const active = (config.availableShapes || []).includes(s.key);
            return (
              <button key={s.key} onClick={() => toggleShape(s.key)}
                style={chipBtn(active)}>
                {s.label}
              </button>
            );
          })}
        </div>
        <button onClick={() => setConfig({ availableShapes: ALL_SHAPES.map(s => s.key) })}
          style={smallBtn}>Выбрать все</button>
      </Section>

      <Section title="3. Страница">
        <SliderField label={`Страниц: ${config.pages}`} value={config.pages} min={1} max={10}
          onChange={v => setConfig({ pages: v })} />

        <Label>Заголовок</Label>
        <input type="text" value={config.pageTitle}
          onChange={e => setConfig({ pageTitle: e.target.value })}
          style={{ ...inputStyle, width: '100%', marginBottom: 8 }} />

        <Label>Акцентный цвет</Label>
        <input type="color" value={config.accentColor}
          onChange={e => setConfig({ accentColor: e.target.value })}
          style={{ width: '100%', height: 36, cursor: 'pointer', border: 'none', borderRadius: 6 }} />
      </Section>

      <Section title="4. Экспорт">
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
  padding: '6px 8px', borderRadius: 6, border: '1px solid #ccc', fontSize: 13,
};

function chipBtn(active) {
  return {
    padding: '4px 9px', borderRadius: 20,
    border: `1px solid ${active ? '#e53935' : '#ccc'}`,
    background: active ? '#e53935' : '#fff',
    color: active ? '#fff' : '#333',
    fontSize: 12, cursor: 'pointer',
  };
}

const diffColors = ['#43a047', '#f9a825', '#e53935'];
function diffBtn(active, value) {
  const color = diffColors[value - 1];
  return {
    flex: 1, padding: '6px 4px', borderRadius: 8,
    border: `1px solid ${active ? color : '#ccc'}`,
    background: active ? color : '#fff',
    color: active ? '#fff' : '#333',
    fontSize: 12, cursor: 'pointer',
  };
}

const smallBtn = {
  marginTop: 8, padding: '4px 10px', fontSize: 12, cursor: 'pointer',
  border: '1px solid #ccc', borderRadius: 6, background: '#f5f5f5',
};
