import React from 'react';
import { PromptState, CustomTags, Preset } from '../../types';
import SidebarToggleButton from './SidebarToggleButton';
import PresetManager from '../PresetManager';
import SubjectSection from '../sections/SubjectSection';
import BackgroundSection from '../sections/BackgroundSection';
import CameraSection from '../sections/CameraSection';
import OpticsSection from '../sections/OpticsSection';
import StyleSection from '../sections/StyleSection';
import ShareSection from '../sections/ShareSection';
import SettingsSection from '../sections/SettingsSection';

type ActiveTab = 'presets' | 'subject' | 'scene' | 'camera' | 'light' | 'style' | 'export' | 'settings';

interface MainContentAreaProps {
  activeTab: ActiveTab;
  state: PromptState;
  onStateChange: (state: PromptState) => void;
  customTags: CustomTags;
  onCustomTagsChange: (tags: CustomTags) => void;
  userPresets: Preset[];
  onUserPresetsChange: (presets: Preset[]) => void;
  finalPrompt: string;
  onLoadPreset?: (config: PromptState) => void;
  onImportSettings?: (tags: CustomTags, presets: Preset[]) => void;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  onNavigate?: (tab: ActiveTab) => void;
  onToggleHelp: () => void;
}

const MainContentArea: React.FC<MainContentAreaProps> = ({
  activeTab,
  state,
  onStateChange,
  customTags,
  onCustomTagsChange,
  userPresets,
  onUserPresetsChange,
  finalPrompt,
  onLoadPreset,
  onImportSettings,
  leftSidebarOpen,
  rightSidebarOpen,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onNavigate,
  onToggleHelp
}) => {
  // 步驟說明文字
  const sectionDescriptions: Record<ActiveTab, { title: string; description: string; icon: string; color: string }> = {
    presets: {
      title: '00. 藝廊預設',
      description: '從精選的專業攝影預設中選擇，快速開始你的創作。包含商品攝影、人像、美食等多種場景。',
      icon: '📁',
      color: 'blue'
    },
    subject: {
      title: '01. 定義主體',
      description: '描述你要拍攝的主體，包含物件類別、特徵和觀看角度。',
      icon: '💎',
      color: 'blue'
    },
    scene: {
      title: '02. 場景空間',
      description: '設定拍攝環境，包含背景描述、空間深度、道具和大氣效果。',
      icon: '🏙️',
      color: 'indigo'
    },
    camera: {
      title: '03. 攝影設定',
      description: '配置相機參數，包含畫面比例、取景尺度、拍攝角度、鏡頭焦距和景深效果。',
      icon: '📷',
      color: 'blue'
    },
    light: {
      title: '04. 燈光物理',
      description: '設定專業燈光系統，包含主光、補光、輪廓光的位置、顏色和強度。',
      icon: '💡',
      color: 'yellow'
    },
    style: {
      title: '05. 模擬風格',
      description: '選擇後製風格，包含底片模擬、色調處理和視覺效果。',
      icon: '🎞️',
      color: 'purple'
    },
    export: {
      title: '06. 協定導出',
      description: '查看完整的提示詞，複製並用於任何 AI 圖像生成平台。',
      icon: '⚡',
      color: 'blue'
    },
    settings: {
      title: '系統設定',
      description: '管理自定義標籤和用戶預設，匯入或匯出你的設定。',
      icon: '⚙️',
      color: 'slate'
    }
  };

  const currentSection = sectionDescriptions[activeTab];
  
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-600/20 text-blue-500 border-blue-500/30',
      indigo: 'bg-indigo-600/20 text-indigo-500 border-indigo-500/30',
      yellow: 'bg-yellow-600/20 text-yellow-500 border-yellow-500/30',
      purple: 'bg-purple-600/20 text-purple-500 border-purple-500/30',
      slate: 'bg-slate-600/20 text-slate-400 border-slate-500/30',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(circle_at_20%_20%,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent relative">
      {/* 頂部工具列 - 只在手機和平板模式顯示 */}
      <div className="xl:hidden flex items-center justify-between px-4 py-3 bg-[#080c18]/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 shadow-lg">
        <SidebarToggleButton
          side="left"
          isOpen={leftSidebarOpen}
          onClick={onToggleLeftSidebar}
          position="inline"
        />
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md overflow-hidden">
            <img src="/bubble_Icon.png" alt="泡泡龍" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-2 leading-tight">
            <div>
              <h1 className="font-bold text-[28px] tracking-wider text-white leading-none">泡泡龍</h1>
              <p className="text-[11px] text-slate-500 font-mono mt-1">PROTOCOL V2.5</p>
            </div>
            {/* 使用說明按鈕 */}
            <button
              onClick={onToggleHelp}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 transition-all text-slate-400 hover:text-white"
              title="使用說明"
            >
              <span className="text-xs font-bold">?</span>
            </button>
          </div>
        </div>
        
        <SidebarToggleButton
          side="right"
          isOpen={rightSidebarOpen}
          onClick={onToggleRightSidebar}
          position="inline"
        />
      </div>
      
      {/* 主內容區域 */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 xl:p-12 pb-32 sm:pb-36 md:pb-40 xl:pb-12 custom-scrollbar">
        {/* Section 內容 */}
        <div className="bg-[#0f172a]/40 border border-slate-800 p-6 md:p-8 xl:p-10 rounded-2xl shadow-2xl backdrop-blur-sm ring-1 ring-white/5 min-h-[600px]">
          {activeTab === 'presets' ? (
            <PresetManager 
              currentConfig={state} 
              userPresets={userPresets}
              setUserPresets={onUserPresetsChange}
              onLoadPreset={onLoadPreset || ((cfg) => onStateChange(cfg))}
              onNavigate={onNavigate}
            />
          ) : activeTab === 'subject' ? (
            <SubjectSection 
              state={state.subject} 
              customTags={customTags.subject} 
              setCustomTags={(tags) => onCustomTagsChange({...customTags, subject: tags})} 
              onChange={(sub) => onStateChange({...state, subject: sub})} 
              cameraConfig={state.camera}
            />
          ) : activeTab === 'scene' ? (
            <BackgroundSection 
              state={state.background} 
              customTags={customTags} 
              setCustomTags={onCustomTagsChange} 
              onChange={(bg) => onStateChange({...state, background: bg})} 
            />
          ) : activeTab === 'camera' ? (
            <CameraSection 
              config={state.camera} 
              opticsConfig={state.optics} 
              customTags={customTags.cameraAngle} 
              setCustomTags={(tags) => onCustomTagsChange({...customTags, cameraAngle: tags})} 
              onChange={(cam) => onStateChange({...state, camera: cam})} 
              onOpticsChange={(opt) => onStateChange({...state, optics: opt})} 
            />
          ) : activeTab === 'light' ? (
            <OpticsSection 
              config={state.optics} 
              onChange={(opt) => onStateChange({...state, optics: opt})} 
            />
          ) : activeTab === 'style' ? (
            <StyleSection 
              state={state.style} 
              customTags={customTags.style} 
              setCustomTags={(tags) => onCustomTagsChange({...customTags, style: tags})} 
              moodCustomTags={customTags.mood}
              setMoodCustomTags={(tags) => onCustomTagsChange({...customTags, mood: tags})}
              onChange={(sty) => onStateChange({...state, style: sty})} 
            />
          ) : activeTab === 'settings' ? (
            <SettingsSection 
              currentTags={customTags} 
              currentPresets={userPresets} 
              onImport={onImportSettings || ((newTags, newPresets) => {
                onCustomTagsChange(newTags);
                onUserPresetsChange(newPresets);
              })}
            />
          ) : (
            // Export tab
            <ShareSection config={state} finalPrompt={finalPrompt} onUpdate={onStateChange} />
          )}
        </div>
      </div>
    </section>
  );
};

export default MainContentArea;
