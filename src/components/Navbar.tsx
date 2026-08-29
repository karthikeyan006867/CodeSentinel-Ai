import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Cloud, 
  GitBranch, 
  History, 
  Terminal, 
  ExternalLink,
  Activity,
  Github
} from 'lucide-react';

interface NavbarProps {
  onOpenArchitecture: () => void;
  onOpenHistory: () => void;
  onOpenGitModal: () => void;
  pipelineRunning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenArchitecture,
  onOpenHistory,
  onOpenGitModal,
  pipelineRunning
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-indigo-500/20 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10">
            <ShieldCheck className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 font-mono">
                24/7 REVIEWER
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  GCP • Vertex AI
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              Always-on autonomous code reviewer & quality gatekeeper
            </p>
          </div>
        </div>

        {/* Center: System Status Indicator */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-900/70 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${pipelineRunning ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
            <span className="font-mono font-medium">
              {pipelineRunning ? 'PIPELINE ACTIVE' : '24/7 LISTENER READY'}
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Cloud className="h-3.5 w-3.5 text-indigo-400" />
            <span>Cloud Run</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Gemini 3.7 Flash</span>
          </div>
        </div>

        {/* Right: Actions and User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700/60 hover:text-white transition-all shadow-sm"
            title="View GCP Serverless Architecture"
          >
            <Cloud className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">GCP Architecture</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700/60 hover:text-white transition-all shadow-sm"
            title="View Historical Learning & Anti-Patterns"
          >
            <History className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Historical Learning</span>
          </button>

          <button
            onClick={onOpenGitModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 text-xs font-medium text-emerald-300 border border-emerald-500/30 transition-all shadow-sm"
            title="CI/CD Pipeline & GitHub Setup"
          >
            <GitBranch className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-mono">CI/CD & Git</span>
          </button>

          {/* User Portfolio link */}
          <a
            href="https://karthikeyang.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800 group"
            title="Created for Karthikeyan G (karthikeyan006867)"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 p-[1px]">
              <div className="h-full w-full rounded-full bg-[#0b0f19] flex items-center justify-center text-xs font-bold text-cyan-300">
                KG
              </div>
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                karthikeyan006867
                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Portfolio Reference</div>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
};
