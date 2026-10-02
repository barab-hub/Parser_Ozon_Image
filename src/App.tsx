import { useState, useRef, useCallback } from 'react';
import { createWorker, Worker } from 'tesseract.js';

// Артикулы из задачи
const DEFAULT_SKUS = [
  '3182041371',
  '1134254160',
  '201027586',
  '2303155197',
  '3274238903',
  '3313614437',
  '3266429626',
  '1707671336',
  '3215036374',
  '3110551229',
];

interface ImageSlot {
  file: File | null;
  preview: string | null;
  ocrText: string;
  ocrConfidence: number;
  ocrLoading: boolean;
  ocrError: string | null;
}

interface SkuData {
  sku: string;
  images: [ImageSlot, ImageSlot, ImageSlot];
}

type PreprocessMode = 'none' | 'grayscale' | 'invert' | 'high-contrast' | 'binary';

const PREPROCESS_OPTIONS: { value: PreprocessMode; label: string; desc: string }[] = [
  { value: 'none', label: 'Оригинал', desc: 'Без обработки' },
  { value: 'grayscale', label: 'Grayscale', desc: 'Оттенки серого' },
  { value: 'invert', label: 'Invert', desc: 'Инверсия цветов' },
  { value: 'high-contrast', label: 'High Contrast', desc: 'Усиление контраста' },
  { value: 'binary', label: 'Binary', desc: 'Бинаризация' },
];

const PSM_OPTIONS = [
  { value: 3, label: 'PSM 3 — Full auto' },
  { value: 6, label: 'PSM 6 — Block of text' },
  { value: 7, label: 'PSM 7 — Single line' },
  { value: 8, label: 'PSM 8 — Single word' },
  { value: 11, label: 'PSM 11 — Sparse text' },
  { value: 13, label: 'PSM 13 — Raw line' },
];

function createEmptySlot(): ImageSlot {
  return {
    file: null,
    preview: null,
    ocrText: '',
    ocrConfidence: 0,
    ocrLoading: false,
    ocrError: null,
  };
}

function createSkuData(sku: string): SkuData {
  return {
    sku,
    images: [createEmptySlot(), createEmptySlot(), createEmptySlot()],
  };
}

// Preprocessing canvas
function preprocessImage(
  file: File,
  mode: PreprocessMode
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0);

      if (mode !== 'none') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        if (mode === 'grayscale') {
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i + 1] = data[i + 2] = avg;
          }
        } else if (mode === 'invert') {
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
          }
        } else if (mode === 'high-contrast') {
          const factor = 1.5;
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
            data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
            data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
          }
        } else if (mode === 'binary') {
          const threshold = 128;
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const val = avg > threshold ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = val;
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export default function App() {
  const [skus, setSkus] = useState<SkuData[]>(DEFAULT_SKUS.map(createSkuData));
  const [preprocess, setPreprocess] = useState<PreprocessMode>('none');
  const [psm, setPsm] = useState<number>(6);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalProgress, setGlobalProgress] = useState('');
  const [expandedSku, setExpandedSku] = useState<string | null>(DEFAULT_SKUS[0]);
  const workerRef = useRef<Worker | null>(null);

  const handleFileUpload = useCallback(
    (skuIndex: number, imageIndex: number, file: File) => {
      const preview = URL.createObjectURL(file);
      setSkus((prev) => {
        const next = [...prev];
        const sku = { ...next[skuIndex] };
        const images = [...sku.images] as [ImageSlot, ImageSlot, ImageSlot];
        images[imageIndex] = {
          ...images[imageIndex],
          file,
          preview,
          ocrText: '',
          ocrConfidence: 0,
          ocrError: null,
        };
        sku.images = images;
        next[skuIndex] = sku;
        return next;
      });
    },
    []
  );

  const runOcrOnImage = async (
    file: File,
    preprocessMode: PreprocessMode,
    psmMode: number,
    onProgress?: (text: string) => void
  ): Promise<{ text: string; confidence: number }> => {
    const processedDataUrl = await preprocessImage(file, preprocessMode);

    if (!workerRef.current) {
      workerRef.current = await createWorker('rus+eng');
    }
    const worker = workerRef.current;

    await worker.setParameters({
      tessedit_pageseg_mode: psmMode as any,
    });

    const { data } = await worker.recognize(processedDataUrl);
    onProgress?.(data.text);
    return {
      text: data.text.trim(),
      confidence: data.confidence,
    };
  };

  const runOcrOnSlot = async (skuIndex: number, imageIndex: number) => {
    const sku = skus[skuIndex];
    const slot = sku.images[imageIndex];
    if (!slot.file) return;

    setSkus((prev) => {
      const next = [...prev];
      const s = { ...next[skuIndex] };
      const imgs = [...s.images] as [ImageSlot, ImageSlot, ImageSlot];
      imgs[imageIndex] = { ...imgs[imageIndex], ocrLoading: true, ocrError: null };
      s.images = imgs;
      next[skuIndex] = s;
      return next;
    });

    try {
      const result = await runOcrOnImage(slot.file, preprocess, psm);
      setSkus((prev) => {
        const next = [...prev];
        const s = { ...next[skuIndex] };
        const imgs = [...s.images] as [ImageSlot, ImageSlot, ImageSlot];
        imgs[imageIndex] = {
          ...imgs[imageIndex],
          ocrText: result.text,
          ocrConfidence: result.confidence,
          ocrLoading: false,
        };
        s.images = imgs;
        next[skuIndex] = s;
        return next;
      });
    } catch (err: any) {
      setSkus((prev) => {
        const next = [...prev];
        const s = { ...next[skuIndex] };
        const imgs = [...s.images] as [ImageSlot, ImageSlot, ImageSlot];
        imgs[imageIndex] = {
          ...imgs[imageIndex],
          ocrLoading: false,
          ocrError: err.message || 'OCR failed',
        };
        s.images = imgs;
        next[skuIndex] = s;
        return next;
      });
    }
  };

  const runOcrOnAll = async () => {
    setGlobalLoading(true);
    let total = 0;
    let done = 0;
    skus.forEach((s) => s.images.forEach((img) => img.file && total++));

    for (let si = 0; si < skus.length; si++) {
      for (let ii = 0; ii < 3; ii++) {
        if (skus[si].images[ii].file) {
          setGlobalProgress(`SKU ${skus[si].sku} • Изображение ${ii + 1}/3 (${++done}/${total})`);
          await runOcrOnSlot(si, ii);
        }
      }
    }
    setGlobalLoading(false);
    setGlobalProgress('');
  };

  const totalImages = skus.reduce(
    (sum, s) => sum + s.images.filter((i) => i.file).length,
    0
  );
  const processedImages = skus.reduce(
    (sum, s) => sum + s.images.filter((i) => i.ocrText).length,
    0
  );

  const exportResults = () => {
    const data = skus.map((s) => ({
      sku: s.sku,
      images: s.images.map((img, idx) => ({
        index: idx + 1,
        fileName: img.file?.name || null,
        text: img.ocrText,
        confidence: img.ocrConfidence,
      })),
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ozon-ocr-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">O</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Ozon OCR Parser</h1>
              <p className="text-xs text-gray-500">Tesseract.js • Manifest V3 Ready</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 text-sm">
              <span className="text-gray-400">
                📦 <span className="text-gray-200 font-mono">{skus.length}</span> SKU
              </span>
              <span className="text-gray-400">
                🖼️ <span className="text-gray-200 font-mono">{totalImages}</span> изображений
              </span>
              <span className="text-gray-400">
                ✓ <span className="text-green-400 font-mono">{processedImages}</span> обработано
              </span>
            </div>
            <button
              onClick={exportResults}
              disabled={processedImages === 0}
              className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📥 Экспорт JSON
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Global Controls */}
        <div className="rounded-xl bg-gray-900 border border-gray-800 p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">⚙️ Настройки OCR</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
                Preprocessing
              </label>
              <select
                value={preprocess}
                onChange={(e) => setPreprocess(e.target.value as PreprocessMode)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              >
                {PREPROCESS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} — {opt.desc}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
                PSM Mode
              </label>
              <select
                value={psm}
                onChange={(e) => setPsm(parseInt(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              >
                {PSM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={runOcrOnAll}
                disabled={globalLoading || totalImages === 0}
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {globalLoading ? '⏳ Обработка...' : `🚀 Запустить OCR на всех (${totalImages})`}
              </button>
            </div>
          </div>
          {globalLoading && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2 text-sm text-blue-300">
              {globalProgress}
            </div>
          )}
          <div className="mt-3 text-xs text-gray-500">
            💡 Загрузите изображения с компьютера (правый клик на картинке Ozon → "Сохранить изображение как...")
          </div>
        </div>

        {/* SKU List */}
        <div className="space-y-3">
          {skus.map((sku, skuIndex) => {
            const isExpanded = expandedSku === sku.sku;
            const uploadedCount = sku.images.filter((i) => i.file).length;
            const processedCount = sku.images.filter((i) => i.ocrText).length;

            return (
              <div
                key={sku.sku}
                className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden"
              >
                {/* SKU Header */}
                <button
                  onClick={() => setExpandedSku(isExpanded ? null : sku.sku)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{isExpanded ? '▾' : '▸'}</span>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-gray-100">
                          SKU {sku.sku}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            processedCount === 3
                              ? 'bg-green-500/20 text-green-400'
                              : processedCount > 0
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-700 text-gray-400'
                          }`}
                        >
                          {processedCount === 3
                            ? '✓ Готово'
                            : processedCount > 0
                            ? `${processedCount}/3`
                            : 'Не начато'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {uploadedCount}/3 изображений загружено
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://www.ozon.ru/product/${sku.sku}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1 rounded bg-gray-800 border border-gray-700 text-xs text-gray-400 hover:text-blue-400 hover:border-blue-500/50"
                  >
                    Открыть на Ozon ↗
                  </a>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {sku.images.map((slot, imgIndex) => (
                        <ImageCard
                          key={imgIndex}
                          slot={slot}
                          imageIndex={imgIndex}
                          onFileUpload={(file) =>
                            handleFileUpload(skuIndex, imgIndex, file)
                          }
                          onRunOcr={() => runOcrOnSlot(skuIndex, imgIndex)}
                        />
                      ))}
                    </div>

                    {/* Combined OCR Text */}
                    {sku.images.some((i) => i.ocrText) && (
                      <div className="mt-4 rounded-lg bg-gray-800/50 border border-gray-700 p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          📝 Объединённый текст OCR (все изображения)
                        </h4>
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900 rounded p-3 max-h-64 overflow-y-auto">
                          {sku.images
                            .map((img, idx) =>
                              img.ocrText
                                ? `[Изображение ${idx + 1} | conf: ${img.ocrConfidence.toFixed(1)}%]\n${img.ocrText}`
                                : null
                            )
                            .filter(Boolean)
                            .join('\n\n')}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-600">
          Ozon Product Parser • Tesseract.js (локально) • Manifest V3 Ready
        </div>
      </div>
    </div>
  );
}

function ImageCard({
  slot,
  imageIndex,
  onFileUpload,
  onRunOcr,
}: {
  slot: ImageSlot;
  imageIndex: number;
  onFileUpload: (file: File) => void;
  onRunOcr: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileUpload(file);
    }
  };

  return (
    <div className="rounded-lg bg-gray-800/50 border border-gray-700 overflow-hidden">
      <div className="px-3 py-2 border-b border-gray-700 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">
          Изображение {imageIndex + 1}
        </span>
        {slot.file && (
          <span className="text-xs text-gray-500 truncate max-w-[120px]">
            {slot.file.name}
          </span>
        )}
      </div>

      {/* Image Preview / Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative aspect-video bg-gray-900 flex items-center justify-center overflow-hidden"
      >
        {slot.preview ? (
          <img
            src={slot.preview}
            alt={`img-${imageIndex + 1}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center p-4">
            <div className="text-3xl mb-2 opacity-30">🖼️</div>
            <p className="text-xs text-gray-500">
              Перетащите или нажмите для загрузки
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileUpload(file);
          }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Upload image"
        />
      </div>

      {/* Controls */}
      <div className="p-3 space-y-2">
        {slot.file && (
          <button
            onClick={onRunOcr}
            disabled={slot.ocrLoading}
            className="w-full px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white text-xs font-medium transition-colors"
          >
            {slot.ocrLoading ? '⏳ Распознаю...' : '🔍 Распознать текст'}
          </button>
        )}

        {/* OCR Result */}
        {slot.ocrError && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded p-2">
            ❌ {slot.ocrError}
          </div>
        )}

        {slot.ocrText && (
          <div className="bg-gray-900 rounded p-2 border border-gray-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Распознанный текст:</span>
              <span
                className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                  slot.ocrConfidence >= 80
                    ? 'bg-green-500/20 text-green-400'
                    : slot.ocrConfidence >= 60
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {slot.ocrConfidence.toFixed(1)}%
              </span>
            </div>
            <pre className="text-xs text-gray-200 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">
              {slot.ocrText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
