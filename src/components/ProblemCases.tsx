export function ProblemCases() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">⚠️ Проблемные кейсы</h2>
        <p className="text-gray-400">Детальный анализ SKU с наибольшими потерями OCR</p>
      </div>

      {/* SKU 2303155197 */}
      <ProblemSKU
        sku="2303155197"
        severity="high"
        title="Компактные цветные плашки + длинные фразы"
        missingPhrases={[
          { phrase: 'Сладкая вишня', type: 'short-label', image: 1 },
          { phrase: 'Сочное манго', type: 'short-label', image: 1 },
          { phrase: 'Романтичный пион', type: 'short-label', image: 1 },
          { phrase: 'Погрузитесь', type: 'long-copy', image: 2 },
          { phrase: 'в атмосферу спокойствия', type: 'long-copy', image: 2 },
        ]}
        analysis="Текст в компактных цветных плашках (вишня/манго/пион) имеет малый размер и расположен на декоративном фоне. Длинные фразы на images 2-3 теряются из-за неправильной сегментации."
        rootCause="1. Badge regions слишком малы для стандартного PSM\n2. Цветной фон снижает контраст после grayscale\n3. Tesseract не сегментирует многострочный текст на паттерн-фоне"
        solution="Улучшить crop generation для badges + adaptive thresholding для цветного фона"
      />

      {/* SKU 3215036374 */}
      <ProblemSKU
        sku="3215036374"
        severity="high"
        title="ПРЕМИУМ КОЛЛЕКЦИЯ + многострочный текст"
        missingPhrases={[
          { phrase: 'ПРЕМИУМ КОЛЛЕКЦИЯ', type: 'badge', image: 1 },
          { phrase: 'Хлопок', type: 'short-label', image: 1 },
          { phrase: 'Погрузитесь', type: 'long-copy', image: 2 },
          { phrase: 'в атмосферу спокойствия', type: 'long-copy', image: 2 },
          { phrase: 'вместе с OWMY', type: 'long-copy', image: 2 },
        ]}
        analysis="Badge 'ПРЕМИУМ КОЛЛЕКЦИЯ' — крупный текст, но на декоративном фоне. 'Хлопок' — маленькая подпись. Многострочный текст на image 2 не сегментируется."
        rootCause="1. Badge с декоративным фоном — grayscale не даёт достаточного контраста\n2. 'Хлопок' — слишком маленький crop\n3. Многострочный текст на image 2 — нужна line merge"
        solution="Multi-scale для badges + line merge для многострочных фраз"
      />

      {/* SKU 3182041371 */}
      <ProblemSKU
        sku="3182041371"
        severity="medium"
        title="Мелкий badge '90 дней' + длинный текст"
        missingPhrases={[
          { phrase: '90 дней', type: 'numeric-badge', image: 3 },
          { phrase: 'Погрузитесь', type: 'long-copy', image: 3 },
          { phrase: 'в атмосферу спокойствия', type: 'long-copy', image: 3 },
          { phrase: 'вместе с OWMY', type: 'long-copy', image: 3 },
        ]}
        analysis="'90 дней' — очень мелкий numeric badge. Многострочный текст на image 3 — та же проблема, что и у SKU 3215036374."
        rootCause="1. '90 дней' — слишком мелкий, нужен upscale ≥ 3x\n2. PSM 13 (numeric) не справляется с кириллицей в badge\n3. Многострочный текст — нужен line merge"
        solution="Multi-scale OCR для numeric badges + line merge"
      />

      {/* Summary */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">📊 Сводка по проблемным паттернам</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PatternCard
            pattern="Compact Badges"
            count={8}
            description="Текст в маленьких цветных плашках"
            examples={['Сладкая вишня', 'ПРЕМИУМ КОЛЛЕКЦИЯ', 'Хлопок']}
          />
          <PatternCard
            pattern="Numeric Badges"
            count={3}
            description="Цифровые значения в badges"
            examples={['90 дней', '%', 'мл']}
          />
          <PatternCard
            pattern="Multi-line Copy"
            count={7}
            description="Многострочные рекламные фразы"
            examples={['Погрузитесь', 'в атмосферу спокойствия', 'вместе с OWMY']}
          />
          <PatternCard
            pattern="Low Contrast Text"
            count={5}
            description="Текст с низким контрастом к фону"
            examples={['Текст на градиенте', 'Текст на паттерне']}
          />
          <PatternCard
            pattern="Small Labels"
            count={4}
            description="Мелкие подписи и annotations"
            examples={['Романтичный пион', 'Сочное манго']}
          />
          <PatternCard
            pattern="Mixed Script"
            count={2}
            description="Текст с латиницей и кириллицей"
            examples={['вместе с OWMY']}
          />
        </div>
      </div>
    </div>
  );
}

function ProblemSKU({ sku, severity, title, missingPhrases, analysis, rootCause, solution }: {
  sku: string; severity: string; title: string;
  missingPhrases: { phrase: string; type: string; image: number }[];
  analysis: string; rootCause: string; solution: string;
}) {
  const severityColors: Record<string, string> = {
    high: 'border-red-500/40 bg-red-500/5',
    medium: 'border-yellow-500/40 bg-yellow-500/5',
    low: 'border-blue-500/40 bg-blue-500/5',
  };

  return (
    <div className={`rounded-xl border p-6 ${severityColors[severity]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-gray-800 text-gray-200 font-mono text-sm">SKU {sku}</span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {severity === 'high' ? 'CRITICAL' : 'IMPORTANT'}
          </span>
        </div>
        <span className="text-sm text-gray-400">{missingPhrases.length} missing phrases</span>
      </div>

      <h4 className="text-lg font-medium text-gray-200 mb-3">{title}</h4>

      {/* Missing Phrases */}
      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-400 mb-2">Missing phrases:</h5>
        <div className="flex flex-wrap gap-2">
          {missingPhrases.map((mp, i) => (
            <span key={i} className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-sm">
              <span className="text-red-400 font-mono text-xs">img{mp.image}</span>
              <span className="text-gray-300 ml-2">"{mp.phrase}"</span>
              <span className="text-gray-600 ml-1 text-xs">({mp.type})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <h5 className="text-xs font-medium text-gray-400 uppercase mb-1">Analysis</h5>
          <p className="text-sm text-gray-300">{analysis}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <h5 className="text-xs font-medium text-gray-400 uppercase mb-1">Root Cause</h5>
          <p className="text-sm text-gray-300 whitespace-pre-line">{rootCause}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <h5 className="text-xs font-medium text-gray-400 uppercase mb-1">Solution</h5>
          <p className="text-sm text-green-400">{solution}</p>
        </div>
      </div>
    </div>
  );
}

function PatternCard({ pattern, count, description, examples }: {
  pattern: string; count: number; description: string; examples: string[];
}) {
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-gray-200 text-sm">{pattern}</h4>
        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-mono">-{count}</span>
      </div>
      <p className="text-xs text-gray-400 mb-2">{description}</p>
      <div className="flex flex-wrap gap-1">
        {examples.map(ex => (
          <span key={ex} className="px-1.5 py-0.5 rounded bg-gray-700 text-gray-400 text-xs">
            "{ex}"
          </span>
        ))}
      </div>
    </div>
  );
}
