export function TechnicalReport() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">📋 Технический отчёт — Анализ v2.7</h2>
        <p className="text-gray-400">Результаты анализа OCR pipeline, точек потерь и стратегии улучшения</p>
      </div>

      {/* Section 1: Pipeline Schema */}
      <ReportSection number={1} title="Схема текущего OCR pipeline v2.7">
        <div className="space-y-4">
          <p className="text-gray-300">
            Pipeline состоит из 5 уровней, каждый из которых добавляет новый текст к уже распознанному (append-only):
          </p>
          <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <div className="text-blue-400">┌─────────────────────────────────────────────┐</div>
            <div className="text-blue-400">│ Level 1: Base OCR                           │</div>
            <div className="text-gray-400">│   → original + grayscale                    │</div>
            <div className="text-gray-400">│   → PSM 6, 11                             │</div>
            <div className="text-blue-400">├─────────────────────────────────────────────┤</div>
            <div className="text-green-400">│ Level 2: Adaptive Fusion                   │</div>
            <div className="text-gray-400">│   → binary + inverted + high-contrast       │</div>
            <div className="text-gray-400">│   → PSM 6, 7, 11                          │</div>
            <div className="text-blue-400">├─────────────────────────────────────────────┤</div>
            <div className="text-yellow-400">│ Level 3: Tile OCR                          │</div>
            <div className="text-gray-400">│   → image split into tiles                  │</div>
            <div className="text-gray-400">│   → grayscale + adaptive-threshold per tile │</div>
            <div className="text-blue-400">├─────────────────────────────────────────────┤</div>
            <div className="text-orange-400">│ Level 4: Targeted Recovery                 │</div>
            <div className="text-gray-400">│   → only for missing phrases                │</div>
            <div className="text-gray-400">│   → upscale + sharpen + dark-region         │</div>
            <div className="text-gray-400">│   → PSM 7, 8, 13                          │</div>
            <div className="text-blue-400">├─────────────────────────────────────────────┤</div>
            <div className="text-purple-400">│ Level 5: Region-Specific Recovery          │</div>
            <div className="text-gray-400">│   → badges, labels, compact regions         │</div>
            <div className="text-gray-400">│   → crop-upscale + contrast-boost + padding │</div>
            <div className="text-gray-400">│   → PSM 8, 13                             │</div>
            <div className="text-blue-400">└─────────────────────────────────────────────┘</div>
          </div>
        </div>
      </ReportSection>

      {/* Section 2: Loss Points */}
      <ReportSection number={2} title="Где происходят основные потери текста">
        <div className="space-y-4">
          <LossPoint
            severity="high"
            title="Компактные плашки и badges"
            description="Текст в маленьких цветных плашках (например, 'Сладкая вишня', 'ПРЕМИУМ КОЛЛЕКЦИЯ') часто не распознаётся из-за малого размера и цветного фона. Tile OCR не всегда попадает в нужную область."
            examples={['Сладкая вишня', 'Сочное манго', 'Романтичный пион', 'ПРЕМИУМ КОЛЛЕКЦИЯ', 'Хлопок']}
          />
          <LossPoint
            severity="high"
            title="Мелкий текст с низким контрастом"
            description="Текст '90 дней' на SKU 3182041371 — маленький badge с недостаточным контрастом. Стандартные preprocessing-варианты не дают достаточного усиления."
            examples={['90 дней']}
          />
          <LossPoint
            severity="medium"
            title="Длинные рекламные фразы на изображениях"
            description="Многострочные тексты на маркетинговых изображениях (SKU 2303155197, img 2-3) теряются из-за того, что Tesseract не может правильно сегментировать текст на декоративном фоне."
            examples={['Погрузитесь', 'в атмосферу спокойствия', 'вместе с OWMY']}
          />
          <LossPoint
            severity="medium"
            title="Текст на градиентном/паттерн фоне"
            description="Изображения с декоративными фонами снижают контраст текста. Бинаризация и grayscale не справляются с такими случаями."
            examples={['Текст на цветных градиентах']}
          />
          <LossPoint
            severity="low"
            title="Цифры и единицы измерения"
            description="Изолированные цифры (%, мл, шт) иногда не распознаются как текст из-за PSM mode mismatch."
            examples={['Числовые badges']}
          />
        </div>
      </ReportSection>

      {/* Section 3: CPU Cost */}
      <ReportSection number={3} title="Какие этапы самые дорогие по CPU">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CPUCostCard
              stage="Tile OCR (Level 3)"
              cost={30}
              reason="N tiles × variants × PSM modes. Каждый tile — отдельный Tesseract вызов."
              optimization="Кеширование preprocessing, дедупликация похожих tiles"
            />
            <CPUCostCard
              stage="Targeted Recovery (Level 4)"
              cost={25}
              reason="Для каждой missing phrase запускается несколько variants × PSM."
              optimization="Сначала дешёвый OCR, тяжёлый только для оставшихся"
            />
            <CPUCostCard
              stage="Adaptive Fusion (Level 2)"
              cost={20}
              reason="3 варианта обработки × 3 PSM = 9 Tesseract вызовов на изображение."
              optimization="Пропускать варианты, если Base OCR уже дал хороший результат"
            />
            <CPUCostCard
              stage="Region-Specific (Level 5)"
              cost={15}
              reason="Точечная обработка, но с upscale и contrast-boost."
              optimization="Только для реально missing phrases"
            />
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">💡 Ключевые оптимизации:</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>• Не запускать один и тот же OCR повторно</li>
              <li>• Кешировать preprocessing (grayscale, binary, etc.)</li>
              <li>• Избегать одинаковых crop</li>
              <li>• Удалять почти полностью пересекающиеся regions</li>
              <li>• Не делать recovery для фраз, которые уже найдены</li>
              <li>• Сначала дешёвый OCR → тяжёлый только для missing</li>
            </ul>
          </div>
        </div>
      </ReportSection>

      {/* Section 4: Top Improvements */}
      <ReportSection number={4} title="Какие 3–5 изменений имеют наибольший шанс улучшить OCR">
        <div className="space-y-4">
          <ImprovementItem
            rank={1}
            title="Улучшенный crop generation для compact badges"
            impact="+3-5 phrases"
            effort="medium"
            description="Добавить детекцию компактных текстовых областей (badges, labels) с увеличенным padding и upscale до минимального 200px по высоте. Это поможет распознавать 'Сладкая вишня', 'ПРЕМИУМ КОЛЛЕКЦИЯ', 'Хлопок'."
            verification="Regression test: проверить SKU 2303155197 и SKU 3215036374"
          />
          <ImprovementItem
            rank={2}
            title="Multi-scale OCR для мелкого текста"
            impact="+2-3 phrases"
            effort="medium"
            description="Для regions с мелким текстом запускать OCR на 2x и 3x upscale. '90 дней' и подобные мелкие badges требуют большего разрешения для Tesseract."
            verification="Regression test: проверить SKU 3182041371, image 3"
          />
          <ImprovementItem
            rank={3}
            title="Улучшенное adaptive thresholding для цветного фона"
            impact="+2-4 phrases"
            effort="medium"
            description="Добавить вариант обработки с adaptive threshold (Bradley / Sauvola), который лучше справляется с текстом на цветном/градиентном фоне."
            verification="Regression test: проверить SKU 2303155197, images 2-3"
          />
          <ImprovementItem
            rank={4}
            title="Line merge для многострочных фраз"
            impact="+1-3 phrases"
            effort="low"
            description="Объединять соседние OCR-строки, если они расположены близко и образуют осмысленную фразу. 'Погрузитесь' + 'в атмосферу спокойствия' → одна фраза."
            verification="Regression test: проверить SKU 3215036374, SKU 3182041371"
          />
          <ImprovementItem
            rank={5}
            title="Фильтр минимального размера crop"
            impact="+0-1 phrases (no regression)"
            effort="low"
            description="Установить минимальный размер crop после масштабирования (≥ 20×20 px). Убрать сообщения 'Image too small to scale!!' и 'ridiculously small scaling factor'."
            verification="Regression test: убедиться, что ничего не потеряно"
          />
        </div>
      </ReportSection>

      {/* Section 5: Verification Plan */}
      <ReportSection number={5} title="Как каждое изменение будет проверяться regression-тестом">
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-200 mb-3">Процесс верификации:</h4>
            <div className="space-y-2 font-mono text-sm">
              <div className="text-gray-400">1. <span className="text-blue-400">Запустить baseline regression</span> → зафиксировать 169/155</div>
              <div className="text-gray-400">2. <span className="text-green-400">Применить одно изменение</span></div>
              <div className="text-gray-400">3. <span className="text-yellow-400">Запустить regression</span> → сравнить с baseline</div>
              <div className="text-gray-400">4. <span className="text-purple-400">Проверить gate:</span></div>
              <div className="text-gray-500 pl-8">fuzzy ≥ 169/192 → PASS/FAIL</div>
              <div className="text-gray-500 pl-8">exact ≥ 155/192 → PASS/FAIL</div>
              <div className="text-gray-500 pl-8">FAIL = 0 → PASS/FAIL</div>
              <div className="text-gray-400">5. <span className="text-red-400">Если regression → REJECT</span></div>
              <div className="text-gray-400">6. <span className="text-green-400">Если улучшение → зафиксировать и перейти к следующему</span></div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-200 mb-3">Отчёт после каждого изменения:</h4>
            <div className="font-mono text-xs text-gray-400 space-y-1">
              <div>• Что изменено</div>
              <div>• Какой кейс улучшен</div>
              <div>• Fuzzy before/after</div>
              <div>• Exact before/after</div>
              <div>• Время regression</div>
              <div>• OCR evidence для каждой новой строки</div>
            </div>
          </div>
        </div>
      </ReportSection>
    </div>
  );
}

function ReportSection({ number, title, children }: {
  number: number; title: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
          {number}
        </span>
        <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function LossPoint({ severity, title, description, examples }: {
  severity: string; title: string; description: string; examples: string[];
}) {
  const severityColors: Record<string, string> = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };
  const severityLabels: Record<string, string> = {
    high: 'HIGH',
    medium: 'MEDIUM',
    low: 'LOW',
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-0.5 rounded border text-xs font-medium ${severityColors[severity]}`}>
          {severityLabels[severity]}
        </span>
        <h4 className="font-medium text-gray-200">{title}</h4>
      </div>
      <p className="text-sm text-gray-400 mb-2">{description}</p>
      <div className="flex flex-wrap gap-1">
        {examples.map(ex => (
          <span key={ex} className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 text-xs font-mono">
            "{ex}"
          </span>
        ))}
      </div>
    </div>
  );
}

function CPUCostCard({ stage, cost, reason, optimization }: {
  stage: string; cost: number; reason: string; optimization: string;
}) {
  return (
    <div className="border border-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-gray-200 text-sm">{stage}</h4>
        <span className="text-orange-400 font-mono text-sm">{cost}%</span>
      </div>
      <p className="text-xs text-gray-400 mb-2">{reason}</p>
      <p className="text-xs text-green-400">💡 {optimization}</p>
    </div>
  );
}

function ImprovementItem({ rank, title, impact, effort, description, verification }: {
  rank: number; title: string; impact: string; effort: string;
  description: string; verification: string;
}) {
  const effortColors: Record<string, string> = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
            {rank}
          </span>
          <h4 className="font-medium text-gray-200">{title}</h4>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="text-green-400">Impact: {impact}</span>
          <span className={effortColors[effort]}>Effort: {effort}</span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-2">{description}</p>
      <p className="text-xs text-gray-500">🧪 {verification}</p>
    </div>
  );
}
