import React from 'react';

type Side = 'left' | 'right';
type Position = 'inline' | 'fixed';

interface SidebarToggleButtonProps {
  side: Side;
  isOpen: boolean;
  onClick: () => void;
  position?: Position;
}

const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({
  side,
  isOpen,
  onClick,
  position = 'inline'
}) => {
  // 根據 side 決定圖示和標籤
  const icon = side === 'left' ? '☰' : '👁️';
  const label = side === 'left' 
    ? (isOpen ? '收合導航' : '展開導航')
    : (isOpen ? '收合預覽' : '展開預覽');

  // 固定定位樣式（當側邊欄收合時顯示在畫面邊緣）
  const fixedPositionClasses = position === 'fixed'
    ? side === 'left'
      ? 'fixed left-4 top-4 z-50'
      : 'fixed right-4 top-4 z-50'
    : '';

  // 內聯定位樣式（在側邊欄內部）
  const inlinePositionClasses = position === 'inline'
    ? 'relative'
    : '';

  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-expanded={isOpen}
      className={`
        ${fixedPositionClasses}
        ${inlinePositionClasses}
        min-w-[44px] min-h-[44px]
        w-12 h-12 
        bg-slate-800/80 hover:bg-slate-700 
        border border-slate-700 hover:border-slate-600
        rounded-xl 
        flex items-center justify-center
        text-2xl
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        shadow-lg hover:shadow-xl
        backdrop-blur-sm
        group
        cursor-pointer
      `}
      title={label}
    >
      <span className="group-hover:scale-110 transition-transform duration-200">
        {icon}
      </span>
    </button>
  );
};

export default SidebarToggleButton;
