import React from 'react';

type ActiveTab = 'presets' | 'subject' | 'scene' | 'camera' | 'light' | 'style' | 'export' | 'settings';

interface FloatingNavButtonsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  hasContent: boolean; // 是否有填寫內容
}

const FloatingNavButtons: React.FC<FloatingNavButtonsProps> = ({
  activeTab,
  onTabChange,
  hasContent
}) => {
  // 定義步驟順序
  const tabOrder: ActiveTab[] = ['presets', 'subject', 'scene', 'camera', 'light', 'style', 'export'];
  
  const currentIndex = tabOrder.indexOf(activeTab);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < tabOrder.length - 1;
  
  const previousTab = hasPrevious ? tabOrder[currentIndex - 1] : null;
  const nextTab = hasNext ? tabOrder[currentIndex + 1] : null;

  // 步驟名稱對應
  const stepNames: Record<ActiveTab, string> = {
    'presets': '藝廊預設',
    'subject': '定義主體',
    'scene': '場景空間',
    'camera': '攝影設定',
    'light': '燈光物理',
    'style': '模擬風格',
    'export': '協定導出',
    'settings': '系統設定'
  };

  // 步驟編號對應
  const stepNumbers: Record<ActiveTab, string> = {
    'presets': '00',
    'subject': '01',
    'scene': '02',
    'camera': '03',
    'light': '04',
    'style': '05',
    'export': '06',
    'settings': 'SET'
  };

  // 主題顏色對應
  const getThemeColor = (tab: ActiveTab) => {
    const colors: Record<ActiveTab, { from: string; to: string }> = {
      'presets': { from: '#60a5fa', to: '#2563eb' },
      'subject': { from: '#34d399', to: '#059669' },
      'scene': { from: '#818cf8', to: '#4f46e5' },
      'camera': { from: '#38bdf8', to: '#0284c7' },
      'light': { from: '#fbbf24', to: '#d97706' },
      'style': { from: '#c084fc', to: '#9333ea' },
      'export': { from: '#4ade80', to: '#16a34a' },
      'settings': { from: '#94a3b8', to: '#475569' }
    };
    return colors[tab];
  };

  // Settings 頁面不顯示導航按鈕
  if (activeTab === 'settings') {
    return null;
  }

  // 下一步按鈕只在有內容或在 presets 頁面時顯示
  const showNext = hasNext && nextTab && (hasContent || activeTab === 'presets');

  return (
    <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080c18] border-t border-slate-800 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 flex items-center justify-between gap-4 sm:gap-6">
      {/* 上一步按鈕 */}
      {hasPrevious && previousTab ? (
        <button
          onClick={() => onTabChange(previousTab)}
          className="flex items-center gap-3 sm:gap-4 px-5 sm:px-7 md:px-8 py-3 sm:py-4 md:py-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg sm:rounded-xl transition-all active:scale-95 min-w-[140px] sm:min-w-[180px] md:min-w-[200px]"
        >
          <span className="text-white text-xl sm:text-2xl md:text-3xl">←</span>
          <div className="flex flex-col items-start">
            <span className="text-[10px] sm:text-[12px] md:text-[13px] text-slate-500 font-bold uppercase tracking-wider">上一步</span>
            <span className="text-[13px] sm:text-[16px] md:text-[17px] text-white font-black">{stepNumbers[previousTab]} {stepNames[previousTab]}</span>
          </div>
        </button>
      ) : (
        <div className="min-w-[140px] sm:min-w-[180px] md:min-w-[200px]"></div>
      )}

      {/* 下一步按鈕 */}
      {showNext ? (
        <button
          onClick={() => onTabChange(nextTab)}
          className="flex items-center gap-3 sm:gap-4 px-5 sm:px-7 md:px-8 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl transition-all active:scale-95 shadow-lg min-w-[140px] sm:min-w-[180px] md:min-w-[200px] justify-end"
          style={{
            background: `linear-gradient(to right, ${getThemeColor(nextTab).from}, ${getThemeColor(nextTab).to})`
          }}
        >
          <div className="flex flex-col items-end">
            <span className="text-[10px] sm:text-[12px] md:text-[13px] text-white/80 font-bold uppercase tracking-wider">下一步</span>
            <span className="text-[13px] sm:text-[16px] md:text-[17px] text-white font-black">{stepNumbers[nextTab]} {stepNames[nextTab]}</span>
          </div>
          <span className="text-white text-xl sm:text-2xl md:text-3xl">→</span>
        </button>
      ) : (
        <div className="min-w-[140px] sm:min-w-[180px] md:min-w-[200px]"></div>
      )}
    </nav>
  );
};

export default FloatingNavButtons;
