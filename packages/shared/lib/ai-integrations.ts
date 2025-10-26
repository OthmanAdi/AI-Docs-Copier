/**
 * AI Platform Integrations
 * ChatGPT, Claude, Cursor, VS Code
 */

/**
 * Open URL in ChatGPT with pre-filled prompt
 */
export function openInChatGPT(url: string): string {
  const prompt = encodeURIComponent(
    `Read from ${url} so I can ask questions about it.`
  );
  return `https://chatgpt.com/?model=gpt-4o&q=${prompt}`;
}

/**
 * Open content in ChatGPT with inline content
 */
export function openInChatGPTWithContent(markdown: string, url: string): string {
  const prompt = encodeURIComponent(
    `Here is documentation from ${url}:\n\n${markdown}\n\nI have questions about this documentation.`
  );
  return `https://chatgpt.com/?q=${prompt}`;
}

/**
 * Open URL in Claude with pre-filled prompt
 */
export function openInClaude(url: string): string {
  const prompt = encodeURIComponent(
    `Read from ${url} so I can ask questions about it.`
  );
  return `https://claude.ai/new?q=${prompt}`;
}

/**
 * Open content in Claude with inline content
 */
export function openInClaudeWithContent(markdown: string, url: string): string {
  const prompt = encodeURIComponent(
    `Here is documentation from ${url}:\n\n${markdown}\n\nI have questions about this documentation.`
  );
  return `https://claude.ai/new?q=${prompt}`;
}

/**
 * Generate Cursor deeplink for file
 */
export function getCursorDeeplink(filepath: string): string {
  return `cursor://file/${encodeURIComponent(filepath)}?windowId=_blank`;
}

/**
 * Generate Cursor MCP install deeplink
 */
export function getCursorMCPInstallLink(serverName: string, config: any): string {
  const configBase64 = btoa(JSON.stringify(config));
  return `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodeURIComponent(serverName)}&config=${encodeURIComponent(configBase64)}`;
}

/**
 * Generate VS Code deeplink for file
 */
export function getVSCodeDeeplink(filepath: string): string {
  return `vscode://file/${encodeURIComponent(filepath)}?windowId=_blank`;
}

/**
 * Copy to clipboard helper
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textArea);
    }
  }
}
