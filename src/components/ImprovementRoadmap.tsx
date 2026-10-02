export function ImprovementRoadmap() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">🗺️ Roadmap улучшений</h2>
        <p className="text-gray-400">Итеративный подход: измерение → гипотеза → изменение → regression</p>
      </div>

      {/* Current State */}
      <div className="rounded-xl bg-gradient-to-br from-blue-900/20 to-gray-900 border border-blue-500/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium">Текущее состояние</span>
          <span className="text-gray-400 text-sm">v2.7 Baseline</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">169</div>
            <div className="text-xs text-gray-400">Fuzzy / 192</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">155</div>
            <div className="text-xs text-gray-400">Exact / 192</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">0</div>
            <div className="text-xs text-gray-400">FAIL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">94%</div>
            <div className="text-xs text-gray-400">Overall</div>
          </div>
        </div>
      </div>

      {/* Iteration Plan */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-200">План итераций</h3>

        <IterationCard
          iteration={1}
          title="Compact Badge Detection"
          status="planned"
          target="+3-5 phrases"
          description="Улучшить crop generation для компактных текстовых областей (badges, labels) с увеличенным padding и upscale"
          changes={[
            'Добавить детекцию компактных regions (height < 50px)',
            'Upscale до минимального 200px по высоте',
            'Добавить padding 10px вокруг badge',
            'PSM 8 (single word) для очень коротких labels',
          ]}
          targetSKUs={['2303155197', '3215036374']}
          expectedPhrases={['Сладкая вишня', 'Сочное манго', 'Романтичный пион', 'ПРЕМИУМ КОЛЛЕКЦИЯ', 'Хлопок']}
        />

        <IterationCard
          iteration={2}
          title="Multi-Scale OCR"
          status="planned"
          target="+2-3 phrases"
          description="Для regions с мелким текстом запускать OCR на 2x и 3x upscale"
          changes={[
            'Определить regions с мелким текстом (по density)',
            'Создать 2x и 3x upscaled версии',
            'Запустить Tesseract на каждой',
            'Выбрать лучший результат по confidence',
          ]}
          targetSKUs={['3182041371']}
          expectedPhrases={['90 дней']}
        />

        <IterationCard
          iteration={3}
          title="Adaptive Thresholding"
          status="planned"
          target="+2-4 phrases"
          description="Добавить вариант обработки с adaptive threshold (Bradley/Sauvola) для цветного фона"
          changes={[
            'Реализовать Bradley local thresholding',
            'Добавить как новый image variant',
            'Применять для regions с низким глобальным контрастом',
            'Комбинировать с инверсией для тёмного текста',
          ]}
          targetSKUs={['2303155197', '3215036374']}
          expectedPhrases={['Погрузитесь', 'в атмосферу спокойствия']}
        />

        <IterationCard
          iteration={4}
          title="Line Merge"
          status="planned"
          target="+1-3 phrases"
          description="Объединять соседние OCR-строки в многострочные фразы"
          changes={[
            'Определить соседние строки (по Y-distance < threshold)',
            'Проверить, что объединение даёт осмысленную фразу',
            'Fuzzy match объединённой фразы к missing phrases',
            'Принять только если confidence объединённой фразы выше',
          ]}
          targetSKUs={['3215036374', '3182041371']}
          expectedPhrases={['вместе с OWMY', 'в атмосферу спокойствия']}
        />

        <IterationCard
          iteration={5}
          title="Minimum Crop Filter"
          status="planned"
          target="+0 (no regression)"
          description="Установить минимальный размер crop для устранения ошибок Tesseract"
          changes={[
            'Минимальный размер после масштабирования: 20×20 px',
            'Пропускать crops меньше минимума',
            'Логировать пропущенные crops для диагностики',
          ]}
          targetSKUs={[]}
          expectedPhrases={[]}
        />
      </div>

      {/* Milestones */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">🎯 Milestones</h3>
        <div className="space-y-4">
          <MilestoneCard
            label="Milestone 1"
            fuzzy={172}
            exact={158}
            iterations="1-2"
            status="current-target"
          />
          <MilestoneCard
            label="Milestone 2"
            fuzzy={175}
            exact={160}
            iterations="3-5"
            status="next"
          />
          <MilestoneCard
            label="Baseline (v2.7)"
            fuzzy={169}
            exact={155}
            iterations="—"
            status="achieved"
          />
        </div>
      </div>
    </div>
  );
}

function IterationCard({ iteration, title, status, target, description, changes, targetSKUs, expectedPhrases }: {
  iteration: number; title: string; status: string; target: string;
  description: string; changes: string[];
  targetSKUs: string[]; expectedPhrases: string[];
}) {
  const statusColors: Record<string, string> = {
    planned: 'bg-gray-500/20 text-gray-400',
    active: 'bg-blue-500/20 text-blue-400',
    done: 'bg-green-500/20 text-green-400',
  };

  return (
    <div className="rounded-xl bg-gray-900 border border-gray-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 font-bold text-sm border border-gray-700">
            {iteration}
          </span>
          <h4 className="font-semibold text-gray-200">{title}</h4>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-400 text-sm font-medium">{target}</span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[status]}`}>
            {status}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-3">{description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Changes</h5>
          <ul className="space-y-1">
            {changes.map((c, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-start gap-1">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Target SKUs</h5>
          <div className="flex flex-wrap gap-1">
            {targetSKUs.length > 0 ? targetSKUs.map(sku => (
              <span key={sku} className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-xs font-mono">{sku}</span>
            )) : <span className="text-xs text-gray-500">All</span>}
          </div>
        </div>
        <div>
          <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Expected Phrases</h5>
          <div className="flex flex-wrap gap-1">
            {expectedPhrases.length > 0 ? expectedPhrases.map(p => (
              <span key={p} className="px-2 py-0.5 rounded bg-purple-900/30 text-purple-300 text-xs">"{p}"</span>
            )) : <span className="text-xs text-gray-500">No regression</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MilestoneCard({ label, fuzzy, exact, iterations, status }: {
  label: string; fuzzy: number; exact: number; iterations: string; status: string;
}) {
  const statusStyles: Record<string, string> = {
    'current-target': 'border-blue-500/40 bg-blue-500/5',
    next: 'border-gray-700 bg-gray-800/30',
    achieved: 'border-green-500/40 bg-green-500/5',
  };

  return (
    <div className={`rounded-lg border p-4 ${statusStyles[status]}`}>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium text-gray-200">{label}</span>
          <span className="text-xs text-gray-500 ml-2">(итерации {iterations})</span>
        </div>
        <div className="flex gap-4 text-sm font-mono">
          <span className="text-blue-400">fuzzy ≥ {fuzzy}</span>
          <span className="text-purple-400">exact ≥ {exact}</span>
        </div>
      </div>
    </div>
  );
}
