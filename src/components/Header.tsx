export function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-100">Ozon Product Parser</h1>
            <p className="text-xs text-gray-500">Technical Analysis Dashboard — v2.7</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-gray-400">Baseline Stable</span>
          </div>
          <div className="px-3 py-1 rounded-md bg-gray-800 border border-gray-700 text-xs text-gray-400">
            Manifest V3 • Tesseract.js
          </div>
        </div>
      </div>
    </header>
  );
}
