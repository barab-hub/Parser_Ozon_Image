export function RegressionFixture() {
  const fixtures = [
    { sku: '3182041371', images: 3, phrases: 22, status: 'warn', missing: 4 },
    { sku: '1134254160', images: 3, phrases: 18, status: 'pass', missing: 1 },
    { sku: '201027586', images: 3, phrases: 20, status: 'pass', missing: 1 },
    { sku: '2303155197', images: 3, phrases: 24, status: 'warn', missing: 5 },
    { sku: '3274238903', images: 3, phrases: 16, status: 'pass', missing: 2 },
    { sku: '3313614437', images: 3, phrases: 19, status: 'pass', missing: 2 },
    { sku: '3266429626', images: 3, phrases: 21, status: 'pass', missing: 3 },
    { sku: '1707671336', images: 3, phrases: 17, status: 'pass', missing: 1 },
    { sku: '3215036374', images: 3, phrases: 20, status: 'warn', missing: 5 },
    { sku: '3110551229', images: 3, phrases: 15, status: 'pass', missing: 2 },
  ];

  const totalPhrases = fixtures.reduce((sum, f) => sum + f.phrases, 0);
  const totalMissing = fixtures.reduce((sum, f) => sum + f.missing, 0);
  const totalImages = fixtures.reduce((sum, f) => sum + f.images, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">🧪 Regression Fixture</h2>
        <p className="text-gray-400">10 SKU • {totalImages} изображений • {totalPhrases} эталонных фраз • работает offline</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg bg-gray-900 border border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">10</div>
          <div className="text-sm text-gray-400">SKU</div>
        </div>
        <div className="rounded-lg bg-gray-900 border border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{totalImages}</div>
          <div className="text-sm text-gray-400">Изображений</div>
        </div>
        <div className="rounded-lg bg-gray-900 border border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{totalPhrases}</div>
          <div className="text-sm text-gray-400">Фраз</div>
        </div>
        <div className="rounded-lg bg-gray-900 border border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{totalMissing}</div>
          <div className="text-sm text-gray-400">Missing</div>
        </div>
      </div>

      {/* Fixture Table */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">#</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">SKU</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Images</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Phrases</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Missing</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Accuracy</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {fixtures.map((f, i) => {
                const accuracy = ((f.phrases - f.missing) / f.phrases * 100).toFixed(1);
                return (
                  <tr key={f.sku} className="border-t border-gray-800 hover:bg-gray-800/30">
                    <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                    <td className="py-3 px-4 font-mono text-gray-200">{f.sku}</td>
                    <td className="py-3 px-4 text-center text-gray-400">{f.images}</td>
                    <td className="py-3 px-4 text-center text-gray-300">{f.phrases}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={f.missing > 3 ? 'text-red-400 font-medium' : f.missing > 0 ? 'text-yellow-400' : 'text-green-400'}>
                        {f.missing}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${parseFloat(accuracy) >= 90 ? 'bg-green-500' : parseFloat(accuracy) >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${accuracy}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-xs font-mono">{accuracy}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        f.status === 'pass' ? 'bg-green-500/20 text-green-400' :
                        f.status === 'warn' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {f.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Offline Note */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💾</span>
          <div>
            <h4 className="font-medium text-gray-200">Offline Regression</h4>
            <p className="text-sm text-gray-400 mt-1">
              Regression fixture работает полностью offline по сохранённым изображениям.
              Все 30 изображений хранятся локально. Ground Truth используется только для оценки результата,
              не для генерации OCR текста.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
