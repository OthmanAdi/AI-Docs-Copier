import { useState, useEffect } from 'react';
import { FloatingButton } from '../../components/FloatingButton';
import { ExportMenu } from '../../components/ExportMenu';
import { UpgradeModal } from '../../components/UpgradeModal';

export default function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    console.log('[AI Docs Copier] Content UI loaded');

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'show-upgrade-prompt') {
        setShowUpgrade(true);
        sendResponse({ received: true });
      } else if (request.action?.startsWith('copy-') || request.action?.startsWith('open-')) {
        // Handle context menu actions
        setShowMenu(true);
        sendResponse({ received: true });
      }
      return true;
    });
  }, []);

  const handleUpgrade = (plan: 'monthly' | 'yearly') => {
    // TODO: Integrate with ExtensionPay
    console.log('Upgrade to:', plan);
    // For now, open a placeholder URL
    window.open('https://extensionpay.com', '_blank');
    setShowUpgrade(false);
  };

  return (
    <>
      <FloatingButton onShowMenu={() => setShowMenu(true)} />

      {showMenu && <ExportMenu onClose={() => setShowMenu(false)} />}

      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          onUpgrade={handleUpgrade}
        />
      )}
    </>
  );
}
