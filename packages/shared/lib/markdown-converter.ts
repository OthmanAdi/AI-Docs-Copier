/**
 * HTML to Markdown conversion using Turndown.js
 */

import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

/**
 * Create configured Turndown service
 */
function createTurndownService(): TurndownService {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    fence: '```',
    emDelimiter: '_',
    strongDelimiter: '**',
    linkStyle: 'inlined',
  });

  // Use GitHub Flavored Markdown plugin
  turndownService.use(gfm);

  // Custom rule for code blocks with language
  turndownService.addRule('codeblock', {
    filter: (node: Node) => {
      return (
        node.nodeName === 'PRE' &&
        node.firstChild?.nodeName === 'CODE'
      );
    },
    replacement: (_content: string, node: Node) => {
      const code = node.firstChild as HTMLElement;
      const language =
        code?.getAttribute('data-language') ||
        code?.getAttribute('class')?.replace(/^language-/, '') ||
        '';
      const text = code?.textContent || '';
      return '\n\n```' + language + '\n' + text + '\n```\n\n';
    },
  });

  // Keep certain elements
  turndownService.keep(['mark', 'kbd']);

  // Remove unwanted elements (only HTML tags, not CSS selectors)
  turndownService.remove([
    'script',
    'style',
    'iframe',
    'noscript',
    'nav',
    'footer',
    'header',
  ]);

  return turndownService;
}

/**
 * Convert HTML to Markdown
 */
export function convertToMarkdown(html: string): string {
  const turndownService = createTurndownService();
  return turndownService.turndown(html);
}

/**
 * Convert with custom title
 */
export function convertToMarkdownWithTitle(html: string, title: string, url?: string): string {
  const markdown = convertToMarkdown(html);

  let result = `# ${title}\n\n`;

  if (url) {
    result += `> Source: ${url}\n\n`;
  }

  result += markdown;

  return result;
}
