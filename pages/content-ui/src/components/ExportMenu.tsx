import { useState } from 'react';
import { extractContent } from '@extension/shared/lib/content-extractor';
import { convertToMarkdownWithTitle } from '@extension/shared/lib/markdown-converter';
import { generateLlmsTxtFromPage, generateLlmsFullTxt, fetchExistingLlmsTxt } from '@extension/shared/lib/llms-txt-generator';
import { copyToClipboard, openInChatGPT, openInClaude } from '@extension/shared/lib/ai-integrations';
import { findMCPForCurrentSite } from '@extension/shared/lib/mcp-registry';

interface ExportMenuProps {
  onClose: () => void;
}

export function ExportMenu({ onClose }: ExportMenuProps) {
  const [copied, setCopied] = useState('');
  const [loading, setLoading] = useState(false);
  const [mcpServers, setMcpServers] = useState<any[]>([]);

  const showCopiedFeedback = (format: string) => {
    setCopied(format);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleCopyMarkdown = async () => {
    setLoading(true);
    try {
      const content = extractContent();
      const markdown = convertToMarkdownWithTitle(content.content, content.title, window.location.href);
      await copyToClipboard(markdown);
      showCopiedFeedback('markdown');
    } catch (error) {
      console.error('Error copying markdown:', error);
      alert('Error copying markdown. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLlmsTxt = async () => {
    setLoading(true);
    try {
      // Check for existing llms.txt first
      const existing = await fetchExistingLlmsTxt();
      if (existing) {
        await copyToClipboard(existing);
        showCopiedFeedback('llms.txt');
      } else {
        // Generate new llms.txt
        const llmsTxt = generateLlmsTxtFromPage();
        await copyToClipboard(llmsTxt);
        showCopiedFeedback('llms.txt');
      }
    } catch (error) {
      console.error('Error copying llms.txt:', error);
      alert('Error copying llms.txt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPlainText = async () => {
    setLoading(true);
    try {
      const content = extractContent();
      await copyToClipboard(content.textContent);
      showCopiedFeedback('text');
    } catch (error) {
      console.error('Error copying plain text:', error);
      alert('Error copying text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInChatGPT = () => {
    const url = openInChatGPT(window.location.href);
    window.open(url, '_blank');
    onClose();
  };

  const handleOpenInClaude = () => {
    const url = openInClaude(window.location.href);
    window.open(url, '_blank');
    onClose();
  };

  const handleFindMCP = async () => {
    setLoading(true);
    try {
      const servers = await findMCPForCurrentSite();
      setMcpServers(servers);
    } catch (error) {
      console.error('Error finding MCP servers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999998] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-96 rounded-2xl bg-white p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="mb-4 text-xl font-bold text-gray-900">Export Documentation</h2>

        <div className="space-y-2">
          {/* Copy Options */}
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Copy As</h3>
            <button
              onClick={handleCopyMarkdown}
              disabled={loading}
              className="mb-2 flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-gray-800 transition-all hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="flex-1 font-medium">Markdown</span>
              {copied === 'markdown' && <span className="text-sm text-green-600">Copied!</span>}
            </button>

            <button
              onClick={handleCopyLlmsTxt}
              disabled={loading}
              className="mb-2 flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-gray-800 transition-all hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </svg>
              <span className="flex-1 font-medium">llms.txt</span>
              {copied === 'llms.txt' && <span className="text-sm text-green-600">Copied!</span>}
            </button>

            <button
              onClick={handleCopyPlainText}
              disabled={loading}
              className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-gray-800 transition-all hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
              <span className="flex-1 font-medium">Plain Text</span>
              {copied === 'text' && <span className="text-sm text-green-600">Copied!</span>}
            </button>
          </div>

          {/* AI Platforms */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Open In</h3>
            <button
              onClick={handleOpenInChatGPT}
              className="mb-2 flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-gray-800 transition-all hover:border-indigo-300 hover:bg-indigo-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
              </svg>
              <span className="flex-1 font-medium">ChatGPT</span>
            </button>

            <button
              onClick={handleOpenInClaude}
              className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-gray-800 transition-all hover:border-indigo-300 hover:bg-indigo-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.3 2.5L20 12l-3.7 9.5h-8.6L4 12l3.7-9.5h8.6z" />
              </svg>
              <span className="flex-1 font-medium">Claude</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
