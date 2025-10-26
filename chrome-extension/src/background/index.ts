import 'webextension-polyfill';
import { initializeTrial, hasAccess } from '@extension/shared/lib/subscription';

console.log('AI Docs Copier - Background loaded');

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
          chrome.tabs.create({ url: request.url });
          sendResponse({ success: true });
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
