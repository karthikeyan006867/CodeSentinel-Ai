export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type IssueCategory = 
  | 'security' 
  | 'performance' 
  | 'maintainability' 
  | 'reliability' 
  | 'cloud_gcp';

export interface ReviewIssue {
  id: string;
  lineStart: number;
  lineEnd: number;
  severity: IssueSeverity;
  category: IssueCategory;
  title: string;
  description: string;
  ruleCode: string;
  impact: string;
  fixSuggestion: string;
  codeSnippet?: string;
  replacementSnippet?: string;
}

export interface QualityRating {
  overallScore: number; // 0 - 100
  letterGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  verdict: 'APPROVE' | 'APPROVE_WITH_COMMENTS' | 'REQUEST_CHANGES';
  securityScore: number;
  performanceScore: number;
  maintainabilityScore: number;
  reliabilityScore: number;
  gcpCloudScore: number;
  metrics: {
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    linesAnalyzed: number;
    complexityEstimate: 'Low' | 'Moderate' | 'High' | 'Severe';
  };
}

export interface ExecutiveSummary {
  headline: string;
  overview: string;
  positiveNotes: string[];
  criticalFindings: string[];
  suggestedAction: string;
  timeSavedMinutes: number;
}

export interface GCPPipelineStep {
  id: string;
  service: 'Cloud Source Repositories' | 'Cloud Build' | 'Cloud Pub/Sub' | 'Cloud Run' | 'Vertex AI Gemini' | 'Cloud Firestore' | 'Cloud Monitoring';
  status: 'pending' | 'active' | 'completed' | 'failed';
  latencyMs: number;
  details: string;
  traceId?: string;
}

export interface CodeReviewResult {
  id: string;
  timestamp: string;
  filename: string;
  language: string;
  author: string;
  branch: string;
  prNumber?: number;
  commitHash: string;
  rawCode: string;
  rating: QualityRating;
  issues: ReviewIssue[];
  summary: ExecutiveSummary;
  fullRefactoredCode: string;
  pipelineSteps: GCPPipelineStep[];
}

export interface HistoricalRun {
  id: string;
  timestamp: string;
  commitHash: string;
  branch: string;
  author: string;
  overallScore: number;
  letterGrade: string;
  issuesCount: number;
  criticalCount: number;
  filename: string;
  language: string;
  verdict: string;
}

export interface RecurringAntiPattern {
  id: string;
  name: string;
  occurrences: number;
  category: IssueCategory;
  severity: IssueSeverity;
  description: string;
  recommendation: string;
}

export type ReviewMode = 
  | 'full_360' 
  | 'security_hardening' 
  | 'performance_scalability' 
  | 'clean_architecture';
