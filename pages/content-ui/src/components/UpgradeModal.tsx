interface UpgradeModalProps {
  onClose: () => void;
  onUpgrade: (plan: 'monthly' | 'yearly') => void;
}

export function UpgradeModal({ onClose, onUpgrade }: UpgradeModalProps) {
  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-[500px] rounded-2xl bg-white p-8 shadow-2xl"
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

        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>

          <h2 className="mb-2 text-2xl font-bold text-gray-900">Trial Ended</h2>
          <p className="mb-6 text-gray-600">
            Thanks for trying AI Docs Copier! Upgrade to continue using all features.
          </p>

          <div className="mb-6 space-y-3 text-left">
            <div className="flex items-center gap-3 text-gray-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Unlimited conversions to Markdown, llms.txt, and plain text</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Direct integration with ChatGPT and Claude</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Cursor and VS Code deeplink support</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>MCP server detection and integration</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-indigo-300">
              <div className="mb-2 text-sm font-medium text-gray-600">Monthly</div>
              <div className="mb-3 text-3xl font-bold text-gray-900">$5</div>
              <button
                onClick={() => onUpgrade('monthly')}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Subscribe
              </button>
            </div>

            <div className="relative rounded-xl border-2 border-indigo-600 p-4 transition-all">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white">
                Best Value
              </div>
              <div className="mb-2 text-sm font-medium text-gray-600">Yearly</div>
              <div className="mb-1 text-3xl font-bold text-gray-900">$50</div>
              <div className="mb-3 text-xs text-green-600">Save $10</div>
              <button
                onClick={() => onUpgrade('yearly')}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Subscribe
              </button>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            All prices in USD. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
