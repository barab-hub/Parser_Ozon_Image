export function ConstraintsPanel() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">🔒 Ограничения и запреты</h2>
        <p className="text-gray-400">Жёсткие правила, которые определяют границы допустимых изменений</p>
      </div>

      {/* Forbidden */}
      <div className="rounded-xl bg-red-900/10 border border-red-500/30 p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4">🚫 Категорически запрещено</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ForbiddenItem text="PaddleOCR / paddleocr / @paddleocr/paddleocr-js" />
          <ForbiddenItem text="ONNX Runtime" />
          <ForbiddenItem text="OpenCV.js для Paddle" />
          <ForbiddenItem text="Внешние OCR API" />
          <ForbiddenItem text="Облачный OCR" />
          <ForbiddenItem text="Копирование Ground Truth в OCR результат" />
          <ForbiddenItem text="Hardcode результата для SKU" />
          <ForbiddenItem text="Ground Truth как OCR-источник" />
          <ForbiddenItem text="Снижение fuzzy threshold ради теста" />
          <ForbiddenItem text="Удаление baseline-фраз" />
          <ForbiddenItem text="Замена хорошего текста более плохим" />
        </div>
      </div>

      {/* Allowed */}
      <div className="rounded-xl bg-green-900/10 border border-green-500/30 p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4">✅ Разрешено улучшать</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AllowedItem text="Crop generation" />
          <AllowedItem text="Поиск текстовых областей" />
          <AllowedItem text="Scale / Upscale" />
          <AllowedItem text="Contrast enhancement" />
          <AllowedItem text="Grayscale conversion" />
          <AllowedItem text="Thresholding (adaptive)" />
          <AllowedItem text="Inversion" />
          <AllowedItem text="Sharpening" />
          <AllowedItem text="Padding" />
          <AllowedItem text="PSM selection" />
          <AllowedItem text="Tesseract parameters" />
          <AllowedItem text="Фильтрация OCR-строк" />
          <AllowedItem text="Объединение соседних строк" />
          <AllowedItem text="Fuzzy matching" />
          <AllowedItem text="Восстановление short labels" />
          <AllowedItem text="Обработка numeric badges" />
          <AllowedItem text="Поиск текста в плашках" />
          <AllowedItem text="Segmentation изображения" />
          <AllowedItem text="Несколько OCR-проходов региона" />
        </div>
      </div>

      {/* OCR Engine Constraint */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">🔧 OCR Engine Constraint</h3>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-400 font-bold">T</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-200">Tesseract.js</h4>
              <p className="text-xs text-gray-400">Единственный разрешённый OCR engine</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Работает полностью локально в браузере</p>
            <p>• Не требует внешних API или серверов</p>
            <p>• Поддерживает кириллицу (rus traineddata)</p>
            <p>• Настраиваемые PSM modes и OEM</p>
            <p>• WebAssembly-based, работает в Chrome Extension</p>
          </div>
        </div>
      </div>

      {/* Architecture Constraints */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">🏗️ Архитектурные ограничения</h3>
        <div className="space-y-4">
          <ConstraintItem
            title="Append-Only"
            description="Все новые OCR-механизмы работают только как дополнение к baseline. Нельзя заменять уже распознанный хороший текст."
            code={`baseline_text\n+ new_reliable_line\n= combined_ocr\n\n// If uncertain → do NOT add`}
          />
          <ConstraintItem
            title="Evidence-Based"
            description="Каждая добавленная строка должна иметь реальное OCR evidence: text, confidence, region, variant, PSM, scale."
            code={`{\n  "text": "...",\n  "confidence": 82,\n  "region": "short-label-3",\n  "variant": "gray-upscale",\n  "psm": 7\n}`}
          />
          <ConstraintItem
            title="Regression-First"
            description="Любое изменение проверяется regression-тестом. Ухудшение хотя бы одного показателя = REJECT."
            code={`fuzzy >= 169/192  // must hold\nexact >= 155/192  // must hold\nFAIL = 0          // must hold`}
          />
          <ConstraintItem
            title="Minimum Crop Size"
            description="Не отправлять бессмысленные изображения в Tesseract. Минимальный размер после масштабирования."
            code={`if (width < 20 || height < 20) {\n  // skip — too small\n  // avoid "Image too small to scale!!"\n}`}
          />
        </div>
      </div>

      {/* Performance Constraints */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">⚡ Performance Constraints</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Do</h4>
            <ul className="space-y-1 text-sm text-green-400">
              <li>✓ Кешировать preprocessing</li>
              <li>✓ Избегать одинаковых crop</li>
              <li>✓ Удалять пересекающиеся regions</li>
              <li>✓ Не делать recovery для found phrases</li>
              <li>✓ Сначала дешёвый OCR</li>
              <li>✓ Тяжёлый OCR только для missing</li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Don't</h4>
            <ul className="space-y-1 text-sm text-red-400">
              <li>✗ Запускать один и тот же OCR повторно</li>
              <li>✗ Делать десятки тяжёлых проходов</li>
              <li>✗ Обрабатывать regions без текста</li>
              <li>✗ Дублировать preprocessing</li>
              <li>✗ Игнорировать кеширование</li>
              <li>✗ Запускать recovery для уже найденных</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          ⚠️ Качество важнее скорости. Но нельзя делать pipeline неоправданно тяжёлым.
        </p>
      </div>

      {/* Definition of Done */}
      <div className="rounded-xl bg-gradient-to-br from-green-900/20 to-gray-900 border border-green-500/30 p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4">🏁 Definition of Done</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Regression</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>☐ 10 cases tested</li>
              <li>☐ 30 images processed</li>
              <li>☐ 192 phrases evaluated</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Parser</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>☐ Name = 100%</li>
              <li>☐ Description = 100%</li>
              <li>☐ Characteristics = 100%</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">OCR</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>☐ Fuzzy ≥ 169 (baseline)</li>
              <li>☐ Exact ≥ 155 (baseline)</li>
              <li>☐ FAIL = 0</li>
              <li>☐ ocrErrors = 0</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Compliance</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>☐ Нет PaddleOCR</li>
              <li>☐ Нет внешних OCR API</li>
              <li>☐ Нет Ground Truth leakage</li>
              <li>☐ Нет hardcoded OCR-фраз</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForbiddenItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-red-900/20 border border-red-500/20">
      <span className="text-red-400">🚫</span>
      <span className="text-sm text-gray-300">{text}</span>
    </div>
  );
}

function AllowedItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-green-900/20 border border-green-500/20">
      <span className="text-green-400">✓</span>
      <span className="text-sm text-gray-300">{text}</span>
    </div>
  );
}

function ConstraintItem({ title, description, code }: {
  title: string; description: string; code: string;
}) {
  return (
    <div className="border border-gray-700 rounded-lg p-4">
      <h4 className="font-medium text-gray-200 mb-1">{title}</h4>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <pre className="bg-gray-800 rounded p-3 text-xs text-gray-300 font-mono overflow-x-auto">
        {code}
      </pre>
    </div>
  );
}
