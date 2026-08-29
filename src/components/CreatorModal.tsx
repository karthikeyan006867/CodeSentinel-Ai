import React from 'react';
import { 
  X, 
  User, 
  ExternalLink, 
  Globe, 
  Cloud, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Terminal,
  Database,
  Radio,
  FileCode,
  CheckCircle2
} from 'lucide-react';

interface CreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorModal: React.FC<CreatorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const projectDescription = [
    "I will build the 24/7 Intelligent Code Reviewer entirely on Google Cloud Platform using managed GCP services. Source code and pull requests will be received through Cloud Source Repositories or connected Git repositories, with Cloud Build triggering automated review pipelines on every commit or pull request.",
    "Cloud Run will host the reviewer backend as a scalable, containerized service. The review engine will use Vertex AI Gemini models to analyze code, detect bugs, security issues, performance problems, style violations, and logical errors, while generating concise explanations and suggested fixes.",
    "Cloud Functions can handle lightweight event-driven tasks, while Pub/Sub will decouple review jobs for reliable asynchronous processing. Firestore will store review results, project metadata, and user preferences. Cloud Storage will retain larger artifacts when required.",
    "Cloud Logging and Cloud Monitoring will provide observability, alerts, and uptime tracking. IAM, Secret Manager, and VPC controls will secure services and credentials. The architecture will use autoscaling and managed GCP infrastructure to provide continuous, reliable code-review availability."
  ];

  const gcpPillars = [
    { label: 'Cloud Source Repositories', desc: 'Code ingestion & PR triggers', icon: <FileCode className="h-3.5 w-3.5 text-cyan-400" /> },
    { label: 'Cloud Build', desc: 'Continuous CI/CD pipeline triggers', icon: <Layers className="h-3.5 w-3.5 text-amber-400" /> },
    { label: 'Cloud Run', desc: 'Scalable containerized backend', icon: <Terminal className="h-3.5 w-3.5 text-emerald-400" /> },
    { label: 'Vertex AI Gemini', desc: 'Cognitive code analysis engine', icon: <Cpu className="h-3.5 w-3.5 text-purple-400" /> },
    { label: 'Cloud Functions & Pub/Sub', desc: 'Event-driven asynchronous queues', icon: <Radio className="h-3.5 w-3.5 text-indigo-400" /> },
    { label: 'Firestore & Cloud Storage', desc: 'Durable telemetry & artifact storage', icon: <Database className="h-3.5 w-3.5 text-yellow-400" /> },
    { label: 'Logging, IAM & Monitoring', desc: 'Enterprise security & SLO tracking', icon: <ShieldCheck className="h-3.5 w-3.5 text-rose-400" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex justify-center items-start animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0d1322] border border-slate-700/80 shadow-2xl my-2 sm:my-6 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Sticky Top Header: Always visible at the very top */}
        <div className="sticky top-0 z-30 bg-[#0d1322]/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400 shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                  Karthikeyan G
                </h2>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 shrink-0">
                  Creator & Architect
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                Architectural vision & credentials for the 24/7 Intelligent Code Reviewer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://karthikeyang.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-md shadow-cyan-500/20 transition-all group"
            >
              <Globe className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Visit Portfolio</span>
              <span className="inline sm:hidden">Portfolio</span>
              <ExternalLink className="h-3 w-3 opacity-80" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Creator Spotlight Card with Direct Portfolio Link */}
          <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#090d16] via-[#0b101c] to-[#0e1628] border border-cyan-500/40 space-y-4 shadow-lg shadow-cyan-950/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    Lead Creator & Cloud Architect
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
                  Karthikeyan G
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Google Cloud Platform • Intelligent Code Analysis • Serverless Architectures
                </p>
              </div>

              {/* Direct Portfolio Link Button */}
              <a
                href="https://karthikeyang.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all shrink-0 group"
              >
                <Globe className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                <span>Visit Portfolio</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-slate-500">Portfolio Website:</span>
                <a 
                  href="https://karthikeyang.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:underline hover:text-white transition-colors flex items-center gap-1 font-semibold"
                >
                  https://karthikeyang.vercel.app
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <span className="text-[11px] text-slate-400">Continuous AI & Cloud Engineering</span>
            </div>
          </div>

        {/* Project Description (Exact User Specification) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Project Architecture & Vision
            </h4>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#060810] border border-slate-800 text-slate-300 text-xs sm:text-[13px] leading-relaxed font-sans space-y-3 shadow-inner">
            {projectDescription.map((paragraph, index) => (
              <p key={index} className="text-slate-300">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* GCP Managed Services Grid */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
            GCP Managed Services Core Components
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {gcpPillars.map((pillar, i) => (
              <div 
                key={i} 
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5 text-xs font-mono"
              >
                <div className="p-1 rounded bg-slate-800/80 shrink-0 mt-0.5">
                  {pillar.icon}
                </div>
                <div>
                  <div className="text-slate-200 font-semibold">{pillar.label}</div>
                  <div className="text-[11px] text-slate-400">{pillar.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Creator: <strong className="text-slate-200">Karthikeyan G</strong></span>
            <span>•</span>
            <a
              href="https://karthikeyang.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline hover:text-white flex items-center gap-1"
            >
              karthikeyang.vercel.app
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href="https://karthikeyang.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Portfolio</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
