import React, { useState } from 'react';
import { Check, Copy, ArrowRight, Sparkles, FileCode, CheckCircle2 } from 'lucide-react';

interface RefactoredDiffViewerProps {
  originalCode: string;
  refactoredCode: string;
  filename: string;
  language: string;
  onApplyAllRefactoring: () => void;
}

export const RefactoredDiffViewer: React.FC<RefactoredDiffViewerProps> = ({
  originalCode,
  refactoredCode,
  filename,
  language,
  onApplyAllRefactoring
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'refactored_only'>('split');

  const handleCopy = () => {
    navigator.clipboard.writeText(refactoredCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl bg-[#0d1322] border border-slate-800/90 shadow-2xl overflow-hidden space-y-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3.5 bg-[#090d16] border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Automated AI Refactoring</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
              Production Cleaned
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'split' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side-by-Side Diff
            </button>
            <button
              onClick={() => setViewMode('refactored_only')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'refactored_only' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Refactored Only
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors font-mono"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={onApplyAllRefactoring}
            className="flex items-center gap-1.5 text-xs font-bold text-white px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-md shadow-emerald-500/20 transition-all font-mono"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Apply to Editor</span>
          </button>
        </div>
      </div>

      {/* Code Container */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80 bg-[#070a12] text-xs font-mono">
          {/* Left: Original Code */}
          <div className="flex flex-col max-h-[500px]">
            <div className="px-4 py-2 bg-rose-950/20 border-b border-slate-800/80 flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 text-rose-300 font-semibold text-[11px]">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                Original Committed Code (With Deficiencies)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{filename}</span>
            </div>
            <div className="p-4 overflow-auto flex-1 font-mono text-slate-400 leading-6 whitespace-pre">
              {originalCode}
            </div>
          </div>

          {/* Right: Refactored Code */}
          <div className="flex flex-col max-h-[500px]">
            <div className="px-4 py-2 bg-emerald-950/20 border-b border-slate-800/80 flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                AI Refactored & Hardened Version
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Vertex AI Validated</span>
            </div>
            <div className="p-4 overflow-auto flex-1 font-mono text-emerald-300/90 leading-6 whitespace-pre bg-emerald-950/5">
              {refactoredCode}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-[#070a12] max-h-[500px] overflow-auto font-mono text-xs text-emerald-300/90 leading-6 whitespace-pre">
          {refactoredCode}
        </div>
      )}

      {/* Footer Info */}
      <div className="px-5 py-2.5 bg-[#090d16] border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">✓ Security Hardened</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400">✓ Safe Concurrency</span>
          <span className="text-slate-600">•</span>
          <span className="text-indigo-400">✓ GCP Best Practices</span>
        </div>
        <span className="text-[11px] text-slate-500">
          Ready for Git commit & Cloud Build CI
        </span>
      </div>
    </div>
  );
};
