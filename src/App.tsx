import { useState } from 'react';
import { Header } from './components/Header';
import { MetricsPanel } from './components/MetricsPanel';
import { PipelineDiagram } from './components/PipelineDiagram';
import { TechnicalReport } from './components/TechnicalReport';
import { ProblemCases } from './components/ProblemCases';
import { RegressionFixture } from './components/RegressionFixture';
import { ImprovementRoadmap } from './components/ImprovementRoadmap';
import { RegressionGate } from './components/RegressionGate';
import { OCREvidence } from './components/OCREvidence';
import { ConstraintsPanel } from './components/ConstraintsPanel';

export default function App() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Обзор', icon: '📊' },
    { id: 'metrics', label: 'Метрики', icon: '📈' },
    { id: 'pipeline', label: 'Pipeline', icon: '🔄' },
    { id: 'report', label: 'Отчёт', icon: '📋' },
    { id: 'problems', label: 'Проблемы', icon: '⚠️' },
    { id: 'fixture', label: 'Fixture', icon: '🧪' },
    { id: 'roadmap', label: 'Roadmap', icon: '🗺️' },
    { id: 'gate', label: 'Gate', icon: '🚦' },
    { id: 'evidence', label: 'Evidence', icon: '🔍' },
    { id: 'constraints', label: 'Ограничения', icon: '🔒' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === 'overview' && <OverviewSection />}
        {activeSection === 'metrics' && <MetricsPanel />}
        {activeSection === 'pipeline' && <PipelineDiagram />}
        {activeSection === 'report' && <TechnicalReport />}
        {activeSection === 'problems' && <ProblemCases />}
        {activeSection === 'fixture' && <RegressionFixture />}
        {activeSection === 'roadmap' && <ImprovementRoadmap />}
        {activeSection === 'gate' && <RegressionGate />}
        {activeSection === 'evidence' && <OCREvidence />}
        {activeSection === 'constraints' && <ConstraintsPanel />}
      </main>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 via-gray-900 to-purple-900/30 border border-gray-800 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Ozon Product Parser
          </h1>
          <p className="mt-2 text-xl text-gray-300">Chrome Extension — Manifest V3</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
              v2.7 Stable Baseline
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium border border-blue-500/30">
              Tesseract.js Local OCR
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium border border-purple-500/30">
              Append-Only Architecture
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="OCR Fuzzy"
          value="169 / 192"
          subtitle="88.02%"
          color="blue"
          icon="🎯"
        />
        <StatCard
          title="OCR Exact"
          value="155 / 192"
          subtitle="80.73%"
          color="purple"
          icon="✏️"
        />
        <StatCard
          title="Parser"
          value="100%"
          subtitle="Name / Desc / Chars"
          color="green"
          icon="✅"
        />
        <StatCard
          title="Overall"
          value="94%"
          subtitle="8 PASS / 2 WARN / 0 FAIL"
          color="amber"
          icon="📊"
        />
      </div>

      {/* Architecture Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">🏗️ Архитектура v2.7</h3>
          <div className="space-y-3">
            <ArchItem label="OCR Engine" value="Tesseract.js (локально)" />
            <ArchItem label="Image Variants" value="6 типов обработки" />
            <ArchItem label="PSM Modes" value="block / sparse / line / label / numeric / long" />
            <ArchItem label="Pipeline Levels" value="5 уровней OCR" />
            <ArchItem label="Regression" value="10 SKU / 30 images / 192 phrases" />
            <ArchItem label="Guardrail" value="fuzzy ≥ 169, exact ≥ 155, FAIL = 0" />
          </div>
        </div>

        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">🎯 Целевые Milestones</h3>
          <div className="space-y-4">
            <MilestoneItem
              label="Milestone 1"
              fuzzy="172 / 192"
              exact="158 / 192"
              status="current"
            />
            <MilestoneItem
              label="Milestone 2"
              fuzzy="175 / 192"
              exact="160 / 192"
              status="next"
            />
            <MilestoneItem
              label="Текущий Baseline"
              fuzzy="169 / 192"
              exact="155 / 192"
              status="baseline"
            />
          </div>
        </div>
      </div>

      {/* Key Principles */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">📐 Ключевые принципы</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PrincipleCard
            title="Append-Only"
            description="Новые OCR-механизмы только как дополнение. Нельзя заменять хороший текст baseline."
            icon="➕"
          />
          <PrincipleCard
            title="Evidence-Based"
            description="Каждая строка должна происходить из реального OCR с confidence, region, variant."
            icon="🔬"
          />
          <PrincipleCard
            title="Regression-First"
            description="Любое улучшение проверяется regression-тестом. Ухудшение = REJECT."
            icon="🛡️"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, color, icon }: {
  title: string; value: string; subtitle: string; color: string; icon: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
  };

  return (
    <div className={`rounded-xl bg-gradient-to-br ${colorClasses[color]} border p-5`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="mt-3 text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-100">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function ArchItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-gray-200 text-sm font-medium">{value}</span>
    </div>
  );
}

function MilestoneItem({ label, fuzzy, exact, status }: {
  label: string; fuzzy: string; exact: string; status: string;
}) {
  const statusClasses: Record<string, string> = {
    current: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
    next: 'bg-gray-800 border-gray-700 text-gray-400',
    baseline: 'bg-green-500/20 border-green-500/40 text-green-400',
  };

  return (
    <div className={`rounded-lg border p-4 ${statusClasses[status]}`}>
      <div className="flex justify-between items-center">
        <span className="font-medium">{label}</span>
        <span className="text-xs opacity-70">
          {status === 'baseline' ? '✓ Текущий' : status === 'current' ? '→ Цель' : '○ Следующий'}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="opacity-60">Fuzzy: </span>
          <span className="font-mono">{fuzzy}</span>
        </div>
        <div>
          <span className="opacity-60">Exact: </span>
          <span className="font-mono">{exact}</span>
        </div>
      </div>
    </div>
  );
}

function PrincipleCard({ title, description, icon }: {
  title: string; description: string; icon: string;
}) {
  return (
    <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <h4 className="font-semibold text-gray-200">{title}</h4>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
