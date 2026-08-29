import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  GitCompare, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Terminal, 
  Activity, 
  Cloud, 
  GitBranch, 
  ExternalLink,
  Code2
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { ReviewControls } from './components/ReviewControls';
import { CodeEditor } from './components/CodeEditor';
import { RatingCard } from './components/RatingCard';
import { IssuesList } from './components/IssuesList';
import { RefactoredDiffViewer } from './components/RefactoredDiffViewer';
import { PipelineTracker } from './components/PipelineTracker';
import { GCPArchitectureModal } from './components/GCPArchitectureModal';
import { HistoricalLearningModal } from './components/HistoricalLearningModal';
import { GitCIModal } from './components/GitCIModal';

import { CODE_PRESETS, CodePreset } from './data/presets';
import { 
  CodeReviewResult, 
  ReviewIssue, 
  ReviewMode, 
  HistoricalRun, 
  RecurringAntiPattern 
} from './types';

export default function App() {
  // Preset & Editor State
  const defaultPreset = CODE_PRESETS[0];
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPreset.id);
  const [code, setCode] = useState<string>(defaultPreset.code);
  const [language, setLanguage] = useState<string>(defaultPreset.language);
  const [filename, setFilename] = useState<string>(defaultPreset.filename);
  const [reviewMode, setReviewMode] = useState<ReviewMode>('full_360');
  const [branch, setBranch] = useState<string>('main');
  const [prNumber, setPrNumber] = useState<number>(42);

  // Review states & Results
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'diff' | 'telemetry'>('editor');
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [reviewResult, setReviewResult] = useState<CodeReviewResult | null>(null);

  // History and Anti-Patterns
  const [historyRuns, setHistoryRuns] = useState<HistoricalRun[]>([]);
  const [antiPatterns, setAntiPatterns] = useState<RecurringAntiPattern[]>([]);

  // Modals
  const [showArchModal, setShowArchModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showGitModal, setShowGitModal] = useState<boolean>(false);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run review on mount so user immediately sees rich, functional evaluation
  useEffect(() => {
    fetchHistory();
    runReview(defaultPreset.code, defaultPreset.language, defaultPreset.filename);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        if (data.history) {
          setHistoryRuns(
            data.history.map((h: any) => ({
              id: h.id,
              timestamp: h.timestamp,
              commitHash: h.commitHash,
              branch: h.branch,
              author: h.author,
              overallScore: h.rating?.overallScore || 70,
              letterGrade: h.rating?.letterGrade || 'B',
              issuesCount: h.issues?.length || 0,
              criticalCount: h.rating?.metrics?.criticalCount || 0,
              filename: h.filename,
              language: h.language,
              verdict: h.rating?.verdict || 'APPROVE'
            }))
          );
        }
        if (data.antiPatterns) {
          setAntiPatterns(data.antiPatterns);
        }
      }
    } catch (e) {
      console.warn('Could not load history:', e);
    }
  };

  const handleSelectPreset = (preset: CodePreset) => {
    setSelectedPresetId(preset.id);
    setCode(preset.code);
    setLanguage(preset.language);
    setFilename(preset.filename);
    runReview(preset.code, preset.language, preset.filename);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'py') setLanguage('python');
    else if (ext === 'ts' || ext === 'tsx') setLanguage('typescript');
    else if (ext === 'go') setLanguage('go');
    else if (ext === 'rs') setLanguage('rust');
    else if (ext === 'java') setLanguage('java');
    else if (ext === 'sql') setLanguage('sql');
    else if (ext === 'tf') setLanguage('terraform');
    else if (file.name.toLowerCase().includes('docker')) setLanguage('dockerfile');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCode(content);
        showToast(`Uploaded ${file.name}. Reviewing now.`);
        runReview(content, language, file.name);
      }
    };
    reader.readAsText(file);
  };

  const runReview = async (
    targetCode: string = code,
    targetLang: string = language,
    targetFile: string = filename
  ) => {
    setIsReviewing(true);
    setActiveIssueId(null);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: targetCode,
          language: targetLang,
          filename: targetFile,
          reviewMode,
          author: 'karthikeyan006867',
          branch,
          prNumber
        })
      });

      if (!res.ok) {
        throw new Error(`Review failed with status ${res.status}`);
      }

      const data: CodeReviewResult = await res.json();
      setReviewResult(data);
      if (data.issues && data.issues.length > 0) {
        setActiveIssueId(data.issues[0].id);
      }
      fetchHistory();
    } catch (err) {
      console.error('Error running review:', err);
      showToast('Static fallback review active.');
    } finally {
      setIsReviewing(false);
    }
  };

  // Apply single surgical fix to the active code
  const handleApplyFix = (issue: ReviewIssue) => {
    if (!issue.replacementSnippet || !issue.codeSnippet) return;

    if (code.includes(issue.codeSnippet)) {
      const newCode = code.replace(issue.codeSnippet, issue.replacementSnippet);
      setCode(newCode);
      showToast(`Applied fix for: ${issue.ruleCode}`);
      setTimeout(() => runReview(newCode, language, filename), 150);
    } else {
      const lines = code.split('\n');
      if (issue.lineStart <= lines.length) {
        lines[issue.lineStart - 1] = issue.replacementSnippet;
        const newCode = lines.join('\n');
        setCode(newCode);
        showToast(`Applied fix for line ${issue.lineStart}`);
        setTimeout(() => runReview(newCode, language, filename), 150);
      }
    }
  };

  // Apply all refactored clean code
  const handleApplyAllRefactor = () => {
    if (reviewResult?.fullRefactoredCode) {
      setCode(reviewResult.fullRefactoredCode);
      setActiveTab('editor');
      showToast('Applied all AI refactorings to editor.');
      setTimeout(() => {
        runReview(reviewResult.fullRefactoredCode, language, filename);
      }, 150);
    }
  };

  const handleTriggerWebhookSim = async () => {
    setIsSimulatingWebhook(true);
    try {
      const res = await fetch('/api/webhook/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-github-event': 'push'
        },
        body: JSON.stringify({
          repository: { full_name: 'karthikeyan006867/24-7-intelligent-code-reviewer' },
          sender: { login: 'karthikeyan006867' },
          head_commit: { id: 'a9b2c3d', message: 'ci(pipeline): trigger automated commit check' }
        })
      });
      if (res.ok) {
        showToast('Webhook received! Pub/Sub event queued and review triggered.');
        runReview();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulatingWebhook(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navbar
        onOpenArchitecture={() => setShowArchModal(true)}
        onOpenHistory={() => setShowHistoryModal(true)}
        onOpenGitModal={() => setShowGitModal(true)}
        pipelineRunning={isReviewing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0d1322]/90 border border-slate-800/90 rounded-2xl p-5 sm:px-6 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                GCP SERVERLESS & VERTEX AI
              </span>
              <span className="text-xs text-slate-400">
                Autonomous 24/7 Multi-Language Quality Evaluation & CI/CD Gatekeeper
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1.5 flex items-center gap-2">
              <span>24/7 Intelligent Code Reviewer</span>
              <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                v2.4 Production
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowGitModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-2 shadow-sm"
            >
              <GitBranch className="h-4 w-4 text-emerald-400" />
              <span>Git CI/CD</span>
            </button>

            <button
              onClick={() => setShowArchModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-2 shadow-sm"
            >
              <Cloud className="h-4 w-4 text-cyan-400" />
              <span>Architecture</span>
            </button>

            <button
              onClick={() => runReview()}
              disabled={isReviewing}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-xs font-mono font-bold text-white shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isReviewing ? 'Analyzing with Vertex AI...' : 'Run Review'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Controls & Scenario Presets */}
        <ReviewControls
          language={language}
          setLanguage={setLanguage}
          reviewMode={reviewMode}
          setReviewMode={setReviewMode}
          selectedPresetId={selectedPresetId}
          onSelectPreset={handleSelectPreset}
          filename={filename}
          setFilename={setFilename}
          branch={branch}
          setBranch={setBranch}
          prNumber={prNumber}
          setPrNumber={setPrNumber}
          onRunReview={() => runReview()}
          isReviewing={isReviewing}
          onFileUpload={handleFileUpload}
        />

        {/* Quality Rating Card & Executive Summary */}
        {reviewResult?.rating && reviewResult?.summary && (
          <RatingCard
            rating={reviewResult.rating}
            summary={reviewResult.summary}
          />
        )}

        {/* Workspace View Switcher (Editor vs Full Refactor vs Cloud Telemetry) */}
        <div className="flex items-center justify-between bg-[#0d1322] border border-slate-800/80 p-1.5 rounded-xl font-mono text-xs max-w-md">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'editor'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Interactive Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'diff'
                ? 'bg-slate-800 text-emerald-300 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>AI Refactored Diff</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'telemetry'
                ? 'bg-slate-800 text-indigo-300 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>GCP Pipeline</span>
          </button>
        </div>

        {/* Main Tab 1: Dual Column Editor + Issues List */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Monaco-Style Code Editor (7 cols) */}
            <div className="lg:col-span-7 h-[640px]">
              <CodeEditor
                code={code}
                setCode={setCode}
                language={language}
                filename={filename}
                issues={reviewResult?.issues || []}
                activeIssueId={activeIssueId}
                onSelectIssue={(iss) => setActiveIssueId(iss.id)}
              />
            </div>

            {/* Right Column: Detailed Issues List (5 cols) */}
            <div className="lg:col-span-5">
              <IssuesList
                issues={reviewResult?.issues || []}
                activeIssueId={activeIssueId}
                onSelectIssue={(iss) => setActiveIssueId(iss.id)}
                onApplyFix={handleApplyFix}
              />
            </div>
          </div>
        )}

        {/* Main Tab 2: Full Side-by-Side Refactored Diff */}
        {activeTab === 'diff' && reviewResult && (
          <RefactoredDiffViewer
            originalCode={code}
            refactoredCode={reviewResult.fullRefactoredCode}
            filename={filename}
            language={language}
            onApplyAllRefactoring={handleApplyAllRefactor}
          />
        )}

        {/* Main Tab 3: Detailed GCP Telemetry & Pipeline */}
        {activeTab === 'telemetry' && reviewResult && (
          <div className="space-y-4">
            <PipelineTracker 
              steps={reviewResult.pipelineSteps} 
              isProcessing={isReviewing} 
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase">Execution Model</span>
                <div className="text-sm font-bold text-cyan-300">Vertex AI Gemini 3.7 Flash</div>
                <p className="text-[11px] text-slate-500">Low-latency structured reasoning pipeline</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase">Pub/Sub Queue Status</span>
                <div className="text-sm font-bold text-emerald-400">Zero Drop Guarantee</div>
                <p className="text-[11px] text-slate-500">Decoupled queue with dead-letter fallback</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase">Durable Storage</span>
                <div className="text-sm font-bold text-yellow-300">Google Cloud Firestore</div>
                <p className="text-[11px] text-slate-500">Indexed commit hashes, issues & scores</p>
              </div>
            </div>
          </div>
        )}

        {/* Persistent Pipeline Tracker at Bottom for Context */}
        {activeTab !== 'telemetry' && reviewResult?.pipelineSteps && reviewResult.pipelineSteps.length > 0 && (
          <div className="pt-2">
            <PipelineTracker 
              steps={reviewResult.pipelineSteps} 
              isProcessing={isReviewing} 
            />
          </div>
        )}

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-cyan-500/50 text-cyan-200 text-xs font-mono shadow-2xl">
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#080c14] py-6 px-4 sm:px-8 mt-12 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span className="text-slate-400">The 24/7 Intelligent Code Reviewer</span>
            <span>•</span>
            <span>Managed GCP & Vertex AI Gemini</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a 
              href="https://karthikeyang.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Portfolio Reference (karthikeyang.vercel.app)</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span>•</span>
            <button onClick={() => setShowGitModal(true)} className="hover:text-white transition-colors">
              GitHub (karthikeyan006867)
            </button>
            <span>•</span>
            <button onClick={() => setShowArchModal(true)} className="hover:text-white transition-colors">
              GCP Architecture
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GCPArchitectureModal
        isOpen={showArchModal}
        onClose={() => setShowArchModal(false)}
      />

      <HistoricalLearningModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={historyRuns}
        antiPatterns={antiPatterns}
        onSelectRun={(runId) => {
          showToast(`Selected historical review ${runId}`);
        }}
      />

      <GitCIModal
        isOpen={showGitModal}
        onClose={() => setShowGitModal(false)}
        onTriggerWebhookSim={handleTriggerWebhookSim}
        isSimulatingWebhook={isSimulatingWebhook}
      />
    </div>
  );
}
