/**
 * Content Extraction using Readability.js and fallback selectors
 */

import { Readability } from '@mozilla/readability';
import DOMPurify from 'dompurify';

export interface ExtractedContent {
  title: string;
  content: string; // HTML
  textContent: string; // Plain text
  excerpt?: string;
  byline?: string;
  siteName?: string;
  method: 'readability' | 'selectors' | 'fallback';
}

const CONTENT_SELECTORS = [
  // Common article/docs containers
  'article',
  '[role="main"]',
  'main',
  '.article-content',
  '.post-content',
  '.entry-content',
  '.markdown-body',
  '.documentation',
  '.doc-content',
  '#content',
  '#main-content',

  // Documentation platform specific
  '.docusaurus',
  '.theme-doc-markdown',
  '.rst-content',
  '.gitbook-root',
  '.markdown-section',
  '.docs-content',
  '.api-content',
  '.md-content',
  '.wy-nav-content',
];

/**
 * Extract content using Mozilla Readability
 */
function extractWithReadability(doc: Document): ExtractedContent | null {
  try {
    // Clone document for Readability
    const documentClone = doc.cloneNode(true) as Document;
    const reader = new Readability(documentClone);
    const article = reader.parse();

    if (!article) return null;

    // Sanitize HTML content
    const sanitizedContent = DOMPurify.sanitize(article.content || '', {
      ALLOWED_TAGS: [
        'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'strong', 'em', 'u', 'code', 'pre', 'blockquote',
        'ul', 'ol', 'li', 'a', 'img', 'table', 'thead',
        'tbody', 'tr', 'th', 'td', 'div', 'span'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
    });

    return {
      title: article.title || doc.title,
      content: sanitizedContent,
      textContent: article.textContent || '',
      excerpt: article.excerpt || undefined,
      byline: article.byline || undefined,
      siteName: article.siteName || undefined,
      method: 'readability',
    };
  } catch (error) {
    console.error('Readability extraction failed:', error);
    return null;
  }
}

/**
 * Fallback: Extract using CSS selectors
 */
function extractBySelectors(doc: Document): ExtractedContent | null {
  for (const selector of CONTENT_SELECTORS) {
    const element = doc.querySelector(selector);
    if (element && element.textContent && element.textContent.trim().length > 100) {
      const sanitizedHtml = DOMPurify.sanitize(element.innerHTML, {
        ALLOWED_TAGS: [
          'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'strong', 'em', 'u', 'code', 'pre', 'blockquote',
          'ul', 'ol', 'li', 'a', 'img', 'table', 'thead',
          'tbody', 'tr', 'th', 'td', 'div', 'span'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
      });

      return {
        title: doc.title,
        content: sanitizedHtml,
        textContent: element.textContent.trim(),
        method: 'selectors',
      };
    }
  }

  return null;
}

/**
 * Ultimate fallback: Use body content
 */
function extractFromBody(doc: Document): ExtractedContent {
  const sanitizedHtml = DOMPurify.sanitize(doc.body.innerHTML, {
    ALLOWED_TAGS: [
      'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'em', 'u', 'code', 'pre', 'blockquote',
      'ul', 'ol', 'li', 'a', 'img', 'table', 'thead',
      'tbody', 'tr', 'th', 'td', 'div', 'span'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
  });

  return {
    title: doc.title,
    content: sanitizedHtml,
    textContent: doc.body.innerText || doc.body.textContent || '',
    method: 'fallback',
  };
}

/**
 * Main extraction function with fallback chain
 */
export function extractContent(doc: Document = document): ExtractedContent {
  // Try Readability first
  const readabilityResult = extractWithReadability(doc);
  if (readabilityResult) {
    return readabilityResult;
  }

  // Try CSS selectors
  const selectorResult = extractBySelectors(doc);
  if (selectorResult) {
    return selectorResult;
  }

  // Ultimate fallback
  return extractFromBody(doc);
}

/**
 * Extract plain text only (no HTML)
 */
export function extractPlainText(doc: Document = document): string {
  const content = extractContent(doc);
  return content.textContent;
}
