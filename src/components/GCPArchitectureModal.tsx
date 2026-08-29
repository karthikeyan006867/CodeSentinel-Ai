import React from 'react';
import { 
  X, 
  Cloud, 
  Server, 
  Database, 
  Cpu, 
  GitCommit, 
  Radio, 
  ShieldCheck, 
  LineChart, 
  Lock, 
  KeyRound, 
  Network,
  ExternalLink,
  Layers
} from 'lucide-react';

interface GCPArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GCPArchitectureModal: React.FC<GCPArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const gcpServices = [
    {
      name: 'Cloud Source Repositories / Git',
      category: 'Source Control & Triggers',
      icon: <GitCommit className="h-5 w-5 text-cyan-400" />,
      description: 'Receives developer commits, pull requests, and webhooks from configured GitHub / GitLab repositories via Cloud Build pub/sub triggers.'
    },
    {
      name: 'Cloud Build',
      category: 'CI/CD Pipeline Automation',
      icon: <Layers className="h-5 w-5 text-amber-400" />,
      description: 'Triggers automated review containers, AST token embeddings, and quality checks on every main commit or pull request event.'
    },
    {
      name: 'Cloud Pub/Sub',
      category: 'Asynchronous Decoupling',
      icon: <Radio className="h-5 w-5 text-indigo-400" />,
      description: 'Guarantees reliable, decoupled asynchronous task queues between high-velocity Git webhooks and the review inference engine.'
    },
    {
      name: 'Cloud Run',
      category: 'Scalable Containerized Service',
      icon: <Server className="h-5 w-5 text-emerald-400" />,
      description: 'Hosts the 24/7 reviewer backend service with automatic scale-to-zero when idle and burst scaling under massive commit spikes.'
    },
    {
      name: 'Vertex AI Gemini (Gemini Flash Lite)',
      category: 'ANN & Cognitive Controller',
      icon: <Cpu className="h-5 w-5 text-cyan-300" />,
      description: 'Gemini Flash Lite controller orchestrates neural token embeddings, vulnerability detection, Big-O analysis, and automated surgical code refactoring.'
    },
    {
      name: 'Cloud Firestore',
      category: 'Durable NoSQL Persistence',
      icon: <Database className="h-5 w-5 text-yellow-400" />,
      description: 'Stores detailed code review results, team quality ratings, PR statuses, and developer preferences with sub-10ms query latency.'
    },
    {
      name: 'Cloud Storage',
      category: 'Object Storage & Artifacts',
      icon: <Cloud className="h-5 w-5 text-sky-400" />,
      description: 'Retains larger artifacts, build logs, code snapshots, and comprehensive vulnerability audit reports.'
    },
    {
      name: 'Cloud Logging & Cloud Monitoring',
      category: 'Observability & Telemetry',
      icon: <LineChart className="h-5 w-5 text-purple-400" />,
      description: 'Provides 24/7 uptime monitoring, SLO tracking, latency percentiles, and instant alerts when review SLAs are breached.'
    },
    {
      name: 'Secret Manager, IAM & VPC Controls',
      category: 'Zero-Trust Cloud Security',
      icon: <Lock className="h-5 w-5 text-rose-400" />,
      description: 'Protects Gemini API credentials, tokens, and internal microservice RPCs within isolated VPC Service Controls and fine-grained IAM roles.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0d1322] border border-slate-700/80 shadow-2xl p-6 space-y-6 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cloud className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Managed Google Cloud Platform (GCP) Architecture
              </h2>
              <p className="text-xs text-slate-400">
                24/7 automated serverless reviewer infrastructure blueprint
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

        {/* Interactive Architecture Map */}
        <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
              Dataflow & Event Pipeline Topology
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Region: asia-southeast1 / us-central1
            </span>
          </div>

          {/* Flow Diagram */}
          <div className="p-4 rounded-xl bg-[#060810] border border-slate-800 flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-center">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 min-w-[120px]">
              <GitCommit className="h-4 w-4 mx-auto mb-1 text-cyan-400" />
              <div className="font-bold text-[11px]">Git Commit / PR</div>
              <div className="text-[9px] text-slate-400">Cloud Source Repo</div>
            </div>
            <span className="text-slate-500">➔</span>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 min-w-[120px]">
              <Layers className="h-4 w-4 mx-auto mb-1 text-amber-400" />
              <div className="font-bold text-[11px]">Cloud Build</div>
              <div className="text-[9px] text-slate-400">CI Trigger / Webhook</div>
            </div>
            <span className="text-slate-500">➔</span>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-indigo-300 min-w-[120px]">
              <Radio className="h-4 w-4 mx-auto mb-1 text-indigo-400" />
              <div className="font-bold text-[11px]">Cloud Pub/Sub</div>
              <div className="text-[9px] text-slate-400">Async Queue (Zero Drop)</div>
            </div>
            <span className="text-slate-500">➔</span>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 min-w-[120px]">
              <Server className="h-4 w-4 mx-auto mb-1 text-emerald-400" />
              <div className="font-bold text-[11px]">Cloud Run</div>
              <div className="text-[9px] text-slate-400">Reviewer Worker</div>
            </div>
            <span className="text-slate-500">➔</span>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 min-w-[120px] shadow-lg shadow-cyan-500/10">
              <Cpu className="h-4 w-4 mx-auto mb-1 text-cyan-400" />
              <div className="font-bold text-[11px]">ANN + Gemini Lite</div>
              <div className="text-[9px] text-slate-400">Gemini Flash Lite</div>
            </div>
            <span className="text-slate-500">➔</span>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-yellow-300 min-w-[120px]">
              <Database className="h-4 w-4 mx-auto mb-1 text-yellow-400" />
              <div className="font-bold text-[11px]">Cloud Firestore</div>
              <div className="text-[9px] text-slate-400">Persistent Records</div>
            </div>
          </div>
        </div>

        {/* GCP Services Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
          {gcpServices.map((svc, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  {svc.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{svc.name}</h4>
                  <span className="text-[10px] font-mono text-cyan-400/90 block">
                    {svc.category}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {svc.description}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Fully aligned with Google Cloud Architecture Framework</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
