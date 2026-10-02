export function RegressionGate() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">🚦 Regression Gate</h2>
        <p className="text-gray-400">Критические пороги, которые нельзя нарушать</p>
      </div>

      {/* Gate Rules */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Правила Gate</h3>
        <div className="space-y-3">
          <GateRule
            metric="OCR Fuzzy"
            threshold="≥ 169 / 192"
            current="169 / 192"
            margin={0}
            status="at-limit"
          />
          <GateRule
            metric="OCR Exact"
            threshold="≥ 155 / 192"
            current="155 / 192"
            margin={0}
            status="at-limit"
          />
          <GateRule
            metric="FAIL cases"
            threshold="= 0"
            current="0"
            margin={0}
            status="pass"
          />
          <GateRule
            metric="Name Parser"
            threshold="= 100%"
            current="100%"
            margin={0}
            status="pass"
          />
          <GateRule
            metric="Description Parser"
            threshold="= 100%"
            current="100%"
            margin={0}
            status="pass"
          />
          <GateRule
            metric="Characteristics Parser"
            threshold="= 100%"
            current="100%"
            margin={0}
            status="pass"
          />
        </div>
      </div>

      {/* Reject Conditions */}
      <div className="rounded-xl bg-red-900/10 border border-red-500/30 p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4">❌ Условия REJECT</h3>
        <div className="space-y-2">
          <RejectCondition text="fuzzy = 168 / 192 (ниже порога на 1)" />
          <RejectCondition text="exact = 154 / 192 (ниже порога на 1)" />
          <RejectCondition text="FAIL > 0 (хотя бы один кейс провален)" />
          <RejectCondition text="Name Parser < 100%" />
          <RejectCondition text="Description Parser < 100%" />
          <RejectCondition text="Characteristics Parser < 100%" />
        </div>
        <p className="mt-4 text-sm text-gray-400">
          Даже если какая-то отдельная карточка стала лучше, при нарушении любого из этих условий — изменение считается REJECT.
        </p>
      </div>

      {/* Report Format */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">📄 Формат Regression Report</h3>
        <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <div className="text-gray-500">// После каждого изменения:</div>
          <div className="mt-2 text-blue-400">ocrPhraseHits: <span className="text-white">169</span></div>
          <div className="text-blue-400">ocrExactPhraseHits: <span className="text-white">155</span></div>
          <div className="text-blue-400">ocrPhraseTotal: <span className="text-white">192</span></div>
          <div className="mt-2 text-green-400">recoveryAddedFuzzy: <span className="text-white">0</span></div>
          <div className="text-green-400">recoveryAddedExact: <span className="text-white">0</span></div>
          <div className="mt-2 text-red-400">ocrErrors: <span className="text-white">0</span></div>
          <div className="mt-2 text-gray-400">name: <span className="text-green-400">100%</span></div>
          <div className="text-gray-400">description: <span className="text-green-400">100%</span></div>
          <div className="text-gray-400">characteristics: <span className="text-green-400">100%</span></div>
          <div className="mt-2 text-yellow-400">PASS: <span className="text-white">8</span> | WARN: <span className="text-white">2</span> | FAIL: <span className="text-white">0</span></div>
        </div>
      </div>

      {/* Per-Image Report */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Per-Image Report</h3>
        <p className="text-sm text-gray-400 mb-4">Для каждого изображения хранится:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Image Metrics</h4>
            <ul className="space-y-1 text-xs text-gray-400">
              <li className="flex items-center gap-2"><span className="text-red-400">•</span> missing — фразы не найдены</li>
              <li className="flex items-center gap-2"><span className="text-red-400">•</span> exactMissing — нет точного совпадения</li>
              <li className="flex items-center gap-2"><span className="text-green-400">•</span> matched — fuzzy совпадения</li>
              <li className="flex items-center gap-2"><span className="text-green-400">•</span> exactMatched — точные совпадения</li>
              <li className="flex items-center gap-2"><span className="text-yellow-400">•</span> fuzzyOnly — только fuzzy (не exact)</li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Recovery Details</h4>
            <ul className="space-y-1 text-xs text-gray-400">
              <li className="flex items-center gap-2"><span className="text-green-400">•</span> accepted — приняты recovery-строки</li>
              <li className="flex items-center gap-2"><span className="text-red-400">•</span> rejected — отклонены recovery-строки</li>
              <li className="flex items-center gap-2"><span className="text-blue-400">•</span> region — область изображения</li>
              <li className="flex items-center gap-2"><span className="text-purple-400">•</span> variant — вариант обработки</li>
              <li className="flex items-center gap-2"><span className="text-amber-400">•</span> confidence — уровень уверенности</li>
              <li className="flex items-center gap-2"><span className="text-cyan-400">•</span> target similarity — сходство с целью</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Delta Table */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">📊 Таблица сравнения (при улучшении)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400">Metric</th>
                <th className="text-center py-3 px-4 text-gray-400">v2.7 Baseline</th>
                <th className="text-center py-3 px-4 text-gray-400">New Version</th>
                <th className="text-center py-3 px-4 text-gray-400">Delta</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800/50">
                <td className="py-3 px-4 text-gray-300">OCR Fuzzy</td>
                <td className="py-3 px-4 text-center font-mono text-gray-400">169 / 192</td>
                <td className="py-3 px-4 text-center font-mono text-gray-300">—</td>
                <td className="py-3 px-4 text-center font-mono text-gray-500">—</td>
              </tr>
              <tr className="border-b border-gray-800/50">
                <td className="py-3 px-4 text-gray-300">OCR Exact</td>
                <td className="py-3 px-4 text-center font-mono text-gray-400">155 / 192</td>
                <td className="py-3 px-4 text-center font-mono text-gray-300">—</td>
                <td className="py-3 px-4 text-center font-mono text-gray-500">—</td>
              </tr>
              <tr className="border-b border-gray-800/50">
                <td className="py-3 px-4 text-gray-300">FAIL</td>
                <td className="py-3 px-4 text-center font-mono text-gray-400">0</td>
                <td className="py-3 px-4 text-center font-mono text-gray-300">—</td>
                <td className="py-3 px-4 text-center font-mono text-gray-500">—</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-300">Overall</td>
                <td className="py-3 px-4 text-center font-mono text-gray-400">94%</td>
                <td className="py-3 px-4 text-center font-mono text-gray-300">—</td>
                <td className="py-3 px-4 text-center font-mono text-gray-500">—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500">* Таблица заполняется после каждого успешного изменения</p>
      </div>
    </div>
  );
}

function GateRule({ metric, threshold, current, margin, status }: {
  metric: string; threshold: string; current: string; margin: number; status: string;
}) {
  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pass: { bg: 'bg-green-500/20', text: 'text-green-400', label: '✓ SAFE' },
    'at-limit': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '⚠ AT LIMIT' },
    fail: { bg: 'bg-red-500/20', text: 'text-red-400', label: '✗ FAIL' },
  };
  const s = statusColors[status];

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
      <div className="flex items-center gap-3">
        <span className="text-gray-300 font-medium">{metric}</span>
        <span className="text-xs text-gray-500 font-mono">threshold: {threshold}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-400 font-mono text-sm">current: {current}</span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.bg} ${s.text}`}>
          {s.label}
        </span>
      </div>
    </div>
  );
}

function RejectCondition({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-red-400">✗</span>
      <span className="text-gray-300">{text}</span>
    </div>
  );
}
