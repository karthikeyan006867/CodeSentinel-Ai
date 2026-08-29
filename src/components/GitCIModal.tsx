import React, { useState } from 'react';
import { 
  X, 
  GitBranch, 
  Github, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

interface GitCIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerWebhookSim: () => void;
  isSimulatingWebhook: boolean;
}

export const GitCIModal: React.FC<GitCIModalProps> = ({
  isOpen,
  onClose,
  onTriggerWebhookSim,
  isSimulatingWebhook
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const gitPushScript = `# 1. Initialize git and add all files
git init
git add .
git commit -m "feat: initial release of 24/7 Intelligent Code Reviewer on GCP"

# 2. Add remote to your GitHub account (karthikeyan006867)
git branch -M main
git remote add origin https://github.com/karthikeyan006867/24-7-intelligent-code-reviewer.git

# 3. Push to main branch (This will automatically trigger GitHub Actions CI/CD)
git push -u origin main`;

  const vercelDeployScript = `# Vercel CLI deployment (Production ready)
npm i -g vercel
vercel login
vercel --prod`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0d1322] border border-slate-700/80 shadow-2xl p-6 space-y-6 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <GitBranch className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Git Repository & CI/CD Pipeline Automation
              </h2>
              <p className="text-xs text-slate-400">
                Push to GitHub <span className="text-cyan-300 font-mono">karthikeyan006867</span> & trigger automated checks on every main branch commit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Webhook Trigger Test */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Live Git Webhook & Pub/Sub Test
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Simulate an incoming GitHub commit webhook payload to test the Cloud Run and Vertex AI Gemini pipeline.
              </p>
            </div>

            <button
              onClick={onTriggerWebhookSim}
              disabled={isSimulatingWebhook}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              {isSimulatingWebhook ? (
                <>
                  <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Triggering Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Simulate Git Push (main)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Git Push Commands */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              1. Push to GitHub (karthikeyan006867)
            </span>
            <button
              onClick={() => copyToClipboard(gitPushScript, 'git')}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors"
            >
              {copiedSection === 'git' ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Shell Script</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3.5 rounded-xl bg-[#060810] border border-slate-800 font-mono text-xs text-cyan-200 overflow-x-auto">
            <code>{gitPushScript}</code>
          </pre>
        </div>

        {/* CI/CD Configuration Details */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
            <Layers className="h-4 w-4 text-amber-400" />
            2. Configured CI/CD Automation (`.github/workflows/ci-cd.yml`)
          </span>
          <div className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Trigger: `on.push.branches: [ main ]` and `on.pull_request.branches: [ main ]`</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              The pre-configured workflow file runs linting, type-checking, production build bundling, automated Gemini code quality scoring, and signals deployment status back to GitHub checks.
            </p>
          </div>
        </div>

        {/* Vercel Deployment Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-indigo-400 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              3. Vercel Deployment (`vercel.json` included)
            </span>
            <button
              onClick={() => copyToClipboard(vercelDeployScript, 'vercel')}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-indigo-300 transition-colors"
            >
              {copiedSection === 'vercel' ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Vercel Commands</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3 rounded-xl bg-[#060810] border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto">
            <code>{vercelDeployScript}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
          <a 
            href="https://github.com/karthikeyan006867" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-cyan-400 hover:underline font-mono"
          >
            <Github className="h-4 w-4" />
            <span>github.com/karthikeyan006867</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
