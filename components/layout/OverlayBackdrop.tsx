import React from 'react';

interface OverlayBackdropProps {
  isVisible: boolean;
  onClick: () => void;
  zIndex?: number;
}

const OverlayBackdrop: React.FC<OverlayBackdropProps> = ({
  isVisible,
  onClick,
  zIndex = 40
}) => {
  // 處理鍵盤事件（Enter 或 Space 鍵）
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label="關閉側邊欄"
      className={`
        fixed inset-0 
        bg-black/60 
        backdrop-blur-sm
        transition-opacity duration-300
        xl:hidden
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      style={{ zIndex }}
    />
  );
};

export default OverlayBackdrop;
