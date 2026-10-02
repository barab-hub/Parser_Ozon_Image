export function OCREvidence() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">🔍 OCR Evidence</h2>
        <p className="text-gray-400">Каждая строка должна происходить из реального OCR с полной диагностикой</p>
      </div>

      {/* Evidence Format */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Формат OCR Evidence</h3>
        <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <div className="text-gray-500">// Каждая распознанная строка должна иметь:</div>
          <div className="mt-2 text-gray-300">{'{'}</div>
          <div className="pl-4">
            <div><span className="text-blue-400">"text"</span>: <span className="text-green-400">"Сочное манго"</span>,</div>
            <div><span className="text-blue-400">"confidence"</span>: <span className="text-yellow-400">82</span>,</div>
            <div><span className="text-blue-400">"region"</span>: <span className="text-green-400">"short-label-3"</span>,</div>
            <div><span className="text-blue-400">"variant"</span>: <span className="text-green-400">"gray-upscale"</span>,</div>
            <div><span className="text-blue-400">"psm"</span>: <span className="text-yellow-400">7</span>,</div>
            <div><span className="text-blue-400">"scale"</span>: <span className="text-green-400">"2x"</span>,</div>
            <div><span className="text-blue-400">"pipeline_level"</span>: <span className="text-yellow-400">4</span>,</div>
            <div><span className="text-blue-400">"sku"</span>: <span className="text-green-400">"2303155197"</span>,</div>
            <div><span className="text-blue-400">"image_index"</span>: <span className="text-yellow-400">1</span></div>
          </div>
          <div className="text-gray-300">{'}'}</div>
        </div>
      </div>

      {/* Example Evidence Table */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Примеры OCR Evidence (baseline v2.7)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-2 px-3 text-gray-400">Text</th>
                <th className="text-center py-2 px-3 text-gray-400">Conf</th>
                <th className="text-left py-2 px-3 text-gray-400">Region</th>
                <th className="text-left py-2 px-3 text-gray-400">Variant</th>
                <th className="text-center py-2 px-3 text-gray-400">PSM</th>
                <th className="text-center py-2 px-3 text-gray-400">Level</th>
                <th className="text-center py-2 px-3 text-gray-400">Match</th>
              </tr>
            </thead>
            <tbody>
              <EvidenceRow text="Натуральный состав" conf={91} region="title-1" variant="original" psm={6} level={1} match="exact" />
              <EvidenceRow text="Подарочный набор" conf={88} region="title-2" variant="grayscale" psm={6} level={1} match="exact" />
              <EvidenceRow text="Для неё" conf={85} region="badge-1" variant="binary" psm={7} level={2} match="exact" />
              <EvidenceRow text="100% качество" conf={79} region="label-3" variant="high-contrast" psm={7} level={2} match="fuzzy" />
              <EvidenceRow text="Премиум" conf={72} region="badge-2" variant="upscale" psm={8} level={4} match="fuzzy" />
              <EvidenceRow text="Аромат" conf={68} region="short-label-1" variant="sharpen" psm={8} level={4} match="fuzzy" />
              <EvidenceRow text="—" conf={0} region="badge-3" variant="original" psm={8} level={5} match="missing" />
            </tbody>
          </table>
        </div>
      </div>

      {/* Missing Phrases Analysis */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Анализ missing phrases</h3>
        <p className="text-sm text-gray-400 mb-4">
          Фразы, которые не удалось распознать в baseline v2.7, и гипотезы почему:
        </p>
        <div className="space-y-3">
          <MissingPhrase
            phrase="Сладкая вишня"
            sku="2303155197"
            reason="Компактный badge на цветном фоне. Crop слишком мал для PSM 6. Нужен upscale + PSM 7/8."
            hypothesis="Badge detection + 2x upscale + PSM 8"
          />
          <MissingPhrase
            phrase="Сочное манго"
            sku="2303155197"
            reason="Аналогично 'Сладкая вишня' — маленький label на декоративном фоне."
            hypothesis="Badge detection + 2x upscale + PSM 8"
          />
          <MissingPhrase
            phrase="Романтичный пион"
            sku="2303155197"
            reason="Третий badge в ряду. Цветной фон снижает контраст после grayscale."
            hypothesis="Adaptive threshold + PSM 7"
          />
          <MissingPhrase
            phrase="ПРЕМИУМ КОЛЛЕКЦИЯ"
            sku="3215036374"
            reason="Крупный текст, но на декоративном/градиентном фоне. Tesseract путается в сегментации."
            hypothesis="Adaptive threshold + PSM 6/7"
          />
          <MissingPhrase
            phrase="Хлопок"
            sku="3215036374"
            reason="Маленькая подпись. Crop недостаточного размера."
            hypothesis="Badge detection + padding + PSM 8"
          />
          <MissingPhrase
            phrase="90 дней"
            sku="3182041371"
            reason="Очень мелкий numeric badge. PSM 13 не справляется с кириллицей."
            hypothesis="3x upscale + PSM 7 (line) вместо PSM 13"
          />
          <MissingPhrase
            phrase="Погрузитесь"
            sku="2303155197, 3215036374, 3182041371"
            reason="Первая строка многострочного текста на декоративном фоне."
            hypothesis="Adaptive threshold + line merge"
          />
          <MissingPhrase
            phrase="в атмосферу спокойствия"
            sku="2303155197, 3215036374, 3182041371"
            reason="Вторая строка многострочного текста."
            hypothesis="Adaptive threshold + line merge"
          />
          <MissingPhrase
            phrase="вместе с OWMY"
            sku="3215036374, 3182041371"
            reason="Последняя строка с латиницей. Tesseract может путать скрипты."
            hypothesis="Line merge + mixed script handling"
          />
        </div>
      </div>

      {/* Anti-Patterns */}
      <div className="rounded-xl bg-red-900/10 border border-red-500/30 p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4">🚫 Anti-Patterns (нельзя делать)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AntiPattern text="Копировать Ground Truth в OCR результат" />
          <AntiPattern text="Добавлять ожидаемую фразу без OCR evidence" />
          <AntiPattern text="Hardcode результата для конкретного SKU" />
          <AntiPattern text="Использовать regression expected phrases как OCR-источник" />
          <AntiPattern text="Снижать fuzzy threshold ради прохождения теста" />
          <AntiPattern text="Заменять хороший baseline-текст более плохим" />
        </div>
      </div>
    </div>
  );
}

function EvidenceRow({ text, conf, region, variant, psm, level, match }: {
  text: string; conf: number; region: string; variant: string; psm: number; level: number; match: string;
}) {
  const matchColors: Record<string, string> = {
    exact: 'text-green-400',
    fuzzy: 'text-yellow-400',
    missing: 'text-red-400',
  };

  return (
    <tr className="border-b border-gray-800/50 hover:bg-gray-800/30">
      <td className="py-2 px-3 text-gray-200 font-mono">"{text}"</td>
      <td className="py-2 px-3 text-center font-mono text-gray-400">{conf}</td>
      <td className="py-2 px-3 text-gray-400">{region}</td>
      <td className="py-2 px-3 text-gray-400">{variant}</td>
      <td className="py-2 px-3 text-center font-mono text-gray-400">{psm}</td>
      <td className="py-2 px-3 text-center font-mono text-gray-400">L{level}</td>
      <td className={`py-2 px-3 text-center font-medium ${matchColors[match]}`}>{match}</td>
    </tr>
  );
}

function MissingPhrase({ phrase, sku, reason, hypothesis }: {
  phrase: string; sku: string; reason: string; hypothesis: string;
}) {
  return (
    <div className="border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-400 text-lg">✗</span>
        <span className="font-mono text-gray-200">"{phrase}"</span>
        <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 text-xs font-mono">SKU {sku}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-gray-500 uppercase">Why missing:</span>
          <p className="text-sm text-gray-400">{reason}</p>
        </div>
        <div>
          <span className="text-xs text-green-500 uppercase">Hypothesis:</span>
          <p className="text-sm text-green-400">{hypothesis}</p>
        </div>
      </div>
    </div>
  );
}

function AntiPattern({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-900/20 border border-red-500/20">
      <span className="text-red-400">🚫</span>
      <span className="text-sm text-gray-300">{text}</span>
    </div>
  );
}
