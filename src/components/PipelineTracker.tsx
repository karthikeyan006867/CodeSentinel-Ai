import React from 'react';
import { 
  GitCommit, 
  Layers, 
  Radio, 
  Server, 
  Cpu, 
  Database, 
  LineChart, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { GCPPipelineStep } from '../types';

interface PipelineTrackerProps {
  steps: GCPPipelineStep[];
  isProcessing: boolean;
}

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({ steps, isProcessing }) => {
  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case 'Cloud Source Repositories':
        return <GitCommit className="h-4 w-4 text-cyan-400" />;
      case 'Cloud Build':
        return <Layers className="h-4 w-4 text-amber-400" />;
      case 'Cloud Pub/Sub':
        return <Radio className="h-4 w-4 text-indigo-400" />;
      case 'Cloud Run':
        return <Server className="h-4 w-4 text-emerald-400" />;
      case 'Vertex AI Gemini':
        return <Cpu className="h-4 w-4 text-cyan-300" />;
      case 'Cloud Firestore':
        return <Database className="h-4 w-4 text-amber-300" />;
      case 'Cloud Monitoring':
        return <LineChart className="h-4 w-4 text-purple-400" />;
      default:
        return <Server className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#0d1322] border border-slate-800/90 p-4 sm:p-5 shadow-2xl space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isProcessing ? 'bg-cyan-400' : 'bg-emerald-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isProcessing ? 'bg-cyan-500' : 'bg-emerald-500'}`}></span>
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            GCP Autonomous 24/7 Pipeline Execution Trace
          </h3>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span>Decoupled Asynchronous Pub/Sub Pipeline</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400">Vertex AI Gemini 3.7</span>
        </div>
      </div>

      {/* Steps visualization grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((step, idx) => {
          return (
            <div
              key={step.id || idx}
              className="relative p-2.5 rounded-xl bg-[#090d16] border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  {getServiceIcon(step.service)}
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                  <Clock className="h-2.5 w-2.5 text-slate-500" />
                  <span>{step.latencyMs}ms</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-200 truncate" title={step.service}>
                  {step.service}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5" title={step.details}>
                  {step.details}
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between border-t border-slate-800/60">
                <span className="text-[9px] font-mono uppercase text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  SUCCESS
                </span>
                <span className="text-[9px] font-mono text-slate-600">
                  0{idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
