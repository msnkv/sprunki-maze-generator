const PRESETS = [
  { label: 'Лёгкий',  cols: 7,  rows: 7  },
  { label: 'Средний', cols: 9,  rows: 9  },
  { label: 'Сложный', cols: 11, rows: 11 },
  { label: 'Эксперт', cols: 13, rows: 13 },
];

const ANIMAL_TYPES = [
  { key: 'hamster', label: 'Хомяк' },
  { key: 'penguin', label: 'Пингвин' },
  { key: 'fox',     label: 'Лиса' },
  { key: 'frog',    label: 'Лягушка' },
  { key: 'bunny',   label: 'Кролик' },
  { key: 'owl',     label: 'Сова' },
];

const VEHICLE_TYPES = [
  { key: 'firetruck', label: 'Пожарная' },
  { key: 'police',    label: 'Полиция' },
  { key: 'ambulance', label: 'Скорая' },
  { key: 'crane',     label: 'Кран' },
  { key: 'tractor',   label: 'Трактор' },
  { key: 'tank',      label: 'Танк' },
];

const FRUIT_TYPES = [
  { key: 'apple',      label: 'Яблоко' },
  { key: 'banana',     label: 'Банан' },
  { key: 'carrot',     label: 'Морковь' },
  { key: 'strawberry', label: 'Клубника' },
  { key: 'pear',       label: 'Груша' },
  { key: 'watermelon', label: 'Арбуз' },
];

export default function ControlPanel({ config, setConfig, children }) {
  function toggle(key) {
    setConfig({ [key]: !config[key] });
  }

  function toggleAnimal(key) {
    const cur = config.animalTypes || [];
    setConfig({ animalTypes: cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key] });
  }

  function toggleVehicle(key) {
    const cur = config.vehicleTypes || [];
    setConfig({ vehicleTypes: cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key] });
  }

  function toggleFruit(key) {
    const cur = config.fruitTypes || [];
    setConfig({ fruitTypes: cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key] });
  }

  return (
    <div style={panelStyle}>
      <h2 style={titleStyle}>⚙️ Настройки</h2>

      {/* ── 1. Основные параметры ── */}
      <Section title="1. Основные параметры">
        <Label>Размер</Label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => setConfig({ cols: p.cols, rows: p.rows })}
              style={presetBtn(config.cols === p.cols && config.rows === p.rows)}
            >
              {p.label} {p.cols}×{p.rows}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <SliderField label={`Cols: ${config.cols}`} value={config.cols} min={6} max={16}
            onChange={v => setConfig({ cols: v })} />
          <SliderField label={`Rows: ${config.rows}`} value={config.rows} min={6} max={16}
            onChange={v => setConfig({ rows: v })} />
        </div>

        <Label>Алгоритм</Label>
        <Select value={config.algorithm} onChange={v => setConfig({ algorithm: v })}>
          <option value="prim">Prim's (тупики)</option>
          <option value="wilson">Wilson's (коридоры)</option>
          <option value="mixed">Mixed (чередование)</option>
        </Select>

        <Label>Позиция финиша</Label>
        <Select value={config.exitPos} onChange={v => setConfig({ exitPos: v })}>
          <option value="BR">Право-Низ</option>
          <option value="TR">Право-Верх</option>
          <option value="BL">Лево-Низ</option>
          <option value="random">Случайно</option>
        </Select>

        <Label>Seed</Label>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="number" min={0} max={999999}
            value={config.seed}
            onChange={e => setConfig({ seed: Number(e.target.value) })}
            style={inputStyle}
          />
          <button
            onClick={() => setConfig({ seed: Math.floor(Math.random() * 99999) + 1 })}
            style={smallBtn}
          >🎲</button>
        </div>
      </Section>

      {/* ── 2. Объекты ── */}
      <Section title="2. Объекты в лабиринте">
        <SliderField label={`💣 Бомбы: ${config.bombs}`}      value={config.bombs}   min={0} max={3} onChange={v => setConfig({ bombs: v })} />
        <SliderField label={`🔫 Пушки: ${config.cannons}`}    value={config.cannons} min={0} max={2} onChange={v => setConfig({ cannons: v })} />
        <SliderField label={`🔥 Огонь: ${config.fire}`}       value={config.fire}    min={0} max={2} onChange={v => setConfig({ fire: v })} />
        <SliderField label={`🛏️ Кровати: ${config.beds}`}     value={config.beds}    min={0} max={2} onChange={v => setConfig({ beds: v })} />
        <SliderField label={`🤧 Салфетки: ${config.tissues}`} value={config.tissues} min={0} max={2} onChange={v => setConfig({ tissues: v })} />
        <SliderField label={`🐾 Животных: ${config.animals}`} value={config.animals} min={0} max={4} onChange={v => setConfig({ animals: v })} />

        {config.animals > 0 && (
          <>
            <Label>Типы животных</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ANIMAL_TYPES.map(a => (
                <button key={a.key} onClick={() => toggleAnimal(a.key)}
                  style={presetBtn((config.animalTypes || []).includes(a.key))}>
                  {a.label}
                </button>
              ))}
            </div>
          </>
        )}

        <SliderField label={`🚒 Машин: ${config.vehicles ?? 0}`} value={config.vehicles ?? 0} min={0} max={4} onChange={v => setConfig({ vehicles: v })} />
        {(config.vehicles ?? 0) > 0 && (
          <>
            <Label>Типы машин</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {VEHICLE_TYPES.map(v => (
                <button key={v.key} onClick={() => toggleVehicle(v.key)}
                  style={presetBtn((config.vehicleTypes || []).includes(v.key))}>
                  {v.label}
                </button>
              ))}
            </div>
          </>
        )}

        <SliderField label={`🍎 Фруктов: ${config.fruits ?? 0}`} value={config.fruits ?? 0} min={0} max={4} onChange={v => setConfig({ fruits: v })} />
        {(config.fruits ?? 0) > 0 && (
          <>
            <Label>Типы фруктов</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {FRUIT_TYPES.map(f => (
                <button key={f.key} onClick={() => toggleFruit(f.key)}
                  style={presetBtn((config.fruitTypes || []).includes(f.key))}>
                  {f.label}
                </button>
              ))}
            </div>
          </>
        )}

        <SliderField label={`🪤 Ловушки: ${config.traps ?? 0}`} value={config.traps ?? 0} min={0} max={3} onChange={v => setConfig({ traps: v })} />
      </Section>

      {/* ── 3. Старт и Финиш ── */}
      <Section title="3. Старт и Финиш">
        <Label>Машинка</Label>
        <Select value={config.carStyle} onChange={v => setConfig({ carStyle: v === 'random' ? 'random' : Number(v) })}>
          <option value="random">Авто (по seed)</option>
          <option value={1}>1 — Седан</option>
          <option value={2}>2 — SUV</option>
          <option value={3}>3 — Гоночная</option>
          <option value={4}>4 — Хэтчбек</option>
          <option value={5}>5 — Монстртрак</option>
        </Select>

        <ToggleRow label="🐱 Кошка на финише"  checked={config.showFinishCat} onChange={() => toggle('showFinishCat')} />
        <ToggleRow label="🍅 Клякса кетчупа"   checked={config.showKetchup}   onChange={() => toggle('showKetchup')} />
      </Section>

      {/* ── 4. Страница ── */}
      <Section title="4. Страница">
        <Label>Страниц: {config.pages}</Label>
        <input type="range" min={1} max={10} value={config.pages}
          onChange={e => setConfig({ pages: Number(e.target.value) })} style={sliderStyle} />

        <SliderField label={`Лабиринтов на странице: ${config.mazePerPage}`} value={config.mazePerPage} min={1} max={4}
          onChange={v => setConfig({ mazePerPage: v })} />

        <Label>Заголовок</Label>
        <input
          type="text" value={config.pageTitle}
          onChange={e => setConfig({ pageTitle: e.target.value })}
          style={{ ...inputStyle, width: '100%' }}
        />

        <Label>Начальный номер уровня: {config.levelStartNumber}</Label>
        <input type="range" min={1} max={50} value={config.levelStartNumber}
          onChange={e => setConfig({ levelStartNumber: Number(e.target.value) })} style={sliderStyle} />

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Label>Цвет стен</Label>
            <input type="color" value={config.wallColor}
              onChange={e => setConfig({ wallColor: e.target.value })}
              style={{ width: '100%', height: 36, cursor: 'pointer', border: 'none', borderRadius: 6 }} />
          </div>
          <div style={{ flex: 1 }}>
            <Label>Акцентный цвет</Label>
            <input type="color" value={config.accentColor}
              onChange={e => setConfig({ accentColor: e.target.value })}
              style={{ width: '100%', height: 36, cursor: 'pointer', border: 'none', borderRadius: 6 }} />
          </div>
        </div>

        <SliderField label={`Толщина стен: ${config.wallThickness}`} value={config.wallThickness} min={1} max={5}
          onChange={v => setConfig({ wallThickness: v })} />
      </Section>

      {/* ── 5. Экспорт ── */}
      <Section title="5. Экспорт">
        {children}
      </Section>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────

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
        onChange={e => onChange(Number(e.target.value))} style={sliderStyle} />
    </div>
  );
}

function Select({ value, onChange, children }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #ccc', marginBottom: 4, fontSize: 13 }}>
      {children}
    </select>
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

// ── Styles ────────────────────────────────────────────────

const panelStyle = {
  padding: '16px 18px',
  background: '#fafafa',
  borderRadius: 12,
  border: '1px solid #e0e0e0',
  overflowY: 'auto',
  fontFamily: 'system-ui, sans-serif',
};

const titleStyle = {
  fontFamily: '"Fredoka One", cursive',
  fontSize: 22,
  marginBottom: 16,
  color: '#333',
};

const sliderStyle = { width: '100%', marginBottom: 2 };

const inputStyle = {
  padding: '6px 8px',
  borderRadius: 6,
  border: '1px solid #ccc',
  fontSize: 13,
  flex: 1,
};

const smallBtn = {
  padding: '6px 10px',
  background: '#eee',
  border: '1px solid #ccc',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 16,
};

function presetBtn(active) {
  return {
    padding: '4px 10px',
    borderRadius: 20,
    border: `1px solid ${active ? '#1565c0' : '#ccc'}`,
    background: active ? '#1565c0' : '#fff',
    color: active ? '#fff' : '#333',
    fontSize: 12,
    cursor: 'pointer',
  };
}
