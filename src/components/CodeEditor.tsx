import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, AlertCircle, Sparkles } from 'lucide-react';
import { ReviewIssue } from '../types';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  filename: string;
  issues: ReviewIssue[];
  activeIssueId?: string | null;
  onSelectIssue?: (issue: ReviewIssue) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  language,
  filename,
  issues,
  activeIssueId,
  onSelectIssue
}) => {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Map issues to lines
  const issueLinesMap = new Map<number, ReviewIssue>();
  issues.forEach((iss) => {
    for (let l = iss.lineStart; l <= iss.lineEnd; l++) {
      issueLinesMap.set(l, iss);
    }
  });

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#090d16] border border-slate-800/90 shadow-2xl overflow-hidden">
      {/* Editor top header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1322] border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <FileCode className="h-4 w-4 text-cyan-400" />
          <span className="font-mono text-xs font-semibold text-slate-200">
            {filename}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            {language}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {lines.length} lines
          </span>
        </div>

        <div className="flex items-center gap-2">
          {issues.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
              <AlertCircle className="h-3 w-3" />
              <span>{issues.length} review annotations</span>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers and Annotations */}
      <div className="flex-1 flex overflow-auto relative font-mono text-xs max-h-[580px] bg-[#070a12]">
        {/* Line numbers gutter */}
        <div className="py-3 pl-3 pr-2 text-right text-slate-600 select-none bg-[#090d16] border-r border-slate-800/60 sticky left-0 z-10 min-w-[44px]">
          {lines.map((_, i) => {
            const lineNum = i + 1;
            const issueOnLine = issueLinesMap.get(lineNum);
            const isHighlight = activeIssueId && issueOnLine?.id === activeIssueId;

            return (
              <div 
                key={lineNum} 
                className={`leading-6 flex items-center justify-end gap-1 ${
                  isHighlight 
                    ? 'text-cyan-300 font-bold' 
                    : issueOnLine
                    ? issueOnLine.severity === 'critical'
                      ? 'text-rose-400 font-semibold'
                      : 'text-amber-400 font-semibold'
                    : 'text-slate-600'
                }`}
              >
                {issueOnLine && (
                  <span 
                    className={`h-1.5 w-1.5 rounded-full ${
                      issueOnLine.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-400'
                    }`} 
                  />
                )}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Code Content & Editable Textarea */}
        <div className="flex-1 relative py-3 px-4 font-mono leading-6 overflow-x-auto">
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const issue = issueLinesMap.get(lineNum);
            const isHighlight = activeIssueId && issue?.id === activeIssueId;

            return (
              <div
                key={i}
                onClick={() => issue && onSelectIssue && onSelectIssue(issue)}
                className={`group whitespace-pre transition-colors rounded px-1 -mx-1 ${
                  isHighlight
                    ? 'bg-cyan-950/50 text-cyan-200 border-l-2 border-cyan-400'
                    : issue
                    ? issue.severity === 'critical'
                      ? 'bg-rose-950/30 text-rose-200 border-l-2 border-rose-500 cursor-pointer hover:bg-rose-950/50'
                      : 'bg-amber-950/20 text-amber-200 border-l-2 border-amber-500 cursor-pointer hover:bg-amber-950/40'
                    : 'text-slate-300 hover:bg-slate-800/30'
                }`}
              >
                {/* Syntax color styling simulation */}
                <span className="inline-block">
                  {line || ' '}
                </span>

                {/* Inline indicator when clicking on an issue line */}
                {issue && (
                  <span className="opacity-0 group-hover:opacity-100 ml-3 text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 transition-opacity">
                    [{issue.ruleCode}] {issue.title}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor Bottom Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#090d16] border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Terminal className="h-3 w-3 text-emerald-400" />
            UTF-8
          </span>
          <span>Tab: 2 Spaces</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            {language.toUpperCase()} ENGINE
          </span>
        </div>
        <div className="text-slate-500">
          Tip: Click on annotated lines with markers to inspect issues
        </div>
      </div>
    </div>
  );
};
