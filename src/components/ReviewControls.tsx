import React from 'react';
import { 
  Sparkles, 
  Code2, 
  Sliders, 
  Upload, 
  GitPullRequest, 
  Flame, 
  Cpu,
  Wand2,
  CheckCircle2
} from 'lucide-react';
import { CODE_PRESETS, CodePreset } from '../data/presets';
import { ReviewMode } from '../types';
import { DetectedLanguage } from '../utils/languageDetector';

interface ReviewControlsProps {
  language: string;
  setLanguage: (lang: string) => void;
  reviewMode: ReviewMode;
  setReviewMode: (mode: ReviewMode) => void;
  selectedPresetId: string;
  onSelectPreset: (preset: CodePreset) => void;
  filename: string;
  setFilename: (name: string) => void;
  branch: string;
  setBranch: (branch: string) => void;
  prNumber: number;
  setPrNumber: (pr: number) => void;
  onRunReview: () => void;
  onAutoFix: () => void;
  isReviewing: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  detectedLang?: DetectedLanguage | null;
  hasRefactoredCode?: boolean;
}

const LANGUAGES = [
  { id: 'auto', name: '✨ Auto-Detect (ANN / Lexical)', ext: '' },
  { id: 'python', name: 'Python', ext: '.py' },
  { id: 'typescript', name: 'TypeScript', ext: '.ts' },
  { id: 'javascript', name: 'JavaScript', ext: '.js' },
  { id: 'go', name: 'Go (Golang)', ext: '.go' },
  { id: 'rust', name: 'Rust', ext: '.rs' },
  { id: 'dockerfile', name: 'Dockerfile', ext: '' },
  { id: 'terraform', name: 'Terraform (GCP)', ext: '.tf' },
  { id: 'sql', name: 'SQL', ext: '.sql' },
  { id: 'java', name: 'Java', ext: '.java' },
  { id: 'cpp', name: 'C++', ext: '.cpp' }
];

export const ReviewControls: React.FC<ReviewControlsProps> = ({
  language,
  setLanguage,
  reviewMode,
  setReviewMode,
  selectedPresetId,
  onSelectPreset,
  filename,
  setFilename,
  branch,
  setBranch,
  prNumber,
  setPrNumber,
  onRunReview,
  onAutoFix,
  isReviewing,
  onFileUpload,
  detectedLang,
  hasRefactoredCode
}) => {
  return (
    <div className="w-full rounded-2xl bg-[#0d1322] border border-slate-800/80 p-4 sm:p-5 shadow-xl shadow-black/20 space-y-4">
      {/* Top row: Presets Quick Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Defect Presets:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {CODE_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all border font-mono flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
                title={preset.description}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                {preset.name.split(':')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main configuration controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
        {/* Language selector with Auto-Detect (3 cols) */}
        <div className="lg:col-span-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-cyan-400" />
              Language
            </label>
            {detectedLang && (
              <span className="text-[10px] font-mono text-emerald-400">
                {Math.round(detectedLang.confidence * 100)}% Match
              </span>
            )}
          </div>
          <select
            value={language}
            onChange={(e) => {
              const selected = e.target.value;
              setLanguage(selected);
              if (selected !== 'auto') {
                const langObj = LANGUAGES.find(l => l.id === selected);
                if (langObj && langObj.ext) {
                  const baseName = filename.split('.')[0] || 'service';
                  setFilename(`${baseName}${langObj.ext}`);
                }
              }
            }}
            className="w-full bg-[#080c14] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500/50 font-mono transition-colors"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Review Focus Mode (3 cols) */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-indigo-400" />
            Analysis Engine Mode
          </label>
          <select
            value={reviewMode}
            onChange={(e) => setReviewMode(e.target.value as ReviewMode)}
            className="w-full bg-[#080c14] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500/50 font-mono transition-colors"
          >
            <option value="full_360">⚡ Full 360° Comprehensive</option>
            <option value="security_hardening">🛡️ Deep Security & Vulnerabilities</option>
            <option value="performance_scalability">🚀 Performance & Concurrency</option>
            <option value="clean_architecture">🧹 Clean Architecture & SOLID</option>
          </select>
        </div>

        {/* Target Filename (2 cols) */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Source File
          </label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full bg-[#080c14] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-slate-600 font-mono"
            placeholder="auth_service.py"
          />
        </div>

        {/* Git Branch & PR (2 cols) */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <GitPullRequest className="h-3.5 w-3.5 text-emerald-400" />
            Branch & PR
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-3/5 bg-[#080c14] border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-2.5 focus:outline-none focus:border-slate-600 font-mono"
              placeholder="main"
            />
            <input
              type="number"
              value={prNumber}
              onChange={(e) => setPrNumber(parseInt(e.target.value) || 1)}
              className="w-2/5 bg-[#080c14] border border-slate-800 text-slate-200 text-xs rounded-xl px-1.5 py-2.5 focus:outline-none focus:border-slate-600 font-mono text-center"
              placeholder="42"
            />
          </div>
        </div>

        {/* Upload file trigger (2 cols on sm, 2 cols on lg) */}
        <div className="lg:col-span-2 flex items-center gap-2">
          <label 
            className="cursor-pointer p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-cyan-300 transition-colors flex items-center justify-center shrink-0 w-11 h-11"
            title="Upload source file from disk"
          >
            <Upload className="h-4 w-4" />
            <input 
              type="file" 
              className="hidden" 
              onChange={onFileUpload}
            />
          </label>

          <button
            onClick={onRunReview}
            disabled={isReviewing}
            className={`flex-1 h-11 px-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md ${
              isReviewing
                ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50'
            }`}
          >
            {isReviewing ? (
              <>
                <span className="h-3 w-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></span>
                <span>Reviewing</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Review</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Intelligent Status Bar & Auto-Fix Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-800/60 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-400 flex-wrap">
          <span className="flex items-center gap-1 text-cyan-300 font-semibold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            ANN AST: {detectedLang ? `${detectedLang.name} (${Math.round(detectedLang.confidence * 100)}%)` : 'Active'}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 text-[11px]">
            Controller: <span className="text-slate-300">Vertex AI Gemini Flash Lite</span>
          </span>
          {detectedLang?.detectedFeatures && detectedLang.detectedFeatures.length > 0 && (
            <>
              <span className="text-slate-600 hidden md:inline">•</span>
              <span className="text-[10px] text-slate-500 hidden md:inline">
                Tokens: {detectedLang.detectedFeatures.slice(0, 3).join(', ')}
              </span>
            </>
          )}
        </div>

        {/* Instant Auto-Fix Action */}
        <button
          onClick={onAutoFix}
          disabled={isReviewing}
          className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-mono text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <Wand2 className="h-3.5 w-3.5" />
          <span>⚡ Auto-Fix Code (ANN + Gemini Lite)</span>
        </button>
      </div>
    </div>
  );
};
