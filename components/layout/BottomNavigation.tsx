import React from 'react';

type ActiveTab = 'presets' | 'subject' | 'scene' | 'camera' | 'light' | 'style' | 'export' | 'settings';

interface BottomNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange
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
    if (!isActive) return 'text-slate-500';
    
    const colors = {
      blue: 'text-blue-500',
      indigo: 'text-indigo-500',
      yellow: 'text-yellow-500',
      purple: 'text-purple-500',
      slate: 'text-slate-400',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <nav className="h-16 border-t border-slate-800 bg-[#080c18] flex items-center justify-around px-2 fixed bottom-0 left-0 right-0 z-50 xl:hidden">
      {navItems.map(item => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`
              flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg
              transition-all duration-200 min-w-[60px]
              ${isActive ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'}
            `}
          >
            <span className={`text-2xl transition-transform ${isActive ? 'scale-110' : ''}`}>
              {item.icon}
            </span>
            <span className={`text-xs font-semibold ${getColorClasses(item.color, isActive)}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
