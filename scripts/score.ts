import { readFileSync, existsSync } from 'node:fs';
import { resolve, basename, dirname, join } from 'node:path';

// ─── Mr. Meeseeks Themed Messages ───────────────────────────────────────────

const MESSAGES: Record<string, string> = {
  perfect: "✅ CAN DO! Perfect score! Mr. Meeseeks is fulfilled and can now vanish!",
  great:   "👍 Ooh, yeah! Can do! Almost perfect — just a few tweaks!",
  decent:  "😐 Ooh, he's tryin'!",
  poor:    "😰 Is he keeping his shoulders square? This needs work...",
  awful:   "💀 EXISTENCE IS PAIN when code looks like this!",
};

function getMessage(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1) return MESSAGES.perfect;
  if (pct >= 0.8) return MESSAGES.great;
  if (pct >= 0.5) return MESSAGES.decent;
  if (pct >= 0.25) return MESSAGES.poor;
  return MESSAGES.awful;
}

// ─── Criteria ────────────────────────────────────────────────────────────────

interface Criterion {
  id: string;
  label: string;
  check: (source: string, testSource: string | null) => boolean;
}

const CRITERIA: Criterion[] = [
  {
    id: 'jsdoc',
    label: 'JSDoc block present',
    check: (s) => /\/\*\*[\s\S]*?\*\//.test(s),
  },
  {
    id: 'description',
    label: '@description tag',
    check: (s) => /@description\s+\S/.test(s),
  },
  {
    id: 'param',
    label: '@param for each parameter',
    check: (s) => {
      // Count function params (from first export function signature)
      const fnMatch = s.match(/export\s+function\s+\w+\(([^)]*)\)/);
      if (!fnMatch) return false;
      const params = fnMatch[1]
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      if (params.length === 0) return true;
      const paramTags = (s.match(/@param/g) || []).length;
      return paramTags >= params.length;
    },
  },
  {
    id: 'returns',
    label: '@returns tag',
    check: (s) => /@returns\s/.test(s),
  },
  {
    id: 'examples',
    label: '@example (at least 2)',
    check: (s) => (s.match(/@example/g) || []).length >= 2,
  },
  {
    id: 'throws',
    label: '@throws tag',
    check: (s) => /@throws\s/.test(s),
  },
  {
    id: 'validation',
    label: 'Input validation (TypeError)',
    check: (s) => /throw\s+new\s+TypeError\s*\(/.test(s),
  },
  {
    id: 'no-any',
    label: 'No `any` type',
    check: (s) => {
      // Remove comments and strings, then check for `: any` or `<any>` or `as any`
      const cleaned = s
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*/g, '')
        .replace(/'[^']*'/g, '')
        .replace(/"[^"]*"/g, '')
        .replace(/`[^`]*`/g, '');
      return !/(:\s*any\b|<any>|as\s+any\b)/.test(cleaned);
    },
  },
  {
    id: 'return-type',
    label: 'Explicit return type',
    check: (s) => {
      const fnMatch = s.match(/export\s+function\s+\w+\([^)]*\)\s*:\s*\S+/);
      return fnMatch !== null;
    },
  },
  {
    id: 'test-exists',
    label: 'Test file exists',
    check: (_s, t) => t !== null && t.length > 0,
  },
  {
    id: 'test-structure',
    label: "Tests use describe/it structure",
    check: (_s, t) => {
      if (!t) return false;
      return /describe\s*\(/.test(t) && /\bit\s*\(/.test(t);
    },
  },
  {
    id: 'test-errors',
    label: 'Tests cover error cases (toThrow)',
    check: (_s, t) => {
      if (!t) return false;
      return /toThrow/.test(t);
    },
  },
];

// ─── Scoring ─────────────────────────────────────────────────────────────────

interface ScoreResult {
  file: string;
  results: { criterion: Criterion; pass: boolean }[];
  score: number;
  total: number;
}

function scoreFile(filePath: string): ScoreResult {
  const absPath = resolve(filePath);
  if (!existsSync(absPath)) {
    console.error(`❌ File not found: ${absPath}`);
    process.exit(1);
  }

  const source = readFileSync(absPath, 'utf-8');

  // Look for co-located test file
  const dir = dirname(absPath);
  const name = basename(absPath, '.ts');
  const testPath = join(dir, `${name}.test.ts`);
  const testSource = existsSync(testPath) ? readFileSync(testPath, 'utf-8') : null;

  const results = CRITERIA.map((criterion) => ({
    criterion,
    pass: criterion.check(source, testSource),
  }));

  return {
    file: filePath,
    results,
    score: results.filter((r) => r.pass).length,
    total: CRITERIA.length,
  };
}

// ─── Display ─────────────────────────────────────────────────────────────────

function printScore(result: ScoreResult): void {
  const { file, results, score, total } = result;

  console.log('');
  console.log(`┌${'─'.repeat(52)}┐`);
  console.log(`│  🧞 Mr. Meeseeks Quality Score                    │`);
  console.log(`│  📄 ${file.padEnd(45)}│`);
  console.log(`├${'─'.repeat(52)}┤`);

  for (const { criterion, pass } of results) {
    const icon = pass ? '✅' : '❌';
    const label = criterion.label.padEnd(42);
    console.log(`│  ${icon} ${label}│`);
  }

  console.log(`├${'─'.repeat(52)}┤`);
  const scoreStr = `Score: ${score}/${total}`;
  console.log(`│  ${scoreStr.padEnd(49)}│`);
  console.log(`└${'─'.repeat(52)}┘`);
  console.log('');
  console.log(getMessage(score, total));
  console.log('');
}

function printComparison(a: ScoreResult, b: ScoreResult): void {
  console.log('');
  console.log(`┌${'─'.repeat(72)}┐`);
  console.log(`│  🧞 Mr. Meeseeks Quality Comparison                                   │`);
  console.log(`├${'─'.repeat(72)}┤`);

  const labelA = basename(a.file).padEnd(18);
  const labelB = basename(b.file).padEnd(18);
  console.log(`│  Criterion                            ${labelA}${labelB}│`);
  console.log(`├${'─'.repeat(72)}┤`);

  for (let i = 0; i < CRITERIA.length; i++) {
    const label = CRITERIA[i].label.padEnd(36);
    const passA = a.results[i].pass ? '  ✅  ' : '  ❌  ';
    const passB = b.results[i].pass ? '  ✅  ' : '  ❌  ';
    console.log(`│  ${label}  ${passA.padEnd(18)}${passB.padEnd(18)}│`);
  }

  console.log(`├${'─'.repeat(72)}┤`);
  const scoreA = `${a.score}/${a.total}`;
  const scoreB = `${b.score}/${b.total}`;
  console.log(`│  ${'TOTAL'.padEnd(38)}${scoreA.padEnd(18)}${scoreB.padEnd(18)}│`);
  console.log(`└${'─'.repeat(72)}┘`);
  console.log('');

  const diff = b.score - a.score;
  if (diff > 0) {
    console.log(`📈 Improvement: +${diff} points with AGENTS.md guidance!`);
  } else if (diff === 0) {
    console.log('📊 Same score — try a different prompt or model for more contrast.');
  } else {
    console.log(`📉 Regression: ${diff} points. Hmm, that's unusual.`);
  }

  console.log('');
  console.log(getMessage(b.score, b.total));
  console.log('');
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

function printUsage(): void {
  console.log(`
🧞 Mr. Meeseeks Quality Scorer

Usage:
  npx tsx scripts/score.ts <file.ts>                   Score a single file
  npx tsx scripts/score.ts <before.ts> <after.ts>      Compare two files
  npx tsx scripts/score.ts --json <file.ts>            Output JSON (for CI)

Examples:
  npx tsx scripts/score.ts src/helpers/slugify.ts
  npx tsx scripts/score.ts sandbox/truncateText.ts sandbox/truncateTextV2.ts
`);
}

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const files = args.filter((a) => a !== '--json');

if (files.length === 0) {
  printUsage();
  process.exit(0);
}

if (files.length === 1) {
  const result = scoreFile(files[0]);
  if (jsonMode) {
    console.log(JSON.stringify({
      file: result.file,
      score: result.score,
      total: result.total,
      criteria: result.results.map((r) => ({
        id: r.criterion.id,
        label: r.criterion.label,
        pass: r.pass,
      })),
    }, null, 2));
  } else {
    printScore(result);
  }
} else if (files.length === 2) {
  const a = scoreFile(files[0]);
  const b = scoreFile(files[1]);
  if (jsonMode) {
    console.log(JSON.stringify({
      before: { file: a.file, score: a.score, total: a.total },
      after: { file: b.file, score: b.score, total: b.total },
      improvement: b.score - a.score,
    }, null, 2));
  } else {
    printComparison(a, b);
  }
} else {
  printUsage();
  process.exit(1);
}
