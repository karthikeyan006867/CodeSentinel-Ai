import React, { useState, useEffect } from 'react';
import { 
  X, 
  GitBranch, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Server,
  Sparkles
} from 'lucide-react';

interface GitCIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerWebhookSim: () => void;
  isSimulatingWebhook: boolean;
  gitOwner?: string;
  setGitOwner?: (owner: string) => void;
  gitRepo?: string;
  setGitRepo?: (repo: string) => void;
}

export const GitCIModal: React.FC<GitCIModalProps> = ({
  isOpen,
  onClose,
  onTriggerWebhookSim,
  isSimulatingWebhook,
  gitOwner = 'cloud-enterprise',
  setGitOwner,
  gitRepo = 'intelligent-reviewer',
  setGitRepo
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [localOwner, setLocalOwner] = useState(gitOwner || 'cloud-enterprise');
  const [localRepo, setLocalRepo] = useState(gitRepo || 'intelligent-reviewer');

  useEffect(() => {
    if (gitOwner) setLocalOwner(gitOwner);
  }, [gitOwner]);

  useEffect(() => {
    if (gitRepo) setLocalRepo(gitRepo);
  }, [gitRepo]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleOwnerChange = (val: string) => {
    setLocalOwner(val);
    if (setGitOwner) setGitOwner(val);
  };

  const handleRepoChange = (val: string) => {
    setLocalRepo(val);
    if (setGitRepo) setGitRepo(val);
  };

  const targetRemote = `https://github.com/${localOwner || 'user'}/${localRepo || 'repo'}.git`;

  const gitPushScript = `# 1. Initialize git & add project files
git init
git add .
git commit -m "feat: automated 24/7 intelligent code reviewer pipeline"

# 2. Add remote target (${localOwner}/${localRepo})
git branch -M main
git remote add origin ${targetRemote}

# 3. Push to main branch (triggers ANN + Gemini Lite automated gate)
git push -u origin main`;

  const gcpDeployScript = `# Build & deploy directly to Cloud Run container service
gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/code-reviewer
gcloud run deploy code-reviewer \\
  --image gcr.io/$(gcloud config get-value project)/code-reviewer \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex justify-center items-start animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0d1322] border border-slate-700/80 shadow-2xl p-5 sm:p-6 space-y-5 my-2 sm:my-8 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <GitBranch className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Git CI/CD Pipeline & Webhook Gate
              </h2>
              <p className="text-xs text-slate-400">
                Automated continuous evaluation powered by ANN AST features & Gemini Flash Lite
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

        {/* User Git Target Configuration Area */}
        <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Configure Your Git Target
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Zero Hardcoding • Dynamic Remote
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                GitHub / GitLab Username or Org
              </label>
              <input
                type="text"
                value={localOwner}
                onChange={(e) => handleOwnerChange(e.target.value)}
                placeholder="e.g. your-username or team"
                className="w-full bg-[#060810] border border-slate-700 text-cyan-300 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-cyan-500/60"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Repository Name
              </label>
              <input
                type="text"
                value={localRepo}
                onChange={(e) => handleRepoChange(e.target.value)}
                placeholder="e.g. intelligent-code-reviewer"
                className="w-full bg-[#060810] border border-slate-700 text-cyan-300 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-cyan-500/60"
              />
            </div>
          </div>
        </div>

        {/* Live Webhook Trigger Test */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Live Git Webhook & Pub/Sub Test
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Simulate commit webhook payload for <span className="font-mono text-emerald-300">{localOwner}/{localRepo}</span>.
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
              1. Git Push Commands ({localOwner}/{localRepo})
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
                  <span>Copy Script</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3 rounded-xl bg-[#060810] border border-slate-800 font-mono text-xs text-cyan-200 overflow-x-auto">
            <code>{gitPushScript}</code>
          </pre>
        </div>

        {/* Cloud Run Deployment Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-indigo-400 flex items-center gap-2">
              <Server className="h-4 w-4" />
              2. Production Cloud Run Service Deployment
            </span>
            <button
              onClick={() => copyToClipboard(gcpDeployScript, 'cloudrun')}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-indigo-300 transition-colors"
            >
              {copiedSection === 'cloudrun' ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Commands</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3 rounded-xl bg-[#060810] border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto">
            <code>{gcpDeployScript}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <Cpu className="h-4 w-4 text-purple-400" />
            <span>ANN AST Tokenizer • Vertex AI Gemini Flash Lite</span>
          </div>

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
