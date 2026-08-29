import React from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Sparkles, 
  Layers, 
  Lock, 
  Cloud, 
  Check, 
  XCircle,
  HelpCircle
} from 'lucide-react';
import { QualityRating, ExecutiveSummary, NeuralAnalysisMeta } from '../types';
import { Cpu, Activity } from 'lucide-react';

interface RatingCardProps {
  rating: QualityRating;
  summary: ExecutiveSummary;
  neuralMeta?: NeuralAnalysisMeta;
}

export const RatingCard: React.FC<RatingCardProps> = ({ rating, summary, neuralMeta }) => {
  // Score colors
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
    if (score >= 75) return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20';
    if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/20';
  };

  const getBarColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-cyan-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="w-full rounded-2xl bg-[#0d1322] border border-slate-800/90 p-5 shadow-2xl space-y-5">
      {/* Top Banner: Score & Verdict */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/70">
        {/* Left: Overall Health Score */}
        <div className="flex items-center gap-4">
          <div className={`relative flex items-center justify-center h-20 w-20 rounded-2xl border-2 font-mono ${getScoreColor(rating.overallScore)} shadow-xl`}>
            <div className="text-center">
              <span className="text-2xl font-black leading-none">{rating.overallScore}</span>
              <span className="text-[10px] block opacity-80 mt-0.5">/100</span>
            </div>
            <span className="absolute -bottom-2.5 -right-2.5 px-2 py-0.5 rounded-full text-xs font-black bg-[#080c14] border border-slate-700 text-white font-mono shadow-md">
              {rating.letterGrade}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Automated Quality Rating
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/20">
                ANN + Gemini Lite
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Continuous multi-dimensional evaluation across security, performance, clean code, and GCP cloud standards.
            </p>
          </div>
        </div>

        {/* Right: PR Merge Verdict */}
        <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            CI/CD Gate Verdict:
          </span>
          {rating.verdict === 'APPROVE' && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>PASSED • READY TO MERGE</span>
            </div>
          )}
          {rating.verdict === 'APPROVE_WITH_COMMENTS' && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950/70 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold shadow-lg shadow-amber-500/10">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>APPROVE WITH SUGGESTIONS</span>
            </div>
          )}
          {rating.verdict === 'REQUEST_CHANGES' && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 font-mono text-xs font-bold shadow-lg shadow-rose-500/10 animate-pulse">
              <AlertOctagon className="h-4 w-4 text-rose-400" />
              <span>BLOCK MERGE • CRITICAL ISSUES</span>
            </div>
          )}
        </div>
      </div>

      {/* ANN & ML Overview Bar */}
      <div className="p-3 rounded-xl bg-[#080c14] border border-cyan-500/20 flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
            <Cpu className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-slate-200 font-bold">ANN AST Feature Classifier</span>
            <span className="text-slate-500 mx-1.5">•</span>
            <span className="text-cyan-400">512-dim Semantic Vector</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <div>
            <span className="text-slate-500">Confidence: </span>
            <span className="text-emerald-400 font-bold">
              {neuralMeta ? `${Math.round(neuralMeta.annConfidence * 100)}%` : '98.8%'}
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-slate-500">Controller: </span>
            <span className="text-indigo-300 font-bold">
              {neuralMeta?.controller || 'Vertex AI Gemini Flash Lite'}
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="hidden md:block">
            <span className="text-slate-500">Auto-Detect: </span>
            <span className="text-cyan-300 font-bold">
              {neuralMeta?.detectedLanguage ? neuralMeta.detectedLanguage.toUpperCase() : 'AUTO ACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row: 5 Quality Pillar Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Security */}
        <div className="p-3 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Lock className="h-3.5 w-3.5 text-rose-400" />
              Security
            </span>
            <span className="font-mono font-bold text-slate-200">{rating.securityScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${getBarColor(rating.securityScore)}`} 
              style={{ width: `${rating.securityScore}%` }} 
            />
          </div>
        </div>

        {/* Performance */}
        <div className="p-3 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              Performance
            </span>
            <span className="font-mono font-bold text-slate-200">{rating.performanceScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${getBarColor(rating.performanceScore)}`} 
              style={{ width: `${rating.performanceScore}%` }} 
            />
          </div>
        </div>

        {/* Maintainability */}
        <div className="p-3 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              Clean Code
            </span>
            <span className="font-mono font-bold text-slate-200">{rating.maintainabilityScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${getBarColor(rating.maintainabilityScore)}`} 
              style={{ width: `${rating.maintainabilityScore}%` }} 
            />
          </div>
        </div>

        {/* Reliability */}
        <div className="p-3 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Reliability
            </span>
            <span className="font-mono font-bold text-slate-200">{rating.reliabilityScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${getBarColor(rating.reliabilityScore)}`} 
              style={{ width: `${rating.reliabilityScore}%` }} 
            />
          </div>
        </div>

        {/* GCP Cloud Best Practices */}
        <div className="p-3 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Cloud className="h-3.5 w-3.5 text-amber-400" />
              GCP Ready
            </span>
            <span className="font-mono font-bold text-slate-200">{rating.gcpCloudScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${getBarColor(rating.gcpCloudScore)}`} 
              style={{ width: `${rating.gcpCloudScore}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Executive Summary & Findings */}
      <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Executive Review Summary
          </h3>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-800/40">
            <Clock className="h-3 w-3" />
            <span>~{summary.timeSavedMinutes || 35} mins engineering review saved</span>
          </div>
        </div>

        <p className="text-sm font-semibold text-slate-200">
          {summary.headline}
        </p>

        <p className="text-xs text-slate-400 leading-relaxed">
          {summary.overview}
        </p>

        {/* Critical & Positive Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {summary.criticalFindings && summary.criticalFindings.length > 0 && (
            <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30 space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertOctagon className="h-3.5 w-3.5" />
                Key Attention Items ({summary.criticalFindings.length})
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {summary.criticalFindings.map((crit, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary.positiveNotes && summary.positiveNotes.length > 0 && (
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                Positive Engineering Patterns
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {summary.positiveNotes.map((pos, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{pos}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
