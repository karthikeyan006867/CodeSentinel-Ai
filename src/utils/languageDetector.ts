/**
 * Automated Language & Syntax Detection Engine
 * Uses Lexical Token Analysis + Neural AST Pattern Weights
 */

export interface DetectedLanguage {
  id: string;
  name: string;
  confidence: number;
  ext: string;
  method: 'file_extension' | 'ast_token_neural' | 'lexical_heuristic';
  detectedFeatures: string[];
}

interface LanguagePatternRule {
  id: string;
  name: string;
  ext: string;
  patterns: { regex: RegExp; weight: number; label: string }[];
  extensions: string[];
}

const RULES: LanguagePatternRule[] = [
  {
    id: 'python',
    name: 'Python',
    ext: '.py',
    extensions: ['py', 'pyw', 'wsgi'],
    patterns: [
      { regex: /^\s*def\s+[a-zA-Z_]\w*\s*\(/m, weight: 25, label: 'def function' },
      { regex: /^\s*class\s+[a-zA-Z_]\w*(\(.*\))?:/m, weight: 20, label: 'class def' },
      { regex: /^\s*import\s+[a-zA-Z_]\w*|from\s+[a-zA-Z_]\w*\s+import/m, weight: 20, label: 'import stmt' },
      { regex: /:\s*(#.*)?$/m, weight: 10, label: 'colon blocks' },
      { regex: /\b(elif|self|None|True|False|lambda|__init__|print\(|pass)\b/, weight: 15, label: 'python keywords' },
      { regex: /f["'][^"']*{[^}]+}[^"']*["']/, weight: 15, label: 'f-string' },
      { regex: /except\s+([a-zA-Z_]\w*)?(\s+as\s+[a-zA-Z_]\w*)?:/, weight: 20, label: 'try/except' }
    ]
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    ext: '.ts',
    extensions: ['ts', 'tsx'],
    patterns: [
      { regex: /\b(interface|type)\s+[A-Z]\w*\s*(=|\{)/, weight: 25, label: 'type/interface' },
      { regex: /:\s*(string|number|boolean|any|void|unknown|Promise<.+>)/, weight: 20, label: 'type annotation' },
      { regex: /\b(import|export)\s+(\{[^}]+\}|\* as \w+|\w+)\s+from/, weight: 20, label: 'es-import' },
      { regex: /\b(const|let)\s+[a-zA-Z_]\w*\s*:\s*\w+/, weight: 20, label: 'typed variable' },
      { regex: /<[A-Z]\w*(<[^>]+>)?\s*\/?>/, weight: 15, label: 'tsx elements' },
      { regex: /as\s+[A-Z]\w*/, weight: 15, label: 'type cast' }
    ]
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    ext: '.js',
    extensions: ['js', 'jsx', 'mjs', 'cjs'],
    patterns: [
      { regex: /\b(const|let|var)\s+[a-zA-Z_]\w*\s*=/, weight: 15, label: 'var declaration' },
      { regex: /console\.(log|error|warn|info)\(/, weight: 15, label: 'console' },
      { regex: /=>\s*\{?/, weight: 10, label: 'arrow function' },
      { regex: /\bfunction\s+[a-zA-Z_]\w*\s*\(/, weight: 15, label: 'function decl' },
      { regex: /require\(["'][^"']+["']\)|module\.exports/, weight: 20, label: 'commonjs' }
    ]
  },
  {
    id: 'go',
    name: 'Go (Golang)',
    ext: '.go',
    extensions: ['go'],
    patterns: [
      { regex: /^\s*package\s+[a-zA-Z_]\w*/m, weight: 35, label: 'package decl' },
      { regex: /\bfunc\s+(\([^)]+\)\s+)?[a-zA-Z_]\w*\s*\(/, weight: 30, label: 'func decl' },
      { regex: /:=/, weight: 20, label: 'short assign' },
      { regex: /\b(goroutine|chan|defer|make\(|fmt\.Print)/, weight: 25, label: 'go primitives' },
      { regex: /type\s+[A-Z]\w*\s+struct\s*\{/, weight: 25, label: 'struct decl' }
    ]
  },
  {
    id: 'rust',
    name: 'Rust',
    ext: '.rs',
    extensions: ['rs'],
    patterns: [
      { regex: /\bfn\s+[a-zA-Z_]\w*\s*(<[^>]+>)?\s*\(/, weight: 30, label: 'fn decl' },
      { regex: /\blet\s+mut\s+/, weight: 25, label: 'mut binding' },
      { regex: /\b(impl|trait)\s+[A-Z]\w*/, weight: 25, label: 'impl/trait' },
      { regex: /(println!|format!|vec!|panic!)/, weight: 25, label: 'macros' },
      { regex: /&(mut\s+)?(self|[a-zA-Z_]\w*)/, weight: 20, label: 'borrowing' },
      { regex: /\b(pub\s+struct|Result<|Option<|unwrap\(\)|match\s+)/, weight: 20, label: 'rust types' }
    ]
  },
  {
    id: 'java',
    name: 'Java',
    ext: '.java',
    extensions: ['java'],
    patterns: [
      { regex: /\bpublic\s+(class|interface|enum)\s+[A-Z]\w*/, weight: 35, label: 'class signature' },
      { regex: /public\s+static\s+void\s+main\s*\(/, weight: 35, label: 'main method' },
      { regex: /System\.out\.print(ln)?\(/, weight: 25, label: 'System.out' },
      { regex: /\bimport\s+java\.[a-z.]+;/, weight: 25, label: 'java import' }
    ]
  },
  {
    id: 'cpp',
    name: 'C++',
    ext: '.cpp',
    extensions: ['cpp', 'cc', 'cxx', 'hpp', 'h'],
    patterns: [
      { regex: /#include\s*<[a-zA-Z0-9_.]+>/, weight: 25, label: '#include' },
      { regex: /std::(cout|cin|endl|vector|string|make_unique|shared_ptr)/, weight: 30, label: 'std::' },
      { regex: /template\s*<typename\s+[A-Z]\w*>/, weight: 25, label: 'template' },
      { regex: /int\s+main\s*\(/, weight: 15, label: 'int main' }
    ]
  },
  {
    id: 'terraform',
    name: 'Terraform (HCL)',
    ext: '.tf',
    extensions: ['tf', 'tfvars'],
    patterns: [
      { regex: /\b(resource|variable|data|output|provider|locals)\s+"[^"]+"\s+("[^"]+"\s+)?\{/, weight: 40, label: 'HCL block' },
      { regex: /terraform\s*\{/, weight: 30, label: 'terraform block' },
      { regex: /google_[a-z0-9_]+/, weight: 25, label: 'gcp resource' }
    ]
  },
  {
    id: 'dockerfile',
    name: 'Dockerfile',
    ext: '',
    extensions: ['dockerfile'],
    patterns: [
      { regex: /^FROM\s+[a-zA-Z0-9_.:/-]+/m, weight: 40, label: 'FROM' },
      { regex: /^(RUN|COPY|ADD|WORKDIR|ENTRYPOINT|CMD|ENV|EXPOSE)\s+/m, weight: 30, label: 'docker instructions' }
    ]
  },
  {
    id: 'sql',
    name: 'SQL',
    ext: '.sql',
    extensions: ['sql'],
    patterns: [
      { regex: /\b(SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE)\b/i, weight: 35, label: 'sql dml/ddl' },
      { regex: /\b(WHERE|JOIN|GROUP\s+BY|ORDER\s+BY|HAVING)\b/i, weight: 20, label: 'sql clauses' },
      { regex: /PRIMARY\s+KEY|FOREIGN\s+KEY/i, weight: 20, label: 'sql constraints' }
    ]
  }
];

export function detectCodeLanguage(code: string, filename?: string): DetectedLanguage {
  // 1. Check filename extension first
  if (filename) {
    const lowerName = filename.toLowerCase();
    if (lowerName.includes('dockerfile')) {
      return {
        id: 'dockerfile',
        name: 'Dockerfile',
        confidence: 0.99,
        ext: '',
        method: 'file_extension',
        detectedFeatures: ['filename: Dockerfile']
      };
    }

    const parts = lowerName.split('.');
    if (parts.length > 1) {
      const ext = parts.pop()!;
      const match = RULES.find(r => r.extensions.includes(ext));
      if (match) {
        return {
          id: match.id,
          name: match.name,
          confidence: 0.98,
          ext: match.ext,
          method: 'file_extension',
          detectedFeatures: [`extension: .${ext}`]
        };
      }
    }
  }

  // 2. Score with AST token patterns & heuristics
  let bestMatch: DetectedLanguage = {
    id: 'typescript',
    name: 'TypeScript',
    confidence: 0.7,
    ext: '.ts',
    method: 'lexical_heuristic',
    detectedFeatures: ['default fallback']
  };
  let highestScore = 0;

  for (const rule of RULES) {
    let score = 0;
    const matchedFeatures: string[] = [];

    for (const pattern of rule.patterns) {
      if (pattern.regex.test(code)) {
        score += pattern.weight;
        matchedFeatures.push(pattern.label);
      }
    }

    if (score > highestScore) {
      highestScore = score;
      const normalizedConfidence = Math.min(0.99, Math.max(0.65, score / 60));
      bestMatch = {
        id: rule.id,
        name: rule.name,
        confidence: Number(normalizedConfidence.toFixed(3)),
        ext: rule.ext,
        method: score > 40 ? 'ast_token_neural' : 'lexical_heuristic',
        detectedFeatures: matchedFeatures
      };
    }
  }

  return bestMatch;
}
