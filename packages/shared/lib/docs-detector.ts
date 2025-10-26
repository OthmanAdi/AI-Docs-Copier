/**
 * Documentation Site Detection
 * Implements 5 detection strategies to identify documentation websites
 */

export interface DocDetectionResult {
  isDocsSite: boolean;
  confidence: number;
  checks: {
    platform: boolean;
    url: boolean;
    structure: boolean;
    headings: boolean;
    llmsTxt: boolean;
  };
  platform?: string;
}

const DOC_URL_PATTERNS = [
  /\/docs\//i,
  /\/documentation\//i,
  /\/wiki\//i,
  /\/guide\//i,
  /\/api\//i,
  /\/reference\//i,
  /\/manual\//i,
  /readthedocs\.io/i,
  /\.github\.io/i,
  /gitbook\.io/i,
];

const DOC_STRUCTURE_SELECTORS = [
  '.sidebar',
  '.toc',
  '.table-of-contents',
  'nav.navigation',
  '.docs-sidebar',
  '.markdown-body',
  'article[role="article"]',
  '.documentation-content',
  '.rst-content',
  '.docusaurus',
  '.gitbook-root',
];

const DOC_KEYWORDS = [
  'documentation',
  'docs',
  'api reference',
  'guide',
  'manual',
  'tutorial',
];

/**
 * Strategy 1: Detect documentation platform via meta tags
 */
function detectDocsPlatform(): string | null {
  const generators: Record<string, Element | null> = {
    docusaurus: document.querySelector('meta[name="generator"][content*="Docusaurus"]'),
    sphinx: document.querySelector('meta[name="generator"][content*="Sphinx"]'),
    gitbook: document.querySelector('meta[name="generator"][content*="GitBook"]'),
    mkdocs: document.querySelector('meta[name="generator"][content*="MkDocs"]'),
    jekyll: document.querySelector('meta[name="generator"][content*="Jekyll"]'),
    hugo: document.querySelector('meta[name="generator"][content*="Hugo"]'),
  };

  for (const [platform, meta] of Object.entries(generators)) {
    if (meta) return platform;
  }

  return null;
}

/**
 * Strategy 2: Check URL patterns
 */
function isDocsURL(url: string): boolean {
  return DOC_URL_PATTERNS.some(pattern => pattern.test(url));
}

/**
 * Strategy 3: Analyze DOM structure
 */
function hasDocsStructure(): boolean {
  const foundIndicators = DOC_STRUCTURE_SELECTORS.filter(
    sel => document.querySelector(sel) !== null
  );

  // If 3+ indicators found, likely a docs site
  return foundIndicators.length >= 3;
}

/**
 * Strategy 4: Analyze headings and title
 */
function analyzeHeadings(): boolean {
  const h1 = document.querySelector('h1')?.textContent || '';
  const title = document.title;

  const text = (h1 + ' ' + title).toLowerCase();
  return DOC_KEYWORDS.some(keyword => text.includes(keyword));
}

/**
 * Strategy 5: Check for existing llms.txt
 */
async function checkForLlmsTxt(): Promise<boolean> {
  try {
    const response = await fetch('/llms.txt', { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Combined detection with scoring
 */
export async function isDocumentationSite(): Promise<DocDetectionResult> {
  const platform = detectDocsPlatform();

  const checks = {
    platform: platform !== null,
    url: isDocsURL(window.location.href),
    structure: hasDocsStructure(),
    headings: analyzeHeadings(),
    llmsTxt: await checkForLlmsTxt(),
  };

  // Score-based detection
  const score = Object.values(checks).filter(Boolean).length;
  const confidence = score / Object.keys(checks).length;

  return {
    isDocsSite: score >= 2,
    confidence,
    checks,
    platform: platform || undefined,
  };
}

/**
 * Synchronous version (without llms.txt check)
 */
export function isDocumentationSiteSync(): Omit<DocDetectionResult, 'checks'> & { checks: Omit<DocDetectionResult['checks'], 'llmsTxt'> } {
  const platform = detectDocsPlatform();

  const checks = {
    platform: platform !== null,
    url: isDocsURL(window.location.href),
    structure: hasDocsStructure(),
    headings: analyzeHeadings(),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const confidence = score / 4; // Without llms.txt check

  return {
    isDocsSite: score >= 1, // More permissive: show on any docs indicator
    confidence,
    checks,
    platform: platform || undefined,
  };
}
