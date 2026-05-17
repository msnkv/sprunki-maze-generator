const ALL_SHAPES = [
  { key: 'bunny',        label: '🐰 Зайка' },
  { key: 'cat',          label: '🐱 Кошка' },
  { key: 'dog',          label: '🐶 Собачка' },
  { key: 'bear',         label: '🐻 Мишка' },
  { key: 'frog',         label: '🐸 Лягушка' },
  { key: 'duck',         label: '🦆 Утёнок' },
  { key: 'elephant',     label: '🐘 Слоник' },
  { key: 'owl',          label: '🦉 Совёнок' },
  { key: 'fish',         label: '🐟 Рыбка' },
  { key: 'turtle',       label: '🐢 Черепаха' },
  { key: 'hedgehog',     label: '🦔 Ёжик' },
  { key: 'penguin',      label: '🐧 Пингвин' },
  { key: 'butterfly',    label: '🦋 Бабочка' },
  { key: 'mushroom',     label: '🍄 Грибочек' },
  { key: 'balloon',      label: '🎈 Шарик' },
  { key: 'flower',       label: '🌸 Цветочек' },
  { key: 'house',        label: '🏠 Домик' },
  { key: 'tree',         label: '🌲 Ёлочка' },
  { key: 'star',         label: '⭐ Звёздочка' },
  { key: 'heart',        label: '❤️ Сердечко' },
  { key: 'car',          label: '🚗 Машинка' },
  { key: 'rocket',       label: '🚀 Ракета' },
  { key: 'snowman',      label: '⛄ Снеговик' },
  { key: 'sun',          label: '☀️ Солнышко' },
  { key: 'robot',        label: '🤖 Робот' },
  { key: 'sprunkiOrange',label: '🎵 Орен' },
  { key: 'sprunkiRed',   label: '🎵 Рэдди' },
  { key: 'sprunkiSilver',label: '🎵 Кликр' },
  { key: 'sprunkiGreen', label: '🎵 Винерия' },
  { key: 'sprunkiPurple',label: '🎵 Дурпл' },
  { key: 'sprunkiPinki', label: '🎵 Пинки' },
  { key: 'sprunkiBlack', label: '🎵 Блэк' },
];

const SPP_OPTIONS = [
  { value: 1, label: '1 (крупно)' },
  { value: 2, label: '2 (средне)' },
  { value: 4, label: '4 (мелко)' },
];

export default function ConnectDotsPanel({ config, setConfig, children }) {
  function toggleShape(key) {
    const cur = config.selectedShapes || [];
    const next = cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key];
    if (next.length > 0) setConfig({ selectedShapes: next });
  }

  return (
    <div style={panelStyle}>
      <h2 style={titleStyle}>✏️ Соедини точки</h2>

      <Section title="1. Макет">
        <Label>Рисунков на странице</Label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {SPP_OPTIONS.map(o => (
            <button key={o.value} onClick={() => setConfig({ shapesPerPage: o.value })}
              style={chipBtn(config.shapesPerPage === o.value)}>
              {o.label}
            </button>
          ))}
        </div>

        <SliderField
          label={`Точек для соединения: ${config.dotsCount}`}
          value={config.dotsCount} min={5} max={20}
          onChange={v => setConfig({ dotsCount: v })}
        />

        <ToggleRow
          label="👻 Показывать контур (подсказка)"
          checked={config.showFaintOutline}
          onChange={() => setConfig({ showFaintOutline: !config.showFaintOutline })}
        />
      </Section>

      <Section title="2. Рисунки">
        <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>
          Отмеченные могут появиться на странице
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {ALL_SHAPES.map(s => {
            const active = (config.selectedShapes || []).includes(s.key);
            return (
              <button key={s.key} onClick={() => toggleShape(s.key)}
                style={shapeChip(active)}>
                {s.label}
              </button>
            );
          })}
        </div>
        <button onClick={() => setConfig({ selectedShapes: ALL_SHAPES.map(s => s.key) })}
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
          style={{ width: '100%', height: 36, cursor: 'pointer', border: 'none', borderRadius: 6, marginBottom: 4 }} />
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
    flex: 1, padding: '6px 4px', borderRadius: 8,
    border: `1px solid ${active ? '#e91e63' : '#ccc'}`,
    background: active ? '#e91e63' : '#fff',
    color: active ? '#fff' : '#333',
    fontSize: 12, cursor: 'pointer',
  };
}

function shapeChip(active) {
  return {
    padding: '4px 9px', borderRadius: 20,
    border: `1px solid ${active ? '#e91e63' : '#ccc'}`,
    background: active ? '#e91e63' : '#fff',
    color: active ? '#fff' : '#333',
    fontSize: 12, cursor: 'pointer',
  };
}

const smallBtn = {
  marginTop: 8, padding: '4px 10px', fontSize: 12, cursor: 'pointer',
  border: '1px solid #ccc', borderRadius: 6, background: '#f5f5f5',
};
