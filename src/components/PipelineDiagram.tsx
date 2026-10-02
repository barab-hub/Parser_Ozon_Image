export function PipelineDiagram() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">🔄 OCR Pipeline v2.7</h2>
        <p className="text-gray-400">Архитектура 5-уровневого OCR pipeline с Adaptive Fusion</p>
      </div>

      {/* Pipeline Flow */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-6">Поток обработки</h3>
        <div className="space-y-4">
          <PipelineStage
            level={1}
            title="Base OCR"
            description="Первичный проход Tesseract.js по всему изображению с базовыми настройками"
            variants={['original', 'grayscale']}
            psm={['block (6)', 'sparse (11)']}
            cost="low"
            coverage="high"
          />
          <PipelineStage
            level={2}
            title="Adaptive Fusion"
            description="Объединение результатов Base OCR с дополнительными вариантами обработки"
            variants={['binary', 'inverted', 'high-contrast']}
            psm={['block (6)', 'line (7)', 'sparse (11)']}
            cost="medium"
            coverage="high"
          />
          <PipelineStage
            level={3}
            title="Tile OCR"
            description="Разбиение изображения на tiles и OCR каждого tile отдельно"
            variants={['grayscale', 'adaptive-threshold']}
            psm={['block (6)', 'sparse (11)']}
            cost="high"
            coverage="medium"
          />
          <PipelineStage
            level={4}
            title="Targeted Recovery"
            description="Целевое восстановление для фраз, не найденных на предыдущих этапах"
            variants={['upscale', 'sharpen', 'dark-region']}
            psm={['line (7)', 'short-label (8)', 'numeric (13)']}
            cost="high"
            coverage="low"
          />
          <PipelineStage
            level={5}
            title="Region-Specific Recovery"
            description="Специализированная обработка для конкретных типов регионов (badges, labels, плашки)"
            variants={['crop-upscale', 'contrast-boost', 'padding']}
            psm={['short-label (8)', 'single-word (8)', 'numeric-badge (13)']}
            cost="very-high"
            coverage="targeted"
          />
        </div>
      </div>

      {/* Image Variants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">🖼️ Image Variants</h3>
          <div className="space-y-3">
            <VariantItem name="original" desc="Исходное изображение без обработки" />
            <VariantItem name="grayscale" desc="Конвертация в оттенки серого" />
            <VariantItem name="binary" desc="Бинаризация с фиксированным threshold" />
            <VariantItem name="inverted" desc="Инверсия цветов (для светлого текста)" />
            <VariantItem name="high-contrast" desc="Усиление контраста (CLAHE-like)" />
            <VariantItem name="dark-region" desc="Обработка тёмных областей отдельно" />
          </div>
        </div>

        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">⚙️ PSM Modes</h3>
          <div className="space-y-3">
            <PSMItem psm="6" name="Block" desc="Uniform block of text" useCase="Основной текст" />
            <PSMItem psm="7" name="Single Line" desc="Treat as a single text line" useCase="Заголовки, labels" />
            <PSMItem psm="11" name="Sparse Text" desc="Find text in no particular order" useCase="Рассеянный текст" />
            <PSMItem psm="8" name="Short Label" desc="Single word / short label" useCase="Badge, плашки" />
            <PSMItem psm="13" name="Numeric Badge" desc="Numeric value only" useCase="Цифры, единицы" />
            <PSMItem psm="3" name="Long Copy" desc="Fully automatic segmentation" useCase="Длинный рекламный текст" />
          </div>
        </div>
      </div>

      {/* Decision Flow */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">🧠 Decision Logic</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Accepted / Rejected</h4>
            <div className="space-y-2">
              <DecisionItem
                condition="confidence ≥ threshold"
                result="accepted"
                description="OCR-строка принимается, если confidence выше порога"
              />
              <DecisionItem
                condition="fuzzy match to missing phrase"
                result="accepted"
                description="Если строка fuzzy-matчит отсутствующую фразу"
              />
              <DecisionItem
                condition="duplicate of existing text"
                result="rejected"
                description="Не добавлять дубликаты уже распознанного"
              />
              <DecisionItem
                condition="too low confidence"
                result="rejected"
                description="Отбрасывать ненадёжные результаты"
              />
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Append-Only Logic</h4>
            <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
              <div className="text-gray-500">// Core principle:</div>
              <div className="text-blue-400">baseline_text</div>
              <div className="text-gray-500">+</div>
              <div className="text-green-400">new_reliable_line</div>
              <div className="text-gray-500">=</div>
              <div className="text-purple-400">combined_ocr</div>
              <div className="mt-3 text-gray-500">// If new line is uncertain:</div>
              <div className="text-red-400">→ do NOT add</div>
            </div>
          </div>
        </div>
      </div>

      {/* CPU Cost Analysis */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">⏱️ CPU Cost by Stage</h3>
        <div className="space-y-3">
          <CostBar label="Base OCR" cost={15} desc="1 image × 2 variants × 2 PSM" />
          <CostBar label="Adaptive Fusion" cost={25} desc="1 image × 3 variants × 3 PSM" />
          <CostBar label="Tile OCR" cost={30} desc="N tiles × 2 variants × 2 PSM" />
          <CostBar label="Targeted Recovery" cost={20} desc="missing phrases × 3 variants × 2 PSM" />
          <CostBar label="Region-Specific" cost={10} desc="targeted regions × 3 variants × 2 PSM" />
        </div>
        <p className="mt-4 text-sm text-gray-500">
          * Targeted Recovery и Region-Specific запускаются только для missing phrases, что экономит CPU
        </p>
      </div>
    </div>
  );
}

function PipelineStage({ level, title, description, variants, psm, cost, coverage }: {
  level: number; title: string; description: string;
  variants: string[]; psm: string[]; cost: string; coverage: string;
}) {
  const costColors: Record<string, string> = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    'very-high': 'text-red-400',
  };

  return (
    <div className="relative pl-8 border-l-2 border-gray-700">
      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-gray-900"></div>
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-mono">L{level}</span>
            <h4 className="font-semibold text-gray-200">{title}</h4>
          </div>
          <div className="flex gap-3 text-xs">
            <span className={costColors[cost]}>CPU: {cost}</span>
            <span className="text-gray-400">Coverage: {coverage}</span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-3">{description}</p>
        <div className="flex flex-wrap gap-2">
          {variants.map(v => (
            <span key={v} className="px-2 py-0.5 rounded bg-gray-700 text-gray-300 text-xs">{v}</span>
          ))}
          <span className="text-gray-600">|</span>
          {psm.map(p => (
            <span key={p} className="px-2 py-0.5 rounded bg-purple-900/30 text-purple-300 text-xs">{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function VariantItem({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-800/50">
      <span className="px-2 py-0.5 rounded bg-gray-700 text-gray-300 text-xs font-mono whitespace-nowrap">{name}</span>
      <span className="text-sm text-gray-400">{desc}</span>
    </div>
  );
}

function PSMItem({ psm, name, desc, useCase }: { psm: string; name: string; desc: string; useCase: string }) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-800/50">
      <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 text-xs font-mono whitespace-nowrap">PSM {psm}</span>
      <div className="flex-1">
        <span className="text-sm text-gray-200">{name}</span>
        <span className="text-xs text-gray-500 ml-2">({desc})</span>
        <div className="text-xs text-gray-500">→ {useCase}</div>
      </div>
    </div>
  );
}

function DecisionItem({ condition, result, description }: {
  condition: string; result: string; description: string;
}) {
  const isAccepted = result === 'accepted';
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className={`px-1.5 py-0.5 rounded text-xs ${isAccepted ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {isAccepted ? '✓' : '✗'}
      </span>
      <div>
        <span className="text-gray-300 font-mono text-xs">{condition}</span>
        <p className="text-gray-500 text-xs">{description}</p>
      </div>
    </div>
  );
}

function CostBar({ label, cost, desc }: { label: string; cost: number; desc: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-gray-500">{cost}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-600 to-yellow-400 rounded-full" style={{ width: `${cost}%` }}></div>
      </div>
      <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
    </div>
  );
}
