export function MetricsPanel() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">📈 Метрики v2.7 Baseline</h2>
        <p className="text-gray-400">Полная разбивка результатов regression-теста</p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="OCR Fuzzy Match"
          value={169}
          total={192}
          percentage={88.02}
          target={172}
          color="blue"
        />
        <MetricCard
          title="OCR Exact Match"
          value={155}
          total={192}
          percentage={80.73}
          target={158}
          color="purple"
        />
        <MetricCard
          title="Parser Accuracy"
          value={100}
          total={100}
          percentage={100}
          target={100}
          color="green"
        />
      </div>

      {/* Detailed Breakdown */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Детальная разбивка</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Метрика</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Значение</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Gate</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              <TableRow metric="OCR Fuzzy" value="169 / 192" gate="≥ 169" status="pass" />
              <TableRow metric="OCR Exact" value="155 / 192" gate="≥ 155" status="pass" />
              <TableRow metric="Name Parser" value="100%" gate="100%" status="pass" />
              <TableRow metric="Description Parser" value="100%" gate="100%" status="pass" />
              <TableRow metric="Characteristics Parser" value="100%" gate="100%" status="pass" />
              <TableRow metric="FAIL cases" value="0" gate="= 0" status="pass" />
              <TableRow metric="WARN cases" value="2" gate="—" status="warn" />
              <TableRow metric="PASS cases" value="8" gate="—" status="pass" />
              <TableRow metric="ocrErrors" value="0" gate="= 0" status="pass" />
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Распределение по кейсам</h3>
          <div className="space-y-3">
            <CaseBar label="PASS" count={8} total={10} color="green" />
            <CaseBar label="WARN" count={2} total={10} color="amber" />
            <CaseBar label="FAIL" count={0} total={10} color="red" />
          </div>
        </div>

        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">OCR Phrase Coverage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Fuzzy matched</span>
                <span className="text-blue-400 font-mono">169 / 192</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" style={{ width: '88.02%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Exact matched</span>
                <span className="text-purple-400 font-mono">155 / 192</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" style={{ width: '80.73%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Missing phrases</span>
                <span className="text-red-400 font-mono">23 / 192</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full" style={{ width: '11.98%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parser Metrics */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Parser Performance</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="text-3xl font-bold text-green-400">100%</div>
            <div className="text-sm text-gray-400 mt-1">Name</div>
            <div className="text-xs text-gray-500">10/10 SKU</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="text-3xl font-bold text-green-400">100%</div>
            <div className="text-sm text-gray-400 mt-1">Description</div>
            <div className="text-xs text-gray-500">10/10 SKU</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="text-3xl font-bold text-green-400">100%</div>
            <div className="text-sm text-gray-400 mt-1">Characteristics</div>
            <div className="text-xs text-gray-500">10/10 SKU</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, total, percentage, target, color }: {
  title: string; value: number; total: number; percentage: number; target: number; color: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; bar: string }> = {
    blue: { bg: 'from-blue-500/20', text: 'text-blue-400', bar: 'from-blue-600 to-blue-400' },
    purple: { bg: 'from-purple-500/20', text: 'text-purple-400', bar: 'from-purple-600 to-purple-400' },
    green: { bg: 'from-green-500/20', text: 'text-green-400', bar: 'from-green-600 to-green-400' },
  };
  const c = colorMap[color];

  return (
    <div className={`rounded-xl bg-gradient-to-br ${c.bg} to-transparent border border-gray-800 p-6`}>
      <p className="text-sm text-gray-400">{title}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${c.text}`}>{value}</span>
        <span className="text-gray-500">/ {total}</span>
      </div>
      <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${c.bar} rounded-full transition-all`} style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="mt-2 flex justify-between text-xs">
        <span className="text-gray-500">{percentage.toFixed(2)}%</span>
        <span className="text-gray-500">Target: {target}/{total}</span>
      </div>
    </div>
  );
}

function TableRow({ metric, value, gate, status }: {
  metric: string; value: string; gate: string; status: string;
}) {
  const statusColors: Record<string, string> = {
    pass: 'bg-green-500/20 text-green-400',
    warn: 'bg-amber-500/20 text-amber-400',
    fail: 'bg-red-500/20 text-red-400',
  };
  const statusLabels: Record<string, string> = {
    pass: '✓ PASS',
    warn: '⚠ WARN',
    fail: '✗ FAIL',
  };

  return (
    <tr className="border-b border-gray-800/50 hover:bg-gray-800/30">
      <td className="py-3 px-4 text-gray-300">{metric}</td>
      <td className="py-3 px-4 text-center font-mono text-gray-200">{value}</td>
      <td className="py-3 px-4 text-center font-mono text-gray-500">{gate}</td>
      <td className="py-3 px-4 text-center">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </td>
    </tr>
  );
}

function CaseBar({ label, count, total, color }: {
  label: string; count: number; total: number; color: string;
}) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-gray-400 font-mono">{count} / {total}</span>
      </div>
      <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${colorMap[color]} rounded-full`} style={{ width: `${(count / total) * 100}%` }}></div>
      </div>
    </div>
  );
}
