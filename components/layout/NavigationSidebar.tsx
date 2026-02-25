import React from 'react';
import SidebarToggleButton from './SidebarToggleButton';

type ActiveTab = 'presets' | 'subject' | 'scene' | 'camera' | 'light' | 'style' | 'export' | 'settings';

interface NavigationSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isOpen: boolean;
  onToggle: () => void;
  onToggleHelp: () => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  onTabChange,
  isOpen,
  onToggle,
  onToggleHelp
}) => {
  const navItems: { id: ActiveTab; label: string; icon: string; step: string }[] = [
    { id: 'presets', label: '藝廊預設', icon: '📁', step: '00' },
    { id: 'subject', label: '主體細節', icon: '💎', step: '01' },
    { id: 'scene', label: '場景空間', icon: '🏙️', step: '02' },
    { id: 'camera', label: '攝影設定', icon: '📷', step: '03' },
    { id: 'light', label: '燈光物理', icon: '💡', step: '04' },
    { id: 'style', label: '模擬風格', icon: '🎞️', step: '05' },
    { id: 'export', label: '協定導出', icon: '⚡', step: '06' },
    { id: 'settings', label: '系統設定', icon: '⚙️', step: 'SET' },
  ];

  return (
    <aside className={`
      w-64 md:w-80 
      bg-[#080c18] 
      border-r border-slate-800 
      flex flex-col 
      z-[60] 
      shadow-2xl
      transition-all duration-300 ease-in-out
      fixed xl:relative
      h-full
      ${isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
    `}>
      <div className="p-6 md:p-8 border-b border-slate-800 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
            <img src="/bubble_Icon.png" alt="泡泡龍" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div>
              <h1 className="font-bold text-[18px] tracking-wider text-white leading-none">泡泡龍</h1>
              <p className="text-[10px] text-slate-500 font-mono mt-1">PROTOCOL V2.5</p>
            </div>
            {/* 使用說明按鈕 */}
            <button
              onClick={onToggleHelp}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 transition-all text-slate-400 hover:text-white"
              title="使用說明"
            >
              <span className="text-xs font-bold">?</span>
            </button>
          </div>
        </div>
        {/* 關閉按鈕 - 只在手機和平板模式下顯示 */}
        <button
          onClick={onToggle}
          className="xl:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all"
          aria-label="關閉導航面板"
        >
          <span className="text-xl">✕</span>
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto custom-scrollbar py-4 relative">
        <div className="absolute left-12 top-0 bottom-0 w-px bg-slate-800/50 hidden md:block" />
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex flex-col md:flex-row items-center md:gap-6 px-6 md:px-8 py-6 md:py-7 transition-all group relative border-b border-white/[0.01] ${
              activeTab === item.id ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
            }`}
          >
            <span className={`text-4xl md:text-5xl font-bold font-mono tracking-tighter transition-all z-10 ${
              activeTab === item.id ? 'text-blue-500 scale-110 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'text-slate-500 opacity-60 group-hover:opacity-100 group-hover:text-slate-300'
            }`}>
              {item.step}
            </span>
            {/* 手機模式：顯示在數字下方 */}
            <div className="flex md:hidden flex-col items-center text-center z-10 mt-2">
              <span className={`font-bold text-sm uppercase tracking-wide ${activeTab === item.id ? 'text-white' : 'text-slate-300'}`}>
                {item.label}
              </span>
            </div>
            {/* 平板/桌面模式：顯示在數字右側 */}
            <div className="hidden md:flex flex-col items-start text-left z-10">
              <span className={`font-bold text-base uppercase tracking-wide ${activeTab === item.id ? 'text-white' : 'text-slate-300'}`}>
                {item.label}
              </span>
              <span className={`text-xs font-mono transition-opacity uppercase ${
                activeTab === item.id ? 'text-blue-400 opacity-70' : 'text-slate-500 opacity-50 group-hover:opacity-80 group-hover:text-slate-400'
              }`}>
                {item.id}
              </span>
            </div>
            {activeTab === item.id && (
              <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default NavigationSidebar;
