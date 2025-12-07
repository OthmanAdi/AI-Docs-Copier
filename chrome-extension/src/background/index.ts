import 'webextension-polyfill';
import { initializeTrial, hasAccess } from '@extension/shared/lib/subscription';

console.log('AI Docs Copier - Background loaded');

/**
 * Allowed domains for URL opening (security whitelist)
 */
const ALLOWED_DOMAINS = [
  'chatgpt.com',
  'chat.openai.com',
  'claude.ai',
  'github.com',
  'extensionpay.com',
];

/**
 * Validate URL before opening to prevent URL injection attacks
 * Only allows HTTPS URLs from trusted domains
 */
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsed = new URL(url);

    // Only allow HTTPS protocol
    if (parsed.protocol !== 'https:') {
      return false;
    }

    // Check if domain is in allowlist
    const hostname = parsed.hostname.toLowerCase();
    return ALLOWED_DOMAINS.some(domain =>
      hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

// Initialize trial on install
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    initializeTrial();
  }

  // Create context menus
  createContextMenus();
});

/**
 * Create context menus
 */
function createContextMenus() {
  // Remove existing menus first
  chrome.contextMenus.removeAll(() => {
    // Parent menu
    chrome.contextMenus.create({
      id: 'ai-docs-copier',
      title: 'AI Docs Copier',
      contexts: ['page'],
    });

    // Copy options
    chrome.contextMenus.create({
      id: 'copy-markdown',
      parentId: 'ai-docs-copier',
      title: 'Copy as Markdown',
      contexts: ['page'],
    });

    chrome.contextMenus.create({
      id: 'copy-llms-txt',
      parentId: 'ai-docs-copier',
      title: 'Copy as llms.txt',
      contexts: ['page'],
    });

    chrome.contextMenus.create({
      id: 'copy-plain-text',
      parentId: 'ai-docs-copier',
      title: 'Copy as Plain Text',
      contexts: ['page'],
    });

    // Separator
    chrome.contextMenus.create({
      id: 'separator-1',
      parentId: 'ai-docs-copier',
      type: 'separator',
      contexts: ['page'],
    });

    // Open in AI platforms
    chrome.contextMenus.create({
      id: 'open-chatgpt',
      parentId: 'ai-docs-copier',
      title: 'Open in ChatGPT',
      contexts: ['page'],
    });

    chrome.contextMenus.create({
      id: 'open-claude',
      parentId: 'ai-docs-copier',
      title: 'Open in Claude',
      contexts: ['page'],
    });

    // Separator
    chrome.contextMenus.create({
      id: 'separator-2',
      parentId: 'ai-docs-copier',
      type: 'separator',
      contexts: ['page'],
    });

    // IDE options
    chrome.contextMenus.create({
      id: 'open-cursor',
      parentId: 'ai-docs-copier',
      title: 'Open in Cursor',
      contexts: ['page'],
    });

    chrome.contextMenus.create({
      id: 'open-vscode',
      parentId: 'ai-docs-copier',
      title: 'Open in VS Code',
      contexts: ['page'],
    });
  });
}

/**
 * Handle context menu clicks
 */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  // Check access
  const userHasAccess = await hasAccess();
  if (!userHasAccess) {
    // Show upgrade prompt
    chrome.tabs.sendMessage(tab.id, { action: 'show-upgrade-prompt' });
    return;
  }

  // Send action to content script
  chrome.tabs.sendMessage(tab.id, {
    action: info.menuItemId,
    url: info.pageUrl,
  });
});

/**
 * Handle messages from content scripts and popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
      switch (request.action) {
        case 'check-access':
          const access = await hasAccess();
          sendResponse({ hasAccess: access });
          break;

        case 'get-trial-status':
          const { checkTrialStatus } = await import('@extension/shared/lib/subscription');
          const status = await checkTrialStatus();
          sendResponse(status);
          break;

        case 'open-url':
          // Validate URL before opening to prevent URL injection
          if (isValidUrl(request.url)) {
            chrome.tabs.create({ url: request.url });
            sendResponse({ success: true });
          } else {
            console.warn('Blocked attempt to open invalid URL:', request.url);
            sendResponse({ error: 'Invalid URL' });
          }
          break;

        default:
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background error:', error);
      sendResponse({ error: (error as Error).message });
    }
  })();

  // Return true to indicate async response
  return true;
});

console.log('Context menus and listeners initialized');
