import React from 'react';
import { 
  Play, 
  Sparkles, 
  Code2, 
  Sliders, 
  Upload, 
  GitPullRequest, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Layers
} from 'lucide-react';
import { CODE_PRESETS, CodePreset } from '../data/presets';
import { ReviewMode } from '../types';

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
  isReviewing: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LANGUAGES = [
  { id: 'typescript', name: 'TypeScript', ext: '.ts' },
  { id: 'python', name: 'Python', ext: '.py' },
  { id: 'go', name: 'Go', ext: '.go' },
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
  isReviewing,
  onFileUpload
}) => {
  return (
    <div className="w-full rounded-2xl bg-[#0d1322] border border-slate-800/80 p-4 sm:p-5 shadow-xl shadow-black/20 space-y-4">
      {/* Top row: Presets Quick Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Automated Scenario Presets:
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Language selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Code2 className="h-3.5 w-3.5 text-cyan-400" />
            Language
          </label>
          <select
            value={language}
            onChange={(e) => {
              const selected = e.target.value;
              setLanguage(selected);
              const langObj = LANGUAGES.find(l => l.id === selected);
              if (langObj) {
                const baseName = filename.split('.')[0] || 'service';
                setFilename(`${baseName}${langObj.ext}`);
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

        {/* Review Focus Mode */}
        <div className="space-y-1.5">
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
            <option value="security_hardening">🛡️ Deep Security & Vulnerability</option>
            <option value="performance_scalability">🚀 Performance & Concurrency</option>
            <option value="clean_architecture">🧹 Clean Architecture & SOLID</option>
          </select>
        </div>

        {/* Target Filename */}
        <div className="space-y-1.5">
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

        {/* Git Branch & PR */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <GitPullRequest className="h-3.5 w-3.5 text-emerald-400" />
            Branch & PR#
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-2/3 bg-[#080c14] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-slate-600 font-mono"
              placeholder="main"
            />
            <input
              type="number"
              value={prNumber}
              onChange={(e) => setPrNumber(parseInt(e.target.value) || 1)}
              className="w-1/3 bg-[#080c14] border border-slate-800 text-slate-200 text-xs rounded-xl px-2 py-2.5 focus:outline-none focus:border-slate-600 font-mono text-center"
              placeholder="42"
            />
          </div>
        </div>

        {/* Execute Button */}
        <div className="flex items-end gap-2">
          <button
            onClick={onRunReview}
            disabled={isReviewing}
            className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
              isReviewing
                ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/20 hover:shadow-cyan-500/30'
            }`}
          >
            {isReviewing ? (
              <>
                <span className="h-3.5 w-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></span>
                <span>Reviewing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Run 24/7 Review</span>
              </>
            )}
          </button>

          {/* Upload file trigger */}
          <label 
            className="cursor-pointer p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-cyan-300 transition-colors flex items-center justify-center shrink-0"
            title="Upload source file from disk"
          >
            <Upload className="h-4 w-4" />
            <input 
              type="file" 
              className="hidden" 
              onChange={onFileUpload}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
