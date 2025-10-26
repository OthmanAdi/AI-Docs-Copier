import { useState, useEffect } from 'react';
import { isDocumentationSiteSync } from '@extension/shared/lib/docs-detector';

interface FloatingButtonProps {
  onShowMenu: () => void;
}

export function FloatingButton({ onShowMenu }: FloatingButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check if current page is a documentation site
    const detection = isDocumentationSiteSync();
    console.log('[FloatingButton] Detection result:', detection);
    console.log('[FloatingButton] Should show button:', detection.isDocsSite);
    setIsVisible(detection.isDocsSite);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={onShowMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group fixed bottom-6 right-6 z-[999999] flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl"
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
      </svg>
      <span>Copy for AI</span>
    </button>
  );
}
