import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Cloud, 
  GitBranch, 
  History, 
  Sparkles,
  Layers,
  Settings,
  Download,
  FileText,
  FileCode2,
  ChevronDown,
  Loader2,
  Globe,
  User,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  onOpenArchitecture: () => void;
  onOpenHistory: () => void;
  onOpenGitModal: () => void;
  onOpenCreator: () => void;
  onDownloadReport: (format: 'json' | 'markdown') => void;
  hasReviewResult: boolean;
  isReviewing: boolean;
  pipelineRunning: boolean;
  gitOwner?: string;
  gitRepo?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenArchitecture,
  onOpenHistory,
  onOpenGitModal,
  onOpenCreator,
  onDownloadReport,
  hasReviewResult,
  isReviewing,
  pipelineRunning,
  gitOwner = 'cloud-enterprise',
  gitRepo = 'intelligent-reviewer'
}) => {
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  const handleExport = (format: 'json' | 'markdown') => {
    onDownloadReport(format);
    setShowExportMenu(false);
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-md px-3 sm:px-6 lg:px-8 py-2.5 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 shrink">
          <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-indigo-500/20 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10">
            <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 font-mono truncate">
                24/7 REVIEWER
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  ANN + Gemini Lite
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden md:block truncate">
              Continuous neural AST analysis, vulnerability gate & surgical refactoring
            </p>
          </div>
        </div>

        {/* Center: System Status Indicator */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/70 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${pipelineRunning ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
            <span className="font-mono font-medium">
              {pipelineRunning ? 'PIPELINE ACTIVE' : '24/7 LISTENER READY'}
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Cpu className="h-3.5 w-3.5 text-purple-400" />
            <span>ANN / ML Tokens</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Gemini Flash Lite</span>
          </div>
        </div>

        {/* Right: Actions and Dynamic Git Target Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Download Report Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                if (!hasReviewResult && !isReviewing) return;
                setShowExportMenu(!showExportMenu);
              }}
              disabled={isReviewing || !hasReviewResult}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-all shadow-sm ${
                isReviewing || !hasReviewResult
                  ? 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 hover:from-cyan-900/90 hover:to-blue-900/90 text-cyan-200 border-cyan-500/40 hover:border-cyan-400 shadow-cyan-950/30'
              }`}
              title={
                isReviewing
                  ? 'Review in progress...'
                  : hasReviewResult
                  ? 'Download structured review report'
                  : 'Complete a review to export report'
              }
            >
              {isReviewing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
              ) : (
                <Download className="h-3.5 w-3.5 text-cyan-400" />
              )}
              <span className="hidden sm:inline font-mono font-semibold">Download Report</span>
              <span className="inline sm:hidden font-mono font-semibold text-[11px]">Export</span>
              <ChevronDown className={`h-3 w-3 text-cyan-400/80 transition-transform duration-150 ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 rounded-xl bg-[#0c1220] border border-cyan-500/30 shadow-2xl shadow-black/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-800">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Export Review Findings
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Structured audit & documentation files
                  </div>
                </div>

                <div className="p-1 space-y-1">
                  <button
                    onClick={() => handleExport('markdown')}
                    className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="p-1.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 group-hover:text-cyan-300 mt-0.5">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-white flex items-center gap-1.5">
                        <span>Markdown Report</span>
                        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">.md</span>
                      </div>
                      <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                        Formatted for GitHub PR comments, docs, and wikis
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleExport('json')}
                    className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="p-1.5 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-400 group-hover:text-purple-300 mt-0.5">
                      <FileCode2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-white flex items-center gap-1.5">
                        <span>Structured JSON</span>
                        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-purple-950 text-purple-400 border border-purple-800">.json</span>
                      </div>
                      <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                        Complete machine-readable audit schema & AST vectors
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onOpenArchitecture}
            className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700/60 hover:text-white transition-all shadow-sm shrink-0"
            title="View GCP Serverless Architecture"
          >
            <Cloud className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden md:inline ml-1.5">GCP Architecture</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700/60 hover:text-white transition-all shadow-sm shrink-0"
            title="View Historical Learning & Anti-Patterns"
          >
            <History className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden md:inline ml-1.5">Historical Learning</span>
          </button>

          {/* Creator & Portfolio Button */}
          <button
            onClick={onOpenCreator}
            className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-950/90 via-slate-900 to-indigo-950/90 hover:from-cyan-900 hover:to-indigo-900 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 text-xs font-mono font-semibold transition-all shadow-sm shadow-cyan-950/30 shrink-0"
            title="Creator Profile & Portfolio (Karthikeyan G)"
          >
            <Globe className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">Portfolio</span>
            <span className="inline sm:hidden text-[11px]">Portfolio</span>
            <ExternalLink className="h-3 w-3 text-cyan-400/80 hidden lg:inline" />
          </button>

          {/* Dynamic Git Target Area */}
          <button
            onClick={onOpenGitModal}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 text-xs font-medium text-emerald-300 border border-emerald-500/30 transition-all shadow-sm"
            title="Configure Git Target Repository"
          >
            <GitBranch className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <div className="text-left font-mono">
              <span className="text-[10px] text-slate-400 block sm:hidden">Git</span>
              <span className="hidden sm:inline text-xs text-slate-200 truncate max-w-[120px] md:max-w-[180px] block">
                {gitOwner}/{gitRepo}
              </span>
            </div>
            <Settings className="h-3 w-3 text-slate-400 ml-0.5 hidden sm:inline" />
          </button>
        </div>
      </div>
    </header>
  );
};
