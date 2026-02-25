import React from 'react';

type ActiveTab = 'presets' | 'subject' | 'scene' | 'camera' | 'light' | 'style' | 'export' | 'settings';

interface TopNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onTogglePreview: () => void;
  onCopy: () => void;
  copyFeedback: boolean;
  onToggleHelp: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  onTabChange,
  onTogglePreview,
  onCopy,
  copyFeedback,
  onToggleHelp
}) => {
  const navItems: { id: ActiveTab; label: string; icon: string; color: string }[] = [
    { id: 'presets', label: '預設', icon: '📁', color: 'blue' },
    { id: 'subject', label: '主體', icon: '💎', color: 'blue' },
    { id: 'scene', label: '場景', icon: '🏙️', color: 'indigo' },
    { id: 'camera', label: '攝影', icon: '📷', color: 'blue' },
    { id: 'light', label: '燈光', icon: '💡', color: 'yellow' },
    { id: 'style', label: '風格', icon: '🎞️', color: 'purple' },
    { id: 'export', label: '導出', icon: '⚡', color: 'blue' },
    { id: 'settings', label: '設定', icon: '⚙️', color: 'slate' },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive 
        ? 'bg-blue-600 text-white border-blue-500' 
        : 'text-slate-400 hover:text-white hover:bg-blue-600/10 border-transparent',
      indigo: isActive 
        ? 'bg-indigo-600 text-white border-indigo-500' 
        : 'text-slate-400 hover:text-white hover:bg-indigo-600/10 border-transparent',
      yellow: isActive 
        ? 'bg-yellow-600 text-white border-yellow-500' 
        : 'text-slate-400 hover:text-white hover:bg-yellow-600/10 border-transparent',
      purple: isActive 
        ? 'bg-purple-600 text-white border-purple-500' 
        : 'text-slate-400 hover:text-white hover:bg-purple-600/10 border-transparent',
      slate: isActive 
        ? 'bg-slate-600 text-white border-slate-500' 
        : 'text-slate-400 hover:text-white hover:bg-slate-600/10 border-transparent',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#080c18] flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
            <img src="/bubble_Icon.png" alt="泡泡龍" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div>
              <h1 className="font-bold text-[46px] tracking-wider text-white leading-none">泡泡龍</h1>
              <p className="text-sm text-slate-500 font-mono mt-1.5">PROTOCOL V2.5</p>
            </div>
            {/* 使用說明按鈕 */}
            <button
              onClick={onToggleHelp}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 transition-all text-slate-400 hover:text-white"
              title="使用說明"
            >
              <span className="text-base font-bold">?</span>
            </button>
          </div>
        </div>
      </div>

      {/* 導航標籤 */}
      <nav className="flex items-center gap-2">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                px-4 py-2 rounded-lg font-semibold text-sm
                border transition-all duration-200
                flex items-center gap-2
                ${getColorClasses(item.color, isActive)}
              `}
              title={item.label}
            >
              <span className="text-base">{item.icon}</span>
              <span className="hidden xl:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 右側操作 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePreview}
          className="px-4 py-2 rounded-lg font-semibold text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-slate-600 transition-all"
        >
          <span className="hidden md:inline">預覽</span>
          <span className="md:hidden">👁️</span>
        </button>
        <button
          onClick={onCopy}
          className="px-4 py-2 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-500 border border-blue-500 transition-all"
        >
          {copyFeedback ? '✓ 已複製' : '複製'}
        </button>
      </div>
    </header>
  );
};

export default TopNavigation;
