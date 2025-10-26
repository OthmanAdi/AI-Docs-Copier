/**
 * llms.txt Format Generator
 * Generates llms.txt and llms-full.txt formats
 */

import { convertToMarkdown } from './markdown-converter.js';

export interface LlmsTxtLink {
  title: string;
  url: string;
  description?: string;
}

export interface LlmsTxtSection {
  title: string;
  links: LlmsTxtLink[];
}

export interface LlmsTxtData {
  projectName: string;
  summary?: string;
  description?: string;
  sections: LlmsTxtSection[];
}

/**
 * Generate llms.txt format from structured data
 */
export function generateLlmsTxt(data: LlmsTxtData): string {
  let output = `# ${data.projectName}\n\n`;

  // Add summary blockquote if provided
  if (data.summary) {
    output += `> ${data.summary}\n\n`;
  }

  // Add description paragraphs if provided
  if (data.description) {
    output += `${data.description}\n\n`;
  }

  // Add sections with links
  for (const section of data.sections) {
    output += `## ${section.title}\n\n`;

    for (const link of section.links) {
      if (link.description) {
        output += `- [${link.title}](${link.url}): ${link.description}\n`;
      } else {
        output += `- [${link.title}](${link.url})\n`;
      }
    }

    output += '\n';
  }

  return output.trim() + '\n';
}

/**
 * Generate llms.txt from current page
 */
export function generateLlmsTxtFromPage(
  title: string = document.title,
  url: string = window.location.href
): string {
  // Extract all links from the page
  const links: LlmsTxtLink[] = [];

  // Find main content links
  const contentLinks = document.querySelectorAll('main a, article a, [role="main"] a, .markdown-body a, .doc-content a');

  const seenUrls = new Set<string>();

  contentLinks.forEach(anchor => {
    const a = anchor as HTMLAnchorElement;
    const linkUrl = a.href;
    const linkText = a.textContent?.trim() || '';

    // Skip empty links, anchors, and duplicates
    if (!linkUrl || linkUrl.startsWith('#') || linkUrl === url || seenUrls.has(linkUrl)) {
      return;
    }

    // Only include links from the same domain
    try {
      const currentDomain = new URL(url).hostname;
      const linkDomain = new URL(linkUrl).hostname;

      if (linkDomain === currentDomain && linkText) {
        seenUrls.add(linkUrl);
        links.push({
          title: linkText,
          url: linkUrl,
        });
      }
    } catch {
      // Invalid URL, skip
    }
  });

  const data: LlmsTxtData = {
    projectName: title,
    summary: document.querySelector('meta[name="description"]')?.getAttribute('content') || undefined,
    sections: [
      {
        title: 'Documentation',
        links: links.slice(0, 50), // Limit to first 50 links
      },
    ],
  };

  return generateLlmsTxt(data);
}

/**
 * Generate llms-full.txt (complete documentation in one file)
 */
export function generateLlmsFullTxt(
  title: string,
  content: string,
  url: string
): string {
  let output = `# ${title}\n\n`;
  output += `> Source: ${url}\n\n`;
  output += content;

  return output;
}

/**
 * Check if site already has llms.txt
 */
export async function fetchExistingLlmsTxt(): Promise<string | null> {
  try {
    const response = await fetch('/llms.txt');
    if (response.ok) {
      return await response.text();
    }
  } catch {
    // File doesn't exist
  }
  return null;
}
