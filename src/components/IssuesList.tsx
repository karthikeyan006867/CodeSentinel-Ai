import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ShieldAlert, 
  Zap, 
  Layers, 
  Cloud, 
  Wand2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { ReviewIssue, IssueSeverity, IssueCategory } from '../types';

interface IssuesListProps {
  issues: ReviewIssue[];
  activeIssueId?: string | null;
  onSelectIssue: (issue: ReviewIssue) => void;
  onApplyFix: (issue: ReviewIssue) => void;
}

export const IssuesList: React.FC<IssuesListProps> = ({
  issues,
  activeIssueId,
  onSelectIssue,
  onApplyFix
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIssues, setExpandedIssues] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIssues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredIssues = issues.filter(iss => {
    if (selectedSeverity !== 'all' && iss.severity !== selectedSeverity) return false;
    if (selectedCategory !== 'all' && iss.category !== selectedCategory) return false;
    return true;
  });

  const getSeverityBadge = (sev: IssueSeverity) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-rose-950 text-rose-300 border border-rose-600/50 flex items-center gap-1">
            <AlertOctagon className="h-3 w-3 text-rose-400" />
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-amber-950 text-amber-300 border border-amber-600/50 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-yellow-950 text-yellow-300 border border-yellow-600/50 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-yellow-400" />
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-blue-950 text-blue-300 border border-blue-600/50 flex items-center gap-1">
            <Info className="h-3 w-3 text-blue-400" />
            Low
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
            <Info className="h-3 w-3 text-slate-400" />
            Info
          </span>
        );
    }
  };

  const getCategoryIcon = (cat: IssueCategory) => {
    switch (cat) {
      case 'security': return <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />;
      case 'performance': return <Zap className="h-3.5 w-3.5 text-cyan-400" />;
      case 'maintainability': return <Layers className="h-3.5 w-3.5 text-indigo-400" />;
      case 'cloud_gcp': return <Cloud className="h-3.5 w-3.5 text-amber-400" />;
      default: return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#0d1322] border border-slate-800/90 p-5 shadow-2xl space-y-4">
      {/* Header with counts and filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Automated Review Annotations</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
              {issues.length} Issues Found
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Surgical line-by-line defects, security vulnerabilities, and one-click refactors.
          </p>
        </div>

        {/* Severity filter tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'critical', 'high', 'medium', 'low'].map(sev => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`text-xs px-2.5 py-1 rounded-lg font-mono uppercase transition-colors border ${
                selectedSeverity === sev
                  ? 'bg-slate-800 text-white border-slate-600 font-semibold'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Issues list */}
      {filteredIssues.length === 0 ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
          <p className="text-sm font-medium text-slate-200">No issues found in this category.</p>
          <p className="text-xs text-slate-500">Your code satisfies all configured quality and security checks.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue) => {
            const isActive = activeIssueId === issue.id;
            const isExpanded = expandedIssues[issue.id] ?? true;

            return (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className={`rounded-xl border transition-all p-4 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900/90 border-cyan-500/60 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-500/30'
                    : issue.severity === 'critical'
                    ? 'bg-[#090d16] border-rose-900/40 hover:border-rose-700/60'
                    : issue.severity === 'high'
                    ? 'bg-[#090d16] border-amber-900/40 hover:border-amber-700/60'
                    : 'bg-[#090d16] border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Top line of card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {getSeverityBadge(issue.severity)}
                    <span className="font-mono text-xs text-cyan-400 font-semibold">
                      {issue.ruleCode}
                    </span>
                    <span className="text-xs font-mono text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">
                      Lines {issue.lineStart}{issue.lineEnd !== issue.lineStart ? `-${issue.lineEnd}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(issue.id);
                      }}
                      className="text-slate-400 hover:text-slate-200 p-1"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Title and category */}
                <div className="mt-2.5 flex items-center gap-2">
                  {getCategoryIcon(issue.category)}
                  <h4 className="text-sm font-semibold text-white tracking-tight">
                    {issue.title}
                  </h4>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3 space-y-3 pt-3 border-t border-slate-800/70 text-xs">
                    {/* Description */}
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] font-mono tracking-wider block mb-1">
                        Defect Analysis:
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>

                    {/* Threat Impact */}
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-rose-400/90 font-mono text-[10px] uppercase font-bold tracking-wider block mb-0.5">
                        Production Impact & Risk:
                      </span>
                      <p className="text-slate-300">
                        {issue.impact}
                      </p>
                    </div>

                    {/* Fix Suggestion & Snippet */}
                    <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-900/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                          <Wand2 className="h-3 w-3" />
                          Recommended Solution:
                        </span>

                        {issue.replacementSnippet && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onApplyFix(issue);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-mono border border-cyan-500/40 transition-colors"
                          >
                            <Wand2 className="h-3 w-3" />
                            <span>Apply Fix</span>
                          </button>
                        )}
                      </div>

                      <p className="text-slate-300">
                        {issue.fixSuggestion}
                      </p>

                      {issue.replacementSnippet && (
                        <pre className="mt-2 p-2 rounded bg-[#060810] border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                          <code>{issue.replacementSnippet}</code>
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
